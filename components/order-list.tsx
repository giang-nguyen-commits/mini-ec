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
            className="block rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-rest)] transition duration-200 hover:-translate-y-0.5 hover:border-forest/25 hover:shadow-[var(--shadow-hover)] sm:p-5"
          >
            <article data-testid="order-card" data-status={order.status}>
              <div className="flex items-start justify-between gap-3">
                <time
                  dateTime={order.created_at}
                  className="text-sm text-foreground-muted"
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
                className="mt-3 text-sm leading-6 text-foreground"
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
            className="rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="h-4 w-40 animate-pulse rounded bg-surface-muted" />
              <div className="h-5 w-16 animate-pulse rounded-full bg-surface-muted" />
            </div>
            <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-surface-muted" />
            <div className="mt-3 h-6 w-24 animate-pulse rounded bg-surface-muted" />
          </li>
        ))}
      </ul>
    </div>
  );
}
