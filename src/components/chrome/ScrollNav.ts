import { loadFragment } from "@/lib/fragments";

export function scrollNavHtml(): string {
  return loadFragment("scroll-nav-section.html");
}

export function scrollIndicatorHtml(): string {
  return loadFragment("scroll-indicator.html");
}

export function inputBlockerHtml(): string {
  return loadFragment("input-blocker.html");
}
