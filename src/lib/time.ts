import { CampusEvent } from "./supabase/types";

export function isLive(event: CampusEvent, now: Date): boolean {
  const start = new Date(event.startTime).getTime();
  const expires = event.expiresAt ? new Date(event.expiresAt).getTime() : null;
  const nowMs = now.getTime();
  if (start > nowMs) return false;
  if (expires !== null && expires <= nowMs) return false;
  return true;
}

export function isUpcoming(event: CampusEvent, now: Date): boolean {
  return new Date(event.startTime).getTime() > now.getTime();
}

export function isExpired(event: CampusEvent, now: Date): boolean {
  if (!event.expiresAt) return false;
  return new Date(event.expiresAt).getTime() <= now.getTime();
}

export function splitEvents(events: CampusEvent[], now: Date) {
  const nowEvents: CampusEvent[] = [];
  const upcomingEvents: CampusEvent[] = [];

  for (const event of events) {
    if (isLive(event, now)) {
      nowEvents.push(event);
    } else if (isUpcoming(event, now)) {
      upcomingEvents.push(event);
    }
  }

  nowEvents.sort((a, b) => {
    const aExp = a.expiresAt ? new Date(a.expiresAt).getTime() : Infinity;
    const bExp = b.expiresAt ? new Date(b.expiresAt).getTime() : Infinity;
    return aExp - bExp;
  });
  upcomingEvents.sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  return { nowEvents, upcomingEvents };
}

function pluralize(value: number, unit: string) {
  return `${value} ${unit}${value === 1 ? "" : "s"}`;
}

export function formatCountdown(target: Date, now: Date): string {
  const diffMs = target.getTime() - now.getTime();
  const diffSec = Math.round(Math.abs(diffMs) / 1000);

  if (diffSec < 60) return diffMs >= 0 ? "less than a minute" : "just now";

  const minutes = Math.floor(diffSec / 60) % 60;
  const hours = Math.floor(diffSec / 3600);

  if (hours >= 1) {
    return minutes > 0
      ? `${pluralize(hours, "hr")} ${pluralize(minutes, "min")}`
      : pluralize(hours, "hr");
  }
  return pluralize(minutes, "min");
}

export function formatLiveStatus(event: CampusEvent, now: Date): string {
  if (event.expiresAt) {
    return `Ends in ${formatCountdown(new Date(event.expiresAt), now)}`;
  }
  return "Live now";
}

export function formatUpcomingStatus(event: CampusEvent, now: Date): string {
  return `Starts in ${formatCountdown(new Date(event.startTime), now)}`;
}

export function formatDayLabel(date: Date, now: Date): string {
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dayDiff = Math.round(
    (startOfDay(date).getTime() - startOfDay(now).getTime()) / 86400000
  );

  if (dayDiff === 0) return "Today";
  if (dayDiff === 1) return "Tomorrow";

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function toDatetimeLocalValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

export function groupByDay(events: CampusEvent[], now: Date) {
  const groups = new Map<string, { label: string; events: CampusEvent[] }>();

  for (const event of events) {
    const date = new Date(event.startTime);
    const key = date.toDateString();
    if (!groups.has(key)) {
      groups.set(key, { label: formatDayLabel(date, now), events: [] });
    }
    groups.get(key)!.events.push(event);
  }

  return Array.from(groups.values());
}
