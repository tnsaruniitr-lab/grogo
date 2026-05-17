import { db } from "@workspace/db";
import { crawlJobsTable, crawlPagesTable, companyKnowledgeTable } from "@workspace/db";
import { eq, and, inArray } from "drizzle-orm";
import { fetchPage, fetchRobotsTxt, fetchSitemapUrls, isAllowed, withConcurrency } from "./crawler";
import { extractKnowledge, deduplicateItems } from "./extractor";
import { embedText, embeddingToJson } from "./embedder";
import { extractBrand } from "./brand-extractor";
import { logger } from "./logger";

const MAX_PAGES = 50;
const MAX_DEPTH = 3;
const CONCURRENCY = 5;

const CATEGORY_PRIORITY: Record<string, number> = {
  contact: 10,
  pricing: 9,
  service: 8,
  faq: 7,
  process: 6,
  about: 5,
};

export async function startCrawlJob(
  clientId: number,
  websiteUrl: string,
): Promise<number> {
  const [job] = await db
    .insert(crawlJobsTable)
    .values({ clientId, status: "queued" })
    .returning({ id: crawlJobsTable.id });
  return job!.id;
}

export async function getLatestCrawlJob(clientId: number) {
  const [job] = await db
    .select()
    .from(crawlJobsTable)
    .where(eq(crawlJobsTable.clientId, clientId))
    .orderBy(crawlJobsTable.createdAt)
    .limit(1);
  return job ?? null;
}

export async function runCrawlPipeline(
  clientId: number,
  websiteUrl: string,
  jobId: number,
): Promise<void> {
  const log = logger.child({ clientId, jobId });
  log.info({ websiteUrl }, "Crawl pipeline starting");

  try {
    await db
      .update(crawlJobsTable)
      .set({ status: "running", startedAt: new Date() })
      .where(eq(crawlJobsTable.id, jobId));

    const origin = new URL(websiteUrl).origin;
    const [disallowed, sitemapUrls] = await Promise.all([
      fetchRobotsTxt(origin),
      fetchSitemapUrls(origin),
    ]);
    log.info({ disallowed, sitemapCount: sitemapUrls.length }, "Robots.txt + sitemap parsed");

    // Wipe previous crawl knowledge for this client (keep manual entries)
    await db
      .delete(companyKnowledgeTable)
      .where(
        and(
          eq(companyKnowledgeTable.clientId, clientId),
          eq(companyKnowledgeTable.source, "crawl"),
        ),
      );

    // Seed: homepage first, then sitemap URLs (up to MAX_PAGES cap)
    const homepageUrl = origin + new URL(websiteUrl).pathname.replace(/\/$/, "");
    const discovered = new Set<string>([homepageUrl]);
    const queued: Array<{ url: string; depth: number }> = [{ url: homepageUrl, depth: 0 }];
    let totalChunks = 0;

    // Insert initial page row
    await db.insert(crawlPagesTable).values({
      clientId,
      jobId,
      url: homepageUrl,
      depth: 0,
      status: "pending",
    });

    // Seed sitemap URLs that pass filters and aren't the homepage
    const filteredSitemap = sitemapUrls
      .filter((u) => u !== homepageUrl && !discovered.has(u) && isAllowed(u, disallowed))
      .slice(0, MAX_PAGES - 1);

    if (filteredSitemap.length > 0) {
      for (const u of filteredSitemap) {
        discovered.add(u);
        queued.push({ url: u, depth: 1 });
      }
      await db.insert(crawlPagesTable).values(
        filteredSitemap.map((u) => ({
          clientId,
          jobId,
          url: u,
          depth: 1,
          status: "pending" as const,
        })),
      );
      log.info({ count: filteredSitemap.length }, "Seeded pages from sitemap");
    }

    await db
      .update(crawlJobsTable)
      .set({ pagesFound: discovered.size })
      .where(eq(crawlJobsTable.id, jobId));

    // BFS crawl
    while (queued.length > 0 && discovered.size <= MAX_PAGES) {
      const batch = queued.splice(0, CONCURRENCY);

      await withConcurrency(batch, CONCURRENCY, async ({ url, depth }) => {
        if (!isAllowed(url, disallowed)) {
          await db
            .update(crawlPagesTable)
            .set({ status: "skipped", lastError: "robots_disallowed", crawledAt: new Date() })
            .where(and(eq(crawlPagesTable.jobId, jobId), eq(crawlPagesTable.url, url)));

          await db
            .update(crawlJobsTable)
            .set({ pagesSkipped: db.$count(crawlPagesTable, and(eq(crawlPagesTable.jobId, jobId), eq(crawlPagesTable.status, "skipped"))) as unknown as number })
            .where(eq(crawlJobsTable.id, jobId));
          return;
        }

        // Mark as fetching
        await db
          .update(crawlPagesTable)
          .set({ status: "fetching", attemptCount: 1 })
          .where(and(eq(crawlPagesTable.jobId, jobId), eq(crawlPagesTable.url, url)));

        const result = await fetchPage(url);

        if (result.status === "skipped") {
          await db
            .update(crawlPagesTable)
            .set({ status: "skipped", lastError: result.error, crawledAt: new Date() })
            .where(and(eq(crawlPagesTable.jobId, jobId), eq(crawlPagesTable.url, url)));
          return;
        }

        if (result.status === "failed") {
          await db
            .update(crawlPagesTable)
            .set({ status: "failed", lastError: result.error, crawledAt: new Date() })
            .where(and(eq(crawlPagesTable.jobId, jobId), eq(crawlPagesTable.url, url)));

          const failCount = await db.$count(
            crawlPagesTable,
            and(eq(crawlPagesTable.jobId, jobId), eq(crawlPagesTable.status, "failed")),
          );
          await db
            .update(crawlJobsTable)
            .set({ pagesFailed: failCount })
            .where(eq(crawlJobsTable.id, jobId));
          log.warn({ url, error: result.error }, "Page fetch failed");
          return;
        }

        // Successful fetch — discover new links
        if (depth < MAX_DEPTH) {
          const newLinks = result.links.filter(
            (l) => !discovered.has(l) && discovered.size < MAX_PAGES,
          );
          for (const link of newLinks) {
            discovered.add(link);
            queued.push({ url: link, depth: depth + 1 });
            await db.insert(crawlPagesTable).values({
              clientId,
              jobId,
              url: link,
              depth: depth + 1,
              status: "pending",
            });
          }

          if (newLinks.length > 0) {
            await db
              .update(crawlJobsTable)
              .set({ pagesFound: discovered.size })
              .where(eq(crawlJobsTable.id, jobId));
          }
        }

        // Save raw text
        await db
          .update(crawlPagesTable)
          .set({
            pageTitle: result.title,
            rawText: result.text,
            crawledAt: new Date(),
          })
          .where(and(eq(crawlPagesTable.jobId, jobId), eq(crawlPagesTable.url, url)));

        // Extract structured knowledge
        const items = await extractKnowledge(result.text, url);
        const unique = deduplicateItems(items);

        if (unique.length === 0) {
          await db
            .update(crawlPagesTable)
            .set({ status: "extracted_empty", chunksExtracted: 0, extractedAt: new Date() })
            .where(and(eq(crawlPagesTable.jobId, jobId), eq(crawlPagesTable.url, url)));
        } else {
          // Embed and insert knowledge rows
          for (const item of unique) {
            const embeddingInput = `${item.question} ${item.answer}`;
            const embedding = await embedText(embeddingInput);
            const embeddingJson = embedding ? embeddingToJson(embedding) : null;

            await db.insert(companyKnowledgeTable).values({
              clientId,
              category: item.category,
              question: item.question,
              answer: item.answer,
              language: item.language,
              priority: CATEGORY_PRIORITY[item.category] ?? 5,
              source: "crawl",
              sourceUrl: url,
              confidence: item.confidence,
              embeddingJson,
            });
          }

          totalChunks += unique.length;

          await db
            .update(crawlPagesTable)
            .set({
              status: "extracted",
              chunksExtracted: unique.length,
              extractedAt: new Date(),
            })
            .where(and(eq(crawlPagesTable.jobId, jobId), eq(crawlPagesTable.url, url)));

          const crawledCount = await db.$count(
            crawlPagesTable,
            and(
              eq(crawlPagesTable.jobId, jobId),
              inArray(crawlPagesTable.status, ["extracted", "extracted_empty"]),
            ),
          );
          await db
            .update(crawlJobsTable)
            .set({ pagesCrawled: crawledCount, chunksExtracted: totalChunks })
            .where(eq(crawlJobsTable.id, jobId));
        }

        log.info({ url, chunks: unique.length }, "Page processed");
      });
    }

    // Final status
    const [finalJob] = await db
      .select()
      .from(crawlJobsTable)
      .where(eq(crawlJobsTable.id, jobId))
      .limit(1);

    const finalStatus =
      finalJob!.pagesFailed > 0 && finalJob!.pagesCrawled === 0
        ? "failed"
        : finalJob!.pagesFailed > 0
          ? "partial"
          : "completed";

    const errorSummary =
      finalStatus === "failed"
        ? "All pages failed to crawl — site may be blocking bots or JS-rendered"
        : finalStatus === "partial"
          ? `${finalJob!.pagesFailed} page(s) failed to crawl (bot blocking or JS-rendering)`
          : null;

    await db
      .update(crawlJobsTable)
      .set({
        status: finalStatus,
        completedAt: new Date(),
        chunksExtracted: totalChunks,
        pagesFound: discovered.size,
        errorSummary,
      })
      .where(eq(crawlJobsTable.id, jobId));

    log.info(
      {
        status: finalStatus,
        pagesFound: discovered.size,
        pagesCrawled: finalJob!.pagesCrawled,
        chunksExtracted: totalChunks,
      },
      "Crawl pipeline complete",
    );

    // Auto-extract brand colors + headline after successful crawl
    if (finalStatus !== "failed") {
      await extractBrand(clientId, websiteUrl);
    }
  } catch (err) {
    logger.error({ err, clientId, jobId }, "Crawl pipeline fatal error");
    await db
      .update(crawlJobsTable)
      .set({
        status: "failed",
        completedAt: new Date(),
        errorSummary: `Fatal error: ${err instanceof Error ? err.message : String(err)}`,
      })
      .where(eq(crawlJobsTable.id, jobId));
  }
}
