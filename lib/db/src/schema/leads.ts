import { pgTable, serial, integer, text, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { clientsTable } from "./clients";

export const leadStatusEnum = ["new", "qualified", "callback_booked", "escalated", "needs_human", "closed"] as const;
export type LeadStatus = typeof leadStatusEnum[number];

export const leadSourceEnum = ["website_widget", "whatsapp_ad", "instagram_ad", "direct", "unknown"] as const;
export type LeadSource = typeof leadSourceEnum[number];

export const leadsTable = pgTable(
  "leads",
  {
    id: serial("id").primaryKey(),
    clientId: integer("client_id")
      .notNull()
      .references(() => clientsTable.id),
    phone: text("phone").notNull(),
    name: text("name"),
    language: text("language"),
    source: text("source").notNull().default("unknown"),
    status: text("status").notNull().default("new"),
    email: text("email"),
    contactPhone: text("contact_phone"),
    notes: text("notes"),
    conversationSummary: text("conversation_summary"),
    botTurnsThisHour: integer("bot_turns_this_hour").notNull().default(0),
    turnsResetAt: timestamp("turns_reset_at", { withTimezone: true }).notNull().defaultNow(),
    lastContactAt: timestamp("last_contact_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("leads_client_phone_idx").on(table.clientId, table.phone),
    index("leads_client_status_idx").on(table.clientId, table.status),
    index("leads_client_created_idx").on(table.clientId, table.createdAt),
  ],
);

export const insertLeadSchema = createInsertSchema(leadsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leadsTable.$inferSelect;
