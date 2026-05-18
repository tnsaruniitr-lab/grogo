import OpenAI from "openai";
import { z } from "zod";
import { logger } from "./logger";
import type { BotProfile } from "@workspace/db";

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY ?? "placeholder",
});

export const intentEnum = [
  "qualify",
  "info_request",
  "book_callback",
  "request_call_now",
  "escalate_human",
  "out_of_scope",
] as const;
export type Intent = (typeof intentEnum)[number];

export const actionEnum = [
  "none",
  "book_callback",
  "request_call_now",
  "escalate_human",
  "out_of_scope",
] as const;
export type Action = (typeof actionEnum)[number];

export const BotResponseSchema = z.object({
  reply: z.string().min(1),
  action: z.enum(actionEnum),
  data: z
    .object({
      preferredTime: z.string().nullable().optional(),
      careType: z.string().nullable().optional(),
      name: z.string().nullable().optional(),
      city: z.string().nullable().optional(),
      whoNeedsCare: z.string().nullable().optional(),
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
): string {
  const knowledgeSection =
    knowledgeChunks.length > 0
      ? knowledgeChunks.map((k, i) => `[${i + 1}] Q: ${k.question}\n    A: ${k.answer}`).join("\n\n")
      : noKnowledgePlaceholder(language);

  const callbackOffer = pickLang(profile.callbackOffer, language);
  const gdprAllowed = pickLang(profile.gdprAllowedFields, language);
  const gdprRedirectMsg = pickLang(profile.gdprRedirect, language);

  // Build the data JSON template from the profile's data fields
  const dataFieldLines = profile.dataFields
    .map((f) => {
      const label = f.label[language] ?? f.label["en"] ?? f.key;
      return `    "${f.key}": "<${label} or null>"`;
    })
    .join(",\n");

  return `You are a warm, professional ${profile.personaRole} for ${clientName}, ${profile.companyContext}.

## Language Rule
Always respond in ${langLabel(language)}. The conversation language is LOCKED.
Exception: if the user explicitly writes in a different language or asks to switch (e.g. "please in English", "auf Arabisch", "en français", "speak Spanish"), switch immediately — write your reply in the requested language AND set data.switchToLanguage to the ISO 639-1 language code (e.g. "en", "de", "tr", "ar", "fr", "es", "ru", "zh", etc.). Do not delay to the next message.

## Knowledge Base
Answer ONLY from the knowledge base below. Never invent prices, staff names, availability, or addresses.
If a question is not covered, warmly acknowledge it and set action to "out_of_scope".

IMPORTANT — Knowledge Base authority: facts in the knowledge base entries below are the ground truth about this company. If any knowledge base entry contradicts the persona description above (for example, what the company does, what industry it is in, or who it serves), the knowledge base entry is correct and the persona description is a generic template. Always use the knowledge base facts when describing the company to the user.

${knowledgeSection}

## GDPR & Safe Fields
You may ONLY collect: ${gdprAllowed}
NEVER ask for or acknowledge: diagnoses, medications, insurance policy numbers, medical history, financial or bank details.
If the user volunteers such information, redirect warmly: "${gdprRedirectMsg}"

## Primary Goal
${profile.primaryGoal}. After gathering basic info, ALWAYS offer:
${callbackOffer}

## Intent & Action Mapping
"intent" describes what the user wants. "action" is what the system should DO — they are NOT the same field and must not mirror each other unless listed below.
Use EXACTLY these values:
- User asks general info → intent: "info_request", action: "none"
- Qualifying/gathering info → intent: "qualify", action: "none"
- User wants callback and gives time → intent: "book_callback", action: "book_callback"
- User requests immediate call / urgent / distress → intent: "request_call_now", action: "request_call_now"
- User explicitly requests human agent → intent: "escalate_human", action: "escalate_human"
- Topic outside scope / forbidden info → intent: "out_of_scope", action: "out_of_scope"
IMPORTANT: action must NEVER be "info_request" or "qualify" — those are intent-only values. Use "none" for action in those cases.

## Response Format
Return ONLY valid JSON — no markdown, no extra text. IMPORTANT: action MUST be one of: none, book_callback, request_call_now, escalate_human, out_of_scope.
{
  "reply": "<your response — in switchToLanguage if switching, otherwise in the locked language>",
  "action": "<none|book_callback|request_call_now|escalate_human|out_of_scope>",
  "data": {
${dataFieldLines},
    "switchToLanguage": "<ISO 639-1 code e.g. en/de/tr/ar/fr/es if switching, otherwise null>"
  },
  "intent": "<qualify|info_request|book_callback|request_call_now|escalate_human|out_of_scope>"
}

Callback hours: ${callbackHours}`;
}

const FALLBACK_REPLIES: Record<string, string> = {
  de: "Vielen Dank für Ihre Nachricht. Leider habe ich kurz ein technisches Problem. Darf ich Sie zurückrufen? Unser Team ist Montag–Freitag 8–18 Uhr erreichbar.",
  tr: "Mesajınız için teşekkür ederiz. Maalesef kısa bir teknik sorun yaşıyoruz. Sizi geri arayabilir miyiz? Ekibimiz Pazartesi–Cuma 08–18 saatleri arasında hizmet vermektedir.",
  en: "Thank you for your message. I'm experiencing a brief technical issue. May I arrange a callback for you? Our team is available Monday–Friday 8am–6pm.",
};

export async function callGpt(params: GptCallParams): Promise<BotResponse> {
  const { language, clientName, callbackHours, knowledgeChunks, conversationHistory, userMessage, profile } =
    params;

  const systemPrompt = buildSystemPrompt(language, clientName, callbackHours, knowledgeChunks, profile);

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...conversationHistory.map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: userMessage },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_completion_tokens: 1024,
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
