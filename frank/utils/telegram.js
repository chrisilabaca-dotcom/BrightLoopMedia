#!/usr/bin/env node
/**
 * Frank Reminder System — Telegram Notification Utility
 *
 * Sends messages to Chris via Telegram Bot API.
 *
 * Required environment variables:
 *   TELEGRAM_BOT_TOKEN  — Frank's Telegram bot token
 *   TELEGRAM_CHAT_ID    — Chris's chat ID
 *
 * These should be set in ~/.openclaw/ops/.env or exported in the shell.
 */

import "dotenv/config";
import path from "path";
import os from "os";
import fs from "fs";

// Also try loading from ~/.openclaw/ops/.env
const opsEnvPath = path.join(os.homedir(), ".openclaw", "ops", ".env");
if (fs.existsSync(opsEnvPath)) {
  const envContent = fs.readFileSync(opsEnvPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

/**
 * Send a Telegram message to Chris.
 * @param {string} message — the text to send (supports Markdown)
 * @returns {Promise<{ok: boolean, description?: string}>}
 */
export async function sendTelegramMessage(message) {
  if (!BOT_TOKEN || !CHAT_ID) {
    const missing = [];
    if (!BOT_TOKEN) missing.push("TELEGRAM_BOT_TOKEN");
    if (!CHAT_ID) missing.push("TELEGRAM_CHAT_ID");
    console.error(
      `[Frank Reminders] Missing env vars: ${missing.join(", ")}. ` +
      `Set them in ~/.openclaw/ops/.env or export them.`
    );
    return { ok: false, description: `Missing: ${missing.join(", ")}` };
  }

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    const data = await response.json();
    if (!data.ok) {
      console.error("[Frank Reminders] Telegram API error:", data.description);
    }
    return data;
  } catch (err) {
    console.error("[Frank Reminders] Failed to send Telegram message:", err.message);
    return { ok: false, description: err.message };
  }
}
