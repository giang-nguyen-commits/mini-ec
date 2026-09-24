export default function ProductDetailLoading() {
  return (
    <main className="mx-auto w-full max-w-[960px] flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <div
        className="grid gap-6 lg:grid-cols-2 lg:gap-8"
        role="status"
        aria-label="商品を読み込み中"
      >
        <div className="aspect-square animate-pulse rounded-2xl bg-surface-muted" />
        <div className="space-y-4">
          <div className="h-8 w-2/3 animate-pulse rounded bg-surface-muted" />
          <div className="h-7 w-28 animate-pulse rounded bg-surface-muted" />
          <div className="h-4 w-32 animate-pulse rounded bg-surface-muted" />
          <div className="h-20 w-full animate-pulse rounded bg-surface-muted" />
          <div className="h-11 w-40 animate-pulse rounded-xl bg-surface-muted" />
        </div>
      </div>
    </main>
  );
}
