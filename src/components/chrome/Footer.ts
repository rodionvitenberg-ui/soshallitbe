import { loadFragment } from "@/lib/fragments";

/** Production #footer-section markup. */
export function footerHtml(): string {
  return loadFragment("footer-section.html");
}
