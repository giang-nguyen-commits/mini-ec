"use client";

import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { useCart } from "@/components/cart-provider";

export function SiteHeader({ email }: { email: string | null }) {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-900/10 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[960px] items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-forest"
        >
          Mini EC
        </Link>
        <nav className="flex min-w-0 items-center gap-1 sm:gap-2">
          <Link
            href="/products"
            className="rounded-full px-3 py-1.5 text-sm font-medium text-forest hover:bg-emerald-50"
          >
            商品一覧
          </Link>
          {email ? (
            <>
              <span
                className="hidden max-w-[160px] truncate text-xs text-zinc-500 sm:inline sm:text-sm"
                title={email}
              >
                {email}
              </span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="rounded-full px-3 py-1.5 text-sm font-medium text-forest hover:bg-emerald-50"
                >
                  ログアウト
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full px-3 py-1.5 text-sm font-medium text-forest hover:bg-emerald-50"
            >
              ログイン
            </Link>
          )}
          <Link
            href="/cart"
            className="relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-forest hover:bg-emerald-50"
            aria-label={count > 0 ? `カート（${count}点）` : "カート"}
          >
            カート
            {count > 0 ? (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-forest px-1 text-[10px] font-semibold text-white">
                {count}
              </span>
            ) : null}
          </Link>
        </nav>
      </div>
    </header>
  );
}
