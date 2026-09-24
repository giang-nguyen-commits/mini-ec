"use client";

import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { useCart } from "@/components/cart-provider";
import { CartIcon, SettingsIcon } from "@/components/icons";
import { SiteLogo } from "@/components/site-logo";
import { loginHref } from "@/lib/auth-redirect";

const navLink =
  "inline-flex h-11 items-center leading-none text-[13px] tracking-[0.18em] text-forest-strong transition-opacity duration-200 hover:opacity-60";

export function SiteHeader({ email }: { email: string | null }) {
  const { count } = useCart();

  return (
    <header className="border-b border-black/8 bg-white">
      <div className="relative mx-auto flex h-[72px] max-w-[1120px] items-center justify-between gap-3 px-4 sm:h-[88px] sm:px-6">
        <nav className="hidden min-w-0 items-center gap-6 lg:flex">
          <Link href="/products" className={navLink}>
            商品一覧
          </Link>
          {email ? (
            <Link href="/orders" className={navLink}>
              注文履歴
            </Link>
          ) : null}
        </nav>

        <Link
          href="/"
          className="shrink-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2"
          aria-label="Giang Cosmetic"
        >
          <SiteLogo />
        </Link>

        <nav className="flex h-11 min-w-0 items-center justify-end gap-3 sm:gap-5 lg:ml-auto">
          {email ? (
            <>
              <Link href="/orders" className={`${navLink} lg:hidden`}>
                注文
              </Link>
              <span
                className="hidden h-11 min-w-0 items-center whitespace-nowrap text-[13px] leading-none text-foreground-muted sm:inline-flex"
                title={email}
              >
                {email}
              </span>
              <form action={signOut}>
                <button type="submit" className={navLink}>
                  ログアウト
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className={navLink}>
              ログイン
            </Link>
          )}
          <Link
            href="/cart"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-forest-strong transition-opacity duration-200 hover:opacity-60"
            aria-label={count > 0 ? `カート（${count}点）` : "カート"}
          >
            <span className="relative inline-flex items-center justify-center">
              <CartIcon className="h-[18px] w-[18px]" />
              {count > 0 ? (
                <span className="absolute -right-2.5 -top-2 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-forest px-1 text-[9px] font-semibold leading-none text-white">
                  {count}
                </span>
              ) : null}
            </span>
          </Link>
          <Link
            href={email ? "/account" : loginHref("/account")}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-forest-strong transition-opacity duration-200 hover:opacity-60"
            aria-label="設定"
          >
            <SettingsIcon className="h-[18px] w-[18px]" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
