"use client";

import { useEffect } from "react";

/**
 * Header wordmark:
 * - default on load: AS I DREAMED... (line 1)
 * - scroll down → SO SHALL IT BE (line 2)
 * - scroll up → AS I DREAMED... (line 1)
 *
 * Direction-based (not section-based). Vertical slide is pure CSS via data-phrase.
 */
export function HeaderLogoPhrase() {
  useEffect(() => {
    const logo = document.getElementById("header-logo");
    const sr = document.getElementById("header-logo-sr");
    if (!logo) return;

    let phrase: "start" | "mid" = "start";
    logo.dataset.phrase = "start";
    if (sr) sr.textContent = "AS YOU DREAMED...";

    const setPhrase = (next: "start" | "mid") => {
      if (next === phrase) return;
      phrase = next;
      logo.dataset.phrase = next;
      if (sr) {
        sr.textContent =
          next === "mid" ? "SO SHALL IT BE" : "AS YOU DREAMED...";
      }
    };

    const onWheel = (e: WheelEvent) => {
      // Ignore pure horizontal pans / tiny noise
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX) || Math.abs(e.deltaY) < 0.5) {
        return;
      }
      if (e.deltaY > 0) setPhrase("mid");
      else setPhrase("start");
    };

    let touchY: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchY == null) return;
      const y = e.touches[0]?.clientY;
      if (y == null) return;
      const dy = touchY - y; // finger up → content down → positive
      if (Math.abs(dy) < 6) return;
      if (dy > 0) setPhrase("mid");
      else setPhrase("start");
      touchY = y;
    };
    const onTouchEnd = () => {
      touchY = null;
    };

    // Engine also uses pointer drag for scroll
    let pointerY: number | null = null;
    let pointerActive = false;
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      pointerActive = true;
      pointerY = e.clientY;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!pointerActive || pointerY == null) return;
      const dy = pointerY - e.clientY;
      if (Math.abs(dy) < 6) return;
      if (dy > 0) setPhrase("mid");
      else setPhrase("start");
      pointerY = e.clientY;
    };
    const onPointerUp = () => {
      pointerActive = false;
      pointerY = null;
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerUp, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  return null;
}
