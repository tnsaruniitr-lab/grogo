import { Router, type IRouter, type Request, type Response } from "express";
import { randomBytes, createHash, timingSafeEqual } from "crypto";
import { requireDashboardAuth } from "../lib/dashboard-auth";
import { isPrivateHost } from "../lib/ssrf-guard";
import { db } from "@workspace/db";
import { clientsTable, companyKnowledgeTable, clientProfilesTable, leadsTable, appointmentsTable } from "@workspace/db";
import { eq, isNull, and, inArray, asc, desc, ne } from "drizzle-orm";
import { z } from "zod/v4";
import { extractBrand } from "../lib/brand-extractor";
import {
  CreateDemoClientBody,
  UpdateDemoClientBody,
  UpdateDemoClientParams,
  DeleteDemoClientParams,
  GetClientBrandingParams,
} from "@workspace/api-zod";
import { startCrawlJob, runCrawlPipeline } from "../lib/crawl-pipeline";
import { embedText, embeddingToJson } from "../lib/embedder";
import { getSettings, updateSettings } from "../lib/settings";

const KNOWLEDGE_LANGUAGES = [
  "en", "de", "tr", "fr", "ar", "nl", "es", "pl",
  "pt", "it", "ru", "zh", "hi", "ur", "fa", "ko", "ja",
] as const;

const KNOWLEDGE_CATEGORIES = [
  "about", "services", "service", "pricing", "faq",
  "process", "identity", "team", "location", "contact", "other",
] as const;

const CreateKnowledgeEntryBody = z.object({
  category: z.enum(KNOWLEDGE_CATEGORIES),
  question: z.string().min(1).max(1000),
  answer: z.string().min(1).max(4000),
  language: z.enum(KNOWLEDGE_LANGUAGES).default("en"),
  priority: z.number().int().default(0),
});

const KnowledgeEntryParams = z.object({
  slug: z.string(),
  id: z.coerce.number().int().positive(),
});

async function seedManualKnowledge(
  clientId: number,
  mode: string,
  cfg: Record<string, unknown>,
): Promise<void> {
  const companyName = (cfg.companyName as string | undefined) ?? "the company";
  const language = (cfg.demoLanguage as string | undefined) ?? "en";

  const entries: Array<{ category: string; question: string; answer: string }> = [];

  if (mode === "manual") {
    const desc = cfg.businessDescription as string | undefined;
    const services = cfg.servicesOffered as string | undefined;
    const pricing = cfg.pricingInfo as string | undefined;
    const location = cfg.locationAndTarget as string | undefined;
    if (desc) entries.push({ category: "about", question: `What is ${companyName}?`, answer: desc });
    if (services) entries.push({ category: "services", question: `What services does ${companyName} offer?`, answer: services });
    if (pricing) entries.push({ category: "pricing", question: `How much does ${companyName} charge?`, answer: pricing });
    if (location) entries.push({ category: "location", question: `Where is ${companyName} based and who do they serve?`, answer: location });
  } else if (mode === "individual") {
    const name = companyName;
    const pitch = cfg.personalPitch as string | undefined;
    const offer = cfg.servicesOffer as string | undefined;
    const icp = cfg.idealClientProfile as string | undefined;
    const q1 = cfg.qualifyingQuestion1 as string | undefined;
    const q2 = cfg.qualifyingQuestion2 as string | undefined;
    const q3 = cfg.qualifyingQuestion3 as string | undefined;
    const avail = cfg.availability as string | undefined;
    if (pitch) entries.push({ category: "about", question: `Who is ${name} and what do they do?`, answer: pitch });
    if (offer) entries.push({ category: "services", question: `What does ${name} offer?`, answer: offer });
    if (icp) entries.push({ category: "process", question: `Who is the ideal client for ${name}?`, answer: icp });
    const qs = [q1, q2, q3].filter(Boolean);
    if (qs.length > 0) {
      entries.push({
        category: "faq",
        question: `What questions does ${name} ask before taking a call?`,
        answer: qs.map((q) => `- ${q}`).join("\n"),
      });
    }
    if (avail) entries.push({ category: "process", question: `When is ${name} available for calls?`, answer: avail });
  }

  for (const entry of entries) {
    const embeddingVec = await embedText(`${entry.question} ${entry.answer}`);
    await db.insert(companyKnowledgeTable).values({
      clientId,
      category: entry.category,
      question: entry.question,
      answer: entry.answer,
      language,
      priority: 10,
      source: "manual",
      approvalStatus: "approved",
      embeddingJson: embeddingVec ? embeddingToJson(embeddingVec) : null,
    });
  }
}

const router: IRouter = Router();

// ─── Site proxy (auth via header OR ?token= query param) ─────────────────────
// Registered BEFORE the blanket /admin requireDashboardAuth so that browser
// iframe loads — which cannot attach Authorization headers — can authenticate
// via the ?token= query param (same base64 credentials, embedded in the URL).
function checkSiteProxyAuth(req: Request, res: Response, next: () => void): void {
  const expectedUser = (process.env["DASH_USER"] ?? process.env["DASHBOARD_USER"])?.trim();
  const expectedPass = (process.env["DASH_PASS"] ?? process.env["DASHBOARD_PASS"])?.trim();
  if (!expectedUser || !expectedPass) { res.status(503).send("Auth not configured"); return; }

  // Accept credentials from Authorization header (fetch calls) OR ?token= (iframe src).
  // Browser iframe src navigations cannot attach headers, so the hub embeds the same
  // base64(user:pass) string that Basic Auth would send as a ?token= query param.
  const authHeader = req.headers["authorization"] ?? "";
  const tokenParam = req.query["token"] as string | undefined;
  const raw = authHeader.startsWith("Basic ") ? authHeader.slice(6) : (tokenParam ?? "");

  if (!raw) { res.status(401).send("Authentication required"); return; }

  try {
    const decoded = Buffer.from(raw, "base64").toString("utf8");
    const colonIdx = decoded.indexOf(":");
    if (colonIdx === -1) { res.status(401).send("Invalid credentials format"); return; }
    const user = decoded.slice(0, colonIdx).trim();
    const pass = decoded.slice(colonIdx + 1).trim();
    const ha = createHash("sha256").update(user).digest();
    const hb = createHash("sha256").update(expectedUser).digest();
    const hc = createHash("sha256").update(pass).digest();
    const hd = createHash("sha256").update(expectedPass).digest();
    if (ha.length === hb.length && timingSafeEqual(ha, hb) && hc.length === hd.length && timingSafeEqual(hc, hd)) {
      return next();
    }
  } catch { /* fall through to 401 */ }
  res.status(401).send("Invalid credentials");
}

// Site proxy registered here, before the blanket auth middleware, with its own
// dual-mode auth (Authorization header OR ?token= query param for iframe loads).
router.get("/admin/site-proxy", checkSiteProxyAuth, async (req: Request, res: Response) => {
  const raw = req.query.url as string | undefined;
  if (!raw) { res.status(400).send("Missing url"); return; }

  let target: URL;
  try { target = new URL(raw); } catch { res.status(400).send("Invalid url"); return; }
  if (!["http:", "https:"].includes(target.protocol)) { res.status(400).send("Only http/https"); return; }
  if (isPrivateHost(target.hostname)) { res.status(400).send("Private/internal URLs are not allowed"); return; }

  try {
    const upstream = await fetch(target.href, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "de,en;q=0.9",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(12_000),
    });

    const ct = upstream.headers.get("content-type") ?? "text/html";
    if (!ct.includes("html")) { res.status(400).send("Not an HTML page"); return; }

    let html = await upstream.text();
    const baseTag = `<base href="${target.origin}${target.pathname}">`;
    if (/<head[^>]*>/i.test(html)) {
      html = html.replace(/(<head[^>]*>)/i, `$1${baseTag}`);
    } else {
      html = baseTag + html;
    }
    html = html.replace(/<meta[^>]+http-equiv=["']refresh["'][^>]*>/gi, "");

    res
      .status(upstream.status)
      .setHeader("Content-Type", "text/html; charset=utf-8")
      .setHeader("X-Frame-Options", "SAMEORIGIN")
      .setHeader("Cache-Control", "no-store")
      .send(html);
  } catch (err) {
    req.log.warn({ err, url: target.href }, "site-proxy fetch failed");
    res.status(502).send("Could not fetch the site");
  }
});

// All /admin/* routes require Basic Auth — public /clients/* routes below are unaffected
router.use("/admin", requireDashboardAuth);



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

  // Raw body branding preserves fields Zod strips (mode, businessDescription, etc.)
  const rawBranding = (req.body?.branding ?? {}) as Record<string, unknown>;

  const demoLangs: string[] = Array.isArray(rawBranding.demoLanguages)
    ? (rawBranding.demoLanguages as string[])
    : rawBranding.demoLanguage
      ? [rawBranding.demoLanguage as string]
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
      // Store raw branding (including mode) so the frontend can read it back
      config: rawBranding,
      demoToken: randomBytes(32).toString("hex"),
    })
    .returning();

  res.status(201).json(toClientResponse(created));

  const clientMode = rawBranding.mode as string | undefined;

  if (clientMode === "manual" || clientMode === "individual") {
    // Seed knowledge entries from manual fields — no crawl needed
    seedManualKnowledge(created.id, clientMode, rawBranding)
      .catch((err) => req.log.error({ err, clientId: created.id }, "Manual knowledge seeding failed"));
  } else {
    // Auto-trigger crawl if a websiteUrl was provided
    const websiteUrl = rawBranding.websiteUrl as string | undefined;
    if (websiteUrl) {
      startCrawlJob(created.id, websiteUrl)
        .then((jobId) => runCrawlPipeline(created.id, websiteUrl, jobId))
        .catch((err) => req.log.error({ err, clientId: created.id }, "Auto-crawl failed to start"));
    }
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
  if (body.data.branding !== undefined) {
    const existingCfg = (existing.config ?? {}) as Record<string, unknown>;
    const newCfg = body.data.branding as Record<string, unknown>;
    // Base the merge on existingCfg so a partial PATCH never wipes fields that
    // weren't included in the request body. newCfg only contains keys explicitly
    // sent (Zod strips absent optional fields), so this is a safe shallow merge.
    // If industryLocked is true in the existing config, protect the industry field.
    if (existingCfg.industryLocked === true) {
      updates.config = { ...existingCfg, ...newCfg, industryLocked: true, industry: existingCfg.industry };
    } else {
      updates.config = { ...existingCfg, ...newCfg };
    }
    // Sync languagePrimary / languageSecondary columns from demoLanguages so
    // bot-pipeline language detection always reflects the current language config.
    const demoLangs: string[] = Array.isArray(newCfg.demoLanguages)
      ? (newCfg.demoLanguages as string[])
      : typeof newCfg.demoLanguage === "string"
        ? [newCfg.demoLanguage]
        : [];
    if (demoLangs.length > 0) {
      updates.languagePrimary = demoLangs[0] ?? existing.languagePrimary;
      updates.languageSecondary = demoLangs[1] ?? null;
    }
  }

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
      approvalStatus: companyKnowledgeTable.approvalStatus,
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

// ── Review & approve routes must come BEFORE /:id to avoid param capture ─────

const CRITICAL_FACT_RULES = [
  { key: "what_it_does", label: "What this business does", categories: ["identity", "about"], keywords: null as string[] | null },
  { key: "target_customers", label: "Target customers", categories: ["faq"], keywords: ["who", "target", "customer", "client", "ideal"] },
  { key: "main_services", label: "Main services", categories: ["service", "services"], keywords: null },
  { key: "booking_path", label: "How to book / get started", categories: ["process"], keywords: ["book", "demo", "appoint", "schedule", "call", "start"] },
  { key: "pricing_policy", label: "Pricing policy", categories: ["pricing"], keywords: null },
  { key: "contact_escalation", label: "Contact / escalation", categories: ["contact"], keywords: null },
] as const;

router.get("/admin/clients/:slug/knowledge/review", async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const [client] = await db
    .select({ id: clientsTable.id, name: clientsTable.name, deletedAt: clientsTable.deletedAt })
    .from(clientsTable)
    .where(eq(clientsTable.slug, slug))
    .limit(1);
  if (!client || client.deletedAt) { res.status(404).json({ error: "Client not found" }); return; }

  const entries = await db
    .select({
      id: companyKnowledgeTable.id,
      category: companyKnowledgeTable.category,
      question: companyKnowledgeTable.question,
      answer: companyKnowledgeTable.answer,
      language: companyKnowledgeTable.language,
      priority: companyKnowledgeTable.priority,
      source: companyKnowledgeTable.source,
      sourceUrl: companyKnowledgeTable.sourceUrl,
      approvalStatus: companyKnowledgeTable.approvalStatus,
      createdAt: companyKnowledgeTable.createdAt,
      crawlJobId: companyKnowledgeTable.crawlJobId,
      reviewKey: companyKnowledgeTable.reviewKey,
      evidenceQuote: companyKnowledgeTable.evidenceQuote,
      sourceSection: companyKnowledgeTable.sourceSection,
      riskFlags: companyKnowledgeTable.riskFlags,
    })
    .from(companyKnowledgeTable)
    .where(eq(companyKnowledgeTable.clientId, client.id))
    .orderBy(asc(companyKnowledgeTable.priority), asc(companyKnowledgeTable.id));

  const serialised = entries.map((e) => ({ ...e, createdAt: e.createdAt.toISOString() }));

  // Try to load a synthesized profile (V2): prefer latest pending for an in-progress review,
  // fall back to the active profile if no pending one exists.
  const [pendingProfile] = await db
    .select({ profile: clientProfilesTable.profile, status: clientProfilesTable.status })
    .from(clientProfilesTable)
    .where(and(eq(clientProfilesTable.clientId, client.id), eq(clientProfilesTable.status, "pending")))
    .orderBy(desc(clientProfilesTable.createdAt))
    .limit(1);

  const [activeProfile] = pendingProfile
    ? [pendingProfile]
    : await db
        .select({ profile: clientProfilesTable.profile, status: clientProfilesTable.status })
        .from(clientProfilesTable)
        .where(and(eq(clientProfilesTable.clientId, client.id), eq(clientProfilesTable.status, "active")))
        .orderBy(desc(clientProfilesTable.createdAt))
        .limit(1);

  type ProfileField = { value: string | string[]; confidence: number; needsReview: boolean };
  type ParsedProfile = Record<string, ProfileField>;

  let parsedProfile: ParsedProfile | null = null;
  if (activeProfile?.profile) {
    try { parsedProfile = JSON.parse(activeProfile.profile) as ParsedProfile; } catch { /* ignore */ }
  }

  const PROFILE_FACT_MAP = [
    { key: "what_it_does",       label: "What this business does",    profileKey: "whatItDoes" },
    { key: "target_customers",   label: "Target customers",           profileKey: "targetCustomers" },
    { key: "main_services",      label: "Main services",              profileKey: "mainServices" },
    { key: "pricing_policy",     label: "Pricing policy",             profileKey: "pricingPolicy" },
    { key: "booking_path",       label: "How to book / get started",  profileKey: "bookingPath" },
    { key: "trust_signals",      label: "Trust & credibility",        profileKey: "trustSignals" },
    { key: "must_not_claim",     label: "Must NOT claim (bot limits)", profileKey: "mustNotClaim" },
  ] as const;

  // Build criticalFacts from synthesized profile when available; fall back to heuristic.
  const urlDepth = (url: string | null) => {
    if (!url) return 0;
    try { return new URL(url).pathname.split("/").filter(Boolean).length; } catch { return 5; }
  };
  const candidateScore = (e: typeof serialised[number]) =>
    (e.source === "manual" ? 0 : 10) + (e.priority === 1 ? 0 : 5) + urlDepth(e.sourceUrl);

  const criticalFacts = parsedProfile
    ? [
        { key: "business_name", label: "Business name", value: client.name, entryId: null as number | null, confidence: 1, needsReview: false, source: "profile" as string | null },
        ...PROFILE_FACT_MAP.map((m) => {
          const field = parsedProfile![m.profileKey];
          const rawValue = field?.value ?? "";
          const value = Array.isArray(rawValue) ? rawValue.join(", ") : String(rawValue);
          return {
            key: m.key,
            label: m.label,
            value: value.slice(0, 600),
            entryId: null as number | null,
            confidence: field?.confidence ?? null,
            needsReview: field?.needsReview ?? false,
            source: "profile" as string | null,
          };
        }),
      ]
    : [
        { key: "business_name", label: "Business name", value: client.name, entryId: null as number | null, confidence: null, needsReview: false, source: null as string | null },
        ...CRITICAL_FACT_RULES.map((rule) => {
          const candidates = serialised
            .filter((e) => (rule.categories as readonly string[]).includes(e.category))
            .sort((a, b) => candidateScore(a) - candidateScore(b));
          const match = rule.keywords
            ? (candidates.find((e) => rule.keywords!.some((kw) => e.question.toLowerCase().includes(kw))) ?? candidates[0] ?? null)
            : (candidates[0] ?? null);
          return {
            key: rule.key,
            label: rule.label,
            value: match ? match.answer.slice(0, 400) : "",
            entryId: match ? match.id : null,
            confidence: null as number | null,
            needsReview: false,
            sourceUrl: match ? (match.sourceUrl ?? null) : null,
            source: match ? match.source : null,
          };
        }),
      ];

  const categoryOrder = ["identity", "about", "services", "service", "pricing", "faq", "process", "contact", "team", "location", "other"];
  const allCats = [...new Set(serialised.map((e) => e.category))].sort(
    (a, b) => (categoryOrder.indexOf(a) === -1 ? 99 : categoryOrder.indexOf(a)) - (categoryOrder.indexOf(b) === -1 ? 99 : categoryOrder.indexOf(b)),
  );
  const groups = allCats.map((cat) => ({ category: cat, entries: serialised.filter((e) => e.category === cat) }));

  const pendingCount = serialised.filter((e) => e.approvalStatus === "pending").length;
  const approvedCount = serialised.filter((e) => e.approvalStatus === "approved").length;

  res.json({ criticalFacts, groups, pendingCount, approvedCount });
});

const ApproveKnowledgeBody = z.object({
  ids: z.array(z.number().int()).optional(),
  approveAll: z.boolean().optional(),
  status: z.enum(["approved", "pending", "rejected"]).optional().default("approved"),
});

router.post("/admin/clients/:slug/knowledge/approve", async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const [client] = await db
    .select({ id: clientsTable.id, deletedAt: clientsTable.deletedAt })
    .from(clientsTable)
    .where(eq(clientsTable.slug, slug))
    .limit(1);
  if (!client || client.deletedAt) { res.status(404).json({ error: "Client not found" }); return; }

  const parsed = ApproveKnowledgeBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }

  const { ids, approveAll, status } = parsed.data;

  if (approveAll) {
    await db
      .update(companyKnowledgeTable)
      .set({ approvalStatus: status })
      .where(and(eq(companyKnowledgeTable.clientId, client.id), eq(companyKnowledgeTable.approvalStatus, "pending")));
    const total = await db.$count(companyKnowledgeTable, eq(companyKnowledgeTable.clientId, client.id));
    res.json({ updated: total });
    return;
  }

  if (!ids || ids.length === 0) { res.status(400).json({ error: "Provide ids or approveAll=true" }); return; }

  await db
    .update(companyKnowledgeTable)
    .set({ approvalStatus: status })
    .where(and(eq(companyKnowledgeTable.clientId, client.id), inArray(companyKnowledgeTable.id, ids)));

  res.json({ updated: ids.length });
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
    category: z.enum(KNOWLEDGE_CATEGORIES).optional(),
    question: z.string().min(1).max(1000).optional(),
    answer: z.string().min(1).max(4000).optional(),
    language: z.enum(KNOWLEDGE_LANGUAGES).optional(),
    approvalStatus: z.enum(["approved", "pending", "rejected"]).optional(),
  }).safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: body.error.flatten() }); return; }

  const updates: Record<string, unknown> = {};
  if (body.data.category) updates.category = body.data.category;
  if (body.data.question !== undefined) updates.question = body.data.question;
  if (body.data.answer !== undefined) updates.answer = body.data.answer;
  if (body.data.language) updates.language = body.data.language;
  if (body.data.approvalStatus) updates.approvalStatus = body.data.approvalStatus;

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

// ── Demo Assets ───────────────────────────────────────────────────────────────
// Assets (Calendly links, Loom videos, GMeet links, PDFs, etc.) are stored as
// company_knowledge entries with category="asset". The question field is
// auto-generated with natural trigger phrases so RAG retrieval fires correctly;
// the answer field carries the [ASSET:type] prefix + label + URL.

const ASSET_TYPES = ["calendly", "loom", "gmeet", "pdf", "image", "custom"] as const;
type AssetType = (typeof ASSET_TYPES)[number];

const CreateAssetBody = z.object({
  type: z.enum(ASSET_TYPES),
  label: z.string().min(1).max(200),
  url: z.string().url("Must be a valid URL"),
  serviceContext: z.string().max(300).optional(),
});

function buildAssetEntry(type: AssetType, label: string, url: string, serviceContext?: string) {
  const ctx = serviceContext ? ` ${serviceContext}.` : "";
  const QUESTIONS: Record<AssetType, string> = {
    calendly: `Can I book a call? How do I schedule a meeting? Can we get started? I want to book an appointment. When can we speak? Can I schedule a consultation? How do I book a meeting?`,
    loom: `Can I see a demo? Do you have a video? Show me how it works? Can you walk me through it? Do you have a product demo? I'd like to see it in action. Is there a walkthrough video?`,
    gmeet: `Can we do a video call? Can we meet online? Do you have a Google Meet link? Can we jump on a video call? I want to meet virtually. Can we video chat?`,
    pdf: `Send me the pricing. What are your prices${ctx}? Do you have a price list? Can I see your pricing? How much does it cost? Can you send me your brochure? Do you have a price sheet? Can you send me information?`,
    image: `Send me your price chart. Do you have pricing${ctx}? Can I see your rates? What does it cost? Can you send me an overview?`,
    custom: `${label}? Tell me more about ${label}. Do you have information about ${label}? Can you share ${label} with me?`,
  };
  const PREFIXES: Record<AssetType, string> = {
    calendly: "[ASSET:calendly] 📅",
    loom: "[ASSET:loom] 🎬",
    gmeet: "[ASSET:gmeet] 📹",
    pdf: "[ASSET:pdf] 📋",
    image: "[ASSET:image] 🖼️",
    custom: "[ASSET:custom] 🔗",
  };
  const question = QUESTIONS[type];
  const answer = `${PREFIXES[type]} ${label}: ${url}${serviceContext ? ` (${serviceContext})` : ""}`;
  return { question, answer };
}

router.get("/admin/clients/:slug/assets", async (req: Request, res: Response) => {
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
      question: companyKnowledgeTable.question,
      answer: companyKnowledgeTable.answer,
      createdAt: companyKnowledgeTable.createdAt,
    })
    .from(companyKnowledgeTable)
    .where(and(
      eq(companyKnowledgeTable.clientId, client.id),
      eq(companyKnowledgeTable.category, "asset"),
    ))
    .orderBy(asc(companyKnowledgeTable.id));

  const assets = rows.map((r) => {
    const typeMatch = r.answer.match(/^\[ASSET:(\w+)\]/);
    const type = typeMatch?.[1] ?? "custom";
    const withoutPrefix = r.answer.replace(/^\[ASSET:\w+\]\s*[\p{Emoji_Presentation}\p{Extended_Pictographic}]?\s*/u, "");
    const colonIdx = withoutPrefix.indexOf(": ");
    const label = colonIdx >= 0 ? withoutPrefix.slice(0, colonIdx).trim() : withoutPrefix.trim();
    const rest = colonIdx >= 0 ? withoutPrefix.slice(colonIdx + 2).trim() : "";
    const parenIdx = rest.lastIndexOf(" (");
    const url = parenIdx >= 0 ? rest.slice(0, parenIdx).trim() : rest.trim();
    const serviceContext = parenIdx >= 0 ? rest.slice(parenIdx + 2, -1).trim() : undefined;
    return {
      id: r.id,
      type,
      label,
      url,
      serviceContext: serviceContext || undefined,
      createdAt: r.createdAt.toISOString(),
    };
  });

  res.json({ assets });
});

router.post("/admin/clients/:slug/assets", async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const [client] = await db
    .select({ id: clientsTable.id, deletedAt: clientsTable.deletedAt })
    .from(clientsTable)
    .where(eq(clientsTable.slug, slug))
    .limit(1);
  if (!client || client.deletedAt) { res.status(404).json({ error: "Client not found" }); return; }

  const parsed = CreateAssetBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.issues.map((i) => i.message).join(", ") }); return; }

  const { type, label, url, serviceContext } = parsed.data;
  const { question, answer } = buildAssetEntry(type, label, url, serviceContext);
  const embeddingText = `${question} ${label} ${url}`;
  const embedding = await embedText(embeddingText);

  const [created] = await db
    .insert(companyKnowledgeTable)
    .values({
      clientId: client.id,
      category: "asset",
      question,
      answer,
      language: "en",
      priority: 50,
      source: "manual",
      approvalStatus: "approved",
      embeddingJson: embedding ? JSON.stringify(embedding) : null,
    })
    .returning({ id: companyKnowledgeTable.id, createdAt: companyKnowledgeTable.createdAt });

  req.log.info({ clientId: client.id, type, label }, "Asset created");
  res.status(201).json({ id: created.id, type, label, url, serviceContext, createdAt: created.createdAt.toISOString() });
});

router.delete("/admin/clients/:slug/assets/:id", async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [client] = await db
    .select({ id: clientsTable.id, deletedAt: clientsTable.deletedAt })
    .from(clientsTable)
    .where(eq(clientsTable.slug, slug))
    .limit(1);
  if (!client || client.deletedAt) { res.status(404).json({ error: "Client not found" }); return; }

  const [existing] = await db
    .select({ id: companyKnowledgeTable.id, category: companyKnowledgeTable.category })
    .from(companyKnowledgeTable)
    .where(and(eq(companyKnowledgeTable.id, id), eq(companyKnowledgeTable.clientId, client.id)))
    .limit(1);
  if (!existing) { res.status(404).json({ error: "Asset not found" }); return; }
  if (existing.category !== "asset") { res.status(400).json({ error: "Entry is not an asset" }); return; }

  await db.delete(companyKnowledgeTable).where(eq(companyKnowledgeTable.id, id));
  res.status(204).end();
});

// Install config — exposes shared webhook API key to the hub UI (admin-only route)
router.get("/admin/install-config", (_req: Request, res: Response) => {
  res.json({
    manychatApiKey: process.env.WEBHOOK_API_KEY ?? null,
  });
});


// ─── System Settings ─────────────────────────────────────────────────────────

router.get("/admin/settings", async (_req: Request, res: Response) => {
  const settings = await getSettings();
  res.json(settings);
});

router.put("/admin/settings", async (req: Request, res: Response) => {
  const patch = req.body as Record<string, unknown>;
  if (!patch || typeof patch !== "object") {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const updated = await updateSettings(patch);
  res.json(updated);
});

// ─── Client Profiles ─────────────────────────────────────────────────────────

router.get("/admin/clients/:slug/profile", async (req: Request, res: Response) => {
  const { slug } = req.params as { slug: string };

  const [client] = await db
    .select({ id: clientsTable.id, deletedAt: clientsTable.deletedAt })
    .from(clientsTable)
    .where(eq(clientsTable.slug, slug))
    .limit(1);
  if (!client || client.deletedAt) { res.status(404).json({ error: "Client not found" }); return; }

  const profiles = await db
    .select()
    .from(clientProfilesTable)
    .where(eq(clientProfilesTable.clientId, client.id))
    .orderBy(desc(clientProfilesTable.createdAt))
    .limit(5);

  if (profiles.length === 0) { res.json(null); return; }

  res.json(profiles.map((p) => ({
    id: p.id,
    clientId: p.clientId,
    crawlJobId: p.crawlJobId ?? null,
    status: p.status,
    profile: p.profile ? JSON.parse(p.profile) : null,
    confidence: p.confidence ?? null,
    synthesisModel: p.synthesisModel ?? null,
    createdAt: p.createdAt.toISOString(),
    activatedAt: p.activatedAt ? p.activatedAt.toISOString() : null,
  })));
});

// ─── Knowledge Activation (V2) ───────────────────────────────────────────────

const ActivateKnowledgeBody = z.object({
  crawlJobId: z.number().int().positive(),
  profileId: z.number().int().positive().optional(),
  archivePrevious: z.boolean().default(true),
});

router.post("/admin/clients/:slug/knowledge/activate", async (req: Request, res: Response) => {
  const { slug } = req.params as { slug: string };

  const bodyResult = ActivateKnowledgeBody.safeParse(req.body);
  if (!bodyResult.success) { res.status(400).json({ error: "Invalid body", issues: bodyResult.error.issues }); return; }
  const { crawlJobId, profileId, archivePrevious } = bodyResult.data;

  const [client] = await db
    .select({ id: clientsTable.id, deletedAt: clientsTable.deletedAt })
    .from(clientsTable)
    .where(eq(clientsTable.slug, slug))
    .limit(1);
  if (!client || client.deletedAt) { res.status(404).json({ error: "Client not found" }); return; }

  const pendingRows = await db
    .select({ id: companyKnowledgeTable.id })
    .from(companyKnowledgeTable)
    .where(
      and(
        eq(companyKnowledgeTable.clientId, client.id),
        eq(companyKnowledgeTable.crawlJobId, crawlJobId),
        eq(companyKnowledgeTable.approvalStatus, "pending"),
        ne(companyKnowledgeTable.source, "manual"),
      ),
    );

  if (pendingRows.length === 0) {
    res.status(400).json({ error: "No pending knowledge rows for this crawl job" });
    return;
  }

  const pendingIds = pendingRows.map((r) => r.id);

  // Fully atomic activation inside a single DB transaction
  const resolvedProfileId = await db.transaction(async (tx) => {
    // 1. Archive old approved crawl rows (keep manual entries live)
    if (archivePrevious) {
      await tx
        .update(companyKnowledgeTable)
        .set({ approvalStatus: "archived" })
        .where(
          and(
            eq(companyKnowledgeTable.clientId, client.id),
            eq(companyKnowledgeTable.approvalStatus, "approved"),
            ne(companyKnowledgeTable.source, "manual"),
          ),
        );
    }

    // 2. Approve new pending rows
    await tx
      .update(companyKnowledgeTable)
      .set({ approvalStatus: "approved" })
      .where(inArray(companyKnowledgeTable.id, pendingIds));

    // 3. Resolve profile: use explicit profileId or auto-find latest pending for this job
    let resolvedId = profileId ?? null;
    if (!resolvedId) {
      const [latestProfile] = await tx
        .select({ id: clientProfilesTable.id })
        .from(clientProfilesTable)
        .where(
          and(
            eq(clientProfilesTable.clientId, client.id),
            eq(clientProfilesTable.crawlJobId, crawlJobId),
            eq(clientProfilesTable.status, "pending"),
          ),
        )
        .orderBy(desc(clientProfilesTable.createdAt))
        .limit(1);
      resolvedId = latestProfile?.id ?? null;
    }

    if (resolvedId) {
      // 4. Archive currently active profiles
      await tx
        .update(clientProfilesTable)
        .set({ status: "archived" })
        .where(
          and(
            eq(clientProfilesTable.clientId, client.id),
            eq(clientProfilesTable.status, "active"),
          ),
        );

      // 5. Activate new profile
      await tx
        .update(clientProfilesTable)
        .set({ status: "active", activatedAt: new Date() })
        .where(
          and(
            eq(clientProfilesTable.id, resolvedId),
            eq(clientProfilesTable.clientId, client.id),
          ),
        );
    }

    return resolvedId;
  });

  req.log.info(
    { clientId: client.id, crawlJobId, approvedCount: pendingIds.length, profileId: resolvedProfileId },
    "Knowledge activation complete",
  );

  res.json({ approvedCount: pendingIds.length, profileId: resolvedProfileId ?? null });
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
    industryLocked: (cfg.industryLocked as boolean | undefined) ?? false,
    vertical: (cfg.vertical as string | null | undefined) ?? "healthcare",
    heroImageUrl: (cfg.heroImageUrl as string | null | undefined) ?? null,
    twilioSender: client.twilioSender ?? null,
    defaultMessage: (cfg.defaultMessage as string | null | undefined) ?? null,
    requiresPassword: !!(cfg.demoPassword as string | null | undefined),
  };
}

router.post("/admin/clients/:id/set-demo-password", async (req: Request, res: Response) => {
  const id = parseInt(req.params["id"] as string, 10);
  if (isNaN(id) || id <= 0) { res.status(400).json({ error: "Invalid id" }); return; }
  const { password } = req.body as { password?: string };

  const [client] = await db.select().from(clientsTable).where(eq(clientsTable.id, id)).limit(1);
  if (!client || client.deletedAt) { res.status(404).json({ error: "Not found" }); return; }

  const cfg = (client.config ?? {}) as Record<string, unknown>;
  let newCfg: Record<string, unknown>;
  if (password) {
    newCfg = { ...cfg, demoPassword: password };
  } else {
    const { demoPassword: _removed, ...rest } = cfg;
    newCfg = rest;
  }

  await db.update(clientsTable).set({ config: newCfg }).where(eq(clientsTable.id, id));
  res.json({ ok: true, hasPassword: !!password });
});

router.post("/clients/:slug/verify-demo-password", async (req: Request, res: Response) => {
  const slug = req.params["slug"] as string;
  const { password } = req.body as { password?: string };
  if (!password) { res.status(400).json({ error: "Missing password" }); return; }

  const [client] = await db
    .select()
    .from(clientsTable)
    .where(eq(clientsTable.slug, slug))
    .limit(1);

  if (!client || client.deletedAt) { res.status(404).json({ error: "Not found" }); return; }

  const cfg = (client.config ?? {}) as Record<string, unknown>;
  const stored = cfg.demoPassword as string | null | undefined;
  if (!stored) { res.json({ ok: true }); return; }
  if (stored !== password) { res.status(401).json({ error: "Wrong password" }); return; }
  res.json({ ok: true });
});

router.post("/admin/clients/:id/regen-demo-token", async (req: Request, res: Response) => {
  const id = parseInt(req.params["id"] as string, 10);
  if (isNaN(id) || id <= 0) { res.status(400).json({ error: "Invalid id" }); return; }

  const newToken = randomBytes(32).toString("hex");
  const [updated] = await db
    .update(clientsTable)
    .set({ demoToken: newToken })
    .where(and(eq(clientsTable.id, id), isNull(clientsTable.deletedAt)))
    .returning({ id: clientsTable.id, demoToken: clientsTable.demoToken });

  if (!updated) { res.status(404).json({ error: "Client not found" }); return; }
  res.json({ id: updated.id, demoToken: updated.demoToken });
});

// ─── Temporary: seed carecompass demo data (already run — safe to remove) ────
router.post("/admin/seed-carecompass-stats", async (_req: Request, res: Response) => {
  res.status(410).json({ error: "Already run — endpoint disabled" });
});

router.post("/admin/seed-carecompass-stats-DO-NOT-USE", async (req: Request, res: Response) => {
  const CLIENT_ID = 15;

  type LeadRow = { phone: string; name: string; language: string; source: string; status: string; notes: string; createdAt: Date };
  const leads: LeadRow[] = [
    { phone: "instagram:448291034", name: "Fatima Al Mansoori", language: "en", source: "instagram", status: "appointment_booked", notes: "Service: home nursing, City: Dubai Marina, For: mother post-surgery", createdAt: new Date("2026-05-01T09:15:00Z") },
    { phone: "instagram:993847201", name: "Mohammed Al Rashidi", language: "en", source: "instagram", status: "appointment_booked", notes: "Service: elderly care, City: Jumeirah, For: father, Action: book_callback", createdAt: new Date("2026-05-02T11:30:00Z") },
    { phone: "+971501234567", name: "Priya Nair", language: "en", source: "direct", status: "callback_booked", notes: "Service: physiotherapy, City: Al Barsha, For: self, Mode: at-home", createdAt: new Date("2026-05-02T14:00:00Z") },
    { phone: "facebook:558291047382", name: "Omar Khalid", language: "en", source: "facebook", status: "appointment_booked", notes: "Service: post-surgery care, City: Business Bay, Action: book_callback", createdAt: new Date("2026-05-03T08:45:00Z") },
    { phone: "+971552345678", name: "Sunita Sharma", language: "en", source: "direct", status: "qualified", notes: "Service: home nursing, City: Deira, For: husband, Mode: daily visits", createdAt: new Date("2026-05-03T16:20:00Z") },
    { phone: "instagram:771029384", name: "Layla Hassan", language: "en", source: "instagram", status: "appointment_booked", notes: "Service: pediatric care, City: Mirdif, For: child, Action: book_callback", createdAt: new Date("2026-05-05T10:00:00Z") },
    { phone: "+971563456789", name: "Rajan Pillai", language: "en", source: "direct", status: "appointment_booked", notes: "Service: elderly care, City: Sharjah, For: mother, Mode: live-in", createdAt: new Date("2026-05-05T13:30:00Z") },
    { phone: "facebook:881920374658", name: "Aisha Bint Khalid", language: "en", source: "facebook", status: "callback_booked", notes: "Service: home nursing, City: Abu Dhabi, Action: book_callback", createdAt: new Date("2026-05-06T09:00:00Z") },
    { phone: "instagram:334829102", name: "Deepa Menon", language: "en", source: "instagram", status: "appointment_booked", notes: "Service: physiotherapy, City: JLT, For: self, post-op recovery", createdAt: new Date("2026-05-07T11:15:00Z") },
    { phone: "+971571234890", name: "Ahmed Al Suwaidi", language: "en", source: "direct", status: "appointment_booked", notes: "Service: home care, City: Al Ain, For: father, Mode: part-time", createdAt: new Date("2026-05-08T15:00:00Z") },
    { phone: "instagram:220938471", name: "Noura Al Mazrouei", language: "en", source: "instagram", status: "qualified", notes: "Service: palliative care, City: Dubai Hills, For: grandmother", createdAt: new Date("2026-05-09T10:30:00Z") },
    { phone: "+971581234567", name: "Vikram Iyer", language: "en", source: "direct", status: "appointment_booked", notes: "Service: post-surgery nursing, City: Silicon Oasis, For: wife", createdAt: new Date("2026-05-10T08:00:00Z") },
    { phone: "facebook:773829104857", name: "Sara Al Hammadi", language: "en", source: "facebook", status: "appointment_booked", notes: "Service: maternity care, City: Oud Metha, Action: book_callback", createdAt: new Date("2026-05-11T12:00:00Z") },
    { phone: "instagram:661829340", name: "Anjali Krishnan", language: "en", source: "instagram", status: "callback_booked", notes: "Service: home nursing, City: Discovery Gardens, For: father-in-law", createdAt: new Date("2026-05-12T14:30:00Z") },
    { phone: "+971591234678", name: "Khalid Al Blooshi", language: "en", source: "direct", status: "appointment_booked", notes: "Service: wound care, City: Karama, For: father, Mode: twice-weekly", createdAt: new Date("2026-05-13T09:30:00Z") },
    { phone: "instagram:882039471", name: "Maryam Al Ketbi", language: "en", source: "instagram", status: "appointment_booked", notes: "Service: elderly care, City: Meadows, For: mother, live-in carer", createdAt: new Date("2026-05-14T11:00:00Z") },
    { phone: "+971501239876", name: "Suresh Kumar", language: "en", source: "direct", status: "new", notes: "Service: physiotherapy, City: International City, For: self", createdAt: new Date("2026-05-15T16:45:00Z") },
    { phone: "facebook:994820374651", name: "Hessa Al Qubaisi", language: "en", source: "facebook", status: "appointment_booked", notes: "Service: home nursing, City: Jumeirah Park, Action: book_callback", createdAt: new Date("2026-05-16T10:15:00Z") },
    { phone: "instagram:553829401", name: "Meera Pillai", language: "en", source: "instagram", status: "appointment_booked", notes: "Service: post-op care, City: Sports City, For: husband", createdAt: new Date("2026-05-17T13:00:00Z") },
    { phone: "+971561237654", name: "Abdulla Al Nuaimi", language: "en", source: "direct", status: "appointment_booked", notes: "Service: elderly care, City: Al Nahda, For: parents, Mode: daily", createdAt: new Date("2026-05-18T09:00:00Z") },
  ];

  const insertedLeads = await db.insert(leadsTable).values(
    leads.map((l) => ({
      clientId: CLIENT_ID,
      phone: l.phone,
      name: l.name,
      language: l.language,
      source: l.source,
      status: l.status,
      notes: l.notes,
      createdAt: l.createdAt,
    }))
  ).returning({ id: leadsTable.id, status: leadsTable.status, createdAt: leadsTable.createdAt });

  type ApptRow = { type: string; serviceRequested: string; preferredTime: string; outcome: string; confirmedAt: Date | null };
  const bookableLeads = insertedLeads.filter((l) =>
    ["appointment_booked", "callback_booked"].includes(l.status)
  );

  const apptTemplates: ApptRow[] = [
    { type: "service_booking", serviceRequested: "Home nursing — daily visits", preferredTime: "Morning (8–10am)", outcome: "completed", confirmedAt: new Date("2026-05-02T08:00:00Z") },
    { type: "service_booking", serviceRequested: "Elderly care — live-in", preferredTime: "Flexible", outcome: "completed", confirmedAt: new Date("2026-05-03T09:00:00Z") },
    { type: "callback", serviceRequested: "Physiotherapy — post-op", preferredTime: "Afternoon (2–4pm)", outcome: "completed", confirmedAt: new Date("2026-05-03T14:00:00Z") },
    { type: "service_booking", serviceRequested: "Post-surgery care", preferredTime: "Morning", outcome: "completed", confirmedAt: new Date("2026-05-04T10:00:00Z") },
    { type: "service_booking", serviceRequested: "Pediatric care — weekly", preferredTime: "Weekend", outcome: "pending", confirmedAt: new Date("2026-05-05T11:00:00Z") },
    { type: "service_booking", serviceRequested: "Elderly care — live-in", preferredTime: "ASAP", outcome: "completed", confirmedAt: new Date("2026-05-06T09:00:00Z") },
    { type: "callback", serviceRequested: "Home nursing enquiry", preferredTime: "Morning", outcome: "completed", confirmedAt: new Date("2026-05-07T08:30:00Z") },
    { type: "service_booking", serviceRequested: "Physiotherapy — home visits", preferredTime: "Evenings (6–8pm)", outcome: "pending", confirmedAt: new Date("2026-05-08T18:00:00Z") },
    { type: "service_booking", serviceRequested: "Home care — part-time", preferredTime: "Morning", outcome: "completed", confirmedAt: new Date("2026-05-09T10:00:00Z") },
    { type: "service_booking", serviceRequested: "Post-surgery nursing", preferredTime: "Flexible", outcome: "completed", confirmedAt: new Date("2026-05-11T09:00:00Z") },
    { type: "service_booking", serviceRequested: "Maternity care — postnatal", preferredTime: "Morning", outcome: "pending", confirmedAt: new Date("2026-05-12T08:00:00Z") },
    { type: "callback", serviceRequested: "Home nursing — enquiry", preferredTime: "Afternoon", outcome: "completed", confirmedAt: new Date("2026-05-13T14:00:00Z") },
    { type: "service_booking", serviceRequested: "Wound care — twice-weekly", preferredTime: "Morning (9am)", outcome: "completed", confirmedAt: new Date("2026-05-14T09:00:00Z") },
    { type: "service_booking", serviceRequested: "Elderly care — live-in carer", preferredTime: "ASAP", outcome: "pending", confirmedAt: new Date("2026-05-15T10:00:00Z") },
    { type: "callback", serviceRequested: "Home nursing", preferredTime: "Morning", outcome: "completed", confirmedAt: new Date("2026-05-17T09:00:00Z") },
    { type: "service_booking", serviceRequested: "Post-op care — daily", preferredTime: "Flexible", outcome: "pending", confirmedAt: new Date("2026-05-18T11:00:00Z") },
    { type: "service_booking", serviceRequested: "Elderly care — daily visits", preferredTime: "Morning", outcome: "pending", confirmedAt: new Date("2026-05-19T09:30:00Z") },
  ];

  const apptValues = bookableLeads.slice(0, apptTemplates.length).map((lead, i) => ({
    clientId: CLIENT_ID,
    leadId: lead.id,
    type: apptTemplates[i]!.type,
    serviceRequested: apptTemplates[i]!.serviceRequested,
    preferredTime: apptTemplates[i]!.preferredTime,
    outcome: apptTemplates[i]!.outcome,
    confirmedAt: apptTemplates[i]!.confirmedAt,
    createdAt: lead.createdAt,
  }));

  const insertedAppts = await db.insert(appointmentsTable).values(apptValues).returning({ id: appointmentsTable.id });

  res.json({ leads: insertedLeads.length, appointments: insertedAppts.length });
});
router.post("/admin/trim-dosteli1-bookings", async (_req: Request, res: Response) => {
  const CLIENT_ID = 17;
  const TARGET = 5;
  // Find IDs of all service_booking rows ordered oldest first
  const rows = await db
    .select({ id: appointmentsTable.id })
    .from(appointmentsTable)
    .where(and(eq(appointmentsTable.clientId, CLIENT_ID), eq(appointmentsTable.type, "service_booking")))
    .orderBy(appointmentsTable.createdAt);
  const toDelete = rows.slice(0, Math.max(0, rows.length - TARGET));
  if (toDelete.length === 0) {
    res.json({ deleted: 0, remaining: rows.length });
    return;
  }
  const ids = toDelete.map((r) => r.id);
  await db.delete(appointmentsTable).where(inArray(appointmentsTable.id, ids));
  res.json({ deleted: ids.length, remaining: TARGET });
});

router.post("/admin/restore-dosteli1-branding", async (_req: Request, res: Response) => {
  // Restores dosteli1 config after accidental PATCH wipe, clears demoPassword
  const restoredConfig = {
    city: "",
    slug: "dosteli1",
    phone: "",
    logoUrl: "https://cdn.prod.website-files.com/61ea6c649fd65481a48a4584/61eacf37e31ddb4c60e24879_logo_dark.svg",
    tagline: "Holistic support for those in need.",
    industry: "care",
    websiteUrl: "https://dosteli.de",
    companyName: "Dosteli",
    demoLanguage: "de",
    demoPassword: "",
    heroHeadline: "Culturally Sensitive Care Solutions",
    heroImageUrl: "https://cdn.prod.website-files.com/61ea6c649fd65481a48a4584/63becf6c54f0813fb92ef78f_%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA%20%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0%202023-01-11%20220132.png",
    primaryColor: "#4A7C59",
    demoLanguages: ["de", "tr"],
    secondaryColor: "#2E86AB",
  };
  const [updated] = await db
    .update(clientsTable)
    .set({ config: restoredConfig, languagePrimary: "de", languageSecondary: "tr" })
    .where(eq(clientsTable.id, 17))
    .returning({ id: clientsTable.id, slug: clientsTable.slug, languagePrimary: clientsTable.languagePrimary, languageSecondary: clientsTable.languageSecondary });
  res.json(updated ?? { error: "Client not found" });
});

router.post("/admin/fix-dosteli1-languages", async (_req: Request, res: Response) => {
  const [updated] = await db
    .update(clientsTable)
    .set({ languagePrimary: "de", languageSecondary: "tr" })
    .where(eq(clientsTable.slug, "dosteli1"))
    .returning({ id: clientsTable.id, languagePrimary: clientsTable.languagePrimary, languageSecondary: clientsTable.languageSecondary });
  res.json(updated ?? { error: "Client not found" });
});

router.post("/admin/seed-dosteli1-demo", async (_req: Request, res: Response) => {
  const CLIENT_ID = 17;

  type LeadRow = { phone: string; name: string; language: string; source: string; status: string; notes: string; createdAt: Date };
  const leads: LeadRow[] = [
    { phone: "+4917612345001", name: "Mehmet Yılmaz", language: "tr", source: "whatsapp_ad", status: "appointment_booked", notes: "Hizmet: Demans WG, Şehir: Köln, Kişi: annesi için", createdAt: new Date("2026-04-28T08:30:00Z") },
    { phone: "+4917612345002", name: "Fatma Kaya", language: "tr", source: "instagram_ad", status: "callback_booked", notes: "Hizmet: Evde bakım, Şehir: Berlin, Kişi: babası", createdAt: new Date("2026-04-29T10:00:00Z") },
    { phone: "+4917612345003", name: "Ingrid Müller", language: "de", source: "whatsapp_ad", status: "appointment_booked", notes: "Dienst: Ambulante Pflege, Stadt: Frankfurt, Person: Mutter", createdAt: new Date("2026-04-30T09:15:00Z") },
    { phone: "+4917612345004", name: "Hüseyin Demir", language: "tr", source: "direct", status: "callback_booked", notes: "Hizmet: 24 saat bakım, Şehir: Stuttgart, Kişi: eşi", createdAt: new Date("2026-05-01T11:30:00Z") },
    { phone: "+4917612345005", name: "Klaus Schneider", language: "de", source: "whatsapp_ad", status: "appointment_booked", notes: "Dienst: Demenz-WG, Stadt: München, Person: Vater mit Demenz", createdAt: new Date("2026-05-02T08:45:00Z") },
    { phone: "+4917612345006", name: "Ayşe Çelik", language: "tr", source: "instagram_ad", status: "appointment_booked", notes: "Hizmet: Ambulant bakım, Şehir: Hamburg, Kişi: kayınvalidesi", createdAt: new Date("2026-05-03T13:00:00Z") },
    { phone: "+4917612345007", name: "Thomas Becker", language: "de", source: "direct", status: "callback_booked", notes: "Dienst: 24h-Betreuung, Stadt: Düsseldorf, Person: Mutter, Pflegegrad 4", createdAt: new Date("2026-05-04T10:30:00Z") },
    { phone: "+4917612345008", name: "Emine Arslan", language: "tr", source: "whatsapp_ad", status: "appointment_booked", notes: "Hizmet: Demans WG, Şehir: Köln, Kişi: annesi, Yer var mı?", createdAt: new Date("2026-05-05T09:00:00Z") },
    { phone: "+4917612345009", name: "Hans-Peter Wagner", language: "de", source: "whatsapp_ad", status: "qualified", notes: "Dienst: Ambulante Pflege, Stadt: Bonn, Person: Ehefrau nach OP", createdAt: new Date("2026-05-06T14:00:00Z") },
    { phone: "+4917612345010", name: "Zeynep Öztürk", language: "tr", source: "instagram_ad", status: "callback_booked", notes: "Hizmet: Evde bakım, Şehir: Frankfurt, Kişi: babası, Sabah uygun", createdAt: new Date("2026-05-07T08:00:00Z") },
    { phone: "+4917612345011", name: "Ursula Hoffmann", language: "de", source: "direct", status: "appointment_booked", notes: "Dienst: Demenz-WG, Stadt: Köln, Person: Bruder mit Alzheimer", createdAt: new Date("2026-05-08T11:00:00Z") },
    { phone: "+4917612345012", name: "Ali Şahin", language: "tr", source: "whatsapp_ad", status: "qualified", notes: "Hizmet: 24 saat bakım, Şehir: Berlin, Kişi: annesi Pflegegrad 3", createdAt: new Date("2026-05-09T15:30:00Z") },
    { phone: "+4917612345013", name: "Brigitte Fischer", language: "de", source: "instagram_ad", status: "new", notes: "Dienst: Ambulante Pflege, Stadt: Hamburg, Person: Mutter", createdAt: new Date("2026-05-10T09:45:00Z") },
    { phone: "+4917612345014", name: "Mustafa Polat", language: "tr", source: "whatsapp_ad", status: "appointment_booked", notes: "Hizmet: Demans WG, Şehir: Stuttgart, Kişi: babası demans teşhisi var", createdAt: new Date("2026-05-11T10:15:00Z") },
    { phone: "+4917612345015", name: "Gisela Koch", language: "de", source: "direct", status: "callback_booked", notes: "Dienst: 24h-Pflege, Stadt: München, Person: Mann, Pflegegrad 5", createdAt: new Date("2026-05-12T13:00:00Z") },
    { phone: "+4917612345016", name: "Hatice Yıldız", language: "tr", source: "instagram_ad", status: "new", notes: "Hizmet: Ambulant bakım, Şehir: Düsseldorf, Kişi: annesi", createdAt: new Date("2026-05-13T10:00:00Z") },
    { phone: "+4917612345017", name: "Werner Richter", language: "de", source: "whatsapp_ad", status: "appointment_booked", notes: "Dienst: Ambulante Pflege, Stadt: Frankfurt, Person: Mutter nach Schlaganfall", createdAt: new Date("2026-05-14T08:30:00Z") },
    { phone: "+4917612345018", name: "Elif Kılıç", language: "tr", source: "direct", status: "qualified", notes: "Hizmet: 24 saat bakım, Şehir: Köln, Kişi: kayınbabası", createdAt: new Date("2026-05-15T11:45:00Z") },
    { phone: "+4917612345019", name: "Helga Braun", language: "de", source: "instagram_ad", status: "new", notes: "Dienst: Demenz-WG, Stadt: Berlin, Person: Vater, Warteliste möglich?", createdAt: new Date("2026-05-16T09:00:00Z") },
    { phone: "+4917612345020", name: "İbrahim Güneş", language: "tr", source: "whatsapp_ad", status: "callback_booked", notes: "Hizmet: Evde bakım, Şehir: Hamburg, Kişi: annesi Pflegegrad 2", createdAt: new Date("2026-05-17T10:30:00Z") },
    { phone: "+4917612345021", name: "Renate Weber", language: "de", source: "direct", status: "appointment_booked", notes: "Dienst: Ambulante Pflege, Stadt: Köln, Person: Schwiegermutter", createdAt: new Date("2026-05-19T08:00:00Z") },
    { phone: "+4917612345022", name: "Selma Doğan", language: "tr", source: "instagram_ad", status: "new", notes: "Hizmet: Demans WG, Şehir: Frankfurt, Kişi: annesi, Fiyat bilgisi istedi", createdAt: new Date("2026-05-21T12:00:00Z") },
  ];

  const insertedLeads = await db.insert(leadsTable).values(
    leads.map((l) => ({
      clientId: CLIENT_ID,
      phone: l.phone,
      name: l.name,
      language: l.language,
      source: l.source,
      status: l.status,
      notes: l.notes,
      createdAt: l.createdAt,
    }))
  ).returning({ id: leadsTable.id, status: leadsTable.status, createdAt: leadsTable.createdAt });

  type ApptRow = { type: string; serviceRequested: string; preferredTime: string; outcome: string; confirmedAt: Date | null };
  const apptTemplates: ApptRow[] = [
    { type: "callback",         serviceRequested: "Demenz-WG — Anfrage Platz",              preferredTime: "Vormittags (9–11 Uhr)",     outcome: "completed", confirmedAt: new Date("2026-04-28T09:00:00Z") },
    { type: "callback",         serviceRequested: "Evde bakım — genel bilgi",                preferredTime: "Sabah (9–11)",              outcome: "completed", confirmedAt: new Date("2026-04-29T09:30:00Z") },
    { type: "service_booking",  serviceRequested: "Ambulante Pflege — täglich",              preferredTime: "Flexibel",                  outcome: "completed", confirmedAt: new Date("2026-04-30T10:00:00Z") },
    { type: "callback",         serviceRequested: "24 saat bakım — başlangıç bilgisi",       preferredTime: "Öğleden sonra (14–16)",     outcome: "completed", confirmedAt: new Date("2026-05-01T14:00:00Z") },
    { type: "service_booking",  serviceRequested: "Demenz-WG — Aufnahme Pflegegrad 4",       preferredTime: "So bald wie möglich",       outcome: "completed", confirmedAt: new Date("2026-05-02T09:00:00Z") },
    { type: "service_booking",  serviceRequested: "Ambulant bakım — haftada 3 gün",          preferredTime: "Esnek",                     outcome: "completed", confirmedAt: new Date("2026-05-03T11:00:00Z") },
    { type: "callback",         serviceRequested: "24h-Betreuung — Kostenübersicht",         preferredTime: "Vormittags",                outcome: "completed", confirmedAt: new Date("2026-05-04T10:00:00Z") },
    { type: "service_booking",  serviceRequested: "Demenz-WG — Aufnahme Mutter",             preferredTime: "So bald wie möglich",       outcome: "pending",   confirmedAt: new Date("2026-05-05T09:30:00Z") },
    { type: "callback",         serviceRequested: "Evde bakım — fiyat ve koşullar",          preferredTime: "Sabah",                     outcome: "completed", confirmedAt: new Date("2026-05-07T08:30:00Z") },
    { type: "service_booking",  serviceRequested: "Demenz-WG — Bruder mit Alzheimer",        preferredTime: "Nachmittags (14–16 Uhr)",   outcome: "completed", confirmedAt: new Date("2026-05-08T14:00:00Z") },
    { type: "service_booking",  serviceRequested: "Demenz WG — baba için yer",               preferredTime: "Mümkün olan en kısa süre", outcome: "pending",   confirmedAt: new Date("2026-05-11T10:00:00Z") },
    { type: "callback",         serviceRequested: "24h-Pflege — Pflegegrad 5 Erstberatung",  preferredTime: "Nachmittags",               outcome: "completed", confirmedAt: new Date("2026-05-12T14:00:00Z") },
    { type: "service_booking",  serviceRequested: "Ambulante Pflege — Mutter nach Schlaganfall", preferredTime: "Flexibel",             outcome: "pending",   confirmedAt: new Date("2026-05-14T09:00:00Z") },
    { type: "callback",         serviceRequested: "Evde bakım — Pflegegrad 2 bilgisi",       preferredTime: "Öğleden sonra",            outcome: "pending",   confirmedAt: new Date("2026-05-17T11:00:00Z") },
    { type: "service_booking",  serviceRequested: "Ambulante Pflege — Schwiegermutter",       preferredTime: "Vormittags (8–10 Uhr)",    outcome: "pending",   confirmedAt: new Date("2026-05-19T09:00:00Z") },
  ];

  const bookableLeads = insertedLeads.filter((l) =>
    ["appointment_booked", "callback_booked"].includes(l.status)
  );

  const apptValues = bookableLeads.slice(0, apptTemplates.length).map((lead, i) => ({
    clientId: CLIENT_ID,
    leadId: lead.id,
    type: apptTemplates[i]!.type,
    serviceRequested: apptTemplates[i]!.serviceRequested,
    preferredTime: apptTemplates[i]!.preferredTime,
    outcome: apptTemplates[i]!.outcome,
    confirmedAt: apptTemplates[i]!.confirmedAt,
    createdAt: lead.createdAt,
  }));

  const insertedAppts = await db.insert(appointmentsTable).values(apptValues).returning({ id: appointmentsTable.id });

  res.json({ leads: insertedLeads.length, appointments: insertedAppts.length });
});
// ─────────────────────────────────────────────────────────────────────────────

function toClientResponse(client: typeof clientsTable.$inferSelect) {
  return {
    id: client.id,
    name: client.name,
    slug: client.slug,
    isActive: client.isActive,
    createdAt: client.createdAt.toISOString(),
    twilioSender: client.twilioSender ?? "",
    demoToken: client.demoToken ?? null,
    branding: buildBranding(client),
  };
}

export default router;
