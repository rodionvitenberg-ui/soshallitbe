import { loadFragment } from "@/lib/fragments";

/** Production #preloader markup. */
export function preloaderHtml(): string {
  return loadFragment("preloader.html");
}
