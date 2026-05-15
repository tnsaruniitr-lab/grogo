import { db } from "@workspace/db";
import { companyKnowledgeTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { embedText, cosineSimilarity, jsonToEmbedding } from "./embedder";
import { logger } from "./logger";

export interface KnowledgeChunk {
  question: string;
  answer: string;
}

async function fetchEntriesForLanguage(
  clientId: number,
  language: string,
): Promise<Array<{ question: string; answer: string; priority: number; embeddingJson: string | null }>> {
  return db
    .select({
      question: companyKnowledgeTable.question,
      answer: companyKnowledgeTable.answer,
      priority: companyKnowledgeTable.priority,
      embeddingJson: companyKnowledgeTable.embeddingJson,
    })
    .from(companyKnowledgeTable)
    .where(
      and(
        eq(companyKnowledgeTable.clientId, clientId),
        eq(companyKnowledgeTable.language, language),
      ),
    )
    .orderBy(desc(companyKnowledgeTable.priority));
}

export async function retrieveKnowledge(
  clientId: number,
  language: string,
  userMessage: string,
  topK = 5,
): Promise<KnowledgeChunk[]> {
  let primaryEntries = await fetchEntriesForLanguage(clientId, language);

  // Cross-language supplement: always pull ALL client entries and rank by
  // semantic similarity. Same-language entries get a score boost so they're
  // preferred, but entries in other languages fill the gaps when there aren't
  // enough primary-language entries for the question (e.g. an EN user asking
  // about services when only DE knowledge exists, or pricing only added in EN).
  const allClientEntries = await db
    .select({
      question: companyKnowledgeTable.question,
      answer: companyKnowledgeTable.answer,
      priority: companyKnowledgeTable.priority,
      embeddingJson: companyKnowledgeTable.embeddingJson,
      language: companyKnowledgeTable.language,
    })
    .from(companyKnowledgeTable)
    .where(eq(companyKnowledgeTable.clientId, clientId))
    .orderBy(desc(companyKnowledgeTable.priority));

  if (allClientEntries.length === 0) return [];

  // If primary-language entries cover at least topK results, use only those
  // for tighter, more language-appropriate answers.
  const workingSet =
    primaryEntries.length >= topK
      ? primaryEntries.map((e) => ({ ...e, language }))
      : allClientEntries; // cross-language pool

  const hasEmbeddings = workingSet.some((e) => e.embeddingJson != null);

  if (hasEmbeddings) {
    return retrieveByEmbedding(workingSet, userMessage, language, topK);
  }

  return retrieveByKeyword(workingSet, userMessage, topK);
}

async function retrieveByEmbedding(
  entries: Array<{ question: string; answer: string; priority: number; embeddingJson: string | null; language: string }>,
  userMessage: string,
  conversationLanguage: string,
  topK: number,
): Promise<KnowledgeChunk[]> {
  const queryEmbedding = await embedText(userMessage);

  if (!queryEmbedding) {
    logger.warn("Embedding query failed — falling back to keyword search");
    return retrieveByKeyword(entries, userMessage, topK);
  }

  const scored = entries.map((entry) => {
    let score: number;
    if (!entry.embeddingJson) {
      const tokens = userMessage.toLowerCase().split(/\W+/).filter((w) => w.length >= 3);
      const haystack = `${entry.question} ${entry.answer}`.toLowerCase();
      const keyScore = tokens.reduce((acc, t) => acc + (haystack.includes(t) ? 1 : 0), 0);
      score = keyScore * 0.3;
    } else {
      const vec = jsonToEmbedding(entry.embeddingJson);
      score = vec ? cosineSimilarity(queryEmbedding, vec) : 0;
    }
    // Boost same-language entries by 10% so they rank above equally-relevant
    // cross-language entries when the pool is mixed.
    if (entry.language === conversationLanguage) score *= 1.1;
    return { ...entry, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map((e) => ({ question: e.question, answer: e.answer }));
}

function retrieveByKeyword(
  entries: Array<{ question: string; answer: string; priority: number }>,
  userMessage: string,
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
    const score = tokens.reduce((acc, token) => acc + (haystack.includes(token) ? 1 : 0), 0);
    return { ...entry, score };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.priority - a.priority;
  });

  return scored.slice(0, topK).map((e) => ({ question: e.question, answer: e.answer }));
}
