"use client";

import { useEffect } from "react";
import { EngineBootstrap } from "@/components/EngineBootstrap";
import { ReelBgmController } from "@/components/audio/ReelBgmController";
import { HeaderLogoPhrase } from "@/components/chrome/HeaderLogoPhrase";
import { HeaderNavScroll } from "@/components/chrome/HeaderNavScroll";
import { IntroOverlay } from "@/components/IntroOverlay";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";

/**
 * Client shell for the Portfolio page: same engine canvas + #ui contract
 * as the homepage, with the full project grid and the project modal.
 */
export function PortfolioShell({ uiHtml }: { uiHtml: string }) {
  useEffect(() => {
    document.documentElement.classList.add("is-portfolio-page");
    document
      .querySelectorAll<HTMLElement>(
        'a.header-nav-btn[href="/portfolio"], a.header-menu-link[href="/portfolio"]',
      )
      .forEach((link) => link.setAttribute("aria-current", "page"));
    return () => {
      document.documentElement.classList.remove("is-portfolio-page");
    };
  }, []);

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
      <EngineBootstrap />
      <ReelBgmController visibleByDefault />
      <IntroOverlay />
      <FeaturedProjects />
    </>
  );
}