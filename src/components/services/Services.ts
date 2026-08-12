import { loadFragment } from "@/lib/fragments";

/** Services page content — lives inside #home so the engine scroll ranges stay valid. */
export function servicesHtml(): string {
  return loadFragment("services.html");
}
