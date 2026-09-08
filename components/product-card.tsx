import Image from "next/image";
import Link from "next/link";
import { StockBadge } from "@/components/stock-badge";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({
  product,
  priority,
}: {
  product: Product;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/products/${product.id}`}
      data-testid="product-card"
      className="block h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-emerald-900/10 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
        <div className="relative aspect-square bg-emerald-50">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
              preload={priority}
              unoptimized
            />
          ) : (
            <div
              className="flex h-full items-center justify-center text-4xl font-semibold text-emerald-200"
              aria-hidden
            >
              {product.name.slice(0, 1)}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <h2 className="line-clamp-2 text-base font-semibold text-zinc-900">
            {product.name}
          </h2>
          {product.description ? (
            <p className="line-clamp-2 text-sm leading-6 text-zinc-500">
              {product.description}
            </p>
          ) : null}
          <div className="mt-auto flex items-center justify-between gap-3 pt-1">
            <p className="text-lg font-semibold tracking-tight text-amber-price">
              {formatPrice(product.price)}
            </p>
            <StockBadge stock={product.stock} />
          </div>
        </div>
      </article>
    </Link>
  );
}
