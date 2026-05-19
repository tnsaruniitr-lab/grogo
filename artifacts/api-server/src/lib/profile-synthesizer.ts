import OpenAI from "openai";
import { z } from "zod";
import { db } from "@workspace/db";
import { clientProfilesTable } from "@workspace/db";
import { logger } from "./logger";
import { getSettings } from "./settings";

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY ?? "placeholder",
});

const ProfileFieldSchema = z.object({
  value: z.union([z.string(), z.array(z.string())]),
  confidence: z.number().min(0).max(1),
  needsReview: z.boolean(),
});

export const CanonicalProfileSchema = z.object({
  whatItDoes: ProfileFieldSchema,
  targetCustomers: ProfileFieldSchema,
  mainServices: ProfileFieldSchema,
  pricingPolicy: ProfileFieldSchema,
  bookingPath: ProfileFieldSchema,
  geography: ProfileFieldSchema,
  languages: ProfileFieldSchema,
  trustSignals: ProfileFieldSchema,
  limitations: ProfileFieldSchema,
  escalationRules: ProfileFieldSchema,
  mustNotClaim: ProfileFieldSchema,
});
export type CanonicalProfile = z.infer<typeof CanonicalProfileSchema>;

const SYNTHESIZE_TOOL: OpenAI.Chat.ChatCompletionTool = {
  type: "function",
  function: {
    name: "synthesize_business_profile",
    description:
      "Synthesize a canonical business profile from extracted knowledge facts. Resolve contradictions, assign confidence, flag fields that need human review.",
    parameters: {
      type: "object",
      properties: {
        whatItDoes: {
          type: "object",
          description: "What this business does (1-2 sentence summary)",
          properties: {
            value: { type: "string" },
            confidence: { type: "number" },
            needsReview: { type: "boolean" },
          },
          required: ["value", "confidence", "needsReview"],
        },
        targetCustomers: {
          type: "object",
          description: "Who this business serves",
          properties: {
            value: { type: "array", items: { type: "string" } },
            confidence: { type: "number" },
            needsReview: { type: "boolean" },
          },
          required: ["value", "confidence", "needsReview"],
        },
        mainServices: {
          type: "object",
          description: "List of main services or products offered",
          properties: {
            value: { type: "array", items: { type: "string" } },
            confidence: { type: "number" },
            needsReview: { type: "boolean" },
          },
          required: ["value", "confidence", "needsReview"],
        },
        pricingPolicy: {
          type: "object",
          description: "How the business charges — pricing model, ranges, or 'not publicly stated'",
          properties: {
            value: { type: "string" },
            confidence: { type: "number" },
            needsReview: { type: "boolean" },
          },
          required: ["value", "confidence", "needsReview"],
        },
        bookingPath: {
          type: "object",
          description: "How a customer starts — book, call, demo, sign up, etc.",
          properties: {
            value: { type: "string" },
            confidence: { type: "number" },
            needsReview: { type: "boolean" },
          },
          required: ["value", "confidence", "needsReview"],
        },
        geography: {
          type: "object",
          description: "Where the business operates or serves customers",
          properties: {
            value: { type: "string" },
            confidence: { type: "number" },
            needsReview: { type: "boolean" },
          },
          required: ["value", "confidence", "needsReview"],
        },
        languages: {
          type: "object",
          description: "Languages the business operates in",
          properties: {
            value: { type: "array", items: { type: "string" } },
            confidence: { type: "number" },
            needsReview: { type: "boolean" },
          },
          required: ["value", "confidence", "needsReview"],
        },
        trustSignals: {
          type: "object",
          description: "Certifications, awards, reviews, guarantees, years in business",
          properties: {
            value: { type: "array", items: { type: "string" } },
            confidence: { type: "number" },
            needsReview: { type: "boolean" },
          },
          required: ["value", "confidence", "needsReview"],
        },
        limitations: {
          type: "object",
          description: "What this business explicitly does NOT do or offer",
          properties: {
            value: { type: "array", items: { type: "string" } },
            confidence: { type: "number" },
            needsReview: { type: "boolean" },
          },
          required: ["value", "confidence", "needsReview"],
        },
        escalationRules: {
          type: "object",
          description: "When to escalate to a human — urgent requests, complaints, etc.",
          properties: {
            value: { type: "array", items: { type: "string" } },
            confidence: { type: "number" },
            needsReview: { type: "boolean" },
          },
          required: ["value", "confidence", "needsReview"],
        },
        mustNotClaim: {
          type: "object",
          description:
            "Things the bot must never claim — e.g. fixed prices if pricing is negotiable, coverage areas not served, services not offered",
          properties: {
            value: { type: "array", items: { type: "string" } },
            confidence: { type: "number" },
            needsReview: { type: "boolean" },
          },
          required: ["value", "confidence", "needsReview"],
        },
      },
      required: [
        "whatItDoes",
        "targetCustomers",
        "mainServices",
        "pricingPolicy",
        "bookingPath",
        "geography",
        "languages",
        "trustSignals",
        "limitations",
        "escalationRules",
        "mustNotClaim",
      ],
    },
  },
};

const SYSTEM_PROMPT = `You are a business intelligence analyst. Given a set of extracted knowledge facts from a company's website, synthesize a canonical business profile.

Rules:
- Synthesize only from the provided facts — do not invent or assume
- If two facts contradict, choose the higher-confidence one and set needsReview: true
- Set needsReview: true for any field where: confidence < 0.75, there are contradictions, or the evidence is thin
- For mustNotClaim: list specific things the bot should explicitly avoid asserting (e.g. if pricing is "contact us", the bot must not claim specific prices)
- For empty or unknown fields: use empty string or empty array with confidence: 0 and needsReview: true
- Be conservative — it is better to flag something for review than to produce a confident wrong answer`;

type ExtractedFact = {
  category: string;
  question: string;
  answer: string;
  confidence: number | null;
  reviewKey?: string | null;
  evidenceQuote?: string | null;
};

export async function synthesizeProfile(
  clientId: number,
  crawlJobId: number,
  facts: ExtractedFact[],
): Promise<number | null> {
  const settings = await getSettings();
  const log = logger.child({ clientId, crawlJobId, fn: "synthesizeProfile" });

  if (facts.length === 0) {
    log.warn("No facts to synthesize — skipping profile creation");
    return null;
  }

  const factSummary = facts
    .slice(0, 150)
    .map((f, i) => `[${i + 1}] category=${f.category} reviewKey=${f.reviewKey ?? "null"} confidence=${f.confidence ?? "??"}\nQ: ${f.question}\nA: ${f.answer}${f.evidenceQuote ? `\nEvidence: "${f.evidenceQuote}"` : ""}`)
    .join("\n\n");

  log.info({ factCount: facts.length }, "Profile synthesis starting");

  try {
    const completion = await openai.chat.completions.create(
      {
        model: settings.profileSynthesisModel,
        max_completion_tokens: 4_000,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Synthesize a canonical business profile from these ${facts.length} extracted facts:\n\n${factSummary}`,
          },
        ],
        tools: [SYNTHESIZE_TOOL],
        tool_choice: { type: "function", function: { name: "synthesize_business_profile" } },
      },
      { signal: AbortSignal.timeout(120_000) },
    );

    const rawCall = completion.choices[0]?.message?.tool_calls?.[0];
    if (!rawCall || rawCall.type !== "function") {
      log.warn("Profile synthesizer: no tool call returned");
      return null;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawCall.function.arguments);
    } catch {
      log.warn("Profile synthesizer: JSON parse failed");
      return null;
    }

    const result = CanonicalProfileSchema.safeParse(parsed);
    if (!result.success) {
      log.warn({ issues: result.error.issues }, "Profile synthesizer: schema validation failed");
      return null;
    }

    const profile = result.data;

    const allConfidences = Object.values(profile).map((f) => (f as { confidence: number }).confidence);
    const avgConfidence = allConfidences.reduce((a, b) => a + b, 0) / allConfidences.length;

    const [inserted] = await db
      .insert(clientProfilesTable)
      .values({
        clientId,
        crawlJobId,
        status: "pending",
        profile: JSON.stringify(profile),
        synthesisModel: settings.profileSynthesisModel,
        modelVersionDate: new Date(),
        confidence: avgConfidence,
      })
      .returning({ id: clientProfilesTable.id });

    log.info(
      { profileId: inserted!.id, avgConfidence: Math.round(avgConfidence * 1000) / 1000 },
      "Profile synthesis complete",
    );

    return inserted!.id;
  } catch (err) {
    log.error({ err }, "Profile synthesizer: GPT call failed");
    return null;
  }
}
