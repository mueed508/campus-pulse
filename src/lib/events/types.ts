import { SportKind } from "@/lib/sportKinds";
import { EventRow } from "@/lib/db/schema";

export type EventType = "sports" | "society";

export interface CampusEvent {
  id: string;
  title: string;
  type: EventType;
  location: string;
  postedBy: string;
  startTime: string;
  expiresAt: string | null;
  description: string | null;
  sportKind: SportKind | null;
  imageUrl: string | null;
  createdAt: string;
}

export function rowToEvent(row: EventRow): CampusEvent {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    location: row.location,
    postedBy: row.postedBy,
    startTime: row.startTime.toISOString(),
    expiresAt: row.expiresAt ? row.expiresAt.toISOString() : null,
    description: row.description,
    sportKind: row.sportKind,
    imageUrl: row.imageUrl,
    createdAt: row.createdAt.toISOString(),
  };
}

export interface NewEventInput {
  title: string;
  type: EventType;
  location: string;
  postedBy: string;
  startTime: string;
  expiresAt: string | null;
  description: string | null;
  sportKind: SportKind | null;
  imageUrl: string | null;
}
