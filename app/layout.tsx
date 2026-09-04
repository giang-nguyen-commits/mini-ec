import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/components/cart-provider";
import { SiteHeader } from "@/components/site-header";
import { getAuthUser } from "@/lib/supabase/server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mini EC",
  description: "小さなセレクトショップ",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await getAuthUser();

  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-emerald-50/40 text-zinc-900">
        <CartProvider>
          <SiteHeader email={user?.email ?? null} />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
