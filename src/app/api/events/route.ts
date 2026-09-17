import { auth } from "@clerk/nextjs/server";
import { asc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { events } from "@/lib/db/schema";
import { rowToEvent } from "@/lib/events/types";
import { parseNewEventInput } from "@/lib/events/validate";

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
      postedByUserId: userId,
      startTime: new Date(input.startTime),
      expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
      description: input.description,
      sportKind: input.sportKind,
      imageUrl: input.imageUrl,
    })
    .returning();

  return NextResponse.json(rowToEvent(row));
}
