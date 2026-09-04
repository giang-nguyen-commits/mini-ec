"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useState } from "react";
import { placeOrder } from "@/app/actions/place-order";
import { useCart } from "@/components/cart-provider";
import { buildCartLines, cartTotal, payableLines } from "@/lib/checkout";
import { formatPrice } from "@/lib/format";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import type { PlaceOrderResult, Product } from "@/lib/types";

const initialState: PlaceOrderResult | null = null;

export function CheckoutForm() {
  const { items, clear } = useCart();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [state, action, pending] = useActionState(placeOrder, initialState);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    void supabase
      .from("products")
      .select("id, name, price, stock, description, image_url, created_at")
      .then(({ data }) => setProducts(data ?? []));
  }, []);

  useEffect(() => {
    if (state?.ok) {
      clear();
    }
  }, [clear, state]);

  const lines = useMemo(() => {
    if (!products) {
      return [];
    }
    return payableLines(buildCartLines(items, products).lines);
  }, [items, products]);

  const total = cartTotal(lines);

  if (state?.ok) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white px-6 py-16 text-center">
        <p className="text-base font-semibold text-zinc-900">
          ご注文が完了しました
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          注文番号: {state.orderId.slice(0, 8)} · {formatPrice(state.total)}
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
        >
          商品一覧へ戻る
        </Link>
      </div>
    );
  }

  if (!products) {
    return (
      <div
        className="h-64 animate-pulse rounded-xl border border-zinc-200 bg-white"
        role="status"
        aria-label="注文を読み込み中"
      />
    );
  }

  if (lines.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
        <p className="font-medium text-zinc-900">ご注文できる商品がありません</p>
        <Link
          href="/products"
          className="mt-6 inline-flex rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
        >
          商品を見る
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-6">
      <input
        type="hidden"
        name="items"
        value={JSON.stringify(
          lines.map((line) => ({
            productId: line.productId,
            quantity: line.quantity,
          })),
        )}
      />

      <section className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-zinc-900">注文内容</h2>
        <ul className="mt-3 divide-y divide-zinc-100">
          {lines.map((line) => (
            <li
              key={line.productId}
              className="flex items-start justify-between gap-3 py-2 text-sm"
            >
              <span className="text-zinc-700">
                {line.product.name}
                <span className="text-zinc-400"> × {line.quantity}</span>
              </span>
          <span className="font-medium text-amber-price">{formatPrice(line.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-zinc-200 pt-3 text-base font-semibold">
          <span>合計</span>
          <span className="text-amber-price">{formatPrice(total)}</span>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-zinc-900">
          お届け先
        </h2>
        <Field label="お名前" name="customerName" autoComplete="name" required />
        <Field
          label="電話番号"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
        />
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-zinc-800">
            住所
          </span>
          <textarea
            name="address"
            required
            minLength={5}
            rows={3}
            autoComplete="street-address"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-forest"
          />
        </label>
      </section>

      {state && !state.ok ? (
        <p className="text-sm text-red-600" role="alert">
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending || lines.length === 0}
        className="h-11 w-full rounded-xl bg-forest text-sm font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
      >
        {pending ? "送信中..." : "注文を確定する"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-zinc-800">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="h-11 w-full rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-forest"
      />
    </label>
  );
}
