"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Iridescence from "@/components/Iridescence";

/**
 * Mounts react-bits Iridescence into #home-hero-visual-container.
 * Layout slot unchanged; RAF pauses off-screen.
 */
export function HeroIridescence() {
  const [host, setHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setHost(document.getElementById("home-hero-visual-container"));
  }, []);

  if (!host) return null;

  return createPortal(
    <div className="hero-visual-fx-root">
      <Iridescence
        color={[0.12156862745098039, 0.3176470588235294, 1]}
        mouseReact
        amplitude={0.1}
        speed={1}
      />
    </div>,
    host,
  );
}
