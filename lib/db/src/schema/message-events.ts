import { pgTable, serial, integer, text, timestamp, jsonb, index, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { clientsTable } from "./clients";
import { leadsTable } from "./leads";

export const messageEventsTable = pgTable(
  "message_events",
  {
    id: serial("id").primaryKey(),
    clientId: integer("client_id")
      .notNull()
      .references(() => clientsTable.id),
    leadId: integer("lead_id").references(() => leadsTable.id),
    twilioMessageSid: text("twilio_message_sid").notNull(),
    direction: text("direction").notNull().default("inbound"),
    rawPayload: jsonb("raw_payload"),
    receivedAt: timestamp("received_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("message_events_sid_unique").on(table.twilioMessageSid),
    index("message_events_client_idx").on(table.clientId),
    index("message_events_lead_idx").on(table.leadId),
  ],
);

export const insertMessageEventSchema = createInsertSchema(messageEventsTable).omit({
  id: true,
  receivedAt: true,
});

export type InsertMessageEvent = z.infer<typeof insertMessageEventSchema>;
export type MessageEvent = typeof messageEventsTable.$inferSelect;
