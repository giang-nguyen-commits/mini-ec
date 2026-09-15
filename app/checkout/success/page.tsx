import Link from "next/link";
import { redirect } from "next/navigation";
import { ClearCartOnMount } from "@/components/clear-cart-on-mount";
import { loginHref } from "@/lib/auth-redirect";
import { confirmPaidCheckout } from "@/lib/order-lifecycle";
import { getAuthUser } from "@/lib/supabase/server";

export const metadata = {
  title: "お支払い完了 — Mini EC",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string; session_id?: string }>;
}) {
  const params = await searchParams;
  const user = await getAuthUser();
  if (!user) {
    const query = new URLSearchParams();
    if (params.orderId) {
      query.set("orderId", params.orderId);
    }
    if (params.session_id) {
      query.set("session_id", params.session_id);
    }
    const suffix = query.toString();
    redirect(loginHref(suffix ? `/checkout/success?${suffix}` : "/checkout/success"));
  }

  const result = await confirmPaidCheckout({
    userId: user.id,
    orderId: params.orderId,
    sessionId: params.session_id,
  });

  if (result.status === "paid") {
    return (
      <main className="mx-auto w-full max-w-[960px] flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <ClearCartOnMount />
        <div className="rounded-xl border border-zinc-200 bg-white px-6 py-16 text-center">
          <p className="text-base font-semibold text-zinc-900">
            お支払いが完了しました
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            注文番号: {result.order ? result.order.id.slice(0, 8) : params.orderId?.slice(0, 8)}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {result.order ? (
              <Link
                href={`/orders/${result.order.id}`}
                className="inline-flex rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
              >
                この注文を見る
              </Link>
            ) : null}
            <Link
              href="/orders"
              className="inline-flex rounded-full border border-emerald-900/15 px-5 py-2.5 text-sm font-medium text-forest hover:bg-emerald-50"
            >
              注文履歴を見る
            </Link>
            <Link
              href="/products"
              className="inline-flex rounded-full border border-emerald-900/15 px-5 py-2.5 text-sm font-medium text-forest hover:bg-emerald-50"
            >
              商品一覧へ戻る
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (result.status === "pending") {
    return (
      <main className="mx-auto w-full max-w-[960px] flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="rounded-xl border border-zinc-200 bg-white px-6 py-16 text-center">
          <p className="text-base font-semibold text-zinc-900">
            お支払いを確認しています
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            反映まで少し時間がかかることがあります。注文履歴でステータスをご確認ください。
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/orders"
              className="inline-flex rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
            >
              注文履歴を見る
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[960px] flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <div className="rounded-xl border border-zinc-200 bg-white px-6 py-16 text-center">
        <p className="text-base font-semibold text-zinc-900">
          お支払いが完了していません
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          決済が途中で終了したか、別の注文です。カートから再度お試しください。
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/checkout"
            className="inline-flex rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
          >
            ご注文へ戻る
          </Link>
          <Link
            href="/cart"
            className="inline-flex rounded-full border border-emerald-900/15 px-5 py-2.5 text-sm font-medium text-forest hover:bg-emerald-50"
          >
            カートを見る
          </Link>
        </div>
      </div>
    </main>
  );
}
