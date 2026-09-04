import { CartView } from "@/components/cart-view";

export const metadata = {
  title: "カート — Mini EC",
};

export default function CartPage() {
  return (
    <main className="mx-auto w-full max-w-[960px] flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-forest">
        カート
      </h1>
      <CartView />
    </main>
  );
}
