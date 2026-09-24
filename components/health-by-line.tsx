import { ProductSections } from "@/components/product-sections";
import { groupHealthByLine } from "@/lib/catalog";
import type { Product } from "@/lib/types";

export function HealthByLine({ products }: { products: Product[] }) {
  return (
    <div className="space-y-6">
      <p className="rounded-xl border border-border bg-forest-soft px-4 py-3 text-xs leading-5 text-forest">
        健康食品です。医薬品ではなく、病気の治療・予防を目的としたものではありません。
      </p>
      <ProductSections
        groups={groupHealthByLine(products)}
        headingPrefix="health"
      />
    </div>
  );
}
