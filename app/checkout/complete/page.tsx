import { redirect } from "next/navigation";

export default async function CheckoutCompleteAliasPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string; session_id?: string }>;
}) {
  const params = await searchParams;
  const qs = new URLSearchParams();
  if (params.orderId) {
    qs.set("orderId", params.orderId);
  }
  if (params.session_id) {
    qs.set("session_id", params.session_id);
  }
  const suffix = qs.toString();
  redirect(suffix ? `/checkout/success?${suffix}` : "/checkout/success");
}
