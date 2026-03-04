#!/usr/bin/env node
//
// Frank Reminder System — Cron Job: Check Due Reminders
//
// Runs every 5 minutes via crontab.
// Checks reminders.db for any reminders where remind_at has passed
// and status is 'pending'. For each one, sends a Telegram message
// to Chris and marks the reminder as 'sent'.
//
// Usage:
//   node frank/cron/check-reminders.js
//
// Crontab entry:
//   */5 * * * * cd /path/to/BrightLoopMedia && node frank/cron/check-reminders.js >> ~/.openclaw/ops/logs/reminders.log 2>&1
//

import { getDueReminders, markAsSent } from "../reminders/db.js";
import { sendTelegramMessage } from "../utils/telegram.js";

async function checkAndNotify() {
  const timestamp = new Date().toISOString();
  const dueReminders = getDueReminders();

  if (dueReminders.length === 0) {
    console.log(`[${timestamp}] No due reminders.`);
    return;
  }

  console.log(`[${timestamp}] Found ${dueReminders.length} due reminder(s).`);

  for (const reminder of dueReminders) {
    const message =
      `🔔 *Reminder from Frank*\n\n` +
      `${reminder.reminder_text}\n\n` +
      `_Scheduled for: ${reminder.remind_at}_\n` +
      `_Reminder #${reminder.id}_`;

    console.log(`[${timestamp}] Sending reminder #${reminder.id}: "${reminder.reminder_text}"`);

    const result = await sendTelegramMessage(message);

    if (result.ok) {
      markAsSent(reminder.id);
      console.log(`[${timestamp}] Reminder #${reminder.id} sent and marked as 'sent'.`);
    } else {
      console.error(
        `[${timestamp}] Failed to send reminder #${reminder.id}: ${result.description}`
      );
      // Don't mark as sent — it will be retried on next cron run
    }
  }
}

checkAndNotify().catch((err) => {
  console.error(`[${new Date().toISOString()}] Fatal error in check-reminders:`, err);
  process.exit(1);
});
