"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useMessages } from "next-intl";
import gsap from "gsap";

export type IntroPage = "home" | "services";

type Slogan = { line1: string; line2: string };

/** Hold before the curtain lifts. Was 2.4s; shortened by 1s. */
const HOLD_S = 1.4;
const SLIDE_S = 0.4;
/** Fake progress duration — independent of curtain motion. Was 2s. */
const LOADER_DURATION_S = 1;

const FALLBACK: Slogan = {
  line1: "AS YOU DREAME,",
  line2: "SO SHALL IT BE.",
};

function readSlogans(messages: unknown, page: IntroPage): Slogan[] {
  const intro = (messages as { intro?: Record<string, unknown> } | null)
    ?.intro;
  const group = intro?.[page];
  if (!group || typeof group !== "object") return [FALLBACK];
  const out: Slogan[] = [];
  for (const item of Object.values(group as Record<string, unknown>)) {
    if (!item || typeof item !== "object") continue;
    const line1 = (item as { line1?: unknown }).line1;
    const line2 = (item as { line2?: unknown }).line2;
    if (typeof line1 === "string" && typeof line2 === "string") {
      out.push({ line1, line2 });
    }
  }
  return out.length ? out : [FALLBACK];
}

function nextSloganIndex(count: number, storageKey: string): number {
  if (typeof window === "undefined" || count <= 1) return 0;
  try {
    const last = Number(sessionStorage.getItem(storageKey));
    const base =
      Number.isInteger(last) && last >= 0
        ? last
        : Math.floor(Math.random() * count) - 1;
    const next = (base + 1 + count) % count;
    sessionStorage.setItem(storageKey, String(next));
    return next;
  } catch {
    return 0;
  }
}

/**
 * Intro splash curtain.
 *
 * Rendered from the first paint; fully covers the viewport with #0d0d0d so
 * loading / engine init stay hidden underneath.
 *
 * Timeline (total 1.8s — curtain only):
 *   0.0 – 1.4s  full black cover, slogan + fake loader
 *   1.4 – 1.8s  curtain slides up, then unmounts
 *
 * Fake loader: 0 → 100% over 1s. Does not gate or alter curtain motion.
 * Slogan rotates across 3 dictionary variants per page, each visit.
 */
export function IntroOverlay({ page }: { page: IntroPage }) {
  const messages = useMessages();
  const [slogan, setSlogan] = useState<Slogan | null>(null);

  useLayoutEffect(() => {
    const list = readSlogans(messages, page);
    const i = nextSloganIndex(list.length, `studio.intro-slogan.${page}`);
    setSlogan(list[i] ?? FALLBACK);
  }, [messages, page]);

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
          suppressHydrationWarning
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
          {slogan?.line1 ?? ""}
        </div>
        <div
          suppressHydrationWarning
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
          {slogan?.line2 ?? ""}
        </div>

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
