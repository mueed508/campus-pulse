import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const eventTypeEnum = pgEnum("event_type", ["sports", "society"]);
export const sportKindEnum = pgEnum("sport_kind", [
  "football",
  "cricket",
  "tennis",
  "basketball",
  "badminton",
  "volleyball",
  "other",
]);

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  type: eventTypeEnum("type").notNull(),
  location: text("location").notNull(),
  postedBy: text("posted_by").notNull(),
  postedByUserId: text("posted_by_user_id"),
  startTime: timestamp("start_time", { withTimezone: true }).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  description: text("description"),
  sportKind: sportKindEnum("sport_kind"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type EventRow = typeof events.$inferSelect;
export type NewEventRow = typeof events.$inferInsert;
