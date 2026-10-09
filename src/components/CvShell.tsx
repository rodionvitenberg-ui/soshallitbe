"use client";

import { useEffect } from "react";
import { EngineBootstrap } from "@/components/EngineBootstrap";
import { ReelBgmController } from "@/components/audio/ReelBgmController";
import { HeaderLogoPhrase } from "@/components/chrome/HeaderLogoPhrase";
import { HeaderNavScroll } from "@/components/chrome/HeaderNavScroll";
import { IntroOverlay } from "@/components/IntroOverlay";
import { ServicesMotion } from "@/components/services/ServicesMotion";

/**
 * Client shell for the CV page: same engine canvas + #ui contract as the
 * homepage, plus curtain, BGM controls, and the résumé chapter motion
 * (ServicesMotion — it drives any [data-svc-root] fragment).
 */
export function CvShell({ uiHtml }: { uiHtml: string }) {
  useEffect(() => {
    document.documentElement.classList.add("is-cv-page");
    document
      .querySelectorAll<HTMLElement>(
        'a.header-nav-btn[href="/cv"], a.header-menu-link[href="/cv"]',
      )
      .forEach((link) => link.setAttribute("aria-current", "page"));
    return () => {
      document.documentElement.classList.remove("is-cv-page");
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
      <ServicesMotion />
      <EngineBootstrap />
      <ReelBgmController visibleByDefault />
      <IntroOverlay />
    </>
  );
}
