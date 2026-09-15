import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { Order } from "@/lib/types";

const orderColumns =
  "id, user_id, customer_name, phone, address, total, items, status, stripe_session_id, created_at";

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("orders")
    .select(orderColumns)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data as Order[] | null) ?? [];
}

export async function getOrderByIdForUser(
  orderId: string,
  userId: string,
): Promise<Order | null> {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("orders")
    .select(orderColumns)
    .eq("id", orderId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    if (error.code === "22P02") {
      return null;
    }
    throw error;
  }

  return (data as Order | null) ?? null;
}
