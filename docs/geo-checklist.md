# GEO & SEO Deployment Checklist — So Shall It Be

All machine-readable layers (`robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt`,
JSON-LD, `meta description`) are already aligned to one canonical identity:

- Brand: **So Shall It Be**
- Domain: **https://soshallitbe.cyou**
- Email: **soshallitbe5@gmail.com**
- X: **@soshallitbe5**
- Instagram: **@derweisseberg5**
- Type: Web, Mobile & AI Development Studio
- Location: **Cyprus only** (Limassol; serving Larnaca and the island + Europe)

> ⚠️ GEO rule: the studio positions itself **only in Cyprus and Europe**.
> Do not introduce other regions/countries in any SEO/GEO artifact.

## After deploying

- [ ] Confirm these URLs return `200` on the public domain:
  - `https://soshallitbe.cyou/robots.txt`
  - `https://soshallitbe.cyou/sitemap.xml`
  - `https://soshallitbe.cyou/llms.txt`
  - `https://soshallitbe.cyou/llms-full.txt`
- [ ] Check the homepage `<head>` contains:
  - `canonical` → `https://soshallitbe.cyou/`
  - JSON-LD: `ProfessionalService` (+ `Organization`), `WebSite`, `ItemList`
  - `og:site_name` = `So Shall It Be`, `twitter:card` = `summary_large_image`
- [ ] Check `/services` contains JSON-LD `FAQPage` (8 Q&A) and canonical URL.

## External profiles (must match the site exactly)

- [ ] **Google Business Profile** — name «So Shall It Be», Cyprus (Limassol),
  website `https://soshallitbe.cyou`, same email. Description mirrors `meta.description`.
- [ ] **X** — verify handle `@soshallitbe5`, bio mentions «Web, Mobile & AI Development Studio in Cyprus».
- [ ] **Instagram** — verified handle `@derweisseberg5`, same positioning.
- [ ] **GitHub / other profiles** — same brand name and description; link to domain.

## Indexing

- [ ] Submit `sitemap.xml` in Google Search Console.
- [ ] Submit the site in Bing Webmaster Tools.
- [ ] Verify `/robots.txt` allows the AI crawlers listed there (GPTBot, ClaudeBot,
      PerplexityBot, Google-Extended, etc.) — LLM tokens are what fuel GEO.

## Keeping it consistent

- Change contacts only in `messages/en.json` and `messages/ru.json` (footer/header)
  and in `src/components/structured-data.tsx` (JSON-LD) + `public/llms*.txt`.
  Keep the **same** email/name/handles in all four places.
- New project → add its i18n keys and entry in `src/data/projects.ts`;
  the JSON-LD `ItemList` and `llms-full.txt` portfolio section update manually afterwards.
- Never mention any non-Cyprus geographic region in SEO copy or GEO artifacts.