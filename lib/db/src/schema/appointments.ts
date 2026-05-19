import { pgTable, serial, integer, text, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { clientsTable } from "./clients";
import { leadsTable } from "./leads";

export const appointmentTypeEnum = [
  "callback",
  "visit",               // legacy — kept so existing dashboard rows remain valid
  "service_booking",
  "online_consultation",
  "walkin_consultation",
] as const;
export type AppointmentType = typeof appointmentTypeEnum[number];

export const appointmentOutcomeEnum = ["pending", "completed", "no_show", "cancelled"] as const;
export type AppointmentOutcome = typeof appointmentOutcomeEnum[number];

export const appointmentsTable = pgTable(
  "appointments",
  {
    id: serial("id").primaryKey(),
    clientId: integer("client_id")
      .notNull()
      .references(() => clientsTable.id),
    leadId: integer("lead_id")
      .notNull()
      .references(() => leadsTable.id),
    type: text("type").notNull().default("callback"),
    serviceRequested: text("service_requested"),
    preferredTime: text("preferred_time"),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
    outcome: text("outcome").notNull().default("pending"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  },
  (table) => [
    index("appointments_client_idx").on(table.clientId),
    index("appointments_lead_idx").on(table.leadId),
  ],
);

export const insertAppointmentSchema = createInsertSchema(appointmentsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointmentsTable.$inferSelect;
