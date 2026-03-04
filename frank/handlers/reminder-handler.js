#!/usr/bin/env node
/**
 * Frank Reminder System — Reminder Handler
 *
 * Parses incoming messages that match reminder trigger phrases and either:
 *   1. Creates a new reminder ("remind me to X at Y")
 *   2. Lists pending reminders ("what reminders do I have?")
 *   3. Dismisses a reminder ("dismiss reminder #3")
 *
 * This is wired into Frank's context injection pipeline.
 */

import { addReminder, getPendingReminders, markAsDismissed } from "../reminders/db.js";
import { parseReminderTime } from "../utils/parse-time.js";

// Trigger phrases that route to this handler
const REMINDER_TRIGGERS = [
  /remind\s+me/i,
  /reminder/i,
  /don'?t\s+forget/i,
  /remember\s+to/i,
  /set\s+a?\s*reminder/i,
  /what\s+reminders/i,
  /list\s+reminders/i,
  /my\s+reminders/i,
  /show\s+reminders/i,
  /dismiss\s+reminder/i,
  /cancel\s+reminder/i,
  /delete\s+reminder/i,
];

/**
 * Check if a message should be routed to the reminder handler.
 * @param {string} message
 * @returns {boolean}
 */
export function shouldHandleReminder(message) {
  return REMINDER_TRIGGERS.some((pattern) => pattern.test(message));
}

/**
 * Handle a reminder-related message.
 * @param {string} message — the raw user message
 * @returns {{ success: boolean, response: string, reminderId?: number }}
 */
export function handleReminderMessage(message) {
  const text = message.trim();

  // --- List reminders ---
  if (/what\s+reminders|list\s+reminders|my\s+reminders|show\s+reminders/i.test(text)) {
    return listReminders();
  }

  // --- Dismiss a reminder ---
  const dismissMatch = text.match(/(?:dismiss|cancel|delete)\s+reminder\s+#?(\d+)/i);
  if (dismissMatch) {
    return dismissReminder(parseInt(dismissMatch[1], 10));
  }

  // --- Create a reminder ---
  return createReminder(text);
}

/**
 * Parse a "remind me to X at/in/on Y" message and store it.
 */
function createReminder(text) {
  // Extract the reminder text and time from patterns like:
  //   "remind me to [X] at [time]"
  //   "remind me to [X] tomorrow"
  //   "remind me about [X] on [date]"
  //   "remember to [X] in [duration]"
  //   "don't forget to [X] at [time]"

  // Normalise trigger phrases to a common form
  let normalised = text
    .replace(/don'?t\s+forget\s+to/i, "remind me to")
    .replace(/remember\s+to/i, "remind me to")
    .replace(/set\s+a?\s*reminder\s+(?:to|for)\s*/i, "remind me to");

  // Pattern: "remind me to/about [X] [time expression]"
  const match = normalised.match(
    /remind\s+me\s+(?:to|about|that)\s+(.+?)(?:\s+(?:at|in|on|tomorrow|next)\s+.+)$/i
  );

  let reminderText, timeExpression;

  if (match) {
    reminderText = match[1].trim();
    // The time expression is everything after the reminder text
    const timeStart = normalised.indexOf(reminderText) + reminderText.length;
    timeExpression = normalised.slice(timeStart).trim();
  } else {
    // Try: "remind me [time expression] to [X]"
    const altMatch = normalised.match(
      /remind\s+me\s+((?:at|in|on|tomorrow|next)\s+.+?)\s+(?:to|about|that)\s+(.+)/i
    );
    if (altMatch) {
      timeExpression = altMatch[1].trim();
      reminderText = altMatch[2].trim();
    } else {
      // Fallback: try to split on known time markers
      const timeMarkers = /\b(at \d|in \d|on \d|tomorrow|next (?:mon|tue|wed|thu|fri|sat|sun))/i;
      const markerMatch = normalised.match(timeMarkers);
      if (markerMatch && markerMatch.index) {
        // Everything before the time marker (after "remind me to") is the reminder text
        const afterTrigger = normalised.replace(/^.*?remind\s+me\s+(?:to|about|that)?\s*/i, "");
        const idx = afterTrigger.search(timeMarkers);
        if (idx > 0) {
          reminderText = afterTrigger.slice(0, idx).trim();
          timeExpression = afterTrigger.slice(idx).trim();
        }
      }
    }
  }

  if (!reminderText || !timeExpression) {
    return {
      success: false,
      response:
        "I couldn't parse that reminder. Try something like:\n" +
        '  "Remind me to call the dentist at 3pm"\n' +
        '  "Remind me to review the PR in 30 minutes"\n' +
        '  "Remind me about the meeting tomorrow at 9am"',
    };
  }

  const remindAt = parseReminderTime(timeExpression);
  if (!remindAt) {
    return {
      success: false,
      response:
        `I understood the reminder ("${reminderText}") but couldn't parse the time "${timeExpression}".\n` +
        "Try: in 5 minutes, at 3pm, tomorrow, tomorrow at 9am, on Monday, on 2026-03-15.",
    };
  }

  const id = addReminder(reminderText, remindAt);
  return {
    success: true,
    reminderId: Number(id),
    response: `Reminder #${id} set: "${reminderText}" — I'll ping you at ${remindAt}.`,
  };
}

/**
 * List all pending reminders.
 */
function listReminders() {
  const reminders = getPendingReminders();
  if (reminders.length === 0) {
    return {
      success: true,
      response: "You have no pending reminders.",
    };
  }

  const lines = reminders.map(
    (r) => `  #${r.id} — "${r.reminder_text}" at ${r.remind_at}`
  );
  return {
    success: true,
    response: `You have ${reminders.length} pending reminder(s):\n${lines.join("\n")}`,
  };
}

/**
 * Dismiss a reminder by ID.
 */
function dismissReminder(id) {
  const result = markAsDismissed(id);
  if (result.changes === 0) {
    return {
      success: false,
      response: `Reminder #${id} not found or already dismissed.`,
    };
  }
  return {
    success: true,
    response: `Reminder #${id} dismissed.`,
  };
}
