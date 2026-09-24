import type { OrderStatus } from "@/lib/types";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "未払い",
  paid: "支払い済み",
  canceled: "キャンセル",
};

export const ORDER_STATUS_TONE: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-800",
  paid: "bg-forest-soft text-forest",
  canceled: "bg-surface-muted text-foreground-muted",
};

export function orderStatusLabel(status: string) {
  return ORDER_STATUS_LABEL[status as OrderStatus] ?? status;
}

export function orderStatusTone(status: string) {
  return ORDER_STATUS_TONE[status as OrderStatus] ?? "bg-surface-muted text-foreground-muted";
}

export function formatOrderDateTime(iso: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatOrderItemSummary(
  items: { name: string; quantity: number }[],
) {
  return items.map((item) => `${item.name} × ${item.quantity}`).join("、");
}
