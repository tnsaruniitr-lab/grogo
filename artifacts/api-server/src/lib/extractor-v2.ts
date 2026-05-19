import OpenAI from "openai";
import { z } from "zod";
import { logger } from "./logger";
import { getSettings } from "./settings";

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY ?? "placeholder",
});

export const V2CategoryEnum = [
  "identity",
  "service",
  "target_customer",
  "pricing",
  "process",
  "booking",
  "integration",
  "location",
  "language",
  "trust",
  "limitation",
  "contact",
  "faq",
  "other",
] as const;
export type V2Category = (typeof V2CategoryEnum)[number];

export const V2ReviewKeyEnum = [
  "what_it_does",
  "target_customers",
  "main_services",
  "pricing_policy",
  "booking_path",
  "geography",
  "languages",
  "trust_signals",
  "limitations",
  "escalation_rules",
  "must_not_claim",
] as const;
export type V2ReviewKey = (typeof V2ReviewKeyEnum)[number];

export const V2KnowledgeItemSchema = z.object({
  category: z.enum(V2CategoryEnum),
  question: z.string().min(5),
  answer: z.string().min(5),
  confidence: z.number().min(0).max(1),
  language: z.enum(["de", "tr", "en"]),
  evidenceQuote: z.string().optional(),
  sourceSection: z.string().optional(),
  reviewKey: z.enum(V2ReviewKeyEnum).nullable().optional(),
  riskFlags: z.array(z.string()).optional(),
});
export type V2KnowledgeItem = z.infer<typeof V2KnowledgeItemSchema>;

const EXTRACT_TOOL_V2: OpenAI.Chat.ChatCompletionTool = {
  type: "function",
  function: {
    name: "extract_knowledge_v2",
    description:
      "Extract evidence-backed structured knowledge facts from webpage text. Each fact must include a verbatim evidence quote from the source text.",
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
                enum: V2CategoryEnum as unknown as string[],
                description:
                  "identity=what the company is, service=what they offer, target_customer=who they serve, pricing=costs/payment, process=how it works, booking=how to start/schedule, integration=tools/platforms they connect to, location=geography/coverage, language=languages supported, trust=certifications/reviews/guarantees, limitation=what they do NOT do, contact=phone/email/hours/address, faq=Q&A, other=anything else",
              },
              question: {
                type: "string",
                description: "A natural question a customer would ask (concise, conversational)",
              },
              answer: {
                type: "string",
                description: "A direct factual answer (1-3 sentences, usable in WhatsApp reply). No marketing fluff.",
              },
              confidence: {
                type: "number",
                description: "0.9+ for explicitly stated facts, 0.6-0.8 for inferred, below 0.6 skip it",
              },
              language: {
                type: "string",
                enum: ["de", "tr", "en"],
                description: "Language of the page content",
              },
              evidenceQuote: {
                type: "string",
                description: "Verbatim sentence or phrase from the source text that supports this fact (max 200 chars)",
              },
              sourceSection: {
                type: "string",
                description: "Heading or section this fact appeared under (e.g. 'Pricing', 'About Us', 'FAQ')",
              },
              reviewKey: {
                type: "string",
                enum: [...V2ReviewKeyEnum, null] as unknown as string[],
                description:
                  "Maps to a canonical business profile field. Use null if this fact does not contribute to a canonical field.",
              },
              riskFlags: {
                type: "array",
                items: { type: "string" },
                description:
                  "Risk types: price_claim, competitor_mention, geography_claim, availability_claim, staff_name, legal_claim. Empty array if no risks.",
              },
            },
            required: ["category", "question", "answer", "confidence", "language", "riskFlags"],
          },
        },
      },
      required: ["items"],
    },
  },
};

const SYSTEM_PROMPT_V2 = `You are a knowledge extraction specialist. Given webpage text, extract structured, evidence-backed Q&A facts for a WhatsApp chatbot knowledge base.

Rules:
- Extract ONLY facts explicitly stated on the page — never invent prices, numbers, addresses, or staff names
- Every fact must include an evidenceQuote: the exact verbatim sentence or phrase you're basing the answer on
- Questions must be phrased conversationally as a customer would ask them
- Answers must be concise (1-3 sentences), factual, usable directly in WhatsApp
- Confidence: 0.9+ for explicitly stated facts, 0.6-0.8 for inferred facts — skip anything below 0.6
- For riskFlags: flag any claim about price, competitor, geography, availability, staff name, or legal guarantee
- reviewKey: assign the canonical profile field this fact contributes to, or null
- Skip navigation text, cookie notices, legal boilerplate, and content clearly about third parties
- Detect the page language and tag all items consistently
- Return empty items array if the page contains no useful factual content about this business`;

export async function extractKnowledgeV2(
  text: string,
  sourceUrl: string,
): Promise<V2KnowledgeItem[]> {
  const settings = await getSettings();
  const truncated = text.slice(0, 12_000);

  try {
    const completion = await openai.chat.completions.create(
      {
        model: settings.pageExtractionModel,
        max_completion_tokens: 4_000,
        messages: [
          { role: "system", content: SYSTEM_PROMPT_V2 },
          {
            role: "user",
            content: `Extract evidence-backed knowledge from this webpage (${sourceUrl}):\n\n${truncated}`,
          },
        ],
        tools: [EXTRACT_TOOL_V2],
        tool_choice: { type: "function", function: { name: "extract_knowledge_v2" } },
      },
      { signal: AbortSignal.timeout(60_000) },
    );

    const rawCall = completion.choices[0]?.message?.tool_calls?.[0];
    if (!rawCall || rawCall.type !== "function") {
      logger.warn({ sourceUrl }, "V2 Extractor: no tool call returned");
      return [];
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawCall.function.arguments);
    } catch {
      logger.warn({ sourceUrl }, "V2 Extractor: JSON parse failed");
      return [];
    }

    const rawItems = (parsed as { items?: unknown[] })?.items ?? [];
    const valid: V2KnowledgeItem[] = [];

    for (const raw of rawItems) {
      const result = V2KnowledgeItemSchema.safeParse(raw);
      if (result.success && result.data.confidence >= settings.minExtractionConfidence) {
        valid.push(result.data);
      }
    }

    logger.info({ sourceUrl, total: rawItems.length, valid: valid.length }, "V2 Extractor: done");
    return valid;
  } catch (err) {
    logger.error({ err, sourceUrl }, "V2 Extractor: GPT call failed");
    return [];
  }
}

export function deduplicateV2Items(items: V2KnowledgeItem[]): V2KnowledgeItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.question.toLowerCase().replace(/\s+/g, " ").trim().slice(0, 80);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
