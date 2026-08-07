"use client";

import { useEffect } from "react";

/**
 * Load the production engine only after React has hydrated.
 * If engine.js runs from <head> before hydration, it mutates #canvas
 * (width/height/data-engine/style) and causes a hydration mismatch.
 */
export function EngineBootstrap() {
  useEffect(() => {
    if (document.querySelector("script[data-lusion-engine]")) return;

    const script = document.createElement("script");
    script.type = "module";
    script.src = "/_astro/engine.js";
    script.dataset.lusionEngine = "1";
    document.body.appendChild(script);
  }, []);

  return null;
}
