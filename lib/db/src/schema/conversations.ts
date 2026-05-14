import { pgTable, serial, integer, text, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { clientsTable } from "./clients";
import { leadsTable } from "./leads";

export const conversationDirectionEnum = ["inbound", "outbound"] as const;
export type ConversationDirection = typeof conversationDirectionEnum[number];

export const conversationsTable = pgTable(
  "conversations",
  {
    id: serial("id").primaryKey(),
    clientId: integer("client_id")
      .notNull()
      .references(() => clientsTable.id),
    leadId: integer("lead_id")
      .notNull()
      .references(() => leadsTable.id),
    jobId: integer("job_id"),
    direction: text("direction").notNull(),
    body: text("body").notNull(),
    intentDetected: text("intent_detected"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("conversations_lead_created_idx").on(table.leadId, table.createdAt),
    index("conversations_client_idx").on(table.clientId),
  ],
);

export const insertConversationSchema = createInsertSchema(conversationsTable).omit({
  id: true,
  createdAt: true,
  deletedAt: true,
});

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversationsTable.$inferSelect;
