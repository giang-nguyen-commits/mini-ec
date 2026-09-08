import { Suspense } from "react";
import { CheckoutForm } from "@/components/checkout-form";

export const metadata = {
  title: "ご注文 — Mini EC",
};

export default function CheckoutPage() {
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
