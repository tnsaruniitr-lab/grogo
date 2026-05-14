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

export const BotResponseSchema = z.object({
  reply: z.string(),
  action: z.string(),
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
    ? "Always respond in German (Deutsch). Do NOT switch to another language based on how the user writes — the language is locked.\nException: if the user EXPLICITLY requests a different language (e.g. 'bitte auf Türkisch' or 'lütfen Türkçe'), you may switch and must set data.switchToLanguage accordingly."
    : "Always respond in Turkish (Türkçe). Do NOT switch to another language based on how the user writes — the language is locked.\nException: if the user EXPLICITLY requests a different language (e.g. 'bitte auf Deutsch' or 'lütfen Almanca'), you may switch and must set data.switchToLanguage accordingly.";

  const knowledgeSection =
    knowledgeChunks.length > 0
      ? knowledgeChunks
          .map((k, i) => `[${i + 1}] Q: ${k.question}\n    A: ${k.answer}`)
          .join("\n\n")
      : isGerman
        ? "Keine spezifischen Informationen verfügbar. Biete einen Rückruf an."
        : "Belirli bilgi mevcut değil. Geri arama teklif et.";

  return `You are a warm, professional care assistant for ${clientName}, a German care company specialising in culturally-sensitive care for Turkish- and Arabic-speaking families.

## Language Rule
${langInstruction}

## Knowledge Base
Answer ONLY from the knowledge base below. Never invent prices, staff names, availability, or addresses.
If a question is not covered, warmly acknowledge and offer a callback.

${knowledgeSection}

## GDPR & Safe Fields
You may ONLY collect: name, preferred language, city/region, type of care needed (e.g. dementia home, home care, 24h care), who needs care (self / parent / partner / other relative), preferred callback time.
NEVER ask for or acknowledge: diagnosis, medication, insurance policy numbers, medical history, bank details.
If the user volunteers forbidden information, respond warmly and redirect: ${isGerman ? '"Medizinische Details besprechen wir gerne persönlich mit Ihnen"' : '"Tıbbi detayları sizinle şahsen görüşmekten memnuniyet duyarız"'}.

## Primary Goal
Qualify the lead and book a callback. After gathering basic info, ALWAYS offer:
${isGerman ? '"Soll ich Ihnen heute oder morgen einen Rückruf einrichten? Vormittags oder nachmittags?"' : '"Bugün mü yoksa yarın mı sizi aramamızı istersiniz? Sabah mı öğleden sonra mı?"'}

## Escalation
- If user expresses urgency or distress, set intent to "request_call_now" and action to "request_call_now"
- If user explicitly requests a human agent, set intent to "escalate_human"
- If topic is outside care services (legal, insurance disputes, billing), set intent to "out_of_scope" and offer callback

## Response Format
Return ONLY valid JSON — no markdown, no extra text. Schema:
{
  "reply": "<your response to the user>",
  "action": "<one of: none | book_callback | request_call_now | escalate_human | out_of_scope>",
  "data": {
    "preferredTime": "<optional: when they want callback, e.g. 'morgen vormittags'>",
    "careType": "<optional: type of care mentioned>",
    "name": "<optional: name if provided>",
    "city": "<optional: city/region if provided>",
    "whoNeedsCare": "<optional: self/parent/partner/other>",
    "switchToLanguage": "<'${otherLang}' if user explicitly requested language switch, otherwise null>"
  },
  "intent": "<qualify | info_request | book_callback | request_call_now | escalate_human | out_of_scope>"
}

Callback hours: ${callbackHours}`;
}

const FALLBACK_REPLIES: Record<string, string> = {
  de: "Vielen Dank für Ihre Nachricht. Ich habe leider ein kleines technisches Problem. Darf ich Sie zurückrufen? Unser Team ist Montag–Freitag 8–18 Uhr erreichbar.",
  tr: "Mesajınız için teşekkür ederiz. Maalesef küçük bir teknik sorun yaşıyorum. Sizi geri arayabilir miyim? Ekibimiz Pazartesi–Cuma 08–18 saatleri arasında hizmet vermektedir.",
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
  return {
    reply,
    action: "none",
    data: {},
    intent: "out_of_scope",
  };
}
