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
 * Heuristic: check for Turkish-specific characters and common words.
 */
function detectLanguage(
  text: string,
  clientPrimary: string,
  clientSecondary?: string | null,
): string {
  const turkishPatterns =
    /\b(merhaba|evet|hay[iı]r|te[sş]ekk[uü]r|nas[iı]l|nerede|ne zaman|bak[iı]m|aile|annem|babam|e[sş]im|yard[iı]m|bilgi|almak|lazım|gereki|için|ile|sizi|size|bizi|beni|ben|tamam|evet|lütfen|bir|var|yok|bu|ne|kim|kaç|nasıl)\b/i;
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
async function sendWhatsAppReply(
  from: string,
  to: string,
  body: string,
): Promise<void> {
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
  userPhone: string;   // normalised, no "whatsapp:" prefix
  twilioSender: string; // e.g. "whatsapp:+14155238886"
}

/**
 * Full bot pipeline:
 * 1. Load lead
 * 2. Language detection / lock
 * 3. Rate limit check
 * 4. Load conversation history
 * 5. Knowledge retrieval
 * 6. GPT call (structured JSON response)
 * 7. Action execution (DB writes + lead status update)
 * 8. Write outbound conversation message
 * 9. Send Twilio reply
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

  // 2. Language detection — detect on first message, lock thereafter
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
    .limit(21); // +1 so we can drop the just-stored inbound message

  const conversationHistory: ConversationMessage[] = rawHistory
    .reverse()
    .slice(0, -1) // drop last item (current inbound message already in DB)
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

  // Mark the job as done
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
  }> = { lastContactAt: now, updatedAt: now, language };

  const data = botResponse.data ?? {};

  // Capture name if first time
  if (typeof data["name"] === "string" && data["name"] && !lead.name) {
    leadUpdates.name = data["name"] as string;
  }

  // Accumulate notes from captured structured data
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

  switch (botResponse.action) {
    case "book_callback": {
      await db.insert(appointmentsTable).values({
        clientId: clientRecord.id,
        leadId,
        type: "callback",
        preferredTime: preferredTime ?? undefined,
        outcome: "pending",
        notes: `Gebucht via WhatsApp-Bot (${language})`,
      });
      newStatus = "callback_booked";
      break;
    }
    case "request_call_now": {
      if (newStatus !== "escalated") newStatus = "qualified";
      leadUpdates.notes = lead.notes
        ? `${lead.notes}\n[DRINGEND: sofortiger Rückruf gewünscht]`
        : "[DRINGEND: sofortiger Rückruf gewünscht]";
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

  await db.update(leadsTable).set(leadUpdates).where(eq(leadsTable.id, leadId));

  // 8. Write outbound conversation message
  await db.insert(conversationsTable).values({
    clientId: clientRecord.id,
    leadId,
    direction: "outbound",
    body: botResponse.reply,
    intentDetected: botResponse.intent,
  });

  // 9. Send Twilio reply
  await sendWhatsAppReply(twilioSender, `whatsapp:${userPhone}`, botResponse.reply);

  logger.info(
    {
      leadId,
      clientId: clientRecord.id,
      intent: botResponse.intent,
      action: botResponse.action,
      newStatus,
    },
    "Bot pipeline complete",
  );
}
