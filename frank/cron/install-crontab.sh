#!/bin/bash
# Frank Reminder System — Crontab Installer
#
# Adds the reminder check cron job alongside Frank's existing 4 cron jobs.
# Safe to run multiple times — it won't duplicate the entry.
#
# Usage: bash frank/cron/install-crontab.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
LOG_DIR="$HOME/.openclaw/ops/logs"

# Ensure log directory exists
mkdir -p "$LOG_DIR"

CRON_ENTRY="*/5 * * * * cd $PROJECT_DIR && /usr/bin/env node frank/cron/check-reminders.js >> $LOG_DIR/reminders.log 2>&1"

# Check if the cron job already exists
EXISTING=$(crontab -l 2>/dev/null || true)

if echo "$EXISTING" | grep -qF "check-reminders.js"; then
  echo "[Frank] Reminder cron job already installed. No changes made."
  echo ""
  echo "Current crontab:"
  crontab -l
  exit 0
fi

# Append the new cron job
if [ -z "$EXISTING" ]; then
  echo "$CRON_ENTRY" | crontab -
else
  (echo "$EXISTING"; echo ""; echo "# Frank Reminder System — check for due reminders every 5 minutes"; echo "$CRON_ENTRY") | crontab -
fi

echo "[Frank] Reminder cron job installed successfully."
echo ""
echo "Current crontab:"
crontab -l
echo ""
echo "Log file: $LOG_DIR/reminders.log"
