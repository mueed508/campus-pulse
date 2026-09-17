import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { events } from "@/lib/db/schema";
import { rowToEvent } from "@/lib/events/types";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const rows = await db
    .select()
    .from(events)
    .where(eq(events.postedByUserId, userId))
    .orderBy(desc(events.createdAt));

  return NextResponse.json(rows.map(rowToEvent));
}
