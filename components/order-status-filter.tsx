import Link from "next/link";
import { ORDER_STATUS_LABEL } from "@/lib/order-status";
import type { OrderStatus } from "@/lib/types";

const FILTERS: { label: string; status?: OrderStatus }[] = [
  { label: "すべて" },
  ...(Object.keys(ORDER_STATUS_LABEL) as OrderStatus[]).map((s) => ({
    label: ORDER_STATUS_LABEL[s],
    status: s,
  })),
];

export function OrderStatusFilter({ current }: { current?: OrderStatus }) {
  return (
    <nav aria-label="状態で絞り込む" className="mb-6 flex flex-wrap gap-2">
      {FILTERS.map(({ label, status }) => {
        const active = current === status;
        return (
          <Link
            key={label}
            href={status ? `/orders?status=${status}` : "/orders"}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              active
                ? "bg-forest text-white"
                : "border border-border bg-surface text-foreground"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}