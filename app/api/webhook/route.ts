import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

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

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.orderId ?? session.metadata?.order_id;

  if (!orderId) {
    return NextResponse.json(
      { message: "metadata に orderId がありません。" },
      { status: 400 },
    );
  }

  try {
    const supabase = createAdminSupabaseClient();
    const { error } = await supabase
      .from("orders")
      .update({ status: "paid" })
      .eq("id", orderId);

    if (error) {
      return NextResponse.json(
        { message: "注文ステータスを更新できませんでした。" },
        { status: 500 },
      );
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "注文の更新に失敗しました。";
    return NextResponse.json({ message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
