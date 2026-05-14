# Dosteli WhatsApp Bot System

AI-powered WhatsApp lead capture and qualification bot for Dosteli (dosteli.de — German care company), supporting bilingual (German/Turkish) conversations that qualify care leads and book callbacks.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied via `/api`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/scripts run seed` — seed Dosteli as client_id=1 with 22 bilingual knowledge entries
- Required env: `DATABASE_URL` — Postgres connection string
- Dev env: `TWILIO_SANDBOX=true` — bypass Twilio signature validation + log replies instead of sending
- Prod env: `TWILIO_AUTH_TOKEN`, `TWILIO_ACCOUNT_SID` — required for real WhatsApp send
- AI: `AI_INTEGRATIONS_OPENAI_BASE_URL`, `AI_INTEGRATIONS_OPENAI_API_KEY` — auto-provisioned via Replit AI Integrations

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- AI: OpenAI GPT-4o-mini via Replit AI Integrations
- Messaging: Twilio WhatsApp API
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/db/src/schema/` — all 8 DB table schemas (clients, company_knowledge, leads, conversations, appointments, message_events, job_queue, reactivations)
- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth for routes + types)
- `scripts/src/seed.ts` — Dosteli seed data (22 DE/TR knowledge entries)
- `artifacts/api-server/src/routes/webhook.ts` — Twilio inbound webhook handler
- `artifacts/api-server/src/routes/leads.ts` — Lead management API
- `artifacts/api-server/src/lib/gpt-service.ts` — GPT-4o-mini integration, system prompt, structured JSON response
- `artifacts/api-server/src/lib/knowledge.ts` — Knowledge retrieval from DB (keyword scoring)
- `artifacts/api-server/src/lib/bot-pipeline.ts` — Full bot pipeline orchestrator

## Architecture decisions

- **Webhook ack-then-process**: Twilio webhook returns 200 TwiML immediately; bot pipeline runs async (fire-and-forget) after response sent — keeps Twilio happy while allowing GPT latency
- **Structured GPT response**: GPT returns `{ reply, action, data, intent }` JSON — deterministically parsed with Zod, never string-matched
- **Knowledge-only answers**: GPT system prompt injects top-5 knowledge chunks per turn (keyword scored); model is explicitly forbidden from inventing prices, availability, or staff names
- **Language lock**: Detected on first message using word patterns + exclusive Turkish chars (ğ,ş,ı,İ,Ğ,Ş) — ü/ö excluded since shared with German; locked to lead record for entire conversation
- **Multi-tenant from day one**: All DB queries include `client_id` condition; Twilio sender number resolves which tenant a message belongs to
- **Rate limit**: Max 10 bot turns per lead per hour, enforced in bot-pipeline with hour-window reset
- **Barrel collision fix**: Orval generates same symbol name in both `generated/api.ts` and `generated/types/` for path operations with query params; api-zod barrel selectively excludes conflicting types/

## Product

WhatsApp bot that:
1. Receives inbound WhatsApp messages via Twilio webhook
2. Detects language (German/Turkish) and locks it for the conversation
3. Retrieves relevant knowledge from the company knowledge base
4. Calls GPT-4o-mini with language-locked system prompt to generate a structured response
5. Executes actions: books callbacks (writes to appointments), flags escalations, captures lead info
6. Sends reply via Twilio REST API
7. Dashboard API: list leads, view conversation history, update lead status

## Gotchas

- **Never run `pnpm dev` at workspace root** — use workflows or `--filter` flag
- **TWILIO_SANDBOX=true** must be set for local dev (bypasses signature check + logs replies)
- **After codegen**, if types collide, check `lib/api-zod/src/index.ts` barrel exclusions
- **Dosteli is always client_id=1** — enforced by seed script via `onConflictDoUpdate` on `id=1`
- **`ü` and `ö` are NOT in the Turkish char set** for language detection — they appear in German too; only ğ,ş,ı,İ,Ğ,Ş are Turkish-exclusive

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
