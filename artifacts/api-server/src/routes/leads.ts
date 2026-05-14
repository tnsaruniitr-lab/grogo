import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import {
  leadsTable,
  conversationsTable,
  appointmentsTable,
} from "@workspace/db";
import { eq, and, desc, isNull, count, SQL } from "drizzle-orm";
import {
  ListLeadsQueryParams,
  GetLeadParams,
  UpdateLeadParams,
  UpdateLeadBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/leads", async (req: Request, res: Response) => {
  const parsed = ListLeadsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query parameters" });
    return;
  }

  const { clientId, status, source, language, page, limit } = parsed.data;
  const offset = (page - 1) * limit;

  const conditions: SQL[] = [isNull(leadsTable.deletedAt)];
  if (clientId) conditions.push(eq(leadsTable.clientId, clientId));
  if (status) conditions.push(eq(leadsTable.status, status));
  if (source) conditions.push(eq(leadsTable.source, source));
  if (language) conditions.push(eq(leadsTable.language, language));

  const where = and(...conditions);

  const [rows, totalRows] = await Promise.all([
    db
      .select({
        id: leadsTable.id,
        clientId: leadsTable.clientId,
        phone: leadsTable.phone,
        name: leadsTable.name,
        language: leadsTable.language,
        source: leadsTable.source,
        status: leadsTable.status,
        notes: leadsTable.notes,
        conversationSummary: leadsTable.conversationSummary,
        lastContactAt: leadsTable.lastContactAt,
        createdAt: leadsTable.createdAt,
      })
      .from(leadsTable)
      .where(where)
      .orderBy(desc(leadsTable.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ count: count() }).from(leadsTable).where(where),
  ]);

  res.json({
    data: rows,
    total: Number(totalRows[0].count),
    page,
    limit,
  });
});

router.get("/leads/:id", async (req: Request, res: Response) => {
  const params = GetLeadParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid lead id" });
    return;
  }

  const { id } = params.data;

  const leads = await db
    .select()
    .from(leadsTable)
    .where(and(eq(leadsTable.id, id), isNull(leadsTable.deletedAt)))
    .limit(1);

  if (leads.length === 0) {
    res.status(404).json({ error: "Lead not found" });
    return;
  }

  const [conversations, appointments] = await Promise.all([
    db
      .select()
      .from(conversationsTable)
      .where(and(eq(conversationsTable.leadId, id), isNull(conversationsTable.deletedAt)))
      .orderBy(desc(conversationsTable.createdAt)),
    db
      .select()
      .from(appointmentsTable)
      .where(eq(appointmentsTable.leadId, id))
      .orderBy(desc(appointmentsTable.createdAt)),
  ]);

  res.json({ lead: leads[0], conversations, appointments });
});

router.patch("/leads/:id", async (req: Request, res: Response) => {
  const params = UpdateLeadParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid lead id" });
    return;
  }

  const body = UpdateLeadBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { id } = params.data;

  const existing = await db
    .select({ id: leadsTable.id })
    .from(leadsTable)
    .where(and(eq(leadsTable.id, id), isNull(leadsTable.deletedAt)))
    .limit(1);

  if (existing.length === 0) {
    res.status(404).json({ error: "Lead not found" });
    return;
  }

  const updated = await db
    .update(leadsTable)
    .set({ ...body.data, updatedAt: new Date() })
    .where(eq(leadsTable.id, id))
    .returning();

  res.json(updated[0]);
});

export default router;
