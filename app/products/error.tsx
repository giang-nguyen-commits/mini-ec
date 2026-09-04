"use client";

export default function ProductsError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <main className="mx-auto w-full max-w-[960px] flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-forest">
        商品一覧
      </h1>
      <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-16 text-center">
        <p className="text-base font-medium text-zinc-900">
          読み込みに失敗しました
        </p>
        <p className="mt-1 text-sm text-zinc-500">Không tải được danh sách</p>
        <button
          type="button"
          onClick={() => retry()}
          className="mt-6 rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
        >
          再読み込み
        </button>
      </div>
    </main>
  );
}
