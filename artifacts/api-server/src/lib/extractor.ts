import OpenAI from "openai";
import { z } from "zod";
import { logger } from "./logger";

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY ?? "placeholder",
});

export const KnowledgeCategoryEnum = [
  "service",
  "pricing",
  "contact",
  "faq",
  "about",
  "process",
] as const;
export type KnowledgeCategory = (typeof KnowledgeCategoryEnum)[number];

export const KnowledgeItemSchema = z.object({
  category: z.enum(KnowledgeCategoryEnum),
  question: z.string().min(5),
  answer: z.string().min(5),
  confidence: z.number().min(0).max(1),
  language: z.enum(["de", "tr", "en"]),
});
export type KnowledgeItem = z.infer<typeof KnowledgeItemSchema>;

const EXTRACT_TOOL: OpenAI.Chat.ChatCompletionTool = {
  type: "function",
  function: {
    name: "extract_knowledge",
    description:
      "Extract structured Q&A knowledge pairs from webpage text. Only extract facts explicitly stated in the text — never invent prices, phone numbers, or addresses.",
    parameters: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              category: {
                type: "string",
                enum: ["service", "pricing", "contact", "faq", "about", "process"],
                description:
                  "service=what they offer, pricing=costs/payment, contact=phone/email/hours/address, faq=Q&A from site, about=company background/team, process=how to start/book",
              },
              question: {
                type: "string",
                description:
                  "A natural question a customer would ask on WhatsApp (concise, conversational)",
              },
              answer: {
                type: "string",
                description:
                  "A direct, factual answer (1-3 sentences max) usable in a WhatsApp reply. No marketing fluff.",
              },
              confidence: {
                type: "number",
                description:
                  "How certain are you this fact is accurate (0.0-1.0). Use 0.9+ only for explicitly stated facts, 0.5-0.8 for inferred facts, <0.5 for uncertain info.",
              },
              language: {
                type: "string",
                enum: ["de", "tr", "en"],
                description: "Language of the page content",
              },
            },
            required: ["category", "question", "answer", "confidence", "language"],
          },
        },
      },
      required: ["items"],
    },
  },
};

const SYSTEM_PROMPT = `You are a knowledge extraction specialist. Given webpage text, extract structured Q&A pairs that would help a WhatsApp chatbot answer customer questions.

Rules:
- Extract ONLY facts explicitly stated on the page — never invent prices, numbers, addresses, or staff names
- Questions must be phrased as a customer would ask them conversationally (e.g. "What services do you offer?" not "List services")
- Answers must be concise (1-3 sentences), factual, and usable directly in a WhatsApp reply
- If a price is not explicitly stated, do NOT create a pricing Q&A pair
- If contact info is not explicitly stated, do NOT create a contact Q&A pair
- Skip navigation text, cookie notices, and legal boilerplate
- Detect the page language and tag all items with it
- Return an empty array if the page contains no useful factual content`;

export async function extractKnowledge(
  text: string,
  sourceUrl: string,
): Promise<KnowledgeItem[]> {
  const truncated = text.slice(0, 12_000);

  try {
    const completion = await openai.chat.completions.create(
      {
        model: "gpt-4o-mini",
        max_completion_tokens: 3_000,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Extract knowledge from this webpage (${sourceUrl}):\n\n${truncated}`,
          },
        ],
        tools: [EXTRACT_TOOL],
        tool_choice: { type: "function", function: { name: "extract_knowledge" } },
      },
      { signal: AbortSignal.timeout(60_000) },
    );

    const rawCall = completion.choices[0]?.message?.tool_calls?.[0];
    if (!rawCall || rawCall.type !== "function") {
      logger.warn({ sourceUrl }, "Extractor: no tool call returned");
      return [];
    }
    const toolArgs = rawCall.function.arguments;

    let parsed: unknown;
    try {
      parsed = JSON.parse(toolArgs);
    } catch {
      logger.warn({ sourceUrl, raw: toolArgs.slice(0, 200) }, "Extractor: JSON parse failed");
      return [];
    }

    const rawItems = (parsed as { items?: unknown[] })?.items ?? [];
    const valid: KnowledgeItem[] = [];

    for (const raw of rawItems) {
      const result = KnowledgeItemSchema.safeParse(raw);
      if (result.success && result.data.confidence >= 0.6) {
        valid.push(result.data);
      }
    }

    logger.info({ sourceUrl, total: rawItems.length, valid: valid.length }, "Extractor: done");
    return valid;
  } catch (err) {
    logger.error({ err, sourceUrl }, "Extractor: GPT call failed");
    return [];
  }
}

export function deduplicateItems(items: KnowledgeItem[]): KnowledgeItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.question.toLowerCase().replace(/\s+/g, " ").trim().slice(0, 80);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
