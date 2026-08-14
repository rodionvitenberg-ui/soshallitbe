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
    const isMobile = window.matchMedia("(max-width: 812px)").matches;
    let io: IntersectionObserver | null = null;
    let brickIo: IntersectionObserver | null = null;
    let raf = 0;
    const revertTitle = isMobile ? () => {} : splitHeroTitle(root, reduce);

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
      if (reduce) {
        gsap.set(root.querySelectorAll("[data-svc-item]"), {
          autoAlpha: 1,
          y: 0,
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

      const bricks = root.querySelectorAll<HTMLElement>("[data-svc-brick]");
      bricks.forEach((el) => {
        if (!reduce) gsap.set(el, { autoAlpha: 0, y: 28, scale: 0.94 });
      });

      brickIo = new IntersectionObserver(
        (entries) => {
          const incoming = entries
            .filter((entry) => entry.isIntersecting)
            .map((entry) => entry.target as HTMLElement)
            .sort(
              (a, b) =>
                Number(a.dataset.brick ?? 0) - Number(b.dataset.brick ?? 0),
            );
          incoming.forEach((el, i) => {
            if (el.dataset.svcRevealed === "1") return;
            el.dataset.svcRevealed = "1";
            brickIo?.unobserve(el);
            if (reduce) {
              gsap.set(el, { autoAlpha: 1, y: 0, scale: 1 });
              return;
            }
            gsap.to(el, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.55,
              delay: i * 0.06,
              ease: "power3.out",
            });
          });
        },
        { threshold: 0.2, rootMargin: "0px 0px -6% 0px" },
      );
      bricks.forEach((el) => brickIo?.observe(el));
    }, root);

    if (!reduce && !isMobile) {
      const chars = Array.from(
        root.querySelectorAll<HTMLElement>(".svc-hero-char"),
      );
      const hero = root.querySelector<HTMLElement>(".svc-hero");
      let shown = 0;
      const tick = () => {
        shown = Math.min(1, shown + 1 / 54);
        const rect = hero?.getBoundingClientRect();
        const leave = rect
          ? clamp(-rect.top / Math.max(rect.height * 0.55, 1), 0, 1)
          : 0;
        const active = shown * (1 - leave);
        const last = Math.max(chars.length - 1, 1);
        for (let i = 0; i < chars.length; i++) {
          const t = i / last;
          const y = fit(active, t * 0.15, t * 0.15 + 0.7, 100, 0, easeDaerdree);
          chars[i].style.transform = `translate3d(0, ${y}%, 0)`;
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }

    root.addEventListener("click", onFaqClick);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      revertTitle();
      io?.disconnect();
      brickIo?.disconnect();
      root.removeEventListener("click", onFaqClick);
      ctx.revert();
    };
  }, []);

  return null;
}

function splitHeroTitle(root: HTMLElement, reduce: boolean): () => void {
  const title = root.querySelector<HTMLElement>(".svc-hero-title");
  if (!title) return () => {};
  const lines = Array.from(title.querySelectorAll<HTMLElement>(".svc-hero-line"));
  const snapshots = lines.map((line) => {
    const source = line.textContent ?? "";
    line.textContent = "";
    for (const word of source.trim().split(/\s+/)) {
      if (!word) continue;
      const wordEl = document.createElement("span");
      wordEl.className = "svc-hero-word";
      for (const ch of word) {
        const wrap = document.createElement("span");
        wrap.className = "svc-hero-char-wrap";
        const charEl = document.createElement("span");
        charEl.className = "svc-hero-char";
        charEl.textContent = ch;
        if (!reduce) charEl.style.transform = "translate3d(0, 100%, 0)";
        wrap.append(charEl);
        wordEl.append(wrap);
      }
      line.append(wordEl);
    }
    return { line, source };
  });

  return () => {
    for (const { line, source } of snapshots) line.textContent = source;
  };
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function easeDaerdree(t: number) {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

function fit(
  x: number,
  x0: number,
  x1: number,
  y0: number,
  y1: number,
  ease: (t: number) => number,
) {
  const t = clamp((x - x0) / (x1 - x0 || 1), 0, 1);
  return y0 + (y1 - y0) * ease(t);
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
