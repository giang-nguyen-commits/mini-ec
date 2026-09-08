import { formatPrice } from "@/lib/format";
import type { Order, OrderItemSnapshot, OrderStatus } from "@/lib/types";

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "未払い",
  paid: "支払い済み",
  canceled: "キャンセル",
};

const STATUS_TONE: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-800",
  paid: "bg-emerald-50 text-forest",
  canceled: "bg-zinc-100 text-zinc-600",
};

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function formatItemSummary(items: OrderItemSnapshot[]) {
  return items.map((item) => `${item.name} × ${item.quantity}`).join("、");
}

function statusLabel(status: string) {
  return STATUS_LABEL[status as OrderStatus] ?? status;
}

function statusTone(status: string) {
  return STATUS_TONE[status as OrderStatus] ?? "bg-zinc-100 text-zinc-600";
}

export function OrderList({ orders }: { orders: Order[] }) {
  return (
    <ul className="space-y-4">
      {orders.map((order) => (
        <li key={order.id}>
          <article
            data-testid="order-card"
            data-status={order.status}
            className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm sm:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <time
                dateTime={order.created_at}
                className="text-sm text-zinc-500"
              >
                {formatDateTime(order.created_at)}
              </time>
              <span
                data-testid="order-status"
                data-status={order.status}
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusTone(order.status)}`}
              >
                {statusLabel(order.status)}
              </span>
            </div>
            <p
              data-testid="order-items"
              className="mt-3 text-sm leading-6 text-zinc-700"
            >
              {formatItemSummary(order.items)}
            </p>
            <p
              data-testid="order-total"
              className="mt-3 text-lg font-semibold tracking-tight text-amber-price"
            >
              {formatPrice(order.total)}
            </p>
          </article>
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
