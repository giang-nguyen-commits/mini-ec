import { Suspense } from "react";
import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/checkout-form";
import { loginHref } from "@/lib/auth-redirect";
import { cancelUnpaidCheckout } from "@/lib/order-lifecycle";
import { getAuthUser } from "@/lib/supabase/server";

export const metadata = {
  title: "ご注文 — Mini EC",
};

function checkoutNextPath(params: {
  canceled?: string;
  orderId?: string;
  session_id?: string;
}) {
  const query = new URLSearchParams();
  if (params.canceled === "1") {
    query.set("canceled", "1");
  }
  if (params.orderId) {
    query.set("orderId", params.orderId);
  }
  if (params.session_id) {
    query.set("session_id", params.session_id);
  }
  const suffix = query.toString();
  return suffix ? `/checkout?${suffix}` : "/checkout";
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{
    canceled?: string;
    orderId?: string;
    session_id?: string;
  }>;
}) {
  const params = await searchParams;
  const user = await getAuthUser();
  if (!user) {
    redirect(loginHref(checkoutNextPath(params)));
  }

  if (params.canceled === "1" && params.orderId) {
    await cancelUnpaidCheckout({
      userId: user.id,
      orderId: params.orderId,
      sessionId: params.session_id,
    });
  }

  return (
    <main className="mx-auto w-full max-w-[960px] flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-forest">
        ご注文
      </h1>
      <Suspense
        fallback={
          <div
            className="h-64 animate-pulse rounded-xl border border-zinc-200 bg-white"
            role="status"
            aria-label="注文を読み込み中"
          />
        }
      >
        <CheckoutForm />
      </Suspense>
    </main>
  );
}
