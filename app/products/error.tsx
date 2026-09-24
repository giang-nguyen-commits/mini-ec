"use client";

export default function ProductsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto w-full max-w-[960px] flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="mb-6 font-[family-name:var(--font-heading)] text-[28px] font-semibold tracking-tight text-forest sm:text-[32px]">
        商品一覧
      </h1>
      <div className="rounded-2xl border border-border bg-surface px-6 py-16 text-center">
        <p className="text-base font-medium text-foreground">
          読み込みに失敗しました
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-white hover:bg-forest-strong"
        >
          再読み込み
        </button>
      </div>
    </main>
  );
}
