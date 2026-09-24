"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useCart } from "@/components/cart-provider";
import type { Product } from "@/lib/types";

export function AddToCartButton({
  product,
  variant = "full",
}: {
  product: Product;
  variant?: "full" | "compact";
}) {
  const { addItem } = useCart();
  const soldOut = product.stock === 0;
  const [quantity, setQuantity] = useState(1);
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const busy = useRef(false);
  const compact = variant === "compact";

  function handleAdd() {
    if (busy.current || soldOut) {
      return;
    }

    busy.current = true;
    setPending(true);

    const result = addItem(product.id, product.stock, compact ? 1 : quantity);

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

  const label = soldOut
    ? "売り切れ"
    : pending
      ? "追加中..."
      : compact
        ? "カート"
        : "カートに入れる";

  if (compact) {
    return (
      <div>
        <button
          type="button"
          disabled={soldOut || pending}
          onClick={handleAdd}
          className="h-10 w-full border border-forest text-[12px] font-medium tracking-[0.18em] text-forest-strong transition-colors duration-200 hover:bg-forest hover:text-white disabled:cursor-not-allowed disabled:border-border disabled:bg-surface-muted disabled:text-foreground-muted disabled:hover:bg-surface-muted disabled:hover:text-foreground-muted"
        >
          {label}
        </button>
        {feedback ? (
          <p className="mt-2 text-xs text-foreground-muted" role="status">
            {feedback}
            {feedback === "カートに追加しました" ? (
              <>
                {" "}
                <Link href="/cart" className="font-medium text-forest underline">
                  見る
                </Link>
              </>
            ) : null}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {soldOut ? null : (
        <label className="block max-w-40">
          <span className="mb-1.5 block text-sm font-medium text-foreground">
            数量
          </span>
          <select
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm outline-none focus:border-forest focus:ring-2 focus:ring-forest/15"
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
        className="h-11 w-full rounded-full bg-forest text-sm font-medium text-white transition-colors hover:bg-forest-strong disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-foreground-muted sm:w-auto sm:px-8"
      >
        {label}
      </button>

      {feedback ? (
        <p className="text-sm text-foreground-muted" role="status">
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
