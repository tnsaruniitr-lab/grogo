import { pgTable, serial, integer, text, timestamp, index } from "drizzle-orm/pg-core";
import { clientsTable } from "./clients";
import { crawlJobsTable } from "./crawl-jobs";

export const crawlPagesTable = pgTable(
  "crawl_pages",
  {
    id: serial("id").primaryKey(),
    clientId: integer("client_id")
      .notNull()
      .references(() => clientsTable.id),
    jobId: integer("job_id")
      .notNull()
      .references(() => crawlJobsTable.id),
    url: text("url").notNull(),
    depth: integer("depth").notNull().default(0),
    status: text("status").notNull().default("pending"),
    attemptCount: integer("attempt_count").notNull().default(0),
    lastError: text("last_error"),
    pageTitle: text("page_title"),
    rawText: text("raw_text"),
    chunksExtracted: integer("chunks_extracted").notNull().default(0),
    crawledAt: timestamp("crawled_at", { withTimezone: true }),
    extractedAt: timestamp("extracted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("crawl_pages_job_status_idx").on(table.jobId, table.status),
    index("crawl_pages_client_status_idx").on(table.clientId, table.status),
    index("crawl_pages_job_id_idx").on(table.jobId),
  ],
);

export type CrawlPage = typeof crawlPagesTable.$inferSelect;
export type InsertCrawlPage = typeof crawlPagesTable.$inferInsert;
