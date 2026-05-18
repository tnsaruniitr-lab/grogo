import { db } from "@workspace/db";
import { systemSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "./logger";

export interface SystemSettings {
  pageExtractionModel: string;
  profileSynthesisModel: string;
  webResearchModel: string;
  liveChatModel: string;
  embeddingModel: string;
  extractorVersion: "v1" | "v2";
  maxPagesPerCrawl: number;
  crawlConcurrency: number;
  enableStructuredDataParsing: boolean;
  enableJsRenderFallback: boolean;
  minTextWordsBeforeJsFallback: number;
  requireHumanActivation: boolean;
  allowAutoApproveManualEntries: boolean;
  minExtractionConfidence: number;
  riskFlagsBlockingActivation: string[];
  enableWebResearch: boolean;
  fieldsToResearch: string[];
  requireExternalSourceReview: boolean;
  ownDomainAutoTrusted: boolean;
  approvedOnlyForLiveChat: boolean;
  factsPackEnabled: boolean;
  sameLanguageBoost: boolean;
  manualSourceBoost: boolean;
}

export const DEFAULT_SETTINGS: SystemSettings = {
  pageExtractionModel: "gpt-4o-mini",
  profileSynthesisModel: "gpt-4o",
  webResearchModel: "gpt-4o",
  liveChatModel: "gpt-4o-mini",
  embeddingModel: "text-embedding-3-small",
  extractorVersion: "v1",
  maxPagesPerCrawl: 50,
  crawlConcurrency: 5,
  enableStructuredDataParsing: true,
  enableJsRenderFallback: false,
  minTextWordsBeforeJsFallback: 100,
  requireHumanActivation: true,
  allowAutoApproveManualEntries: true,
  minExtractionConfidence: 0.6,
  riskFlagsBlockingActivation: [],
  enableWebResearch: false,
  fieldsToResearch: ["pricingPolicy", "geography", "trustSignals", "whatItDoes"],
  requireExternalSourceReview: true,
  ownDomainAutoTrusted: true,
  approvedOnlyForLiveChat: true,
  factsPackEnabled: true,
  sameLanguageBoost: true,
  manualSourceBoost: true,
};

const ALLOWED_MODELS = [
  "gpt-4o-mini",
  "gpt-4o",
  "gpt-4o-search-preview",
  "o3-mini",
  "o3",
  "o4-mini",
] as const;

export const ALLOWED_MODEL_VALUES = ALLOWED_MODELS as unknown as string[];

let _cache: SystemSettings | null = null;

export async function getSettings(): Promise<SystemSettings> {
  if (_cache) return _cache;
  try {
    const [row] = await db
      .select()
      .from(systemSettingsTable)
      .where(eq(systemSettingsTable.id, "global"))
      .limit(1);
    if (!row) {
      _cache = { ...DEFAULT_SETTINGS };
      return _cache;
    }
    const parsed = JSON.parse(row.settings) as Partial<SystemSettings>;
    _cache = { ...DEFAULT_SETTINGS, ...parsed };
    return _cache;
  } catch (err) {
    logger.warn({ err }, "Settings load failed — using defaults");
    return { ...DEFAULT_SETTINGS };
  }
}

export async function updateSettings(patch: Partial<SystemSettings>): Promise<SystemSettings> {
  const current = await getSettings();
  const next = { ...current, ...patch };
  const json = JSON.stringify(next);
  await db
    .insert(systemSettingsTable)
    .values({ id: "global", settings: json })
    .onConflictDoUpdate({ target: systemSettingsTable.id, set: { settings: json } });
  _cache = next;
  logger.info({ patch: Object.keys(patch) }, "Settings updated");
  return next;
}

export function invalidateSettingsCache(): void {
  _cache = null;
}
