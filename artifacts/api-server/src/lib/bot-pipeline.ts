import twilio from "twilio";
import { db } from "@workspace/db";
import {
  leadsTable,
  conversationsTable,
  appointmentsTable,
  jobQueueTable,
  botProfilesTable,
  clientProfilesTable,
  type Client,
  type Lead,
  type BotProfile,
} from "@workspace/db";
import { eq, and, desc, isNull, sql } from "drizzle-orm";
import { logger } from "./logger";
import { retrieveKnowledge } from "./knowledge";
import { getSettings } from "./settings";
import {
  callGpt,
  type BotResponse,
  type ConversationMessage,
  type Intent,
} from "./gpt-service";

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const MAX_BOT_TURNS_PER_HOUR = 25;

/**
 * Generic fallback profile used when no bot_profiles row exists for the client's industry.
 * Provides safe, language-neutral behaviour for any service business.
 */
const GENERIC_PROFILE: BotProfile = {
  industry: "generic",
  personaRole: "assistant",
  companyContext: "a professional services company",
  primaryGoal: "understand the enquiry and book a callback",
  callbackOffer: {
    de: '"Wann kann ich einen Rückruf für Sie einrichten? Heute oder morgen, vormittags oder nachmittags?"',
    tr: '"Sizi ne zaman geri arayalım? Bugün mü yarın mı — sabah mı öğleden sonra mı?"',
    en: '"When would be a good time for a callback? Today or tomorrow — morning or afternoon?"',
    ar: '"متى يمكنني ترتيب معاودة الاتصال لك؟ اليوم أم غداً — صباحاً أم مساءً؟"',
  },
  gdprAllowedFields: {
    de: "Name, Stadt, allgemeines Anliegen, bevorzugte Rückrufzeit",
    tr: "İsim, şehir, genel kaygı, tercih edilen geri arama zamanı",
    en: "Name, city, general enquiry, preferred callback time",
    ar: "الاسم، المدينة، الاستفسار العام، وقت المعاودة المفضل",
  },
  gdprRedirect: {
    de: "Sensitive Details besprechen wir gerne persönlich",
    tr: "Hassas detayları şahsen konuşabiliriz",
    en: "We'd be happy to discuss sensitive details in person",
    ar: "يسعدنا مناقشة التفاصيل الحساسة شخصياً",
  },
  dataFields: [
    { key: "name", label: { de: "Name", tr: "İsim", en: "Name", ar: "الاسم" } },
    { key: "careType", label: { de: "Art des Anliegens", tr: "Kaygı türü", en: "Nature of enquiry", ar: "طبيعة الاستفسار" } },
    { key: "city", label: { de: "Stadt oder Region", tr: "Şehir veya bölge", en: "City or region", ar: "المدينة أو المنطقة" } },
    { key: "preferredTime", label: { de: "Bevorzugte Rückrufzeit", tr: "Tercih edilen geri arama zamanı", en: "Preferred callback time", ar: "وقت المعاودة المفضل" } },
  ],
  outOfScopeTopics: "medical diagnoses, legal advice, financial advice, emergency situations",
  createdAt: new Date(),
  updatedAt: new Date(),
};

/**
 * Detect an explicit language-switch request from the user message.
 * This runs on EVERY message (not just the first) so the bot honours
 * "can you speak English?" even after the session language is locked.
 * Returns the target language code, or null if no explicit switch detected.
 */
function detectExplicitSwitch(text: string, currentLanguage: string): string | null {
  const t = text.toLowerCase();
  if (currentLanguage !== "en") {
    const wantsEn =
      /\b(speak|write|reply|respond|answer|talk|use|switch\s+to|change\s+to)\s+english\b/.test(t) ||
      /\bin\s+english\b/.test(t) ||
      /\benglish\s+(please|only|instead|now)\b/.test(t) ||
      /\bcan\s+(you|u)\s+(speak|write|use|talk\s+in)\s+english\b/.test(t);
    if (wantsEn) return "en";
  }
  if (currentLanguage !== "de") {
    const wantsDe =
      /\b(auf\s+deutsch|bitte\s+deutsch|speak\s+german|in\s+german|deutsch\s+bitte|what\s+about\s+german|can\s+(you|u)\s+(speak|write|use)\s+german|switch\s+to\s+german|change\s+to\s+german|german\s+please|german\s+only)\b/.test(t);
    if (wantsDe) return "de";
  }
  if (currentLanguage !== "tr") {
    const wantsTr =
      /\b(türkçe|türkce|bitte\s+türkisch|speak\s+turkish|in\s+turkish|türkçe\s+lütfen|what\s+about\s+turkish|can\s+(you|u)\s+(speak|write|use)\s+turkish|switch\s+to\s+turkish)\b/.test(t);
    if (wantsTr) return "tr";
  }
  if (currentLanguage !== "ar") {
    const wantsAr =
      /\b(بالعربي|بالعربية|speak\s+arabic|in\s+arabic|arabic\s+please|can\s+(you|u)\s+(speak|write|use)\s+arabic|switch\s+to\s+arabic|change\s+to\s+arabic)\b/.test(t);
    if (wantsAr) return "ar";
  }
  return null;
}

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

  // Arabic script is unambiguous — any Arabic Unicode character confirms the language.
  // Only activate when the client supports Arabic (primary or secondary).
  const arabicScript = /[\u0600-\u06FF]/;
  if (arabicScript.test(text) && (clientPrimary === "ar" || clientSecondary === "ar")) {
    return "ar";
  }

  // English is detected unconditionally — if the user writes in English we
  // always honour it, even for clients whose primary language is de or tr.
  // German/Turkish are only activated when the client supports them (to avoid
  // false positives from loanwords that appear in multilingual text).
  const englishPatterns =
    /\b(hello|hi there|hey|what|which|how|when|where|services|provide|cost|price|available|appointment|book|treatment|help|please|thanks|thank you|yes|no|okay|can you|do you|are you|i am|i'm|i have|i want|i need|i would|we are|we have|would like|could you|is there|do you have|tell me|more info|information|website|contact|number|email)\b/i;

  if (englishPatterns.test(text)) {
    return "en";
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
  if (typeof data["city"] === "string" && data["city"]) parts.push(`City: ${data["city"]}`);
  if (typeof data["careType"] === "string" && data["careType"])
    parts.push(`Service: ${data["careType"]}`);
  if (typeof data["whoNeedsCare"] === "string" && data["whoNeedsCare"])
    parts.push(`For: ${data["whoNeedsCare"]}`);
  if (preferredTime) parts.push(`CallbackTime: ${preferredTime}`);
  parts.push(`Intent: ${botResponse.intent}`);
  parts.push(`Lang: ${language}`);

  const newLine = parts.join(" | ");
  return lead.conversationSummary ? `${lead.conversationSummary}\n${newLine}` : newLine;
}

/**
 * Backend-controlled intent → lead status mapping.
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

/**
 * Rate-limit reply — language-aware.
 */
function rateLimitReply(language: string): string {
  if (language === "de") return "Wir haben gerade viele Anfragen. Wir rufen Sie so schnell wie möglich zurück.";
  if (language === "tr") return "Şu an çok fazla mesaj geldi. En kısa sürede sizi arayacağız.";
  return "We've received a lot of messages right now. We'll call you back as soon as possible.";
}

/**
 * Empty-KB callback offer — language-aware, uses profile's callback offer where possible.
 */
function emptyKbCallbackOffer(language: string, callbackHours: string, profile: BotProfile): string {
  const offer = profile.callbackOffer[language] ?? profile.callbackOffer["en"] ?? null;
  if (language === "de") {
    return `Hallo! Zu dieser Frage kann ich Ihnen leider gerade keine genaue Auskunft geben. Lassen Sie uns einen Rückruf vereinbaren — soll ich Sie heute oder morgen zurückrufen lassen? Erreichbar sind wir ${callbackHours}.`;
  }
  if (language === "tr") {
    return `Merhaba! Şu anda bu konuda size yardımcı olabilecek bilgiye sahip değilim. Sizi uzmanlarımızla buluşturalım — bugün veya yarın sizi geri aramamızı ister misiniz? Hizmet saatlerimiz: ${callbackHours}.`;
  }
  // English is the universal fallback for all other languages (ar, fr, es, etc.)
  return `Hello! I don't have specific information on that right now. Let me connect you with our team — would you like us to call you back today or tomorrow? We're available ${callbackHours}.`;
}

export interface BotPipelineInput {
  clientRecord: Client;
  leadId: number;
  messageEventId: number;
  userMessage: string;
  userPhone: string;
  twilioSender: string;
}

/**
 * Full bot pipeline:
 * 1. Load lead
 * 2. Language detection / lock
 * 2.5. Load bot persona profile (by client industry, fallback to generic)
 * 3. Rate limit check
 * 4. Load conversation history
 * 5. Knowledge retrieval
 * 6. GPT call (structured JSON: { reply, action, data, intent })
 * 7. Intent-driven action execution
 * 8. Language switch persistence
 * 9. Write outbound conversation + system notification entries
 * 10. Twilio reply
 * 11. Mark job done
 */
export async function runBotPipeline(input: BotPipelineInput): Promise<void> {
  try {
    await executePipeline(input);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error({ err, leadId: input.leadId, messageEventId: input.messageEventId }, "Bot pipeline failed — persisting job failure");

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
          eq(jobQueueTable.messageEventId, input.messageEventId),
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

  // 2. Language detection / lock.
  // First message: detect from content and lock.
  // Subsequent messages: check for explicit switch phrase ("speak English", etc.),
  // then also re-detect implicitly — if the user simply starts writing in a different
  // language (≥4 words) we honour that too, without requiring them to say "speak X".
  // Word-count guard prevents flipping on single loanwords like "yes", "okay", "danke".
  let language = lead.language;
  if (!language) {
    language = detectLanguage(userMessage, clientRecord.languagePrimary, clientRecord.languageSecondary);
    await db
      .update(leadsTable)
      .set({ language, updatedAt: new Date() })
      .where(eq(leadsTable.id, lead.id));
  } else {
    const explicitSwitch = detectExplicitSwitch(userMessage, language);
    if (explicitSwitch) {
      language = explicitSwitch;
      await db
        .update(leadsTable)
        .set({ language, updatedAt: new Date() })
        .where(eq(leadsTable.id, lead.id));
      logger.info({ leadId, newLanguage: language }, "Explicit language switch detected — pipeline re-targeted");
    } else {
      // Implicit switch: re-detect language if message is long enough to be reliable.
      const wordCount = userMessage.trim().split(/\s+/).length;
      if (wordCount >= 4) {
        const implicitLang = detectLanguage(userMessage, clientRecord.languagePrimary, clientRecord.languageSecondary);
        if (implicitLang !== language) {
          language = implicitLang;
          await db
            .update(leadsTable)
            .set({ language, updatedAt: new Date() })
            .where(eq(leadsTable.id, lead.id));
          logger.info({ leadId, newLanguage: language }, "Implicit language switch — user wrote in different language");
        }
      }
    }
  }

  // 2.5. Load bot persona profile by client industry.
  const clientConfig = (clientRecord.config ?? {}) as Record<string, unknown>;
  const industry = typeof clientConfig["industry"] === "string" ? clientConfig["industry"] : null;

  let profile: BotProfile = GENERIC_PROFILE;
  if (industry) {
    const profileRows = await db
      .select()
      .from(botProfilesTable)
      .where(eq(botProfilesTable.industry, industry))
      .limit(1);
    if (profileRows.length > 0) {
      profile = profileRows[0]!;
      logger.info({ leadId, industry, persona: profile.personaRole }, "Bot persona loaded");
    } else {
      logger.warn({ leadId, industry }, "No bot profile found for industry — using generic fallback");
    }
  }

  // Allow client config to override callbackHours (per-client setting)
  const callbackHours =
    typeof clientConfig["callbackHours"] === "string"
      ? clientConfig["callbackHours"]
      : "Mo–Fr 8–18 Uhr";

  // 3. Rate limit
  const allowed = await checkRateLimit(lead);
  if (!allowed) {
    const msg = rateLimitReply(language);
    await sendWhatsAppReply(twilioSender, `whatsapp:${userPhone}`, msg);
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

  // 5a. Load system settings (live chat model) and active client profile (mustNotClaim)
  const [settings, activeProfiles] = await Promise.all([
    getSettings(),
    db
      .select({ profile: clientProfilesTable.profile })
      .from(clientProfilesTable)
      .where(and(eq(clientProfilesTable.clientId, clientRecord.id), eq(clientProfilesTable.status, "active")))
      .orderBy(desc(clientProfilesTable.activatedAt))
      .limit(1),
  ]);

  let mustNotClaim: string[] = [];
  if (activeProfiles.length > 0) {
    try {
      const parsed = JSON.parse(activeProfiles[0]!.profile) as Record<string, unknown>;
      const mnc = parsed["mustNotClaim"];
      if (mnc && typeof mnc === "object" && Array.isArray((mnc as Record<string, unknown>)["value"])) {
        mustNotClaim = ((mnc as Record<string, unknown>)["value"] as unknown[]).filter((v): v is string => typeof v === "string");
      }
    } catch {
      // ignore malformed profile JSON
    }
  }

  // 6. GPT call
  const botResponse = await callGpt({
    language,
    clientName: clientRecord.name,
    callbackHours,
    knowledgeChunks,
    conversationHistory,
    userMessage,
    profile,
    model: settings.liveChatModel,
    mustNotClaim,
  });

  // 6a. Backend post-validation: if knowledge base is empty and GPT did not
  // escalate or book a callback, override with a controlled callback-offer template.
  if (
    knowledgeChunks.length === 0 &&
    botResponse.intent !== "book_callback" &&
    botResponse.intent !== "request_call_now" &&
    botResponse.intent !== "escalate_human"
  ) {
    botResponse.reply = emptyKbCallbackOffer(language, callbackHours, profile);
    botResponse.intent = "out_of_scope";
    botResponse.action = "out_of_scope";
    logger.info({ leadId, language, industry }, "Empty knowledge base — backend override to callback-offer template");
  }

  const now = new Date();
  const data = botResponse.data ?? {};

  // 7. Intent-driven action execution
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

  if (typeof data["name"] === "string" && data["name"] && !lead.name) {
    leadUpdates.name = data["name"] as string;
  }

  const noteParts: string[] = [];
  if (typeof data["careType"] === "string" && data["careType"])
    noteParts.push(`Service: ${String(data["careType"])}`);
  if (typeof data["city"] === "string" && data["city"])
    noteParts.push(`City: ${String(data["city"])}`);
  if (typeof data["whoNeedsCare"] === "string" && data["whoNeedsCare"])
    noteParts.push(`For: ${String(data["whoNeedsCare"])}`);
  if (noteParts.length > 0) {
    leadUpdates.notes = lead.notes
      ? `${lead.notes}\n${noteParts.join(", ")}`
      : noteParts.join(", ");
  }

  const preferredTime =
    typeof data["preferredTime"] === "string" && data["preferredTime"]
      ? (data["preferredTime"] as string)
      : null;

  const notificationInserts: {
    clientId: number;
    leadId: number;
    direction: string;
    body: string;
    intentDetected?: string;
  }[] = [];

  if (botResponse.intent === "book_callback") {
    await db.insert(appointmentsTable).values({
      clientId: clientRecord.id,
      leadId,
      type: "callback",
      preferredTime: preferredTime ?? undefined,
      outcome: "pending",
      notes: `Booked via WhatsApp bot (${language}, ${industry ?? "generic"})`,
    });

    const notifBody =
      language === "tr"
        ? `[SİSTEM] Geri arama randevusu oluşturuldu. Tercih edilen zaman: ${preferredTime ?? "belirtilmedi"}`
        : language === "en"
          ? `[SYSTEM] Callback booked. Preferred time: ${preferredTime ?? "not specified"}`
          : `[SYSTEM] Rückruf gebucht. Gewünschter Zeitpunkt: ${preferredTime ?? "nicht angegeben"}`;

    notificationInserts.push({
      clientId: clientRecord.id,
      leadId,
      direction: "system",
      body: notifBody,
      intentDetected: "book_callback_confirmed",
    });
  }

  if (botResponse.intent === "request_call_now") {
    const urgentNote =
      language === "tr"
        ? "[ACİL] Anında geri arama talep edildi"
        : language === "en"
          ? "[URGENT] Immediate callback requested"
          : "[DRINGEND] Sofortiger Rückruf gewünscht";
    leadUpdates.notes = lead.notes ? `${lead.notes}\n${urgentNote}` : urgentNote;
  }

  // 8. Language switch persistence — accept any valid ISO 639-1 code GPT returns.
  // IMPORTANT: always use the local `language` variable here, NOT lead.language.
  // lead.language holds the stale value from DB load; the local var already
  // reflects any explicit switch (detectExplicitSwitch, lines 336-344) or
  // initial detection. Using lead.language here would clobber those updates.
  const requestedSwitch = data["switchToLanguage"];
  if (
    typeof requestedSwitch === "string" &&
    requestedSwitch !== language &&
    requestedSwitch.length >= 2 &&
    requestedSwitch.length <= 10
  ) {
    language = requestedSwitch;
    logger.info({ leadId, newLanguage: language }, "Language switch persisted per GPT signal");
  }
  leadUpdates.language = language;

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

  // 10. Twilio reply
  await sendWhatsAppReply(twilioSender, `whatsapp:${userPhone}`, botResponse.reply);

  // 11. Mark job done
  await markJobDone(messageEventId);

  logger.info(
    {
      leadId,
      clientId: clientRecord.id,
      industry: industry ?? "generic",
      persona: profile.personaRole,
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
