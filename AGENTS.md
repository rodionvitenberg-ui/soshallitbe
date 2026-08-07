## Development

When starting the dev server, use background mode:

```
npm run dev
```

Default URL: http://localhost:3000

Engine patch runs automatically via `predev` / `prebuild` (`scripts/patch-engine.mjs`).

## Critical constraints

- The production **engine** (`public/_astro/engine.js`) is bound to **exact DOM ids/classes**.
- Page HTML is assembled in `src/lib/assemble-home-ui.ts` into `#ui` without extra wrappers.
- Edit copy in `src/fragments/*.html`, not by inventing new markup around engine ids.
- Do not remove `#home-goal` stub nodes; the engine still queries them.

## Documentation

- Project notes: [NOTES.md](./NOTES.md)
- Domain glossary: [CONTEXT.md](./CONTEXT.md)
- Framework: https://nextjs.org/docs
