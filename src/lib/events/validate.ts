import { NewEventInput } from "@/lib/events/types";
import { SPORT_KINDS } from "@/lib/sportKinds";
import { NewEventRow } from "@/lib/db/schema";

const EVENT_TYPES = ["sports", "society"] as const;

export function parseNewEventInput(body: unknown): NewEventInput | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;

  if (typeof b.title !== "string" || b.title.trim().length === 0) return null;
  if (typeof b.type !== "string" || !EVENT_TYPES.includes(b.type as (typeof EVENT_TYPES)[number])) return null;
  if (typeof b.location !== "string" || b.location.trim().length === 0) return null;
  if (typeof b.postedBy !== "string" || b.postedBy.trim().length === 0) return null;
  if (typeof b.startTime !== "string" || Number.isNaN(Date.parse(b.startTime))) return null;
  if (b.expiresAt !== null && (typeof b.expiresAt !== "string" || Number.isNaN(Date.parse(b.expiresAt))))
    return null;
  if (b.description !== null && typeof b.description !== "string") return null;
  if (b.sportKind !== null && !SPORT_KINDS.includes(b.sportKind as (typeof SPORT_KINDS)[number])) return null;
  if (b.imageUrl !== null && typeof b.imageUrl !== "string") return null;

  return {
    title: b.title.trim(),
    type: b.type as NewEventInput["type"],
    location: b.location.trim(),
    postedBy: b.postedBy.trim(),
    startTime: b.startTime,
    expiresAt: (b.expiresAt as string | null) ?? null,
    description: (b.description as string | null) ?? null,
    sportKind: (b.sportKind as NewEventInput["sportKind"]) ?? null,
    imageUrl: (b.imageUrl as string | null) ?? null,
  };
}

type EventPatch = Partial<
  Pick<
    NewEventRow,
    "title" | "type" | "location" | "postedBy" | "startTime" | "expiresAt" | "description" | "sportKind" | "imageUrl"
  >
>;

export function parseEventPatch(body: unknown): EventPatch | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;
  const patch: EventPatch = {};

  if ("title" in b) {
    if (typeof b.title !== "string" || b.title.trim().length === 0) return null;
    patch.title = b.title.trim();
  }
  if ("type" in b) {
    if (typeof b.type !== "string" || !EVENT_TYPES.includes(b.type as (typeof EVENT_TYPES)[number])) return null;
    patch.type = b.type as NewEventInput["type"];
  }
  if ("location" in b) {
    if (typeof b.location !== "string" || b.location.trim().length === 0) return null;
    patch.location = b.location.trim();
  }
  if ("postedBy" in b) {
    if (typeof b.postedBy !== "string" || b.postedBy.trim().length === 0) return null;
    patch.postedBy = b.postedBy.trim();
  }
  if ("startTime" in b) {
    if (typeof b.startTime !== "string" || Number.isNaN(Date.parse(b.startTime))) return null;
    patch.startTime = new Date(b.startTime);
  }
  if ("expiresAt" in b) {
    if (b.expiresAt !== null && (typeof b.expiresAt !== "string" || Number.isNaN(Date.parse(b.expiresAt))))
      return null;
    patch.expiresAt = b.expiresAt ? new Date(b.expiresAt as string) : null;
  }
  if ("description" in b) {
    if (b.description !== null && typeof b.description !== "string") return null;
    patch.description = (b.description as string | null) ?? null;
  }
  if ("sportKind" in b) {
    if (b.sportKind !== null && !SPORT_KINDS.includes(b.sportKind as (typeof SPORT_KINDS)[number])) return null;
    patch.sportKind = (b.sportKind as NewEventInput["sportKind"]) ?? null;
  }
  if ("imageUrl" in b) {
    if (b.imageUrl !== null && typeof b.imageUrl !== "string") return null;
    patch.imageUrl = (b.imageUrl as string | null) ?? null;
  }

  if (Object.keys(patch).length === 0) return null;
  return patch;
}
