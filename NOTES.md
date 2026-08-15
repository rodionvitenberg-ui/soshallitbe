# daydream-home · Next.js project (homepage only)

Идеальная копия **главной** daydream-концепции на **Next.js** (App Router), с **продакшен-движком** (JS/CSS/ассеты), разбитая на модули для правок.

## Запуск

```bash
cd website-clones/daydream-home
npm install
node scripts/patch-engine.mjs   # если трогали vendor/engine/engine.raw.js
npm run dev                     # http://localhost:3000
npm run build && npm start
```

## Архитектура

```
src/
  app/
    [locale]/layout.tsx     # meta + daydream.css + engine.js (lang per locale)
    [locale]/page.tsx       # canvas + #ui (assembled DOM + i18n)
    api/locale/              # POST sets NEXT_LOCALE cookie (no /en|/ru in URL)
  i18n/                      # next-intl routing (localePrefix: never)
  lib/
    fragments.ts             # loadFragment(filename)
    apply-i18n.ts            # {{dotted.keys}} → messages
    assemble-home-ui.ts      # exact #ui HTML for the engine
  components/
    chrome/ · home/
  fragments/*.html           # DOM-скелет с плейсхолдерами {{…}}
messages/
  en.json · ru.json          # весь пользовательский текст
public/
  _astro/engine.js · daydream.css
  styles/overrides.css
  assets/
vendor/engine/ · scripts/patch-engine.mjs
```

Движок **жёстко завязан на id/class** (`#home-hero`, `#home-featured`, …).  
Меняя разметку — сохраняйте эти id, иначе сломается скролл/WebGL.

Страница собирает HTML **одной строкой** в `#ui`, чтобы не появлялись лишние React-обёртки.

**i18n:** next-intl остаётся (`messages/en.json` + `ru.json`), URL **без** `/en`/`/ru`.  
Сейчас UI **только EN** (переключатель снят, `localeDetection: false`). Тексты — в `messages/*.json`.  
Логотип хедера: `public/logo.png`.

## Космонавт

Отключён патчем `scripts/patch-engine.mjs`:

- `goalTunnelAstronauts.preInit/init/update` → no-op (не грузит `.buf`/текстуры, не анимирует)
- убран `preUfxContainer.add(goalTunnelAstronauts.container)`
- файлы `assets/**/astronaut*` не обязательны (можно не класть)

Секция Goal с текстами «Where Creative Ideas…» **удалена из UI** (stubs для движка, height 0).  
Tunnel/astronaut timeline выключен патчем.

## Что править

| Задача | Файл |
|---|---|
| Тексты (en/ru) | `messages/en.json`, `messages/ru.json` |
| DOM-скелет секций | `src/fragments/*.html` (`{{keys}}`) |
| Состав страницы | `src/lib/assemble-home-ui.ts` / `src/app/[locale]/page.tsx` |
| CSS UI | `public/_astro/daydream.css` или `vendor/engine/daydream.css` |
| Product overrides | `public/styles/overrides.css` |
| Движок / патчи | `vendor/engine/engine.raw.js` → `node scripts/patch-engine.mjs` |
| Картинки кейсов | `public/assets/projects/<id>/` |

## Единственный проект

В `website-clones/` остаётся только **`daydream-home`**.

## Юридика

Проприетарный reference-движок. Локально / обучение. Не публичный rehost как официальный сайт.

## SEO / GEO layer

- **Canonical entity**: «So Shall It Be» / `soshallitbe.cyou` / email `soshallitbe5@gmail.com`.
- **Positioning: Cyprus + Europe only.** No Kyrgyzstan/Karakol in any SEO/GEO artifact.
- `public/robots.txt` — allows standard + AI crawlers (GPTBot, ClaudeBot, PerplexityBot, …).
- `public/sitemap.xml` — `/` and `/services`.
- `src/components/structured-data.tsx` — JSON-LD: ProfessionalService/Organization, WebSite, ItemList (home), FAQPage (services).
- `public/llms.txt` + `public/llms-full.txt` — LLM-readable studio passport (llmstxt.org-style).
- `src/fragments/home-about.html` — crawler-visible «who/what/where/pricing» SSR block inside `#ui`; visually clipped out by `overrides.css` (no impact on engine scroll math).
- `docs/geo-checklist.md` — deployment + external-profile consistency checklist.

## Product cuts (custom)

- **No tunnel / astronaut**; Goal manifesto copy removed (engine stubs only).
- **No audio**: `USE_AUDIO=false`; audios folder removed.
- **Footer**: contact socials / enquiries / newsletter (`#footer-section`); **no postal address**.
- **i18n**: next-intl + `messages/{en,ru}.json` kept; UI English-only for now (no switcher).
- **Header logo**: `public/logo.png` instead of the original SVG wordmark.
- **Hero visual slot**: react-bits `Iridescence` (`src/components/home/HeroIridescence.tsx`) in `#home-hero-visual-container`; engine `homeBalloons` disabled. RAF pauses off-screen / hidden tab.
- **Vimeo oEmbed soft-fail** in engine patch: network/private video no longer throws Next runtime overlay (reel may not play without a valid embed).
- **No Next Page scroll-nav**: black `#scroll-nav-section` omitted; `ScrollNavSection` no-op + `RouteManager._initDom` null-safe.
- **No preloader UI**: `#preloader` omitted; engine still runs loader → init/start without digit DOM.
- **No black transition overlay**: `#transition-overlay` omitted; `TransitionOverlay` never paints full-screen black.
- **No load flash**: `html.is-ready` (shows `#canvas`) deferred until `start()`; WebGL `bgColor`/clear init to off-white so white→black→white does not appear without the preloader cover.
- **Header**: only **Let's talk** (sound/menu hidden stubs).
- **No** See all projects / CONTINUE TO SCROLL (`#end-bottom`).
- **Let's work together** sits under project cards.
