import { loadFragment } from "@/lib/fragments";

/** #home-hero — title + scroll hint; WebGL from engine #canvas. */
export function heroHtml(): string {
  return loadFragment("home-hero.html");
}
