import { generateText } from "ai";
import { NextResponse } from "next/server";
import { APP_NAME, DEMO_BANNER } from "@/lib/brand";
import {
  CHAT_MODEL,
  formatCatalogForChat,
  parseChatTurns,
} from "@/lib/chat";
import { getProducts } from "@/lib/products";

export const runtime = "nodejs";
export const maxDuration = 30;

function buildInstructions(catalog: string) {
  return [
    `あなたは ${APP_NAME} のカスタマーサポートです。`,
    DEMO_BANNER,
    "実販売・実配送はしません。決済は Stripe テストモードです。返品・返金の実務はありません。",
    "医療効果や効能を断定しないでください。",
    "日本語で3〜6文、短く具体的に答えてください。",
    "操作案内は商品一覧・カート・ログイン・注文履歴・Stripeテストカードに限ってください。",
    "掲載カタログにない商品名・在庫・価格は作らないでください。",
    catalog
      ? `掲載商品（学習用デモ）:\n${catalog}`
      : "いまカタログを取得できませんでした。一般的な操作案内のみ答えてください。",
  ].join("\n");
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "リクエストの形式が正しくありません。" },
      { status: 400 },
    );
  }

  const messages =
    body && typeof body === "object" && "messages" in body
      ? parseChatTurns(body.messages)
      : null;

  if (!messages) {
    return NextResponse.json(
      { message: "メッセージを入力してください。" },
      { status: 400 },
    );
  }

  let catalog = "";
  try {
    catalog = formatCatalogForChat(await getProducts());
  } catch {
    catalog = "";
  }

  try {
    const { text } = await generateText({
      model: CHAT_MODEL,
      instructions: buildInstructions(catalog),
      messages,
    });

    const reply = text.trim();
    if (!reply) {
      return NextResponse.json(
        { message: "応答を生成できませんでした。時間をおいて再度お試しください。" },
        { status: 502 },
      );
    }

    return NextResponse.json({ text: reply });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "unknown";
    console.error("chat generateText failed", detail);
    const needsSetup =
      /api key|oidc|unauthor|401|403|credential|customer_verification/i.test(
        detail,
      );
    return NextResponse.json(
      {
        message: needsSetup
          ? "AI接続の設定がありません。Vercel の AI Gateway キーを追加してください。"
          : "AI応答に失敗しました。時間をおいて再度お試しください。",
      },
      { status: 503 },
    );
  }
}
