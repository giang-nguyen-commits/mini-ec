const ALLOWED_EXACT = new Set([
  "/",
  "/products",
  "/cart",
  "/checkout",
  "/checkout/success",
  "/orders",
  "/account",
]);

const ALLOWED_QUERY: Record<string, Set<string>> = {
  "/checkout": new Set(["canceled", "orderId", "session_id"]),
  "/checkout/success": new Set(["orderId", "session_id"]),
};

function withAllowedQuery(pathname: string, search: string) {
  const allowed = ALLOWED_QUERY[pathname];
  if (!allowed || !search) {
    return pathname;
  }

  const incoming = new URLSearchParams(search);
  const next = new URLSearchParams();
  for (const key of allowed) {
    const value = incoming.get(key);
    if (value) {
      next.set(key, value);
    }
  }

  const suffix = next.toString();
  return suffix ? `${pathname}?${suffix}` : pathname;
}

export function safeNextPath(raw: unknown): string {
  if (typeof raw !== "string") {
    return "/";
  }

  const path = raw.trim();
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("://")) {
    return "/";
  }

  const [pathname = path, ...queryParts] = path.split("?");
  if (
    ALLOWED_EXACT.has(pathname) ||
    pathname.startsWith("/products/") ||
    /^\/orders\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      pathname,
    )
  ) {
    return withAllowedQuery(pathname, queryParts.join("?"));
  }

  return "/";
}

export function loginHref(next?: string) {
  const path = next ? safeNextPath(next) : "/";
  if (path === "/") {
    return "/login";
  }
  return `/login?next=${encodeURIComponent(path)}`;
}

export function signupHref(next?: string) {
  const path = next ? safeNextPath(next) : "/";
  if (path === "/") {
    return "/signup";
  }
  return `/signup?next=${encodeURIComponent(path)}`;
}
