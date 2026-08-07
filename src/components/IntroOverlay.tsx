"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const LINE1 = "AS YOU DREAMED,";
const LINE2 = "SO SHALL IT BE.";

/** Fake progress duration — independent of curtain timing. */
const LOADER_DURATION_S = 2;

/**
 * Intro splash curtain.
 *
 * Rendered from the first paint; fully covers the viewport with #0d0d0d so
 * loading / engine init stay hidden underneath.
 *
 * Timeline (total 2.8s — curtain only):
 *   0.0 – 2.4s  full black cover, slogan + fake loader
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

    // Curtain timeline — unchanged behaviour.
    const curtainTl = gsap.timeline({
      onComplete: () => setHidden(true),
    });
    curtainTl.to(
      curtain,
      { yPercent: -100, duration: 0.4, ease: "power4.inOut" },
      2.4,
    );

    // Fake progress — separate tween, no shared timeline with the curtain.
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
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          background: "#0d0d0d",
          color: "#ffffff",
          willChange: "transform",
        }}
      >
        <div
          style={{
            boxSizing: "border-box",
            width: "100%",
            maxWidth: "100%",
            padding: "0 clamp(1rem, 5vw, 2.5rem)",
            fontFamily: "Aeonik, system-ui, sans-serif",
            fontWeight: 500,
            /* Min size fits "AS YOU DREAMED," on ~320px; scales up on desktop */
            fontSize: "clamp(1.35rem, 7.2vw, 8.5rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            textWrap: "balance",
            overflowWrap: "anywhere",
            hyphens: "manual",
          }}
        >
          {LINE1}
        </div>
        <div
          style={{
            boxSizing: "border-box",
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
          }}
        >
          {LINE2}
        </div>

        {/* Fake load progress — visual only, independent of curtain. */}
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
          }}
        >
          <div
            style={{
              fontFamily: "Aeonik, system-ui, sans-serif",
              fontWeight: 500,
              fontSize: "0.8125rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.55)",
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
              background: "rgba(255, 255, 255, 0.18)",
              overflow: "hidden",
            }}
          >
            <div
              ref={fillRef}
              style={{
                width: "100%",
                height: "100%",
                background: "#ffffff",
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
