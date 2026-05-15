import { Router, type IRouter, type Request, type Response } from "express";
import { createHmac } from "crypto";
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

const RESPOND_SIGNING_KEY = process.env.RESPOND_SIGNING_KEY;
const RESPOND_IO_API_TOKEN = process.env.RESPOND_IO_API_TOKEN;
const RESPOND_IO_API_BASE = "https://api.respond.io/v2";

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

const RespondEventContactSchema = z.object({
  id: z.number(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
});

const RespondEventMessageSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  type: z.string().default("text"),
  text: z.string().optional().nullable(),
});

const RespondEventChannelSchema = z.object({
  id: z.number(),
  type: z.string().default("whatsapp"),
  name: z.string().optional().nullable(),
});

const RespondEventSchema = z.object({
  event: z.string(),
  contact: RespondEventContactSchema,
  message: RespondEventMessageSchema,
  conversation: z.object({ id: z.number() }).optional(),
  channel: RespondEventChannelSchema,
});

function verifySignature(body: unknown, signature: string | undefined, signingKey: string): boolean {
  if (!signature) return false;
  const expected = createHmac("sha256", signingKey)
    .update(JSON.stringify(body))
    .digest("base64");
  return signature === expected;
}

async function sendRespondReply(contactId: number, channelId: number, text: string): Promise<void> {
  if (!RESPOND_IO_API_TOKEN) {
    logger.warn({ contactId }, "RESPOND_IO_API_TOKEN not set — skipping API send");
    return;
  }
  const url = `${RESPOND_IO_API_BASE}/contact/${contactId}/message`;
  const body = {
    channelId,
    message: { type: "text", text },
  };
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESPOND_IO_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    const txt = await resp.text().catch(() => "");
    logger.error({ contactId, channelId, status: resp.status, body: txt }, "respond.io API send failed");
  } else {
    logger.info({ contactId, channelId }, "respond.io API reply sent");
  }
}

async function processPipeline(slug: string, event: z.infer<typeof RespondEventSchema>): Promise<void> {
  let language = "en";
  const contactId = event.contact.id;
  const channelId = event.channel.id;
  const channelType = event.channel.type ?? "whatsapp";
  const messageText = event.message.text ?? "";
  const externalId = `${channelType}:${contactId}`;

  try {
    const clients = await db
      .select()
      .from(clientsTable)
      .where(and(eq(clientsTable.slug, slug), eq(clientsTable.isActive, true)))
      .limit(1);

    if (clients.length === 0) {
      logger.warn({ slug }, "respond-events: client not found");
      return;
    }

    const clientRecord = clients[0]!;

    const existingLeads = await db
      .select()
      .from(leadsTable)
      .where(and(eq(leadsTable.clientId, clientRecord.id), eq(leadsTable.phone, externalId)))
      .limit(1);

    let lead: Lead;
    if (existingLeads.length > 0) {
      lead = existingLeads[0]!;
      await db
        .update(leadsTable)
        .set({ lastContactAt: new Date() })
        .where(eq(leadsTable.id, lead.id));
    } else {
      const name = [event.contact.firstName, event.contact.lastName].filter(Boolean).join(" ") || null;
      const inserted = await db
        .insert(leadsTable)
        .values({
          clientId: clientRecord.id,
          phone: externalId,
          source: channelType,
          status: "new",
          name,
          lastContactAt: new Date(),
        })
        .returning();
      lead = inserted[0]!;
    }

    if (!messageText.trim()) {
      logger.info({ leadId: lead.id }, "respond-events: empty message, skipping bot");
      return;
    }

    await db.insert(conversationsTable).values({
      clientId: clientRecord.id,
      leadId: lead.id,
      direction: "inbound",
      body: messageText,
    });

    language = lead.language ?? detectLanguage(messageText, clientRecord.languagePrimary, clientRecord.languageSecondary ?? undefined);

    if (lead.language) {
      const explicit = detectExplicitSwitch(messageText, lead.language);
      if (explicit) {
        language = explicit;
        await db.update(leadsTable).set({ language, updatedAt: new Date() }).where(eq(leadsTable.id, lead.id));
      } else {
        const wordCount = messageText.trim().split(/\s+/).length;
        if (wordCount >= 4) {
          const implicit = detectLanguage(messageText, clientRecord.languagePrimary, clientRecord.languageSecondary ?? undefined);
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

    let profile: BotProfile = GENERIC_PROFILE;
    if (industry) {
      const profileRows = await db
        .select()
        .from(botProfilesTable)
        .where(eq(botProfilesTable.industry, industry))
        .limit(1);
      if (profileRows.length > 0) profile = profileRows[0]!;
    }

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

    const knowledgeChunks = await retrieveKnowledge(clientRecord.id, language, messageText, 5);

    const botResponse = await callGpt({
      language,
      clientName: clientRecord.name,
      callbackHours,
      knowledgeChunks,
      conversationHistory,
      userMessage: messageText,
      profile,
    });

    const requestedSwitch = botResponse.data?.["switchToLanguage"];
    if (
      typeof requestedSwitch === "string" &&
      requestedSwitch !== language &&
      requestedSwitch.length >= 2 &&
      requestedSwitch.length <= 10
    ) {
      language = requestedSwitch;
    }

    await db
      .update(leadsTable)
      .set({ language, lastContactAt: new Date(), updatedAt: new Date() })
      .where(eq(leadsTable.id, lead.id));

    await db.insert(conversationsTable).values({
      clientId: clientRecord.id,
      leadId: lead.id,
      direction: "outbound",
      body: botResponse.reply,
      intentDetected: botResponse.intent,
    });

    logger.info(
      { slug, leadId: lead.id, channelType, action: botResponse.action, intent: botResponse.intent },
      "respond-events pipeline complete",
    );

    await sendRespondReply(contactId, channelId, botResponse.reply);
  } catch (err) {
    logger.error({ err, slug }, "respond-events pipeline error — sending fallback");
    const fallback =
      language === "de"
        ? "Vielen Dank für Ihre Nachricht. Ich verbinde Sie gleich mit unserem Team."
        : language === "tr"
          ? "Mesajınız için teşekkür ederiz. Sizi ekibimizle buluşturacağız."
          : "Thank you for your message. Let me connect you with our team right away.";
    await sendRespondReply(contactId, channelId, fallback).catch(() => {});
  }
}

router.post("/webhook/respond-events/:slug", async (req: Request, res: Response) => {
  const slug = req.params["slug"] as string;

  if (RESPOND_SIGNING_KEY) {
    const signature = req.headers["x-webhook-signature"] as string | undefined;
    if (!verifySignature(req.body, signature, RESPOND_SIGNING_KEY)) {
      res.status(400).json({ error: "Invalid signature" });
      return;
    }
  } else {
    logger.warn("RESPOND_SIGNING_KEY not set — skipping signature verification");
  }

  const parsed = RespondEventSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid payload", issues: parsed.error.issues });
    return;
  }

  const { event } = parsed.data;

  if (event !== "NewIncomingMessage") {
    res.json({ ok: true, skipped: true, event });
    return;
  }

  res.json({ ok: true });

  void processPipeline(slug!, parsed.data);
});

export default router;
