import { Suspense } from "react";
import { redirect } from "next/navigation";
import { OrderList, OrderListSkeleton } from "@/components/order-list";
import { loginHref } from "@/lib/auth-redirect";
import { getOrdersByUserId } from "@/lib/orders";
import { getAuthUser } from "@/lib/supabase/server";

export const metadata = {
  title: "注文履歴 — Mini EC",
};

export default async function OrdersPage() {
  const user = await getAuthUser();
  if (!user) {
    redirect(loginHref("/orders"));
  }

  return (
    <main className="mx-auto w-full max-w-[960px] flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-forest">
        注文履歴
      </h1>
      <Suspense fallback={<OrderListSkeleton />}>
        <OrderHistory userId={user.id} />
      </Suspense>
    </main>
  );
}

async function OrderHistory({ userId }: { userId: string }) {
  const orders = await getOrdersByUserId(userId);

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-emerald-200 bg-white px-6 py-16 text-center">
        <p className="text-base font-medium text-zinc-900">
          注文がまだありません
        </p>
        <p className="mt-1 text-sm text-zinc-500">Chưa có đơn hàng</p>
      </div>
    );
  }

  return <OrderList orders={orders} />;
}
