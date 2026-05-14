import { pgTable, serial, integer, text, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { clientsTable } from "./clients";
import { leadsTable } from "./leads";
import { messageEventsTable } from "./message-events";

export const jobStatusEnum = ["pending", "processing", "done", "failed", "dead"] as const;
export type JobStatus = typeof jobStatusEnum[number];

export const jobQueueTable = pgTable(
  "job_queue",
  {
    id: serial("id").primaryKey(),
    clientId: integer("client_id")
      .notNull()
      .references(() => clientsTable.id),
    leadId: integer("lead_id")
      .notNull()
      .references(() => leadsTable.id),
    messageEventId: integer("message_event_id")
      .notNull()
      .references(() => messageEventsTable.id),
    status: text("status").notNull().default("pending"),
    attempts: integer("attempts").notNull().default(0),
    lastError: text("last_error"),
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }).notNull().defaultNow(),
    processedAt: timestamp("processed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  },
  (table) => [
    index("job_queue_status_scheduled_idx").on(table.status, table.scheduledAt),
    index("job_queue_client_idx").on(table.clientId),
    index("job_queue_lead_idx").on(table.leadId),
  ],
);

export const insertJobQueueSchema = createInsertSchema(jobQueueTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertJobQueue = z.infer<typeof insertJobQueueSchema>;
export type JobQueue = typeof jobQueueTable.$inferSelect;
