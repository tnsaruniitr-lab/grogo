import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import {
  clientsTable,
  leadsTable,
  messageEventsTable,
  conversationsTable,
  jobQueueTable,
} from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

router.post("/webhook/twilio", async (req: Request, res: Response) => {
  const twimlEmpty = '<?xml version="1.0" encoding="UTF-8"?><Response></Response>';

  try {
    const {
      MessageSid,
      From,
      To,
      Body,
      WaId,
      ProfileName,
    } = req.body as {
      MessageSid?: string;
      From?: string;
      To?: string;
      Body?: string;
      WaId?: string;
      ProfileName?: string;
    };

    if (!MessageSid || !From || !To || Body === undefined) {
      req.log.warn({ body: req.body }, "Twilio webhook missing required fields");
      res.status(200).type("text/xml").send(twimlEmpty);
      return;
    }

    // Idempotency check — drop duplicates by MessageSid
    const existing = await db
      .select({ id: messageEventsTable.id })
      .from(messageEventsTable)
      .where(eq(messageEventsTable.twilioMessageSid, MessageSid))
      .limit(1);

    if (existing.length > 0) {
      req.log.info({ MessageSid }, "Duplicate webhook — already processed");
      res.status(200).type("text/xml").send(twimlEmpty);
      return;
    }

    // Resolve client from Twilio sender number
    const clients = await db
      .select()
      .from(clientsTable)
      .where(and(eq(clientsTable.twilioSender, To), eq(clientsTable.isActive, true)))
      .limit(1);

    if (clients.length === 0) {
      req.log.warn({ To }, "No active client found for Twilio sender");
      res.status(200).type("text/xml").send(twimlEmpty);
      return;
    }

    const client = clients[0];

    // Upsert lead by phone + client
    const normalizedPhone = From.replace("whatsapp:", "");
    const existingLeads = await db
      .select()
      .from(leadsTable)
      .where(and(eq(leadsTable.clientId, client.id), eq(leadsTable.phone, normalizedPhone)))
      .limit(1);

    let leadId: number;
    if (existingLeads.length > 0) {
      leadId = existingLeads[0].id;
      await db
        .update(leadsTable)
        .set({ lastContactAt: new Date() })
        .where(eq(leadsTable.id, leadId));
    } else {
      const inserted = await db
        .insert(leadsTable)
        .values({
          clientId: client.id,
          phone: normalizedPhone,
          name: ProfileName ?? null,
          source: "direct",
          status: "new",
          lastContactAt: new Date(),
        })
        .returning({ id: leadsTable.id });
      leadId = inserted[0].id;
    }

    // Store raw message event (idempotency record)
    const eventInserted = await db
      .insert(messageEventsTable)
      .values({
        clientId: client.id,
        leadId,
        twilioMessageSid: MessageSid,
        direction: "inbound",
        rawPayload: req.body as Record<string, unknown>,
      })
      .returning({ id: messageEventsTable.id });

    const messageEventId = eventInserted[0].id;

    // Store conversation message
    await db.insert(conversationsTable).values({
      leadId,
      direction: "inbound",
      body: Body,
    });

    // Enqueue processing job
    await db.insert(jobQueueTable).values({
      clientId: client.id,
      leadId,
      messageEventId,
      status: "pending",
      scheduledAt: new Date(),
    });

    req.log.info({ leadId, clientId: client.id, MessageSid }, "Webhook processed — job enqueued");

    // Respond immediately — bot reply is async
    res.status(200).type("text/xml").send(twimlEmpty);
  } catch (err) {
    req.log.error({ err }, "Webhook handler error");
    res.status(200).type("text/xml").send(twimlEmpty);
  }
});

export default router;
