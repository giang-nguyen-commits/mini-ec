import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/components/cart-provider";
import { ChatWidget } from "@/components/chat-widget";
import { SiteDemoNotice } from "@/components/site-demo-notice";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { APP_NAME, APP_TAGLINE, DEMO_BANNER } from "@/lib/brand";
import { getAuthUser } from "@/lib/supabase/server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: `${APP_TAGLINE}。${DEMO_BANNER}`,
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await getAuthUser();

  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <CartProvider>
          <div className="sticky top-0 z-50">
            <SiteHeader email={user?.email ?? null} />
            <SiteDemoNotice />
          </div>
          {children}
          <SiteFooter />
          <ChatWidget />
        </CartProvider>
      </body>
    </html>
  );
}
