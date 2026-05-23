import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { leadsTable, appointmentsTable } from "@workspace/db";
import { eq, and, isNull, sql, gte } from "drizzle-orm";
import { GetDashboardStatsQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/dashboard/stats", async (req: Request, res: Response) => {
  const parsed = GetDashboardStatsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query parameters — clientId is required" });
    return;
  }

  const { clientId } = parsed.data;
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [statusRows, apptTypeRows, bookedTodayRows, newTodayRows, contactedTodayRows] = await Promise.all([
    // Per-status counts on leads
    db
      .select({
        status: leadsTable.status,
        count: sql<number>`count(*)::int`,
      })
      .from(leadsTable)
      .where(and(eq(leadsTable.clientId, clientId), isNull(leadsTable.deletedAt)))
      .groupBy(leadsTable.status),

    // Appointment counts by type — source of truth for callbacks & bookings
    db
      .select({
        type: appointmentsTable.type,
        count: sql<number>`count(*)::int`,
      })
      .from(appointmentsTable)
      .where(eq(appointmentsTable.clientId, clientId))
      .groupBy(appointmentsTable.type),

    // Appointments created today
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.clientId, clientId),
          gte(appointmentsTable.createdAt, todayStart),
        ),
      ),

    // New leads today
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(leadsTable)
      .where(
        and(
          eq(leadsTable.clientId, clientId),
          isNull(leadsTable.deletedAt),
          gte(leadsTable.createdAt, todayStart),
        ),
      ),

    // Leads contacted today (lastContactAt today)
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(leadsTable)
      .where(
        and(
          eq(leadsTable.clientId, clientId),
          isNull(leadsTable.deletedAt),
          gte(leadsTable.lastContactAt, todayStart),
        ),
      ),
  ]);

  const byStatus = Object.fromEntries(statusRows.map((r) => [r.status, r.count]));
  const byApptType = Object.fromEntries(apptTypeRows.map((r) => [r.type, r.count]));
  const totalLeads = statusRows.reduce((sum, r) => sum + r.count, 0);

  // callbackBooked = actual callback appointments in the appointments table
  const callbackBooked = byApptType["callback"] ?? 0;
  // bookingCount = service booking appointments in the appointments table
  const bookingCount = (byApptType["service_booking"] ?? 0) + (byApptType["online_consultation"] ?? 0) + (byApptType["walkin_consultation"] ?? 0);

  res.json({
    totalLeads,
    newLeads: byStatus["new"] ?? 0,
    qualifiedLeads: byStatus["qualified"] ?? 0,
    callbackBooked,
    bookingCount,
    escalated: byStatus["escalated"] ?? 0,
    needsHuman: byStatus["needs_human"] ?? 0,
    bookedToday: bookedTodayRows[0]?.count ?? 0,
    newToday: newTodayRows[0]?.count ?? 0,
    contactedToday: contactedTodayRows[0]?.count ?? 0,
  });
});

export default router;
