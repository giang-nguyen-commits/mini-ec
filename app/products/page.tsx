import { Suspense } from "react";
import { ProductGrid, ProductGridSkeleton } from "@/components/product-grid";
import { getProducts } from "@/lib/products";

export const metadata = {
  title: "商品一覧 — Mini EC",
};

export default function ProductsPage() {
  return (
    <main className="mx-auto w-full max-w-[960px] flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-forest">
        商品一覧
      </h1>
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductList />
      </Suspense>
    </main>
  );
}

async function ProductList() {
  const products = await getProducts();

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-emerald-200 bg-white px-6 py-16 text-center">
        <p className="text-base font-medium text-zinc-900">
          商品がまだありません
        </p>
        <p className="mt-1 text-sm text-zinc-500">Chưa có sản phẩm</p>
      </div>
    );
  }

  return <ProductGrid products={products} />;
}
