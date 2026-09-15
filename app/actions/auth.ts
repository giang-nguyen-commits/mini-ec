"use server";

import { redirect } from "next/navigation";
import { mapAuthError } from "@/lib/auth-errors";
import { safeNextPath } from "@/lib/auth-redirect";
import { getBaseUrl } from "@/lib/base-url";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AuthFormState =
  | { ok: true; needsConfirm?: boolean }
  | { ok: false; message: string }
  | null;

function nextPath(formData: FormData) {
  return safeNextPath(formData.get("next"));
}

function credentials(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  return { email, password };
}

function confirmRedirectUrl(next: string) {
  const url = new URL("/auth/callback", getBaseUrl());
  if (next !== "/") {
    url.searchParams.set("next", next);
  }
  return url.toString();
}

export async function signUp(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");
  const next = nextPath(formData);

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
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: confirmRedirectUrl(next),
    },
  });

  if (error) {
    return { ok: false, message: mapAuthError(error) };
  }

  const identities = data.user?.identities ?? [];
  if (data.user && identities.length === 0) {
    return {
      ok: false,
      message: "このメールアドレスはすでに登録されています。",
    };
  }

  if (!data.session) {
    return { ok: true, needsConfirm: true };
  }

  redirect(next);
}

export async function signIn(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const { email, password } = credentials(formData);
  const next = nextPath(formData);

  if (!email || !password) {
    return { ok: false, message: "メールアドレスとパスワードを入力してください。" };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { ok: false, message: mapAuthError(error) };
  }

  redirect(next);
}

export async function signOut() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/");
}
