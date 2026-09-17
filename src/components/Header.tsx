import Image from "next/image";
import Link from "next/link";
import { Show } from "@clerk/nextjs";
import { LiveDot } from "./LiveDot";
import { BrandRings } from "./BrandRings";
import { UserMenu } from "./UserMenu";

export function Header({ liveCount }: { liveCount: number }) {
  return (
    <header className="relative overflow-hidden bg-primary px-5 pb-7 pt-9 text-inverse sm:px-8">
      <BrandRings
        tone="mono"
        className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 text-white/[0.08] sm:-right-10 sm:-top-28 sm:h-80 sm:w-80"
      />

      <div className="relative mx-auto flex max-w-3xl items-center justify-between gap-3">
        <div className="min-w-0">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo-mark-header.png" alt="" width={36} height={36} className="h-8 w-8 shrink-0 sm:h-9 sm:w-9" />
            <p className="font-display text-[1.75rem] font-bold leading-none tracking-tight sm:text-3xl">
              Campus Pulse
            </p>
          </Link>
          <p className="mt-2 text-sm text-white/70">COMSATS Lahore, live &amp; upcoming</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/post"
            className="whitespace-nowrap rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-inverse ring-1 ring-white/25 transition hover:bg-white/20"
          >
            Post event
          </Link>
          <Show when="signed-in">
            <UserMenu />
          </Show>
        </div>
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
