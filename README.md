# Mini EC

少品種の化粧品・雑貨を閲覧し、カートから Stripe（テストモード）で購入できる小さな EC アプリです。

## Demo

| 項目 | 値 |
| --- | --- |
| URL | （Vercel デプロイ後に追記） |
| Email | `demo.mini.ec@gmail.com` |
| Password | `Demo1234!` |
| Stripe | テストカード `4242 4242 4242 4242` / 有効期限は未来月 / CVC 任意 |

本番のカードは使わないでください。お金は動きません。

## できること

- 商品一覧（名前・成分検索、カテゴリ / 肌悩み）
- 商品詳細（在庫・正規品情報・カート追加）
- カート（localStorage、ログイン不要）
- 新規登録 / ログイン（Supabase Auth）
- 配送先入力 → Stripe Checkout
- 注文履歴（ログイン必須）

未ログインで `/checkout` または `/orders` を開くと `/login?next=...` に戻します。

## 技術

- Next.js 16 App Router / React 19 / TypeScript / Tailwind CSS 4
- Supabase（Postgres + Auth）
- Stripe Checkout（Test mode）

## ローカル起動

```bash
npm install
npm run dev
```

必要な環境変数（`.env.local`）:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Supabase Auth の Redirect URLs に次を追加する:

- `http://localhost:3000/auth/callback`
- `https://<Vercelのドメイン>/auth/callback`

メール確認がオンの場合、登録後に届くリンクがここへ戻ります。デモ用なら Confirm email をオフにするか、Dashboard で確認済みユーザーを1件作る。

## 仕様

画面とデータは `docs/` を参照。Figma の「お気に入り」は任意機能のため未実装です。
