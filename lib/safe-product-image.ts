import { catalogGroupOf, healthLineOf } from "@/lib/catalog";
import type { Product } from "@/lib/types";

const UNSPLASH = {
  skincare: [
    "https://images.unsplash.com/photo-1570172619604-71b782d49e12?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
  ],
  wash: [
    "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80",
  ],
  mask: [
    "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=800&q=80",
  ],
  uv: [
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
  ],
  makeup: [
    "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=800&q=80",
  ],
  health: [
    "https://images.unsplash.com/photo-1505751171710-1f6d0ace5a85?auto=format&fit=crop&w=800&q=80",
  ],
  drink: [
    "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=800&q=80",
  ],
  fashion: [
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
  ],
  kitchen: [
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80",
  ],
  other: [
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
  ],
} as const;

type ImageKind = keyof typeof UNSPLASH;

const COSMETIC_KIND: Record<string, ImageKind> = {
  スキンケア: "skincare",
  洗顔: "wash",
  マスク: "mask",
  日焼け止め: "uv",
  メイク: "makeup",
};

export const SUBMISSION_HERO = {
  cosmetics:
    "https://images.unsplash.com/photo-1570172619604-71b782d49e12?auto=format&fit=crop&w=1600&q=80",
  health:
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1600&q=80",
  drinkBanner:
    "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=1600&q=80",
} as const;

function stableIndex(value: string, modulo: number) {
  let hash = 0;
  for (const char of value) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return modulo === 0 ? 0 : hash % modulo;
}

function imageKind(product: {
  name: string;
  category?: string | null;
}): ImageKind {
  const category = product.category ?? "";
  if (category in COSMETIC_KIND) {
    return COSMETIC_KIND[category];
  }
  const health = healthLineOf({
    name: product.name,
    category: product.category ?? null,
  });
  if (health === "美容ドリンク") {
    return "drink";
  }
  if (health === "フコイダン" || health === "関節サポート") {
    return "health";
  }
  const group = catalogGroupOf({
    name: product.name,
    category: product.category ?? null,
  });
  if (group === "ファッション") {
    return "fashion";
  }
  if (group === "キッチン") {
    return "kitchen";
  }
  if (group === "化粧品") {
    return "skincare";
  }
  return "other";
}

export function isManufacturerImage(url: string | null | undefined) {
  if (!url) {
    return true;
  }
  if (url.includes("images.unsplash.com") || url.includes("plus.unsplash.com")) {
    return false;
  }
  return (
    url.startsWith("/products/") ||
    url.startsWith("/images/") ||
    url.startsWith("/shop-hero") ||
    url.includes("ctfassets.net") ||
    url.includes("sk-ii") ||
    url.includes("shiseido")
  );
}

export function safeProductImage(product: {
  id?: string;
  name: string;
  category?: string | null;
  image_url: string | null;
}) {
  if (!isManufacturerImage(product.image_url)) {
    return product.image_url;
  }
  const kind = imageKind(product);
  const pool = UNSPLASH[kind];
  const key = product.id ?? product.name;
  return pool[stableIndex(key, pool.length)] ?? pool[0];
}

export function withSafeProductImage<T extends Pick<Product, "name" | "image_url"> & Partial<Product>>(
  product: T,
): T {
  return {
    ...product,
    image_url: safeProductImage(product),
  };
}
