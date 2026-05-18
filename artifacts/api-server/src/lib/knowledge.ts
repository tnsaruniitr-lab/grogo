import { db } from "@workspace/db";
import { companyKnowledgeTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
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
    .where(eq(companyKnowledgeTable.clientId, clientId))
    .orderBy(desc(companyKnowledgeTable.priority));

  if (allEntries.length === 0) return [];

  // Pinned identity slot: always include the highest-priority identity entry
  // regardless of semantic relevance. This prevents "who are you?" drift on
  // every turn — the bot always has its core identity in context.
  // The pinned entry occupies slot 0; semantic retrieval fills the remaining
  // topK-1 slots (deduped so the pinned entry never appears twice).
  const identityEntry = allEntries.find((e) => e.category === "identity") ?? null;

  const semanticEntries = identityEntry
    ? allEntries.filter((e) => e.id !== identityEntry.id)
    : allEntries;

  const semanticTopK = identityEntry ? topK - 1 : topK;

  const hasEmbeddings = semanticEntries.some((e) => e.embeddingJson != null);

  const semanticChunks = hasEmbeddings
    ? await retrieveByEmbedding(semanticEntries, userMessage, language, semanticTopK)
    : retrieveByKeyword(semanticEntries, userMessage, language, semanticTopK);

  if (!identityEntry) return semanticChunks;

  const pinnedChunk: KnowledgeChunk = {
    question: identityEntry.question,
    answer: identityEntry.answer,
  };

  logger.info(
    { id: identityEntry.id, lang: identityEntry.language, q: identityEntry.question.slice(0, 60) },
    "Knowledge: pinned identity slot injected",
  );

  return [pinnedChunk, ...semanticChunks];
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
