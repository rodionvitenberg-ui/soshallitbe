import { setRequestLocale } from "next-intl/server";
import { getMessages } from "next-intl/server";
import { assembleUiInnerHtml } from "@/lib/assemble-home-ui";
import { routing, type AppLocale } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { HomeShell } from "@/components/HomeShell";
import { StructuredData } from "@/components/structured-data";

/**
 * Homepage: Hero → Reel → Featured → Let's work → (goal stubs) → Footer
 * Server builds UI HTML; client shell hydrates, then loads engine.js.
 */
export default async function HomePage({
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
  const uiHtml = assembleUiInnerHtml(
    messages as Record<string, unknown>,
    locale,
  );

  return (
    <>
      <StructuredData
        messages={messages as Record<string, unknown>}
        page="home"
      />
      <HomeShell uiHtml={uiHtml} />
    </>
  );
}
