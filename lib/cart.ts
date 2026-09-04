import type { CartItem, CartState } from "@/lib/types";

export const CART_STORAGE_KEY = "mini-ec:cart";

export function emptyCart(): CartState {
  return { items: [], updatedAt: new Date().toISOString() };
}

export function parseCart(raw: string | null): CartState {
  if (!raw) {
    return emptyCart();
  }

  try {
    const parsed = JSON.parse(raw) as CartState;
    if (!Array.isArray(parsed.items)) {
      return emptyCart();
    }

    const items = parsed.items.filter(
      (item) =>
        typeof item?.productId === "string" &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0,
    );

    return {
      items,
      updatedAt:
        typeof parsed.updatedAt === "string"
          ? parsed.updatedAt
          : new Date().toISOString(),
    };
  } catch {
    return emptyCart();
  }
}

export function readCart(): CartState {
  if (typeof window === "undefined") {
    return emptyCart();
  }

  return parseCart(window.localStorage.getItem(CART_STORAGE_KEY));
}

export function persistCart(items: CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  const cart: CartState = {
    items,
    updatedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

export function getCartCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function applyAdd(
  items: CartItem[],
  productId: string,
  stock: number,
  quantity: number,
): { items: CartItem[]; ok: false; clamped: false } | {
  items: CartItem[];
  ok: true;
  clamped: boolean;
  quantity: number;
} {
  if (stock <= 0 || !Number.isInteger(quantity) || quantity < 1) {
    return { items, ok: false, clamped: false };
  }

  const existing = items.find((item) => item.productId === productId);
  const requested = (existing?.quantity ?? 0) + quantity;
  const nextQuantity = Math.min(stock, requested);
  const clamped = nextQuantity < requested;

  if (existing) {
    return {
      items: items.map((item) =>
        item.productId === productId
          ? { ...item, quantity: nextQuantity }
          : item,
      ),
      ok: true,
      clamped,
      quantity: nextQuantity,
    };
  }

  return {
    items: [...items, { productId, quantity: nextQuantity }],
    ok: true,
    clamped,
    quantity: nextQuantity,
  };
}

export function applySetQuantity(
  items: CartItem[],
  productId: string,
  quantity: number,
  stock: number,
) {
  if (stock <= 0) {
    return items;
  }

  const nextQuantity = Math.min(stock, Math.max(1, quantity));

  return items.map((item) =>
    item.productId === productId ? { ...item, quantity: nextQuantity } : item,
  );
}

export function applyRemove(items: CartItem[], productId: string) {
  return items.filter((item) => item.productId !== productId);
}
