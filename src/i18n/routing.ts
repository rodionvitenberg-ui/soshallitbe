import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ru"],
  defaultLocale: "en",
  localePrefix: "never",
  // UI is English-only (switcher removed). Keep ru dictionary for later.
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];
