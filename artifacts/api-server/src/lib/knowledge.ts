import { db } from "@workspace/db";
import { companyKnowledgeTable } from "@workspace/db";
import { eq, desc, and } from "drizzle-orm";
import { embedText, cosineSimilarity, jsonToEmbedding } from "./embedder";
import { logger } from "./logger";

export interface KnowledgeChunk {
  question: string;
  answer: string;
}

export async function retrieveKnowledge(
  clientId: number,
  language: string,
  userMessage: string,
  topK = 5,
): Promise<KnowledgeChunk[]> {
  // Always retrieve across ALL client KB entries regardless of language.
  // Retrieval is a relevance problem, not a language problem — language is
  // handled at the GPT response layer (language lock in system prompt).
  // Same-language entries get a 10% score boost so they're preferred when
  // relevance is equal, but a more relevant cross-language entry always wins.
  const allEntries = await db
    .select({
      id: companyKnowledgeTable.id,
      question: companyKnowledgeTable.question,
      answer: companyKnowledgeTable.answer,
      priority: companyKnowledgeTable.priority,
      embeddingJson: companyKnowledgeTable.embeddingJson,
      language: companyKnowledgeTable.language,
      category: companyKnowledgeTable.category,
      source: companyKnowledgeTable.source,
    })
    .from(companyKnowledgeTable)
    .where(
      and(
        eq(companyKnowledgeTable.clientId, clientId),
        eq(companyKnowledgeTable.approvalStatus, "approved"),
      ),
    )
    .orderBy(desc(companyKnowledgeTable.priority));

  if (allEntries.length === 0) return [];

  // Facts pack: always inject one entry from each of these categories as a
  // fixed prefix, regardless of semantic relevance. This gives GPT a stable
  // company identity + core offer + booking path on every single turn.
  // Precedence within each category: highest priority first, then by id desc.
  // The pinned entries are deduped from the semantic pool so they never repeat.
  const FACTS_PACK_CATEGORIES = ["identity", "about", "process"] as const;

  const pinnedEntries: EntryWithMeta[] = [];
  for (const cat of FACTS_PACK_CATEGORIES) {
    const match = allEntries.find((e) => e.category === cat);
    if (match) pinnedEntries.push(match);
  }

  // Asset pack: always inject ALL category="asset" entries (capped at 5) so
  // the bot knows every available demo resource on every turn. Assets are short
  // (label + URL) and must not compete with semantic scoring — they are
  // appended after the semantic chunks so GPT can reference them whenever a
  // prospect asks for a demo, pricing, booking link, or video.
  const assetEntries = allEntries.filter((e) => e.category === "asset").slice(0, 5);
  const assetIds = new Set(assetEntries.map((e) => e.id));

  if (assetEntries.length > 0) {
    logger.info(
      { assets: assetEntries.map((e) => ({ id: e.id, q: e.question.slice(0, 60) })) },
      "Knowledge: asset pack injected",
    );
  }

  const pinnedIds = new Set(pinnedEntries.map((e) => e.id));
  // Exclude both facts-pack and asset-pack entries from the semantic pool so
  // they are never double-counted.
  const semanticPool = allEntries.filter((e) => !pinnedIds.has(e.id) && !assetIds.has(e.id));
  const semanticTopK = Math.max(topK - pinnedEntries.length, 1);

  const hasEmbeddings = semanticPool.some((e) => e.embeddingJson != null);

  const semanticChunks =
    semanticPool.length === 0
      ? []
      : hasEmbeddings
        ? await retrieveByEmbedding(semanticPool, userMessage, language, semanticTopK)
        : retrieveByKeyword(semanticPool, userMessage, language, semanticTopK);

  if (pinnedEntries.length > 0) {
    logger.info(
      { pinned: pinnedEntries.map((e) => ({ id: e.id, cat: e.category, q: e.question.slice(0, 50) })) },
      "Knowledge: facts pack injected",
    );
  }

  return [
    ...pinnedEntries.map((e) => ({ question: e.question, answer: e.answer })),
    ...semanticChunks,
    ...assetEntries.map((e) => ({ question: e.question, answer: e.answer })),
  ];
}

type EntryWithMeta = {
  id: number;
  question: string;
  answer: string;
  priority: number;
  embeddingJson: string | null;
  language: string;
  category: string;
  source: string;
};

async function retrieveByEmbedding(
  entries: EntryWithMeta[],
  userMessage: string,
  conversationLanguage: string,
  topK: number,
): Promise<KnowledgeChunk[]> {
  const queryEmbedding = await embedText(userMessage);

  if (!queryEmbedding) {
    logger.warn("Embedding query failed — falling back to keyword search");
    return retrieveByKeyword(entries, userMessage, conversationLanguage, topK);
  }

  const scored = entries.map((entry) => {
    let score: number;
    if (!entry.embeddingJson) {
      // Entry has no embedding: use keyword score normalised to [0, 0.6] so it
      // can still compete against low-relevance embedded entries but won't
      // beat a genuinely relevant embedded entry (cosine typically 0.7–0.95).
      const tokens = userMessage.toLowerCase().split(/\W+/).filter((w) => w.length >= 3);
      const haystack = `${entry.question} ${entry.answer}`.toLowerCase();
      const hits = tokens.reduce((acc, t) => acc + (haystack.includes(t) ? 1 : 0), 0);
      const maxHits = Math.max(tokens.length, 1);
      score = (hits / maxHits) * 0.6;
    } else {
      const vec = jsonToEmbedding(entry.embeddingJson);
      score = vec ? cosineSimilarity(queryEmbedding, vec) : 0;
    }
    // Boost same-language entries by 10% so they're preferred when relevance is equal.
    if (entry.language === conversationLanguage) score *= 1.1;
    // Boost manually-authored entries by 8% over crawl content — human-written
    // answers are more reliable and should win ties against crawled text.
    if (entry.source === "manual") score *= 1.08;
    return { ...entry, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const top = scored.slice(0, topK);
  logger.info(
    {
      conversationLanguage,
      totalEntries: entries.length,
      retrieved: top.map((e) => ({
        id: e.id,
        lang: e.language,
        category: e.category,
        source: e.source,
        score: Math.round(e.score * 1000) / 1000,
        q: e.question.slice(0, 60),
      })),
    },
    "Knowledge retrieval complete",
  );

  return top.map((e) => ({ question: e.question, answer: e.answer }));
}

function retrieveByKeyword(
  entries: EntryWithMeta[],
  userMessage: string,
  conversationLanguage: string,
  topK: number,
): KnowledgeChunk[] {
  const tokens = userMessage
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length >= 3);

  if (tokens.length === 0) {
    return entries.slice(0, topK).map((e) => ({ question: e.question, answer: e.answer }));
  }

  const scored = entries.map((entry) => {
    const haystack = `${entry.question} ${entry.answer}`.toLowerCase();
    const hits = tokens.reduce((acc, token) => acc + (haystack.includes(token) ? 1 : 0), 0);
    const maxHits = Math.max(tokens.length, 1);
    let score = hits / maxHits;
    if (entry.language === conversationLanguage) score *= 1.1;
    if (entry.source === "manual") score *= 1.08;
    return { ...entry, score };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.priority - a.priority;
  });

  const top = scored.slice(0, topK);
  logger.info(
    {
      conversationLanguage,
      totalEntries: entries.length,
      retrieved: top.map((e) => ({
        id: e.id,
        lang: e.language,
        category: e.category,
        source: e.source,
        score: Math.round(e.score * 1000) / 1000,
        q: e.question.slice(0, 60),
      })),
    },
    "Knowledge retrieval complete (keyword)",
  );

  return top.map((e) => ({ question: e.question, answer: e.answer }));
}
