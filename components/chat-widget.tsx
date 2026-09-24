"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChatIcon, CloseIcon, SendIcon } from "@/components/icons";

type ChatMessage = {
  id: string;
  from: "bot" | "user";
  text: string;
};

const WELCOME: ChatMessage = {
  id: "welcome",
  from: "bot",
  text: "Giang Cosmetic です。商品や使い方についてご質問ください。回答は学習用の AI です。実販売はしていません。",
};

export function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      return;
    }
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, open, pending]);

  async function send() {
    const text = draft.trim();
    if (!text || pending) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      from: "user",
      text,
    };

    const history = [...messages, userMessage]
      .filter((message) => message.id !== "welcome")
      .map((message) => ({
        role: message.from === "user" ? "user" : "assistant",
        content: message.text,
      }));

    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setPending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = (await response.json()) as {
        text?: unknown;
        message?: unknown;
      };
      const reply =
        typeof data.text === "string" && data.text.trim()
          ? data.text.trim()
          : typeof data.message === "string" && data.message.trim()
            ? data.message.trim()
            : "応答できませんでした。時間をおいて再度お試しください。";

      setMessages((current) => [
        ...current,
        {
          id: `bot-${Date.now()}`,
          from: "bot",
          text: reply,
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: `bot-${Date.now()}`,
          from: "bot",
          text: "通信に失敗しました。時間をおいて再度お試しください。",
        },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-5 z-[60] flex flex-col items-end sm:inset-x-6">
      {open ? (
        <section
          className="pointer-events-auto mb-3 flex h-[min(28rem,calc(100dvh-7.5rem))] w-full max-w-[22rem] flex-col overflow-hidden border border-border bg-white shadow-[0_16px_40px_rgba(44,18,28,0.16)]"
          aria-label="サポートチャット"
        >
          <header className="flex items-center justify-between border-b border-border bg-forest px-4 py-3 text-white">
            <div>
              <p className="text-[13px] font-medium tracking-[0.16em]">
                カスタマーサポート
              </p>
              <p className="mt-0.5 text-[11px] text-white/75">AI回答・学習用デモ</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center hover:opacity-70"
              aria-label="チャットを閉じる"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </header>

          <div
            ref={listRef}
            className="flex-1 space-y-3 overflow-y-auto bg-surface px-3 py-3"
          >
            {messages.map((message) => (
              <p
                key={message.id}
                className={
                  message.from === "user"
                    ? "ml-8 rounded-lg bg-forest px-3 py-2 text-sm leading-6 text-white"
                    : "mr-8 rounded-lg border border-border bg-white px-3 py-2 text-sm leading-6 text-foreground"
                }
              >
                {message.text}
              </p>
            ))}
            {pending ? (
              <p className="mr-8 rounded-lg border border-border bg-white px-3 py-2 text-sm leading-6 text-muted-foreground">
                入力中…
              </p>
            ) : null}
          </div>

          <form
            className="flex gap-2 border-t border-border bg-white p-3"
            onSubmit={(event) => {
              event.preventDefault();
              void send();
            }}
          >
            <label className="sr-only" htmlFor="chat-draft">
              メッセージ
            </label>
            <input
              id="chat-draft"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="メッセージを入力"
              disabled={pending}
              maxLength={500}
              className="h-11 min-w-0 flex-1 rounded-lg border border-border px-3 text-sm outline-none focus:border-forest disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={pending}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-forest text-white hover:bg-forest-strong disabled:opacity-60"
              aria-label="送信"
            >
              <SendIcon className="h-4 w-4" />
            </button>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="pointer-events-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-forest text-white shadow-[0_10px_24px_rgba(44,18,28,0.22)] transition-opacity hover:opacity-90"
        aria-label={open ? "チャットを閉じる" : "チャットで問い合わせ"}
        aria-expanded={open}
      >
        {open ? (
          <CloseIcon className="h-5 w-5" />
        ) : (
          <ChatIcon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}
