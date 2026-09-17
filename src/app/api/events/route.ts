import { auth } from "@clerk/nextjs/server";
import { asc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { events } from "@/lib/db/schema";
import { NewEventInput, rowToEvent } from "@/lib/events/types";
import { SPORT_KINDS } from "@/lib/sportKinds";

const EVENT_TYPES = ["sports", "society"] as const;

function parseNewEventInput(body: unknown): NewEventInput | null {
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

export async function GET() {
  const rows = await db.select().from(events).orderBy(asc(events.startTime));
  return NextResponse.json(rows.map(rowToEvent));
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const input = parseNewEventInput(await req.json());
  if (!input) {
    return NextResponse.json({ error: "Invalid event data" }, { status: 400 });
  }

  const [row] = await db
    .insert(events)
    .values({
      title: input.title,
      type: input.type,
      location: input.location,
      postedBy: input.postedBy,
      startTime: new Date(input.startTime),
      expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
      description: input.description,
      sportKind: input.sportKind,
      imageUrl: input.imageUrl,
    })
    .returning();

  return NextResponse.json(rowToEvent(row));
}
