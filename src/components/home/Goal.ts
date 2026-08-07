import { loadFragment } from "@/lib/fragments";

/**
 * Goal section — engine stubs only (tunnel DOM anchors).
 * 3D astronaut flight is disabled in public/_astro/engine.js (see vendor patch).
 * Keep #home-goal-image-in/out nodes: engine scroll ranges still bind to them.
 */
export function goalHtml(): string {
  return loadFragment("home-goal.html");
}
