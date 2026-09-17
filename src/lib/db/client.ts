import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL ?? "";

export const isDatabaseConfigured = Boolean(connectionString);

const sql = neon(connectionString || "postgres://placeholder/placeholder");

export const db = drizzle(sql, { schema });
