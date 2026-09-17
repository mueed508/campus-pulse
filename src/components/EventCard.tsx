"use client";

import { motion } from "framer-motion";
import { CampusEvent } from "@/lib/events/types";
import { formatLiveStatus, formatTime, formatUpcomingStatus } from "@/lib/time";
import { ClockIcon, PinIcon, SocietyIcon, SportsIcon, UsersIcon } from "./icons";
import { LiveDot } from "./LiveDot";
import { EventCoverBanner } from "./EventCoverBanner";
import { BrandRings } from "./BrandRings";

interface EventCardProps {
  event: CampusEvent;
  now: Date;
  variant: "now" | "upcoming";
  isNew?: boolean;
}

function TypeBadge({ type }: { type: CampusEvent["type"] }) {
  const isSports = type === "sports";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        isSports
          ? "bg-primary/10 text-primary-dark"
          : "bg-secondary/10 text-secondary-dark"
      }`}
    >
      {isSports ? <SportsIcon className="h-3.5 w-3.5" /> : <SocietyIcon className="h-3.5 w-3.5" />}
      {isSports ? "Sports" : "Society"}
    </span>
  );
}

export function EventCard({ event, now, variant, isNew }: EventCardProps) {
  const start = new Date(event.startTime);
  const hasBanner = Boolean(event.imageUrl) || (event.type === "sports" && Boolean(event.sportKind));

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative overflow-hidden rounded-2xl bg-paper shadow-sm ring-1 ring-divider transition-shadow hover:shadow-md ${
        isNew ? "ring-2 ring-secondary" : ""
      }`}
    >
      {hasBanner && <EventCoverBanner event={event} />}

      {!hasBanner && (
        <BrandRings
          tone={variant === "now" ? "brand" : "mono"}
          className={`pointer-events-none absolute -bottom-10 -right-10 h-36 w-36 ${
            variant === "now" ? "opacity-[0.12]" : "text-primary/[0.06]"
          }`}
        />
      )}

      <div className="relative p-5">
        <div className="flex items-start justify-between gap-3">
          <TypeBadge type={event.type} />
          {variant === "now" ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary-dark">
              <LiveDot />
              {formatLiveStatus(event, now)}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-soft">
              <ClockIcon className="h-3.5 w-3.5" />
              {formatUpcomingStatus(event, now)}
            </span>
          )}
        </div>

        <h3 className="font-display mt-3 text-lg font-semibold leading-snug text-ink">
          {event.title}
        </h3>

        {event.description && (
          <p className="mt-1.5 line-clamp-2 text-sm text-ink-soft">{event.description}</p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ink-soft">
          <span className="inline-flex items-center gap-1.5">
            <PinIcon className="h-4 w-4 shrink-0" />
            {event.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ClockIcon className="h-4 w-4 shrink-0" />
            {formatTime(start)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <UsersIcon className="h-4 w-4 shrink-0" />
            {event.postedBy}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
