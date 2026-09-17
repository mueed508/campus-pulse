# Campus Pulse

A live events feed for COMSATS Lahore. One tab shows what's happening **right now** — pickup games short a player, a society talk that just started — with a live countdown. The other shows what's **coming up**, grouped by day. A simple passcode-gated form lets society reps and the sports department post a new event in under two minutes, and it appears on everyone's feed instantly, no refresh, via Supabase Realtime.

This was built as a live demo for an AI/design talk, and is now open for students to fork and extend as a learning project.

**Live app:** https://campus-pulse-flax-zeta.vercel.app

## What's in here

- **`/`** — a marketing landing page explaining what the app is
- **`/dashboard`** — the public feed (Happening Now / Upcoming tabs)
- **`/post`** — the passcode-gated admin form for posting a new event

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) — theme tokens defined as CSS variables in `src/app/globals.css`
- [Framer Motion](https://www.framer.com/motion/) for animation
- [Supabase](https://supabase.com) — Postgres table + Row Level Security, Realtime subscriptions, and Storage for uploaded event photos

No auth system, no ORM, no state management library — it's intentionally small enough to read end to end in an afternoon.

## Features worth knowing about

- **Real-time feed** — posting an event triggers a Postgres `INSERT`, which Supabase Realtime pushes to every open browser tab subscribed to the `events` table. See `src/hooks/useLiveEvents.ts`.
- **Sport graphics** — pick "Sports" + a specific sport when posting, and the card gets an auto-generated gradient banner with a matching hand-drawn icon (`src/lib/sportKinds.ts`, `src/components/EventCoverBanner.tsx`). No image assets, no licensing to worry about.
- **Custom photo upload with a lightbox** — organizers can upload their own graphic instead (Supabase Storage). Since uploaded graphics are usually dense Instagram/LinkedIn-style posts, the banner letterboxes the full image rather than cropping it, and clicking it opens a full-screen viewer (`src/components/ImageLightbox.tsx`).
- **A real brand motif, not just brand colors** — the purple-outer/blue-inner rings from the COMSATS logo are drawn as a reusable component (`src/components/BrandRings.tsx`) and reused as a background texture across the header, empty states, and cards, instead of leaning on generic icon-in-a-circle placeholders.
- **Graceful no-backend fallback** — without Supabase env vars configured, the feed renders local mock data (`src/lib/mockEvents.ts`) instead of crashing, so the UI is still browsable.

## Getting started

### 1. Clone and install

```bash
git clone <https://github.com/mueed508/campus-pulse>
cd campus-pulse
npm install
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run [`supabase/schema.sql`](supabase/schema.sql). This creates the `events` table, its RLS policies, enables Realtime on it, and sets up the `event-images` storage bucket.
3. Grab your project URL and anon key from **Project Settings → API**.

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_ADMIN_PASSCODE=pick-a-passcode
```

### 4. Run it

```bash
npm run dev
```

Open `http://localhost:3000` for the landing page, `/dashboard` for the feed, `/post` to try posting an event.

## A note on the passcode gate

The `/post` form is gated by a shared passcode checked **client-side only**, against a public env var. It's intentionally simple for a demo where speed matters more than security — anyone with the Supabase anon key could technically post directly. If you extend this into something real, swap it for a Supabase Edge Function that checks the passcode (or real per-user auth) before the insert.

## Ideas for extending this

This repo is meant to be forked and messed with. Some directions that would make good first features:

- **RSVPs** — let students mark "I'm going" and show a headcount on the card
- **Filters** — filter the feed by type (sports/society), location, or a search box
- **Recurring events** — a weekly society meeting shouldn't need reposting every week
- **Calendar export** — an "Add to calendar" button that generates an `.ics` file
- **Per-society accounts** — real auth instead of one shared passcode
- **Comments or reactions** — a lightweight way to react to a posted event
- **Notifications** — a browser push or email alert when a specific society posts
- **An admin view** — a way to edit or take down a posted event
- **Dark mode** — the color system is already CSS variables in `globals.css`, so this is mostly a `prefers-color-scheme` media query away

## Deployment

The live version is deployed on [Vercel](https://vercel.com). To deploy your own fork:

```bash
npm i -g vercel
vercel link
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add NEXT_PUBLIC_ADMIN_PASSCODE production
vercel --prod
```

## License

MIT — see [LICENSE](LICENSE). Fork it, break it, ship something better.
