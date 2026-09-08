import { Suspense } from "react";
import { ProductFilters, ProductFiltersSkeleton } from "@/components/product-filters";
import { ProductGrid, ProductGridSkeleton } from "@/components/product-grid";
import { getProducts } from "@/lib/products";

export const metadata = {
  title: "商品一覧 — Mini EC",
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
  searchParams: Promise<{ q?: string | string[]; category?: string | string[] }>;
}) {
  const params = await searchParams;
  const q = firstParam(params.q).trim();
  const category = firstParam(params.category).trim();

  return (
    <main className="mx-auto w-full max-w-[960px] flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="mb-4 text-2xl font-semibold tracking-tight text-forest">
        商品一覧
      </h1>
      <Suspense fallback={<ProductFiltersSkeleton />}>
        <ProductFilters q={q} category={category} />
      </Suspense>
      <Suspense key={`${q}:${category}`} fallback={<ProductGridSkeleton />}>
        <ProductList q={q} category={category} />
      </Suspense>
    </main>
  );
}

async function ProductList({ q, category }: { q: string; category: string }) {
  const products = await getProducts({ q, category });
  const filtered = Boolean(q || category);

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-emerald-200 bg-white px-6 py-16 text-center">
        <p className="text-base font-medium text-zinc-900">
          {filtered ? "該当する商品がありません" : "商品がまだありません"}
        </p>
        <p className="mt-1 text-sm text-zinc-500">
          {filtered ? "Không có sản phẩm phù hợp" : "Chưa có sản phẩm"}
        </p>
      </div>
    );
  }

  return <ProductGrid products={products} />;
}
