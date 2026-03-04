# Frank Configuration

Frank is the ops assistant for Bright Loop Media. He runs as a swarm agent with Mem0 memory (220+ memories), Task Bot, and 5 active cron jobs.

## Reminder System

Frank has a working reminder system that stores reminders in a SQLite database and sends Telegram notifications when they come due.

### Architecture

```
frank/
├── reminders/
│   └── db.js              # SQLite database module (~/.openclaw/ops/reminders.db)
├── handlers/
│   ├── reminder-handler.js # Parses and processes reminder messages
│   └── context-router.js   # Context injection pipeline router
├── utils/
│   ├── parse-time.js       # Natural language time parser
│   └── telegram.js         # Telegram Bot API notification sender
├── cron/
│   ├── check-reminders.js  # Cron job: checks due reminders every 5 minutes
│   └── install-crontab.sh  # Installs the cron job
├── cli.js                  # CLI for manual reminder management
└── test-reminders.js       # Test suite
```

### Database

- **Location:** `~/.openclaw/ops/reminders.db`
- **Table:** `reminders`
- **Columns:**
  - `id` — INTEGER PRIMARY KEY AUTOINCREMENT
  - `reminder_text` — TEXT NOT NULL
  - `remind_at` — TEXT NOT NULL (datetime format: YYYY-MM-DD HH:MM:SS)
  - `created_at` — TEXT NOT NULL (auto-populated)
  - `status` — TEXT NOT NULL: `pending`, `sent`, or `dismissed`

### Trigger Phrases

When Frank receives a message containing any of these patterns, it routes to the reminder handler instead of general conversation:

- "remind me to ...", "remind me about ..."
- "set a reminder for ..."
- "don't forget to ..."
- "remember to ..."
- "what reminders do I have?"
- "show reminders", "list reminders", "my reminders"
- "dismiss reminder #N", "cancel reminder #N"

### Supported Time Formats

| Input | Result |
|---|---|
| `in 5 minutes` | 5 minutes from now |
| `in 2 hours` | 2 hours from now |
| `at 3pm` | Today at 3pm (or tomorrow if already past) |
| `tomorrow` | Tomorrow at 9am |
| `tomorrow at 9am` | Tomorrow at 9am |
| `next monday` | Next Monday at 9am |
| `next friday at 2pm` | Next Friday at 2pm |
| `on 2026-03-15` | March 15 2026 at 9am |
| `on march 15 at 2pm` | March 15 at 2pm |

### Cron Job

The reminder cron job runs every 5 minutes alongside Frank's other cron jobs:

```
*/5 * * * * cd /path/to/BrightLoopMedia && node frank/cron/check-reminders.js >> ~/.openclaw/ops/logs/reminders.log 2>&1
```

Install with: `bash frank/cron/install-crontab.sh`

### Environment Variables

Required in `~/.openclaw/ops/.env`:

```
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

### CLI Usage

```bash
# Create a reminder
node frank/cli.js add "call the dentist" "at 3pm"

# List pending reminders
node frank/cli.js list

# List all reminders (including sent/dismissed)
node frank/cli.js list --all

# Dismiss a reminder
node frank/cli.js dismiss 3

# Manually run the due-reminder check
node frank/cli.js check

# Route a natural language message
node frank/cli.js handle "remind me to review the PR in 30 minutes"
```

### Integration with Frank's Conversation Loop

In Frank's message processing pipeline, import the context router:

```javascript
import { routeMessage } from './frank/handlers/context-router.js';

// At the top of Frank's message handler:
const result = routeMessage(userMessage);
if (result.handled) {
  return result.response; // Reminder system handled it
}
// Otherwise, continue to general conversation handler...
```

For context injection (so Frank knows he has reminders), add to the system prompt:

```javascript
import { getReminderContextInjection } from './frank/handlers/context-router.js';

const systemPrompt = `...existing prompt...\n\n${getReminderContextInjection()}`;
```

### Testing

Run the test suite:

```bash
node frank/test-reminders.js
```

This tests:
1. Database creation and CRUD operations
2. Natural language time parsing (9 patterns)
3. Reminder handler (create, list, dismiss)
4. Context router trigger detection
5. Due reminder detection and status transitions
