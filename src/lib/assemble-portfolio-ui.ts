import { endSectionHtml } from "@/components/chrome/EndSection";
import { footerHtml } from "@/components/chrome/Footer";
import { headerHtml } from "@/components/chrome/Header";
import {
  inputBlockerHtml,
  scrollIndicatorHtml,
} from "@/components/chrome/ScrollNav";
import { videoOverlayHtml } from "@/components/chrome/VideoOverlay";
import { goalHtml } from "@/components/home/Goal";
import { applyI18n } from "@/lib/apply-i18n";
import { loadFragment } from "@/lib/fragments";
import type { AppLocale } from "@/i18n/routing";

type Messages = Record<string, unknown>;

/**
 * Portfolio page: same engine #ui skeleton as the homepage,
 * with the full featured project block (both title groups, all projects,
 * 2-up) plus collapsed home stubs and shared end/footer.
 */
export function assemblePortfolioUiInnerHtml(
  messages: Messages,
  locale: AppLocale,
): string {
  const raw = [
    headerHtml(),
    `<div id="page-container">`,
    `<div id="page-container-inner">`,
    `<div id="home" class="page">`,
    loadFragment("portfolio-engine-stubs.html"),
    loadFragment("portfolio-featured.html"),
    goalHtml(),
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

  void locale;
  return applyI18n(raw, messages);
}