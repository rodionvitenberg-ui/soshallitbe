# Lusion Home

Local educational clone of the Lusion homepage: production engine + CSS + assets behind a thin Next.js shell.

## Language

**Engine**:
The patched production JavaScript module (`public/_astro/engine.js`) that owns WebGL, scroll ranges, preloader, and UI animations. It binds to fixed DOM ids and classes.
_Avoid_: app logic, framework runtime, Next runtime

**Fragment**:
A preserved production HTML slice under `src/fragments/` (hero, reel, header, …). Source of truth for visible markup and engine anchors.
_Avoid_: component template, partial (unless meaning a Fragment file)

**Shell**:
The Next.js App Router layer (`layout`, `page`, assembly) that serves meta, CSS, the engine script, and injects assembled fragments. Must not invent layout wrappers that break engine selectors.
_Avoid_: app, framework app

**Product cut**:
A deliberate omission or UI reduction vs the live Lusion site (no audio, no astronaut/tunnel, no Next Page scroll-nav, no preloader, no black transition overlay, delayed canvas is-ready + light WebGL clear to avoid load flash, no postal address, header reduced to Let's talk, collapsed goal section). Footer contact/socials kept. English UI for now.
_Avoid_: bug, incomplete port

**Message dictionary**:
Locale-specific user-facing copy in `messages/en.json` and `messages/ru.json`, injected into HTML fragments at assemble time.
_Avoid_: hard-coded copy in fragments, CMS

**Locale**:
Active language (`en` | `ru`) chosen without a URL prefix — cookie and Accept-Language via next-intl.
_Avoid_: `/en` path, subdomain

**Override**:
CSS in `public/styles/overrides.css` that implements product cuts without editing the bulk production stylesheet.
_Avoid_: theme, design system

**Vendor patch**:
Deterministic transform of `vendor/engine/engine.raw.js` → `public/_astro/engine.js` via `scripts/patch-engine.mjs` (audio off, tunnel/astronaut no-ops).
_Avoid_: fork, rewrite
