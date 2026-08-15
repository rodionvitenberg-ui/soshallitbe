"use client";

import { useEffect } from "react";
import { EngineBootstrap } from "@/components/EngineBootstrap";
import { ReelBgmController } from "@/components/audio/ReelBgmController";
import { HeaderLogoPhrase } from "@/components/chrome/HeaderLogoPhrase";
import { HeaderNavScroll } from "@/components/chrome/HeaderNavScroll";
import { IntroOverlay } from "@/components/IntroOverlay";
import { ServicesMotion } from "@/components/services/ServicesMotion";

/**
 * Client shell for the Services page: same engine canvas + #ui contract
 * as the homepage, plus curtain, BGM controls, and services motion.
 */
export function ServicesShell({ uiHtml }: { uiHtml: string }) {
  useEffect(() => {
    document.documentElement.classList.add("is-services-page");
    document
      .querySelectorAll<HTMLElement>(
        'a.header-nav-btn[href="/services"], a.header-menu-link[href="/services"]',
      )
      .forEach((link) => link.setAttribute("aria-current", "page"));
    return () => {
      document.documentElement.classList.remove("is-services-page");
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