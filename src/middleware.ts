import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

// Locales that always show up as a URL prefix (the default locale, fa, does not).
const PREFIXED_LOCALES = ["az", "en", "ka"];

function stripLocale(pathname: string) {
  const re = new RegExp(`^/(${PREFIXED_LOCALES.join("|")})(?=/|$)`);
  return pathname.replace(re, "") || "/";
}

function localePrefixOf(pathname: string) {
  const re = new RegExp(`^/(${PREFIXED_LOCALES.join("|")})(?=/|$)`);
  const match = pathname.match(re);
  return match ? `/${match[1]}` : "";
}

// Reads the session JWT directly instead of running the full NextAuth
// auth() wrapper. auth() runs NextAuth's whole request pipeline (CSRF
// token issuance, callback-url tracking, etc.) meant for actual sign-in
// flows; invoking it for a passive middleware check made every request
// redirect to itself while it tried to establish a CSRF cookie.
export default async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const isLoggedIn = !!token;
  const role = token?.role as string | undefined;
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  // The admin panel is intentionally not localized (internal/operator-facing only).
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn || role !== "ADMIN") {
      return NextResponse.redirect(new URL("/auth/login", nextUrl));
    }
    return NextResponse.next();
  }

  const strippedPath = stripLocale(pathname);
  if (strippedPath.startsWith("/account") && !isLoggedIn) {
    const prefix = localePrefixOf(pathname);
    return NextResponse.redirect(new URL(`${prefix}/auth/login`, nextUrl));
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|uploads|favicon.ico|robots.txt|sitemap.xml).*)"],
};
