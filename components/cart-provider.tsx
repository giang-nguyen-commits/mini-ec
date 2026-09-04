"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  applyAdd,
  applyRemove,
  applySetQuantity,
  CART_STORAGE_KEY,
  getCartCount,
  persistCart,
  readCart,
} from "@/lib/cart";
import type { CartItem } from "@/lib/types";

type AddResult =
  | { ok: false; clamped: false }
  | { ok: true; clamped: boolean; quantity: number };

type CartContextValue = {
  items: CartItem[];
  ready: boolean;
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
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  const commit = useCallback((next: CartItem[]) => {
    setItems(next);
    persistCart(next);
  }, []);

  useEffect(() => {
    setItems(readCart().items);
    setReady(true);
  }, []);

  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key !== CART_STORAGE_KEY) {
        return;
      }
      setItems(readCart().items);
    }

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addItem = useCallback(
    (productId: string, stock: number, quantity = 1): AddResult => {
      const result = applyAdd(items, productId, stock, quantity);
      if (result.ok) {
        commit(result.items);
      }
      return result;
    },
    [commit, items],
  );

  const setItemQuantity = useCallback(
    (productId: string, quantity: number, stock: number) => {
      commit(applySetQuantity(items, productId, quantity, stock));
    },
    [commit, items],
  );

  const removeItem = useCallback(
    (productId: string) => {
      commit(applyRemove(items, productId));
    },
    [commit, items],
  );

  const replaceItems = useCallback(
    (next: CartItem[]) => {
      commit(next);
    },
    [commit],
  );

  const clear = useCallback(() => {
    commit([]);
  }, [commit]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      ready,
      count: getCartCount(items),
      addItem,
      setItemQuantity,
      removeItem,
      replaceItems,
      clear,
    }),
    [addItem, clear, items, ready, removeItem, replaceItems, setItemQuantity],
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
