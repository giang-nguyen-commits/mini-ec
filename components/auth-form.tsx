"use client";

import Link from "next/link";
import { useActionState, useRef } from "react";
import { signIn, signUp, type AuthFormState } from "@/app/actions/auth";
import { loginHref, signupHref } from "@/lib/auth-redirect";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/lib/brand";

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
  const formRef = useRef<HTMLFormElement>(null);

  function fillDemoAccount() {
    const form = formRef.current;
    if (!form) {
      return;
    }
    const email = form.elements.namedItem("email");
    const password = form.elements.namedItem("password");
    if (email instanceof HTMLInputElement) {
      email.value = DEMO_EMAIL;
    }
    if (password instanceof HTMLInputElement) {
      password.value = DEMO_PASSWORD;
    }
  }

  if (state?.ok && state.needsConfirm) {
    return (
      <div className="rounded-xl border border-border bg-surface px-6 py-12 text-center">
        <p className="font-medium text-foreground">確認メールを送信しました</p>
        <p className="mt-2 text-sm text-foreground-muted">
          メール内のリンクを開くと登録が完了します。届かない場合は迷惑メールフォルダも確認してください。
        </p>
        <p className="mt-3 text-sm text-foreground-muted">
          すぐに試す場合はデモアカウントでログインできます。
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href={loginHref(next)}
            className="inline-flex rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-white hover:bg-forest-strong"
          >
            ログインへ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-4 rounded-xl border border-border bg-surface p-4 sm:p-5"
    >
      <input type="hidden" name="next" value={next} />
      {mode === "login" ? (
        <div className="rounded-lg border border-border bg-forest-soft/60 px-3 py-3 text-sm text-foreground">
          <p className="font-medium text-forest-strong">デモアカウント</p>
          <p className="mt-1 text-xs leading-6 text-foreground-muted">
            {DEMO_EMAIL}
            <br />
            パスワード {DEMO_PASSWORD}
          </p>
          <button
            type="button"
            onClick={fillDemoAccount}
            className="mt-2 text-xs font-medium text-forest-strong underline underline-offset-2 hover:opacity-70"
          >
            フォームに入力する
          </button>
        </div>
      ) : (
        <p className="text-sm leading-6 text-foreground-muted">
          メールアドレスとパスワード（6文字以上）で登録します。確認メールが届く場合があります。
        </p>
      )}
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-foreground">
          メールアドレス
        </span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={state && !state.ok ? state.email : undefined}
          className="h-11 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-forest"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-foreground">
          パスワード
        </span>
        <input
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          className="h-11 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-forest"
        />
      </label>
      {mode === "signup" ? (
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-foreground">
            パスワード（確認）
          </span>
          <input
            name="confirmPassword"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            className="h-11 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-forest"
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
        className="h-11 w-full rounded-full bg-forest text-sm font-medium text-white hover:bg-forest-strong disabled:bg-surface-muted"
      >
        {pending
          ? "処理中..."
          : mode === "login"
            ? "ログイン"
            : "新規登録"}
      </button>

      <p className="text-center text-sm text-foreground-muted">
        {mode === "login" ? (
          <>
            アカウントをお持ちでない方は{" "}
            <Link href={signupHref(next)} className="font-medium text-foreground underline">
              新規登録
            </Link>
          </>
        ) : (
          <>
            すでにアカウントをお持ちの方は{" "}
            <Link href={loginHref(next)} className="font-medium text-foreground underline">
              ログイン
            </Link>
          </>
        )}
      </p>
      {mode === "signup" ? (
        <p className="text-center text-xs text-foreground-muted">UIは日本語固定です</p>
      ) : null}
    </form>
  );
}
