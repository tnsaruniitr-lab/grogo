import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { clientsTable, leadsTable, appointmentsTable } from "@workspace/db";
import { eq, and, gte, or } from "drizzle-orm";

const router: IRouter = Router();

/**
 * GET /api/report/:slug/leads
 *
 * Cursor-managed leads report for external cron integrations (e.g. Alcude).
 *
 * Auth:    x-api-key: <client.demoToken>
 * Params:  none required — cursor is managed server-side
 *
 * Cursor behaviour:
 *   - On each call the server reads client.reportCursorAt as windowStart.
 *   - If null (first ever call) windowStart defaults to 2 hours ago.
 *   - After building the response the cursor is advanced to `now`.
 *   - This means every call returns exactly the leads since the last call —
 *     no gaps, no duplicates, no state needed on the caller side.
 *
 * Escape hatch:
 *   ?override_since=<ISO> — ignore cursor, fetch from a specific timestamp.
 *   Useful for manual backfills or retries. Does NOT advance the cursor.
 *
 * Response summary buckets:
 *   total             — leads created or updated in window
 *   by_channel        — breakdown by source channel
 *   high_intent       — qualified | appointment_booked | callback_booked
 *   not_replied       — new (bot hasn't responded yet)
 *   booked            — appointment_booked
 *   call_set_up       — callback_booked
 *   dropped_off       — closed | escalated | needs_human
 *   appointments_raised — appointments created in window
 */
router.get("/report/:slug/leads", async (req: Request, res: Response) => {
  const slug = req.params["slug"] as string;
  const apiKey = Array.isArray(req.headers["x-api-key"])
    ? req.headers["x-api-key"][0]
    : req.headers["x-api-key"];

  if (!slug || !apiKey) {
    res.status(401).json({ error: "Missing x-api-key header" });
    return;
  }

  // Resolve and authenticate client
  const [client] = await db
    .select({
      id: clientsTable.id,
      name: clientsTable.name,
      slug: clientsTable.slug,
      demoToken: clientsTable.demoToken,
      reportCursorAt: clientsTable.reportCursorAt,
      deletedAt: clientsTable.deletedAt,
    })
    .from(clientsTable)
    .where(eq(clientsTable.slug, slug))
    .limit(1);

  if (!client || client.deletedAt) {
    res.status(404).json({ error: "Client not found" });
    return;
  }

  if (!client.demoToken || client.demoToken !== apiKey) {
    res.status(401).json({ error: "Invalid API key" });
    return;
  }

  const now = new Date();

  // Determine window start:
  //   1. ?override_since=<ISO>  — manual backfill, cursor NOT advanced
  //   2. client.reportCursorAt  — normal cursor flow
  //   3. fallback: 2 hours ago  — first ever call
  const overrideSince = req.query["override_since"] as string | undefined;
  let windowStart: Date;
  let advanceCursor = true;

  if (overrideSince) {
    const parsed = new Date(overrideSince);
    if (isNaN(parsed.getTime())) {
      res.status(400).json({ error: "Invalid override_since — must be ISO 8601" });
      return;
    }
    windowStart = parsed;
    advanceCursor = false;
  } else if (client.reportCursorAt) {
    windowStart = client.reportCursorAt;
  } else {
    windowStart = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  }

  // Fetch leads active in the window (created or updated)
  const leads = await db
    .select({
      id: leadsTable.id,
      name: leadsTable.name,
      source: leadsTable.source,
      status: leadsTable.status,
      language: leadsTable.language,
      notes: leadsTable.notes,
      conversationSummary: leadsTable.conversationSummary,
      lastContactAt: leadsTable.lastContactAt,
      createdAt: leadsTable.createdAt,
      updatedAt: leadsTable.updatedAt,
    })
    .from(leadsTable)
    .where(
      and(
        eq(leadsTable.clientId, client.id),
        or(
          gte(leadsTable.createdAt, windowStart),
          gte(leadsTable.updatedAt, windowStart),
        ),
      ),
    )
    .orderBy(leadsTable.updatedAt);

  // Appointments created in the window
  const appts = await db
    .select({ id: appointmentsTable.id })
    .from(appointmentsTable)
    .where(
      and(
        eq(appointmentsTable.clientId, client.id),
        gte(appointmentsTable.createdAt, windowStart),
      ),
    );

  // Advance cursor (normal flow only, not override)
  if (advanceCursor) {
    await db
      .update(clientsTable)
      .set({ reportCursorAt: now })
      .where(eq(clientsTable.id, client.id));
  }

  // Bucket leads
  const HIGH_INTENT = new Set(["qualified", "appointment_booked", "callback_booked"]);
  const DROPPED_OFF = new Set(["closed", "escalated", "needs_human"]);
  const byChannel: Record<string, number> = {};

  let high_intent = 0;
  let not_replied = 0;
  let booked = 0;
  let call_set_up = 0;
  let dropped_off = 0;

  for (const lead of leads) {
    const ch = lead.source ?? "unknown";
    byChannel[ch] = (byChannel[ch] ?? 0) + 1;
    if (lead.status === "new") not_replied++;
    if (HIGH_INTENT.has(lead.status)) high_intent++;
    if (lead.status === "appointment_booked") booked++;
    if (lead.status === "callback_booked") call_set_up++;
    if (DROPPED_OFF.has(lead.status)) dropped_off++;
  }

  res.json({
    client: {
      slug: client.slug,
      name: client.name,
    },
    period: {
      from: windowStart.toISOString(),
      to: now.toISOString(),
      cursor_advanced: advanceCursor,
    },
    summary: {
      total: leads.length,
      by_channel: byChannel,
      high_intent,
      not_replied,
      booked,
      call_set_up,
      dropped_off,
      appointments_raised: appts.length,
    },
    leads: leads.map((l) => ({
      id: l.id,
      name: l.name ?? null,
      channel: l.source,
      status: l.status,
      language: l.language ?? null,
      notes: l.notes ?? null,
      summary: l.conversationSummary ?? null,
      lastContactAt: l.lastContactAt?.toISOString() ?? null,
      createdAt: l.createdAt.toISOString(),
      updatedAt: l.updatedAt.toISOString(),
    })),
  });
});

export default router;
