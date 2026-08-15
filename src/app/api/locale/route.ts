import { NextRequest, NextResponse } from "next/server";
import { routing, type AppLocale } from "@/i18n/routing";

function isLocale(value: string | null): value is AppLocale {
  return !!value && routing.locales.includes(value as AppLocale);
}

/**
 * Set NEXT_LOCALE cookie.
 * Client component calls this with JSON { locale }, then re-renders the page
 * (window.location.assign("/")) so next-intl picks the new dictionary.
 */
export async function POST(request: NextRequest) {
  let locale: string | null = null;
  try {
    const body = (await request.json()) as { locale?: unknown };
    if (typeof body?.locale === "string") locale = body.locale;
  } catch {
    /* invalid JSON → fall back to default */
  }

  const target = isLocale(locale) ? locale : routing.defaultLocale;
  const response = NextResponse.json({ ok: true, locale: target });
  response.cookies.set("NEXT_LOCALE", target, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}