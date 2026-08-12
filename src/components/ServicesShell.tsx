"use client";

import { useEffect } from "react";
import { EngineBootstrap } from "@/components/EngineBootstrap";
import { HeaderLogoPhrase } from "@/components/chrome/HeaderLogoPhrase";
import { HeaderNavScroll } from "@/components/chrome/HeaderNavScroll";
import { ServicesLines } from "@/components/services/ServicesLines";
import { ServicesMotion } from "@/components/services/ServicesMotion";

/**
 * Client shell for the Services page: same engine canvas + #ui contract
 * as the homepage, without reel BGM / intro / project modal.
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
      <ServicesLines />
      <HeaderLogoPhrase />
      <HeaderNavScroll />
      <ServicesMotion />
      <EngineBootstrap />
    </>
  );
}
