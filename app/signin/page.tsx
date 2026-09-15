import { redirect } from "next/navigation";
import { loginHref, safeNextPath } from "@/lib/auth-redirect";

export default async function SigninAliasPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const params = await searchParams;
  const next = safeNextPath(Array.isArray(params.next) ? params.next[0] : params.next);
  redirect(loginHref(next));
}
