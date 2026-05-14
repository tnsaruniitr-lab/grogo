import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { clientsTable, crawlJobsTable, crawlPagesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { startCrawlJob, runCrawlPipeline } from "../lib/crawl-pipeline";

const router: IRouter = Router();

router.post("/admin/crawl/:slug", async (req: Request, res: Response) => {
  const { slug } = req.params as { slug: string };

  const [client] = await db
    .select()
    .from(clientsTable)
    .where(eq(clientsTable.slug, slug))
    .limit(1);

  if (!client || client.deletedAt) {
    res.status(404).json({ error: "Client not found" });
    return;
  }

  const cfg = (client.config ?? {}) as Record<string, unknown>;
  const websiteUrl = cfg.websiteUrl as string | undefined;

  if (!websiteUrl) {
    res.status(400).json({ error: "Client has no websiteUrl configured" });
    return;
  }

  const jobId = await startCrawlJob(client.id, websiteUrl);

  res.status(202).json({
    jobId,
    status: "queued",
    pagesFound: 0,
    pagesCrawled: 0,
    pagesFailed: 0,
    pagesSkipped: 0,
    chunksExtracted: 0,
    errorSummary: null,
    startedAt: null,
    completedAt: null,
    createdAt: new Date().toISOString(),
  });

  // Fire-and-forget after response is sent
  runCrawlPipeline(client.id, websiteUrl, jobId).catch((err) => {
    req.log.error({ err, clientId: client.id, jobId }, "Crawl pipeline uncaught error");
  });
});

router.get("/admin/crawl/:slug/status", async (req: Request, res: Response) => {
  const { slug } = req.params as { slug: string };

  const [client] = await db
    .select({ id: clientsTable.id })
    .from(clientsTable)
    .where(eq(clientsTable.slug, slug))
    .limit(1);

  if (!client) {
    res.status(404).json({ error: "Client not found" });
    return;
  }

  const [job] = await db
    .select()
    .from(crawlJobsTable)
    .where(eq(crawlJobsTable.clientId, client.id))
    .orderBy(desc(crawlJobsTable.createdAt))
    .limit(1);

  if (!job) {
    res.status(404).json({ error: "No crawl job found for this client" });
    return;
  }

  res.json({
    jobId: job.id,
    status: job.status,
    pagesFound: job.pagesFound,
    pagesCrawled: job.pagesCrawled,
    pagesFailed: job.pagesFailed,
    pagesSkipped: job.pagesSkipped,
    chunksExtracted: job.chunksExtracted,
    errorSummary: job.errorSummary,
    startedAt: job.startedAt?.toISOString() ?? null,
    completedAt: job.completedAt?.toISOString() ?? null,
    createdAt: job.createdAt.toISOString(),
  });
});

router.get("/admin/crawl/:slug/pages", async (req: Request, res: Response) => {
  const { slug } = req.params as { slug: string };

  const [client] = await db
    .select({ id: clientsTable.id })
    .from(clientsTable)
    .where(eq(clientsTable.slug, slug))
    .limit(1);

  if (!client) {
    res.status(404).json({ error: "Client not found" });
    return;
  }

  const [job] = await db
    .select({ id: crawlJobsTable.id })
    .from(crawlJobsTable)
    .where(eq(crawlJobsTable.clientId, client.id))
    .orderBy(desc(crawlJobsTable.createdAt))
    .limit(1);

  if (!job) {
    res.status(404).json({ error: "No crawl job found" });
    return;
  }

  const pages = await db
    .select({
      id: crawlPagesTable.id,
      url: crawlPagesTable.url,
      status: crawlPagesTable.status,
      depth: crawlPagesTable.depth,
      pageTitle: crawlPagesTable.pageTitle,
      chunksExtracted: crawlPagesTable.chunksExtracted,
      lastError: crawlPagesTable.lastError,
      crawledAt: crawlPagesTable.crawledAt,
    })
    .from(crawlPagesTable)
    .where(eq(crawlPagesTable.jobId, job.id))
    .orderBy(crawlPagesTable.depth, crawlPagesTable.url);

  res.json(
    pages.map((p) => ({
      id: p.id,
      url: p.url,
      status: p.status,
      depth: p.depth,
      pageTitle: p.pageTitle,
      chunksExtracted: p.chunksExtracted,
      lastError: p.lastError,
      crawledAt: p.crawledAt?.toISOString() ?? null,
    })),
  );
});

export default router;
