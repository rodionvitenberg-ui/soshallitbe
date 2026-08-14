import { loadFragment } from "@/lib/fragments";

/** #home-about — crawler-visible studio descriptor (who / what / where / pricing). */
export function aboutHtml(): string {
  return loadFragment("home-about.html");
}