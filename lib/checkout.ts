import type { CartItem, CartLine, Product } from "@/lib/types";

export function buildCartLines(
  items: CartItem[],
  products: Product[],
): { lines: CartLine[]; dropped: boolean; clamped: boolean } {
  const productMap = new Map(products.map((product) => [product.id, product]));
  const lines: CartLine[] = [];
  let dropped = false;
  let clamped = false;

  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) {
      dropped = true;
      continue;
    }

    const soldOut = product.stock <= 0;
    let quantity = item.quantity;

    if (!soldOut && quantity > product.stock) {
      quantity = product.stock;
      clamped = true;
    }

    if (quantity < 1) {
      quantity = 1;
    }

    lines.push({
      productId: product.id,
      quantity,
      product,
      soldOut,
      lineTotal: soldOut ? 0 : product.price * quantity,
    });
  }

  return { lines, dropped, clamped };
}

export function payableLines(lines: CartLine[]) {
  return lines.filter((line) => !line.soldOut);
}

export function cartTotal(lines: CartLine[]) {
  return payableLines(lines).reduce((sum, line) => sum + line.lineTotal, 0);
}
