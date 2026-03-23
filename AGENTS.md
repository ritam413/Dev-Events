# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

```bash
# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint
```

There is no test suite configured in this project.

## Environment Variables

Required in `.env` (or `.env.local`):

- `NEXT_PUBLIC_POSTHOG_KEY` — PostHog project API key
- `NEXT_PUBLIC_POSTHOG_HOST` — PostHog ingest host (e.g. `https://us.i.posthog.com`)
- `MONGODB_URI` — MongoDB Atlas connection string

## Architecture Overview

**DevEvents** is a Next.js 16 (App Router) application for discovering and booking developer events. It uses React 19, TypeScript, Tailwind CSS v4, and shadcn/ui (radix-maia style).

### Directory layout

```
app/                   # Next.js App Router root
  layout.tsx           # Root layout: fonts, PostHog wrapper, Navbar, LightRays background
  page.tsx             # Home page — renders featured events from constants
  components/          # App-level components
    EventCard.tsx      # Client component; fires PostHog event on click
    PostHogProvider.tsx  # Client wrapper that initialises posthog-js
    PostHogPageView.tsx  # Client component (in <Suspense>) that captures $pageview
    ui/LightRays.tsx   # WebGL canvas background effect (via ogl)
  database/            # Mongoose models
    event.model.ts     # Event schema — pre-save hooks auto-generate slug, normalize date/time
    booking.model.ts   # Booking schema — one booking per event+email (compound unique index)
  lib/
    mongodb.ts         # Singleton connectDB() with hot-reload safe global cache
    constants.ts       # Static event data (mirrors lib/constatnts.ts — see note below)
  posthog/page.tsx     # Example PostHog custom event page (purchase_completed)

lib/
  utils.ts             # cn() helper (clsx + tailwind-merge)
  constatnts.ts        # Duplicate of app/lib/constants.ts (typo in filename — kept for import compatibility)

instrumentation-client.ts  # Next.js instrumentation hook; initialises posthog-js on the client
next.config.ts             # Rewrites /ingest/* → PostHog; skipTrailingSlashRedirect: true
components.json            # shadcn/ui config: style=radix-maia, iconLibrary=hugeicons
```

### Data flow

- **Static event data** is currently served from `lib/constatnts.ts` (note typo). `app/lib/constants.ts` contains an identical copy. New pages should import from `@/lib/constatnts` to match `app/page.tsx`.
- **MongoDB** is accessed via `connectDB()` in `app/lib/mongodb.ts`. Import and call this function inside Server Components or Route Handlers before using Mongoose models.
- **Mongoose models** follow the `models.Model || model(...)` pattern to avoid re-registration during hot reloads.

### PostHog integration

PostHog is initialised in two places intentionally:
1. `instrumentation-client.ts` — runs once when the Next.js client bundle bootstraps.
2. `PostHogProvider.tsx` / `PostHogPageView.tsx` — React-layer integration for React context access and manual `$pageview` capture (automatic capture is disabled).

`next.config.ts` proxies PostHog requests through `/ingest/*` to avoid ad-blockers.

### Styling conventions

- Utility classes via Tailwind CSS v4 with `cn()` from `lib/utils.ts` for conditional merging.
- CSS variables for fonts: `--font-sans` (Figtree), `--font-schibsted-grotesk`, `--font-martian-mono`.
- Global styles in `app/globals.css`; shadcn base color is `neutral` with CSS variables enabled.
- Icons live in `app/public/icons/` and are referenced as `/icons/<name>.svg` (served from the `public` root at build time via Next.js static file serving from `app/public`).

### Path alias

`@/*` resolves to the project root (e.g. `@/lib/utils` → `lib/utils.ts`).
