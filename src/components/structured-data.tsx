import { PROJECT_PRESENTATIONS } from "@/data/projects";

type Messages = Record<string, unknown>;

export type StructuredDataPage = "home" | "services";

const SITE_URL = "https://soshallitbe.cyou";
const BRAND = "So Shall It Be";
const SLOGAN = "As You Dream, So Shall It Be";
const EMAIL = "rodionvitenberg@gmail.com";
const X_HANDLE = "https://x.com/soshallitbe5";
const INSTAGRAM = "https://www.instagram.com/derweisseberg5/";
const LINKEDIN = "https://www.linkedin.com/in/rodion-vitenberg-4200363a4/";
const LOGO = `${SITE_URL}/logo.png`;
const SOCIAL_IMAGE = `${SITE_URL}/assets/meta/social_sharing.jpg`;

function getByPath(messages: Messages, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Messages)) {
      return (acc as Messages)[key];
    }
    return undefined;
  }, messages);
}

function str(messages: Messages, path: string): string {
  const value = getByPath(messages, path);
  return value == null || typeof value === "object" ? "" : String(value);
}

function organizationJsonLd(messages: Messages): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "Organization"],
    "@id": `${SITE_URL}/#organization`,
    name: BRAND,
    slogan: SLOGAN,
    url: SITE_URL,
    email: EMAIL,
    logo: LOGO,
    image: SOCIAL_IMAGE,
    description: str(messages, "meta.description"),
    sameAs: [X_HANDLE, INSTAGRAM, LINKEDIN],
    knowsAbout: [
      "Web application development",
      "Mobile application development",
      "AI development",
      "E-commerce",
      "Design",
      "CMS",
      "SEO",
      "Hosting",
    ],
    areaServed: [
      { "@type": "Country", name: "Cyprus" },
      { "@type": "Continent", name: "Europe" },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Limassol",
      addressCountry: "CY",
    },
    priceRange: "€349 - €999+",
    makesOffer: [
      {
        "@type": "Offer",
        name: str(messages, "services.offers.webTitle"),
        description: str(messages, "services.offers.webBody"),
      },
      {
        "@type": "Offer",
        name: str(messages, "services.offers.mobileTitle"),
        description: str(messages, "services.offers.mobileBody"),
      },
      {
        "@type": "Offer",
        name: str(messages, "services.offers.aiTitle"),
        description: str(messages, "services.offers.aiBody"),
      },
      {
        "@type": "Offer",
        name: str(messages, "services.prices.p3Name"),
      },
      {
        "@type": "Offer",
        name: str(messages, "services.prices.p7Name"),
      },
    ],
  };
}

function webSiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: BRAND,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

function faqJsonLd(messages: Messages): Record<string, unknown> {
  const mainEntity: Array<Record<string, unknown>> = [];
  for (let i = 1; i <= 8; i += 1) {
    const question = str(messages, `services.faq.q${i}`);
    const answer = str(messages, `services.faq.a${i}`);
    if (!question || !answer) continue;
    mainEntity.push({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    });
  }
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };
}

function itemListJsonLd(messages: Messages): Record<string, unknown> {
  const items = Object.values(PROJECT_PRESENTATIONS).map(
    (presentation, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: str(messages, `${presentation.i18nKey}.name`),
      description: str(messages, `${presentation.i18nKey}.overview.body`),
      url: presentation.url,
      image: `${SITE_URL}${presentation.hero}`,
    }),
  );
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: str(messages, "featured.title"),
    itemListElement: items,
  };
}

function buildStructuredData(
  messages: Messages,
  page: StructuredDataPage,
): Array<Record<string, unknown>> {
  const blocks: Array<Record<string, unknown>> = [
    organizationJsonLd(messages),
    webSiteJsonLd(),
  ];
  if (page === "home") {
    blocks.push(itemListJsonLd(messages));
  }
  if (page === "services") {
    blocks.push(faqJsonLd(messages));
  }
  return blocks;
}

export function StructuredData({
  messages,
  page,
}: {
  messages: Messages;
  page: StructuredDataPage;
}) {
  const blocks = buildStructuredData(messages, page);
  return (
    <>
      {blocks.map((block, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}

export { SITE_URL, BRAND, SLOGAN, EMAIL, X_HANDLE, INSTAGRAM, LINKEDIN };
