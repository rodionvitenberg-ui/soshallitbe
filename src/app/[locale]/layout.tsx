import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import "../globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  const title = t("title");
  const description = t("description");
  const siteUrl = new URL("https://soshallitbe.cyou");
  const canonical = new URL(siteUrl.pathname, siteUrl).href;

  return {
    metadataBase: siteUrl,
    title,
    description,
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      apple: "/assets/meta/apple-touch-icon.png",
      icon: [
        {
          url: "/assets/meta/favicon-32x32.png",
          sizes: "32x32",
          type: "image/png",
        },
        {
          url: "/assets/meta/favicon-16x16.png",
          sizes: "16x16",
          type: "image/png",
        },
        { url: "/assets/meta/favicon.ico", type: "image/x-icon" },
      ],
      shortcut: "/assets/meta/favicon.ico",
    },
    manifest: "/assets/meta/site.webmanifest",
    openGraph: {
      title,
      description,
      type: "website",
      locale: locale === "ru" ? "ru_RU" : "en_US",
      url: canonical,
      siteName: "So Shall It Be",
      images: [
        {
          url: "/assets/meta/social_sharing.jpg",
          width: 1200,
          height: 630,
          alt: "So Shall It Be — Web, Mobile & AI Development Studio in Cyprus",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/assets/meta/social_sharing.jpg"],
    },
    other: {
      "theme-color": "#ffffff",
    },
  };
}

/**
 * Shell: meta + production CSS + patched engine module.
 * Visual DOM lives in page.tsx (assembled fragments + i18n).
 */
export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: localeParam } = await params;
  if (!routing.locales.includes(localeParam as AppLocale)) {
    notFound();
  }
  const locale = localeParam as AppLocale;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className="no-js" suppressHydrationWarning>
      <head>
        {/* Inline anti-flash: WebGLRenderer sets a black clear at construction,
            before any external CSS / engine.js runs. Force a light canvas+body
            background so the black frame never appears while the page loads. */}
        <style>{`
          html, body { background: #f0f1fa !important; }
          #canvas { background: #f0f1fa !important; }
        `}</style>
        <base href="/" />
        <link rel="stylesheet" href="/_astro/lusion.css" />
        <link rel="stylesheet" href="/styles/overrides.css" />
        {/* engine.js is loaded after hydration via EngineBootstrap — avoids #canvas mismatch */}
      </head>
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
