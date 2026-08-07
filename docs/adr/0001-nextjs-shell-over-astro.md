# Next.js shell over Astro for the Lusion homepage clone

The homepage is a thin framework shell around a fixed production engine and HTML fragments. We migrated the shell from Astro to Next.js (App Router) while keeping fragments, public assets, and the vendor engine patch unchanged.

**Why Next.js**: product direction and ecosystem fit for this monorepo path; the shell has no Astro-specific features beyond raw HTML includes and static asset serving.

**Why assemble `#ui` as one HTML string**: React host nodes would insert wrappers between parents and children; the engine and production CSS assume exact sibling/parent relationships (`#ui > #header`, `#home > #home-hero`, …). One `dangerouslySetInnerHTML` on `#ui` preserves that DOM.

**Rejected**: rewriting the engine into React/Three.js (out of scope; would break visual parity); `display: contents` wrappers (still break child combinators in the DOM tree).
