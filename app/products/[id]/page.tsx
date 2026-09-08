import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { AuthenticBadge } from "@/components/authentic-badge";
import { formatPrice } from "@/lib/format";
import { getProductById, isCosmeticsProduct } from "@/lib/products";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return { title: "商品が見つかりません — Mini EC" };
  }

  return { title: `${product.name} — Mini EC` };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const soldOut = product.stock === 0;
  const cosmetics = isCosmeticsProduct(product);

  return (
    <main className="mx-auto w-full max-w-[960px] flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start lg:gap-8">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-emerald-900/10 bg-emerald-50">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 480px"
              className="object-cover"
              preload
              unoptimized
            />
          ) : (
            <div
              className="flex h-full items-center justify-center text-6xl font-semibold text-emerald-200"
              aria-hidden
            >
              {product.name.slice(0, 1)}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {(product.category || (cosmetics && product.skin_type)) ? (
            <div className="flex flex-wrap items-center gap-2">
              {product.category ? (
                <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-forest">
                  {product.category}
                </span>
              ) : null}
              {cosmetics && product.skin_type ? (
                <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-price">
                  {product.skin_type}
                </span>
              ) : null}
            </div>
          ) : null}
          <h1 className="text-2xl font-semibold tracking-tight text-forest">
            {product.name}
          </h1>
          <p className="text-2xl font-semibold tracking-tight text-amber-price">
            {formatPrice(product.price)}
          </p>
          <p
            className={`text-sm font-medium ${soldOut ? "text-red-700" : "text-zinc-700"}`}
          >
            {soldOut ? "在庫: 売り切れ" : `在庫: 残り ${product.stock} 点`}
          </p>
          {product.description ? (
            <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-600">
              {product.description}
            </p>
          ) : null}

          {cosmetics && product.skin_concern_tags?.length ? (
            <ul className="flex flex-wrap gap-1.5">
              {product.skin_concern_tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-emerald-900/10 px-2.5 py-1 text-xs text-zinc-600"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}

          <section className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-forest">正規品・出所</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <AuthenticBadge authentic={product.is_authentic} />
            </div>
            {product.origin ? (
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                {product.origin}
              </p>
            ) : (
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                出所情報は登録されていません。
              </p>
            )}
          </section>

          {product.ingredients ? (
            <section className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-forest">
                {cosmetics ? "成分" : "素材・仕様"}
              </h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-zinc-600">
                {product.ingredients}
              </p>
            </section>
          ) : null}

          <div className="pt-2">
            <AddToCartButton product={product} />
          </div>

          <Link
            href="/products"
            className="mt-2 text-sm font-medium text-forest hover:underline"
          >
            ← 商品一覧へ
          </Link>
        </div>
      </div>
    </main>
  );
}
