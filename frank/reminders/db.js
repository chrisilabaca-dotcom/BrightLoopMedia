#!/usr/bin/env node
/**
 * Frank Reminder System — Database Module
 *
 * Manages the SQLite database at ~/.openclaw/ops/reminders.db
 * Schema: id, reminder_text, remind_at, created_at, status
 */

import Database from "better-sqlite3";
import path from "path";
import os from "os";
import fs from "fs";

const OPS_DIR = path.join(os.homedir(), ".openclaw", "ops");
const DB_PATH = path.join(OPS_DIR, "reminders.db");

// Ensure the directory exists
fs.mkdirSync(OPS_DIR, { recursive: true });

let _db = null;

export function getDb() {
  if (_db) return _db;

  _db = new Database(DB_PATH);
  _db.pragma("journal_mode = WAL");

  // Create reminders table if it doesn't exist
  _db.exec(`
    CREATE TABLE IF NOT EXISTS reminders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reminder_text TEXT NOT NULL,
      remind_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'sent', 'dismissed'))
    )
  `);

  // Index for the cron job query
  _db.exec(`
    CREATE INDEX IF NOT EXISTS idx_reminders_status_remind_at
    ON reminders(status, remind_at)
  `);

  return _db;
}

export function addReminder(reminderText, remindAt) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO reminders (reminder_text, remind_at, created_at, status)
    VALUES (?, ?, datetime('now'), 'pending')
  `);
  const result = stmt.run(reminderText, remindAt);
  return result.lastInsertRowid;
}

export function getDueReminders() {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT id, reminder_text, remind_at, created_at, status
    FROM reminders
    WHERE status = 'pending' AND remind_at <= datetime('now')
    ORDER BY remind_at ASC
  `);
  return stmt.all();
}

export function markAsSent(id) {
  const db = getDb();
  const stmt = db.prepare(`UPDATE reminders SET status = 'sent' WHERE id = ?`);
  return stmt.run(id);
}

export function markAsDismissed(id) {
  const db = getDb();
  const stmt = db.prepare(`UPDATE reminders SET status = 'dismissed' WHERE id = ?`);
  return stmt.run(id);
}

export function getPendingReminders() {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT id, reminder_text, remind_at, created_at, status
    FROM reminders
    WHERE status = 'pending'
    ORDER BY remind_at ASC
  `);
  return stmt.all();
}

export function getAllReminders(limit = 50) {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT id, reminder_text, remind_at, created_at, status
    FROM reminders
    ORDER BY remind_at DESC
    LIMIT ?
  `);
  return stmt.all(limit);
}

export { DB_PATH, OPS_DIR };
