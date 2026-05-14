import { pgTable, serial, integer, text, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { leadsTable } from "./leads";

export const reactivationsTable = pgTable(
  "reactivations",
  {
    id: serial("id").primaryKey(),
    leadId: integer("lead_id")
      .notNull()
      .references(() => leadsTable.id),
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }).notNull(),
    templateKey: text("template_key").notNull(),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    response: text("response"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("reactivations_lead_idx").on(table.leadId),
    index("reactivations_scheduled_idx").on(table.scheduledAt),
  ],
);

export const insertReactivationSchema = createInsertSchema(reactivationsTable).omit({
  id: true,
  createdAt: true,
});

export type InsertReactivation = z.infer<typeof insertReactivationSchema>;
export type Reactivation = typeof reactivationsTable.$inferSelect;
