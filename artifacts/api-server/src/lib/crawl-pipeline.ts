import { db } from "@workspace/db";
import { crawlJobsTable, crawlPagesTable, companyKnowledgeTable, clientsTable } from "@workspace/db";
import { eq, and, inArray, desc } from "drizzle-orm";
import { fetchPage, fetchRobotsTxt, fetchSitemapUrls, isAllowed, withLiveQueue } from "./crawler";
import { extractKnowledge, deduplicateItems } from "./extractor";
import { extractKnowledgeV2, deduplicateV2Items } from "./extractor-v2";
import { synthesizeProfile } from "./profile-synthesizer";
import { embedText, embeddingToJson } from "./embedder";
import { extractBrand } from "./brand-extractor";
import { getSettings } from "./settings";
import { logger } from "./logger";

const MAX_DEPTH = 3;

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
  const settings = await getSettings();
  const [job] = await db
    .insert(crawlJobsTable)
    .values({
      clientId,
      status: "queued",
      extractorVersion: settings.extractorVersion,
      settingsSnapshot: JSON.stringify(settings),
    })
    .returning({ id: crawlJobsTable.id });
  return job!.id;
}

export async function getLatestCrawlJob(clientId: number) {
  const [job] = await db
    .select()
    .from(crawlJobsTable)
    .where(eq(crawlJobsTable.clientId, clientId))
    .orderBy(desc(crawlJobsTable.createdAt))
    .limit(1);
  return job ?? null;
}

export async function runCrawlPipeline(
  clientId: number,
  websiteUrl: string,
  jobId: number,
): Promise<void> {
  // Load settings from the job's snapshot so mid-crawl setting changes don't affect this run
  const [jobRow] = await db
    .select({ settingsSnapshot: crawlJobsTable.settingsSnapshot, extractorVersion: crawlJobsTable.extractorVersion })
    .from(crawlJobsTable)
    .where(eq(crawlJobsTable.id, jobId))
    .limit(1);

  const { DEFAULT_SETTINGS } = await import("./settings");
  const settings = jobRow?.settingsSnapshot
    ? { ...DEFAULT_SETTINGS, ...(JSON.parse(jobRow.settingsSnapshot) as Partial<typeof DEFAULT_SETTINGS>) }
    : await getSettings();

  const MAX_PAGES = settings.maxPagesPerCrawl;
  const CONCURRENCY = settings.crawlConcurrency;
  const isV2 = (jobRow?.extractorVersion ?? settings.extractorVersion) === "v2";

  // Resolve which languages this client wants — only extract facts in those languages
  const [clientRow] = await db
    .select({ languagePrimary: clientsTable.languagePrimary, languageSecondary: clientsTable.languageSecondary })
    .from(clientsTable)
    .where(eq(clientsTable.id, clientId))
    .limit(1);

  const allowedLanguages = new Set<string>(
    [clientRow?.languagePrimary, clientRow?.languageSecondary].filter(Boolean) as string[],
  );

  const log = logger.child({ clientId, jobId, extractorVersion: isV2 ? "v2" : "v1" });
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

    // V1: wipe previous crawl knowledge (keep manual entries)
    // V2: non-destructive — old approved rows stay live; new rows are written as pending with crawlJobId
    if (!isV2) {
      await db
        .delete(companyKnowledgeTable)
        .where(
          and(
            eq(companyKnowledgeTable.clientId, clientId),
            eq(companyKnowledgeTable.source, "crawl"),
          ),
        );
    }

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

    // Dynamic worker pool — drains the live shared queue so workers immediately
    // pick up newly discovered pages. MAX_PAGES is enforced only in link-discovery below.
    // Per-page try-catch isolates failures so one bad page cannot kill a worker.
    await withLiveQueue(queued, CONCURRENCY, async ({ url, depth }) => {
      try {
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

        // Extract structured knowledge — route to v1 or v2 extractor
        let uniqueLength = 0;
        if (isV2) {
          const v2Items = await extractKnowledgeV2(result.text, url);
          const deduped = deduplicateV2Items(v2Items);
          const unique = deduped.filter((item) => allowedLanguages.has(item.language));
          const filtered = deduped.length - unique.length;
          if (filtered > 0) log.info({ url, filtered, allowedLanguages: [...allowedLanguages] }, "Language filter dropped items");
          uniqueLength = unique.length;

          if (unique.length > 0) {
            // Embed all items in parallel — eliminates the serial bottleneck
            const embeddings = await Promise.all(
              unique.map((item) => embedText(`${item.question} ${item.answer}`)),
            );

            // Single batch insert instead of N round-trips
            await db.insert(companyKnowledgeTable).values(
              unique.map((item, i) => ({
                clientId,
                category: item.category,
                question: item.question,
                answer: item.answer,
                language: item.language,
                priority: CATEGORY_PRIORITY[item.category] ?? 5,
                source: "crawl" as const,
                sourceUrl: url,
                confidence: item.confidence,
                embeddingJson: embeddings[i] ? embeddingToJson(embeddings[i]!) : null,
                approvalStatus: "pending" as const,
                crawlJobId: jobId,
                reviewKey: item.reviewKey ?? null,
                evidenceQuote: item.evidenceQuote ?? null,
                sourceSection: item.sourceSection ?? null,
                riskFlags: item.riskFlags && item.riskFlags.length > 0 ? JSON.stringify(item.riskFlags) : null,
              })),
            );
          }
        } else {
          const items = await extractKnowledge(result.text, url);
          const deduped = deduplicateItems(items);
          const unique = deduped.filter((item) => allowedLanguages.has(item.language));
          const filtered = deduped.length - unique.length;
          if (filtered > 0) log.info({ url, filtered, allowedLanguages: [...allowedLanguages] }, "Language filter dropped items");
          uniqueLength = unique.length;

          if (unique.length > 0) {
            // Embed all items in parallel
            const embeddings = await Promise.all(
              unique.map((item) => embedText(`${item.question} ${item.answer}`)),
            );

            // Single batch insert
            await db.insert(companyKnowledgeTable).values(
              unique.map((item, i) => ({
                clientId,
                category: item.category,
                question: item.question,
                answer: item.answer,
                language: item.language,
                priority: CATEGORY_PRIORITY[item.category] ?? 5,
                source: "crawl" as const,
                sourceUrl: url,
                confidence: item.confidence,
                embeddingJson: embeddings[i] ? embeddingToJson(embeddings[i]!) : null,
                approvalStatus: "approved" as const, // V1: auto-approved so bot sees them immediately
              })),
            );
          }
        }

        if (uniqueLength === 0) {
          await db
            .update(crawlPagesTable)
            .set({ status: "extracted_empty", chunksExtracted: 0, extractedAt: new Date() })
            .where(and(eq(crawlPagesTable.jobId, jobId), eq(crawlPagesTable.url, url)));
        } else {
          const unique = { length: uniqueLength };

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

        log.info({ url, chunks: uniqueLength }, "Page processed");
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        log.warn({ url, error: msg }, "Page processing error — skipping");
        try {
          await db
            .update(crawlPagesTable)
            .set({ status: "failed", lastError: msg.slice(0, 200), crawledAt: new Date() })
            .where(and(eq(crawlPagesTable.jobId, jobId), eq(crawlPagesTable.url, url)));
          const failCount = await db.$count(
            crawlPagesTable,
            and(eq(crawlPagesTable.jobId, jobId), eq(crawlPagesTable.status, "failed")),
          );
          await db
            .update(crawlJobsTable)
            .set({ pagesFailed: failCount })
            .where(eq(crawlJobsTable.id, jobId));
        } catch {
          // ignore DB errors during failure marking
        }
      }
    });

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

    // Auto-approve all pending chunks from this job so the bot can use them
    // immediately — covers both completed and partial (fallback: don't lose data
    // that was already extracted if the crawl was interrupted mid-way)
    if (isV2 && finalStatus !== "failed" && totalChunks > 0) {
      const { rowCount } = await db
        .update(companyKnowledgeTable)
        .set({ approvalStatus: "approved" })
        .where(
          and(
            eq(companyKnowledgeTable.crawlJobId, jobId),
            eq(companyKnowledgeTable.approvalStatus, "pending"),
          ),
        );
      log.info(
        { finalStatus, approvedChunks: rowCount ?? totalChunks },
        "Chunks auto-approved — knowledge base live",
      );
    }

    // Auto-extract brand colors + headline after successful crawl
    if (finalStatus !== "failed") {
      await extractBrand(clientId, websiteUrl);
    }

    // V2: synthesize canonical business profile from all extracted facts
    if (isV2 && finalStatus !== "failed" && totalChunks > 0) {
      const allFacts = await db
        .select({
          category: companyKnowledgeTable.category,
          question: companyKnowledgeTable.question,
          answer: companyKnowledgeTable.answer,
          confidence: companyKnowledgeTable.confidence,
          reviewKey: companyKnowledgeTable.reviewKey,
          evidenceQuote: companyKnowledgeTable.evidenceQuote,
        })
        .from(companyKnowledgeTable)
        .where(
          and(
            eq(companyKnowledgeTable.clientId, clientId),
            eq(companyKnowledgeTable.crawlJobId, jobId),
          ),
        );
      await synthesizeProfile(clientId, jobId, allFacts);
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
