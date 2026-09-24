import Image from "next/image";
import { ProductGrid } from "@/components/product-grid";
import type { Product } from "@/lib/types";

export type ProductSectionGroup = {
  id: string;
  caption?: string;
  bannerUrl?: string;
  products: Product[];
};

export function ProductSections({
  groups,
  headingPrefix = "section",
}: {
  groups: ProductSectionGroup[];
  headingPrefix?: string;
}) {
  return (
    <div className="space-y-10">
      {groups.map((group, groupIndex) => {
        const headingId = `${headingPrefix}-${group.id}`;

        return (
          <section
            key={group.id}
            aria-labelledby={headingId}
            className="scroll-mt-24"
          >
            {group.bannerUrl ? (
              <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-forest-soft sm:aspect-[2/1]">
                <Image
                  src={group.bannerUrl}
                  alt={group.id}
                  fill
                  sizes="(max-width: 960px) 100vw, 960px"
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : null}
            <div className="mb-4 flex items-end justify-between gap-3 border-b border-border pb-2">
              <div>
                <h2
                  id={headingId}
                  className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-tight text-forest"
                >
                  {group.id}
                </h2>
                {group.caption ? (
                  <p className="mt-0.5 text-xs text-foreground-muted">
                    {group.caption}
                  </p>
                ) : null}
              </div>
              <p className="text-sm text-foreground-muted">
                {group.products.length}点
              </p>
            </div>
            <ProductGrid
              products={group.products}
              headingLevel="h3"
              prioritizeFirst={groupIndex === 0}
            />
          </section>
        );
      })}
    </div>
  );
}
