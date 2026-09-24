import {
  catalogGroupOf,
  cosmeticBrandOf,
  healthLineOf,
} from "@/lib/catalog";
import type { Product } from "@/lib/types";

export const SEARCH_SUGGESTIONS = [
  "ちふれ",
  "SK-II",
  "資生堂",
  "日焼け止め",
  "コラーゲン",
  "フコイダン",
  "洗顔",
  "82x",
] as const;

const SEARCH_SYNONYMS: Record<string, string[]> = {
  コラーゲン: ["コラーゲン", "collagen"],
  collagen: ["コラーゲン", "collagen"],
  日焼け止め: ["日焼け止め", "uv", "サン"],
  uv: ["日焼け止め", "uv"],
  美容液: ["美容液", "セラム", "エッセンス"],
  洗顔: ["洗顔", "クレンジング", "ウォッシュ", "化粧落とし"],
  クレンジング: ["クレンジング", "化粧落とし", "洗顔"],
  マスク: ["マスク"],
  フコイダン: ["フコイダン", "もずく", "モズク"],
  関節: ["関節", "グルコサミン", "コンドロイチン"],
  グルコサミン: ["グルコサミン", "コンドロイチン", "関節"],
};

function normalizeSearch(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s\-・＿_]/g, "");
}

export function expandSearchNeedles(query: string) {
  const tokens = query
    .split(/[\s,、]+/)
    .map((token) => token.trim())
    .filter(Boolean);

  const needles = new Set<string>();
  for (const token of tokens.length > 0 ? tokens : [query]) {
    const normalized = normalizeSearch(token);
    if (!normalized) {
      continue;
    }
    needles.add(normalized);
    const synonyms = SEARCH_SYNONYMS[token] ?? SEARCH_SYNONYMS[normalized];
    for (const synonym of synonyms ?? []) {
      const next = normalizeSearch(synonym);
      if (next) {
        needles.add(next);
      }
    }
  }

  return [...needles];
}

export function productMatchesQuery(product: Product, query: string) {
  const needles = expandSearchNeedles(query);
  if (needles.length === 0) {
    return true;
  }

  const haystack = normalizeSearch(
    [
      product.name,
      product.description,
      product.ingredients ?? "",
      product.category ?? "",
      ...(product.skin_concern_tags ?? []),
      catalogGroupOf(product),
      cosmeticBrandOf(product.name) ?? "",
      healthLineOf(product) ?? "",
    ].join(" "),
  );

  return needles.some((needle) => haystack.includes(needle));
}
