# Mini EC 計画書 / Kế hoạch ứng dụng Mini EC

| 項目 / Hạng mục | 内容 / Nội dung |
| --- | --- |
| プロジェクト名 / Tên dự án | Mini EC |
| バージョン / Phiên bản | 1.0（MVP） |
| ステータス / Trạng thái | 設計中 / Đang thiết kế |
| 関連資料 / Tài liệu liên quan | `02-data-model.md`, `03-screens.md`, `04-wireframe.md` |

---

## 1. 概要 / Tổng quan

**JA:** Mini EC は、少品種の化粧品・雑貨を素早く閲覧し、カートに入れて Stripe で決済できる小さな販売アプリです。会員登録・ログイン後に注文でき、注文履歴を確認できます。管理画面は対象外です。

**VI:** Mini EC là ứng dụng bán hàng nhỏ: xem danh sách sản phẩm, mở chi tiết, thêm vào giỏ, đăng ký/đăng nhập rồi thanh toán Stripe. Lịch sử đơn nằm trong app. Màn hình quản trị **không** thuộc phạm vi.

---

## 2. 目的 / Mục đích

| # | 日本語 | Tiếng Việt |
| --- | --- | --- |
| 1 | 商品を一覧で比較し、詳細を確認できる | So sánh sản phẩm trên danh sách và xem chi tiết |
| 2 | 在庫を意識しつつカートへ追加できる | Thêm vào giỏ hàng có kiểm tra tồn kho |
| 3 | ログイン後に Stripe で決済し、注文履歴を確認できる | Đăng nhập, thanh toán Stripe, xem đơn |
| 4 | Supabase の `products` を唯一の商品マスタにする | Dùng bảng `products` trên Supabase làm nguồn dữ liệu duy nhất |

---

## 3. 対象ユーザー / Đối tượng người dùng

**JA:** 個人または小規模店舗の顧客。短時間で商品を見て、カートに入れるまでの操作が分かれば十分です。管理者・店舗スタッフ向け画面は本計画の範囲外です。

**VI:** Khách hàng của cửa hàng nhỏ hoặc người bán cá nhân. Chỉ cần thao tác xem hàng và bỏ vào giỏ trong thời gian ngắn. Màn hình dành cho chủ shop / quản trị **không** nằm trong kế hoạch này.

---

## 4. スコープ / Phạm vi

### 4.1 MVP に含む / Trong phạm vi MVP

- 商品一覧（カード表示、検索、カテゴリ / 肌悩みフィルタ、在庫状態の表示）
- 商品詳細（説明・価格・在庫・正規品情報・カート追加）
- カート（数量変更、削除、小計・合計、localStorage）
- 新規登録 / ログイン（Supabase Auth）
- 配送先入力と Stripe Checkout
- 注文履歴（ログイン必須）

**VI:** Danh sách (search + filter), chi tiết, giỏ hàng, đăng ký/đăng nhập, Stripe, lịch sử đơn.

### 4.2 MVP に含まない / Ngoài phạm vi MVP

| 除外項目 / Hạng mục loại | 理由 / Lý do |
| --- | --- |
| 管理画面 / Trang quản trị | 商品投入は Supabase 上で行う |
| お気に入り / Yêu thích | Figma 上は「あったら良い」。後続 |
| レビュー投稿 / Viết đánh giá | 複雑度が高い |
| クーポン / Mã giảm giá | 複雑度が高い |

---

## 5. 技術構成 / Công nghệ

| 層 / Lớp | 選定 / Lựa chọn | 備考 / Ghi chú |
| --- | --- | --- |
| Frontend | Next.js 16（App Router）+ React 19 | 既存リポジトリを利用 |
| UI | Tailwind CSS 4 | 既存セットアップを継続 |
| 言語 / Ngôn ngữ | TypeScript | 型を `02-data-model.md` と揃える |
| BaaS | Supabase（PostgreSQL） | 商品マスタのみ |
| カート状態 / Giỏ hàng | Client state + `localStorage` | DB にカートテーブルは置かない |

**データフロー / Luồng dữ liệu**

```
[Supabase: products]
        │  SELECT（公開読み取り）
        ▼
[Next.js Server / Client]
        │  商品表示
        ▼
[Cart Store + localStorage]
        │  追加・数量・削除
        ▼
[カート画面 / Màn giỏ hàng]
```

---

## 6. 画面とルート / Màn hình và route

詳細は `03-screens.md` を参照。 / Chi tiết xem `03-screens.md`.

| 画面 / Màn hình | Path | 役割 / Vai trò |
| --- | --- | --- |
| 商品一覧 / Danh sách sản phẩm | `/` → `/products` | 検索・絞り込み |
| 商品詳細 / Chi tiết sản phẩm | `/products/[id]` | 確認とカート追加 |
| カート / Giỏ hàng | `/cart` | 数量調整と合計 |
| ログイン / Đăng nhập | `/login`（`/signin` から転送） | 認証 |
| 新規登録 / Đăng ký | `/signup` | 会員登録 |
| ご注文 / Checkout | `/checkout` | 配送先。ログイン必須 |
| 完了 / Success | `/checkout/success` | 決済完了 |
| 注文履歴 / Đơn hàng | `/orders` | ログイン必須 |
| 注文詳細 / Chi tiết đơn | `/orders/[id]` | ログイン必須。本人の注文のみ |

共通ヘッダーにロゴ（一覧へ）、ログイン / 注文履歴、カートアイコン（件数バッジ）を置く。

---

## 7. ビジネスルール / Quy tắc nghiệp vụ

1. **価格 / Giá:** `products.price` は整数（円 / VND 相当の最小単位）。画面ではロケールに応じて表示する。
2. **在庫 / Tồn kho:** `stock <= 0` の商品は「売り切れ / Hết hàng」。カート追加不可。
3. **カート上限 / Giới hạn giỏ:** 同一商品の数量は `stock` を超えない。
4. **存在しない商品 / Sản phẩm không còn:** 詳細・カートで商品が消えていたら行を無効化し、再読込時に除去する。
5. **カート永続化 / Lưu giỏ:** ブラウザ単位。端末・ブラウザを変えると共有されない。

---

## 8. 開発フェーズ / Giai đoạn phát triển

| Phase | 内容 / Nội dung | 完了条件 / Điều kiện xong |
| --- | --- | --- |
| 0 | 設計ドキュメント（本フォルダ） | 4ファイルがレビュー済み |
| 1 | Supabase `products` + シード | 一覧が実データで表示される |
| 2 | 商品一覧・詳細 UI | 3画面のうち2画面が遷移できる |
| 3 | カート（追加・変更・削除・合計） | 在庫ルールが守られる |
| 4 | 空状態・エラー・レスポンシブ確認 | `04-wireframe.md` のレイアウトと一致 |

**将来 / Tương lai（本計画の外）:** お気に入り、レビュー投稿、管理画面。

---

## 9. 成功基準 / Tiêu chí thành công

- 商品が 1 画面で比較でき、詳細へ 1 クリックで入れる。
- 在庫切れ商品をカートに入れられない。
- リロード後もカート内容が残る。
- 3 画面がヘッダーから相互に辿れる。

**VI:** So sánh sản phẩm trên một màn, vào chi tiết bằng một thao tác, không thêm được hàng hết tồn, giỏ còn sau khi reload, ba màn hình liên kết qua header.

---

## 10. リスク / Rủi ro

| リスク / Rủi ro | 影響 / Ảnh hưởng | 対策 / Cách xử lý |
| --- | --- | --- |
| 画像 URL 切れ | カードが崩れる | プレースホルダー画像 |
| 在庫がカートより少ない | 過剰追加 | 追加・変更時に `stock` でクランプ |
| RLS 未設定 | データ露出または読み取り失敗 | `02-data-model.md` のポリシーを適用 |
| localStorage 不可 | カートが消える | セッション内メモリにフォールバック |
