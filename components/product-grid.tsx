import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/types";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <li key={product.id}>
          <ProductCard product={product} priority={index < 3} />
        </li>
      ))}
    </ul>
  );
}

export function ProductGridSkeleton() {
  return (
    <div role="status" aria-live="polite" aria-label="商品を読み込み中">
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <li
            key={index}
            className="overflow-hidden rounded-2xl border border-emerald-900/10 bg-white shadow-sm"
          >
            <div className="aspect-square animate-pulse bg-zinc-200" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-200" />
              <div className="h-3 w-full animate-pulse rounded bg-zinc-100" />
              <div className="flex justify-between gap-3">
                <div className="h-5 w-24 animate-pulse rounded bg-zinc-200" />
                <div className="h-5 w-16 animate-pulse rounded-full bg-zinc-100" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
