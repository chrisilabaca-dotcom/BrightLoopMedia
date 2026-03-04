#!/usr/bin/env node
/**
 * Frank Reminder System — Context Injection Router
 *
 * This module sits in Frank's conversation pipeline. When a message
 * comes in, the router checks if it matches reminder trigger phrases.
 * If so, it routes to the reminder handler instead of general conversation.
 *
 * Integration:
 *   Import and call `routeMessage(message)` at the top of Frank's
 *   message processing pipeline. If it returns a result, use that
 *   instead of passing to the general conversation handler.
 *
 * Usage:
 *   import { routeMessage } from './frank/handlers/context-router.js';
 *
 *   // In Frank's message loop:
 *   const result = routeMessage(userMessage);
 *   if (result.handled) {
 *     return result.response; // Reminder system handled it
 *   }
 *   // Otherwise, continue to general conversation...
 */

import { shouldHandleReminder, handleReminderMessage } from "./reminder-handler.js";

/**
 * Route an incoming message through the context injection pipeline.
 *
 * @param {string} message — the raw user message
 * @returns {{ handled: boolean, response?: string, metadata?: object }}
 */
export function routeMessage(message) {
  // Check reminder triggers first
  if (shouldHandleReminder(message)) {
    const result = handleReminderMessage(message);
    return {
      handled: true,
      response: result.response,
      metadata: {
        handler: "reminder",
        success: result.success,
        reminderId: result.reminderId || null,
      },
    };
  }

  // No special handler matched — return unhandled
  return { handled: false };
}

/**
 * Get a system prompt injection for Frank's context.
 * This tells Frank about his reminder capabilities.
 */
export function getReminderContextInjection() {
  return `
REMINDER SYSTEM:
You have a working reminder system. When users ask you to set reminders,
list reminders, or dismiss reminders, use the reminder handler.

Supported commands:
- "Remind me to [task] at [time]" — sets a new reminder
- "Remind me to [task] in [duration]" — sets a relative reminder
- "Remind me about [topic] tomorrow" — sets a reminder for tomorrow 9am
- "What reminders do I have?" — lists all pending reminders
- "Dismiss reminder #N" — dismisses a specific reminder

Time formats: "at 3pm", "in 30 minutes", "tomorrow at 9am", "on Monday", "on 2026-03-15"
`.trim();
}
