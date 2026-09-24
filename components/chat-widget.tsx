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
  text: "Giang Cosmetic です。ご質問をどうぞ。このチャットは学習用のデモ画面です。",
};

function botReply(text: string) {
  if (/配送|届|発送|送料/.test(text)) {
    return "ご注文後の発送は学習用デモのため行っておりません。決済は Stripe テストモードです。";
  }
  if (/返品|交換|キャンセル/.test(text)) {
    return "返品・交換はデモ画面のため受け付けていません。商品一覧から操作をお試しください。";
  }
  if (/営業|時間|開店/.test(text)) {
    return "こちらはオンラインの学習用デモです。営業時間の設定はありません。";
  }
  return "ありがとうございます。このチャットは学習用のデモ画面です。担当者への転送はまだありませんので、商品一覧やカートから操作をお試しください。";
}

export function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
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
  }, [messages, open]);

  function send() {
    const text = draft.trim();
    if (!text) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      from: "user",
      text,
    };
    const reply: ChatMessage = {
      id: `bot-${Date.now()}`,
      from: "bot",
      text: botReply(text),
    };

    setMessages((current) => [...current, userMessage, reply]);
    setDraft("");
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
              <p className="mt-0.5 text-[11px] text-white/75">デモ画面</p>
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
          </div>

          <form
            className="flex gap-2 border-t border-border bg-white p-3"
            onSubmit={(event) => {
              event.preventDefault();
              send();
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
              className="h-11 min-w-0 flex-1 rounded-lg border border-border px-3 text-sm outline-none focus:border-forest"
            />
            <button
              type="submit"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-forest text-white hover:bg-forest-strong"
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
