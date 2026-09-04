"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useCart } from "@/components/cart-provider";
import type { Product } from "@/lib/types";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const soldOut = product.stock === 0;
  const [quantity, setQuantity] = useState(1);
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const busy = useRef(false);

  function handleAdd() {
    if (busy.current || soldOut) {
      return;
    }

    busy.current = true;
    setPending(true);

    const result = addItem(product.id, product.stock, quantity);

    if (!result.ok) {
      setFeedback("売り切れです");
    } else {
      setFeedback(
        result.clamped
          ? "在庫数の上限に合わせました"
          : "カートに追加しました",
      );
    }

    window.setTimeout(() => setFeedback(null), 2000);
    setPending(false);
    busy.current = false;
  }

  return (
    <div className="space-y-4">
      {soldOut ? null : (
        <label className="block max-w-40">
          <span className="mb-1.5 block text-sm font-medium text-zinc-800">
            数量
          </span>
          <select
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            className="h-11 w-full rounded-xl border border-emerald-900/15 bg-white px-3 text-sm outline-none focus:border-forest"
          >
            {Array.from({ length: product.stock }, (_, index) => index + 1).map(
              (value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ),
            )}
          </select>
        </label>
      )}

      <button
        type="button"
        disabled={soldOut || pending}
        onClick={handleAdd}
        className="h-11 w-full rounded-xl bg-forest text-sm font-medium text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-600 sm:w-auto sm:px-8"
      >
        {soldOut ? "売り切れ" : pending ? "追加中..." : "カートに入れる"}
      </button>

      {feedback ? (
        <p className="text-sm text-zinc-600" role="status">
          {feedback}
          {feedback === "カートに追加しました" ? (
            <>
              {" "}
              <Link href="/cart" className="font-medium text-forest underline">
                カートを見る
              </Link>
            </>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}
