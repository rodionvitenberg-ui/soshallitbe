"use client";

import { useEffect } from "react";

/**
 * Плавный скролл к секциям по клику на элементы [data-nav-scroll="<section-id>"].
 * Используется десктоп-кнопками хедера (.header-nav-btn) и пунктами мобильного
 * мегаменю (.#header-menu-link). Работает рядом с движком: движок управляет
 * своим ScrollManager, а здесь мы просто плавно скроллим DOM-секцию по id.
 */
export function HeaderNavScroll() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-nav-scroll]",
      );
      if (!target) return;

      const sectionId = target.dataset.navScroll;
      if (!sectionId) return;

      const section = document.getElementById(sectionId);
      if (!section) {
        e.preventDefault();
        e.stopPropagation();
        window.location.assign(`/#${sectionId}`);
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const scrollHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (!id) return;
      const section = document.getElementById(id);
      if (!section) return;
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const hashTimer = window.setTimeout(scrollHash, 700);
    document.addEventListener("click", onClick, true);
    return () => {
      window.clearTimeout(hashTimer);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}
