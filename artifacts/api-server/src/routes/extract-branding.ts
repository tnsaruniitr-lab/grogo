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

  const baseUrl = new URL(url);
  const hostname = baseUrl.hostname.replace(/^www\./, "");

  const slugFromHost = hostname
    .replace(/\.[a-z]{2,}$/, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .toLowerCase();

  const nameFromHost = hostname
    .replace(/\.[a-z]{2,}$/, "")
    .replace(/[-_.]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  /** Return a minimal best-effort response when fetch is unavailable */
  const fallbackResponse = () =>
    res.json({
      companyName: nameFromHost,
      slug: slugFromHost,
      tagline: null,
      heroHeadline: null,
      primaryColor: null,
      secondaryColor: null,
      logoUrl: `https://logo.clearbit.com/${hostname}`,
      city: null,
      phone: null,
      websiteUrl: url,
    });

  let html = "";
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; DosteliBrandBot/1.0)" },
      signal: AbortSignal.timeout(12000),
    });

    if (!response.ok) {
      req.log.warn({ status: response.status, url }, "extract-branding: non-OK response, using fallback");
      fallbackResponse();
      return;
    }

    html = await response.text();
  } catch (fetchErr) {
    req.log.warn({ err: fetchErr, url }, "extract-branding: fetch failed, using fallback");
    fallbackResponse();
    return;
  }

  try {

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

    const resolve = (u: string | null): string | null => {
      if (!u) return null;
      try { return new URL(u, baseUrl.origin).href; } catch { return u; }
    };

    const ogImage = meta("property", "og:image");
    const themeColor = meta("name", "theme-color");
    const ogTitle = meta("property", "og:title");
    const ogDescription = meta("property", "og:description");

    let companyName = ogTitle || titleTag || nameFromHost;
    companyName = companyName.split(/\s*[\|–—-]\s*/)[0].trim();

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
      slug: slugFromHost,
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
    fallbackResponse();
  }
});

export default router;
