import twilio from "twilio";
import { db } from "@workspace/db";
import {
  leadsTable,
  conversationsTable,
  appointmentsTable,
  jobQueueTable,
  type Client,
  type Lead,
} from "@workspace/db";
import { eq, and, desc, isNull, sql } from "drizzle-orm";
import { logger } from "./logger";
import { retrieveKnowledge } from "./knowledge";
import {
  callGpt,
  type BotResponse,
  type ConversationMessage,
  type Intent,
} from "./gpt-service";

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const MAX_BOT_TURNS_PER_HOUR = 10;

/**
 * Detect language from user message. Falls back to client primary language.
 * Only truly Turkish-exclusive chars used: ğ,ş,ı,İ,Ğ,Ş
 * NOTE: ü and ö are intentionally NOT in the Turkish char set — they appear in
 * German too (e.g. "für", "können") and would cause false-positive Turkish detection.
 */
function detectLanguage(
  text: string,
  clientPrimary: string,
  clientSecondary?: string | null,
): string {
  const turkishPatterns =
    /\b(merhaba|evet|hay[iı]r|te[sş]ekk[uü]r|nas[iı]l|nerede|ne zaman|bak[iı]m|aile|annem|babam|e[sş]im|yard[iı]m|bilgi|almak|lazım|gereki|için|ile|sizi|size|bizi|beni|ben|tamam|lütfen|bir|var|yok|bu|ne|kim|ka[cç]|nas[iı]l)\b/i;
  const turkishChars = /[ğşıİĞŞ]/;

  const hasTurkish = turkishPatterns.test(text) || turkishChars.test(text);
  if (hasTurkish && (clientPrimary === "tr" || clientSecondary === "tr")) {
    return "tr";
  }

  const germanPatterns =
    /\b(hallo|guten|bitte|danke|wie|wo|wann|pflege|haus|familie|mutter|vater|partner|hilfe|mehr|über|für|mit|ich|sie|wir|haben|bin|ist|und|nicht|auch|aber|noch|schon|sehr|können|möchte|brauche|suche)\b/i;
  const germanChars = /[äöüÄÖÜß]/;

  const hasGerman = germanPatterns.test(text) || germanChars.test(text);
  if (hasGerman && (clientPrimary === "de" || clientSecondary === "de")) {
    return "de";
  }

  return clientPrimary;
}

/**
 * Check and enforce rate limit: max MAX_BOT_TURNS_PER_HOUR turns per lead per hour.
 * Returns true if allowed, false if rate-limited.
 */
async function checkRateLimit(lead: Lead): Promise<boolean> {
  const now = new Date();
  const resetAt = new Date(lead.turnsResetAt);
  const hourElapsed = now.getTime() - resetAt.getTime() > 60 * 60 * 1000;

  if (hourElapsed) {
    await db
      .update(leadsTable)
      .set({ botTurnsThisHour: 1, turnsResetAt: now, updatedAt: now })
      .where(eq(leadsTable.id, lead.id));
    return true;
  }

  if (lead.botTurnsThisHour >= MAX_BOT_TURNS_PER_HOUR) {
    return false;
  }

  await db
    .update(leadsTable)
    .set({ botTurnsThisHour: lead.botTurnsThisHour + 1, updatedAt: now })
    .where(eq(leadsTable.id, lead.id));
  return true;
}

/**
 * Send a WhatsApp message via Twilio REST API with one retry on failure.
 *
 * THROWS on non-recoverable failure so the caller knows the message was not delivered
 * and can persist job failure state accordingly.
 *
 * In TWILIO_SANDBOX=true mode the message is only logged (no throw) since this is
 * intentional: dev runs without real credentials on purpose.
 */
async function sendWhatsAppReply(from: string, to: string, body: string): Promise<void> {
  if (process.env.TWILIO_SANDBOX === "true") {
    logger.info({ from, to, body: body.slice(0, 120) }, "[SANDBOX] Reply logged only (sandbox mode)");
    return;
  }

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    throw new Error("TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN missing — cannot send reply");
  }

  const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  const attempt = () => twilioClient.messages.create({ from, to, body });

  try {
    await attempt();
    logger.info({ from, to }, "Twilio WhatsApp reply sent");
  } catch (firstErr) {
    logger.warn({ err: firstErr }, "Twilio send failed — retrying once");
    try {
      await attempt();
      logger.info({ from, to }, "Twilio reply sent (retry succeeded)");
    } catch (retryErr) {
      // Re-throw so the pipeline's catch block can persist job failure state
      throw new Error(
        `Twilio send failed after retry: ${retryErr instanceof Error ? retryErr.message : String(retryErr)}`,
      );
    }
  }
}

function buildSummary(
  lead: Lead,
  botResponse: BotResponse,
  language: string,
  preferredTime: string | null,
): string {
  const data = botResponse.data ?? {};
  const parts: string[] = [];

  if (typeof data["name"] === "string" && data["name"]) parts.push(`Name: ${data["name"]}`);
  if (typeof data["city"] === "string" && data["city"]) parts.push(`Stadt: ${data["city"]}`);
  if (typeof data["careType"] === "string" && data["careType"])
    parts.push(`Pflege: ${data["careType"]}`);
  if (typeof data["whoNeedsCare"] === "string" && data["whoNeedsCare"])
    parts.push(`Person: ${data["whoNeedsCare"]}`);
  if (preferredTime) parts.push(`Rückrufzeit: ${preferredTime}`);
  parts.push(`Intent: ${botResponse.intent}`);
  parts.push(`Sprache: ${language}`);

  const newLine = parts.join(" | ");
  return lead.conversationSummary ? `${lead.conversationSummary}\n${newLine}` : newLine;
}

/**
 * Backend-controlled intent → lead status mapping.
 * GPT classifies intent; backend deterministically derives DB state from it.
 * This is intentionally decoupled from botResponse.action.
 */
function intentToStatus(intent: Intent, currentStatus: string): string {
  switch (intent) {
    case "book_callback":
      return "callback_booked";
    case "request_call_now":
      return "escalated";
    case "escalate_human":
      return "needs_human";
    case "qualify":
      return currentStatus === "new" ? "qualified" : currentStatus;
    case "out_of_scope":
    case "info_request":
    default:
      return currentStatus;
  }
}

export interface BotPipelineInput {
  clientRecord: Client;
  leadId: number;
  messageEventId: number;
  userMessage: string;
  userPhone: string;    // normalised, no "whatsapp:" prefix
  twilioSender: string; // e.g. "whatsapp:+14155238886"
}

/**
 * Full bot pipeline:
 * 1. Load lead
 * 2. Language detection / lock
 * 3. Rate limit check
 * 4. Load conversation history
 * 5. Knowledge retrieval
 * 6. GPT call (structured JSON: { reply, action, data, intent })
 * 7. Intent-driven action execution (backend-controlled, not action string):
 *    - book_callback  → insert appointment + notification log + set callback_booked
 *    - request_call_now → set status=escalated + urgent note
 *    - escalate_human → set status=needs_human
 *    - out_of_scope   → intentDetected logged on outbound, no status change
 *    - qualify / info_request → update status only if progressing
 * 8. Language switch persistence
 * 9. Write outbound conversation + any system notification entries
 * 10. Twilio reply (throws on failure — propagates to job failure handler)
 * 11. Mark job done — ONLY if step 10 succeeded
 *
 * On ANY unhandled error: job is marked failed, attempts incremented, lastError recorded.
 */
export async function runBotPipeline(input: BotPipelineInput): Promise<void> {
  const { clientRecord, leadId, messageEventId, userMessage, userPhone, twilioSender } = input;

  try {
    await executePipeline(input);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error({ err, leadId, messageEventId }, "Bot pipeline failed — persisting job failure");

    // Persist failure so the job is retryable / visible in ops dashboards
    await db
      .update(jobQueueTable)
      .set({
        status: "failed",
        lastError: msg.slice(0, 1000),
        attempts: sql`${jobQueueTable.attempts} + 1`,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(jobQueueTable.messageEventId, messageEventId),
          eq(jobQueueTable.status, "pending"),
        ),
      );
  }
}

async function executePipeline(input: BotPipelineInput): Promise<void> {
  const { clientRecord, leadId, messageEventId, userMessage, userPhone, twilioSender } = input;

  // 1. Load lead
  const leads = await db
    .select()
    .from(leadsTable)
    .where(and(eq(leadsTable.id, leadId), eq(leadsTable.clientId, clientRecord.id)))
    .limit(1);

  if (leads.length === 0) {
    throw new Error(`Lead ${leadId} not found for client ${clientRecord.id}`);
  }

  const lead = leads[0]!;

  // 2. Language detection — detect on first message, lock thereafter.
  let language = lead.language;
  if (!language) {
    language = detectLanguage(userMessage, clientRecord.languagePrimary, clientRecord.languageSecondary);
    await db
      .update(leadsTable)
      .set({ language, updatedAt: new Date() })
      .where(eq(leadsTable.id, lead.id));
  }

  // 3. Rate limit
  const allowed = await checkRateLimit(lead);
  if (!allowed) {
    const msg =
      language === "tr"
        ? "Şu an çok fazla mesaj geldi. En kısa sürede sizi arayacağız."
        : "Wir haben gerade viele Anfragen. Wir rufen Sie so schnell wie möglich zurück.";
    await sendWhatsAppReply(twilioSender, `whatsapp:${userPhone}`, msg);
    // Persist outbound conversation row so audit trail is complete
    await db.insert(conversationsTable).values({
      clientId: clientRecord.id,
      leadId,
      direction: "outbound",
      body: msg,
      intentDetected: "rate_limited",
    });
    await db
      .update(leadsTable)
      .set({ lastContactAt: new Date(), updatedAt: new Date() })
      .where(eq(leadsTable.id, leadId));
    logger.warn({ leadId }, "Rate limit hit — pipeline short-circuited");
    // Rate-limit short-circuit: mark done (reply was sent, nothing to retry)
    await markJobDone(messageEventId);
    return;
  }

  // 4. Conversation history (last 20 turns, chronological, excluding current inbound msg)
  const rawHistory = await db
    .select({ direction: conversationsTable.direction, body: conversationsTable.body })
    .from(conversationsTable)
    .where(
      and(
        eq(conversationsTable.leadId, leadId),
        eq(conversationsTable.clientId, clientRecord.id),
        isNull(conversationsTable.deletedAt),
      ),
    )
    .orderBy(desc(conversationsTable.createdAt))
    .limit(21);

  const conversationHistory: ConversationMessage[] = rawHistory
    .reverse()
    .slice(0, -1)
    .map((h) => ({
      role: h.direction === "inbound" ? ("user" as const) : ("assistant" as const),
      content: h.body,
    }));

  // 5. Knowledge retrieval
  const knowledgeChunks = await retrieveKnowledge(clientRecord.id, language, userMessage);

  // 6. GPT call
  const config = (clientRecord.config ?? {}) as { callbackHours?: string };
  const callbackHours = config.callbackHours ?? "Mo–Fr 8–18 Uhr";

  const botResponse = await callGpt({
    language,
    clientName: clientRecord.name,
    callbackHours,
    knowledgeChunks,
    conversationHistory,
    userMessage,
  });

  // 6a. Backend post-validation: if knowledge base is empty and GPT did not
  // escalate or book a callback, override reply with a controlled callback-offer
  // template. This prevents hallucinated answers when there is no grounding data.
  if (
    knowledgeChunks.length === 0 &&
    botResponse.intent !== "book_callback" &&
    botResponse.intent !== "request_call_now" &&
    botResponse.intent !== "escalate_human"
  ) {
    const callbackOffer =
      language === "tr"
        ? `Merhaba! Şu anda bu konuda size yardımcı olabilecek bilgiye sahip değilim. Sizi uzmanlarımızla buluşturalım — bugün veya yarın sizi geri aramamızı ister misiniz? Hizmet saatlerimiz: ${callbackHours}.`
        : `Hallo! Zu dieser Frage kann ich Ihnen leider gerade keine genaue Auskunft geben. Lassen Sie uns einen Rückruf vereinbaren — soll ich Sie heute oder morgen zurückrufen lassen? Erreichbar sind wir ${callbackHours}.`;
    botResponse.reply = callbackOffer;
    botResponse.intent = "out_of_scope";
    botResponse.action = "out_of_scope";
    logger.info({ leadId, language }, "Empty knowledge base — backend override to callback-offer template");
  }

  const now = new Date();
  const data = botResponse.data ?? {};

  // 7. Intent-driven action execution — status derived from INTENT (backend-controlled)
  const newStatus = intentToStatus(botResponse.intent, lead.status);

  const leadUpdates: Partial<{
    status: string;
    name: string;
    language: string;
    notes: string;
    conversationSummary: string;
    lastContactAt: Date;
    updatedAt: Date;
  }> = { lastContactAt: now, updatedAt: now };

  if (newStatus !== lead.status) leadUpdates.status = newStatus;

  // Capture name on first disclosure
  if (typeof data["name"] === "string" && data["name"] && !lead.name) {
    leadUpdates.name = data["name"] as string;
  }

  // Accumulate structured notes
  const noteParts: string[] = [];
  if (typeof data["careType"] === "string" && data["careType"])
    noteParts.push(`Pflegebedarf: ${String(data["careType"])}`);
  if (typeof data["city"] === "string" && data["city"])
    noteParts.push(`Stadt: ${String(data["city"])}`);
  if (typeof data["whoNeedsCare"] === "string" && data["whoNeedsCare"])
    noteParts.push(`Person: ${String(data["whoNeedsCare"])}`);
  if (noteParts.length > 0) {
    leadUpdates.notes = lead.notes
      ? `${lead.notes}\n${noteParts.join(", ")}`
      : noteParts.join(", ");
  }

  const preferredTime =
    typeof data["preferredTime"] === "string" && data["preferredTime"]
      ? (data["preferredTime"] as string)
      : null;

  // System notification entries (inserted before outbound reply)
  const notificationInserts: {
    clientId: number;
    leadId: number;
    direction: string;
    body: string;
    intentDetected?: string;
  }[] = [];

  // -- book_callback: deterministic appointment write + notification log --
  if (botResponse.intent === "book_callback") {
    await db.insert(appointmentsTable).values({
      clientId: clientRecord.id,
      leadId,
      type: "callback",
      preferredTime: preferredTime ?? undefined,
      outcome: "pending",
      notes: `Gebucht via WhatsApp-Bot (${language})`,
    });

    const notifBody =
      language === "tr"
        ? `[SİSTEM] Geri arama randevusu oluşturuldu. Tercih edilen zaman: ${preferredTime ?? "belirtilmedi"}`
        : `[SYSTEM] Rückruf gebucht. Gewünschter Zeitpunkt: ${preferredTime ?? "nicht angegeben"}`;

    notificationInserts.push({
      clientId: clientRecord.id,
      leadId,
      direction: "system",
      body: notifBody,
      intentDetected: "book_callback_confirmed",
    });
  }

  // -- request_call_now: urgent flag backed by schema status + note --
  if (botResponse.intent === "request_call_now") {
    const urgentNote =
      language === "tr"
        ? "[ACİL] Anında geri arama talep edildi"
        : "[DRINGEND] Sofortiger Rückruf gewünscht";
    leadUpdates.notes = lead.notes ? `${lead.notes}\n${urgentNote}` : urgentNote;
  }

  // 8. Language switch persistence
  const requestedSwitch = data["switchToLanguage"];
  if (
    typeof requestedSwitch === "string" &&
    requestedSwitch !== language &&
    (requestedSwitch === "de" || requestedSwitch === "tr")
  ) {
    language = requestedSwitch;
    leadUpdates.language = language;
    logger.info({ leadId, newLanguage: language }, "Language switch persisted per user request");
  } else {
    leadUpdates.language = lead.language ?? language;
  }

  leadUpdates.conversationSummary = buildSummary(lead, botResponse, language, preferredTime);

  // All DB side-effects before Twilio send
  await db.update(leadsTable).set(leadUpdates).where(eq(leadsTable.id, leadId));

  // 9. Conversation entries
  for (const entry of notificationInserts) {
    await db.insert(conversationsTable).values(entry);
  }

  await db.insert(conversationsTable).values({
    clientId: clientRecord.id,
    leadId,
    direction: "outbound",
    body: botResponse.reply,
    intentDetected: botResponse.intent,
  });

  // 10. Twilio reply — THROWS on failure; job will be marked failed by outer catch
  await sendWhatsAppReply(twilioSender, `whatsapp:${userPhone}`, botResponse.reply);

  // 11. Mark job done — ONLY reached if step 10 succeeded
  await markJobDone(messageEventId);

  logger.info(
    {
      leadId,
      clientId: clientRecord.id,
      intent: botResponse.intent,
      action: botResponse.action,
      newStatus,
      language,
    },
    "Bot pipeline complete",
  );
}

async function markJobDone(messageEventId: number): Promise<void> {
  await db
    .update(jobQueueTable)
    .set({ status: "done", processedAt: new Date(), updatedAt: new Date() })
    .where(
      and(
        eq(jobQueueTable.messageEventId, messageEventId),
        eq(jobQueueTable.status, "pending"),
      ),
    );
}
