"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BrandRings } from "./BrandRings";
import { EventCard } from "./EventCard";
import { FeedTabs } from "./FeedTabs";
import {
  ArrowRightIcon,
  BoltIcon,
  ClockIcon,
  SocietyIcon,
  SportsIcon,
  UsersIcon,
} from "./icons";
import { CampusEvent } from "@/lib/events/types";

// Fixed, deterministic timestamps — this card is a static example, not live
// data. Using new Date() here would freeze at build time (this page is
// statically prerendered) and mismatch the client on hydration.
const SAMPLE_NOW = new Date("2026-01-15T14:30:00");
const SAMPLE_EVENT: CampusEvent = {
  id: "sample",
  title: "5-a-side Football — need 2 players",
  type: "sports",
  location: "Sports Complex, Ground 2",
  postedBy: "Sports Dept",
  startTime: new Date("2026-01-15T14:15:00").toISOString(),
  expiresAt: new Date("2026-01-15T15:10:00").toISOString(),
  description: "Casual match, all departments welcome.",
  sportKind: "football",
  imageUrl: null,
  createdAt: new Date("2026-01-15T14:15:00").toISOString(),
};

const revealProps = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
};

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display max-w-md text-3xl font-bold tracking-tight text-ink sm:text-4xl">
      {children}
    </h2>
  );
}

export function LandingPage() {
  return (
    <div className="flex w-full min-h-screen flex-col overflow-x-clip bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary px-5 pb-20 pt-6 text-inverse sm:px-8 sm:pb-28">
        <BrandRings
          tone="mono"
          className="pointer-events-none absolute -right-24 -top-32 h-[28rem] w-[28rem] text-white/[0.07] sm:-right-16"
        />
        <BrandRings
          tone="mono"
          className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 text-white/[0.05]"
        />

        <nav className="relative mx-auto flex max-w-5xl items-center justify-between py-3">
          <span className="font-display text-lg font-bold tracking-tight">Campus Pulse</span>
          <Link
            href="/dashboard"
            className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/25 transition hover:bg-white/20"
          >
            Open dashboard
          </Link>
        </nav>

        <div className="relative mx-auto mt-14 grid max-w-5xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <motion.div {...revealProps}>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              Know what&apos;s happening on campus — right now.
            </h1>
            <p className="mt-5 max-w-lg text-base text-white/75 sm:text-lg">
              Campus Pulse is a live feed of what&apos;s actually going on at COMSATS
              Lahore — a pickup game short two players, a society talk starting in
              twenty minutes, the stuff you&apos;d normally hear about a day too late.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-primary transition hover:bg-white/90"
              >
                See what&apos;s happening
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href="/post"
                className="text-sm font-semibold text-white/80 underline decoration-white/30 underline-offset-4 transition hover:text-white"
              >
                Society or sports dept? Post an event
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="mx-auto w-full max-w-sm"
          >
            <EventCard event={SAMPLE_EVENT} now={SAMPLE_NOW} variant="now" />
            <p className="mt-3 text-center text-xs text-white/50">
              An example card from the live feed
            </p>
          </motion.div>
        </div>
      </section>

      {/* What it is */}
      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div {...revealProps}>
            <SectionHeading>One feed. Everything happening.</SectionHeading>
            <p className="mt-4 max-w-md text-ink-soft">
              No separate group chats, no forgotten society Instagram stories. Every
              live and upcoming event on campus lives in one place, split into two
              simple tabs:
            </p>
            <ul className="mt-6 space-y-4">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                  <BoltIcon className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-semibold text-ink">Happening Now</p>
                  <p className="text-sm text-ink-soft">
                    Live with a running countdown — join before it ends.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ClockIcon className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-semibold text-ink">Upcoming</p>
                  <p className="text-sm text-ink-soft">
                    Scheduled events, grouped by day, so you can plan ahead.
                  </p>
                </div>
              </li>
            </ul>
          </motion.div>

          <motion.div {...revealProps} className="mx-auto w-full max-w-sm">
            <FeedTabs active="now" onChange={() => {}} nowCount={3} upcomingCount={7} />
          </motion.div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="bg-paper px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <motion.div {...revealProps}>
            <SectionHeading>Built for both sides of campus life.</SectionHeading>
          </motion.div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <motion.div
              {...revealProps}
              className="rounded-2xl bg-background p-8 ring-1 ring-divider"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                <UsersIcon className="h-5 w-5" />
              </span>
              <h3 className="font-display mt-5 text-xl font-semibold text-ink">
                Students — show up when it counts
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
                <li>A 5-a-side match that needs two more players</li>
                <li>A talk starting in fifteen minutes you didn&apos;t know about</li>
                <li>What&apos;s on this weekend, grouped by day</li>
              </ul>
            </motion.div>

            <motion.div
              {...revealProps}
              className="rounded-2xl bg-background p-8 ring-1 ring-divider"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <SportsIcon className="h-5 w-5" />
              </span>
              <h3 className="font-display mt-5 text-xl font-semibold text-ink">
                Societies &amp; sports dept — reach everyone in two minutes
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
                <li>Post from your phone, gated by a shared passcode</li>
                <li>Pick your sport for an auto-generated card graphic — or upload your own</li>
                <li>It&apos;s on the feed instantly, no refresh needed for anyone watching</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <motion.div {...revealProps}>
            <SectionHeading>How it works</SectionHeading>
          </motion.div>

          <div className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-6">
            {[
              {
                step: "1",
                title: "Post it",
                body: "A society rep or the sports dept signs in and fills a short form — under two minutes.",
                Icon: SocietyIcon,
              },
              {
                step: "2",
                title: "It goes live in seconds",
                body: "The feed refreshes automatically, so it shows up for everyone without them lifting a finger.",
                Icon: BoltIcon,
              },
              {
                step: "3",
                title: "Students show up",
                body: "It appears under Happening Now with a live countdown, or Upcoming grouped by day.",
                Icon: UsersIcon,
              },
            ].map(({ step, title, body, Icon }, i) => (
              <motion.div
                key={step}
                {...revealProps}
                transition={{ ...revealProps.transition, delay: i * 0.08 }}
                className="relative"
              >
                <div className="flex items-center gap-3">
                  <span className="font-display flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-inverse">
                    {step}
                  </span>
                  <Icon className="h-5 w-5 text-secondary" />
                </div>
                <h3 className="font-display mt-4 text-lg font-semibold text-ink">{title}</h3>
                <p className="mt-1.5 text-sm text-ink-soft">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-primary px-5 py-20 text-center text-inverse sm:px-8">
        <BrandRings
          tone="mono"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 text-white/[0.06]"
        />
        <motion.div {...revealProps} className="relative mx-auto max-w-xl">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            See what&apos;s happening at COMSATS Lahore right now.
          </h2>
          <div className="mt-8 flex flex-col items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-primary transition hover:bg-white/90"
            >
              Open the dashboard
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <p className="text-sm text-white/60">
              No sign-up, it&apos;s public ·{" "}
              <Link href="/post" className="underline decoration-white/30 underline-offset-4 hover:text-white">
                Post an event
              </Link>
            </p>
          </div>
        </motion.div>
      </section>

      <footer className="px-5 py-6 text-center text-xs text-ink-soft sm:px-8">
        Campus Pulse · built for COMSATS Lahore
      </footer>
    </div>
  );
}
