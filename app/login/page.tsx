import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getAuthUser } from "@/lib/supabase/server";

export const metadata = {
  title: "ログイン — Mini EC",
};

export default async function LoginPage() {
  const user = await getAuthUser();
  if (user) {
    redirect("/");
  }

  return (
    <main className="mx-auto w-full max-w-[960px] flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-forest">
        ログイン
      </h1>
      <div className="mx-auto max-w-md">
        <AuthForm mode="login" />
      </div>
    </main>
  );
}
