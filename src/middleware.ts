import { NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { auth } from "@/lib/auth";

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

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
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
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|uploads|favicon.ico|robots.txt|sitemap.xml).*)"],
};
