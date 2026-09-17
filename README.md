# Campus Pulse

A live events feed for COMSATS Lahore. One tab shows what's happening **right now** — pickup games short a player, a society talk that just started — with a live countdown. The other shows what's **coming up**, grouped by day. Society reps and the sports department sign in to post a new event in under two minutes, and it shows up on everyone's feed within seconds.

This was built as a live demo for an AI/design talk, and is now open for students to fork and extend as a learning project.

**Live app:** https://campus-pulse-flax-zeta.vercel.app

## What's in here

- **`/`** — a marketing landing page explaining what the app is
- **`/dashboard`** — the public feed (Happening Now / Upcoming tabs)
- **`/post`** — sign in to post a new event

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) — theme tokens defined as CSS variables in `src/app/globals.css`
- [Framer Motion](https://www.framer.com/motion/) for animation
- [Clerk](https://clerk.com) — sign-up/sign-in (email OTP + password), session management
- [Neon](https://neon.tech) Postgres + [Drizzle ORM](https://orm.drizzle.team) — the `events` table
- [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) — storage for uploaded event photos

Reads and writes go through two Next.js API routes (`src/app/api/events`, `src/app/api/upload`) that check the caller's Clerk session server-side — there's no direct database access from the browser, so there's no RLS/policy layer to maintain.

## Features worth knowing about

- **Auto-refreshing feed** — the dashboard polls `GET /api/events` every 12 seconds, so a newly posted event shows up for everyone without a manual refresh. See `src/hooks/useLiveEvents.ts`.
- **Sport graphics** — pick "Sports" + a specific sport when posting, and the card gets an auto-generated gradient banner with a matching hand-drawn icon (`src/lib/sportKinds.ts`, `src/components/EventCoverBanner.tsx`). No image assets, no licensing to worry about.
- **Custom photo upload with a lightbox** — organizers can upload their own graphic instead (stored in Vercel Blob via `src/app/api/upload`). Since uploaded graphics are usually dense Instagram/LinkedIn-style posts, the banner letterboxes the full image rather than cropping it, and clicking it opens a full-screen viewer (`src/components/ImageLightbox.tsx`).
- **A real brand motif, not just brand colors** — the purple-outer/blue-inner rings from the COMSATS logo are drawn as a reusable component (`src/components/BrandRings.tsx`) and reused as a background texture across the header, empty states, and cards, instead of leaning on generic icon-in-a-circle placeholders.

## Getting started

### 1. Clone and install

```bash
git clone <https://github.com/mueed508/campus-pulse>
cd campus-pulse
npm install
```

### 2. Set up Clerk (auth)

1. Create a free application at [clerk.com](https://clerk.com), with **Email** as a sign-in method.
2. Grab the publishable key and secret key from the Clerk dashboard's API Keys page.

### 3. Set up Neon (database)

1. Create a free Postgres database at [neon.tech](https://neon.tech) (or via the Vercel Marketplace if you're deploying there).
2. Copy the connection string.
3. Push the schema:

```bash
npx drizzle-kit push
```

This creates the `events` table from `src/lib/db/schema.ts` — there's no separate SQL file to run by hand.

### 4. Set up Vercel Blob (image storage)

1. In your Vercel project, add a **Blob** store (Storage tab → Create Database → Blob).
2. Copy the `BLOB_READ_WRITE_TOKEN` it gives you.

### 5. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
DATABASE_URL=your-neon-connection-string
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
```

### 6. Run it

```bash
npm run dev
```

Open `http://localhost:3000` for the landing page, `/dashboard` for the feed, `/post` to try posting an event.

## A note on the auth model

`/post` is gated by Clerk's `<Show when="signed-in">`/`<Show when="signed-out">` components — signed-out visitors see Clerk's `<SignIn>` UI (email + OTP code, then password for subsequent logins), themed to match the app via `src/lib/clerkTheme.ts`. The actual write endpoints (`POST /api/events`, `POST /api/upload`) independently check the Clerk session server-side via `auth()`, so posting can't be done by calling the API directly without a valid session — unlike the very first version of this app, where a client-side-only passcode was the only thing standing between an anon API key and the database.

Signups aren't currently restricted to a specific email domain (e.g. a university address) — Clerk supports domain allowlisting in its dashboard if you want to add that back once you have institutional buy-in for onboarding.

## Ideas for extending this

This repo is meant to be forked and messed with. Some directions that would make good first features:

- **RSVPs** — let students mark "I'm going" and show a headcount on the card
- **Filters** — filter the feed by type (sports/society), location, or a search box
- **Recurring events** — a weekly society meeting shouldn't need reposting every week
- **Calendar export** — an "Add to calendar" button that generates an `.ics` file
- **Per-society roles** — distinguish sports dept vs. society accounts, or require an admin to approve new signups
- **Comments or reactions** — a lightweight way to react to a posted event
- **Notifications** — a browser push or email alert when a specific society posts
- **An admin view** — a way to edit or take down a posted event
- **Dark mode** — the color system is already CSS variables in `globals.css`, so this is mostly a `prefers-color-scheme` media query away

## Deployment

The live version is deployed on [Vercel](https://vercel.com). To deploy your own fork:

```bash
npm i -g vercel
vercel link
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
vercel env add CLERK_SECRET_KEY production
vercel env add DATABASE_URL production
vercel env add BLOB_READ_WRITE_TOKEN production
vercel --prod
```

## License

MIT — see [LICENSE](LICENSE). Fork it, break it, ship something better.
