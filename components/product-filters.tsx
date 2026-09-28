import type { ReactNode } from "react";
import Link from "next/link";
import { SearchIcon } from "@/components/icons";
import { CATALOG_GROUPS, COSMETIC_BRANDS, HEALTH_LINES } from "@/lib/catalog";
import { SEARCH_SUGGESTIONS } from "@/lib/search";

export function productsSearchHref({
  q,
  category,
  brand,
  concern,
}: {
  q?: string;
  category?: string;
  brand?: string;
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
  if ((category === "化粧品" || category === "健康商品") && brand) {
    params.set("brand", brand);
  }
  if (concern) {
    params.set("concern", concern);
  }
  const qs = params.toString();
  const path = qs ? `/products?${qs}` : "/products";
  return `${path}#catalog`;
}

export function ProductFilters({
  q,
  category,
  brand,
  concern,
  concerns = [],
}: {
  q: string;
  category: string;
  brand: string;
  concern: string;
  concerns?: string[];
}) {
  const cosmeticsOpen = category === "化粧品";
  const healthOpen = category === "健康商品";
  const showConcerns = concerns.length > 0 && cosmeticsOpen;

  return (
    <div className="sticky top-[6.5rem] z-30 -mx-4 mb-4 space-y-2 border-b border-border/70 bg-background/95 px-4 py-2 backdrop-blur-sm sm:top-[7.5rem] sm:-mx-6 sm:px-6">
      <form action="/products#catalog" className="flex gap-2">
        {category ? <input type="hidden" name="category" value={category} /> : null}
        {brand ? <input type="hidden" name="brand" value={brand} /> : null}
        {concern ? <input type="hidden" name="concern" value={concern} /> : null}
        <div className="relative min-w-0 flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="検索（保湿、コラーゲン）"
            aria-label="商品を検索"
            list="product-search-hints"
            className="h-9 w-full rounded-none border-0 border-b border-border bg-transparent pl-9 pr-4 text-sm outline-none transition-colors duration-200 focus:border-forest"
          />
          <datalist id="product-search-hints">
            {SEARCH_SUGGESTIONS.map((hint) => (
              <option key={hint} value={hint} />
            ))}
          </datalist>
        </div>
        <button
          type="submit"
          className="h-9 shrink-0 border-b border-forest px-3 text-[12px] font-medium tracking-[0.16em] text-forest-strong transition-opacity duration-200 hover:opacity-60"
        >
          検索
        </button>
      </form>

      <div className="space-y-2">
        <nav
          aria-label="カテゴリ"
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-0"
        >
          <CategoryTab href={productsSearchHref({ q, concern })} active={!category}>
            すべて
          </CategoryTab>
          {CATALOG_GROUPS.map((name) => (
            <CategoryTab
              key={name}
              href={productsSearchHref({
                q,
                category: name,
                concern: name === "化粧品" ? concern : undefined,
              })}
              active={category === name}
            >
              {name}
            </CategoryTab>
          ))}
        </nav>

        {cosmeticsOpen ? (
          <nav
            aria-label="化粧品ブランド"
            className="flex flex-nowrap items-center justify-start gap-x-4 overflow-x-auto border-t border-border/70 pt-2 [scrollbar-width:thin]"
          >
            <CategoryTab
              href={productsSearchHref({ q, category: "化粧品", concern })}
              active={!brand}
              tone="brand"
            >
              すべてのブランド
            </CategoryTab>
            {COSMETIC_BRANDS.map((item) => (
              <CategoryTab
                key={item.id}
                href={productsSearchHref({
                  q,
                  category: "化粧品",
                  brand: item.id,
                  concern,
                })}
                active={brand === item.id}
                tone="brand"
              >
                {item.id}
              </CategoryTab>
            ))}
          </nav>
        ) : null}

        {showConcerns ? (
          <nav
            aria-label="肌悩み"
            className="flex flex-nowrap items-center justify-start gap-x-4 overflow-x-auto border-t border-border/70 pt-2 [scrollbar-width:thin]"
          >
            <span className="shrink-0 text-[11px] tracking-[0.12em] text-foreground-muted">
              肌悩み
            </span>
            <CategoryTab
              href={productsSearchHref({ q, category, brand })}
              active={!concern}
            >
              すべて
            </CategoryTab>
            {concerns.map((tag) => (
              <CategoryTab
                key={tag}
                href={productsSearchHref({
                  q,
                  category,
                  brand,
                  concern: tag,
                })}
                active={concern === tag}
              >
                {tag}
              </CategoryTab>
            ))}
          </nav>
        ) : null}

        {healthOpen ? (
          <nav
            aria-label="健康商品の種類"
            className="flex flex-nowrap items-center justify-start gap-x-4 overflow-x-auto border-t border-border/70 pt-2 [scrollbar-width:thin]"
          >
            <CategoryTab
              href={productsSearchHref({ q, category: "健康商品", concern })}
              active={!brand}
              tone="health"
            >
              すべての種類
            </CategoryTab>
            {HEALTH_LINES.map((item) => (
              <CategoryTab
                key={item.id}
                href={productsSearchHref({
                  q,
                  category: "健康商品",
                  brand: item.id,
                  concern,
                })}
                active={brand === item.id}
                tone="health"
              >
                {item.id}
              </CategoryTab>
            ))}
          </nav>
        ) : null}
      </div>
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
  tone?: "group" | "brand" | "health";
}) {
  const idle = "text-foreground-muted hover:text-forest-strong";
  const activeTone = "text-forest-strong underline decoration-[1px] underline-offset-4";

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`inline-flex h-8 shrink-0 items-center text-[12px] tracking-[0.12em] transition-colors duration-200 ${
        active ? activeTone : idle
      }`}
    >
      {children}
    </Link>
  );
}

export function ProductFiltersSkeleton() {
  return (
    <div
      className="sticky top-[6.5rem] z-30 -mx-4 mb-4 space-y-2 border-b border-border/70 bg-background/95 px-4 py-2 sm:top-[7.5rem] sm:-mx-6 sm:px-6"
      aria-hidden
    >
      <div className="h-9 animate-pulse border-b border-border bg-transparent" />
      <div className="flex flex-wrap justify-center gap-5">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="h-4 w-16 animate-pulse bg-surface-muted"
          />
        ))}
      </div>
    </div>
  );
}
