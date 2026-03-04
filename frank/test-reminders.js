#!/usr/bin/env node
/**
 * Frank Reminder System — Test Suite
 *
 * Tests the full reminder pipeline:
 *   1. Database creation and operations
 *   2. Natural language time parsing
 *   3. Reminder handler (create, list, dismiss)
 *   4. Context router integration
 *   5. Due reminder detection
 *   6. End-to-end: set a reminder for "now", check it fires
 *
 * Usage: node frank/test-reminders.js
 */

import { getDb, addReminder, getDueReminders, getPendingReminders, markAsSent, markAsDismissed, DB_PATH } from "./reminders/db.js";
import { parseReminderTime, formatForSqlite } from "./utils/parse-time.js";
import { shouldHandleReminder, handleReminderMessage } from "./handlers/reminder-handler.js";
import { routeMessage, getReminderContextInjection } from "./handlers/context-router.js";

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✗ ${label}`);
    failed++;
  }
}

console.log("=== Frank Reminder System — Test Suite ===\n");
console.log(`Database path: ${DB_PATH}\n`);

// --- 1. Database Tests ---
console.log("1. Database Operations");
{
  const db = getDb();
  assert(db !== null, "Database initialised");

  // Check table exists
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='reminders'").get();
  assert(tables && tables.name === "reminders", "Reminders table exists");

  // Insert a reminder
  const id = addReminder("Test reminder", "2099-12-31 23:59:59");
  assert(id > 0, `Inserted reminder with id=${id}`);

  // Query pending
  const pending = getPendingReminders();
  assert(pending.length >= 1, `Has ${pending.length} pending reminder(s)`);

  // Mark as dismissed (cleanup)
  markAsDismissed(Number(id));
  const afterDismiss = getPendingReminders().filter(r => r.id === Number(id));
  assert(afterDismiss.length === 0, "Dismissed reminder no longer pending");
}

// --- 2. Time Parser Tests ---
console.log("\n2. Natural Language Time Parsing");
{
  const now = new Date();

  const inFive = parseReminderTime("in 5 minutes");
  assert(inFive !== null, `"in 5 minutes" → ${inFive}`);

  const inTwoHours = parseReminderTime("in 2 hours");
  assert(inTwoHours !== null, `"in 2 hours" → ${inTwoHours}`);

  const tomorrow = parseReminderTime("tomorrow");
  assert(tomorrow !== null, `"tomorrow" → ${tomorrow}`);

  const tomorrowAt9 = parseReminderTime("tomorrow at 9am");
  assert(tomorrowAt9 !== null, `"tomorrow at 9am" → ${tomorrowAt9}`);

  const at3pm = parseReminderTime("at 3pm");
  assert(at3pm !== null, `"at 3pm" → ${at3pm}`);

  const onMonday = parseReminderTime("next monday");
  assert(onMonday !== null, `"next monday" → ${onMonday}`);

  const onDate = parseReminderTime("on 2026-03-15");
  assert(onDate !== null, `"on 2026-03-15" → ${onDate}`);

  const onMarch = parseReminderTime("on march 15 at 2pm");
  assert(onMarch !== null, `"on march 15 at 2pm" → ${onMarch}`);

  const bad = parseReminderTime("gibberish");
  assert(bad === null, `"gibberish" → null (correctly rejected)`);
}

// --- 3. Reminder Handler Tests ---
console.log("\n3. Reminder Handler");
{
  const r1 = handleReminderMessage("remind me to call the dentist at 3pm");
  assert(r1.success === true, `Create: "${r1.response}"`);

  const r2 = handleReminderMessage("remind me to review the PR in 30 minutes");
  assert(r2.success === true, `Create: "${r2.response}"`);

  const r3 = handleReminderMessage("remind me about the meeting tomorrow at 9am");
  assert(r3.success === true, `Create: "${r3.response}"`);

  const r4 = handleReminderMessage("what reminders do I have?");
  assert(r4.success === true && r4.response.includes("pending"), `List: ${r4.response.split("\n")[0]}`);

  // Dismiss the test reminders
  if (r1.reminderId) {
    const r5 = handleReminderMessage(`dismiss reminder #${r1.reminderId}`);
    assert(r5.success === true, `Dismiss: ${r5.response}`);
  }
}

// --- 4. Context Router Tests ---
console.log("\n4. Context Router");
{
  const triggers = [
    "remind me to buy milk",
    "set a reminder for the standup",
    "don't forget to send the invoice",
    "remember to water the plants",
    "what reminders do I have",
    "show reminders",
  ];

  for (const t of triggers) {
    assert(shouldHandleReminder(t), `Trigger detected: "${t}"`);
  }

  const nonTriggers = [
    "what's the weather like",
    "help me with this code",
    "tell me about the project",
  ];

  for (const t of nonTriggers) {
    assert(!shouldHandleReminder(t), `Not a trigger: "${t}"`);
  }

  const routed = routeMessage("remind me to check logs in 10 minutes");
  assert(routed.handled === true, "Router handled reminder message");
  assert(routed.metadata.handler === "reminder", "Router identified reminder handler");

  const notRouted = routeMessage("how's the deploy going?");
  assert(notRouted.handled === false, "Router passed through non-reminder message");

  const injection = getReminderContextInjection();
  assert(injection.includes("REMINDER SYSTEM"), "Context injection contains system prompt");
}

// --- 5. Due Reminder Detection ---
console.log("\n5. Due Reminder Detection");
{
  // Insert a reminder that's already due (in the past)
  const pastTime = formatForSqlite(new Date(Date.now() - 60000)); // 1 minute ago
  const dueId = addReminder("This is a due test reminder", pastTime);
  assert(dueId > 0, `Inserted past-due reminder #${dueId}`);

  const due = getDueReminders();
  const found = due.find(r => r.id === Number(dueId));
  assert(found !== undefined, `Due reminder #${dueId} detected by getDueReminders()`);

  // Mark as sent
  markAsSent(Number(dueId));
  const afterSent = getDueReminders().find(r => r.id === Number(dueId));
  assert(afterSent === undefined, `Reminder #${dueId} no longer due after markAsSent()`);
}

// --- Summary ---
console.log("\n" + "=".repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log("=".repeat(50));

if (failed > 0) {
  process.exit(1);
} else {
  console.log("\nAll tests passed! The reminder system is operational.");
}
