import { Router, type IRouter, type Request, type Response } from "express";
import { ExtractBrandingBody } from "@workspace/api-zod";

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

    const findLogoUrl = (): string | null => {
      const logoPatterns = [
        /<img[^>]+(?:class|id|alt)=["'][^"']*logo[^"']*["'][^>]+src=["']([^"']+)["']/i,
        /<img[^>]+src=["']([^"']+)["'][^>]+(?:class|id|alt)=["'][^"']*logo[^"']*["']/i,
        /<img[^>]+src=["']([^"'\/][^"']*logo[^"']*\.[a-z]{2,5})["']/i,
      ];
      for (const pat of logoPatterns) {
        const m = html.match(pat);
        if (m?.[1] && !m[1].includes("data:")) return resolve(m[1]);
      }
      const appleIcon =
        html.match(/<link[^>]+rel=["'][^"']*apple-touch-icon[^"']*["'][^>]+href=["']([^"']+)["']/i)?.[1] ??
        html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["'][^"']*apple-touch-icon[^"']*["']/i)?.[1];
      if (appleIcon) return resolve(appleIcon);
      if (rawFavicon) return resolve(rawFavicon);
      return ogImage ? resolve(ogImage) : null;
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

export default router;
