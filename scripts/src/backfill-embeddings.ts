import { db, companyKnowledgeTable } from "@workspace/db";
import { isNull, eq } from "drizzle-orm";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY ?? "placeholder",
});

const BATCH_SIZE = 20;
const DELAY_MS = 500;

async function embedText(text: string): Promise<number[] | null> {
  const input = text.slice(0, 8_000).replace(/\n+/g, " ").trim();
  if (!input) return null;
  try {
    const res = await openai.embeddings.create({ model: "text-embedding-3-small", input });
    return res.data[0]?.embedding ?? null;
  } catch (err) {
    console.error("Embed failed:", err);
    return null;
  }
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const rows = await db
    .select({
      id: companyKnowledgeTable.id,
      question: companyKnowledgeTable.question,
      answer: companyKnowledgeTable.answer,
    })
    .from(companyKnowledgeTable)
    .where(isNull(companyKnowledgeTable.embeddingJson));

  console.log(`Found ${rows.length} entries missing embeddings`);

  let done = 0;
  let failed = 0;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map(async (row) => {
        const input = `${row.question} ${row.answer}`;
        const vec = await embedText(input);
        if (!vec) {
          failed++;
          console.warn(`  SKIP id=${row.id} — embed returned null`);
          return;
        }
        await db
          .update(companyKnowledgeTable)
          .set({ embeddingJson: JSON.stringify(vec) })
          .where(eq(companyKnowledgeTable.id, row.id));
        done++;
      }),
    );

    console.log(`  [${Math.min(i + BATCH_SIZE, rows.length)}/${rows.length}] embedded`);
    if (i + BATCH_SIZE < rows.length) await sleep(DELAY_MS);
  }

  console.log(`\nDone. ${done} embedded, ${failed} failed.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
