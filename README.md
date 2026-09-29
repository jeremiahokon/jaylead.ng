# Jaylead AgriEstate: jayleadng-weld.vercel.app

Marketing site for Jaylead AgriEstate Limited: titled oil-palm farmland at Palm Grove Estate, Osun State. Next.js 16 (App Router, Cache Components), Tailwind v4, Sanity CMS with the Studio at `/studio`, and GSAP for motion.

## Commands

| Command             | What it does                                                                         |
| ------------------- | ------------------------------------------------------------------------------------ |
| `pnpm dev`          | Local dev server                                                                     |
| `pnpm build`        | Production build (every public page is static)                                       |
| `pnpm test`         | Unit tests: naira formatter, embed parser, WhatsApp links, Option A maths            |
| `pnpm check`        | Prettier and ESLint                                                                  |
| `pnpm check:copy`   | Banned phrases and em dashes in the rendered pages and seed copy (run after `build`) |
| `pnpm verify`       | test, build and copy check in one go                                                 |
| `pnpm og`           | Re-renders the share cards from `scripts/opengraph-image.html`                       |
| `pnpm seed`         | Loads the starter content into Sanity (needs `.env.local`)                           |
| `pnpm webhook:test` | Sends `/api/revalidate` a signed test request (`pnpm webhook:test plot https://…`)   |

## Where things live

- **Content**: `src/lib/content.ts` is the only door pages use. It reads Sanity when `.env.local` is set and the typed seed in `src/data/seed/` otherwise.
- **Videos**: paste an Instagram embed code or link into `src/data/instagram.ts`, or add it in the Studio under Videos. Both sources are merged.
- **Sanity**: schemas in `src/sanity/schemas/`, the desk in `src/sanity/structure.ts`, config in `sanity.config.ts`, and the webhook in `src/app/api/revalidate/route.ts`. See **`docs/sanity/`** for setup, env vars, the Studio guide and SEO.
- **Design**: `docs/design-direction.md` (concept, tokens, motion, deviations). Tokens are in `src/app/globals.css`; motion is in `src/components/motion/`.
- **Handover**: `docs/handover.md` covers what's done, what needs the client, and the launch checklist.
