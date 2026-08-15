"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Iridescence from "@/components/Iridescence";

/** Hold before the curtain lifts. Was 1.4s; +1s per product request (total 2.4s). */
const HOLD_S = 2.4;
const SLIDE_S = 0.4;
/** Fake progress duration — independent of curtain motion. Completes just before lift. */
const LOADER_DURATION_S = 2;

/** Hero-matching iridescent shader, but deep blue (#366894). */
const CURTAIN_COLOR: [number, number, number] = [0.21176, 0.40784, 0.58039];

/** White slogan + loader on the deep-blue curtain. */
const CURTAIN_TEXT = "#ffffff";

const SLOGAN_LINE_STYLE = {
  boxSizing: "border-box",
  position: "relative",
  zIndex: 1,
  width: "100%",
  maxWidth: "100%",
  padding: "0 clamp(1rem, 5vw, 2.5rem)",
  fontFamily: "Aeonik, system-ui, sans-serif",
  fontWeight: 500,
  fontSize: "clamp(1.35rem, 7.2vw, 8.5rem)",
  lineHeight: 1.1,
  letterSpacing: "-0.02em",
  textWrap: "balance",
  overflowWrap: "anywhere",
  hyphens: "manual",
  color: CURTAIN_TEXT,
} as const;

/**
 * Intro splash curtain.
 *
 * Rendered from the first paint; fully covers the viewport so loading /
 * engine init stay hidden underneath.
 *
 * Background: same iridescent WebGL animation as the home hero, but
 * deep blue (#366894). One static slogan + loader in white.
 *
 * Timeline (total 2.8s — curtain only):
 *   0.0 – 2.4s  full curtain, slogan + fake loader
 *   2.4 – 2.8s  curtain slides up, then unmounts
 *
 * Fake loader: 0 → 100% over 2s. Does not gate or alter curtain motion.
 */
export function IntroOverlay() {
  const rootRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const curtain = curtainRef.current;
    const fill = fillRef.current;
    const percent = percentRef.current;
    if (!root || !curtain || !fill || !percent) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setHidden(true);
      return;
    }

    gsap.set(root, { autoAlpha: 1 });
    gsap.set(curtain, { yPercent: 0 });
    gsap.set(fill, { scaleX: 0 });
    percent.textContent = "0";

    const curtainTl = gsap.timeline({
      onComplete: () => setHidden(true),
    });
    curtainTl.to(
      curtain,
      { yPercent: -100, duration: SLIDE_S, ease: "power4.inOut" },
      HOLD_S,
    );

    const progress = { value: 0 };
    const loaderTween = gsap.to(progress, {
      value: 100,
      duration: LOADER_DURATION_S,
      ease: "power2.inOut",
      onUpdate: () => {
        const v = progress.value;
        fill.style.transform = `scaleX(${v / 100})`;
        percent.textContent = String(Math.round(v));
      },
    });

    return () => {
      curtainTl.kill();
      loaderTween.kill();
    };
  }, []);

  if (hidden) return null;

  return (
    <div ref={rootRef} aria-hidden="true">
      <div
        ref={curtainRef}
        id="intro-curtain"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: CURTAIN_TEXT,
          // Opaque base guard: the curtain is visible from the FIRST byte of
          // SSR HTML, before hydration/WebGL/CSS — no content flash underneath.
          background: "#366894",
          willChange: "transform",
        }}
      >
        <div style={{ position: "absolute", inset: 0 }}>
          <Iridescence
            color={CURTAIN_COLOR}
            clearColor={CURTAIN_COLOR}
            mouseReact
            amplitude={0.1}
            speed={1}
          />
        </div>

        <div style={SLOGAN_LINE_STYLE}>AS YOU DREAM,</div>
        <div style={SLOGAN_LINE_STYLE}>SO SHALL IT BE.</div>

        <div
          style={{
            position: "absolute",
            bottom: "clamp(2.5rem, 6vh, 4.5rem)",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.75rem",
            width: "min(16rem, 42vw)",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontFamily: "Aeonik, system-ui, sans-serif",
              fontWeight: 500,
              fontSize: "0.8125rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: CURTAIN_TEXT,
              opacity: 0.85,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            <span ref={percentRef}>0</span>
            <span>%</span>
          </div>
          <div
            style={{
              width: "100%",
              height: 1,
              background: "rgba(255, 255, 255, 0.22)",
              overflow: "hidden",
            }}
          >
            <div
              ref={fillRef}
              style={{
                width: "100%",
                height: "100%",
                background: CURTAIN_TEXT,
                transform: "scaleX(0)",
                transformOrigin: "left center",
                willChange: "transform",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
