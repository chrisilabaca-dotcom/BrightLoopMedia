import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../shared/schema";
import "dotenv/config";

// Setup for in-memory fallback if no Postgres URL is provided
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

export let db: any;

if (process.env.DATABASE_URL) {
    const client = postgres(process.env.DATABASE_URL);
    db = drizzle(client, { schema });
} else {
    // SQLite fallback for local development without Postgres
    const sqlite = new Database(':memory:');

    // Create tables manually for in-memory
    sqlite.exec(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      postcode TEXT,
      service TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

    db = drizzleSqlite(sqlite, { schema });
    console.log("Using in-memory SQLite fallback database.");
}
