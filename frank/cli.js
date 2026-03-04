#!/usr/bin/env node
/**
 * Frank Reminder System — CLI
 *
 * Quick command-line interface for managing reminders.
 *
 * Usage:
 *   node frank/cli.js add "call the dentist" "at 3pm"
 *   node frank/cli.js add "review PR" "in 30 minutes"
 *   node frank/cli.js add "standup meeting" "tomorrow at 9am"
 *   node frank/cli.js list
 *   node frank/cli.js dismiss 3
 *   node frank/cli.js check              # Run the cron check manually
 *   node frank/cli.js handle "remind me to buy milk tomorrow"
 */

import { addReminder, getPendingReminders, getAllReminders, markAsDismissed } from "./reminders/db.js";
import { parseReminderTime } from "./utils/parse-time.js";
import { routeMessage } from "./handlers/context-router.js";

const [,, command, ...args] = process.argv;

switch (command) {
  case "add": {
    const [text, timeExpr] = args;
    if (!text || !timeExpr) {
      console.error('Usage: node frank/cli.js add "reminder text" "time expression"');
      process.exit(1);
    }
    const remindAt = parseReminderTime(timeExpr);
    if (!remindAt) {
      console.error(`Could not parse time: "${timeExpr}"`);
      process.exit(1);
    }
    const id = addReminder(text, remindAt);
    console.log(`Reminder #${id} set: "${text}" at ${remindAt}`);
    break;
  }

  case "list": {
    const showAll = args[0] === "--all";
    const reminders = showAll ? getAllReminders() : getPendingReminders();
    if (reminders.length === 0) {
      console.log(showAll ? "No reminders found." : "No pending reminders.");
    } else {
      console.log(showAll ? "All reminders:" : "Pending reminders:");
      for (const r of reminders) {
        console.log(`  #${r.id} [${r.status}] "${r.reminder_text}" — ${r.remind_at}`);
      }
    }
    break;
  }

  case "dismiss": {
    const id = parseInt(args[0], 10);
    if (isNaN(id)) {
      console.error("Usage: node frank/cli.js dismiss <id>");
      process.exit(1);
    }
    markAsDismissed(id);
    console.log(`Reminder #${id} dismissed.`);
    break;
  }

  case "check": {
    // Dynamically import and run the cron check
    await import("./cron/check-reminders.js");
    break;
  }

  case "handle": {
    const message = args.join(" ");
    if (!message) {
      console.error("Usage: node frank/cli.js handle \"remind me to ...\"");
      process.exit(1);
    }
    const result = routeMessage(message);
    if (result.handled) {
      console.log(result.response);
    } else {
      console.log("Message not recognised as a reminder command.");
    }
    break;
  }

  default:
    console.log(`Frank Reminder System — CLI

Commands:
  add "text" "time"   Create a new reminder
  list [--all]        Show pending (or all) reminders
  dismiss <id>        Dismiss a reminder
  check               Run the due-reminder check (what cron does)
  handle "message"    Route a natural language message through the handler
`);
}
