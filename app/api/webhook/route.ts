import { NextResponse } from "next/server";
import type Stripe from "stripe";
import {
  cancelPendingOrder,
  fulfillPaidSession,
} from "@/lib/order-lifecycle";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { message: "stripe-signature ヘッダーがありません。" },
      { status: 400 },
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { message: "STRIPE_WEBHOOK_SECRET が未設定です。" },
      { status: 500 },
    );
  }

  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "署名の検証に失敗しました。";
    return NextResponse.json({ message }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const result = await fulfillPaidSession(session);
      if (!result.ok) {
        const ignore =
          result.reason === "missing_order" ||
          result.reason === "not_paid" ||
          result.reason === "canceled";
        if (ignore) {
          return NextResponse.json({ received: true, ignored: result.reason });
        }
        return NextResponse.json(
          { message: "注文ステータスを更新できませんでした。" },
          { status: 500 },
        );
      }
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId ?? session.metadata?.order_id;
      if (orderId) {
        await cancelPendingOrder(orderId);
      }
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "注文の更新に失敗しました。";
    return NextResponse.json({ message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
