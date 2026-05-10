import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "bragme_glorious";
// Path-only matcher set in `config` below; this guard only needs to
// distinguish the login subpath from the rest of /glorious.
const LOGIN_PATH = "/glorious/login";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The login page itself must be reachable without the cookie.
  if (pathname === LOGIN_PATH) return NextResponse.next();

  const expected = process.env.GLORIOUS_PASSWORD;
  // If no password is configured, treat /glorious as fully open. Local
  // dev without the env var still works; production should always set it.
  if (!expected) return NextResponse.next();

  const cookie = request.cookies.get(COOKIE_NAME);
  if (cookie?.value === "ok") return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = LOGIN_PATH;
  url.searchParams.set("from", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/glorious/:path*"],
};
