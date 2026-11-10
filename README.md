# VELORA

**See it. Save it. Have it in ten.**

A super-app that fuses four business models into one shoppable loop: a social feed (Instagram), visual discovery (Pinterest), ten-minute quick commerce (Blinkit) and a full marketplace (Amazon). Every post, pin and reel is a product tag; every tap resolves either to the dark store two kilometres away or to a seller's warehouse.

> **Status: Phase 1 complete.** Architecture, database schema, design system and the animated landing page are built and verified. Social, discovery, marketplace and quick-commerce modules are next — see the roadmap below.

---

## Stack

| Layer | Choice |
| --- | --- |
| Web | Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · GSAP ScrollTrigger · Lenis · React Three Fiber |
| State | Zustand · TanStack Query (phase 2+) |
| API | Express 4 · Zod-validated env · typed envelopes · request correlation ids |
| Data | PostgreSQL 16 + Prisma 5 · pgvector (1536-d) · pg_trgm · Redis (phase 5) |
| Fonts | Self-hosted variable Space Grotesk + Inter via Fontsource |
| Monorepo | pnpm workspaces |

---

## Quick start

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
pnpm dev
```

- Web → http://localhost:3000 (fully static, **no database required**)
- API → http://localhost:4000/v1/meta (`/health`, `/health/ready`)

### With a database

```bash
docker run -d --name velora-pg -p 5432:5432 \
  -e POSTGRES_USER=velora -e POSTGRES_PASSWORD=velora -e POSTGRES_DB=velora \
  pgvector/pgvector:pg16

pnpm db:push     # create tables from schema.prisma
pnpm db:seed     # 520 products, 32 posts, 12 orders, full demo graph
pnpm dev
```

`/health/ready` returns `503 degraded` until Postgres answers — that is a readiness probe doing its job, not a broken app.

---

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | web + api in parallel |
| `pnpm dev:web` / `pnpm dev:api` | one target |
| `pnpm build` | production build (web) + typecheck (api) |
| `pnpm verify` | smoke-test a running web + api (21 checks) |
| `pnpm typecheck` | `tsc --noEmit` across every package |
| `pnpm format` | Prettier |
| `pnpm db:generate` | regenerate the Prisma client |
| `pnpm db:validate` / `db:push` / `db:migrate` | schema lifecycle |
| `pnpm db:seed` / `db:studio` | deterministic seed · Prisma Studio |

---

## Deploying

The repo root is a pnpm workspace, **not an app**. A Vercel project pointed at the repo root — or at `apps/api` — has no static output and no Next.js runtime, so *every* request, including `/_next/static/*`, fails with `500: FUNCTION_INVOCATION_FAILED` (or `404: NOT_FOUND`). The project has to be pointed at the web app.

**Vercel**

1. Import `bajajaarna4-bit/astheticmemory`.
2. **Settings → Build and Deployment → Root Directory → `apps/web` → Save.** This is the only setting that matters; without it the deployment cannot serve the site.
3. Framework preset **Next.js** — pinned by `apps/web/vercel.json`, so it is detected correctly either way.
4. Leave install/build/output on their defaults: Vercel installs at the workspace root (`pnpm install`) and reads `apps/web/.next`.
5. Optional environment variable: `NEXT_PUBLIC_SITE_URL=https://your-domain` (canonical URL and OG tags fall back to `https://velora.app`).
6. Redeploy with **Use existing Build Cache** unchecked, so the new root directory and lockfile are picked up.

No database is needed: the landing page is fully prerendered, and the API is not part of this deployment.

`apps/api` is a long-lived Express process — it needs a container host (Fly.io, Railway, Render, a VPS), not a static or Next.js deployment.

The pnpm version is pinned via `packageManager` in the root `package.json`, and dependency build scripts are allowlisted with `allowBuilds` in `pnpm-workspace.yaml`. Both are load-bearing: the pnpm 9/10 key `onlyBuiltDependencies` is ignored from pnpm 11 onwards, and a fresh install then aborts with `ERR_PNPM_IGNORED_BUILDS`.

---

## Structure

```
apps/
  web/    Next.js app — landing page, chrome, design-system consumers
  api/    Express service — /health, /v1/meta (contract discovery)
packages/
  db/             Prisma schema (60 models), seed, client singleton
  design-system/  tokens.cjs · tailwind preset · theme.css
docs/
  PHASE-1.md      architecture, ERD, design system, API surface
```

## The landing page

Server-rendered shell, client islands only where motion needs the browser:

- **Intro** — GSAP curtain with a letter-stagger wordmark and counter (once per session).
- **Hero** — headline split-reveal, glass product cards on spring parallax, and a lazy-mounted R3F cluster that reacts to cursor and scroll.
- **Loop** — a pinned four-beat story (see → tap → save → get) driven by CSS sticky + Framer `useScroll`, with an SVG delivery route.
- **Discovery / Quick / Marketplace / AI / Studio** — masonry pins, a live ETA ring, review summaries, an assistant transcript and a revenue chart.
- **Chrome** — floating pill dock, morphing cursor, glass header and a cart orb that expands into a drawer.

Every animation branches on `prefers-reduced-motion`, and only `transform`/`opacity` are animated on scroll.

## Design tokens

One source of truth (`packages/design-system/tokens.cjs`) feeds both Tailwind and app code. Semantic colours are CSS variables, so light mode is a single attribute flip on `<html>` rather than a `dark:` prefix on every element.

## Roadmap

1. **Foundation** ✅ — architecture, schema, tokens, landing page
2. **Social** — auth + RBAC, feed, stories, reels, profiles, DMs
3. **Discovery** — masonry, boards, visual search
4. **Marketplace** — PDP, cart, checkout, orders, returns
5. **Quick commerce** — nearest dark store, live stock, rider tracking
6. **Intelligence** — ranking, assistant, substitutions, studio, admin
7. **Polish** — performance, accessibility, animation pass, deployment

Full detail, ERD and design decisions: [docs/PHASE-1.md](docs/PHASE-1.md).
