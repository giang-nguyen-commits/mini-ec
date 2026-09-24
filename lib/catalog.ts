import type { Product } from "@/lib/types";

export const CATALOG_GROUPS = [
  "化粧品",
  "健康商品",
  "キッチン",
  "ファッション",
  "その他",
] as const;

export type CatalogGroup = (typeof CATALOG_GROUPS)[number];

export const COSMETIC_BRANDS = [
  { id: "SK-II", test: (name: string) => name.includes("SK-II") },
  { id: "資生堂", test: (name: string) => name.includes("資生堂") },
  { id: "KOSE", test: (name: string) => /KOSE|コーセー|雪肌精/i.test(name) },
  { id: "カネボウ", test: (name: string) => /カネボウ|KANEBO|KATE TOKYO|KATE ホイップ/i.test(name) },
  { id: "ちふれ", test: (name: string) => name.includes("ちふれ") },
] as const;

const COSMETIC_DB_CATEGORIES = new Set([
  "スキンケア",
  "メイク",
  "マスク",
  "洗顔",
  "日焼け止め",
]);

export const HEALTH_LINES = [
  { id: "フコイダン" },
  { id: "美容ドリンク" },
  { id: "関節サポート" },
] as const;

const LEGACY_HEALTH_CATEGORIES = new Set([
  "錠剤",
  "ドリンク",
  "海藻",
]);

export type HealthLine = (typeof HEALTH_LINES)[number]["id"];

const HEALTH_LINE_IDS = new Set<string>(HEALTH_LINES.map((line) => line.id));

export function isHealthLine(value: string | undefined): value is HealthLine {
  return Boolean(value && HEALTH_LINE_IDS.has(value));
}

export function catalogGroupOf(
  product: Pick<Product, "name" | "category">,
): CatalogGroup {
  if (
    product.category === "健康食品" ||
    isHealthLine(product.category ?? "") ||
    LEGACY_HEALTH_CATEGORIES.has(product.category ?? "")
  ) {
    return "健康商品";
  }
  if (product.category === "キッチン") {
    return "キッチン";
  }
  if (product.category === "ファッション") {
    return "ファッション";
  }
  if (
    COSMETIC_DB_CATEGORIES.has(product.category ?? "") ||
    COSMETIC_BRANDS.some((brand) => brand.test(product.name))
  ) {
    return "化粧品";
  }
  return "その他";
}

export function cosmeticBrandOf(name: string): string | null {
  return COSMETIC_BRANDS.find((brand) => brand.test(name))?.id ?? null;
}

const SKII_ORDER = [
  "SK-II フェイシャル トリートメント セラム",
  "SK-II フェイシャル トリートメント ジェントル クレンザー",
  "SK-II R.N.A.パワー ラディカル ニュー エイジ",
  "SK-II フェイシャル トリートメント エッセンス",
  "SK-II スキンパワー クリーム",
  "SK-II フェイシャル トリートメント クリア ローション",
  "SK-II フェイシャル トリートメント マスク",
];

const KOSE_ORDER = [
  "KOSE 夜用保湿クリーム",
  "KOSE スリーピングマスク",
  "KOSE 雪肌精 日焼け止め",
  "KOSE インフィニティ ファンデーション",
  "雪肌精 プレストパウダー",
  "KOSE ソフティモ ディープクレンジングオイル",
];

const KANEBO_ORDER = [
  "カネボウ ミラノコレクション フェースパウダー 2026",
  "カネボウ リフレッシング クリーミィ ウォッシュ",
  "カネボウ オン スキン エッセンス＆クリーム",
  "カネボウ KATE ホイップマットBB",
];

const CHIFURE_ORDER = [
  "ちふれ 日焼け止めミルク SPF50+",
  "ちふれ 化粧落としリキッド",
  "ちふれ ウォッシャブル コールドクリーム",
  "ちふれ メーキャップ ベース クリーム UV",
];

export function groupCosmeticsByBrand(products: Product[]) {
  const groups: { id: string; products: Product[] }[] = COSMETIC_BRANDS.map(
    (brand) => {
      const brandProducts = products.filter(
        (product) => cosmeticBrandOf(product.name) === brand.id,
      );
      const ordered =
        brand.id === "SK-II"
          ? sortByNameOrder(brandProducts, SKII_ORDER)
          : brand.id === "KOSE"
            ? sortByNameOrder(brandProducts, KOSE_ORDER)
            : brand.id === "カネボウ"
              ? sortByNameOrder(brandProducts, KANEBO_ORDER)
              : brand.id === "ちふれ"
                ? sortByNameOrder(brandProducts, CHIFURE_ORDER)
                : brandProducts;
      return {
        id: brand.id,
        products: ordered,
      };
    },
  ).filter((group) => group.products.length > 0);

  const unmatched = products.filter(
    (product) => cosmeticBrandOf(product.name) === null,
  );
  if (unmatched.length > 0) {
    groups.push({ id: "その他", products: unmatched });
  }

  return groups;
}

export function resolveHealthLine(
  value: string | undefined,
): HealthLine | undefined {
  if (!value) {
    return undefined;
  }
  if (isHealthLine(value)) {
    return value;
  }
  if (value === "錠剤" || value === "海藻" || value === "ドリンク") {
    return "フコイダン";
  }
  return undefined;
}

export function healthLineOf(
  product: Pick<Product, "name" | "category">,
): HealthLine | null {
  const resolved = resolveHealthLine(product.category ?? undefined);
  if (resolved) {
    return resolved;
  }

  const name = product.name;
  if (
    /関節|グルコサミン|コンドロイチン|カルシウム|コンドロイザー|コシテクター|スクワレン|Squalene|Condroiser|Koshitector|ZS錠/i.test(
      name,
    )
  ) {
    return "関節サポート";
  }
  if (/美容|コラーゲン|プラセンタ|ヒアルロン|82x/i.test(name)) {
    return "美容ドリンク";
  }
  if (/フコイダン|海の雫|モズク|もずく|わかめ|こんぶ|スピルリナ|海藻/.test(name)) {
    return "フコイダン";
  }
  return null;
}

const FUCOIDAN_ORDER = [
  "フコイダン ドリンク",
  "沖縄フコイダン 180粒",
  "海の雫 フコイダン 120粒",
  "オキナワモズク フコイダン",
  "フコイダン原液ドリンク",
  "高純度フコイダン粉末",
];

const COURSE_82X_ORDER = [
  "82x Sakura Premium Collagen",
  "82x Collagen Classic (500ml)",
  "82x Placenta Classic",
];

const JOINT_ORDER = [
  "オリヒロ 高純度グルコサミン 900粒",
  "コンドロイチンZS錠 270錠",
  "オリヒロ 深海鮫エキス 360粒",
  "キューピーコーワ コンドロイザー 90錠",
];

export function is82xCourseProduct(product: Pick<Product, "name">) {
  return /82x/i.test(product.name);
}

function sortByNameOrder(products: Product[], order: readonly string[]) {
  return [...products].sort((a, b) => {
    const aIndex = order.indexOf(a.name);
    const bIndex = order.indexOf(b.name);
    const aRank = aIndex === -1 ? order.length : aIndex;
    const bRank = bIndex === -1 ? order.length : bIndex;
    if (aRank !== bRank) {
      return aRank - bRank;
    }
    return b.created_at.localeCompare(a.created_at);
  });
}

function sortHealthLine(line: HealthLine, products: Product[]) {
  if (line === "フコイダン") {
    return sortByNameOrder(products, FUCOIDAN_ORDER);
  }
  if (line === "美容ドリンク") {
    return sortByNameOrder(products, COURSE_82X_ORDER);
  }
  if (line === "関節サポート") {
    return sortByNameOrder(products, JOINT_ORDER);
  }
  return products;
}

export function groupHealthByLine(products: Product[]) {
  const groups: {
    id: string;
    caption?: string;
    bannerUrl?: string;
    products: Product[];
  }[] = [];

  for (const line of HEALTH_LINES) {
    const lineProducts = sortHealthLine(
      line.id,
      products.filter((product) => healthLineOf(product) === line.id),
    );
    if (lineProducts.length === 0) {
      continue;
    }

    if (line.id === "美容ドリンク") {
      const course = lineProducts.filter(is82xCourseProduct);
      const rest = lineProducts.filter((product) => !is82xCourseProduct(product));
      if (course.length > 0) {
        groups.push({
          id: "82xコース",
          caption:
            "1ヶ月目 Sakura Premium Collagen、2ヶ月目 Collagen Classic、3ヶ月目 Placenta Classic。美肌・スリムボディ向けの3ヶ月コースです。",
          bannerUrl: "/products/82x-course-banner.png?v=3",
          products: course,
        });
      }
      if (rest.length > 0) {
        groups.push({ id: "美容ドリンク", products: rest });
      }
      continue;
    }

    groups.push({ id: line.id, products: lineProducts });
  }

  const unmatched = products.filter((product) => healthLineOf(product) === null);
  if (unmatched.length > 0) {
    groups.push({ id: "その他", products: unmatched });
  }

  return groups;
}

export function isCatalogGroup(value: string): value is CatalogGroup {
  return (CATALOG_GROUPS as readonly string[]).includes(value);
}

/** Maps leftover DB category query params onto the shop groups. */
export function resolveCatalogGroup(
  value: string | undefined,
): CatalogGroup | undefined {
  const trimmed = value?.trim();
  if (!trimmed) {
    return undefined;
  }
  if (isCatalogGroup(trimmed)) {
    return trimmed;
  }
  if (COSMETIC_DB_CATEGORIES.has(trimmed)) {
    return "化粧品";
  }
  if (
    isHealthLine(trimmed) ||
    LEGACY_HEALTH_CATEGORIES.has(trimmed) ||
    trimmed === "健康食品"
  ) {
    return "健康商品";
  }
  if (trimmed === "フード" || trimmed === "雑貨" || trimmed === "文具") {
    return "その他";
  }
  return undefined;
}
