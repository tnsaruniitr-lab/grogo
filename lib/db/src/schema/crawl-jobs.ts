import { pgTable, serial, integer, text, timestamp, index } from "drizzle-orm/pg-core";
import { clientsTable } from "./clients";

export const crawlJobsTable = pgTable(
  "crawl_jobs",
  {
    id: serial("id").primaryKey(),
    clientId: integer("client_id")
      .notNull()
      .references(() => clientsTable.id),
    status: text("status").notNull().default("queued"),
    pagesFound: integer("pages_found").notNull().default(0),
    pagesCrawled: integer("pages_crawled").notNull().default(0),
    pagesFailed: integer("pages_failed").notNull().default(0),
    pagesSkipped: integer("pages_skipped").notNull().default(0),
    chunksExtracted: integer("chunks_extracted").notNull().default(0),
    errorSummary: text("error_summary"),
    extractorVersion: text("extractor_version"),
    settingsSnapshot: text("settings_snapshot"),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("crawl_jobs_client_idx").on(table.clientId),
    index("crawl_jobs_status_idx").on(table.status),
    index("crawl_jobs_client_created_idx").on(table.clientId, table.createdAt),
  ],
);

export type CrawlJob = typeof crawlJobsTable.$inferSelect;
export type InsertCrawlJob = typeof crawlJobsTable.$inferInsert;
