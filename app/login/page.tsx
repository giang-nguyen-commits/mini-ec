import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { safeNextPath } from "@/lib/auth-redirect";
import { getAuthUser } from "@/lib/supabase/server";

export const metadata = {
  title: "ログイン — Mini EC",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[]; error?: string | string[] }>;
}) {
  const params = await searchParams;
  const next = safeNextPath(Array.isArray(params.next) ? params.next[0] : params.next);
  const error = Array.isArray(params.error) ? params.error[0] : params.error;
  const user = await getAuthUser();
  if (user) {
    redirect(next);
  }

  return (
    <main className="mx-auto w-full max-w-[960px] flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="mb-2 text-2xl font-semibold tracking-tight text-forest">
        ログイン
      </h1>
      <p className="mb-6 text-sm text-zinc-500">正規品の日本コスメを、安心して。</p>
      {error === "confirm" ? (
        <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800" role="status">
          メール確認に失敗しました。リンクの有効期限が切れている場合は、もう一度新規登録してください。
        </p>
      ) : null}
      <div className="mx-auto max-w-md">
        <AuthForm mode="login" next={next} />
      </div>
    </main>
  );
}
