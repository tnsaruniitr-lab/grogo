import { pgTable, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const botProfilesTable = pgTable("bot_profiles", {
  industry: text("industry").primaryKey(),
  personaRole: text("persona_role").notNull(),
  companyContext: text("company_context").notNull(),
  primaryGoal: text("primary_goal").notNull(),
  callbackOffer: jsonb("callback_offer").notNull().$type<Record<string, string>>(),
  gdprAllowedFields: jsonb("gdpr_allowed_fields").notNull().$type<Record<string, string>>(),
  gdprRedirect: jsonb("gdpr_redirect").notNull().$type<Record<string, string>>(),
  dataFields: jsonb("data_fields").notNull().$type<Array<{ key: string; label: Record<string, string> }>>(),
  outOfScopeTopics: text("out_of_scope_topics").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export type BotProfile = typeof botProfilesTable.$inferSelect;
