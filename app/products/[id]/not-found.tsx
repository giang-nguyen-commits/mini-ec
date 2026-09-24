import Link from "next/link";

export default function ProductNotFound() {
  return (
    <main className="mx-auto w-full max-w-[960px] flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
        <h1 className="text-xl font-semibold tracking-tight text-forest">
          商品が見つかりません
        </h1>
        <Link
          href="/products"
          className="mt-6 inline-flex rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-white hover:bg-forest-strong"
        >
          一覧へ戻る
        </Link>
      </div>
    </main>
  );
}
