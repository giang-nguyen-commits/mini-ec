import type { ReactNode } from "react";
import Link from "next/link";
import { getProductCategories, getProductSkinConcerns } from "@/lib/products";

export function productsSearchHref({
  q,
  category,
  concern,
}: {
  q?: string;
  category?: string;
  concern?: string;
}) {
  const params = new URLSearchParams();
  const query = q?.trim();
  if (query) {
    params.set("q", query);
  }
  if (category) {
    params.set("category", category);
  }
  if (concern) {
    params.set("concern", concern);
  }
  const qs = params.toString();
  return qs ? `/products?${qs}` : "/products";
}

export async function ProductFilters({
  q,
  category,
  concern,
}: {
  q: string;
  category: string;
  concern: string;
}) {
  const [categories, concerns] = await Promise.all([
    getProductCategories(),
    getProductSkinConcerns(),
  ]);

  return (
    <div className="mb-6 space-y-4">
      <form action="/products" className="flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="商品名・成分で検索"
          aria-label="商品名・成分で検索"
          className="h-11 min-w-0 flex-1 rounded-xl border border-emerald-900/15 bg-white px-3 text-sm outline-none focus:border-forest"
        />
        {category ? <input type="hidden" name="category" value={category} /> : null}
        {concern ? <input type="hidden" name="concern" value={concern} /> : null}
        <button
          type="submit"
          className="h-11 shrink-0 rounded-xl bg-forest px-4 text-sm font-medium text-white hover:bg-emerald-800"
        >
          検索
        </button>
      </form>

      <div className="space-y-2">
        <p className="text-xs font-medium text-zinc-500">カテゴリ</p>
        <nav aria-label="カテゴリ" className="flex flex-wrap gap-2">
          <CategoryTab href={productsSearchHref({ q, concern })} active={!category}>
            すべて
          </CategoryTab>
          {categories.map((name) => (
            <CategoryTab
              key={name}
              href={productsSearchHref({ q, category: name, concern })}
              active={category === name}
            >
              {name}
            </CategoryTab>
          ))}
        </nav>
      </div>

      {concerns.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs font-medium text-zinc-500">肌悩み</p>
          <nav aria-label="肌悩み" className="flex flex-wrap gap-2">
            <CategoryTab href={productsSearchHref({ q, category })} active={!concern}>
              すべて
            </CategoryTab>
            {concerns.map((name) => (
              <CategoryTab
                key={name}
                href={productsSearchHref({ q, category, concern: name })}
                active={concern === name}
              >
                {name}
              </CategoryTab>
            ))}
          </nav>
        </div>
      ) : null}
    </div>
  );
}

function CategoryTab({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1.5 text-sm font-medium ${
        active
          ? "bg-forest text-white"
          : "text-forest hover:bg-emerald-50"
      }`}
    >
      {children}
    </Link>
  );
}

export function ProductFiltersSkeleton() {
  return (
    <div className="mb-6 space-y-3" aria-hidden>
      <div className="h-11 animate-pulse rounded-xl border border-emerald-900/10 bg-white" />
      <div className="flex gap-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="h-8 w-20 animate-pulse rounded-full bg-emerald-50"
          />
        ))}
      </div>
    </div>
  );
}
