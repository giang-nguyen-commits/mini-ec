import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { APP_NAME } from "@/lib/brand";
import { formatPrice } from "@/lib/format";
import { loginHref } from "@/lib/auth-redirect";
import {
  formatOrderDateTime,
  orderStatusLabel,
  orderStatusTone,
} from "@/lib/order-status";
import { getOrderByIdForUser } from "@/lib/orders";
import { getAuthUser } from "@/lib/supabase/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return { title: `注文 ${id.slice(0, 8)} — ${APP_NAME}` };
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getAuthUser();
  if (!user) {
    redirect(loginHref(`/orders/${id}`));
  }

  const order = await getOrderByIdForUser(id, user.id);
  if (!order) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-[960px] flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <p className="mb-4">
        <Link
          href="/orders"
          className="text-sm font-medium text-forest hover:underline"
        >
          ← 注文履歴へ
        </Link>
      </p>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-[28px] font-semibold tracking-tight text-forest sm:text-[32px]">
            注文詳細
          </h1>
          <p className="mt-1 text-sm text-foreground-muted">
            注文番号: {order.id.slice(0, 8)}
          </p>
        </div>
        <span
          data-testid="order-status"
          data-status={order.status}
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${orderStatusTone(order.status)}`}
        >
          {orderStatusLabel(order.status)}
        </span>
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-5">
        <h2 className="text-sm font-semibold text-foreground">注文内容</h2>
        <time
          dateTime={order.created_at}
          className="mt-1 block text-sm text-foreground-muted"
        >
          {formatOrderDateTime(order.created_at)}
        </time>
        <ul className="mt-3 divide-y divide-border" data-testid="order-items">
          {order.items.map((item) => (
            <li
              key={`${item.product_id}-${item.name}`}
              className="flex items-start justify-between gap-3 py-2 text-sm"
            >
              <span className="text-foreground">
                {item.name}
                <span className="text-foreground-muted"> × {item.quantity}</span>
              </span>
              <span className="font-medium text-amber-price">
                {formatPrice(item.line_total)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-border pt-3 text-base font-semibold">
          <span>合計</span>
          <span className="text-amber-price" data-testid="order-total">
            {formatPrice(order.total)}
          </span>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-5">
        <h2 className="text-sm font-semibold text-foreground">お届け先</h2>
        <dl className="mt-3 space-y-2 text-sm">
          <div>
            <dt className="text-foreground-muted">お名前</dt>
            <dd className="mt-0.5 text-foreground">{order.customer_name}</dd>
          </div>
          <div>
            <dt className="text-foreground-muted">電話番号</dt>
            <dd className="mt-0.5 text-foreground">{order.phone}</dd>
          </div>
          <div>
            <dt className="text-foreground-muted">住所</dt>
            <dd className="mt-0.5 whitespace-pre-wrap text-foreground">
              {order.address}
            </dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
