import { setRequestLocale } from "next-intl/server";
import { getMessages, getTranslations } from "next-intl/server";
import { assembleServicesUiInnerHtml } from "@/lib/assemble-services-ui";
import { routing, type AppLocale } from "@/i18n/routing";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ServicesShell } from "@/components/ServicesShell";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      type: "website",
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

  return <ServicesShell uiHtml={uiHtml} />;
}
