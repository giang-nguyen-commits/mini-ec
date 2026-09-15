import { NextResponse } from "next/server";
import { safeNextPath } from "@/lib/auth-redirect";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"));

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  return NextResponse.redirect(new URL(loginErrorHref(next), origin));
}

function loginErrorHref(next: string) {
  const params = new URLSearchParams({ error: "confirm" });
  if (next !== "/") {
    params.set("next", next);
  }
  return `/login?${params.toString()}`;
}
