import Link from "next/link";
import { ClearCartOnMount } from "@/components/clear-cart-on-mount";

export const metadata = {
  title: "お支払い完了 — Mini EC",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  return (
    <main className="mx-auto w-full max-w-[960px] flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <ClearCartOnMount />
      <div className="rounded-xl border border-zinc-200 bg-white px-6 py-16 text-center">
        <p className="text-base font-semibold text-zinc-900">
          お支払いが完了しました
        </p>
        <p className="mt-2 text-sm text-zinc-500">
          {orderId
            ? `注文番号: ${orderId.slice(0, 8)}`
            : "ご注文ありがとうございました。"}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/orders"
            className="inline-flex rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
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
