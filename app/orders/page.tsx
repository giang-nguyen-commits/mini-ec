import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { OrderList, OrderListSkeleton } from "@/components/order-list";
import { OrderStatusFilter } from "@/components/order-status-filter";
import { loginHref } from "@/lib/auth-redirect";
import { APP_NAME } from "@/lib/brand";
import { getOrdersByUserId } from "@/lib/orders";
import { parseOrderStatus } from "@/lib/order-status";
import type { OrderStatus } from "@/lib/types";
import { getAuthUser } from "@/lib/supabase/server";

export const metadata = {
  title: `注文履歴 — ${APP_NAME}`,
};

export default async function OrdersPage({ 
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await getAuthUser();
  if (!user) {
    redirect(loginHref("/orders"));
  }

  const { status } = await searchParams;
  const currentStatus = parseOrderStatus(status);


  return (
    <main className="mx-auto w-full max-w-[960px] flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="mb-6 font-[family-name:var(--font-heading)] text-[28px] font-semibold tracking-tight text-forest sm:text-[32px]">
        注文履歴
      </h1>
      <OrderStatusFilter current={currentStatus} />
      <Suspense key={currentStatus ?? "all"} fallback={<OrderListSkeleton />}>
      <OrderHistory userId={user.id} status={currentStatus} />
      </Suspense>
    </main>
  );
}

async function OrderHistory({
  userId,
  status,
}: {
  userId: string;
  status?: OrderStatus;
}) {
  const orders = await getOrdersByUserId(userId, status);

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
        <p className="text-base font-medium text-foreground">
          注文がまだありません
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-white hover:bg-forest-strong"
        >
          商品を見る
        </Link>
      </div>
    );
  }

  return <OrderList orders={orders} />;
}
