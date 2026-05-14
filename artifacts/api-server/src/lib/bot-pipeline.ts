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
import { eq, and, desc, isNull } from "drizzle-orm";
import { logger } from "./logger";
import { retrieveKnowledge } from "./knowledge";
import { callGpt, type BotResponse, type ConversationMessage } from "./gpt-service";

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const MAX_BOT_TURNS_PER_HOUR = 10;

/**
 * Detect language from user message. Falls back to client primary language.
 * Uses word patterns and Turkish-exclusive chars (ğ,ş,ı,İ,Ğ,Ş).
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
  // Only truly Turkish-exclusive chars — ü and ö are shared with German so excluded
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
 */
async function sendWhatsAppReply(from: string, to: string, body: string): Promise<void> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    if (process.env.TWILIO_SANDBOX === "true") {
      logger.info({ from, to, body: body.slice(0, 120) }, "[SANDBOX] Twilio creds not set — reply logged only");
      return;
    }
    logger.error("TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN missing — cannot send reply");
    return;
  }

  const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  const attempt = () => twilioClient.messages.create({ from, to, body });

  try {
    await attempt();
    logger.info({ from, to }, "Twilio WhatsApp reply sent");
  } catch (err) {
    logger.warn({ err }, "Twilio send failed — retrying once");
    try {
      await attempt();
      logger.info({ from, to }, "Twilio reply sent (retry succeeded)");
    } catch (retryErr) {
      logger.error({ err: retryErr }, "Twilio send failed after retry — reply not delivered");
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
  if (typeof data["careType"] === "string" && data["careType"]) parts.push(`Pflege: ${data["careType"]}`);
  if (typeof data["whoNeedsCare"] === "string" && data["whoNeedsCare"]) parts.push(`Person: ${data["whoNeedsCare"]}`);
  if (preferredTime) parts.push(`Rückrufzeit: ${preferredTime}`);
  parts.push(`Intent: ${botResponse.intent}`);
  parts.push(`Sprache: ${language}`);

  const newLine = parts.join(" | ");
  return lead.conversationSummary ? `${lead.conversationSummary}\n${newLine}` : newLine;
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
 * 2. Language detection / lock (explicit user switch request honoured)
 * 3. Rate limit check
 * 4. Load conversation history
 * 5. Knowledge retrieval
 * 6. GPT call (structured JSON: { reply, action, data, intent })
 * 7. Action execution:
 *    - book_callback → insert appointment + write notification log + set callback_booked
 *    - request_call_now → set status=escalated + urgent note
 *    - escalate_human → set status=needs_human
 * 8. Language switch persistence (if GPT indicates user explicitly requested switch)
 * 9. Write outbound conversation + lead summary update
 * 10. Twilio reply
 */
export async function runBotPipeline(input: BotPipelineInput): Promise<void> {
  const { clientRecord, leadId, messageEventId, userMessage, userPhone, twilioSender } = input;

  // 1. Load lead
  const leads = await db
    .select()
    .from(leadsTable)
    .where(and(eq(leadsTable.id, leadId), eq(leadsTable.clientId, clientRecord.id)))
    .limit(1);

  if (leads.length === 0) {
    logger.error({ leadId }, "Lead not found in bot pipeline");
    return;
  }

  const lead = leads[0]!;

  // 2. Language detection — detect on first message, lock thereafter.
  // An explicit switch request (detected by GPT later) will update the lock.
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
    logger.warn({ leadId }, "Rate limit hit — pipeline short-circuited");
    return;
  }

  // 4. Conversation history (last 20 turns, chronological, excluding the current inbound msg)
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
    .limit(21); // +1 to drop current inbound message

  const conversationHistory: ConversationMessage[] = rawHistory
    .reverse()
    .slice(0, -1) // drop last item (current inbound message already stored)
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

  // 7. Action execution
  const now = new Date();

  // Mark the pending job as done
  await db
    .update(jobQueueTable)
    .set({ status: "done", processedAt: now, updatedAt: now })
    .where(
      and(
        eq(jobQueueTable.messageEventId, messageEventId),
        eq(jobQueueTable.status, "pending"),
      ),
    );

  let newStatus = lead.status;
  const leadUpdates: Partial<{
    status: string;
    name: string;
    language: string;
    notes: string;
    conversationSummary: string;
    lastContactAt: Date;
    updatedAt: Date;
  }> = { lastContactAt: now, updatedAt: now };

  const data = botResponse.data ?? {};

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
    typeof data["preferredTime"] === "string" ? (data["preferredTime"] as string) : null;

  // Conversations to insert (collected, inserted in one batch at end)
  const conversationInserts: {
    clientId: number;
    leadId: number;
    direction: string;
    body: string;
    intentDetected?: string;
  }[] = [];

  switch (botResponse.action) {
    case "book_callback": {
      // Write appointment record
      await db.insert(appointmentsTable).values({
        clientId: clientRecord.id,
        leadId,
        type: "callback",
        preferredTime: preferredTime ?? undefined,
        outcome: "pending",
        notes: `Gebucht via WhatsApp-Bot (${language})`,
      });

      // Notification/audit log: system entry in conversations table
      const notifBody =
        language === "tr"
          ? `[SİSTEM] Geri arama randevusu oluşturuldu. Tercih edilen zaman: ${preferredTime ?? "belirtilmedi"}`
          : `[SYSTEM] Rückruf gebucht. Gewünschter Zeitpunkt: ${preferredTime ?? "nicht angegeben"}`;
      conversationInserts.push({
        clientId: clientRecord.id,
        leadId,
        direction: "system",
        body: notifBody,
        intentDetected: "book_callback_confirmed",
      });

      newStatus = "callback_booked";
      break;
    }

    case "request_call_now": {
      // Explicit urgent flag: set status to "escalated" (schema-backed urgency state)
      newStatus = "escalated";
      const urgentNote = "[DRINGEND] Sofortiger Rückruf gewünscht";
      leadUpdates.notes = lead.notes ? `${lead.notes}\n${urgentNote}` : urgentNote;
      break;
    }

    case "escalate_human": {
      newStatus = "needs_human";
      break;
    }

    default: {
      if (botResponse.intent === "qualify" && newStatus === "new") {
        newStatus = "qualified";
      }
    }
  }

  if (newStatus !== lead.status) leadUpdates.status = newStatus;
  leadUpdates.conversationSummary = buildSummary(lead, botResponse, language, preferredTime);

  // 8. Language switch persistence
  // GPT sets data.switchToLanguage only when the user EXPLICITLY requested a switch.
  // We persist this to leads.language so all subsequent turns use the new language.
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
    // Keep the existing locked language
    leadUpdates.language = lead.language ?? language;
  }

  await db.update(leadsTable).set(leadUpdates).where(eq(leadsTable.id, leadId));

  // 9. Write outbound conversation + any notification entries
  conversationInserts.push({
    clientId: clientRecord.id,
    leadId,
    direction: "outbound",
    body: botResponse.reply,
    intentDetected: botResponse.intent,
  });

  for (const entry of conversationInserts) {
    await db.insert(conversationsTable).values(entry);
  }

  // 10. Twilio reply
  await sendWhatsAppReply(twilioSender, `whatsapp:${userPhone}`, botResponse.reply);

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
