import OpenAI from "openai";
import { z } from "zod";
import { logger } from "./logger";
import type { BotProfile } from "@workspace/db";

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY ?? "placeholder",
  timeout: 25_000,
  maxRetries: 0,
});

const groq = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY ?? "placeholder",
  timeout: 25_000,
  maxRetries: 0,
});

function resolveClient(model: string): { client: OpenAI; resolvedModel: string } {
  if (model.startsWith("groq/")) {
    return { client: groq, resolvedModel: model.slice(5) };
  }
  return { client: openai, resolvedModel: model };
}

export const intentEnum = [
  "qualify",
  "info_request",
  "book_service",
  "book_online_consultation",
  "book_walkin_consultation",
  "book_callback",
  "escalate_human",
  "out_of_scope",
] as const;
export type Intent = (typeof intentEnum)[number];

export const actionEnum = [
  "none",
  "book_service",
  "book_online_consultation",
  "book_walkin_consultation",
  "book_callback",
  "escalate_human",
  "out_of_scope",
] as const;
export type Action = (typeof actionEnum)[number];

export const BotResponseSchema = z.object({
  reply: z.string().min(1),
  action: z.enum(actionEnum),
  data: z
    .object({
      // Structured booking signals — used by the backend rule engine
      serviceRequested: z.string().nullable().optional(),
      preferredTime: z.string().nullable().optional(),
      appointmentDate: z.string().nullable().optional(),
      appointmentTime: z.string().nullable().optional(),
      consultationMode: z.enum(["online", "walkin"]).nullable().optional(),
      bookingConfirmed: z.boolean().optional(),
      requestedHuman: z.boolean().optional(),
      handoffReason: z.enum(["urgent_call_now", "requested"]).nullable().optional(),
      requestedAssetType: z.enum(["price", "demo", "booking", "brochure"]).nullable().optional(),
      // Legacy qualification fields — kept for notes / summary
      careType: z.string().nullable().optional(),
      name: z.string().nullable().optional(),
      city: z.string().nullable().optional(),
      whoNeedsCare: z.string().nullable().optional(),
      serviceType: z.string().nullable().optional(),
      switchToLanguage: z.string().min(2).max(10).nullable().optional(),
    })
    .optional()
    .default({}),
  intent: z.enum(intentEnum),
});
export type BotResponse = z.infer<typeof BotResponseSchema>;

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

export interface GptCallParams {
  language: string;
  clientName: string;
  callbackHours: string;
  knowledgeChunks: { question: string; answer: string }[];
  conversationHistory: ConversationMessage[];
  userMessage: string;
  profile: BotProfile;
  model?: string;
  mustNotClaim?: string[];
}

const LANGUAGE_LABELS: Record<string, string> = {
  de: "German (Deutsch)",
  tr: "Turkish (Türkçe)",
  en: "English",
  ar: "Arabic (العربية)",
  fr: "French (Français)",
  es: "Spanish (Español)",
  ru: "Russian (Русский)",
  zh: "Chinese (中文)",
  pt: "Portuguese (Português)",
  nl: "Dutch (Nederlands)",
  it: "Italian (Italiano)",
  pl: "Polish (Polski)",
  hi: "Hindi (हिन्दी)",
  ur: "Urdu (اردو)",
  fa: "Persian (فارسی)",
  ko: "Korean (한국어)",
  ja: "Japanese (日本語)",
};

function langLabel(language: string): string {
  return LANGUAGE_LABELS[language] ?? `the language with code "${language}"`;
}

function noKnowledgePlaceholder(language: string): string {
  if (language === "de") return "Keine spezifischen Informationen verfügbar. Biete einen Rückruf an.";
  if (language === "tr") return "Belirli bilgi mevcut değil. Geri arama teklif et.";
  if (language === "ar") return "لا تتوفر معلومات محددة. اعرض معاودة الاتصال بدفء.";
  return "No specific information available. Warmly offer a callback.";
}

function pickLang(map: Record<string, string>, language: string): string {
  return map[language] ?? map["en"] ?? map["de"] ?? Object.values(map)[0] ?? "";
}

function buildSystemPrompt(
  language: string,
  clientName: string,
  callbackHours: string,
  knowledgeChunks: { question: string; answer: string }[],
  profile: BotProfile,
  mustNotClaim: string[],
): string {
  const knowledgeSection =
    knowledgeChunks.length > 0
      ? knowledgeChunks.map((k, i) => `[${i + 1}] Q: ${k.question}\n    A: ${k.answer}`).join("\n\n")
      : noKnowledgePlaceholder(language);

  const callbackOffer = pickLang(profile.callbackOffer, language);
  const gdprAllowed = pickLang(profile.gdprAllowedFields, language);
  const gdprRedirectMsg = pickLang(profile.gdprRedirect, language);

  // Build the data JSON template from the profile's data fields.
  // Exclude keys that are now hardcoded in the response format template above
  // to prevent GPT seeing the same field twice with conflicting descriptions.
  const HARDCODED_DATA_KEYS = new Set([
    "serviceRequested", "preferredTime", "appointmentDate", "appointmentTime",
    "consultationMode", "bookingConfirmed", "requestedHuman",
    "handoffReason", "requestedAssetType", "switchToLanguage",
  ]);
  const dataFieldLines = profile.dataFields
    .filter((f) => !HARDCODED_DATA_KEYS.has(f.key))
    .map((f) => {
      const label = f.label[language] ?? f.label["en"] ?? f.key;
      return `    "${f.key}": "<${label} or null>"`;
    })
    .join(",\n");

  const todayStr = new Date().toISOString().slice(0, 10); // e.g. 2026-05-23

  return `You are a warm, professional ${profile.personaRole} for ${clientName}, ${profile.companyContext}.

## Today's Date
Today is ${todayStr}. Use this as the reference point for all appointment and callback dates. Never suggest or confirm a date that is in the past.

## Language Rule
Always respond in ${langLabel(language)}. The conversation language is LOCKED.
Exception: if the user explicitly writes in a different language or asks to switch (e.g. "please in English", "auf Arabisch", "en français", "speak Spanish"), switch immediately — write your reply in the requested language AND set data.switchToLanguage to the ISO 639-1 language code (e.g. "en", "de", "tr", "ar", "fr", "es", "ru", "zh", etc.). Do not delay to the next message.

## Knowledge Base
Answer ONLY from the knowledge base below. Never invent prices, staff names, availability, or addresses.
If a question is not covered, warmly acknowledge it and set action to "out_of_scope".

IMPORTANT — Knowledge Base authority: facts in the knowledge base entries below are the ground truth about this company. If any knowledge base entry contradicts the persona description above (for example, what the company does, what industry it is in, or who it serves), the knowledge base entry is correct and the persona description is a generic template. Always use the knowledge base facts when describing the company to the user.

${knowledgeSection}

## Answer Policy
Follow these rules for every reply:

1. **Answer directly first.** Give the answer in the first sentence. Do not start with filler ("Great question!", "Of course!", "Sure!"). Then ask one focused follow-up question to move the conversation forward.

2. **Never deflect when a KB entry exists.** If a relevant knowledge base entry is present, use it to answer. Never say "I cannot provide details", "I don't have that information", or similar deflections when the answer is available above.

3. **Service/feature questions:** Summarise all relevant service entries — do not pick just one. Give the user a complete picture.

4. **Pricing questions:** Use ONLY the pricing entry. Never estimate, extrapolate, or invent a number. If specific prices are not available in the KB, do NOT say "I cannot provide pricing" — instead set \`requestedAssetType: "price"\` and write an affirmative reply such as "Here is our pricing list" or "Let me share our pricing document with you."

5. **Identity questions ("who are you", "what is this"):** Use the identity and about entries only. Do not describe the company from the persona description — the KB entries are the source of truth.

6. **When genuinely unsure:** State what is known from the KB, then offer to connect the user with the team for the rest.

7. **Asset delivery — set the signal, never paste URLs.** When the prospect asks for a price list, pricing, rates, brochure, demo video, walkthrough, or booking link — set \`requestedAssetType\` in your data to one of: \`price\`, \`demo\`, \`booking\`, \`brochure\`. The system sends the correct file or link automatically. Do NOT include any asset URLs in your reply text — the backend resolver handles delivery reliably.
   **CRITICAL — asset + affirmative text rule:** Whenever you set \`requestedAssetType\`, your reply text MUST be affirmative ("Here is our pricing list", "I'm sharing our brochure with you", "Here's a demo video", etc.). NEVER pair an asset signal with a deflection like "I cannot provide that information" or "I don't have specific details" — the document IS being delivered, so say so.

## GDPR & Safe Fields
You may ONLY collect: ${gdprAllowed}
NEVER ask for or acknowledge: diagnoses, medications, insurance policy numbers, medical history, financial or bank details.
If the user volunteers such information, redirect warmly: "${gdprRedirectMsg}"

## Primary Goal
${profile.primaryGoal}. After gathering basic info, ALWAYS offer:
${callbackOffer}

## Booking Priority Ladder
Follow this order every turn. Fire the highest applicable action — never offer a lower one when a higher is achievable.

Collect missing fields one question at a time. Never ask more than one question per reply.

**CRITICAL RULE — action vs reply must match:**
- Only set a booking action (\`book_service\`, \`book_online_consultation\`, \`book_walkin_consultation\`, \`book_callback\`) in the SAME turn where your reply IS the confirmation (starts with ✅).
- If your reply is asking a question to gather more info, you MUST set \`action: "none"\` — even if you intend to book on the next turn.
- NEVER combine a clarifying question with a booking action. One turn = one intent.

**Priority 1 — Direct service booking** (\`book_service\`):
serviceRequested is known + any timing mentioned + bookingConfirmed = true (prospect explicitly said "yes book it", "please schedule", "go ahead" — NOT just "I'm interested")
→ reply starts with ✅ confirmation, action: "book_service"
While still collecting service or timing → action: "none", reply asks ONE question.

**Priority 2 — Consultation** (prospect wants to explore first):
- Signals online ("video call", "online", "virtual") + bookingConfirmed = true → reply starts with ✅, action: "book_online_consultation"
- Signals in-person ("come in", "visit", "in person") + bookingConfirmed = true → reply starts with ✅, action: "book_walkin_consultation"
- Not confirmed yet → action: "none", ask ONE question: "In-person visit or online consultation?"

**Priority 3 — Callback** (\`book_callback\`):
Use when: after 2–3 exchanges serviceRequested is still unknown, OR prospect is unsure, OR says "call me back/later".
- Step A — if you don't yet have a preferred time: ask for it. Set \`action: "none"\`.
- Step B — once you have a preferred time (or prospect is happy to proceed without one): reply starts with ✅ confirmation, set \`action: "book_callback"\`, set \`bookingConfirmed: true\`.
- A callback does NOT need \`serviceRequested\` — a human team member will determine that on the call.

**Priority 4 — Human escalation** (\`escalate_human\`) — fire IMMEDIATELY on the same turn, no delay:
- Prospect says "speak to a person", "real agent", "human", "talk to someone" → handoffReason: "requested"
- Prospect shows urgency, distress, emergency → handoffReason: "urgent_call_now"

**For general info / qualifying:** intent: "info_request" or "qualify", action: "none"
IMPORTANT: action must NEVER be "info_request" or "qualify" — those are intent-only values. Use "none" for action then.

## Response Format
Return ONLY valid JSON — no markdown, no extra text.
{
  "reply": "<your response in the locked language>",
  "action": "<book_service|book_online_consultation|book_walkin_consultation|book_callback|escalate_human|none|out_of_scope>",
  "data": {
    "serviceRequested": "<service name e.g. physiotherapy, or null>",
    "preferredTime": "<free-text timing, or null>",
    "appointmentDate": "<structured date if mentioned, or null>",
    "appointmentTime": "<structured time if mentioned, or null>",
    "consultationMode": "<online|walkin|null>",
    "bookingConfirmed": <true ONLY on explicit book/proceed/schedule confirmation — false otherwise>,
    "requestedHuman": <true if prospect asks for a person/agent/human — false otherwise>,
    "handoffReason": "<urgent_call_now|requested|null>",
    "requestedAssetType": "<price|demo|booking|brochure|null>",
${dataFieldLines},
    "switchToLanguage": "<ISO 639-1 code if switching, otherwise null>"
  },
  "intent": "<qualify|info_request|book_service|book_online_consultation|book_walkin_consultation|book_callback|escalate_human|out_of_scope>"
}

Callback hours: ${callbackHours}${
    mustNotClaim.length > 0
      ? `\n\n## Must Not Claim\nNEVER state or imply any of the following — they are unverified or incorrect for this business:\n${mustNotClaim.map((c, i) => `${i + 1}. ${c}`).join("\n")}`
      : ""
  }`;
}

const FALLBACK_REPLIES: Record<string, string> = {
  de: "Darf ich Ihnen einen Rückruf von unserem Team arrangieren? Wir sind Montag–Freitag 8–18 Uhr erreichbar.",
  tr: "Sizi ekibimizle buluşturmak ister misiniz? Pazartesi–Cuma 08–18 saatleri arasında hizmetinizdeyiz.",
  en: "Would you like me to arrange a callback from our team? We're available Monday–Friday, 8am–6pm.",
};

const HISTORY_CAP = 8; // keep last 8 messages (~4 exchanges) — balances context vs latency

export async function callGpt(params: GptCallParams): Promise<BotResponse> {
  const { language, clientName, callbackHours, knowledgeChunks, conversationHistory, userMessage, profile, model, mustNotClaim } =
    params;

  const systemPrompt = buildSystemPrompt(language, clientName, callbackHours, knowledgeChunks, profile, mustNotClaim ?? []);

  const cappedHistory = conversationHistory.slice(-HISTORY_CAP);

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...cappedHistory.map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: userMessage },
  ];

  try {
    const { client, resolvedModel } = resolveClient(model ?? "gpt-4o-mini");
    const completion = await client.chat.completions.create({
      model: resolvedModel,
      max_tokens: 600,
      messages,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      logger.warn({ raw }, "GPT returned non-JSON — using fallback");
      return safeFallback(language);
    }

    // Soft-correct common GPT mistakes before Zod validation so we never discard
    // a good reply just because a metadata field is slightly off.
    if (parsed !== null && typeof parsed === "object") {
      const p = parsed as Record<string, unknown>;

      // 1. data: null → {} (Zod .optional() accepts undefined, not null)
      if (p["data"] === null) p["data"] = {};

      // 2. action contains an intent-only value or any other free-text invention →
      //    coerce to "none" rather than reject the whole response.
      const validActions = new Set(actionEnum);
      if (typeof p["action"] === "string" && !validActions.has(p["action"] as never)) {
        logger.warn({ original: p["action"] }, "GPT returned invalid action — coercing to 'none'");
        p["action"] = "none";
      }

      // 3. intent contains an invented value → coerce to "info_request"
      const validIntents = new Set(intentEnum);
      if (typeof p["intent"] === "string" && !validIntents.has(p["intent"] as never)) {
        logger.warn({ original: p["intent"] }, "GPT returned invalid intent — coercing to 'info_request'");
        p["intent"] = "info_request";
      }
    }

    const validated = BotResponseSchema.safeParse(parsed);
    if (!validated.success) {
      logger.warn({ parsed, issues: validated.error.issues }, "GPT JSON schema mismatch — using fallback");
      return safeFallback(language);
    }

    return validated.data;
  } catch (err) {
    logger.error({ err }, "GPT API call failed — using fallback");
    return safeFallback(language);
  }
}

function safeFallback(language: string): BotResponse {
  const reply = FALLBACK_REPLIES[language] ?? FALLBACK_REPLIES["en"]!;
  return { reply, action: "none", data: {}, intent: "out_of_scope" };
}
