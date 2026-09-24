import { ProductSections } from "@/components/product-sections";
import { groupCosmeticsByBrand } from "@/lib/catalog";
import type { Product } from "@/lib/types";

export function CosmeticsByBrand({ products }: { products: Product[] }) {
  return (
    <ProductSections
      groups={groupCosmeticsByBrand(products)}
      headingPrefix="brand"
    />
  );
}
