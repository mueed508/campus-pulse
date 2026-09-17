import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { events } from "@/lib/db/schema";
import { rowToEvent } from "@/lib/events/types";
import { parseEventPatch } from "@/lib/events/validate";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const { id } = await params;
  const patch = parseEventPatch(await req.json());
  if (!patch) {
    return NextResponse.json({ error: "Invalid event data" }, { status: 400 });
  }

  const [row] = await db
    .update(events)
    .set(patch)
    .where(and(eq(events.id, id), eq(events.postedByUserId, userId)))
    .returning();

  if (!row) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json(rowToEvent(row));
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const { id } = await params;

  const [row] = await db
    .delete(events)
    .where(and(eq(events.id, id), eq(events.postedByUserId, userId)))
    .returning();

  if (!row) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
