import { catalogGroupOf } from "@/lib/catalog";
import type { Product } from "@/lib/types";

export const CHAT_MODEL =
  process.env.AI_GATEWAY_MODEL?.trim() || "google/gemini-3.5-flash-lite";

export const MAX_CHAT_MESSAGES = 8;
export const MAX_CHAT_CHARS = 500;

export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

export function parseChatTurns(value: unknown): ChatTurn[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const turns: ChatTurn[] = [];
  for (const item of value.slice(-MAX_CHAT_MESSAGES)) {
    if (!item || typeof item !== "object") {
      return null;
    }
    const role = "role" in item ? item.role : null;
    const content = "content" in item ? item.content : null;
    if (
      (role !== "user" && role !== "assistant") ||
      typeof content !== "string"
    ) {
      return null;
    }
    const text = content.trim();
    if (!text || text.length > MAX_CHAT_CHARS) {
      return null;
    }
    turns.push({ role, content: text });
  }

  return turns.length > 0 ? turns : null;
}

export function formatCatalogForChat(products: Product[]): string {
  return products
    .slice(0, 50)
    .map((product) => {
      const concerns = product.skin_concern_tags.join("・") || "なし";
      const stock = product.stock > 0 ? `在庫${product.stock}` : "売り切れ";
      return `- ${product.name} / ${catalogGroupOf(product)} / ¥${product.price} / ${stock} / 肌悩み:${concerns}`;
    })
    .join("\n");
}
