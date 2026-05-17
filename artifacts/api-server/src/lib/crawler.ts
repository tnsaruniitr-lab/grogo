import { logger } from "./logger";

const USER_AGENT = "Mozilla/5.0 (compatible; DosteliBrandBot/1.0)";
const FETCH_TIMEOUT_MS = 10_000;
const MAX_RETRIES = 3;
const RETRY_DELAYS_MS = [0, 2_000, 8_000];

const SKIP_EXTENSIONS = /\.(pdf|jpg|jpeg|png|gif|webp|svg|ico|mp4|mp3|zip|doc|docx|xls|xlsx|css|js|woff|woff2|ttf)(\?|$)/i;
const SKIP_PATH_PATTERNS = /\/(login|logout|signup|register|cart|checkout|search|print|feed|sitemap|wp-admin|wp-login)/i;
const SKIP_QUERY_PATTERNS = /[?&](q|s|search|query|page)=/i;

export interface PageResult {
  url: string;
  title: string | null;
  text: string;
  links: string[];
  status: "ok" | "failed" | "skipped";
  error?: string;
}

export async function fetchSitemapUrls(origin: string): Promise<string[]> {
  const candidates = [
    `${origin}/sitemap.xml`,
    `${origin}/sitemap_index.xml`,
    `${origin}/sitemap-index.xml`,
    `${origin}/sitemap/sitemap.xml`,
  ];

  const collected = new Set<string>();

  const parseSitemapXml = async (url: string, depth = 0): Promise<void> => {
    if (depth > 2) return;
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": USER_AGENT },
        signal: AbortSignal.timeout(8_000),
        redirect: "follow",
      });
      if (!res.ok) return;
      const xml = await res.text();

      // Sitemap index — recurse into child sitemaps
      const sitemapLocPattern = /<sitemap>[\s\S]*?<loc>(https?:\/\/[^<]{1,500})<\/loc>/gi;
      let m: RegExpExecArray | null;
      while ((m = sitemapLocPattern.exec(xml)) !== null) {
        await parseSitemapXml(m[1]!.trim(), depth + 1);
      }

      // Regular sitemap — collect <url><loc>...</loc> entries
      const urlLocPattern = /<url>[\s\S]*?<loc>(https?:\/\/[^<]{1,500})<\/loc>/gi;
      while ((m = urlLocPattern.exec(xml)) !== null) {
        const loc = m[1]!.trim();
        try {
          const { origin: locOrigin, pathname, href } = new URL(loc);
          if (locOrigin !== origin) continue;
          if (SKIP_EXTENSIONS.test(pathname)) continue;
          if (SKIP_PATH_PATTERNS.test(pathname)) continue;
          if (SKIP_QUERY_PATTERNS.test(href)) continue;
          collected.add(`${locOrigin}${pathname}`.replace(/\/$/, "") || origin);
        } catch {
          // unparseable URL — skip
        }
      }
    } catch {
      // sitemap not available — silently skip
    }
  };

  for (const candidate of candidates) {
    await parseSitemapXml(candidate);
    if (collected.size > 0) break; // found a working sitemap — stop trying
  }

  return Array.from(collected);
}

export async function fetchRobotsTxt(origin: string): Promise<string[]> {
  try {
    const res = await fetch(`${origin}/robots.txt`, {
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(5_000),
    });
    if (!res.ok) return [];
    const text = await res.text();
    const disallowed: string[] = [];
    let inRelevantBlock = false;
    for (const raw of text.split("\n")) {
      const line = raw.trim();
      if (line.toLowerCase().startsWith("user-agent:")) {
        const agent = line.split(":")[1]?.trim() ?? "";
        inRelevantBlock = agent === "*" || agent.toLowerCase().includes("dosteli");
      } else if (inRelevantBlock && line.toLowerCase().startsWith("disallow:")) {
        const path = line.split(":")[1]?.trim() ?? "";
        if (path && path !== "/") disallowed.push(path);
      }
    }
    return disallowed;
  } catch {
    return [];
  }
}

export function isAllowed(url: string, disallowedPaths: string[]): boolean {
  try {
    const { pathname } = new URL(url);
    return !disallowedPaths.some((d) => pathname.startsWith(d));
  } catch {
    return false;
  }
}

export function extractLinks(html: string, origin: string, baseUrl: string): string[] {
  const links = new Set<string>();
  const hrefPattern = /href=["']([^"'#?][^"']*)["']/gi;
  let match: RegExpExecArray | null;

  while ((match = hrefPattern.exec(html)) !== null) {
    const raw = match[1]!.trim();
    try {
      const resolved = new URL(raw, baseUrl).href;
      const { origin: resOrigin, pathname, href } = new URL(resolved);
      if (resOrigin !== origin) continue;
      if (SKIP_EXTENSIONS.test(pathname)) continue;
      if (SKIP_PATH_PATTERNS.test(pathname)) continue;
      if (SKIP_QUERY_PATTERNS.test(href)) continue;
      const normalised = `${resOrigin}${pathname}`.replace(/\/$/, "") || origin;
      links.add(normalised);
    } catch {
      // ignore unparseable hrefs
    }
  }

  return Array.from(links);
}

export function cleanHtml(html: string): { title: string | null; text: string } {
  let title: string | null = null;
  const titleMatch = html.match(/<title[^>]*>([^<]{1,200})<\/title>/i);
  if (titleMatch?.[1]) title = titleMatch[1].trim();

  let cleaned = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, " ")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<(nav|header|footer|aside|cookie|banner)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?(h[1-6]|p|li|td|th|div|section|article|main|blockquote)[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&[a-z]+;/gi, " ");

  const text = cleaned
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter((l) => l.length > 15)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 15_000);

  return { title, text };
}

export async function fetchPage(url: string): Promise<PageResult> {
  let lastError = "";

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    if (RETRY_DELAYS_MS[attempt]! > 0) {
      await new Promise((r) => setTimeout(r, RETRY_DELAYS_MS[attempt]));
    }

    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "text/html,application/xhtml+xml",
          "Accept-Language": "de,tr,en;q=0.8",
        },
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        redirect: "follow",
      });

      if (res.status === 404 || res.status === 410) {
        return { url, title: null, text: "", links: [], status: "failed", error: `http_${res.status}` };
      }
      if (res.status === 403) {
        return { url, title: null, text: "", links: [], status: "failed", error: "bot_blocked_403" };
      }
      if (res.status === 429) {
        lastError = "rate_limited_429";
        continue;
      }
      if (!res.ok) {
        lastError = `http_${res.status}`;
        continue;
      }

      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.includes("html")) {
        return { url, title: null, text: "", links: [], status: "skipped", error: "not_html" };
      }

      const html = await res.text();

      if (html.length < 200) {
        return { url, title: null, text: "", links: [], status: "failed", error: "js_rendered_or_empty" };
      }

      const cfMarkers = ["cf-browser-verification", "cf-please-wait", "challenge-platform"];
      if (cfMarkers.some((m) => html.includes(m))) {
        return { url, title: null, text: "", links: [], status: "failed", error: "cloudflare_challenge" };
      }

      const origin = new URL(url).origin;
      const { title, text } = cleanHtml(html);
      const links = extractLinks(html, origin, url);

      if (text.length < 100) {
        return { url, title, text: "", links, status: "failed", error: "js_rendered_or_empty" };
      }

      return { url, title, text, links, status: "ok" };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("timeout") || msg.includes("abort")) {
        lastError = "timeout";
      } else {
        lastError = `network_error: ${msg.slice(0, 80)}`;
      }
      logger.warn({ url, attempt, error: lastError }, "Page fetch attempt failed");
    }
  }

  return { url, title: null, text: "", links: [], status: "failed", error: lastError };
}

export async function withConcurrency<T>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<void>,
): Promise<void> {
  const queue = [...items];
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (queue.length > 0) {
      const item = queue.shift()!;
      await fn(item);
    }
  });
  await Promise.all(workers);
}
