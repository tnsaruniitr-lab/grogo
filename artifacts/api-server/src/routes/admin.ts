import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { clientsTable, companyKnowledgeTable } from "@workspace/db";
import { eq, isNull, and, inArray, asc } from "drizzle-orm";
import { z } from "zod/v4";
import { extractBrand } from "../lib/brand-extractor";
import {
  ExtractBrandingBody,
  CreateDemoClientBody,
  UpdateDemoClientBody,
  UpdateDemoClientParams,
  DeleteDemoClientParams,
  GetClientBrandingParams,
} from "@workspace/api-zod";
import { startCrawlJob, runCrawlPipeline } from "../lib/crawl-pipeline";
import { embedText } from "../lib/embedder";

const CreateKnowledgeEntryBody = z.object({
  category: z.string().min(1).max(64),
  question: z.string().min(1).max(1000),
  answer: z.string().min(1).max(4000),
  language: z.string().default("en"),
  priority: z.number().int().default(0),
});

const KnowledgeEntryParams = z.object({
  slug: z.string(),
  id: z.coerce.number().int().positive(),
});

const router: IRouter = Router();

router.post("/admin/extract-branding", async (req: Request, res: Response) => {
  const parsed = ExtractBrandingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "url is required" });
    return;
  }

  const { url } = parsed.data;

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; DosteliBrandBot/1.0)" },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      res.status(400).json({ error: `Failed to fetch URL: ${response.status}` });
      return;
    }

    const html = await response.text();

    const meta = (attr: string, value: string): string | null => {
      const patterns = [
        new RegExp(`<meta[^>]+${attr}=["']${value}["'][^>]+content=["']([^"']+)["']`, "i"),
        new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+${attr}=["']${value}["']`, "i"),
      ];
      for (const p of patterns) {
        const m = html.match(p);
        if (m?.[1]) return m[1].trim();
      }
      return null;
    };

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const titleTag = titleMatch?.[1]?.trim() ?? null;

    const faviconMatch =
      html.match(/<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]+href=["']([^"']+)["']/i) ||
      html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["'][^"']*icon[^"']*["']/i);
    const rawFavicon = faviconMatch?.[1] ?? null;

    const baseUrl = new URL(url);
    const resolve = (u: string | null): string | null => {
      if (!u) return null;
      try { return new URL(u, baseUrl.origin).href; } catch { return u; }
    };

    const ogImage = meta("property", "og:image");
    const themeColor = meta("name", "theme-color");
    const ogTitle = meta("property", "og:title");
    const ogDescription = meta("property", "og:description");

    let companyName = ogTitle || titleTag || baseUrl.hostname.replace(/^www\./, "");
    companyName = companyName.split(/\s*[\|–—-]\s*/)[0].trim();

    const slug = baseUrl.hostname
      .replace(/^www\./, "")
      .replace(/\.[a-z]{2,}$/, "")
      .replace(/[^a-z0-9]+/gi, "-")
      .toLowerCase();

    // Smart logo extraction: prefer actual logo images over og:image (which is usually a hero banner)
    const findLogoUrl = (): string | null => {
      // 1. <img> anywhere with alt/class/id/src containing "logo"
      const logoPatterns = [
        /<img[^>]+(?:class|id|alt)=["'][^"']*logo[^"']*["'][^>]+src=["']([^"']+)["']/i,
        /<img[^>]+src=["']([^"']+)["'][^>]+(?:class|id|alt)=["'][^"']*logo[^"']*["']/i,
        /<img[^>]+src=["']([^"'\/][^"']*logo[^"']*\.[a-z]{2,5})["']/i,
      ];
      for (const pat of logoPatterns) {
        const m = html.match(pat);
        if (m?.[1] && !m[1].includes("data:")) return resolve(m[1]);
      }
      // 2. <link rel="apple-touch-icon"> — usually 180×180, better than favicon
      const appleIcon =
        html.match(/<link[^>]+rel=["'][^"']*apple-touch-icon[^"']*["'][^>]+href=["']([^"']+)["']/i)?.[1] ??
        html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["'][^"']*apple-touch-icon[^"']*["']/i)?.[1];
      if (appleIcon) return resolve(appleIcon);
      // 3. Favicon (better than og:image for logo purposes)
      if (rawFavicon) return resolve(rawFavicon);
      // 4. og:image last resort — likely a hero banner not a logo
      return null;
    };

    res.json({
      companyName,
      slug,
      tagline: ogDescription ?? null,
      heroHeadline: null,
      primaryColor: themeColor ?? null,
      secondaryColor: null,
      logoUrl: findLogoUrl(),
      city: null,
      phone: null,
      websiteUrl: url,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to extract branding");
    res.status(400).json({ error: "Failed to fetch or parse the URL" });
  }
});

router.get("/admin/clients", async (req: Request, res: Response) => {
  const clients = await db
    .select()
    .from(clientsTable)
    .where(isNull(clientsTable.deletedAt))
    .orderBy(clientsTable.createdAt);

  res.json(clients.map(toClientResponse));
});

router.post("/admin/clients", async (req: Request, res: Response) => {
  const parsed = CreateDemoClientBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { name, slug, branding } = parsed.data;

  const existing = await db
    .select({ id: clientsTable.id })
    .from(clientsTable)
    .where(eq(clientsTable.slug, slug))
    .limit(1);

  if (existing.length > 0) {
    res.status(400).json({ error: `Slug "${slug}" is already in use` });
    return;
  }

  const brandingCfg = branding as Record<string, unknown> | undefined;
  const demoLangs: string[] = Array.isArray(brandingCfg?.demoLanguages)
    ? (brandingCfg.demoLanguages as string[])
    : brandingCfg?.demoLanguage
      ? [brandingCfg.demoLanguage as string]
      : ["en"];

  const [created] = await db
    .insert(clientsTable)
    .values({
      name,
      slug,
      whatsappNumber: "",
      twilioSender: process.env.TWILIO_DEFAULT_SENDER ?? "",
      languagePrimary: demoLangs[0] ?? "en",
      languageSecondary: demoLangs[1] ?? null,
      config: branding ?? null,
    })
    .returning();

  res.status(201).json(toClientResponse(created));

  // Auto-trigger crawl if a websiteUrl was provided
  const websiteUrl = (branding as Record<string, unknown> | undefined)?.websiteUrl as string | undefined;
  if (websiteUrl) {
    startCrawlJob(created.id, websiteUrl)
      .then((jobId) => runCrawlPipeline(created.id, websiteUrl, jobId))
      .catch((err) => req.log.error({ err, clientId: created.id }, "Auto-crawl failed to start"));
  }
});

router.patch("/admin/clients/:id", async (req: Request, res: Response) => {
  const params = UpdateDemoClientParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const body = UpdateDemoClientBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.flatten() });
    return;
  }

  const [existing] = await db
    .select()
    .from(clientsTable)
    .where(eq(clientsTable.id, params.data.id))
    .limit(1);

  if (!existing || existing.deletedAt) {
    res.status(404).json({ error: "Client not found" });
    return;
  }

  const updates: Partial<typeof clientsTable.$inferInsert> = {};
  if (body.data.name) updates.name = body.data.name;
  if (body.data.twilioSender !== undefined) updates.twilioSender = body.data.twilioSender;
  if (body.data.branding !== undefined) updates.config = body.data.branding as Record<string, unknown>;

  const [updated] = await db
    .update(clientsTable)
    .set(updates)
    .where(eq(clientsTable.id, params.data.id))
    .returning();

  res.json(toClientResponse(updated));
});

router.delete("/admin/clients/:id", async (req: Request, res: Response) => {
  const params = DeleteDemoClientParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [existing] = await db
    .select({ id: clientsTable.id })
    .from(clientsTable)
    .where(eq(clientsTable.id, params.data.id))
    .limit(1);

  if (!existing) {
    res.status(404).json({ error: "Client not found" });
    return;
  }

  if (params.data.id === 1) {
    res.status(403).json({ error: "Cannot delete the primary client" });
    return;
  }

  await db
    .update(clientsTable)
    .set({ deletedAt: new Date() })
    .where(eq(clientsTable.id, params.data.id));

  res.status(204).end();
});

router.get("/clients/:slug/content", async (req: Request, res: Response) => {
  const slug = req.params.slug as string;

  const [client] = await db
    .select({ id: clientsTable.id, config: clientsTable.config, deletedAt: clientsTable.deletedAt })
    .from(clientsTable)
    .where(eq(clientsTable.slug, slug))
    .limit(1);

  if (!client || client.deletedAt) {
    res.status(404).json({ error: "Client not found" });
    return;
  }

  const cfg = (client.config ?? {}) as Record<string, unknown>;
  const lang = (cfg.demoLanguage as string | undefined) ?? "de";

  const categories = ["service", "about", "contact", "faq", "process"] as const;

  const rows = await db
    .select({
      category: companyKnowledgeTable.category,
      question: companyKnowledgeTable.question,
      answer: companyKnowledgeTable.answer,
      confidence: companyKnowledgeTable.confidence,
      sourceUrl: companyKnowledgeTable.sourceUrl,
    })
    .from(companyKnowledgeTable)
    .where(
      and(
        eq(companyKnowledgeTable.clientId, client.id),
        inArray(companyKnowledgeTable.category, [...categories]),
        eq(companyKnowledgeTable.language, lang),
      )
    );

  type Chunk = { question: string; answer: string; confidence: number | null; sourceUrl: string | null };
  const grouped: Record<string, Chunk[]> = Object.fromEntries(categories.map((c) => [c, []]));
  for (const row of rows) {
    if (row.category in grouped) grouped[row.category].push(row);
  }

  // Sort each category by confidence desc, cap at 6
  for (const cat of categories) {
    grouped[cat] = grouped[cat]
      .sort((a, b) => (b.confidence ?? 0) - (a.confidence ?? 0))
      .slice(0, 6);
  }

  res.json({
    hasCrawlData: rows.length > 0,
    services: grouped.service,
    about: grouped.about,
    contact: grouped.contact,
    faq: grouped.faq,
    process: grouped.process,
  });
});

router.post("/admin/brand-extract/:slug", async (req: Request, res: Response) => {
  const slug = req.params.slug as string;

  const [client] = await db
    .select({ id: clientsTable.id, config: clientsTable.config, deletedAt: clientsTable.deletedAt })
    .from(clientsTable)
    .where(eq(clientsTable.slug, slug))
    .limit(1);

  if (!client || client.deletedAt) {
    res.status(404).json({ error: "Client not found" });
    return;
  }

  const cfg = (client.config ?? {}) as Record<string, unknown>;
  const websiteUrl = cfg.websiteUrl as string | undefined;

  if (!websiteUrl) {
    res.status(400).json({ error: "Client has no websiteUrl configured" });
    return;
  }

  // Fire-and-forget — return immediately, extraction runs async
  res.json({ status: "started", slug, websiteUrl });

  extractBrand(client.id, websiteUrl).catch((err) =>
    req.log.error({ err, slug }, "brand-extract background error"),
  );
});

router.get("/clients/:slug/branding", async (req: Request, res: Response) => {
  const params = GetClientBrandingParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid slug" });
    return;
  }

  const [client] = await db
    .select()
    .from(clientsTable)
    .where(eq(clientsTable.slug, params.data.slug))
    .limit(1);

  if (!client || client.deletedAt) {
    res.status(404).json({ error: "Client not found" });
    return;
  }

  res.json(buildBranding(client));
});

router.get("/admin/clients/:slug/knowledge", async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const [client] = await db
    .select({ id: clientsTable.id, deletedAt: clientsTable.deletedAt })
    .from(clientsTable)
    .where(eq(clientsTable.slug, slug))
    .limit(1);
  if (!client || client.deletedAt) { res.status(404).json({ error: "Client not found" }); return; }

  const rows = await db
    .select({
      id: companyKnowledgeTable.id,
      category: companyKnowledgeTable.category,
      question: companyKnowledgeTable.question,
      answer: companyKnowledgeTable.answer,
      language: companyKnowledgeTable.language,
      priority: companyKnowledgeTable.priority,
      source: companyKnowledgeTable.source,
      sourceUrl: companyKnowledgeTable.sourceUrl,
      createdAt: companyKnowledgeTable.createdAt,
    })
    .from(companyKnowledgeTable)
    .where(eq(companyKnowledgeTable.clientId, client.id))
    .orderBy(asc(companyKnowledgeTable.category), asc(companyKnowledgeTable.id));

  const categories = [...new Set(rows.map((r) => r.category))].sort();
  res.json({
    entries: rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })),
    categories,
  });
});

router.post("/admin/clients/:slug/knowledge", async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const [client] = await db
    .select({ id: clientsTable.id, deletedAt: clientsTable.deletedAt })
    .from(clientsTable)
    .where(eq(clientsTable.slug, slug))
    .limit(1);
  if (!client || client.deletedAt) { res.status(404).json({ error: "Client not found" }); return; }

  const parsed = CreateKnowledgeEntryBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }

  const { category, question, answer, language, priority } = parsed.data;
  const text = `${question} ${answer}`;
  const embedding = await embedText(text);

  const [created] = await db
    .insert(companyKnowledgeTable)
    .values({
      clientId: client.id,
      category,
      question,
      answer,
      language,
      priority,
      source: "manual",
      embeddingJson: embedding ? JSON.stringify(embedding) : null,
    })
    .returning();

  res.status(201).json({ ...created, createdAt: created.createdAt.toISOString() });
});

router.patch("/admin/clients/:slug/knowledge/:id", async (req: Request, res: Response) => {
  const params = KnowledgeEntryParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: "Invalid params" }); return; }

  const [client] = await db
    .select({ id: clientsTable.id, deletedAt: clientsTable.deletedAt })
    .from(clientsTable)
    .where(eq(clientsTable.slug, params.data.slug))
    .limit(1);
  if (!client || client.deletedAt) { res.status(404).json({ error: "Client not found" }); return; }

  const [existing] = await db
    .select()
    .from(companyKnowledgeTable)
    .where(and(eq(companyKnowledgeTable.id, params.data.id), eq(companyKnowledgeTable.clientId, client.id)))
    .limit(1);
  if (!existing) { res.status(404).json({ error: "Entry not found" }); return; }

  const body = z.object({
    category: z.string().optional(),
    question: z.string().optional(),
    answer: z.string().optional(),
    language: z.string().optional(),
  }).safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: body.error.flatten() }); return; }

  const updates: Record<string, unknown> = {};
  if (body.data.category) updates.category = body.data.category;
  if (body.data.question !== undefined) updates.question = body.data.question;
  if (body.data.answer !== undefined) updates.answer = body.data.answer;
  if (body.data.language) updates.language = body.data.language;

  const newQuestion = body.data.question ?? existing.question;
  const newAnswer = body.data.answer ?? existing.answer;
  if (body.data.question !== undefined || body.data.answer !== undefined) {
    const embedding = await embedText(`${newQuestion} ${newAnswer}`);
    if (embedding) updates.embeddingJson = JSON.stringify(embedding);
  }

  const [updated] = await db
    .update(companyKnowledgeTable)
    .set(updates)
    .where(eq(companyKnowledgeTable.id, params.data.id))
    .returning();

  res.json({ ...updated, createdAt: updated.createdAt.toISOString() });
});

router.delete("/admin/clients/:slug/knowledge/:id", async (req: Request, res: Response) => {
  const params = KnowledgeEntryParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: "Invalid params" }); return; }

  const [client] = await db
    .select({ id: clientsTable.id, deletedAt: clientsTable.deletedAt })
    .from(clientsTable)
    .where(eq(clientsTable.slug, params.data.slug))
    .limit(1);
  if (!client || client.deletedAt) { res.status(404).json({ error: "Client not found" }); return; }

  const [existing] = await db
    .select({ id: companyKnowledgeTable.id })
    .from(companyKnowledgeTable)
    .where(and(eq(companyKnowledgeTable.id, params.data.id), eq(companyKnowledgeTable.clientId, client.id)))
    .limit(1);
  if (!existing) { res.status(404).json({ error: "Entry not found" }); return; }

  await db.delete(companyKnowledgeTable).where(eq(companyKnowledgeTable.id, params.data.id));
  res.status(204).end();
});

function buildBranding(client: typeof clientsTable.$inferSelect) {
  const cfg = (client.config ?? {}) as Record<string, unknown>;
  return {
    clientId: client.id,
    companyName: (cfg.companyName as string | undefined) ?? client.name,
    slug: client.slug,
    tagline: (cfg.tagline as string | null | undefined) ?? null,
    heroHeadline: (cfg.heroHeadline as string | null | undefined) ?? null,
    primaryColor: (cfg.primaryColor as string | null | undefined) ?? null,
    secondaryColor: (cfg.secondaryColor as string | null | undefined) ?? null,
    logoUrl: (cfg.logoUrl as string | null | undefined) ?? null,
    city: (cfg.city as string | null | undefined) ?? null,
    phone: (cfg.phone as string | null | undefined) ?? null,
    websiteUrl: (cfg.websiteUrl as string | null | undefined) ?? null,
    demoLanguage: (cfg.demoLanguage as string | null | undefined) ?? null,
    demoLanguages: Array.isArray(cfg.demoLanguages)
      ? (cfg.demoLanguages as string[])
      : cfg.demoLanguage
        ? [(cfg.demoLanguage as string)]
        : ["en"],
    industry: (cfg.industry as string | null | undefined) ?? null,
    vertical: (cfg.vertical as string | null | undefined) ?? "healthcare",
    heroImageUrl: (cfg.heroImageUrl as string | null | undefined) ?? null,
    twilioSender: client.twilioSender ?? null,
  };
}

function toClientResponse(client: typeof clientsTable.$inferSelect) {
  return {
    id: client.id,
    name: client.name,
    slug: client.slug,
    isActive: client.isActive,
    createdAt: client.createdAt.toISOString(),
    twilioSender: client.twilioSender ?? "",
    branding: buildBranding(client),
  };
}

export default router;
