import { NextResponse } from "next/server";
import { getBaseUrl, getStripe } from "@/lib/stripe";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { CartItem } from "@/lib/types";

export const runtime = "nodejs";

type CheckoutBody = {
  orderId?: unknown;
  items?: unknown;
};

function parseItems(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw.filter(
    (item): item is CartItem =>
      typeof item?.productId === "string" &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0,
  );
}

export async function POST(request: Request) {
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
  const items = parseItems(body.items);

  if (!orderId) {
    return NextResponse.json({ message: "orderId が必要です。" }, { status: 400 });
  }

  if (items.length === 0) {
    return NextResponse.json({ message: "カートが空です。" }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();
  const ids = [...new Set(items.map((item) => item.productId))];
  const { data: products, error: productError } = await supabase
    .from("products")
    .select("id, name, price, stock, image_url")
    .in("id", ids);

  if (productError || !products) {
    return NextResponse.json(
      { message: "商品情報を取得できませんでした。" },
      { status: 500 },
    );
  }

  const productMap = new Map(products.map((product) => [product.id, product]));
  const lineItems: {
    price_data: {
      currency: "jpy";
      product_data: { name: string; images?: string[] };
      unit_amount: number;
    };
    quantity: number;
  }[] = [];

  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product || product.stock <= 0) {
      continue;
    }

    const quantity = Math.min(item.quantity, product.stock);
    const images = product.image_url ? [product.image_url] : undefined;

    lineItems.push({
      price_data: {
        currency: "jpy",
        product_data: {
          name: product.name,
          ...(images ? { images } : {}),
        },
        unit_amount: product.price,
      },
      quantity,
    });
  }

  if (lineItems.length === 0) {
    return NextResponse.json(
      { message: "在庫のある商品がありません。" },
      { status: 400 },
    );
  }

  try {
    const stripe = getStripe();
    const baseUrl = getBaseUrl();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "ja",
      line_items: lineItems,
      success_url: `${baseUrl}/checkout/success?orderId=${encodeURIComponent(orderId)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout?canceled=1`,
      metadata: {
        orderId,
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { message: "Checkout URL を作成できませんでした。" },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url, orderId });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Checkout セッションを作成できませんでした。";
    return NextResponse.json({ message }, { status: 500 });
  }
}
