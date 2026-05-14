import { db } from "@workspace/db";
import { companyKnowledgeTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
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
  const allEntries = await db
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

  if (allEntries.length === 0) return [];

  const hasEmbeddings = allEntries.some((e) => e.embeddingJson != null);

  if (hasEmbeddings) {
    return retrieveByEmbedding(allEntries, userMessage, topK);
  }

  return retrieveByKeyword(allEntries, userMessage, topK);
}

async function retrieveByEmbedding(
  entries: Array<{ question: string; answer: string; priority: number; embeddingJson: string | null }>,
  userMessage: string,
  topK: number,
): Promise<KnowledgeChunk[]> {
  const queryEmbedding = await embedText(userMessage);

  if (!queryEmbedding) {
    logger.warn("Embedding query failed — falling back to keyword search");
    return retrieveByKeyword(entries, userMessage, topK);
  }

  const scored = entries.map((entry) => {
    if (!entry.embeddingJson) {
      const tokens = userMessage.toLowerCase().split(/\W+/).filter((w) => w.length >= 3);
      const haystack = `${entry.question} ${entry.answer}`.toLowerCase();
      const keyScore = tokens.reduce((acc, t) => acc + (haystack.includes(t) ? 1 : 0), 0);
      return { ...entry, score: keyScore * 0.3 };
    }
    const vec = jsonToEmbedding(entry.embeddingJson);
    if (!vec) return { ...entry, score: 0 };
    return { ...entry, score: cosineSimilarity(queryEmbedding, vec) };
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
