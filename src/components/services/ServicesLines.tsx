"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import FloatingLines from "@/components/FloatingLines";

/**
 * Mounts FloatingLines into the Services hero visual slot.
 * Engine canvas lines (reel / goal meshes) stay behind the page.
 */
export function ServicesLines() {
  const [host, setHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setHost(document.getElementById("services-lines-slot"));
  }, []);

  if (!host) return null;

  return createPortal(
    <div className="svc-hero-visual-fx">
      <FloatingLines
        linesGradient={["#1F51FF", "#ff5c00", "#8eb0ff"]}
        enabledWaves={["middle", "bottom"]}
        lineCount={[8, 5]}
        lineDistance={[6, 10]}
        middleWavePosition={{ x: 5.0, y: 0.35, rotate: 0.2 }}
        bottomWavePosition={{ x: 2.0, y: -1.45, rotate: -1 }}
        animationSpeed={0.7}
        interactive
        mixBlendMode="screen"
        parallax
        parallaxStrength={0.16}
      />
    </div>,
    host,
  );
}
