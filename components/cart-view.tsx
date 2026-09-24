"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { QuantityStepper } from "@/components/quantity-stepper";
import { buildCartLines, cartTotal } from "@/lib/checkout";
import { formatPrice } from "@/lib/format";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import type { CartLine, Product } from "@/lib/types";

type ViewState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; products: Product[] };

export function CartView() {
  const { items, ready, setItemQuantity, removeItem, replaceItems } = useCart();
  const [view, setView] = useState<ViewState>({ status: "loading" });
  const [notice, setNotice] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setView({ status: "loading" });
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, stock, description, image_url, created_at");

      if (error) {
        throw error;
      }

      setView({ status: "ready", products: (data as Product[] | null) ?? [] });
    } catch {
      setView({ status: "error" });
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const { lines, dropped, clamped } = useMemo(() => {
    if (view.status !== "ready") {
      return {
        lines: [] as CartLine[],
        dropped: false,
        clamped: false,
      };
    }

    return buildCartLines(items, view.products);
  }, [items, view]);

  useEffect(() => {
    if (view.status !== "ready" || !ready) {
      return;
    }

    if (!dropped && !clamped) {
      return;
    }

    const nextItems = lines.map((line) => ({
      productId: line.productId,
      quantity: line.quantity,
    }));
    const unchanged =
      nextItems.length === items.length &&
      nextItems.every(
        (item, index) =>
          item.productId === items[index]?.productId &&
          item.quantity === items[index]?.quantity,
      );

    if (unchanged) {
      return;
    }

    if (dropped && clamped) {
      setNotice("販売終了の商品を外し、在庫に合わせて数量を更新しました");
    } else if (dropped) {
      setNotice("販売終了の商品をカートから外しました");
    } else {
      setNotice("在庫に合わせて数量を更新しました");
    }

    replaceItems(nextItems);
  }, [clamped, dropped, items, lines, ready, replaceItems, view.status]);

  if (!ready || view.status === "loading") {
    return (
      <div className="space-y-3" role="status" aria-label="カートを読み込み中">
        {Array.from({ length: 2 }, (_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-xl border border-border bg-surface"
          />
        ))}
      </div>
    );
  }

  if (view.status === "error") {
    return (
      <div className="rounded-xl border border-border bg-surface px-6 py-16 text-center">
        <p className="font-medium text-foreground">カートを読み込めませんでした</p>
        <button
          type="button"
          onClick={() => void loadProducts()}
          className="mt-6 rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-white hover:bg-forest-strong"
        >
          再読み込み
        </button>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface px-6 py-16 text-center">
        <p className="text-base font-medium text-foreground">カートは空です</p>
        <Link
          href="/products"
          className="mt-6 inline-flex rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-white hover:bg-forest-strong"
        >
          商品を見る
        </Link>
      </div>
    );
  }

  const total = cartTotal(lines);

  return (
    <div className="space-y-6">
      {notice ? (
        <p
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
          role="status"
        >
          {notice}
        </p>
      ) : null}

      <ul className="space-y-3">
        {lines.map((line) => (
          <CartLineItem
            key={line.productId}
            line={line}
            onQuantity={(quantity) =>
              setItemQuantity(line.productId, quantity, line.product.stock)
            }
            onRemove={() => removeItem(line.productId)}
          />
        ))}
      </ul>

      <CartSummary total={total} />
    </div>
  );
}

function CartLineItem({
  line,
  onQuantity,
  onRemove,
}: {
  line: CartLine;
  onQuantity: (quantity: number) => void;
  onRemove: () => void;
}) {
  return (
    <li className="flex gap-3 rounded-2xl border border-border bg-surface p-3 shadow-sm sm:gap-4 sm:p-4">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-muted sm:h-20 sm:w-20">
        <Link href={`/products/${line.productId}`} className="absolute inset-0">
          {line.product.image_url ? (
            <Image
              src={line.product.image_url}
              alt={line.product.name}
              fill
              sizes="80px"
              className="object-cover"
              unoptimized
            />
          ) : null}
        </Link>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/products/${line.productId}`}
            className="font-medium text-foreground hover:text-forest hover:underline"
          >
            {line.product.name}
          </Link>
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex h-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-rose-bg px-4 text-sm font-medium text-rose-ink hover:bg-rose-bg/80"
          >
            削除
          </button>
        </div>
        <p className="mt-0.5 text-sm text-amber-price">
          {formatPrice(line.product.price)}
        </p>

        <div className="mt-3 flex items-center justify-between gap-3">
          {line.soldOut ? (
            <span className="text-sm font-medium text-red-600/80">売り切れ</span>
          ) : (
            <QuantityStepper
              value={line.quantity}
              max={line.product.stock}
              onChange={onQuantity}
            />
          )}
          <p className="text-sm font-semibold text-amber-price">
            {line.soldOut ? "—" : formatPrice(line.lineTotal)}
          </p>
        </div>
      </div>
    </li>
  );
}

function CartSummary({ total }: { total: number }) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-4 py-4 shadow-sm sm:px-5">
      <div className="flex items-center justify-between border-t border-border pt-3 text-lg font-semibold">
        <span>合計</span>
        <span className="text-amber-price">{formatPrice(total)}</span>
      </div>
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <Link
          href="/products"
          className="inline-flex h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-medium text-forest hover:bg-forest-soft"
        >
          買い物を続ける
        </Link>
        <Link
          href="/checkout"
          className="inline-flex h-11 items-center justify-center rounded-full bg-forest px-5 text-sm font-medium text-white hover:bg-forest-strong"
        >
          ご注文へ
        </Link>
      </div>
    </div>
  );
}
