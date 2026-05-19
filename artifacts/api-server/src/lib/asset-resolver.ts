import { db } from "@workspace/db";
import { companyKnowledgeTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { logger } from "./logger";

export interface AssetResolverResult {
  mediaUrls: string[];
  replyAppendText: string;
}

const EMPTY_RESULT: AssetResolverResult = { mediaUrls: [], replyAppendText: "" };

const MEDIA_ASSET_TYPES = new Set(["image", "pdf"]);
const LINK_ASSET_TYPES  = new Set(["calendly", "loom", "gmeet", "custom"]);

// Maps requestedAssetType values → which [ASSET:type] tags satisfy them
const ASSET_TYPE_MATCH: Record<string, Set<string>> = {
  price:    new Set(["pdf", "image"]),
  demo:     new Set(["loom"]),
  booking:  new Set(["calendly", "gmeet"]),
  brochure: new Set(["pdf"]),
};

interface ParsedAsset {
  assetType: string;
  label: string;
  url: string;
  serviceContext: string;
}

/**
 * Parse "[ASSET:type] emoji label: url (serviceContext)" from an answer string.
 * Returns null if the string does not match the asset entry format.
 */
function parseAssetAnswer(answer: string): ParsedAsset | null {
  // Match: [ASSET:<type>] <emoji?> <label>: <url> (optional serviceContext)
  const match = answer.match(/^\[ASSET:(\w+)\]\s*[\p{Emoji_Presentation}\p{Extended_Pictographic}]?\s*(.*?):\s*(https?:\/\/[^\s)]+)(.*)?$/u);
  if (!match) return null;

  const assetType = match[1]!;
  const label = match[2]!.trim();
  const url = match[3]!.replace(/[.,)]+$/, "").trim();
  const tail = (match[4] ?? "").trim();

  // Extract serviceContext from trailing parentheses: " (physiotherapy)"
  const ctxMatch = tail.match(/^\(([^)]+)\)/);
  const serviceContext = ctxMatch ? ctxMatch[1]!.trim() : "";

  return { assetType, label, url, serviceContext };
}

/**
 * Score an asset row against the requested service.
 * Higher score = better match.
 *   3 = exact serviceContext match
 *   2 = label / question / answer contains serviceRequested
 *   1 = asset type matches but no service-specific signal
 */
function scoreAsset(
  question: string,
  answer: string,
  parsed: ParsedAsset,
  serviceRequested: string | null | undefined,
): number {
  if (!serviceRequested) return 1;

  const sr = serviceRequested.toLowerCase();
  if (parsed.serviceContext && parsed.serviceContext.toLowerCase().includes(sr)) return 3;

  const haystack = [parsed.label, question, answer].join(" ").toLowerCase();
  if (haystack.includes(sr)) return 2;

  return 1;
}

/**
 * DB-driven asset resolver — queries ALL approved asset rows for this client
 * (no RAG cap), scores them, and returns the best match.
 *
 * Returns:
 *   mediaUrls       — for image/pdf assets: the URL to send as WhatsApp media
 *   replyAppendText — the URL to append to the bot reply (all types)
 */
export async function resolveAsset(
  clientId: number,
  requestedAssetType: string,
  serviceRequested: string | null | undefined,
): Promise<AssetResolverResult> {
  const targetTypes = ASSET_TYPE_MATCH[requestedAssetType];
  if (!targetTypes) return EMPTY_RESULT;

  const rows = await db
    .select()
    .from(companyKnowledgeTable)
    .where(
      and(
        eq(companyKnowledgeTable.clientId, clientId),
        eq(companyKnowledgeTable.category, "asset"),
        eq(companyKnowledgeTable.approvalStatus, "approved"),
      ),
    );

  const candidates = rows
    .map((row) => {
      const parsed = parseAssetAnswer(row.answer);
      if (!parsed || !targetTypes.has(parsed.assetType)) return null;
      const score = scoreAsset(row.question, row.answer, parsed, serviceRequested);
      return { parsed, score };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => b.score - a.score);

  if (candidates.length === 0) {
    logger.info({ clientId, requestedAssetType, serviceRequested }, "Asset resolver: no matching asset found");
    return EMPTY_RESULT;
  }

  const { parsed, score } = candidates[0]!;
  logger.info({ clientId, requestedAssetType, serviceRequested, url: parsed.url, score }, "Asset resolver: match found");

  const mediaUrls: string[] = [];
  let replyAppendText = "";

  if (MEDIA_ASSET_TYPES.has(parsed.assetType)) {
    // image / pdf → send as WhatsApp media AND append URL for accessibility
    mediaUrls.push(parsed.url);
    replyAppendText = parsed.url;
  } else if (LINK_ASSET_TYPES.has(parsed.assetType)) {
    // calendly / loom / gmeet / custom → append URL to reply only
    replyAppendText = parsed.url;
  }

  return { mediaUrls, replyAppendText };
}
