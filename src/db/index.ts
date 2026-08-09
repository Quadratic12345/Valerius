import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Add it to your .env file.");
}

// `prepare: false` and a low connection cap keep this safe under Vercel's
// serverless model, where each invocation can otherwise open new connections
// and quickly exhaust the database's connection limit.
const client = postgres(process.env.DATABASE_URL, {
  prepare: false,
  max: 1,
});

export const db = drizzle(client, { schema });
