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
 */
export const PROJECT_PRESENTATIONS: Record<string, ProjectPresentation> = {
  lamaison: { id: "lamaison", i18nKey: "featured.projects.lamaison", url: "https://lamaison.soshallitbe.cyou/", year: "2026", hero: "/assets/projects/lamaison/home.webp" },
  agios: { id: "agios", i18nKey: "featured.projects.agios", url: "https://agios.soshallitbe.cyou/en", year: "2026", hero: "/assets/projects/agios/home.webp" },
  karagat: { id: "karagat", i18nKey: "featured.projects.karagat", url: "https://karagat.soshallitbe.cyou/", year: "2026", hero: "/assets/projects/karagat/home.webp" },
  nicks_coffee_bike: { id: "nicks_coffee_bike", i18nKey: "featured.projects.nicks_coffee_bike", url: "https://www.instagram.com/nicks_coffee_bike/", year: "2026", hero: "/assets/projects/nicks_coffee_bike/home.webp" },
  leondiana: { id: "leondiana", i18nKey: "featured.projects.leondiana", url: "https://leondiana.soshallitbe.cyou/en", year: "2026", hero: "/assets/projects/leondiana/home.webp" },
  oryzo_ai: { id: "oryzo_ai", i18nKey: "featured.projects.oryzo_ai", url: "https://daerdree.bar/", year: "2026", hero: "/assets/projects/oryzo_ai/home.webp" },
  of_the_oak: { id: "of_the_oak", i18nKey: "featured.projects.of_the_oak", url: "https://dastorkon.soshallitbe.cyou", year: "2026", hero: "/assets/projects/of_the_oak/home.webp" },
  devin_ai: { id: "devin_ai", i18nKey: "featured.projects.devin_ai", url: "https://walmgres-8c8z.vercel.app/", year: "2026", hero: "/assets/projects/devin_ai/home.webp" },
  porsche_dream_machine: { id: "porsche_dream_machine", i18nKey: "featured.projects.porsche_dream_machine", url: "https://iksoft.pro", year: "2026", hero: "/assets/projects/porsche_dream_machine/home.webp" },
  synthetic_human: { id: "synthetic_human", i18nKey: "featured.projects.synthetic_human", url: "https://webdoc.life/", year: "2026", hero: "/assets/projects/synthetic_human/home.webp" },
  spatial_fusion: { id: "spatial_fusion", i18nKey: "featured.projects.spatial_fusion", url: "https://careyour.pet/", year: "2026", hero: "/assets/projects/spatial_fusion/home.webp" },
  spaace: { id: "spaace", i18nKey: "featured.projects.spaace", url: "https://proffmusic.shop/", year: "2026", hero: "/assets/projects/spaace/home.webp" },
  ddd_2024: { id: "ddd_2024", i18nKey: "featured.projects.ddd_2024", url: "https://el-imperia.shop/", year: "2026", hero: "/assets/projects/ddd_2024/home.webp" },
  choo_choo_world: { id: "choo_choo_world", i18nKey: "featured.projects.choo_choo_world", url: "https://gardenhouse.iksoft.pro", year: "2026", hero: "/assets/projects/choo_choo_world/home.webp" },
  soda_experience: { id: "soda_experience", i18nKey: "featured.projects.soda_experience", url: "https://bimark.iksoft.pro", year: "2026", hero: "/assets/projects/soda_experience/home.webp" },
};

export function getProjectPresentation(id: string): ProjectPresentation | null {
  return PROJECT_PRESENTATIONS[id] ?? null;
}
