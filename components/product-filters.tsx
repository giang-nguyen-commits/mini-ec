import type { ReactNode } from "react";
import Link from "next/link";
import { getProductCategories } from "@/lib/products";

export function productsSearchHref({
  q,
  category,
}: {
  q?: string;
  category?: string;
}) {
  const params = new URLSearchParams();
  const query = q?.trim();
  if (query) {
    params.set("q", query);
  }
  if (category) {
    params.set("category", category);
  }
  const qs = params.toString();
  return qs ? `/products?${qs}` : "/products";
}

export async function ProductFilters({
  q,
  category,
}: {
  q: string;
  category: string;
}) {
  const categories = await getProductCategories();

  return (
    <div className="mb-6 space-y-3">
      <form action="/products" className="flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="商品名で検索"
          aria-label="商品名で検索"
          className="h-11 min-w-0 flex-1 rounded-xl border border-emerald-900/15 bg-white px-3 text-sm outline-none focus:border-forest"
        />
        {category ? <input type="hidden" name="category" value={category} /> : null}
        <button
          type="submit"
          className="h-11 shrink-0 rounded-xl bg-forest px-4 text-sm font-medium text-white hover:bg-emerald-800"
        >
          検索
        </button>
      </form>

      <nav aria-label="カテゴリ" className="flex flex-wrap gap-2">
        <CategoryTab href={productsSearchHref({ q })} active={!category}>
          すべて
        </CategoryTab>
        {categories.map((name) => (
          <CategoryTab
            key={name}
            href={productsSearchHref({ q, category: name })}
            active={category === name}
          >
            {name}
          </CategoryTab>
        ))}
      </nav>
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
