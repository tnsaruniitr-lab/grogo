import { Router, type IRouter, type Request, type Response } from "express";
import { ExtractBrandingBody } from "@workspace/api-zod";
import { isPrivateHost } from "../lib/ssrf-guard";

const router: IRouter = Router();

router.post("/admin/extract-branding", async (req: Request, res: Response) => {
  const parsed = ExtractBrandingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "url is required" });
    return;
  }

  const { url } = parsed.data;

  let baseUrl: URL;
  try { baseUrl = new URL(url); } catch { res.status(400).json({ error: "Invalid URL" }); return; }
  if (!["http:", "https:"].includes(baseUrl.protocol)) { res.status(400).json({ error: "Only http/https URLs allowed" }); return; }
  if (isPrivateHost(baseUrl.hostname)) { res.status(400).json({ error: "Private/internal URLs are not allowed" }); return; }

  // (baseUrl already parsed above — reuse below)
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

    const findLogoUrl = (): string => {
      // 1. apple-touch-icon — high-res, brand-approved (180×180+)
      const appleIcon =
        html.match(/<link[^>]+rel=["'][^"']*apple-touch-icon[^"']*["'][^>]+href=["']([^"']+)["']/i)?.[1] ??
        html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["'][^"']*apple-touch-icon[^"']*["']/i)?.[1];
      if (appleIcon) return resolve(appleIcon) ?? `https://logo.clearbit.com/${hostname}`;

      // 2. SVG icon — vector, scales perfectly
      const svgIcon =
        html.match(/<link[^>]+type=["']image\/svg\+xml["'][^>]+href=["']([^"']+)["']/i)?.[1] ??
        html.match(/<link[^>]+href=["']([^"']+\.svg)["'][^>]+rel=["'][^"']*icon[^"']*["']/i)?.[1];
      if (svgIcon) return resolve(svgIcon) ?? `https://logo.clearbit.com/${hostname}`;

      // 3. Large PNG favicon (≥32px)
      const pngIcon =
        html.match(/<link[^>]+sizes=["'](?:192|180|128|96|64|48|32)[^"']*["'][^>]+href=["']([^"']+)["']/i)?.[1] ??
        html.match(/<link[^>]+href=["']([^"']+)["'][^>]+sizes=["'](?:192|180|128|96|64|48|32)[^"']*["']/i)?.[1];
      if (pngIcon) return resolve(pngIcon) ?? `https://logo.clearbit.com/${hostname}`;

      // 4. Clearbit — reliable fallback by domain (never use og:image as logo; it's a social/hero image)
      return `https://logo.clearbit.com/${hostname}`;
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
