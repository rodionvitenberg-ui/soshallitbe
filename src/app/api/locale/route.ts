import { NextRequest, NextResponse } from "next/server";
import { routing, type AppLocale } from "@/i18n/routing";

function isLocale(value: string | null): value is AppLocale {
  return !!value && routing.locales.includes(value as AppLocale);
}

/**
 * Set NEXT_LOCALE cookie and return to referer (or /).
 * Used by header EN|RU forms — no path prefix.
 */
export async function POST(request: NextRequest) {
  const form = await request.formData();
  const locale = String(form.get("locale") ?? "");

  const target = isLocale(locale) ? locale : routing.defaultLocale;
  const referer = request.headers.get("referer");
  const redirectTo =
    referer && referer.startsWith(request.nextUrl.origin)
      ? referer
      : new URL("/", request.url).toString();

  const response = NextResponse.redirect(redirectTo, 303);
  response.cookies.set("NEXT_LOCALE", target, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}
