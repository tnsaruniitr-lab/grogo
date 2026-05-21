import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { clientsTable, leadsTable, appointmentsTable } from "@workspace/db";
import { eq, and, gte, or } from "drizzle-orm";

const router: IRouter = Router();

/**
 * GET /api/report/:slug/leads
 *
 * Secure cron-friendly leads summary for an external integration (e.g. Alcude).
 *
 * Auth:   x-api-key: <client.demoToken>
 * Query:  ?hours=2  (default 2, max 24)
 *
 * Returns a summary of all lead activity in the requested window:
 *   total         — any lead created or updated in the window
 *   high_intent   — status: qualified | appointment_booked | callback_booked
 *   not_replied   — status: new (bot hasn't qualified them yet)
 *   booked        — status: appointment_booked
 *   call_set_up   — status: callback_booked
 *   dropped_off   — status: closed | escalated | needs_human
 *
 * Each lead entry also includes: id, name, source, status, language,
 *   notes, lastContactAt, createdAt, updatedAt.
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

  // Resolve client by slug
  const [client] = await db
    .select({
      id: clientsTable.id,
      name: clientsTable.name,
      slug: clientsTable.slug,
      demoToken: clientsTable.demoToken,
      deletedAt: clientsTable.deletedAt,
    })
    .from(clientsTable)
    .where(eq(clientsTable.slug, slug))
    .limit(1);

  if (!client || client.deletedAt) {
    res.status(404).json({ error: "Client not found" });
    return;
  }

  // Validate API key against the client's demoToken
  if (!client.demoToken || client.demoToken !== apiKey) {
    res.status(401).json({ error: "Invalid API key" });
    return;
  }

  // Parse ?hours query param (default 2, max 24)
  const rawHours = parseInt((req.query["hours"] as string) ?? "2", 10);
  const hours = Number.isFinite(rawHours) && rawHours >= 1 ? Math.min(rawHours, 24) : 2;

  const now = new Date();
  const windowStart = new Date(now.getTime() - hours * 60 * 60 * 1000);

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

  // Count appointments booked for these leads in the window
  const leadIds = leads.map((l) => l.id);

  let appointmentCount = 0;
  if (leadIds.length > 0) {
    const appts = await db
      .select({ id: appointmentsTable.id })
      .from(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.clientId, client.id),
          gte(appointmentsTable.createdAt, windowStart),
        ),
      );
    appointmentCount = appts.length;
  }

  // Bucket each lead into summary categories
  const HIGH_INTENT = new Set(["qualified", "appointment_booked", "callback_booked"]);
  const DROPPED_OFF = new Set(["closed", "escalated", "needs_human"]);

  let high_intent = 0;
  let not_replied = 0;
  let booked = 0;
  let call_set_up = 0;
  let dropped_off = 0;

  for (const lead of leads) {
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
      hours,
      from: windowStart.toISOString(),
      to: now.toISOString(),
    },
    summary: {
      total: leads.length,
      high_intent,
      not_replied,
      booked,
      call_set_up,
      dropped_off,
      appointments_raised: appointmentCount,
    },
    leads: leads.map((l) => ({
      id: l.id,
      name: l.name ?? null,
      source: l.source,
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
