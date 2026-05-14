import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { clientsTable } from "@workspace/db";
import { eq, isNull, ne, and } from "drizzle-orm";
import {
  ExtractBrandingBody,
  CreateDemoClientBody,
  UpdateDemoClientBody,
  UpdateDemoClientParams,
  DeleteDemoClientParams,
  GetClientBrandingParams,
} from "@workspace/api-zod";

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

    res.json({
      companyName,
      slug,
      tagline: ogDescription ?? null,
      heroHeadline: null,
      primaryColor: themeColor ?? null,
      secondaryColor: null,
      logoUrl: ogImage ? resolve(ogImage) : resolve(rawFavicon),
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
    .where(and(isNull(clientsTable.deletedAt), ne(clientsTable.id, 1)))
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

  const [created] = await db
    .insert(clientsTable)
    .values({
      name,
      slug,
      whatsappNumber: "",
      twilioSender: "",
      config: branding ?? null,
    })
    .returning();

  res.status(201).json(toClientResponse(created));
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

  await db
    .update(clientsTable)
    .set({ deletedAt: new Date() })
    .where(eq(clientsTable.id, params.data.id));

  res.status(204).end();
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
  };
}

function toClientResponse(client: typeof clientsTable.$inferSelect) {
  return {
    id: client.id,
    name: client.name,
    slug: client.slug,
    isActive: client.isActive,
    createdAt: client.createdAt.toISOString(),
    branding: buildBranding(client),
  };
}

export default router;
