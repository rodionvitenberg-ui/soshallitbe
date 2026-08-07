import { loadFragment } from "@/lib/fragments";

/** Production #end-section ("Let's work together"). */
export function endSectionHtml(): string {
  return loadFragment("end-section.html");
}
