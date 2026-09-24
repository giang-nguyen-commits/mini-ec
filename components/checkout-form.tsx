"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { placeOrder } from "@/app/actions/place-order";
import { useCart } from "@/components/cart-provider";
import { buildCartLines, cartTotal, payableLines } from "@/lib/checkout";
import { formatPrice } from "@/lib/format";
import {
  persistProfile,
  readProfile,
  type CustomerProfile,
} from "@/lib/profile";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import type { PlaceOrderResult, Product } from "@/lib/types";

const initialState: PlaceOrderResult | null = null;

export function CheckoutForm() {
  const { items } = useCart();
  const searchParams = useSearchParams();
  const canceled = searchParams.get("canceled") === "1";
  const [products, setProducts] = useState<Product[] | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [state, action, pending] = useActionState(placeOrder, initialState);
  const [payError, setPayError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const checkoutStartedRef = useRef(false);

  useEffect(() => {
    setProfile(readProfile());
    const supabase = getSupabaseBrowserClient();
    void supabase
      .from("products")
      .select("id, name, price, stock, description, image_url, created_at")
      .then(({ data }) => setProducts((data as Product[] | null) ?? []));
  }, []);

  const lines = useMemo(() => {
    if (!products) {
      return [];
    }
    return payableLines(buildCartLines(items, products).lines);
  }, [items, products]);

  async function startStripeCheckout(orderId: string) {
    setPayError(null);
    setRedirecting(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
        }),
      });
      const data = (await response.json()) as { url?: string; message?: string };
      if (!response.ok || !data.url) {
        throw new Error(data.message ?? "決済画面を開けませんでした。");
      }
      window.location.assign(data.url);
    } catch (error) {
      setRedirecting(false);
      setPayError(
        error instanceof Error ? error.message : "決済画面を開けませんでした。",
      );
    }
  }

  useEffect(() => {
    if (!state?.ok || checkoutStartedRef.current) {
      return;
    }

    checkoutStartedRef.current = true;
    void startStripeCheckout(state.orderId);
  }, [state]);

  const total = cartTotal(lines);

  if (state?.ok) {
    return (
      <div className="rounded-xl border border-border bg-surface px-6 py-16 text-center">
        <p className="text-base font-semibold text-foreground">
          {redirecting
            ? "決済画面へ移動しています..."
            : "注文を保存しました"}
        </p>
        <p className="mt-2 text-sm text-foreground-muted">
          注文番号: {state.orderId.slice(0, 8)} · {formatPrice(state.total)}
        </p>
        {payError ? (
          <>
            <p className="mt-4 text-sm text-red-600" role="alert">
              {payError}
            </p>
            <button
              type="button"
              onClick={() => {
                checkoutStartedRef.current = true;
                void startStripeCheckout(state.orderId);
              }}
              className="mt-6 inline-flex rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-white hover:bg-forest-strong"
            >
              決済を再試行する
            </button>
          </>
        ) : null}
      </div>
    );
  }

  if (!products || !profile) {
    return (
      <div
        className="h-64 animate-pulse rounded-xl border border-border bg-surface"
        role="status"
        aria-label="注文を読み込み中"
      />
    );
  }

  if (lines.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface px-6 py-16 text-center">
        <p className="font-medium text-foreground">ご注文できる商品がありません</p>
        {canceled ? (
          <p className="mt-2 text-sm text-foreground-muted">
            決済がキャンセルされました。商品をカートに入れて再度お試しください。
          </p>
        ) : null}
        <Link
          href="/products"
          className="mt-6 inline-flex rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-white hover:bg-forest-strong"
        >
          商品を見る
        </Link>
      </div>
    );
  }

  return (
    <form
      action={(formData) => {
        persistProfile({
          name: String(formData.get("customerName") ?? ""),
          email: profile.email,
          phone: String(formData.get("phone") ?? ""),
          address: String(formData.get("address") ?? ""),
        });
        return action(formData);
      }}
      className="space-y-6"
    >
      {canceled ? (
        <p
          className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
          role="status"
        >
          決済がキャンセルされました。内容を確認して、再度お支払いへお進みください。
        </p>
      ) : null}

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

      <section className="rounded-xl border border-border bg-surface p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-foreground">注文内容</h2>
        <ul className="mt-3 divide-y divide-border">
          {lines.map((line) => (
            <li
              key={line.productId}
              className="flex items-start justify-between gap-3 py-2 text-sm"
            >
              <span className="text-foreground">
                {line.product.name}
                <span className="text-foreground-muted"> × {line.quantity}</span>
              </span>
              <span className="font-medium text-amber-price">
                {formatPrice(line.lineTotal)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-border pt-3 text-base font-semibold">
          <span>合計</span>
          <span className="text-amber-price">{formatPrice(total)}</span>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-surface p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-foreground">お届け先</h2>
        <Field
          label="お名前"
          name="customerName"
          autoComplete="name"
          required
          defaultValue={profile.name}
        />
        <Field
          label="電話番号"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          defaultValue={profile.phone}
        />
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-foreground">
            住所
          </span>
          <textarea
            name="address"
            required
            minLength={5}
            rows={3}
            autoComplete="street-address"
            defaultValue={profile.address}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-forest"
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
        className="h-11 w-full rounded-full bg-forest text-sm font-medium text-white hover:bg-forest-strong disabled:cursor-not-allowed disabled:bg-surface-muted"
      >
        {pending ? "送信中..." : "お支払いへ進む"}
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
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        className="h-11 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-forest"
      />
    </label>
  );
}
