import type Stripe from "stripe";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";
import type { CartItem, Order, OrderItemSnapshot } from "@/lib/types";

type RpcResult = {
  ok?: boolean;
  reason?: string;
  orderId?: string;
  total?: number;
  items?: OrderItemSnapshot[];
};

const orderColumns =
  "id, user_id, customer_name, phone, address, total, items, status, stripe_session_id, created_at";

function rpcErrorMessage(error: { message?: string; details?: string } | null) {
  const text = `${error?.message ?? ""} ${error?.details ?? ""}`;
  if (text.includes("LOGIN_REQUIRED")) {
    return "ログインしてからお進みください。";
  }
  if (text.includes("EMPTY_CART")) {
    return "カートが空です。";
  }
  if (text.includes("PRODUCT_NOT_FOUND")) {
    return "カート内の商品が販売終了になっています。";
  }
  if (text.includes("NO_STOCK")) {
    return "在庫のある商品がありません。";
  }
  return "注文を保存できませんでした。時間をおいて再度お試しください。";
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("orders")
    .select(orderColumns)
    .eq("id", orderId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as Order | null) ?? null;
}

export async function reserveStockAndCreateOrder(input: {
  userId: string;
  customerName: string;
  phone: string;
  address: string;
  items: CartItem[];
}): Promise<
  | { ok: true; orderId: string; total: number }
  | { ok: false; message: string }
> {
  const supabase = createAdminSupabaseClient();
  const orderId = crypto.randomUUID();
  const { data, error } = await supabase.rpc("reserve_stock_and_create_order", {
    p_order_id: orderId,
    p_user_id: input.userId,
    p_customer_name: input.customerName,
    p_phone: input.phone,
    p_address: input.address,
    p_items: input.items,
  });

  if (error) {
    return { ok: false, message: rpcErrorMessage(error) };
  }

  const result = data as RpcResult | null;
  if (!result?.ok || typeof result.total !== "number") {
    return { ok: false, message: rpcErrorMessage(null) };
  }

  return { ok: true, orderId, total: result.total };
}

export async function saveStripeSessionId(orderId: string, sessionId: string) {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("orders")
    .update({ stripe_session_id: sessionId })
    .eq("id", orderId)
    .eq("status", "pending");

  if (error) {
    throw error;
  }
}

export async function markOrderPaid(orderId: string, sessionId?: string | null) {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase.rpc("mark_order_paid", {
    p_order_id: orderId,
    p_session_id: sessionId ?? null,
  });

  if (error) {
    throw error;
  }

  return (data as RpcResult | null) ?? { ok: false, reason: "empty" };
}

export async function cancelPendingOrder(orderId: string) {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase.rpc("cancel_pending_order", {
    p_order_id: orderId,
  });

  if (error) {
    throw error;
  }

  return (data as RpcResult | null) ?? { ok: false, reason: "empty" };
}

async function expireCheckoutSession(sessionId: string) {
  try {
    await getStripe().checkout.sessions.expire(sessionId);
  } catch {
    // Already expired, completed, or not expireable.
  }
}

function sessionOrderId(session: Stripe.Checkout.Session) {
  return (
    session.metadata?.orderId ??
    session.metadata?.order_id ??
    (typeof session.client_reference_id === "string"
      ? session.client_reference_id
      : null)
  );
}

export async function fulfillPaidSession(session: Stripe.Checkout.Session) {
  const orderId = sessionOrderId(session) ?? undefined;
  if (!orderId) {
    return { ok: false as const, reason: "missing_order" };
  }

  if (session.payment_status !== "paid") {
    return { ok: false as const, reason: "not_paid" };
  }

  return markOrderPaid(orderId, session.id);
}

export async function confirmPaidCheckout(input: {
  userId: string;
  orderId?: string;
  sessionId?: string;
}): Promise<{ status: "paid" | "pending" | "unpaid"; order: Order | null }> {
  let orderId = input.orderId?.trim() || "";
  let session: Stripe.Checkout.Session | null = null;

  if (input.sessionId) {
    try {
      session = await getStripe().checkout.sessions.retrieve(input.sessionId);
    } catch {
      session = null;
    }

    if (session) {
      const sessionOrder = sessionOrderId(session);
      if (sessionOrder) {
        if (orderId && orderId !== sessionOrder) {
          return { status: "unpaid", order: null };
        }
        orderId = sessionOrder;
      }

      if (session.payment_status === "paid" && orderId) {
        await markOrderPaid(orderId, session.id);
      }
    }
  }

  if (!orderId) {
    return { status: "unpaid", order: null };
  }

  const order = await getOrderById(orderId);
  if (!order || order.user_id !== input.userId) {
    return { status: "unpaid", order: null };
  }

  if (order.status === "paid") {
    return { status: "paid", order };
  }

  if (order.status === "pending") {
    return { status: "pending", order };
  }

  return { status: "unpaid", order };
}

export async function cancelUnpaidCheckout(input: {
  userId: string;
  orderId: string;
  sessionId?: string;
}) {
  const order = await getOrderById(input.orderId);
  if (!order || order.user_id !== input.userId) {
    return { ok: false as const, reason: "forbidden" };
  }

  if (order.status !== "pending") {
    return { ok: true as const, reason: order.status };
  }

  const sessionId = input.sessionId || order.stripe_session_id;
  if (sessionId) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(sessionId);
      if (session.payment_status === "paid") {
        await markOrderPaid(order.id, session.id);
        return { ok: true as const, reason: "paid" };
      }
    } catch {
      // Session missing; still cancel the pending reservation.
    }
    await expireCheckoutSession(sessionId);
  }

  return cancelPendingOrder(order.id);
}
