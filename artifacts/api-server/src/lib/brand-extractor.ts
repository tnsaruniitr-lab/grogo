import OpenAI from "openai";
import { z } from "zod";
import { db } from "@workspace/db";
import { clientsTable, crawlPagesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { logger } from "./logger";

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY ?? "placeholder",
});

export const INDUSTRY_VALUES = [
  "care",
  "aesthetics",
  "dental",
  "medical",
  "wellness",
  "legal",
  "finance",
  "retail",
  "hospitality",
  "education",
  "fitness",
  "other",
] as const;
export type Industry = (typeof INDUSTRY_VALUES)[number];

const BrandSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  secondaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  heroHeadline: z.string().min(3).max(100),
  industry: z.enum(INDUSTRY_VALUES),
  tagline: z.string().max(200).optional(),
});

const BRAND_TOOL: OpenAI.Chat.ChatCompletionTool = {
  type: "function",
  function: {
    name: "extract_brand",
    description: "Extract brand identity from website homepage text",
    parameters: {
      type: "object",
      required: ["primaryColor", "secondaryColor", "heroHeadline", "industry"],
      properties: {
        primaryColor: {
          type: "string",
          description:
            "Primary brand accent color as 6-digit hex (e.g. #C9A84C). If a theme-color hint is provided, use it. Otherwise infer from industry/brand context — use sophisticated, distinctive palettes, not generic.",
        },
        secondaryColor: {
          type: "string",
          description:
            "Secondary/dark brand color as 6-digit hex. Used for text, headings, and dark CTAs. Should be very dark (near-black) or deep tone.",
        },
        heroHeadline: {
          type: "string",
          description:
            "Short (3–8 word) punchy hero headline that captures the company's key value prop. Do not copy full sentences — distill into a sharp headline.",
        },
        industry: {
          type: "string",
          enum: INDUSTRY_VALUES,
          description:
            "The company's own industry — what the company *is*, not the clients it serves. A SaaS platform, marketing tool, or software product that serves healthcare/wellness businesses is 'other', not 'wellness' or 'medical'. Only classify as care/aesthetics/dental/medical/wellness/fitness/etc. if the company itself directly delivers that service to end-patients or consumers.",
        },
        tagline: {
          type: "string",
          description: "Full tagline / one-liner subtitle (1 sentence) if clearly stated on site",
        },
      },
    },
  },
};

const INDUSTRY_COLOR_HINTS: Record<Industry, string> = {
  care: "warm comforting tones — greens (#4A7C59), teals, warm neutrals",
  aesthetics: "luxury tones — warm gold (#C9A84C), rose gold, champagne, or deep plum",
  dental: "clean clinical tones — sky blue (#2E86AB), bright white accents, mint",
  medical: "trustworthy tones — deep blue (#1B4F8A), teal, calm grey-blue",
  wellness: "serene holistic tones — sage green (#6B9E78), warm sand, soft teal, lavender",
  legal: "authority tones — deep navy (#1C2951), dark burgundy, charcoal",
  finance: "confident tones — deep green (#0D5C40), royal blue (#1A3A6B)",
  retail: "energetic or brand-specific — warm coral, vibrant indigo, modern teal",
  hospitality: "welcoming tones — warm terracotta (#C1694F), gold, deep cream",
  education: "inspiring tones — bright cobalt (#2563EB), purple, warm yellow",
  fitness: "energetic tones — electric orange (#F97316), strong red, dark charcoal",
  other: "professional and distinctive tones for the brand",
};

function extractMetaColor(html: string): string | null {
  const m = html.match(/<meta[^>]+name=["']theme-color["'][^>]+content=["']([^"']+)["']/i);
  const color = m?.[1]?.trim();
  if (color && /^#[0-9a-fA-F]{6}$/.test(color)) return color;
  return null;
}

function extractCssVar(html: string): string | null {
  const m = html.match(/--(?:primary|brand|accent|color-primary|theme-color?)\s*:\s*(#[0-9a-fA-F]{6})/i);
  return m?.[1] ?? null;
}

function extractOgImage(html: string): string | null {
  return (
    html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1] ??
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1] ??
    null
  );
}

function extractLogoUrl(html: string, baseUrl: string): string | null {
  const base = new URL(baseUrl);

  const makeAbsolute = (href: string): string => {
    try {
      return new URL(href, base.origin).href;
    } catch {
      return href;
    }
  };

  // 1. apple-touch-icon — high-res, brand-approved icon (180×180+)
  const appleTouch =
    html.match(/<link[^>]+rel=["']apple-touch-icon["'][^>]+href=["']([^"']+)["']/i)?.[1] ??
    html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']apple-touch-icon["']/i)?.[1];
  if (appleTouch) return makeAbsolute(appleTouch);

  // 2. SVG favicon — vector, scales perfectly
  const svgIcon =
    html.match(/<link[^>]+type=["']image\/svg\+xml["'][^>]+href=["']([^"']+)["']/i)?.[1] ??
    html.match(/<link[^>]+href=["']([^"']+\.svg)["'][^>]+rel=["'][^"']*icon[^"']*["']/i)?.[1];
  if (svgIcon) return makeAbsolute(svgIcon);

  // 3. Large PNG favicon (≥32px implied by sizes attribute)
  const pngIcon =
    html.match(/<link[^>]+sizes=["'](?:192|180|128|96|64|48|32)[^"']*["'][^>]+href=["']([^"']+)["']/i)?.[1] ??
    html.match(/<link[^>]+href=["']([^"']+)["'][^>]+sizes=["'](?:192|180|128|96|64|48|32)[^"']*["']/i)?.[1];
  if (pngIcon) return makeAbsolute(pngIcon);

  // 4. Clearbit logo API — reliable fallback given domain
  return `https://logo.clearbit.com/${base.hostname}`;
}

export async function extractBrand(
  clientId: number,
  websiteUrl: string,
): Promise<void> {
  const log = logger.child({ clientId, fn: "extractBrand" });
  log.info({ websiteUrl }, "Brand extraction starting");

  try {
    // 1. Fetch homepage HTML for meta + OG extraction
    let html = "";
    let ogImage: string | null = null;
    let metaColor: string | null = null;
    let logoUrl: string | null = null;

    try {
      const res = await fetch(websiteUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; DosteliBrandBot/1.0)" },
        signal: AbortSignal.timeout(10_000),
      });
      if (res.ok) {
        html = await res.text();
        metaColor = extractMetaColor(html) ?? extractCssVar(html);
        ogImage = extractOgImage(html);
        logoUrl = extractLogoUrl(html, websiteUrl);
        log.info({ metaColor, hasOgImage: !!ogImage, logoUrl }, "HTML meta extraction done");
      }
    } catch (err) {
      log.warn({ err }, "Homepage HTML fetch failed — will use stored text only");
    }

    // 2. Get stored homepage text from crawl_pages
    const [homePage] = await db
      .select({ rawText: crawlPagesTable.rawText })
      .from(crawlPagesTable)
      .where(and(eq(crawlPagesTable.clientId, clientId), eq(crawlPagesTable.depth, 0)))
      .limit(1);

    const pageText = homePage?.rawText ?? "";
    if (!pageText) {
      log.warn("No homepage text in crawl_pages — skipping brand extraction");
      return;
    }

    // 3. GPT brand extraction
    const colorHint = metaColor
      ? `\n\nIMPORTANT: The site's theme-color meta tag specifies ${metaColor}. Use this exact value as primaryColor.`
      : "";

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_completion_tokens: 500,
      messages: [
        {
          role: "system",
          content: `You are a brand analyst. Given a company's homepage text, extract brand identity.

For colors: infer industry-appropriate sophisticated hex colors. Color palette guidance by industry:
${Object.entries(INDUSTRY_COLOR_HINTS)
  .map(([k, v]) => `- ${k}: ${v}`)
  .join("\n")}

For heroHeadline: create a 3–7 word punchy headline (NOT a full sentence) capturing their core value proposition.${colorHint}`,
        },
        {
          role: "user",
          content: `Extract brand identity from this company's homepage:\n\n${pageText.slice(0, 8_000)}`,
        },
      ],
      tools: [BRAND_TOOL],
      tool_choice: { type: "function", function: { name: "extract_brand" } },
    });

    const rawCall = completion.choices[0]?.message?.tool_calls?.[0];
    if (!rawCall || rawCall.type !== "function") {
      log.warn("No tool call returned from GPT");
      return;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawCall.function.arguments);
    } catch {
      log.warn("Brand extraction: JSON parse failed");
      return;
    }

    const result = BrandSchema.safeParse(parsed);
    if (!result.success) {
      log.warn({ errors: result.error.errors }, "Brand extraction: schema validation failed");
      return;
    }

    const brand = result.data;

    // 4. Merge into existing client config (don't overwrite manually-set values)
    const [client] = await db
      .select({ config: clientsTable.config })
      .from(clientsTable)
      .where(eq(clientsTable.id, clientId))
      .limit(1);

    const existing = (client?.config ?? {}) as Record<string, unknown>;
    const updates: Record<string, unknown> = {};

    // Only set colors if not manually configured (non-empty string)
    if (!existing.primaryColor) updates.primaryColor = metaColor ?? brand.primaryColor;
    if (!existing.secondaryColor) updates.secondaryColor = brand.secondaryColor;
    if (!existing.heroHeadline) updates.heroHeadline = brand.heroHeadline;
    if (!existing.tagline && brand.tagline) updates.tagline = brand.tagline;
    // Only set industry if not already manually configured
    if (!existing.industry) updates.industry = brand.industry;
    // Logo: extracted from apple-touch-icon / SVG / Clearbit — only set if not already uploaded
    if (!existing.logoUrl && logoUrl) updates.logoUrl = logoUrl;
    if (ogImage) updates.heroImageUrl = ogImage;

    await db
      .update(clientsTable)
      .set({ config: { ...existing, ...updates } })
      .where(eq(clientsTable.id, clientId));

    log.info(
      { industry: brand.industry, primaryColor: updates.primaryColor ?? "(kept)", heroHeadline: updates.heroHeadline ?? "(kept)" },
      "Brand extraction complete",
    );
  } catch (err) {
    log.error({ err }, "Brand extractor: fatal error");
  }
}
