import { NextResponse } from "next/server";
import {
  getOrderById,
  saveStripeSessionId,
} from "@/lib/order-lifecycle";
import { getBaseUrl, getStripe } from "@/lib/stripe";
import { getAuthUser } from "@/lib/supabase/server";

export const runtime = "nodejs";

type CheckoutBody = {
  orderId?: unknown;
};

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json(
      { message: "ログインしてからお進みください。" },
      { status: 401 },
    );
  }

  let body: CheckoutBody;
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json(
      { message: "リクエストの形式が正しくありません。" },
      { status: 400 },
    );
  }

  const orderId = typeof body.orderId === "string" ? body.orderId.trim() : "";
  if (!orderId) {
    return NextResponse.json({ message: "orderId が必要です。" }, { status: 400 });
  }

  const order = await getOrderById(orderId);
  if (!order || order.user_id !== user.id) {
    return NextResponse.json(
      { message: "注文が見つかりません。" },
      { status: 404 },
    );
  }

  if (order.status === "paid") {
    return NextResponse.json(
      { message: "この注文は支払い済みです。" },
      { status: 409 },
    );
  }

  if (order.status !== "pending" || order.items.length === 0) {
    return NextResponse.json(
      { message: "この注文はお支払いできません。" },
      { status: 409 },
    );
  }

  const stripe = getStripe();
  if (order.stripe_session_id) {
    try {
      const existing = await stripe.checkout.sessions.retrieve(order.stripe_session_id);
      if (existing.payment_status === "paid") {
        return NextResponse.json(
          { message: "この注文は支払い済みです。" },
          { status: 409 },
        );
      }
      if (existing.status === "open") {
        await stripe.checkout.sessions.expire(existing.id);
      }
    } catch {
      // Previous session is gone; create a new one.
    }
  }

  const lineItems = order.items.map((item) => ({
    price_data: {
      currency: "jpy" as const,
      product_data: { name: item.name },
      unit_amount: item.price,
    },
    quantity: item.quantity,
  }));

  try {
    const baseUrl = getBaseUrl();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "ja",
      line_items: lineItems,
      success_url: `${baseUrl}/checkout/success?orderId=${encodeURIComponent(orderId)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout?canceled=1&orderId=${encodeURIComponent(orderId)}&session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        orderId,
      },
      client_reference_id: orderId,
    });

    if (!session.url) {
      return NextResponse.json(
        { message: "Checkout URL を作成できませんでした。" },
        { status: 500 },
      );
    }

    await saveStripeSessionId(orderId, session.id);
    return NextResponse.json({ url: session.url, orderId });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Checkout セッションを作成できませんでした。";
    return NextResponse.json({ message }, { status: 500 });
  }
}
