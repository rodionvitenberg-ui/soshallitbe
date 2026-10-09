import { loadFragment } from "@/lib/fragments";

/** CV page content — lives inside #home so the engine scroll ranges stay valid. */
export function cvHtml(): string {
  return loadFragment("cv.html");
}
