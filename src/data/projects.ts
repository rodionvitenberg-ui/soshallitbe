export interface ProjectSection {
  kicker: string;
  title: string;
  body: string;
}

export interface ProjectPresentation {
  id: string;
  name: string;
  tags: string;
  url: string;
  year: string;
  hero: string;
  overview: ProjectSection;
  sections: ProjectSection[];
  stack: string[];
  cta: string;
}

/**
 * Единый шаблон презентации проектов.
 * Порядок рассказа фиксирован: Hero → Overview → Sections (по одному на аспект) → Stack → CTA.
 * Для каждой страницы/скриншота добавляется секция в `sections`.
 */
export const PROJECT_PRESENTATIONS: Record<string, ProjectPresentation> = {
  oryzo_ai: {
    id: "oryzo_ai",
    name: "Daerdree Bar & Timeclub",
    tags: "entertainment • lounge concept • booking • UI/UX • web",
    url: "https://daerdree.bar/",
    year: "2026",
    hero: "/assets/projects/oryzo_ai/home.webp",
    overview: {
      kicker: "The Brief",
      title: "A lounge that sells atmosphere, not drinks.",
      body: "Daerdree Bar & Timeclub needed a digital identity as magnetic as its rooms — an entertainment platform where booking feels like an invitation, not a transaction.",
    },
    sections: [
      {
        kicker: "01 / Concept",
        title: "Darker, warmer, louder.",
        body: "We leaned into a dusk-toned palette, oversized editorial type, and motion that breathes like nightlife — every screen designed around the pulse of the venue.",
      },
      {
        kicker: "02 / Booking",
        title: "Reservations without friction.",
        body: "Table selection, date pickers, and time slots were compressed into a single flowing flow, cutting booking time to under a minute.",
      },
      {
        kicker: "03 / Interface",
        title: "UI that knows your table.",
        body: "Interactive menus, event schedules, and private-club details live in one coherent system — sharp on desktop, equally confident on mobile.",
      },
    ],
    stack: ["Next.js", "TypeScript", "GSAP", "Tailwind", "PostgreSQL"],
    cta: "Visit the venue",
  },
  of_the_oak: {
    id: "of_the_oak",
    name: "Dastorkon Ethno-Restaurant",
    tags: "gastronomy • restaurant • interactive menu • i18n • web",
    url: "https://iksoft.pro/",
    year: "2026",
    hero: "/assets/projects/of_the_oak/home.webp",
    overview: {
      kicker: "The Brief",
      title: "Heritage plated in pixels.",
      body: "Dastorkon blends centuries of nomad cuisine with a modern dining room. The site had to taste as rich as the menu — and speak fluently in two languages.",
    },
    sections: [
      {
        kicker: "01 / Story",
        title: "Every dish has a chapter.",
        body: "We structured the menu as a journey — ingredients, origins, and rituals behind each plate — turning a restaurant site into a cultural archive.",
      },
      {
        kicker: "02 / Menu",
        title: "A menu that serves itself.",
        body: "Category navigation, dietary filters, and dish photography flow into a calm reading experience, built for both the curious guest and the quick browser.",
      },
      {
        kicker: "03 / Locale",
        title: "Two tongues, one table.",
        body: "Full i18n between English and Russian — routing, content, and formatting — so every guest reads the story the way it was meant to be told.",
      },
    ],
    stack: ["Next.js", "TypeScript", "i18n", "Tailwind", "PostgreSQL"],
    cta: "Taste the menu",
  },
  devin_ai: {
    id: "devin_ai",
    name: "Walmgres Investment",
    tags: "fintech • investment platform • analytics • web",
    url: "https://walmgres-8c8z.vercel.app/",
    year: "2026",
    hero: "/assets/projects/devin_ai/home.webp",
    overview: {
      kicker: "The Brief",
      title: "Complex capital, composed.",
      body: "Walmgres needed an investment platform that makes sophisticated portfolios feel calm, legible, and decision-ready — without drowning in dashboards.",
    },
    sections: [
      {
        kicker: "01 / Position",
        title: "Confidence through clarity.",
        body: "A restrained dark interface with precise data hierarchy — numbers lead, decoration follows. Every screen answers: where do I stand?",
      },
      {
        kicker: "02 / Analytics",
        title: "Data that performs.",
        body: "Portfolio breakdowns, performance curves, and risk indicators render as focused charts — engineered to stay instant on heavy datasets.",
      },
      {
        kicker: "03 / Motion",
        title: "Movement with intent.",
        body: "Transitions between states guide the eye, never distract it. GSAP-driven reveals make navigation feel like an instrument, not a slideshow.",
      },
    ],
    stack: ["Next.js", "TypeScript", "GSAP", "Recharts", "PostgreSQL"],
    cta: "Explore the platform",
  },
  porsche_dream_machine: {
    id: "porsche_dream_machine",
    name: "IkSoft Studio",
    tags: "software studio • agency showcase • web • 3d",
    url: "https://rvstudio-ten.vercel.app/",
    year: "2026",
    hero: "/assets/projects/porsche_dream_machine/home.webp",
    overview: {
      kicker: "The Brief",
      title: "A studio that ships velocity.",
      body: "IkSoft is a software studio that builds fast and thinks faster. The showcase had to feel engineered — speed, precision, and a touch of obsession.",
    },
    sections: [
      {
        kicker: "01 / Presence",
        title: "Performance as identity.",
        body: "We opened with motion and momentum — 3D-led hero, rapid scroll choreography — so the site itself demonstrates what the studio sells.",
      },
      {
        kicker: "02 / Work",
        title: "Case studies as products.",
        body: "Project presentations are structured like product pages: problem, process, result. Clients scroll through proof, not promises.",
      },
      {
        kicker: "03 / Craft",
        title: "Details that compound.",
        body: "Typographic contrast, precise spacing, and micro-interactions tuned by hand — the invisible ingredients of a premium software brand.",
      },
    ],
    stack: ["Next.js", "TypeScript", "Three.js", "GSAP", "WebGL"],
    cta: "Hire the studio",
  },
  synthetic_human: {
    id: "synthetic_human",
    name: "Webdoc.life AI",
    tags: "healthtech • AI medical parser • saas • next.js",
    url: "https://webdoc.life/",
    year: "2026",
    hero: "/assets/projects/synthetic_human/home.webp",
    overview: {
      kicker: "The Brief",
      title: "AI that reads the chart.",
      body: "Webdoc.life parses medical documents into structured health records. The product had to earn trust — clarity and calm were non-negotiable.",
    },
    sections: [
      {
        kicker: "01 / Product",
        title: "From paperwork to signal.",
        body: "Upload a document, receive a structured profile. We designed the pipeline so users always see what the AI extracted and why.",
      },
      {
        kicker: "02 / Trust",
        title: "Transparency by design.",
        body: "Source highlighting and extraction confidence make the machine legible — the interface proves its own accuracy as you watch.",
      },
      {
        kicker: "03 / Experience",
        title: "Healing, quietly.",
        body: "A light, clinical palette with generous whitespace keeps the experience gentle — technology that steps back so the patient steps forward.",
      },
    ],
    stack: ["Next.js", "TypeScript", "AI Parser", "Tailwind", "PostgreSQL"],
    cta: "Open the product",
  },
  spatial_fusion: {
    id: "spatial_fusion",
    name: "Careyourpet (PetVet)",
    tags: "vet CRM • SaaS • postgresql • web • mobile",
    url: "https://careyour.pet/",
    year: "2026",
    hero: "/assets/projects/spatial_fusion/home.webp",
    overview: {
      kicker: "The Brief",
      title: "Every paw, tracked.",
      body: "Careyourpet is a veterinary CRM built for clinics that juggle patients, appointments, and records. The system had to be warm enough for nurses, fast enough for doctors.",
    },
    sections: [
      {
        kicker: "01 / System",
        title: "One record, every visit.",
        body: "A unified patient timeline consolidates medical history, prescriptions, and vaccination schedules — no more paper stacks behind the desk.",
      },
      {
        kicker: "02 / Workflow",
        title: "Built for busy hands.",
        body: "Keyboard-first scheduling, quick-search across pets and owners, and mobile-ready screens keep the whole clinic in the flow.",
      },
      {
        kicker: "03 / Interface",
        title: "Clinical, not cold.",
        body: "A soft palette and rounded geometry keep the tool approachable — software that respects the people caring for our animals.",
      },
    ],
    stack: ["React", "TypeScript", "PostgreSQL", "Tailwind", "Mobile"],
    cta: "Meet the clinic",
  },
  spaace: {
    id: "spaace",
    name: "Proffmusic.shop",
    tags: "audio stock • music marketplace • e-commerce • digital assets",
    url: "https://proffmusic.shop/",
    year: "2026",
    hero: "/assets/projects/spaace/home.webp",
    overview: {
      kicker: "The Brief",
      title: "Sound, sorted.",
      body: "Proffmusic is a marketplace for professional audio — samples, loops, and stems. Browsing thousands of assets had to feel as good as hearing them.",
    },
    sections: [
      {
        kicker: "01 / Discovery",
        title: "Listen while you look.",
        body: "Inline previews let producers audition tracks without leaving the grid — the fastest path from search to 'load into the DAW'.",
      },
      {
        kicker: "02 / Commerce",
        title: "Downloads that don't break the flow.",
        body: "Cart, licensing, and instant delivery are reduced to a few uncluttered steps. The store stays out of the way of the music.",
      },
      {
        kicker: "03 / Identity",
        title: "Studio-grade aesthetics.",
        body: "Deep tones, waveform motifs, and precise typography create a brand that producers trust at first glance.",
      },
    ],
    stack: ["Next.js", "TypeScript", "E-commerce", "Tailwind", "PostgreSQL"],
    cta: "Browse the catalog",
  },
  ddd_2024: {
    id: "ddd_2024",
    name: "El-Imperia Shop",
    tags: "e-commerce • retail • online store • web",
    url: "https://el-imperia.shop/",
    year: "2026",
    hero: "/assets/projects/ddd_2024/home.webp",
    overview: {
      kicker: "The Brief",
      title: "Retail that converts.",
      body: "El-Imperia is a full retail e-commerce operation. The store needed merchandising power, effortless checkout, and a presence that sells.",
    },
    sections: [
      {
        kicker: "01 / Catalog",
        title: "Grids that merchandise.",
        body: "Product photography, filters, and category storytelling are layered into a tight grid — shoppers find what they want, then discover what they didn't.",
      },
      {
        kicker: "02 / Checkout",
        title: "The shortest path to paid.",
        body: "Cart → address → payment in three calm steps. Every input is engineered to reduce abandonment at the exact moment it matters.",
      },
      {
        kicker: "03 / Brand",
        title: "Premium shelf presence.",
        body: "A composed palette and editorial product pages give the store the confidence of a flagship, not a marketplace stall.",
      },
    ],
    stack: ["Next.js", "TypeScript", "E-commerce", "Tailwind", "PostgreSQL"],
    cta: "Shop the store",
  },
  choo_choo_world: {
    id: "choo_choo_world",
    name: "GardenHouse Eco-Resort",
    tags: "hospitality • garden hotel concept • booking • web",
    url: "https://maintest.site/gardenhouse/",
    year: "2026",
    hero: "/assets/projects/choo_choo_world/home.webp",
    overview: {
      kicker: "The Brief",
      title: "A room in the garden.",
      body: "GardenHouse is an eco-resort where architecture dissolves into landscape. The site had to make visitors feel the soil, the light, and the silence.",
    },
    sections: [
      {
        kicker: "01 / Atmosphere",
        title: "Nature as interface.",
        body: "Soft greens, organic shapes, and slow scroll rhythm mirror the resort itself — every interaction quieter than the last.",
      },
      {
        kicker: "02 / Stays",
        title: "Choose the sky you wake under.",
        body: "Cabin galleries, garden suites, and glamping pitches are presented as distinct micro-worlds, each with its own mood and view.",
      },
      {
        kicker: "03 / Booking",
        title: "Reserve the seasons.",
        body: "Availability, rates, and seasonal packages fold into one gentle flow — booking feels like planning a retreat, not a transaction.",
      },
    ],
    stack: ["Next.js", "TypeScript", "Booking", "Tailwind", "PostgreSQL"],
    cta: "Plan the retreat",
  },
  soda_experience: {
    id: "soda_experience",
    name: "BiMark Exchange",
    tags: "virtual assets • marketplace • digital goods • platform",
    url: "https://maintest.site/bimark/",
    year: "2026",
    hero: "/assets/projects/soda_experience/home.webp",
    overview: {
      kicker: "The Brief",
      title: "Digital goods, liquid market.",
      body: "BiMark is a marketplace for virtual assets — accounts, keys, and digital inventory. Buyers needed trust; sellers needed reach.",
    },
    sections: [
      {
        kicker: "01 / Market",
        title: "Listings that move.",
        body: "Categorized listings with live status, price history, and seller reputation make the market feel alive — and the next deal one glance away.",
      },
      {
        kicker: "02 / Trust",
        title: "Escrow as a feature.",
        body: "Guaranteed transactions are surfaced throughout the flow — badges, timelines, and protections turn a risky category into a safe one.",
      },
      {
        kicker: "03 / Experience",
        title: "Marketplace speed.",
        body: "Instant search, snappy filters, and responsive controls across devices keep traders in motion. The interface stays light; the market stays deep.",
      },
    ],
    stack: ["Next.js", "TypeScript", "Marketplace", "Tailwind", "PostgreSQL"],
    cta: "Enter the market",
  },
};

export function getProjectPresentation(id: string): ProjectPresentation | null {
  return PROJECT_PRESENTATIONS[id] ?? null;
}