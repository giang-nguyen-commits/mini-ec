import { redirect } from "next/navigation";
import { AccountForm } from "@/components/account-form";
import { loginHref } from "@/lib/auth-redirect";
import { APP_NAME } from "@/lib/brand";
import { getAuthUser } from "@/lib/supabase/server";

export const metadata = {
  title: `アカウント設定 — ${APP_NAME}`,
};

export default async function AccountPage() {
  const user = await getAuthUser();
  if (!user) {
    redirect(loginHref("/account"));
  }

  return (
    <main className="mx-auto w-full max-w-[960px] flex-1 px-4 py-6 pb-28 sm:px-6 sm:py-8">
      <h1 className="mb-2 font-[family-name:var(--font-heading)] text-[28px] font-semibold tracking-tight text-forest sm:text-[32px]">
        アカウント設定
      </h1>
      <p className="mb-6 text-sm text-foreground-muted">
        お名前・連絡先・お届け先を保存できます。この端末にのみ保存されます。
      </p>
      <div className="mx-auto max-w-md">
        <AccountForm loginEmail={user.email ?? ""} />
      </div>
    </main>
  );
}
