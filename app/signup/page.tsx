import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { safeNextPath } from "@/lib/auth-redirect";
import { APP_NAME } from "@/lib/brand";
import { getAuthUser } from "@/lib/supabase/server";

export const metadata = {
  title: `新規登録 — ${APP_NAME}`,
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const params = await searchParams;
  const next = safeNextPath(Array.isArray(params.next) ? params.next[0] : params.next);
  const user = await getAuthUser();
  if (user) {
    redirect(next);
  }

  return (
    <main className="mx-auto w-full max-w-[960px] flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="mb-6 font-[family-name:var(--font-heading)] text-[28px] font-semibold tracking-tight text-forest sm:text-[32px]">
        新規登録
      </h1>
      <div className="mx-auto max-w-md">
        <AuthForm mode="signup" next={next} />
      </div>
    </main>
  );
}
