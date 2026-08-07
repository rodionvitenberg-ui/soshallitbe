import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ru"],
  defaultLocale: "en",
  localePrefix: "never",
  // UI switcher removed for now — always serve default (en); keep ru messages for later.
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];
