import OpenAI from "openai";
import { logger } from "./logger";

const openai = new OpenAI({
  baseURL: "https://api.openai.com/v1",
  apiKey: process.env.OPENAI_API_KEY ?? "placeholder",
});

const EMBEDDING_MODEL = "text-embedding-3-small";
const EMBEDDING_DIMS = 1536;

export async function embedText(text: string): Promise<number[] | null> {
  const input = text.slice(0, 8_000).replace(/\n+/g, " ").trim();
  if (!input) return null;
  try {
    const res = await openai.embeddings.create(
      { model: EMBEDDING_MODEL, input },
      { signal: AbortSignal.timeout(30_000) },
    );
    return res.data[0]?.embedding ?? null;
  } catch (err) {
    logger.error({ err }, "Embedder: failed to embed text");
    return null;
  }
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    dot += a[i]! * b[i]!;
    normA += a[i]! * a[i]!;
    normB += b[i]! * b[i]!;
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

export function embeddingToJson(embedding: number[]): string {
  return JSON.stringify(embedding);
}

export function jsonToEmbedding(json: string): number[] | null {
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed) || parsed.length !== EMBEDDING_DIMS) return null;
    return parsed as number[];
  } catch {
    return null;
  }
}
