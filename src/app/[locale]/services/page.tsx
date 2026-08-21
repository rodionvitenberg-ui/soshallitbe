import { setRequestLocale } from "next-intl/server";
import { getMessages, getTranslations } from "next-intl/server";
import { assembleServicesUiInnerHtml } from "@/lib/assemble-services-ui";
import { routing, type AppLocale } from "@/i18n/routing";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ServicesShell } from "@/components/ServicesShell";
import { StructuredData } from "@/components/structured-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  const canonical = "https://soshallitbe.cyou/services";

  return {
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
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      siteName: "So Shall It Be",
      images: [
        {
          url: "/assets/meta/social_sharing.jpg",
          width: 1200,
          height: 630,
          alt: "R.Vittenberg — Full-Stack Development in Cyprus",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/assets/meta/social_sharing.jpg"],
    },
  };
}

/**
 * Services: engine chrome (header, canvas, lines, work-with-us, footer)
 * plus the Services chapter. Home hero/reel/featured stay as engine stubs.
 */
export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!routing.locales.includes(localeParam as AppLocale)) {
    notFound();
  }
  const locale = localeParam as AppLocale;
  setRequestLocale(locale);
  const messages = await getMessages();
  const uiHtml = assembleServicesUiInnerHtml(
    messages as Record<string, unknown>,
    locale,
  );

  return (
    <>
      <StructuredData
        messages={messages as Record<string, unknown>}
        page="services"
      />
      <ServicesShell uiHtml={uiHtml} />
    </>
  );
}
