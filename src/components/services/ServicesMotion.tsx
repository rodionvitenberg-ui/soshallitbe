"use client";

import { useEffect } from "react";
import gsap from "gsap";

/**
 * GSAP motion for /services.
 *
 * The production engine owns a virtual scroller (#ui is position:fixed and
 * translated), so ScrollTrigger-on-window would never fire. Reveals use
 * IntersectionObserver against the real viewport, then GSAP tweens.
 */
export function ServicesMotion() {
  useEffect(() => {
    const root = document.getElementById("home-services");
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let io: IntersectionObserver | null = null;

    const onFaqClick = (event: Event) => {
      const btn = (event.target as HTMLElement | null)?.closest<HTMLButtonElement>(
        ".svc-faq-q",
      );
      if (!btn || !root.contains(btn)) return;

      const item = btn.closest(".svc-faq-item");
      const panel = item?.querySelector<HTMLElement>(".svc-faq-a");
      if (!item || !panel) return;

      const willOpen = btn.getAttribute("aria-expanded") !== "true";

      root.querySelectorAll<HTMLButtonElement>(".svc-faq-q").forEach((other) => {
        if (other === btn) return;
        const otherItem = other.closest(".svc-faq-item");
        const otherPanel = otherItem?.querySelector<HTMLElement>(".svc-faq-a");
        if (!otherItem || !otherPanel) return;
        other.setAttribute("aria-expanded", "false");
        otherItem.classList.remove("is-open");
        closePanel(otherPanel, reduce);
      });

      btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
      item.classList.toggle("is-open", willOpen);
      if (willOpen) openPanel(panel, reduce);
      else closePanel(panel, reduce);
    };

    const ctx = gsap.context(() => {
      const heroBits = root.querySelectorAll(
        ".svc-eyebrow, .svc-hero-title, .svc-hero-scroll",
      );

      if (reduce) {
        gsap.set([heroBits, root.querySelectorAll("[data-svc-item]")], {
          autoAlpha: 1,
          y: 0,
        });
      } else {
        gsap.set(heroBits, { autoAlpha: 0, y: 28 });
        gsap.to(heroBits, {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.15,
        });
      }

      const reveal = (el: Element) => {
        if (!(el instanceof HTMLElement) || el.dataset.svcRevealed === "1") return;
        el.dataset.svcRevealed = "1";
        if (reduce) {
          gsap.set(el, { autoAlpha: 1, y: 0 });
          return;
        }
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 36 },
          { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" },
        );
      };

      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            reveal(entry.target);
            io?.unobserve(entry.target);
          }
        },
        { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
      );

      root.querySelectorAll<HTMLElement>("[data-svc-item]").forEach((el) => {
        if (!reduce) gsap.set(el, { autoAlpha: 0, y: 36 });
        io?.observe(el);
      });
    }, root);

    root.addEventListener("click", onFaqClick);

    return () => {
      io?.disconnect();
      root.removeEventListener("click", onFaqClick);
      ctx.revert();
    };
  }, []);

  return null;
}

function openPanel(panel: HTMLElement, reduce: boolean) {
  panel.hidden = false;
  gsap.killTweensOf(panel);
  if (reduce) {
    gsap.set(panel, { height: "auto", autoAlpha: 1 });
    return;
  }
  gsap.set(panel, { height: "auto", autoAlpha: 1 });
  const height = panel.scrollHeight;
  gsap.fromTo(
    panel,
    { height: 0, autoAlpha: 0 },
    {
      height,
      autoAlpha: 1,
      duration: 0.38,
      ease: "power2.out",
      onComplete: () => {
        gsap.set(panel, { height: "auto" });
      },
    },
  );
}

function closePanel(panel: HTMLElement, reduce: boolean) {
  if (reduce) {
    gsap.set(panel, { height: 0, autoAlpha: 0 });
    panel.hidden = true;
    return;
  }
  gsap.killTweensOf(panel);
  gsap.to(panel, {
    height: 0,
    autoAlpha: 0,
    duration: 0.28,
    ease: "power2.in",
    onComplete: () => {
      panel.hidden = true;
    },
  });
}
