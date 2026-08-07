import { loadFragment } from "@/lib/fragments";

/** #home-featured — project list. */
export function featuredHtml(): string {
  return loadFragment("home-featured.html");
}
