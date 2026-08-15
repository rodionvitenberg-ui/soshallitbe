export interface ProjectPresentation {
  id: string;
  /** i18n-ключ, под которым лежит весь текст презентации. */
  i18nKey: string;
  url: string;
  year: string;
  hero: string;
}

/**
 * Презентации проектов: нетекстовые поля в коде, весь текст —
 * в messages/{en,ru}.json по i18nKey (featured.projects.*).
 *
 * FEATURED (6): oryzo_ai, porsche_dream_machine, spatial_fusion,
 * ddd_2024, spaace, synthetic_human.
 * DESIGN CONCEPTS (4): choo_choo_world, agios, devin_ai, leondiana.
 */
export const PROJECT_PRESENTATIONS: Record<string, ProjectPresentation> = {
  oryzo_ai: { id: "oryzo_ai", i18nKey: "featured.projects.oryzo_ai", url: "https://daerdree.bar/", year: "2026", hero: "/assets/projects/oryzo_ai/home.webp" },
  porsche_dream_machine: { id: "porsche_dream_machine", i18nKey: "featured.projects.porsche_dream_machine", url: "https://iksoft.pro", year: "2026", hero: "/assets/projects/porsche_dream_machine/home.webp" },
  spatial_fusion: { id: "spatial_fusion", i18nKey: "featured.projects.spatial_fusion", url: "https://careyour.pet/", year: "2026", hero: "/assets/projects/spatial_fusion/home.webp" },
  ddd_2024: { id: "ddd_2024", i18nKey: "featured.projects.ddd_2024", url: "https://el-imperia.shop/", year: "2026", hero: "/assets/projects/ddd_2024/home.webp" },
  spaace: { id: "spaace", i18nKey: "featured.projects.spaace", url: "https://proffmusic.shop/", year: "2026", hero: "/assets/projects/spaace/home.webp" },
  synthetic_human: { id: "synthetic_human", i18nKey: "featured.projects.synthetic_human", url: "https://webdoc.life/", year: "2026", hero: "/assets/projects/synthetic_human/home.webp" },
  choo_choo_world: { id: "choo_choo_world", i18nKey: "featured.projects.choo_choo_world", url: "https://gardenhouse.iksoft.pro", year: "2026", hero: "/assets/projects/choo_choo_world/home.webp" },
  agios: { id: "agios", i18nKey: "featured.projects.agios", url: "https://agios.soshallitbe.cyou/en", year: "2026", hero: "/assets/projects/agios/home.webp" },
  devin_ai: { id: "devin_ai", i18nKey: "featured.projects.devin_ai", url: "https://walmgres-8c8z.vercel.app/", year: "2026", hero: "/assets/projects/devin_ai/home.webp" },
  leondiana: { id: "leondiana", i18nKey: "featured.projects.leondiana", url: "https://leondiana.soshallitbe.cyou/en", year: "2026", hero: "/assets/projects/leondiana/home.webp" },
};

export function getProjectPresentation(id: string): ProjectPresentation | null {
  return PROJECT_PRESENTATIONS[id] ?? null;
}