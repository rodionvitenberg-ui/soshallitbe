"use client";

import { useCallback, useEffect, useState } from "react";
import { ProjectModal } from "@/components/home/ProjectModal";
import {
  getProjectPresentation,
  type ProjectPresentation,
} from "@/data/projects";

/**
 * Перехват кликов по элементам #home-featured .project-item.
 *
 * Штатные ссылки ведут на внешние сайты — здесь мы их блокируем и вместо
 * перехода открываем модальное окно-свиток с презентацией проекта.
 * Проект ищется по data-id через единый шаблон презентаций.
 */
export function FeaturedProjects() {
  const [project, setProject] = useState<ProjectPresentation | null>(null);

  const close = useCallback(() => setProject(null), []);

  useEffect(() => {
    const onItemClick = (e: MouseEvent) => {
      const item = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        ".project-item",
      );
      if (!item) return;

      const id = item.dataset.id;
      if (!id) return;

      const presentation = getProjectPresentation(id);
      if (!presentation) return;

      e.preventDefault();
      e.stopPropagation();
      setProject(presentation);
    };

    // #ui пересобирается движком после загрузки — вешаем делегирование на документ.
    document.addEventListener("click", onItemClick, true);
    return () => document.removeEventListener("click", onItemClick, true);
  }, []);

  return <ProjectModal project={project} onClose={close} />;
}