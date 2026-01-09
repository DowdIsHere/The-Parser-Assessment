<!-- Copilot instructions for The-Parser-Assessment -->
# The-Parser-Assessment — AI coding agent guide

This project is a small Node/Static-site app that serves a browser-based "Parser Profile" assessment. The notes below capture the essential architecture, runtime expectations, developer workflows, and code patterns an AI coding agent should know to be productive immediately.

1. Big picture
- Server: `server.js` is an Express app that serves static assets and exposes a few JSON endpoints: `/api/health`, `/api/send-results`, `/api/notify-completion`, and `/api/process-payment`.
- Front-end: Static files (e.g., `assessment.html`) are served from the repo root. Front-end JS uses ES modules (see `index.js` and `profiles-group-*.js`) and is intended to run in the browser via `type="module"` imports.
- Profiles: There are 27 profile files (e.g., `actualized.js`) exported via grouped re-exports in `profiles-group-*.js` and aggregated in `index.js`. Profile objects have a consistent shape (see `actualized.js`) with keys like `name`, `code`, `overview`, `phrase`, `strengths`, and `challenges`.

2. Key runtime & integration points
- Environment variables (read by `server.js`):
  - `SQUARE_ENVIRONMENT` (`production` or other): toggles Square base URL.
  - `SQUARE_ACCESS_TOKEN`, `SQUARE_LOCATION_ID`: used by `/api/process-payment`.
  - `EMAIL_USER`, `EMAIL_PASS` or `SMTP_*`: used to configure `nodemailer` for `/api/send-results` and admin notifications.
  - `PORT`: server listen port (defaults to `3000`).
  - `RAILWAY_ENVIRONMENT_NAME`: presence disables local dotenv loading.
- Email: `createTransporter()` in `server.js` returns a transporter only if env vars are configured; code gracefully proceeds if emails aren't configured.
- Payments: server calls Square's `/v2/payments` using `fetch` and expects `SQUARE_ACCESS_TOKEN` and `SQUARE_LOCATION_ID`.
- Customer IDs: generated in-memory (`customerCounter`) and therefore ephemeral — useful to call out when implementing persistent storage or tests.

3. Developer workflows / commands
- Install & run: `npm install` then `npm start` runs `node server.js` (see `package.json`).
- Health-check: `GET /api/health` to verify environment and whether email is configured.
- Local env: create a `.env` file for dev (server loads dotenv unless `RAILWAY_ENVIRONMENT_NAME` is set).
- No tests are present — treat changes as manual-tested via browser + `curl` to API endpoints.

4. Project conventions & patterns an agent should follow
- Mixed module styles: server uses CommonJS (`require`) while front-end modules use ES module `import/export`. Do not convert server to ESM without addressing runtime implications. Prefer small, contained edits that respect this separation.
- Profiles pattern: individual profile files export a named `*Profile` object. `profiles-group-*.js` re-exports those, and `index.js` aggregates them into an uppercase `profiles` map. Use `getProfileByScores(spatial, temporal, reference)` and `getProfileByCode(code)` helpers in `index.js` for lookups.
- Profile `code` format: strings like `"Balanced • Future • Self"` (use the same separator and capitalization when matching).
- Static assets: server serves the repo root via `express.static('.')` — be careful when adding large build outputs to root.

5. Example tasks and useful snippets
- Health check curl:

```bash
curl http://localhost:3000/api/health
```

- Payment payload (server expects `sourceId` token):

```json
{ "sourceId": "<token>", "email": "user@example.com", "profileName": "ACTUALIZED" }
```

6. When editing code, watch for these gotchas
- Don't assume persistent state: `customerCounter` is in-memory and resets on restart.
- Email errors are caught but endpoints still return success — be careful when making changes that assume email was delivered.
- `server.js` uses `fetch` (Node's global `fetch`); ensure runtime supports it (Node 18+), or add a polyfill only if needed and tested.

7. Files to inspect for context
- `server.js` — server endpoints & env expectations
- `index.js` — profiles aggregation and lookup helpers
- `profiles-group-*.js` and individual profile files (e.g., `actualized.js`) — canonical profile object shape
- `assessment.html` — front-end entry (static site)
- `package.json` — start script and dependencies

If anything above is unclear or you want more examples (e.g., more profile object fields, API request/response examples, or suggested tests), tell me which area to expand and I'll iterate.
