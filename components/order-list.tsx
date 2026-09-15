import Link from "next/link";
import { formatPrice } from "@/lib/format";
import {
  formatOrderDateTime,
  formatOrderItemSummary,
  orderStatusLabel,
  orderStatusTone,
} from "@/lib/order-status";
import type { Order } from "@/lib/types";

export function OrderList({ orders }: { orders: Order[] }) {
  return (
    <ul className="space-y-4">
      {orders.map((order) => (
        <li key={order.id}>
          <Link
            href={`/orders/${order.id}`}
            className="block rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm transition-colors hover:border-emerald-900/20 hover:bg-emerald-50/40 sm:p-5"
          >
            <article data-testid="order-card" data-status={order.status}>
              <div className="flex items-start justify-between gap-3">
                <time
                  dateTime={order.created_at}
                  className="text-sm text-zinc-500"
                >
                  {formatOrderDateTime(order.created_at)}
                </time>
                <span
                  data-testid="order-status"
                  data-status={order.status}
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${orderStatusTone(order.status)}`}
                >
                  {orderStatusLabel(order.status)}
                </span>
              </div>
              <p
                data-testid="order-items"
                className="mt-3 text-sm leading-6 text-zinc-700"
              >
                {formatOrderItemSummary(order.items)}
              </p>
              <p
                data-testid="order-total"
                className="mt-3 text-lg font-semibold tracking-tight text-amber-price"
              >
                {formatPrice(order.total)}
              </p>
            </article>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function OrderListSkeleton() {
  return (
    <div role="status" aria-live="polite" aria-label="注文を読み込み中">
      <ul className="space-y-4">
        {Array.from({ length: 3 }, (_, index) => (
          <li
            key={index}
            className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm sm:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="h-4 w-40 animate-pulse rounded bg-zinc-200" />
              <div className="h-5 w-16 animate-pulse rounded-full bg-zinc-100" />
            </div>
            <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-zinc-100" />
            <div className="mt-3 h-6 w-24 animate-pulse rounded bg-zinc-200" />
          </li>
        ))}
      </ul>
    </div>
  );
}
