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
} from "./gpt-service";
import { resolveAsset, type AssetResolverResult } from "./asset-resolver";

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

// Module-level singleton — avoids re-initialising the HTTP client on every message.
// Lazily created on first send so missing credentials only fail at send time, not startup.
let _twilioClient: ReturnType<typeof twilio> | null = null;
function getTwilioClient(): ReturnType<typeof twilio> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    throw new Error("TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN missing — cannot send reply");
  }
  if (!_twilioClient) {
    _twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  }
  return _twilioClient;
}
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
    { key: "serviceType", label: { de: "Gewünschte Leistung", tr: "İstenen hizmet", en: "Requested service", ar: "الخدمة المطلوبة" } },
    { key: "appointmentDate", label: { de: "Wunschtermin (Datum)", tr: "Tercih edilen tarih", en: "Preferred appointment date", ar: "تاريخ الموعد المفضل" } },
    { key: "appointmentTime", label: { de: "Wunschtermin (Uhrzeit)", tr: "Tercih edilen saat", en: "Preferred appointment time", ar: "وقت الموعد المفضل" } },
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
  if (process.env.TWILIO_LOG_ONLY === "true") {
    logger.info({ from, to, body: body.slice(0, 120) }, "[SANDBOX] Reply logged only (sandbox mode)");
    return;
  }

  const twilioClient = getTwilioClient();
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

// Send a WhatsApp media message (image or PDF) so the file renders inline in
// the chat rather than appearing as a plain URL. Called after the text reply
// for [ASSET:image] and [ASSET:pdf] entries when the bot's reply references them.
// Failure is non-fatal — the text reply (with the URL) is already delivered.
async function sendWhatsAppMedia(from: string, to: string, mediaUrl: string): Promise<void> {
  if (process.env.TWILIO_LOG_ONLY === "true") {
    logger.info({ from, to, mediaUrl }, "[SANDBOX] Media message logged only (sandbox mode)");
    return;
  }

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) return;

  try {
    const twilioClient = getTwilioClient();
    await twilioClient.messages.create({ from, to, mediaUrl: [mediaUrl] });
    logger.info({ from, to, mediaUrl }, "Twilio WhatsApp media sent (inline rendering)");
  } catch (err) {
    logger.warn({ err, mediaUrl }, "WhatsApp media send failed — text reply still delivered");
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

type ResolvedAction =
  | "book_service"
  | "book_online_consultation"
  | "book_walkin_consultation"
  | "book_callback"
  | "escalate_human"
  | "qualify";

/**
 * Deterministic rule engine — decides the final action from GPT-extracted data
 * fields. GPT's own action suggestion is advisory only; this function is the
 * authority. Same inputs always produce the same output.
 */
function resolveAction(data: BotResponse["data"], turnCount: number, intent: string): ResolvedAction {
  const d = data ?? {};
  const urgency        = d["handoffReason"] === "urgent_call_now";
  const requestedHuman = d["requestedHuman"] === true;
  const confirmed      = d["bookingConfirmed"] === true;
  const service        = typeof d["serviceRequested"] === "string" && d["serviceRequested"] ? d["serviceRequested"] : null;
  const hasTiming      =
    (typeof d["preferredTime"] === "string"    && !!d["preferredTime"]) ||
    (typeof d["appointmentDate"] === "string"  && !!d["appointmentDate"]) ||
    (typeof d["appointmentTime"] === "string"  && !!d["appointmentTime"]);
  const mode = d["consultationMode"]; // "online" | "walkin" | null | undefined

  if (urgency)                                              return "escalate_human";
  if (requestedHuman)                                       return "escalate_human";
  if (confirmed && service && hasTiming)                    return "book_service";
  if (confirmed && mode === "online")                       return "book_online_consultation";
  if (confirmed && mode === "walkin")                       return "book_walkin_consultation";
  // Only auto-escalate to callback after 6 turns, and never when the user is
  // actively asking for information (info_request) — interrupting an info exchange
  // with a callback push ignores what the user actually wants.
  if (turnCount >= 6 && !service && intent !== "info_request") return "book_callback";
  return "qualify";
}

/**
 * Maps resolved backend action → lead status string.
 * Uses the backend rule engine result, not GPT's suggested action/intent.
 */
function actionToStatus(resolvedAction: ResolvedAction, currentStatus: string): string {
  switch (resolvedAction) {
    case "book_service":              return "appointment_booked";
    case "book_online_consultation":  return "consultation_booked";
    case "book_walkin_consultation":  return "consultation_booked";
    case "book_callback":             return "callback_booked";
    case "escalate_human":            return "needs_human";
    case "qualify":
      return currentStatus === "new" ? "qualified" : currentStatus;
    default:
      return currentStatus;
  }
}

/**
 * Backend-guaranteed confirmation tail appended to the GPT reply for every
 * resolved booking or escalation action. Ensures the customer-visible WhatsApp
 * text always agrees with what the backend actually wrote to the DB — GPT
 * wording and DB action can never drift apart.
 *
 * Kept intentionally short: GPT already wrote the main reply; this is just an
 * unambiguous receipt line.
 */
function buildActionConfirmation(
  resolvedAction: ResolvedAction,
  language: string,
  serviceRequested: string | null,
  preferredTime: string | null,
): string | null {
  const timeStr = preferredTime ? ` (${preferredTime})` : "";

  switch (resolvedAction) {
    case "book_service": {
      const svc = serviceRequested ?? "";
      const svcStr = svc ? ` — ${svc}` : "";
      return language === "tr"
        ? `✅ Randevunuz alındı${svcStr}${timeStr}. Ekibimiz en kısa sürede sizi arayacak.`
        : language === "ar"
          ? `✅ تم تسجيل حجزك${svcStr}${timeStr}. سيتواصل فريقنا معك قريباً.`
          : language === "de"
            ? `✅ Ihre Buchung${svcStr}${timeStr} wurde erfasst. Wir melden uns in Kürze.`
            : `✅ Your booking${svcStr}${timeStr} has been received. We'll be in touch shortly.`;
    }
    case "book_online_consultation":
      return language === "tr"
        ? `✅ Online görüşme talebiniz alındı${timeStr}. Ekibimiz sizinle iletişime geçecek.`
        : language === "ar"
          ? `✅ تم تسجيل طلب الاستشارة عبر الإنترنت${timeStr}. سيتواصل فريقنا معك.`
          : language === "de"
            ? `✅ Ihre Online-Beratungsanfrage${timeStr} wurde erfasst. Wir kommen auf Sie zu.`
            : `✅ Your online consultation request${timeStr} has been received. We'll reach out to confirm.`;
    case "book_walkin_consultation":
      return language === "tr"
        ? `✅ Yüz yüze görüşme talebiniz alındı${timeStr}. Ekibimiz sizinle iletişime geçecek.`
        : language === "ar"
          ? `✅ تم تسجيل طلب الاستشارة الشخصية${timeStr}. سيتواصل فريقنا معك.`
          : language === "de"
            ? `✅ Ihre Vor-Ort-Beratungsanfrage${timeStr} wurde erfasst. Wir melden uns zur Bestätigung.`
            : `✅ Your in-person consultation request${timeStr} has been received. We'll be in touch to confirm.`;
    case "book_callback":
      return language === "tr"
        ? `✅ Geri arama talebiniz alındı${timeStr}. Ekibimiz sizi arayacak.`
        : language === "ar"
          ? `✅ تم تسجيل طلب معاودة الاتصال${timeStr}. سيتصل بك فريقنا.`
          : language === "de"
            ? `✅ Ihr Rückrufwunsch${timeStr} wurde notiert. Wir melden uns.`
            : `✅ Your callback request${timeStr} has been noted. We'll call you soon.`;
    case "escalate_human":
      return language === "tr"
        ? `🔴 Sizi bir ekip üyesine bağlıyoruz. Lütfen bekleyin.`
        : language === "ar"
          ? `🔴 جارٍ تحويلك إلى أحد أعضاء الفريق. يُرجى الانتظار.`
          : language === "de"
            ? `🔴 Wir verbinden Sie mit einem Teammitglied. Bitte einen Moment Geduld.`
            : `🔴 We're connecting you with a team member. Please hold on.`;
    default:
      return null;
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

  // 4 + 5 + 5a. Run history fetch, knowledge retrieval, settings, and client profile
  // in parallel — none depends on the others, so sequential awaits were pure waste.
  const [rawHistory, knowledgeChunks, settings, activeProfiles] = await Promise.all([
    // 4. Conversation history (last 14 rows → 12 turns after slice, chronological)
    db
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
      .limit(14),

    // 5. Knowledge retrieval (may include embedding API call)
    retrieveKnowledge(clientRecord.id, language, userMessage),

    // 5a. System settings
    getSettings(),

    // 5b. Active client profile (mustNotClaim)
    db
      .select({ profile: clientProfilesTable.profile })
      .from(clientProfilesTable)
      .where(and(eq(clientProfilesTable.clientId, clientRecord.id), eq(clientProfilesTable.status, "active")))
      .orderBy(desc(clientProfilesTable.activatedAt))
      .limit(1),
  ]);

  const conversationHistory: ConversationMessage[] = rawHistory
    .reverse()
    .slice(0, -1)
    .map((h) => ({
      role: h.direction === "inbound" ? ("user" as const) : ("assistant" as const),
      content: h.body,
    }));

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
    model: (typeof clientConfig["liveChatModel"] === "string" && clientConfig["liveChatModel"]
      ? clientConfig["liveChatModel"]
      : settings.liveChatModel),
    mustNotClaim,
  });

  // 6a. Turn count — number of bot replies already in this conversation.
  // Used by the rule engine as the hard fallback gate (turn >= 3 + no service → callback).
  const turnCount = conversationHistory.filter((m) => m.role === "assistant").length;

  // 6b. Deterministic rule engine — resolvedAction is the authority for all
  // downstream DB writes and Twilio sends. GPT's action field is advisory only.
  let resolvedAction = resolveAction(botResponse.data, turnCount, botResponse.intent);
  logger.info({ leadId, resolvedAction, gptAction: botResponse.action, intent: botResponse.intent, turnCount }, "Action resolved by rule engine");

  // 6b-guard. If the rule engine promoted to a booking action but GPT's reply is
  // still asking a question (gathering info), suppress the action — the booking
  // hasn't actually been confirmed yet. This prevents the ✅ confirmation tail
  // from being appended to a clarifying question mid-conversation.
  const BOOKING_ACTIONS: ResolvedAction[] = ["book_service", "book_online_consultation", "book_walkin_consultation", "book_callback"];
  if (BOOKING_ACTIONS.includes(resolvedAction)) {
    const replyTrimmed = botResponse.reply.trimEnd();
    const lastChar = replyTrimmed.slice(-1);
    const endsWithQuestion = lastChar === "?" || replyTrimmed.endsWith("؟"); // Arabic question mark too
    if (endsWithQuestion) {
      logger.info({ leadId, resolvedAction }, "Booking action suppressed — GPT reply is still asking a question");
      resolvedAction = "qualify";
    }
  }

  // 6c. Asset resolver — DB-driven, independent of GPT reply text.
  // If GPT signalled requestedAssetType, query approved assets directly and
  // append URL to reply / collect media URLs for WhatsApp inline send.
  let assetResult: AssetResolverResult = { mediaUrls: [], replyAppendText: "" };
  const rawAssetType = botResponse.data?.["requestedAssetType"];
  if (typeof rawAssetType === "string" && rawAssetType) {
    const serviceReq =
      typeof botResponse.data?.["serviceRequested"] === "string" && botResponse.data["serviceRequested"]
        ? (botResponse.data["serviceRequested"] as string)
        : null;
    assetResult = await resolveAsset(clientRecord.id, rawAssetType, serviceReq);
    if (assetResult.replyAppendText) {
      botResponse.reply = `${botResponse.reply}\n\n${assetResult.replyAppendText}`;
    }
  }

  // 6d. Empty-KB override — only fires when still in qualify mode (no resolved booking).
  // Does NOT override any of the 5 resolved actions — a confirmed booking must not be clobbered.
  if (
    knowledgeChunks.length === 0 &&
    resolvedAction === "qualify"
  ) {
    botResponse.reply = emptyKbCallbackOffer(language, callbackHours, profile);
    botResponse.intent = "out_of_scope";
    botResponse.action = "out_of_scope";
    logger.info({ leadId, language, industry }, "Empty knowledge base — backend override to callback-offer template");
  }

  // 6e. Backend-guaranteed confirmation tail for all 5 resolved actions.
  // Appended AFTER GPT reply and asset URL so it is always the final line the
  // customer reads. Prevents DB action and WhatsApp text from drifting apart.
  if (resolvedAction !== "qualify") {
    const d = botResponse.data ?? {};
    const svcReq =
      typeof d["serviceRequested"] === "string" && d["serviceRequested"]
        ? (d["serviceRequested"] as string)
        : null;
    // Resolve timing the same way the appointment insert does:
    // structured appointmentDate/Time takes priority over free-text preferredTime.
    const _apptDate =
      typeof d["appointmentDate"] === "string" && d["appointmentDate"]
        ? (d["appointmentDate"] as string)
        : null;
    const _apptTime =
      typeof d["appointmentTime"] === "string" && d["appointmentTime"]
        ? (d["appointmentTime"] as string)
        : null;
    const _prefTime =
      typeof d["preferredTime"] === "string" && d["preferredTime"]
        ? (d["preferredTime"] as string)
        : null;
    const resolvedTiming =
      [_apptDate, _apptTime].filter(Boolean).join(" ") || _prefTime;
    const confirmTail = buildActionConfirmation(resolvedAction, language, svcReq, resolvedTiming);
    if (confirmTail) {
      botResponse.reply = `${botResponse.reply}\n\n${confirmTail}`;
    }
  }

  const now = new Date();
  const data = botResponse.data ?? {};

  // 7. Backend-resolved action → lead status
  const newStatus = actionToStatus(resolvedAction, lead.status);

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
  // Primary service signal: prefer serviceRequested (new), fall back to careType / serviceType (legacy)
  const serviceRequestedNote =
    (typeof data["serviceRequested"] === "string" && data["serviceRequested"]
      ? String(data["serviceRequested"])
      : null) ??
    (typeof data["careType"] === "string" && data["careType"] ? String(data["careType"]) : null) ??
    (typeof data["serviceType"] === "string" && data["serviceType"] ? String(data["serviceType"]) : null);
  if (serviceRequestedNote) noteParts.push(`Service: ${serviceRequestedNote}`);
  if (typeof data["city"] === "string" && data["city"])
    noteParts.push(`City: ${String(data["city"])}`);
  if (typeof data["whoNeedsCare"] === "string" && data["whoNeedsCare"])
    noteParts.push(`For: ${String(data["whoNeedsCare"])}`);
  if (typeof data["consultationMode"] === "string" && data["consultationMode"])
    noteParts.push(`Mode: ${String(data["consultationMode"])}`);
  if (typeof data["appointmentDate"] === "string" && data["appointmentDate"])
    noteParts.push(`ApptDate: ${String(data["appointmentDate"])}`);
  if (typeof data["appointmentTime"] === "string" && data["appointmentTime"])
    noteParts.push(`ApptTime: ${String(data["appointmentTime"])}`);
  noteParts.push(`Action: ${resolvedAction}`);
  if (noteParts.length > 0) {
    leadUpdates.notes = lead.notes
      ? `${lead.notes}\n${noteParts.join(", ")}`
      : noteParts.join(", ");
  }

  const preferredTime =
    typeof data["preferredTime"] === "string" && data["preferredTime"]
      ? (data["preferredTime"] as string)
      : null;

  const serviceRequested =
    typeof data["serviceRequested"] === "string" && data["serviceRequested"]
      ? (data["serviceRequested"] as string)
      : null;

  const appointmentDate =
    typeof data["appointmentDate"] === "string" && data["appointmentDate"]
      ? (data["appointmentDate"] as string)
      : null;

  const appointmentTime =
    typeof data["appointmentTime"] === "string" && data["appointmentTime"]
      ? (data["appointmentTime"] as string)
      : null;

  const notificationInserts: {
    clientId: number;
    leadId: number;
    direction: string;
    body: string;
    intentDetected?: string;
  }[] = [];

  // Appointment DB ops collected here — run in parallel with Twilio send later.
  const appointmentOps: Promise<unknown>[] = [];

  // ── Action handler blocks ──────────────────────────────────────────────────

  if (resolvedAction === "book_service") {
    const timeParts = [appointmentDate, appointmentTime].filter(Boolean);
    const timing = timeParts.length > 0 ? timeParts.join(" ") : preferredTime;

    appointmentOps.push(db.insert(appointmentsTable).values({
      clientId: clientRecord.id,
      leadId,
      type: "service_booking",
      serviceRequested: serviceRequested ?? undefined,
      preferredTime: timing ?? undefined,
      outcome: "pending",
      notes: [
        `Service booking via bot (${language})`,
        serviceRequested ? `Service: ${serviceRequested}` : null,
      ]
        .filter(Boolean)
        .join(" · "),
    }));

    const notifBody =
      language === "tr"
        ? `[SİSTEM] Hizmet randevusu oluşturuldu. Hizmet: ${serviceRequested ?? "belirtilmedi"} — Zaman: ${timing ?? "belirtilmedi"}`
        : language === "en"
          ? `[SYSTEM] Service booking confirmed. Service: ${serviceRequested ?? "not specified"} — Time: ${timing ?? "not specified"}`
          : `[SYSTEM] Leistungsbuchung bestätigt. Leistung: ${serviceRequested ?? "nicht angegeben"} — Zeit: ${timing ?? "nicht angegeben"}`;

    notificationInserts.push({
      clientId: clientRecord.id,
      leadId,
      direction: "system",
      body: notifBody,
      intentDetected: "book_service_confirmed",
    });
  }

  if (resolvedAction === "book_online_consultation") {
    const timeParts = [appointmentDate, appointmentTime].filter(Boolean);
    const timing = timeParts.length > 0 ? timeParts.join(" ") : preferredTime;

    appointmentOps.push(db.insert(appointmentsTable).values({
      clientId: clientRecord.id,
      leadId,
      type: "online_consultation",
      serviceRequested: serviceRequested ?? undefined,
      preferredTime: timing ?? undefined,
      outcome: "pending",
      notes: `Online consultation via bot (${language})`,
    }));

    const notifBody =
      language === "tr"
        ? `[SİSTEM] Online görüşme oluşturuldu. Zaman: ${timing ?? "belirtilmedi"}`
        : language === "en"
          ? `[SYSTEM] Online consultation booked. Time: ${timing ?? "not specified"}`
          : `[SYSTEM] Online-Beratung gebucht. Zeit: ${timing ?? "nicht angegeben"}`;

    notificationInserts.push({
      clientId: clientRecord.id,
      leadId,
      direction: "system",
      body: notifBody,
      intentDetected: "book_online_consultation_confirmed",
    });
  }

  if (resolvedAction === "book_walkin_consultation") {
    const timeParts = [appointmentDate, appointmentTime].filter(Boolean);
    const timing = timeParts.length > 0 ? timeParts.join(" ") : preferredTime;

    appointmentOps.push(db.insert(appointmentsTable).values({
      clientId: clientRecord.id,
      leadId,
      type: "walkin_consultation",
      serviceRequested: serviceRequested ?? undefined,
      preferredTime: timing ?? undefined,
      outcome: "pending",
      notes: `Walk-in consultation via bot (${language})`,
    }));

    const notifBody =
      language === "tr"
        ? `[SİSTEM] Yüz yüze görüşme oluşturuldu. Zaman: ${timing ?? "belirtilmedi"}`
        : language === "en"
          ? `[SYSTEM] Walk-in consultation booked. Time: ${timing ?? "not specified"}`
          : `[SYSTEM] Vor-Ort-Beratung gebucht. Zeit: ${timing ?? "nicht angegeben"}`;

    notificationInserts.push({
      clientId: clientRecord.id,
      leadId,
      direction: "system",
      body: notifBody,
      intentDetected: "book_walkin_consultation_confirmed",
    });
  }

  if (resolvedAction === "book_callback") {
    appointmentOps.push(db.insert(appointmentsTable).values({
      clientId: clientRecord.id,
      leadId,
      type: "callback",
      preferredTime: preferredTime ?? undefined,
      outcome: "pending",
      notes: `Callback via WhatsApp bot (${language}, ${industry ?? "generic"})`,
    }));

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

  if (resolvedAction === "escalate_human") {
    const handoffReason = data["handoffReason"];
    const urgentNote =
      handoffReason === "urgent_call_now"
        ? language === "tr"
          ? "[ACİL] Anında geri arama talep edildi"
          : language === "en"
            ? "[URGENT] Immediate callback requested"
            : "[DRINGEND] Sofortiger Rückruf gewünscht"
        : language === "tr"
          ? "[İNSAN] Müşteri gerçek bir temsilci talep etti"
          : language === "en"
            ? "[HUMAN] Customer requested human agent"
            : "[MENSCH] Kunde hat menschlichen Berater angefordert";

    leadUpdates.notes = lead.notes ? `${lead.notes}\n${urgentNote}` : urgentNote;

    notificationInserts.push({
      clientId: clientRecord.id,
      leadId,
      direction: "system",
      body:
        language === "tr"
          ? `[SİSTEM] İnsan devreye alınması gerekiyor. Sebep: ${String(handoffReason ?? "requested")}`
          : language === "en"
            ? `[SYSTEM] Human escalation required. Reason: ${String(handoffReason ?? "requested")}`
            : `[SYSTEM] Mensch erforderlich. Grund: ${String(handoffReason ?? "requested")}`,
      intentDetected: "escalate_human",
    });
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

  // 9-10. DB writes + Twilio send run in parallel — the reply no longer sits
  // behind sequential DB round-trips, saving ~300ms per message.
  // DB branch: lead update first (status/notes), then all inserts in parallel.
  // Twilio branch: fires immediately alongside the DB branch.
  await Promise.all([
    (async () => {
      await Promise.all([
        db.update(leadsTable).set(leadUpdates).where(eq(leadsTable.id, leadId)),
        ...appointmentOps,
      ]);
      await Promise.all([
        ...notificationInserts.map((entry) => db.insert(conversationsTable).values(entry)),
        db.insert(conversationsTable).values({
          clientId: clientRecord.id,
          leadId,
          direction: "outbound",
          body: botResponse.reply,
          intentDetected: botResponse.intent,
        }),
      ]);
    })(),
    sendWhatsAppReply(twilioSender, `whatsapp:${userPhone}`, botResponse.reply),
  ]);

  // 10a. Send media assets resolved by the asset resolver (image / PDF).
  // assetResult is populated in step 6c when GPT signals requestedAssetType.
  // Fire-and-forget — failure is logged but never crashes the pipeline.
  for (const mediaUrl of assetResult.mediaUrls) {
    await sendWhatsAppMedia(twilioSender, `whatsapp:${userPhone}`, mediaUrl);
  }

  // 11. Mark job done
  await markJobDone(messageEventId);

  logger.info(
    {
      leadId,
      clientId: clientRecord.id,
      industry: industry ?? "generic",
      persona: profile.personaRole,
      intent: botResponse.intent,
      resolvedAction,
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
