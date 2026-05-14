import { db } from "@workspace/db";
import { companyKnowledgeTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";

export interface KnowledgeChunk {
  question: string;
  answer: string;
}

/**
 * Retrieves top knowledge chunks for a client+language combo relevant to the
 * user's message. Uses simple keyword overlap scoring (no embeddings) to keep
 * cost and latency low — good enough for a structured knowledge base.
 */
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

  // Tokenise the user message into lowercase words (3+ chars)
  const tokens = userMessage
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length >= 3);

  if (tokens.length === 0) {
    // No useful tokens — return top-priority entries
    return allEntries.slice(0, topK).map((e) => ({ question: e.question, answer: e.answer }));
  }

  // Score each entry by how many tokens appear in the question+answer text
  const scored = allEntries.map((entry) => {
    const haystack = `${entry.question} ${entry.answer}`.toLowerCase();
    const score = tokens.reduce((acc, token) => acc + (haystack.includes(token) ? 1 : 0), 0);
    return { ...entry, score };
  });

  // Sort: keyword score desc, then priority desc for ties
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.priority - a.priority;
  });

  return scored.slice(0, topK).map((e) => ({ question: e.question, answer: e.answer }));
}
