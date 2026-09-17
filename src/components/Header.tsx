import Link from "next/link";
import { LiveDot } from "./LiveDot";
import { BrandRings } from "./BrandRings";

export function Header({ liveCount }: { liveCount: number }) {
  return (
    <header className="relative overflow-hidden bg-primary px-5 pb-7 pt-9 text-inverse sm:px-8">
      <BrandRings
        tone="mono"
        className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 text-white/[0.08] sm:-right-10 sm:-top-28 sm:h-80 sm:w-80"
      />

      <div className="relative mx-auto flex max-w-3xl items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display text-[1.75rem] font-bold leading-none tracking-tight sm:text-3xl">
            Campus Pulse
          </p>
          <p className="mt-2 text-sm text-white/70">COMSATS Lahore, live &amp; upcoming</p>
        </div>
        <Link
          href="/post"
          className="shrink-0 whitespace-nowrap rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-inverse ring-1 ring-white/25 transition hover:bg-white/20"
        >
          Post event
        </Link>
      </div>
      {liveCount > 0 && (
        <div className="relative mx-auto mt-6 flex max-w-3xl items-center gap-2 text-sm font-medium text-white/90">
          <LiveDot />
          {liveCount} {liveCount === 1 ? "thing" : "things"} happening right now
        </div>
      )}
    </header>
  );
}
