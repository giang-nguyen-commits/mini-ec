"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, signUp, type AuthFormState } from "@/app/actions/auth";
import { loginHref, signupHref } from "@/lib/auth-redirect";

export function AuthForm({
  mode,
  next = "/",
}: {
  mode: "login" | "signup";
  next?: string;
}) {
  const action = mode === "login" ? signIn : signUp;
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(
    action,
    null,
  );

  if (state?.ok && state.needsConfirm) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white px-6 py-12 text-center">
        <p className="font-medium text-zinc-900">確認メールを送信しました</p>
        <p className="mt-2 text-sm text-zinc-500">
          メール内のリンクを開くと登録が完了します。届かない場合は迷惑メールフォルダも確認してください。
        </p>
        <Link
          href={loginHref(next)}
          className="mt-6 inline-flex rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
        >
          ログインへ
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
      <input type="hidden" name="next" value={next} />
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-zinc-800">
          メールアドレス
        </span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="h-11 w-full rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-forest"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-zinc-800">
          パスワード
        </span>
        <input
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          className="h-11 w-full rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-forest"
        />
      </label>
      {mode === "signup" ? (
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-zinc-800">
            パスワード（確認）
          </span>
          <input
            name="confirmPassword"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            className="h-11 w-full rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-forest"
          />
        </label>
      ) : null}

      {state && !state.ok ? (
        <p className="text-sm text-red-600" role="alert">
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="h-11 w-full rounded-xl bg-forest text-sm font-medium text-white hover:bg-emerald-800 disabled:bg-zinc-300"
      >
        {pending
          ? "処理中..."
          : mode === "login"
            ? "ログイン"
            : "新規登録"}
      </button>

      <p className="text-center text-sm text-zinc-500">
        {mode === "login" ? (
          <>
            アカウントをお持ちでない方は{" "}
            <Link href={signupHref(next)} className="font-medium text-zinc-900 underline">
              新規登録
            </Link>
          </>
        ) : (
          <>
            すでにアカウントをお持ちの方は{" "}
            <Link href={loginHref(next)} className="font-medium text-zinc-900 underline">
              ログイン
            </Link>
          </>
        )}
      </p>
      {mode === "signup" ? (
        <p className="text-center text-xs text-zinc-400">UIは日本語固定です</p>
      ) : null}
    </form>
  );
}
