import { pgTable, serial, integer, text, real, timestamp, index } from "drizzle-orm/pg-core";
import { clientsTable } from "./clients";
import { crawlJobsTable } from "./crawl-jobs";

export const clientProfilesTable = pgTable(
  "client_profiles",
  {
    id: serial("id").primaryKey(),
    clientId: integer("client_id")
      .notNull()
      .references(() => clientsTable.id),
    crawlJobId: integer("crawl_job_id").references(() => crawlJobsTable.id),
    status: text("status").notNull().default("pending"),
    profile: text("profile").notNull().default("{}"),
    evidence: text("evidence"),
    synthesisModel: text("synthesis_model"),
    webResearchModel: text("web_research_model"),
    modelVersionDate: timestamp("model_version_date", { withTimezone: true }),
    searchSources: text("search_sources"),
    confidence: real("confidence"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    activatedAt: timestamp("activated_at", { withTimezone: true }),
  },
  (table) => [
    index("client_profiles_client_idx").on(table.clientId),
    index("client_profiles_client_status_idx").on(table.clientId, table.status),
    index("client_profiles_crawl_job_idx").on(table.crawlJobId),
  ],
);

export type ClientProfile = typeof clientProfilesTable.$inferSelect;
export type InsertClientProfile = typeof clientProfilesTable.$inferInsert;
