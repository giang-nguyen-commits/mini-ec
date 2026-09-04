"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { CartItem, OrderItemSnapshot, PlaceOrderResult } from "@/lib/types";

function trimField(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function parseItems(raw: unknown): CartItem[] {
  if (typeof raw !== "string") {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item) =>
        typeof item?.productId === "string" &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0,
    );
  } catch {
    return [];
  }
}

export async function placeOrder(
  _prev: PlaceOrderResult | null,
  formData: FormData,
): Promise<PlaceOrderResult> {
  const customerName = trimField(formData.get("customerName"));
  const phone = trimField(formData.get("phone"));
  const address = trimField(formData.get("address"));
  const items = parseItems(formData.get("items"));

  if (customerName.length < 2) {
    return { ok: false, message: "お名前を入力してください。" };
  }

  if (!/^[0-9+\s()-]{8,15}$/.test(phone)) {
    return { ok: false, message: "電話番号の形式が正しくありません。" };
  }

  if (address.length < 5) {
    return { ok: false, message: "住所を入力してください。" };
  }

  if (items.length === 0) {
    return { ok: false, message: "カートが空です。" };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const ids = [...new Set(items.map((item) => item.productId))];
  const { data: products, error: productError } = await supabase
    .from("products")
    .select("id, name, price, stock")
    .in("id", ids);

  if (productError || !products) {
    return { ok: false, message: "在庫を確認できませんでした。時間をおいて再度お試しください。" };
  }

  const productMap = new Map(products.map((product) => [product.id, product]));
  const snapshots: OrderItemSnapshot[] = [];

  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) {
      return { ok: false, message: "カート内の商品が販売終了になっています。" };
    }

    if (product.stock <= 0) {
      continue;
    }

    const quantity = Math.min(item.quantity, product.stock);
    snapshots.push({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      line_total: product.price * quantity,
    });
  }

  if (snapshots.length === 0) {
    return { ok: false, message: "在庫のある商品がありません。" };
  }

  const total = snapshots.reduce((sum, item) => sum + item.line_total, 0);
  const orderId = crypto.randomUUID();

  const { error: insertError } = await supabase.from("orders").insert({
    id: orderId,
    customer_name: customerName,
    phone,
    address,
    total,
    items: snapshots,
    user_id: user?.id ?? null,
  });

  if (insertError) {
    return { ok: false, message: "注文を保存できませんでした。時間をおいて再度お試しください。" };
  }

  return { ok: true, orderId, total };
}
