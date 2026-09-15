import { cache } from "react";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";

const productColumns =
  "id, name, price, stock, description, image_url, category, is_authentic, origin, ingredients, skin_concern_tags, skin_type, created_at, updated_at";

const legacyProductColumns =
  "id, name, price, stock, description, image_url, created_at, updated_at";

function isMissingColumnError(error: { code?: string; message?: string } | null) {
  return error?.code === "42703" || /column .* does not exist/i.test(error?.message ?? "");
}

function escapeIlike(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}

export type ProductListFilters = {
  q?: string;
  category?: string;
  concern?: string;
};

export async function getProducts(
  filters: ProductListFilters = {},
): Promise<Product[]> {
  await connection();
  const supabase = await createClient();
  const q = filters.q?.trim();
  const category = filters.category?.trim();
  const concern = filters.concern?.trim();

  let query = supabase
    .from("products")
    .select(productColumns)
    .order("created_at", { ascending: false });

  if (q) {
    const like = `%${escapeIlike(q).replace(/,/g, " ")}%`;
    query = query.or(`name.ilike.${like},ingredients.ilike.${like}`);
  }
  if (category) {
    query = query.eq("category", category);
  }
  if (concern) {
    query = query.contains("skin_concern_tags", [concern]);
  }

  const { data, error } = await query;

  if (isMissingColumnError(error)) {
    let fallback = supabase
      .from("products")
      .select(legacyProductColumns)
      .order("created_at", { ascending: false });

    if (q) {
      fallback = fallback.ilike("name", `%${escapeIlike(q)}%`);
    }

    const retry = await fallback;
    if (retry.error) {
      throw retry.error;
    }

    return (retry.data ?? []).map((row) => normalizeProduct(row as Product));
  }

  if (error) {
    throw error;
  }

  return (data ?? []).map(normalizeProduct);
}

export async function getProductCategories(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("category");

  if (isMissingColumnError(error)) {
    return [];
  }

  if (error) {
    throw error;
  }

  const categories = [
    ...new Set(
      (data ?? [])
        .map((row) => row.category)
        .filter((value): value is string => Boolean(value && value.trim())),
    ),
  ];

  return categories.sort((a, b) => a.localeCompare(b, "ja"));
}

export async function getProductSkinConcerns(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("skin_concern_tags");

  if (isMissingColumnError(error)) {
    return [];
  }

  if (error) {
    throw error;
  }

  const tags = [
    ...new Set(
      (data ?? []).flatMap((row) =>
        Array.isArray(row.skin_concern_tags) ? row.skin_concern_tags : [],
      ),
    ),
  ].filter((value) => value.trim().length > 0);

  return tags.sort((a, b) => a.localeCompare(b, "ja"));
}

export const getProductById = cache(async (id: string): Promise<Product | null> => {
  await connection();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(productColumns)
    .eq("id", id)
    .maybeSingle();

  if (isMissingColumnError(error)) {
    const fallback = await supabase
      .from("products")
      .select(legacyProductColumns)
      .eq("id", id)
      .maybeSingle();

    if (fallback.error) {
      if (fallback.error.code === "22P02" || fallback.error.code === "PGRST116") {
        return null;
      }
      throw fallback.error;
    }

    return fallback.data ? normalizeProduct(fallback.data as Product) : null;
  }

  if (error) {
    if (error.code === "22P02" || error.code === "PGRST116") {
      return null;
    }
    throw error;
  }

  return data ? normalizeProduct(data) : null;
});

function normalizeProduct(row: Product): Product {
  return {
    ...row,
    is_authentic: row.is_authentic ?? true,
    skin_concern_tags: row.skin_concern_tags ?? [],
    category: row.category ?? null,
    origin: row.origin ?? null,
    ingredients: row.ingredients ?? null,
    skin_type: row.skin_type ?? null,
  };
}

const cosmeticsCategories = new Set(["スキンケア", "メイク"]);

export function isCosmeticsProduct(product: Pick<Product, "category">) {
  return cosmeticsCategories.has(product.category ?? "");
}
