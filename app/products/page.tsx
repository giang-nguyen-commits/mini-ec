import Link from "next/link";
import { Suspense } from "react";
import { CosmeticsByBrand } from "@/components/cosmetics-by-brand";
import { HealthByLine } from "@/components/health-by-line";
import { SearchIcon } from "@/components/icons";
import { ProductFilters, ProductFiltersSkeleton } from "@/components/product-filters";
import { ProductGrid, ProductGridSkeleton } from "@/components/product-grid";
import { ShopHero } from "@/components/shop-hero";
import { ShopStory } from "@/components/shop-story";
import { APP_NAME } from "@/lib/brand";
import { resolveCatalogGroup } from "@/lib/catalog";
import { getProductSkinConcerns, getProducts } from "@/lib/products";

export const metadata = {
  title: `商品一覧 — ${APP_NAME}`,
};

function firstParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return value ?? "";
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string | string[];
    category?: string | string[];
    brand?: string | string[];
    concern?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const q = firstParam(params.q).trim();
  const category = firstParam(params.category).trim();
  const brand = firstParam(params.brand).trim();
  const concern = firstParam(params.concern).trim();
  const browsing = Boolean(q || category || brand || concern);
  const concerns = (await getProductSkinConcerns()).filter(
    (tag) => tag !== "82xコース",
  );

  return (
    <>
      {browsing ? null : <ShopHero />}
      <main
        id="catalog"
        className="mx-auto w-full max-w-[960px] flex-1 scroll-mt-[7.25rem] px-4 py-10 sm:scroll-mt-[8.25rem] sm:px-6 sm:py-12"
      >
        <h1 className="mb-2 text-center font-[family-name:var(--font-heading)] text-[30px] font-semibold tracking-[0.12em] text-forest-strong sm:text-[34px]">
          商品一覧
        </h1>
        <span className="mx-auto mb-3 block h-px w-8 bg-gold" aria-hidden />
        <p className={`text-center text-sm tracking-[0.06em] text-foreground-muted ${browsing ? "mb-6" : "mb-10"}`}>
          学習用のセレクトショップデモです
        </p>
        <Suspense fallback={<ProductFiltersSkeleton />}>
          <ProductFilters
            q={q}
            category={category}
            brand={brand}
            concern={concern}
            concerns={concerns}
          />
        </Suspense>
        <Suspense
          key={`${q}:${category}:${brand}:${concern}`}
          fallback={<ProductGridSkeleton />}
        >
          <ProductList q={q} category={category} brand={brand} concern={concern} />
        </Suspense>
        {browsing ? null : <ShopStory />}
      </main>
    </>
  );
}

async function ProductList({
  q,
  category,
  brand,
  concern,
}: {
  q: string;
  category: string;
  brand: string;
  concern: string;
}) {
  const products = await getProducts({ q, category, brand, concern });
  const filtered = Boolean(q || category || brand || concern);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
        <SearchIcon className="h-8 w-8 text-forest/40" />
        <div>
          <p className="text-base font-medium text-foreground">
            {filtered ? "該当する商品がありません" : "商品がまだありません"}
          </p>
        </div>
        {filtered ? (
          <Link
            href="/products#catalog"
            className="mt-1 rounded-full bg-forest px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-forest-strong"
          >
            すべて表示
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <>
      <p className="mb-3 text-xs font-medium tracking-wide text-foreground-muted">
        {filtered ? `該当 ${products.length}点` : `全 ${products.length}点`}
      </p>
      {resolveCatalogGroup(category) === "化粧品" ? (
        <CosmeticsByBrand products={products} />
      ) : resolveCatalogGroup(category) === "健康商品" ? (
        <HealthByLine products={products} />
      ) : (
        <ProductGrid products={products} />
      )}
    </>
  );
}
