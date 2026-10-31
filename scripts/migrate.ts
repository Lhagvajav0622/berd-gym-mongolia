/**
 * Applies SQL migrations from ./drizzle. Runs before every `next build`, so each
 * Vercel deploy brings the database schema up to date. Skips without DATABASE_URL.
 */
import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.log("[migrate] DATABASE_URL not set, skipping");
    return;
  }
  const client = postgres(url, { max: 1, connect_timeout: 15 });
  await migrate(drizzle(client), { migrationsFolder: "./drizzle" });
  await client.end();
  console.log("[migrate] database is up to date");
}

main().catch((e) => {
  console.error("[migrate] failed:", e);
  process.exit(1);
});
