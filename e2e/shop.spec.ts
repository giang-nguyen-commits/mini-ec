import { createClient } from "@supabase/supabase-js";
import { expect, test, type Page } from "@playwright/test";
import Stripe from "stripe";

async function createConfirmedUser() {
  const email = process.env.E2E_EMAIL;
  const password = process.env.E2E_PASSWORD;
  if (email && password) {
    return { email, password };
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "E2E_EMAIL / E2E_PASSWORD か SUPABASE_SERVICE_ROLE_KEY を設定してください。",
    );
  }

  const generatedEmail = `e2e.${Date.now()}@gmail.com`;
  const generatedPassword = "Playwright123!";
  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { error } = await admin.auth.admin.createUser({
    email: generatedEmail,
    password: generatedPassword,
    email_confirm: true,
  });
  if (error) {
    throw error;
  }

  return { email: generatedEmail, password: generatedPassword };
}

async function logIn(page: Page) {
  const { email, password } = await createConfirmedUser();

  await page.goto("/login");
  await page.getByLabel("メールアドレス").fill(email);
  await page.getByLabel("パスワード").fill(password);
  await page.getByRole("button", { name: "ログイン" }).click();
  await expect(page.getByRole("button", { name: "ログアウト" })).toBeVisible({
    timeout: 15_000,
  });

  return email;
}

async function fillInAnyFrame(
  page: Page,
  role: Parameters<Page["getByRole"]>[0],
  name: string | RegExp,
  value: string,
) {
  const onPage = page.getByRole(role, { name });
  if (await onPage.first().isVisible({ timeout: 2_000 }).catch(() => false)) {
    await onPage.first().fill(value);
    return;
  }

  for (const frame of page.frames()) {
    const locator = frame.getByRole(role, { name });
    if (await locator.first().isVisible().catch(() => false)) {
      await locator.first().fill(value);
      return;
    }
  }

  throw new Error(`Stripe field not found: ${String(name)}`);
}

async function payOnStripeHostedCheckout(page: Page, email: string) {
  await page.waitForURL(/checkout\.stripe\.com/, { timeout: 30_000 });
  await expect(page.getByRole("textbox", { name: "メールアドレス" })).toBeVisible({
    timeout: 20_000,
  });

  await fillInAnyFrame(page, "textbox", "メールアドレス", email);
  await fillInAnyFrame(page, "textbox", "カード番号", "4242424242424242");
  await fillInAnyFrame(page, "textbox", "有効期限", "12 / 34");
  await fillInAnyFrame(page, "textbox", /CVC/, "123");
  await fillInAnyFrame(page, "textbox", /カード名義/, "TARO E2E");

  const postal = page.getByRole("textbox", { name: /郵便番号|ZIP|Postal/i });
  if (await postal.isVisible().catch(() => false)) {
    await postal.fill("100-0001");
  }

  await page.getByRole("button", { name: "支払う", exact: true }).click();
  await page.waitForURL(/\/checkout\/success/, { timeout: 60_000 });
}

async function notifyPaidWebhook(sessionId: string) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) {
    throw new Error("STRIPE_SECRET_KEY または STRIPE_WEBHOOK_SECRET が未設定です。");
  }

  const stripe = new Stripe(secretKey);
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid") {
    throw new Error(`Stripe session is ${session.payment_status}, expected paid`);
  }

  const payload = JSON.stringify({
    id: `evt_e2e_${session.id}`,
    object: "event",
    api_version: "2026-08-26.dahlia",
    created: Math.floor(Date.now() / 1000),
    type: "checkout.session.completed",
    data: { object: session },
    livemode: false,
    pending_webhooks: 1,
    request: { id: null, idempotency_key: null },
  });
  const signature = stripe.webhooks.generateTestHeaderString({
    payload,
    secret: webhookSecret,
  });

  const response = await fetch("http://localhost:3000/api/webhook", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "stripe-signature": signature,
    },
    body: payload,
  });
  if (!response.ok) {
    throw new Error(`webhook ${response.status}: ${await response.text()}`);
  }
}

test("在庫切れ商品はカート追加ボタンが無効化されている", async ({ page }) => {
  await page.goto("/products");

  const soldOutCard = page
    .getByTestId("product-card")
    .filter({ hasText: "売り切れ" })
    .first();
  await expect(soldOutCard).toBeVisible();
  await soldOutCard.click();

  await expect(page.getByRole("button", { name: "売り切れ" })).toBeDisabled();
});

test("未ログインで /orders にアクセスすると /login にリダイレクトされる", async ({
  page,
}) => {
  await page.goto("/orders");

  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole("heading", { name: "ログイン" })).toBeVisible();
});

test("カートに入れて Stripe テストカードで決済すると注文履歴が paid になる", async ({
  page,
}) => {
  test.setTimeout(120_000);

  const email = await logIn(page);
  await page.goto("/products");

  const inStockCard = page
    .getByTestId("product-card")
    .filter({ hasNot: page.getByText("売り切れ") })
    .first();
  await expect(inStockCard).toBeVisible();

  const productName =
    (await inStockCard.getByRole("heading").textContent())?.trim() ?? "";
  await inStockCard.click();

  await page.getByRole("button", { name: "カートに入れる" }).click();
  await expect(page.getByRole("status")).toContainText("カートに追加しました");

  await page.getByRole("navigation").getByRole("link", { name: /カート/ }).click();
  await expect(page.getByRole("heading", { name: "カート" })).toBeVisible();
  await page.getByRole("link", { name: "ご注文へ" }).click();

  await expect(page.getByRole("heading", { name: "ご注文" })).toBeVisible();
  await page.getByLabel("お名前").fill("E2E 太郎");
  await page.getByLabel("電話番号").fill("09012345678");
  await page.getByLabel("住所").fill("東京都千代田区1-1-1");
  await page.getByRole("button", { name: "お支払いへ進む" }).click();

  await payOnStripeHostedCheckout(page, email);
  await expect(page.getByText("お支払いが完了しました")).toBeVisible();

  const sessionId = new URL(page.url()).searchParams.get("session_id");
  if (sessionId) {
    await notifyPaidWebhook(sessionId);
  }

  await page.getByRole("link", { name: "注文履歴を見る" }).click();
  await expect(page.getByRole("heading", { name: "注文履歴" })).toBeVisible();

  const orderCard = page.getByTestId("order-card").first();
  await expect(orderCard).toHaveAttribute("data-status", "paid", {
    timeout: 20_000,
  });
  await expect(orderCard.getByTestId("order-status")).toHaveAttribute(
    "data-status",
    "paid",
  );
  if (productName) {
    await expect(orderCard.getByTestId("order-items")).toContainText(productName);
  }
});
