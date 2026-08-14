import { endSectionHtml } from "@/components/chrome/EndSection";
import { footerHtml } from "@/components/chrome/Footer";
import { headerHtml } from "@/components/chrome/Header";
import {
  inputBlockerHtml,
  scrollIndicatorHtml,
} from "@/components/chrome/ScrollNav";
import { videoOverlayHtml } from "@/components/chrome/VideoOverlay";
import { aboutHtml } from "@/components/home/About";
import { featuredHtml } from "@/components/home/Featured";
import { goalHtml } from "@/components/home/Goal";
import { heroHtml } from "@/components/home/Hero";
import { reelHtml } from "@/components/home/Reel";
import { applyI18n } from "@/lib/apply-i18n";
import type { AppLocale } from "@/i18n/routing";

type Messages = Record<string, unknown>;

/**
 * Assemble the exact #ui inner DOM the production engine expects,
 * with copy injected from next-intl message dictionaries.
 */
export function assembleUiInnerHtml(
  messages: Messages,
  locale: AppLocale,
): string {
  const raw = [
    headerHtml(),
    `<div id="page-container">`,
    `<div id="page-container-inner">`,
    `<div id="home" class="page">`,
    heroHtml(),
    reelHtml(),
    featuredHtml(),
    goalHtml(),
    aboutHtml(),
    endSectionHtml(),
    `</div>`,
    `<div id="page-extra-sections">`,
    footerHtml(),
    `</div>`,
    `</div>`,
    `</div>`,
    scrollIndicatorHtml(),
    inputBlockerHtml(),
    videoOverlayHtml(),
  ].join("");

  // Locale param kept for API stability; site currently always uses en messages.
  void locale;
  return applyI18n(raw, messages);
}
