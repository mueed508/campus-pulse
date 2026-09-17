import { SportKind } from "@/lib/sportKinds";

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

export interface EventRow {
  id: string;
  title: string;
  type: EventType;
  location: string;
  posted_by: string;
  start_time: string;
  expires_at: string | null;
  description: string | null;
  sport_kind: SportKind | null;
  image_url: string | null;
  created_at: string;
}

export function rowToEvent(row: EventRow): CampusEvent {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    location: row.location,
    postedBy: row.posted_by,
    startTime: row.start_time,
    expiresAt: row.expires_at,
    description: row.description,
    sportKind: row.sport_kind,
    imageUrl: row.image_url,
    createdAt: row.created_at,
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

export function eventToRow(input: NewEventInput) {
  return {
    title: input.title,
    type: input.type,
    location: input.location,
    posted_by: input.postedBy,
    start_time: input.startTime,
    expires_at: input.expiresAt,
    description: input.description,
    sport_kind: input.sportKind,
    image_url: input.imageUrl,
  };
}
