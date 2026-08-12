"use client";

import { EngineBootstrap } from "@/components/EngineBootstrap";
import { ReelBgmController } from "@/components/audio/ReelBgmController";
import { HeaderLogoPhrase } from "@/components/chrome/HeaderLogoPhrase";
import { HeaderNavScroll } from "@/components/chrome/HeaderNavScroll";
import { HeroIridescence } from "@/components/home/HeroIridescence";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { IntroOverlay } from "@/components/IntroOverlay";

/**
 * Client shell for engine-owned DOM.
 * suppressHydrationWarning: engine (and extensions) may touch #canvas / #ui
 * after first paint; we still need stable SSR markup for first HTML.
 */
export function HomeShell({ uiHtml }: { uiHtml: string }) {
  return (
    <>
      <canvas id="canvas" suppressHydrationWarning />
      <div
        id="ui"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: uiHtml }}
      />
      <HeaderLogoPhrase />
      <HeaderNavScroll />
      <HeroIridescence />
      <EngineBootstrap />
      <ReelBgmController />
      <IntroOverlay />
      <FeaturedProjects />
    </>
  );
}
