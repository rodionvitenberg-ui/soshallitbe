import { loadFragment } from "@/lib/fragments";

/** Production #header markup (sound/menu stubs + Let's talk). */
export function headerHtml(): string {
  return loadFragment("header.html");
}
