import { pgTable, serial, integer, text, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { clientsTable } from "./clients";

export const companyKnowledgeTable = pgTable(
  "company_knowledge",
  {
    id: serial("id").primaryKey(),
    clientId: integer("client_id")
      .notNull()
      .references(() => clientsTable.id),
    category: text("category").notNull(),
    question: text("question").notNull(),
    answer: text("answer").notNull(),
    language: text("language").notNull().default("de"),
    priority: integer("priority").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  },
  (table) => [
    index("knowledge_client_category_idx").on(table.clientId, table.category),
    index("knowledge_client_lang_idx").on(table.clientId, table.language),
  ],
);

export const insertCompanyKnowledgeSchema = createInsertSchema(companyKnowledgeTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCompanyKnowledge = z.infer<typeof insertCompanyKnowledgeSchema>;
export type CompanyKnowledge = typeof companyKnowledgeTable.$inferSelect;
