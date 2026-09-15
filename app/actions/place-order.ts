"use server";

import { reserveStockAndCreateOrder } from "@/lib/order-lifecycle";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { CartItem, PlaceOrderResult } from "@/lib/types";

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

  if (!user) {
    return { ok: false, message: "ログインしてからお進みください。" };
  }

  return reserveStockAndCreateOrder({
    userId: user.id,
    customerName,
    phone,
    address,
    items,
  });
}
