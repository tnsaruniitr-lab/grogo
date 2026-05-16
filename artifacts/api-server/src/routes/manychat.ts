import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import { db } from "@workspace/db";
import {
  clientsTable,
  leadsTable,
  conversationsTable,
  botProfilesTable,
  type Lead,
  type BotProfile,
} from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { callGpt } from "../lib/gpt-service";
import { retrieveKnowledge } from "../lib/knowledge";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const WEBHOOK_API_KEY = process.env.WEBHOOK_API_KEY;

const GENERIC_PROFILE: BotProfile = {
  industry: "generic",
  personaRole: "assistant",
  companyContext: "a professional services company",
  primaryGoal: "understand the enquiry and book a callback",
  callbackOffer: {
    de: '"Wann kann ich einen Rückruf für Sie einrichten? Heute oder morgen, vormittags oder nachmittags?"',
    tr: '"Sizi ne zaman geri arayalım? Bugün mü yarın mı — sabah mı öğleden sonra mı?"',
    en: '"When would be a good time for a callback? Today or tomorrow — morning or afternoon?"',
  },
  gdprAllowedFields: {
    de: "Name, Stadt, allgemeines Anliegen, bevorzugte Rückrufzeit",
    tr: "İsim, şehir, genel kaygı, tercih edilen geri arama zamanı",
    en: "Name, city, general enquiry, preferred callback time",
  },
  gdprRedirect: {
    de: "Sensitive Details besprechen wir gerne persönlich",
    tr: "Hassas detayları şahsen konuşabiliriz",
    en: "We'd be happy to discuss sensitive details in person",
  },
  dataFields: [
    { key: "name", label: { de: "Name", tr: "İsim", en: "Name" } },
    { key: "careType", label: { de: "Art des Anliegens", tr: "Kaygı türü", en: "Nature of enquiry" } },
    { key: "city", label: { de: "Stadt oder Region", tr: "Şehir veya bölge", en: "City or region" } },
    { key: "preferredTime", label: { de: "Bevorzugte Rückrufzeit", tr: "Tercih edilen geri arama zamanı", en: "Preferred callback time" } },
  ],
  outOfScopeTopics: "medical diagnoses, legal advice, financial advice, emergency situations",
  createdAt: new Date(),
  updatedAt: new Date(),
};

function detectExplicitSwitch(text: string, currentLanguage: string): string | null {
  const t = text.toLowerCase();
  if (currentLanguage !== "en") {
    const wantsEn =
      /\b(speak|write|reply|respond|answer|talk|use|switch\s+to|change\s+to)\s+english\b/.test(t) ||
      /\bin\s+english\b/.test(t) ||
      /\benglish\s+(please|only|instead|now)\b/.test(t) ||
      /\bcan\s+(you|u)\s+(speak|write|use|talk\s+in)\s+english\b/.test(t);
    if (wantsEn) return "en";
  }
  if (currentLanguage !== "de") {
    const wantsDe =
      /\b(auf\s+deutsch|bitte\s+deutsch|speak\s+german|in\s+german|deutsch\s+bitte|can\s+(you|u)\s+(speak|write|use)\s+german|switch\s+to\s+german|german\s+please)\b/.test(t);
    if (wantsDe) return "de";
  }
  if (currentLanguage !== "tr") {
    const wantsTr =
      /\b(türkçe|türkce|speak\s+turkish|in\s+turkish|türkçe\s+lütfen|can\s+(you|u)\s+(speak|write|use)\s+turkish)\b/.test(t);
    if (wantsTr) return "tr";
  }
  return null;
}

function detectLanguage(text: string, clientPrimary: string, clientSecondary?: string | null): string {
  const turkishPatterns =
    /\b(merhaba|evet|hay[iı]r|te[sş]ekk[uü]r|nas[iı]l|nerede|ne zaman|bak[iı]m|aile|annem|babam|e[sş]im|yard[iı]m|bilgi|almak|lazım|gereki|için|ile|sizi|size|bizi|beni|ben|tamam|lütfen|bir|var|yok|bu|ne|kim|ka[cç]|nas[iı]l)\b/i;
  const turkishChars = /[ğşıİĞŞ]/;
  const hasTurkish = turkishPatterns.test(text) || turkishChars.test(text);
  if (hasTurkish && (clientPrimary === "tr" || clientSecondary === "tr")) return "tr";

  const germanPatterns =
    /\b(hallo|guten|bitte|danke|wie|wo|wann|pflege|haus|familie|mutter|vater|partner|hilfe|mehr|über|für|mit|ich|sie|wir|haben|bin|ist|und|nicht|auch|aber|noch|schon|sehr|können|möchte|brauche|suche)\b/i;
  const germanChars = /[äöüÄÖÜß]/;
  const hasGerman = germanPatterns.test(text) || germanChars.test(text);
  if (hasGerman && (clientPrimary === "de" || clientSecondary === "de")) return "de";

  const englishPatterns =
    /\b(hello|hi there|hey|what|which|how|when|where|services|provide|cost|price|available|appointment|book|treatment|help|please|thanks|thank you|yes|no|okay|can you|do you|are you|i am|i'm|i have|i want|i need|i would|we are|we have|would like|could you|is there|do you have|tell me|more info|information|website|contact|number|email)\b/i;
  if (englishPatterns.test(text)) return "en";

  return clientPrimary;
}

function manychatTextMessage(text: string) {
  return { type: "text" as const, text };
}

function buildManychatResponse(reply: string, action: string) {
  const messages = [manychatTextMessage(reply)];
  const actions: Array<{ action: string; tag_name: string }> = [];

  if (action === "escalate_human") {
    actions.push({ action: "add_tag", tag_name: "human_needed" });
  }

  return {
    version: "v2",
    content: { messages },
    ...(actions.length > 0 ? { actions } : {}),
  };
}

const ManychatPayloadSchema = z.object({
  senderId: z.string().min(1),
  message: z.string(),
  channel: z.string().default("instagram"),
  name: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
});

router.post("/webhook/manychat/:slug", async (req: Request, res: Response) => {
  let language = "en";
  const slug = req.params["slug"] as string;
  let step = "auth";

  try {
    const apiKey = req.headers["x-api-key"];
    if (!WEBHOOK_API_KEY || apiKey !== WEBHOOK_API_KEY) {
      logger.warn({ slug, step: "auth", ip: req.ip }, "ManyChat webhook unauthorized — bad or missing API key");
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    step = "validate_payload";
    const parsed = ManychatPayloadSchema.safeParse(req.body);
    if (!parsed.success) {
      logger.warn({ slug, step: "validate_payload", issues: parsed.error.issues, body: req.body }, "ManyChat webhook bad payload");
      res.status(400).json({ error: "Invalid payload", issues: parsed.error.issues });
      return;
    }

    const { senderId, message, channel, name, phone: contactPhone, email } = parsed.data;

    logger.info(
      { slug, channel, senderId, messageLength: message.length, hasName: !!name, hasPhone: !!contactPhone },
      "ManyChat webhook received",
    );

    step = "db_client_lookup";
    const clients = await db
      .select()
      .from(clientsTable)
      .where(and(eq(clientsTable.slug, slug), eq(clientsTable.isActive, true)))
      .limit(1);

    if (clients.length === 0) {
      logger.warn({ slug, step: "db_client_lookup" }, "ManyChat webhook — client slug not found");
      res.status(404).json({ error: "Client not found", slug });
      return;
    }

    const clientRecord = clients[0]!;
    const externalId = `${channel}:${senderId}`;

    step = "db_lead_lookup";
    const existingLeads = await db
      .select()
      .from(leadsTable)
      .where(and(eq(leadsTable.clientId, clientRecord.id), eq(leadsTable.phone, externalId)))
      .limit(1);

    let lead: Lead;
    if (existingLeads.length > 0) {
      lead = existingLeads[0]!;
      const updates: Record<string, unknown> = { lastContactAt: new Date() };
      if (name && !lead.name) updates["name"] = name;
      if (email && !lead.email) updates["email"] = email;
      if (contactPhone && !lead.contactPhone) updates["contactPhone"] = contactPhone;
      await db.update(leadsTable).set(updates).where(eq(leadsTable.id, lead.id));
    } else {
      const inserted = await db
        .insert(leadsTable)
        .values({
          clientId: clientRecord.id,
          phone: externalId,
          source: channel,
          status: "new",
          name: name ?? null,
          email: email ?? null,
          contactPhone: contactPhone ?? null,
          lastContactAt: new Date(),
        })
        .returning();
      lead = inserted[0]!;
    }

    step = "db_conversation_write";
    await db.insert(conversationsTable).values({
      clientId: clientRecord.id,
      leadId: lead.id,
      direction: "inbound",
      body: message || "(empty)",
    });

    step = "language_detection";
    language = lead.language ?? detectLanguage(message, clientRecord.languagePrimary, clientRecord.languageSecondary ?? undefined);

    if (lead.language) {
      const explicit = detectExplicitSwitch(message, lead.language);
      if (explicit) {
        language = explicit;
        await db.update(leadsTable).set({ language, updatedAt: new Date() }).where(eq(leadsTable.id, lead.id));
      } else {
        const wordCount = message.trim().split(/\s+/).length;
        if (wordCount >= 4) {
          const implicit = detectLanguage(message, clientRecord.languagePrimary, clientRecord.languageSecondary ?? undefined);
          if (implicit !== lead.language) {
            language = implicit;
            await db.update(leadsTable).set({ language, updatedAt: new Date() }).where(eq(leadsTable.id, lead.id));
          }
        }
      }
    } else {
      await db.update(leadsTable).set({ language, updatedAt: new Date() }).where(eq(leadsTable.id, lead.id));
    }

    const clientConfig = (clientRecord.config ?? {}) as Record<string, unknown>;
    const industry = typeof clientConfig["industry"] === "string" ? clientConfig["industry"] : null;
    const callbackHours = typeof clientConfig["callbackHours"] === "string" ? clientConfig["callbackHours"] : "Mon–Fri 8am–6pm";

    step = "db_profile_lookup";
    let profile: BotProfile = GENERIC_PROFILE;
    if (industry) {
      const profileRows = await db
        .select()
        .from(botProfilesTable)
        .where(eq(botProfilesTable.industry, industry))
        .limit(1);
      if (profileRows.length > 0) profile = profileRows[0]!;
    }

    step = "db_history_load";
    const history = await db
      .select()
      .from(conversationsTable)
      .where(and(eq(conversationsTable.leadId, lead.id), eq(conversationsTable.clientId, clientRecord.id)))
      .orderBy(desc(conversationsTable.createdAt))
      .limit(20);

    const conversationHistory = history
      .reverse()
      .filter((h) => h.body && (h.direction === "inbound" || h.direction === "outbound"))
      .map((h) => ({
        role: h.direction === "inbound" ? ("user" as const) : ("assistant" as const),
        content: h.body,
      }));

    step = "knowledge_retrieval";
    const knowledgeChunks = await retrieveKnowledge(clientRecord.id, language, message, 5);

    step = "gpt_call";
    const botResponse = await callGpt({
      language,
      clientName: clientRecord.name,
      callbackHours,
      knowledgeChunks,
      conversationHistory,
      userMessage: message,
      profile,
    });

    step = "build_response";
    const requestedSwitch = botResponse.data?.["switchToLanguage"];
    if (
      typeof requestedSwitch === "string" &&
      requestedSwitch !== language &&
      requestedSwitch.length >= 2 &&
      requestedSwitch.length <= 10
    ) {
      language = requestedSwitch;
    }

    step = "db_lead_update";
    await db
      .update(leadsTable)
      .set({ language, lastContactAt: new Date(), updatedAt: new Date() })
      .where(eq(leadsTable.id, lead.id));

    step = "db_outbound_write";
    await db.insert(conversationsTable).values({
      clientId: clientRecord.id,
      leadId: lead.id,
      direction: "outbound",
      body: botResponse.reply,
      intentDetected: botResponse.intent,
    });

    const responseBody = buildManychatResponse(botResponse.reply, botResponse.action);

    logger.info(
      { slug, leadId: lead.id, channel, action: botResponse.action, intent: botResponse.intent, language, responseBody },
      "ManyChat pipeline complete",
    );

    res.json(responseBody);
  } catch (err) {
    logger.error(
      { err, slug, step, language },
      `ManyChat pipeline error at step: ${step}`,
    );
    const fallback =
      language === "de"
        ? "Vielen Dank für Ihre Nachricht. Ich verbinde Sie gleich mit unserem Team."
        : language === "tr"
          ? "Mesajınız için teşekkür ederiz. Sizi ekibimizle buluşturacağız."
          : "Thank you for your message. Let me connect you with our team right away.";
    res.json(buildManychatResponse(fallback, "escalate_human"));
  }
});

export default router;
