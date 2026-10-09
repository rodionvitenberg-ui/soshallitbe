import { setRequestLocale } from "next-intl/server";
import { getMessages, getTranslations } from "next-intl/server";
import { assembleCvUiInnerHtml } from "@/lib/assemble-cv-ui";
import { routing, type AppLocale } from "@/i18n/routing";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CvShell } from "@/components/CvShell";
import { StructuredData } from "@/components/structured-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cv" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  const canonical = "https://soshallitbe.cyou/cv";

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
      type: "profile",
      url: canonical,
      siteName: "So Shall It Be",
      images: [
        {
          url: "/assets/meta/social_sharing.jpg",
          width: 1200,
          height: 630,
          alt: "Rodion Vittenberg — CV",
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
 * CV: engine chrome (header, canvas, work-with-us, footer) plus the résumé
 * chapter — experience, track record, stack, live proof, confidentiality.
 * Home hero/reel/featured stay as engine stubs.
 */
export default async function CvPage({
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
  const uiHtml = assembleCvUiInnerHtml(
    messages as Record<string, unknown>,
    locale,
  );

  return (
    <>
      <StructuredData
        messages={messages as Record<string, unknown>}
        page="cv"
      />
      <CvShell uiHtml={uiHtml} />
    </>
  );
}
