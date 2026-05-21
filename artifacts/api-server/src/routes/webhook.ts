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
import { eq, and, desc } from "drizzle-orm";
import type { TwilioWebhookPayload } from "@workspace/api-zod";
import { runBotPipeline } from "../lib/bot-pipeline";

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
  if (IS_DEV_SANDBOX) return true;

  if (!TWILIO_AUTH_TOKEN) return false;

  const signature = req.headers["x-twilio-signature"] as string | undefined;
  if (!signature) return false;

  const protocol = (req.headers["x-forwarded-proto"] as string) ?? req.protocol;
  const host = req.headers["host"] ?? "";
  const url = `${protocol}://${host}${req.originalUrl}`;

  return twilio.validateRequest(
    TWILIO_AUTH_TOKEN,
    signature,
    url,
    req.body as Record<string, string>,
  );
}

router.post("/webhook/twilio", async (req: Request, res: Response) => {
  const twimlEmpty = '<?xml version="1.0" encoding="UTF-8"?><Response></Response>';

  if (!validateTwilioSignature(req)) {
    req.log.warn("Invalid or missing Twilio signature — rejecting request");
    res.status(403).json({ error: "Invalid Twilio signature" });
    return;
  }

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

    // Resolve client — slug tag takes priority over number for shared-number multi-tenant routing.
    // A wa.me deep link pre-fills "[slug] " so we can route correctly even when all clients
    // share one Twilio number. Fall back to number-only lookup for direct/non-widget messages.
    const slugTagMatch = Body.match(/^\[([a-z0-9-]+)\]\s*/i);
    const slugTag = slugTagMatch?.[1]?.toLowerCase() ?? null;

    let clientRecord: typeof clientsTable.$inferSelect | undefined;

    if (slugTag) {
      const bySlug = await db
        .select()
        .from(clientsTable)
        .where(and(eq(clientsTable.slug, slugTag), eq(clientsTable.isActive, true)))
        .limit(1);
      clientRecord = bySlug[0];
      if (clientRecord) {
        req.log.info({ slug: slugTag, clientId: clientRecord.id }, "Client resolved via slug tag");
      }
    }

    if (!clientRecord) {
      // Session continuity: if this phone number already has a lead, route to
      // that client so follow-up messages in the same WhatsApp thread don't
      // need to repeat the [slug] tag. Use the most recently active lead.
      const normalizedFromPhone = From.replace("whatsapp:", "");
      const existingLead = await db
        .select({ clientId: leadsTable.clientId })
        .from(leadsTable)
        .where(eq(leadsTable.phone, normalizedFromPhone))
        .orderBy(desc(leadsTable.lastContactAt))
        .limit(1);

      if (existingLead.length > 0) {
        const byExistingLead = await db
          .select()
          .from(clientsTable)
          .where(and(eq(clientsTable.id, existingLead[0]!.clientId), eq(clientsTable.isActive, true)))
          .limit(1);
        clientRecord = byExistingLead[0];
        if (clientRecord) {
          req.log.info(
            { phone: normalizedFromPhone, clientId: clientRecord.id },
            "Client resolved via existing lead session",
          );
        }
      }
    }

    if (!clientRecord) {
      const byNumber = await db
        .select()
        .from(clientsTable)
        .where(and(eq(clientsTable.twilioSender, To), eq(clientsTable.isActive, true)))
        .limit(1);
      clientRecord = byNumber[0];
    }

    if (!clientRecord) {
      req.log.warn({ To, slugTag }, "No active client found for Twilio sender");
      res.status(200).type("text/xml").send(twimlEmpty);
      return;
    }

    // Strip the routing slug tag from the message before storing / passing to the bot
    const cleanBody = slugTag ? Body.replace(/^\[[a-z0-9-]+\]\s*/i, "").trim() : Body;

    // Upsert lead by phone + client (tenant-scoped)
    const normalizedPhone = From.replace("whatsapp:", "");
    const existingLeads = await db
      .select()
      .from(leadsTable)
      .where(and(eq(leadsTable.clientId, clientRecord.id), eq(leadsTable.phone, normalizedPhone)))
      .limit(1);

    let leadId: number;
    if (existingLeads.length > 0) {
      leadId = existingLeads[0]!.id;
      await db
        .update(leadsTable)
        .set({ lastContactAt: new Date() })
        .where(eq(leadsTable.id, leadId));
    } else {
      const inserted = await db
        .insert(leadsTable)
        .values({
          clientId: clientRecord.id,
          phone: normalizedPhone,
          name: ProfileName ?? null,
          source: "whatsapp",
          status: "new",
          lastContactAt: new Date(),
        })
        .returning({ id: leadsTable.id });
      leadId = inserted[0]!.id;
    }

    // Store raw message event (idempotency anchor)
    const eventInserted = await db
      .insert(messageEventsTable)
      .values({
        clientId: clientRecord.id,
        leadId,
        twilioMessageSid: MessageSid,
        direction: "inbound",
        rawPayload: req.body as Record<string, unknown>,
      })
      .returning({ id: messageEventsTable.id });

    const messageEventId = eventInserted[0]!.id;

    // Store inbound conversation message (slug tag already stripped from cleanBody)
    await db.insert(conversationsTable).values({
      clientId: clientRecord.id,
      leadId,
      direction: "inbound",
      body: cleanBody,
    });

    // Enqueue job (pending) — will be marked done by the pipeline
    await db.insert(jobQueueTable).values({
      clientId: clientRecord.id,
      leadId,
      messageEventId,
      status: "pending",
      scheduledAt: new Date(),
    });

    req.log.info(
      { leadId, clientId: clientRecord.id, MessageSid },
      "Webhook ingested — starting bot pipeline",
    );

    // Return 200 immediately (Twilio requires fast ack)
    // The actual WhatsApp reply is sent via Twilio REST API inside the pipeline
    res.status(200).type("text/xml").send(twimlEmpty);

    // Run bot pipeline asynchronously after response is sent
    runBotPipeline({
      clientRecord,
      leadId,
      messageEventId,
      userMessage: cleanBody,
      userPhone: normalizedPhone,
      twilioSender: To,
    }).catch((err: unknown) => {
      req.log.error({ err, leadId, clientId: clientRecord.id }, "Bot pipeline error");
    });
  } catch (err) {
    req.log.error({ err }, "Webhook handler error");
    res.status(200).type("text/xml").send(twimlEmpty);
  }
});

export default router;
