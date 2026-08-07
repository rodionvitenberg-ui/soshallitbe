import { getRequestConfig } from "next-intl/server";
import { routing, type AppLocale } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // Keep next-intl + ru dictionary for later; product UI is English-only for now
  // (locale switcher removed, localeDetection: false).
  await requestLocale;
  const locale: AppLocale = routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
