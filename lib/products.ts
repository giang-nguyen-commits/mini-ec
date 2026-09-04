import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";

const productColumns =
  "id, name, price, stock, description, image_url, created_at, updated_at";

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(productColumns)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export const getProductById = cache(async (id: string): Promise<Product | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(productColumns)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    if (error.code === "22P02" || error.code === "PGRST116") {
      return null;
    }
    throw error;
  }

  return data;
});
