#!/usr/bin/env node
/**
 * Frank Reminder System — Natural Language Time Parser
 *
 * Parses phrases like:
 *   "in 5 minutes", "in 2 hours", "tomorrow", "tomorrow at 9am",
 *   "at 3pm", "on 2026-03-10", "on March 15", "on Friday",
 *   "next Monday at 10am"
 *
 * Returns an ISO datetime string in local time (Europe/London).
 */

const DAY_NAMES = [
  "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday",
];

/**
 * Parse a natural language time expression into an ISO datetime string.
 * All times are treated as Europe/London.
 *
 * @param {string} input — the time portion of the reminder request
 * @returns {string|null} — ISO datetime string or null if unparseable
 */
export function parseReminderTime(input) {
  const text = input.toLowerCase().trim();
  const now = new Date();

  // "in X minutes/hours/days"
  const relativeMatch = text.match(
    /in\s+(\d+)\s*(minutes?|mins?|hours?|hrs?|days?)/
  );
  if (relativeMatch) {
    const amount = parseInt(relativeMatch[1], 10);
    const unit = relativeMatch[2];
    const target = new Date(now);
    if (unit.startsWith("min")) {
      target.setMinutes(target.getMinutes() + amount);
    } else if (unit.startsWith("h")) {
      target.setHours(target.getHours() + amount);
    } else if (unit.startsWith("d")) {
      target.setDate(target.getDate() + amount);
    }
    return formatForSqlite(target);
  }

  // "tomorrow at HH:MM" or "tomorrow at Xam/pm" or just "tomorrow"
  const tomorrowMatch = text.match(
    /tomorrow(?:\s+at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?)?/
  );
  if (tomorrowMatch) {
    const target = new Date(now);
    target.setDate(target.getDate() + 1);
    if (tomorrowMatch[1]) {
      let hour = parseInt(tomorrowMatch[1], 10);
      const minutes = tomorrowMatch[2] ? parseInt(tomorrowMatch[2], 10) : 0;
      const ampm = tomorrowMatch[3];
      if (ampm === "pm" && hour < 12) hour += 12;
      if (ampm === "am" && hour === 12) hour = 0;
      target.setHours(hour, minutes, 0, 0);
    } else {
      target.setHours(9, 0, 0, 0); // Default to 9am tomorrow
    }
    return formatForSqlite(target);
  }

  // "next <day>" or "on <day>" with optional "at HH:MM"
  const dayMatch = text.match(
    /(?:next|on)\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday)(?:\s+at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?)?/
  );
  if (dayMatch) {
    const targetDay = DAY_NAMES.indexOf(dayMatch[1]);
    const target = new Date(now);
    const currentDay = target.getDay();
    let daysAhead = targetDay - currentDay;
    if (daysAhead <= 0) daysAhead += 7;
    target.setDate(target.getDate() + daysAhead);
    if (dayMatch[2]) {
      let hour = parseInt(dayMatch[2], 10);
      const minutes = dayMatch[3] ? parseInt(dayMatch[3], 10) : 0;
      const ampm = dayMatch[4];
      if (ampm === "pm" && hour < 12) hour += 12;
      if (ampm === "am" && hour === 12) hour = 0;
      target.setHours(hour, minutes, 0, 0);
    } else {
      target.setHours(9, 0, 0, 0);
    }
    return formatForSqlite(target);
  }

  // "at HH:MM" or "at Xam/pm" (today or next occurrence)
  const atMatch = text.match(
    /at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/
  );
  if (atMatch) {
    let hour = parseInt(atMatch[1], 10);
    const minutes = atMatch[2] ? parseInt(atMatch[2], 10) : 0;
    const ampm = atMatch[3];
    if (ampm === "pm" && hour < 12) hour += 12;
    if (ampm === "am" && hour === 12) hour = 0;
    const target = new Date(now);
    target.setHours(hour, minutes, 0, 0);
    // If the time has already passed today, set for tomorrow
    if (target <= now) {
      target.setDate(target.getDate() + 1);
    }
    return formatForSqlite(target);
  }

  // "on YYYY-MM-DD" or "on YYYY-MM-DD at HH:MM"
  const isoDateMatch = text.match(
    /on\s+(\d{4}-\d{2}-\d{2})(?:\s+at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?)?/
  );
  if (isoDateMatch) {
    const target = new Date(isoDateMatch[1] + "T09:00:00");
    if (isoDateMatch[2]) {
      let hour = parseInt(isoDateMatch[2], 10);
      const minutes = isoDateMatch[3] ? parseInt(isoDateMatch[3], 10) : 0;
      const ampm = isoDateMatch[4];
      if (ampm === "pm" && hour < 12) hour += 12;
      if (ampm === "am" && hour === 12) hour = 0;
      target.setHours(hour, minutes, 0, 0);
    }
    return formatForSqlite(target);
  }

  // "on March 15" or "on March 15 at 2pm"
  const monthDateMatch = text.match(
    /on\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})(?:\s+at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?)?/
  );
  if (monthDateMatch) {
    const months = [
      "january", "february", "march", "april", "may", "june",
      "july", "august", "september", "october", "november", "december",
    ];
    const month = months.indexOf(monthDateMatch[1]);
    const day = parseInt(monthDateMatch[2], 10);
    const target = new Date(now.getFullYear(), month, day, 9, 0, 0);
    if (target < now) {
      target.setFullYear(target.getFullYear() + 1);
    }
    if (monthDateMatch[3]) {
      let hour = parseInt(monthDateMatch[3], 10);
      const minutes = monthDateMatch[4] ? parseInt(monthDateMatch[4], 10) : 0;
      const ampm = monthDateMatch[5];
      if (ampm === "pm" && hour < 12) hour += 12;
      if (ampm === "am" && hour === 12) hour = 0;
      target.setHours(hour, minutes, 0, 0);
    }
    return formatForSqlite(target);
  }

  return null;
}

/**
 * Format a Date object into a SQLite-compatible datetime string.
 */
export function formatForSqlite(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
