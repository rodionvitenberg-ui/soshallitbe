import { loadFragment } from "@/lib/fragments";

/** Production #video-overlay markup. */
export function videoOverlayHtml(): string {
  return loadFragment("video-overlay.html");
}
