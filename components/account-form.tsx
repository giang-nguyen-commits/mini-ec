"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  emptyProfile,
  persistProfile,
  readProfile,
  type CustomerProfile,
} from "@/lib/profile";

export function AccountForm({ loginEmail }: { loginEmail: string }) {
  const [profile, setProfile] = useState<CustomerProfile>(emptyProfile());
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = readProfile();
    setProfile({
      ...stored,
      email: stored.email || loginEmail,
    });
    setReady(true);
  }, [loginEmail]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    persistProfile(profile);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  if (!ready) {
    return (
      <div
        className="h-80 animate-pulse rounded-xl border border-border bg-surface"
        role="status"
        aria-label="設定を読み込み中"
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Section title="基本情報">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-foreground">
            ログイン用メール
          </span>
          <input
            type="email"
            value={loginEmail}
            readOnly
            className="h-11 w-full rounded-lg border border-border bg-surface-muted px-3 text-sm text-foreground-muted outline-none"
          />
          <span className="mt-1.5 block text-xs text-foreground-muted">
            ログイン用メールの変更は、このデモではまだできません。
          </span>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-foreground">
            お名前
          </span>
          <input
            name="name"
            type="text"
            autoComplete="name"
            value={profile.name}
            onChange={(event) =>
              setProfile((current) => ({ ...current, name: event.target.value }))
            }
            className="h-11 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-forest"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-foreground">
            連絡用メール
          </span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            value={profile.email}
            onChange={(event) =>
              setProfile((current) => ({ ...current, email: event.target.value }))
            }
            className="h-11 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-forest"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-foreground">
            電話番号
          </span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            value={profile.phone}
            onChange={(event) =>
              setProfile((current) => ({ ...current, phone: event.target.value }))
            }
            className="h-11 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-forest"
          />
        </label>
      </Section>

      <Section title="配送先">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-foreground">
            お届け先住所
          </span>
          <textarea
            name="address"
            rows={3}
            autoComplete="street-address"
            value={profile.address}
            onChange={(event) =>
              setProfile((current) => ({
                ...current,
                address: event.target.value,
              }))
            }
            className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-forest"
          />
        </label>
      </Section>

      {saved ? (
        <p className="text-sm text-forest-strong" role="status">
          保存しました。ご注文時に自動で入ります。
        </p>
      ) : null}

      <button
        type="submit"
        className="h-11 w-full rounded-full bg-forest text-sm font-medium text-white hover:bg-forest-strong"
      >
        保存する
      </button>

      <p className="text-center text-xs text-foreground-muted">
        <Link href="/orders" className="text-forest-strong hover:opacity-70">
          注文履歴
        </Link>
      </p>
    </form>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4 rounded-xl border border-border bg-surface p-4 sm:p-5">
      <h2 className="text-sm font-semibold tracking-[0.14em] text-forest-strong">
        {title}
      </h2>
      {children}
    </section>
  );
}
