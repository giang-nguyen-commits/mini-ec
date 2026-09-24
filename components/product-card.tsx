import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductThumbnail } from "@/components/product-thumbnail";
import { StockBadge } from "@/components/stock-badge";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({
  product,
  priority,
  headingLevel = "h2",
}: {
  product: Product;
  priority?: boolean;
  headingLevel?: "h2" | "h3";
}) {
  const Title = headingLevel;
  return (
    <article className="flex h-full flex-col overflow-hidden border border-border/80 bg-surface transition-opacity duration-200 hover:opacity-90">
      <Link
        href={`/products/${product.id}`}
        data-testid="product-card"
        className="flex min-h-0 flex-1 flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
      >
        <div className="relative aspect-square bg-surface">
          <ProductThumbnail
            imageUrl={product.image_url}
            alt={product.name}
            priority={priority}
          />
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4 pb-2">
          <Title className="line-clamp-2 text-base font-semibold text-foreground">
            {product.name}
          </Title>
          {product.description ? (
            <p className="line-clamp-2 text-sm leading-6 text-foreground-muted">
              {product.description}
            </p>
          ) : null}
          <div className="mt-auto flex items-center justify-between gap-3 pt-1">
            <p className="text-lg font-semibold tracking-tight text-amber-price tabular-nums">
              {formatPrice(product.price)}
            </p>
            <StockBadge stock={product.stock} />
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <AddToCartButton product={product} variant="compact" />
      </div>
    </article>
  );
}
