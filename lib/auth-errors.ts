import { AuthError } from "@supabase/supabase-js";

export function mapAuthError(error: AuthError | Error | null) {
  const message = error?.message ?? "";

  if (/invalid login credentials/i.test(message)) {
    return "メールアドレスまたはパスワードが正しくありません。";
  }

  if (/already registered/i.test(message)) {
    return "このメールアドレスはすでに登録されています。";
  }

  if (/at least 6 characters/i.test(message)) {
    return "パスワードは6文字以上にしてください。";
  }

  if (/email not confirmed/i.test(message)) {
    return "メールアドレスが未確認です。受信箱をご確認ください。";
  }

  if (/valid email/i.test(message)) {
    return "メールアドレスの形式が正しくありません。";
  }

  return message || "認証に失敗しました。時間をおいて再度お試しください。";
}
