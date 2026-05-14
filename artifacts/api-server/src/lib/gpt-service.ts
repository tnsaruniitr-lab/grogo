import OpenAI from "openai";
import { z } from "zod";
import { logger } from "./logger";

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

// Strict enum — backend rejects any action value not in this list
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
      // GPT may return null for unset fields — all optional fields must allow null
      preferredTime: z.string().nullable().optional(),
      careType: z.string().nullable().optional(),
      name: z.string().nullable().optional(),
      city: z.string().nullable().optional(),
      whoNeedsCare: z.string().nullable().optional(),
      // Populated only when user explicitly requests a language switch (e.g. "bitte auf Türkisch")
      // Values: "de" | "tr" | null — null means no switch requested
      switchToLanguage: z.enum(["de", "tr"]).nullable().optional(),
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
}

function buildSystemPrompt(
  language: string,
  clientName: string,
  callbackHours: string,
  knowledgeChunks: { question: string; answer: string }[],
): string {
  const isGerman = language === "de";
  const otherLang = isGerman ? "tr" : "de";
  const langInstruction = isGerman
    ? "Always respond in German (Deutsch). The conversation language is LOCKED.\nException: if the user EXPLICITLY requests a different language (e.g. 'bitte auf Türkisch' or 'lütfen Türkçe'), you may switch and must set data.switchToLanguage to the new language code."
    : "Always respond in Turkish (Türkçe). The conversation language is LOCKED.\nException: if the user EXPLICITLY requests a different language (e.g. 'bitte auf Deutsch' or 'lütfen Almanca'), you may switch and must set data.switchToLanguage to the new language code.";

  const knowledgeSection =
    knowledgeChunks.length > 0
      ? knowledgeChunks
          .map((k, i) => `[${i + 1}] Q: ${k.question}\n    A: ${k.answer}`)
          .join("\n\n")
      : isGerman
        ? "Keine spezifischen Informationen verfügbar. Biete einen Rückruf an."
        : "Belirli bilgi mevcut değil. Geri arama teklif et.";

  const callbackOfferDE = `"Soll ich Ihnen heute oder morgen einen Rückruf einrichten? Vormittags oder nachmittags?"`;
  const callbackOfferTR = `"Bugün mü yoksa yarın mı sizi aramamızı istersiniz? Sabah mı öğleden sonra mı?"`;

  return `You are a warm, professional care assistant for ${clientName}, a German care company specialising in culturally-sensitive care for Turkish- and Arabic-speaking families.

## Language Rule
${langInstruction}

## Knowledge Base
Answer ONLY from the knowledge base below. Never invent prices, staff names, availability, or addresses.
If a question is not covered, warmly acknowledge and set action to "out_of_scope".

${knowledgeSection}

## GDPR & Safe Fields
You may ONLY collect: name, preferred language, city/region, type of care needed (e.g. dementia home, home care, 24h care), who needs care (self / parent / partner / other relative), preferred callback time.
NEVER ask for or acknowledge: diagnosis, medication, insurance policy numbers, medical history, bank details.
If the user volunteers forbidden information, redirect warmly: ${isGerman ? '"Medizinische Details besprechen wir gerne persönlich"' : '"Tıbbi detayları şahsen görüşürüz"'}.

## Primary Goal — callback-first
Qualify the lead and book a callback. After gathering basic info, ALWAYS offer:
${isGerman ? callbackOfferDE : callbackOfferTR}

## Intent & Action Mapping
Use EXACTLY these values:
- User asks general info → intent: "info_request", action: "none"
- Qualifying/gathering info → intent: "qualify", action: "none"  
- User wants callback and gives time → intent: "book_callback", action: "book_callback"
- User requests immediate call / urgent / distress → intent: "request_call_now", action: "request_call_now"
- User explicitly requests human agent → intent: "escalate_human", action: "escalate_human"
- Topic outside care services / forbidden medical info → intent: "out_of_scope", action: "out_of_scope"

## Response Format
Return ONLY valid JSON — no markdown, no extra text. IMPORTANT: action MUST be one of: none, book_callback, request_call_now, escalate_human, out_of_scope.
{
  "reply": "<your response in the locked language>",
  "action": "<none|book_callback|request_call_now|escalate_human|out_of_scope>",
  "data": {
    "preferredTime": "<callback time or null>",
    "careType": "<type of care or null>",
    "name": "<name if provided or null>",
    "city": "<city/region or null>",
    "whoNeedsCare": "<self/parent/partner/other or null>",
    "switchToLanguage": "<'${otherLang}' if explicit switch requested, otherwise null>"
  },
  "intent": "<qualify|info_request|book_callback|request_call_now|escalate_human|out_of_scope>"
}

Callback hours: ${callbackHours}`;
}

const FALLBACK_REPLIES: Record<string, string> = {
  de: "Vielen Dank für Ihre Nachricht. Leider habe ich kurz ein technisches Problem. Darf ich Sie zurückrufen? Unser Team ist Montag–Freitag 8–18 Uhr erreichbar.",
  tr: "Mesajınız için teşekkür ederiz. Maalesef kısa bir teknik sorun yaşıyoruz. Sizi geri arayabilir miyiz? Ekibimiz Pazartesi–Cuma 08–18 saatleri arasında hizmet vermektedir.",
};

export async function callGpt(params: GptCallParams): Promise<BotResponse> {
  const { language, clientName, callbackHours, knowledgeChunks, conversationHistory, userMessage } =
    params;

  const systemPrompt = buildSystemPrompt(language, clientName, callbackHours, knowledgeChunks);

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
  const reply = FALLBACK_REPLIES[language] ?? FALLBACK_REPLIES["de"]!;
  return { reply, action: "none", data: {}, intent: "out_of_scope" };
}
