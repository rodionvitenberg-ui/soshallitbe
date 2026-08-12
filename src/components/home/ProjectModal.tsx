"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { X, ArrowUpRight } from "lucide-react";
import type { ProjectPresentation } from "@/data/projects";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface ProjectModalProps {
  project: ProjectPresentation | null;
  onClose: () => void;
}

const OPEN_DURATION = 0.9;
const CLOSE_DURATION = 0.5;

/**
 * Модальное окно-свиток для FEATURED PROJECTS.
 * Тексты читаются из i18n (messages/{en,ru}.json) по ключу project.i18nKey.
 *
 * Механика:
 *  - Root невидим через CSS (display:none); класс .is-open включает его.
 *  - Лист съезжает сверху вниз (CSS-старт translateY(-110%) → GSAP y:0).
 *  - Внутри собственный скролл с параллаксом (ScrollTrigger, scroller = sheet).
 */
export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  const targetScrollRef = useRef(0);
  const smoothRafRef = useRef(0);
  const [visible, setVisible] = useState(false);
  const t = useTranslations("featured.projects");

  const closeModal = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false);
      document.body.classList.remove("project-modal-open");
      onClose();
      return;
    }

    const ctx = gsap.context(() => {
      const sheet = sheetRef.current;
      if (sheet) {
        gsap.to(sheet, {
          y: -sheet.offsetHeight * 1.1,
          duration: CLOSE_DURATION,
          ease: "power4.in",
          onComplete: () => {
            setVisible(false);
            document.body.classList.remove("project-modal-open");
            onClose();
          },
        });
      }
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: CLOSE_DURATION * 0.8,
      });
      gsap.to(root, { autoAlpha: 0, duration: CLOSE_DURATION * 0.7, delay: 0.1 });
    }, root);
    ctxRef.current = ctx;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);

  useEffect(() => {
    if (!project || !rootRef.current) return;

    document.body.classList.add("project-modal-open");
    setVisible(true);

    const raf = requestAnimationFrame(() => {
      const ctx = gsap.context(() => {
        const sheet = sheetRef.current;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduce || !sheet) {
          gsap.set(sheetRef.current, { y: 0, autoAlpha: 1 });
          gsap.set(overlayRef.current, { opacity: 1 });
          return;
        }

        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.set(sheet, { y: -sheet.offsetHeight * 1.1, autoAlpha: 1 })
          .to(overlayRef.current, {
            opacity: 1,
            duration: OPEN_DURATION * 0.6,
            ease: "power2.inOut",
          })
          .to(sheet, { y: 0, duration: OPEN_DURATION, ease: "power4.out" }, 0)
          .fromTo(
            ".project-modal-hero-img",
            { scale: 1.12 },
            { scale: 1, duration: OPEN_DURATION * 1.1, ease: "expo.out" },
            0.15,
          )
          .fromTo(
            ".project-modal-hero-title",
            { y: "2em", autoAlpha: 0 },
            { y: "0em", autoAlpha: 1, duration: 0.55, ease: "expo.out" },
            0.4,
          )
          .fromTo(
            ".project-modal-hero-meta",
            { y: "1em", autoAlpha: 0 },
            { y: "0em", autoAlpha: 1, duration: 0.45, ease: "expo.out" },
            0.46,
          )
          .fromTo(
            ".project-modal-header-row",
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.4, ease: "power2.out" },
            0.55,
          )
          .fromTo(
            ".project-modal-section",
            { y: 40, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.55, ease: "power2.out", stagger: 0.07 },
            0.6,
          );
      }, rootRef.current!);
      ctxRef.current = ctx;
    });

    return () => {
      cancelAnimationFrame(raf);
      ctxRef.current?.revert();
      ctxRef.current = null;
      document.body.classList.remove("project-modal-open");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  useEffect(() => {
    if (!project || !visible) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const ctx = gsap.context(() => {
      const items = scroller.querySelectorAll<HTMLElement>("[data-parallax]");
      items.forEach((item) => {
        const speed = parseFloat(item.dataset.parallax ?? "0.12");
        gsap.fromTo(
          item,
          { yPercent: speed * 100 },
          {
            yPercent: -speed * 100,
            ease: "none",
            scrollTrigger: {
              trigger: item,
              scroller,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          },
        );
      });
    }, scroller!);

    return () => ctx.revert();
  }, [project, visible]);

  const scrollToSmooth = useCallback(() => {
    cancelAnimationFrame(smoothRafRef.current);
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const step = () => {
      const current = scroller.scrollTop;
      const target = targetScrollRef.current;
      const next = current + (target - current) * 0.14;
      if (Math.abs(target - next) < 0.5) {
        scroller.scrollTop = target;
        return;
      }
      scroller.scrollTop = next;
      smoothRafRef.current = requestAnimationFrame(step);
    };
    smoothRafRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !project) return;
    const onWheelCapture = (e: WheelEvent) => {
      const root = rootRef.current;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      if (!root || !root.contains(e.target as Node)) return;
      const { deltaY } = e;
      const max = scroller.scrollHeight - scroller.clientHeight;
      targetScrollRef.current = Math.max(
        0,
        Math.min(max, targetScrollRef.current + deltaY),
      );
      scrollToSmooth();
    };
    window.addEventListener("wheel", onWheelCapture, {
      passive: false,
      capture: true,
    });
    return () => {
      cancelAnimationFrame(smoothRafRef.current);
      window.removeEventListener("wheel", onWheelCapture, { capture: true });
    };
  }, [project, scrollToSmooth]);

  useEffect(() => {
    if (!project) return;
    const onTouchMoveCapture = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    };
    document.addEventListener("touchmove", onTouchMoveCapture, {
      passive: false,
      capture: true,
    });
    return () =>
      document.removeEventListener("touchmove", onTouchMoveCapture, {
        capture: true,
      });
  }, [project]);

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      const navKeys = [
        " ",
        "ArrowUp",
        "ArrowDown",
        "PageUp",
        "PageDown",
        "Home",
        "End",
      ];
      if (navKeys.includes(e.key)) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
          targetScrollRef.current += 180;
        } else if (e.key === "ArrowUp" || e.key === "PageUp") {
          targetScrollRef.current -= 180;
        } else if (e.key === "Home") {
          targetScrollRef.current = 0;
        } else if (e.key === "End") {
          targetScrollRef.current = scrollerRef.current?.scrollHeight ?? 0;
        }
        const scroller = scrollerRef.current;
        if (scroller) {
          targetScrollRef.current = Math.max(
            0,
            Math.min(
              scroller.scrollHeight - scroller.clientHeight,
              targetScrollRef.current,
            ),
          );
        }
        scrollToSmooth();
        return;
      }
      if (e.key === "Escape") {
        e.stopImmediatePropagation();
        closeModal();
      }
    };
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true });
  }, [project, closeModal, scrollToSmooth]);

  const handleRootClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) closeModal();
  };

  if (!project) return null;

  const key = project.id;
  const name = t(`${key}.name`);
  const tags = t(`${key}.tags`);
  const overviewKicker = t(`${key}.overview.kicker`);
  const overviewTitle = t(`${key}.overview.title`);
  const overviewBody = t(`${key}.overview.body`);
  const sections = (t.raw(`${key}.sections`) ??
    []) as Array<{ kicker: string; title: string; body: string }>;
  const stack = (t.raw(`${key}.stack`) ?? []) as string[];
  const cta = t(`${key}.cta`);

  return (
    <div
      ref={rootRef}
      className={`project-modal-root${visible ? " is-open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={name}
      onClick={handleRootClick}
    >
      <div ref={overlayRef} className="project-modal-overlay" />
      <div ref={sheetRef} className="project-modal-sheet">
        <div ref={scrollerRef} className="project-modal-scroll">
          <div className="project-modal-hero">
            <img
              className="project-modal-hero-img"
              src={project.hero}
              alt={name}
              draggable={false}
            />
            <div className="project-modal-hero-shade" />
            <div className="project-modal-hero-content">
              <div className="project-modal-hero-meta">
                <span className="project-modal-hero-tags">{tags}</span>
                <span className="project-modal-hero-year">{project.year}</span>
              </div>
              <h2 className="project-modal-hero-title">{name}</h2>
            </div>
          </div>

          <header className="project-modal-header-row">
            <div className="project-modal-header">
              <span className="project-modal-header-kicker">{overviewKicker}</span>
              <span className="project-modal-header-index">{project.year}</span>
            </div>
            <button
              type="button"
              className="project-modal-close"
              onClick={closeModal}
              aria-label="Close project"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </header>

          <div className="project-modal-content">
            <section className="project-modal-section project-modal-overview" data-parallax="0.04">
              <p className="project-modal-overview-title" data-parallax="0.06">
                {overviewTitle}
              </p>
              <p className="project-modal-overview-body">{overviewBody}</p>
            </section>

            {sections.map((section) => (
              <section key={section.kicker} className="project-modal-section">
                <div className="project-modal-section-main">
                  <p className="project-modal-section-kicker" data-parallax="0.08">
                    {section.kicker}
                  </p>
                  <h3 className="project-modal-section-title" data-parallax="0.05">
                    {section.title}
                  </h3>
                  <p className="project-modal-section-body">{section.body}</p>
                </div>
              </section>
            ))}

            <section className="project-modal-section project-modal-stack-section">
              <p className="project-modal-section-kicker">Stack</p>
              <div className="project-modal-stack">
                {stack.map((tech) => (
                  <span key={tech} className="project-modal-stack-chip">
                    {tech}
                  </span>
                ))}
              </div>
            </section>

            <section className="project-modal-section project-modal-cta-section">
              <a className="project-modal-cta" href={project.url} target="_blank" rel="noreferrer">
                <span>{cta}</span>
                <ArrowUpRight size={20} strokeWidth={1.5} />
              </a>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
