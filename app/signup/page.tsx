import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getAuthUser } from "@/lib/supabase/server";

export const metadata = {
  title: "新規登録 — Mini EC",
};

export default async function SignupPage() {
  const user = await getAuthUser();
  if (user) {
    redirect("/");
  }

  return (
    <main className="mx-auto w-full max-w-[960px] flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-forest">
        新規登録
      </h1>
      <div className="mx-auto max-w-md">
        <AuthForm mode="signup" />
      </div>
    </main>
  );
}
