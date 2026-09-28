"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  applyAdd,
  applyRemove,
  applySetQuantity,
  getCartCount,
  getCartSnapshot,
  getServerCartSnapshot,
  persistCart,
  subscribeCart,
} from "@/lib/cart";
import type { CartItem } from "@/lib/types";

type AddResult =
  | { ok: false; clamped: false }
  | { ok: true; clamped: boolean; quantity: number };

type CartContextValue = {
  items: CartItem[];
  count: number;
  addItem: (productId: string, stock: number, quantity?: number) => AddResult;
  setItemQuantity: (
    productId: string,
    quantity: number,
    stock: number,
  ) => void;
  removeItem: (productId: string) => void;
  replaceItems: (items: CartItem[]) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    getServerCartSnapshot,
  );

  const addItem = useCallback(
    (productId: string, stock: number, quantity = 1): AddResult => {
      const result = applyAdd(items, productId, stock, quantity);
      if (result.ok) {
        persistCart(result.items);
      }
      return result;
    },
    [items],
  );

  const setItemQuantity = useCallback(
    (productId: string, quantity: number, stock: number) => {
      persistCart(applySetQuantity(items, productId, quantity, stock));
    },
    [items],
  );

  const removeItem = useCallback((productId: string) => {
    persistCart(applyRemove(items, productId));
  }, [items]);

  const replaceItems = useCallback((next: CartItem[]) => {
    persistCart(next);
  }, []);

  const clear = useCallback(() => {
    persistCart([]);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: getCartCount(items),
      addItem,
      setItemQuantity,
      removeItem,
      replaceItems,
      clear,
    }),
    [addItem, clear, items, removeItem, replaceItems, setItemQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart は CartProvider 内で使ってください。");
  }
  return context;
}
