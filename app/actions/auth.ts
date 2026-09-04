"use server";

import { redirect } from "next/navigation";
import { mapAuthError } from "@/lib/auth-errors";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AuthFormState =
  | { ok: true; needsConfirm?: boolean }
  | { ok: false; message: string }
  | null;

function credentials(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  return { email, password };
}

export async function signUp(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (!email || !password) {
    return { ok: false, message: "メールアドレスとパスワードを入力してください。" };
  }

  if (password.length < 6) {
    return { ok: false, message: "パスワードは6文字以上にしてください。" };
  }

  if (password !== confirm) {
    return { ok: false, message: "確認用パスワードが一致しません。" };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { ok: false, message: mapAuthError(error) };
  }

  if (!data.session) {
    return { ok: true, needsConfirm: true };
  }

  redirect("/");
}

export async function signIn(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const { email, password } = credentials(formData);

  if (!email || !password) {
    return { ok: false, message: "メールアドレスとパスワードを入力してください。" };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { ok: false, message: mapAuthError(error) };
  }

  redirect("/");
}

export async function signOut() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/");
}
