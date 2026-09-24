import { CartView } from "@/components/cart-view";
import { APP_NAME } from "@/lib/brand";

export const metadata = {
  title: `カート — ${APP_NAME}`,
};

export default function CartPage() {
  return (
    <main className="mx-auto w-full max-w-[960px] flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="mb-6 font-[family-name:var(--font-heading)] text-[28px] font-semibold tracking-tight text-forest sm:text-[32px]">
        カート
      </h1>
      <CartView />
    </main>
  );
}
