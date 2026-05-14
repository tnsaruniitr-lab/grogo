import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import twilio from "twilio";
import { db } from "@workspace/db";
import {
  clientsTable,
  leadsTable,
  messageEventsTable,
  conversationsTable,
  jobQueueTable,
} from "@workspace/db";
import { eq, and } from "drizzle-orm";
import type { TwilioWebhookPayload } from "@workspace/api-zod";

const router: IRouter = Router();

// Zod schema for Twilio form-encoded webhook payload.
// NOTE: Orval does not generate Zod schemas for application/x-www-form-urlencoded
// request bodies — only for JSON bodies. A local Zod schema is therefore required
// here. The schema is typed as z.ZodType<TwilioWebhookPayload> so it stays in
// lock-step with the generated TypeScript interface from the OpenAPI spec.
const TwilioPayloadSchema: z.ZodType<TwilioWebhookPayload> = z.object({
  MessageSid: z.string().min(1),
  From: z.string().min(1),
  To: z.string().min(1),
  Body: z.string(),
  WaId: z.string().optional(),
  ProfileName: z.string().optional(),
  NumMedia: z.string().optional(),
});

const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const IS_DEV_SANDBOX = process.env.TWILIO_SANDBOX === "true";

function validateTwilioSignature(req: Request): boolean {
  // Explicit sandbox bypass only when TWILIO_SANDBOX=true
  if (IS_DEV_SANDBOX) return true;

  // In all other cases — including when token is missing — fail closed
  if (!TWILIO_AUTH_TOKEN) {
    return false;
  }

  const signature = req.headers["x-twilio-signature"] as string | undefined;
  if (!signature) return false;

  const protocol = (req.headers["x-forwarded-proto"] as string) ?? req.protocol;
  const host = req.headers["host"] ?? "";
  const url = `${protocol}://${host}${req.originalUrl}`;

  return twilio.validateRequest(TWILIO_AUTH_TOKEN, signature, url, req.body as Record<string, string>);
}

router.post("/webhook/twilio", async (req: Request, res: Response) => {
  const twimlEmpty = '<?xml version="1.0" encoding="UTF-8"?><Response></Response>';

  // Security: validate Twilio signature (fails closed when token missing)
  if (!validateTwilioSignature(req)) {
    req.log.warn("Invalid or missing Twilio signature — rejecting request");
    res.status(403).json({ error: "Invalid Twilio signature" });
    return;
  }

  // Validate payload shape with Zod before any processing
  const payloadResult = TwilioPayloadSchema.safeParse(req.body);
  if (!payloadResult.success) {
    req.log.warn({ issues: payloadResult.error.issues }, "Twilio webhook payload failed validation");
    res.status(200).type("text/xml").send(twimlEmpty);
    return;
  }

  const { MessageSid, From, To, Body, ProfileName } = payloadResult.data;

  try {
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

    // Upsert lead by phone + client (tenant-scoped)
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

    // Store raw message event (idempotency anchor)
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

    // Store conversation message (tenant-scoped)
    await db.insert(conversationsTable).values({
      clientId: client.id,
      leadId,
      direction: "inbound",
      body: Body,
    });

    // Enqueue async processing job
    await db.insert(jobQueueTable).values({
      clientId: client.id,
      leadId,
      messageEventId,
      status: "pending",
      scheduledAt: new Date(),
    });

    req.log.info({ leadId, clientId: client.id, MessageSid }, "Webhook processed — job enqueued");

    // Return immediately — all GPT/bot work is async
    res.status(200).type("text/xml").send(twimlEmpty);
  } catch (err) {
    req.log.error({ err }, "Webhook handler error");
    res.status(200).type("text/xml").send(twimlEmpty);
  }
});

export default router;
