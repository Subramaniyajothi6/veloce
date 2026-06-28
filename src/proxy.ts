import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifyToken } from "@/lib/session";

/**
 * Next 16 "Proxy" (the renamed middleware), Node.js runtime. Gates the /admin
 * area: anything but the login page needs a valid session cookie, otherwise we
 * redirect to /admin/login. Each admin page / server action ALSO re-checks auth
 * (defense in depth — the docs warn not to rely on the proxy alone).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (verifyToken(token)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("from", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*"],
};
