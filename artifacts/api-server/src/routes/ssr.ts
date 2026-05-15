import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { clientsTable, companyKnowledgeTable } from "@workspace/db";
import { eq, and, inArray, asc, isNull } from "drizzle-orm";
import { existsSync, readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "../lib/logger";

// Derive workspace root from this bundle's own location.
// The compiled bundle is always at  artifacts/api-server/dist/index.mjs
// → three path.resolve('..') calls reach /home/runner/workspace
// This is stable regardless of process.cwd() (which differs between dev and prod).
const _bundleDir = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(_bundleDir, "../../..");

const router = Router();

// ── Escape helpers ────────────────────────────────────────────────────────────
// esc(): full HTML attribute escaping
const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
// tx(): text-node escaping (no quote escaping needed)
const tx = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

// ── Template reader ───────────────────────────────────────────────────────────
// Tries built output first (dist/public/index.html — Vite's configured outDir),
// then the raw source index.html for dev.
function getIndexHtml(): string {
  const candidates = [
    path.join(WORKSPACE_ROOT, "artifacts/demo-frontend/dist/public/index.html"),
    path.join(WORKSPACE_ROOT, "artifacts/demo-frontend/dist/index.html"),
    path.join(WORKSPACE_ROOT, "artifacts/demo-frontend/index.html"),
  ];
  for (const p of candidates) {
    if (existsSync(p)) return readFileSync(p, "utf-8");
  }
  throw new Error(
    `demo-frontend index.html not found (searched: ${candidates.join(", ")})`,
  );
}

// ── Mirrors admin.ts buildBranding() exactly ──────────────────────────────────
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

// ── Industry FAQ fallbacks ────────────────────────────────────────────────────
type FaqRow = { question: string; answer: string };
const FAQ_FALLBACKS: Record<string, FaqRow[]> = {
  care: [
    { question: "Welche Pflegeleistungen bieten Sie an?", answer: "Wir bieten ambulante Pflege, Betreuung zuhause, Demenzbegleitung und 24h-Pflege an." },
    { question: "Wie schnell können Sie Pflege organisieren?", answer: "In dringenden Fällen oft noch am selben Tag. Schreiben Sie uns auf WhatsApp." },
    { question: "Sprechen Ihre Pflegekräfte Türkisch?", answer: "Ja, wir haben muttersprachliche türkischsprachige Pflegekräfte." },
    { question: "Übernimmt die Pflegekasse die Kosten?", answer: "Viele unserer Leistungen werden von der Pflegekasse übernommen. Wir beraten Sie kostenlos." },
    { question: "Wie funktioniert die Anmeldung?", answer: "Einfach auf WhatsApp schreiben — unser KI-Assistent führt Sie durch den gesamten Prozess." },
  ],
  aesthetics: [
    { question: "Wie buche ich einen Termin?", answer: "Schreiben Sie uns auf WhatsApp — unser KI-Assistent antwortet sofort, rund um die Uhr." },
    { question: "Welche Behandlungen bieten Sie an?", answer: "Wir bieten ästhetische Behandlungen wie Botox, Filler, Laserbehandlungen und Hautpflege an." },
    { question: "Ist eine Erstberatung kostenlos?", answer: "Ja, wir bieten kostenlose Erstberatungen an. Unser WhatsApp-Bot bucht direkt einen Termin." },
    { question: "Wie lange dauert eine Behandlung?", answer: "Die Behandlungsdauer variiert je nach Eingriff zwischen 30 Minuten und 2 Stunden." },
    { question: "Sind Ihre Behandlungen sicher?", answer: "Alle Behandlungen werden von zertifizierten Fachärzten mit zugelassenen Produkten durchgeführt." },
  ],
  medical: [
    { question: "Wie schnell erhalte ich einen Termin?", answer: "Dringende Fälle werden bevorzugt behandelt. Schreiben Sie uns auf WhatsApp — wir antworten sofort." },
    { question: "Welche Sprachen sprechen Sie?", answer: "Unser Team kommuniziert auf Deutsch, Englisch und Türkisch." },
    { question: "Ist meine Anfrage vertraulich?", answer: "Ja, alle Anfragen werden streng vertraulich und DSGVO-konform behandelt." },
    { question: "Sind Hausbesuche möglich?", answer: "In bestimmten Fällen bieten wir Hausbesuche an. Kontaktieren Sie uns für mehr Informationen." },
    { question: "Kann ich eine Überweisung über WhatsApp anfordern?", answer: "Ja, unser KI-Assistent koordiniert Überweisungen und bucht direkt Folgetermine." },
  ],
  dental: [
    { question: "Bieten Sie ästhetische Zahnbehandlungen an?", answer: "Ja — Zahnaufhellung, Veneers, unsichtbare Zahnspangen und weitere kosmetische Behandlungen." },
    { question: "Wie buche ich einen Zahnarzttermin?", answer: "Schreiben Sie uns auf WhatsApp — unser Assistent bucht sofort einen passenden Termin." },
    { question: "Akzeptieren Sie Krankenkassen?", answer: "Wir arbeiten mit den meisten gesetzlichen und privaten Krankenkassen zusammen." },
    { question: "Behandeln Sie Angstpatienten?", answer: "Ja, wir haben Erfahrung mit Angstpatienten und bieten ein ruhiges, einfühlsames Umfeld." },
    { question: "Wie lange dauert eine Zahnaufhellung?", answer: "Eine professionelle Zahnaufhellung dauert in der Regel 60–90 Minuten." },
  ],
  wellness: [
    { question: "Welche Wellnessprogramme bieten Sie an?", answer: "Wir bieten Yoga, Meditation, Massage, Ernährungsberatung und individuelle Wellnesspakete an." },
    { question: "Wie buche ich einen Kurs?", answer: "Schreiben Sie uns auf WhatsApp — unser Assistent zeigt freie Plätze und bucht direkt." },
    { question: "Sind Ihre Kurse für Anfänger geeignet?", answer: "Ja, wir haben Kurse für alle Niveaus — von Einsteigern bis zu Fortgeschrittenen." },
    { question: "Bieten Sie Einzelsitzungen oder Pakete an?", answer: "Wir bieten beides — Einzelsitzungen sowie vergünstigte Monatspakete und Jahresabos." },
    { question: "Kann ich mit einem Trainer sprechen, bevor ich buche?", answer: "Natürlich — unser WhatsApp-Bot verbindet Sie sofort mit einem unserer Berater." },
  ],
};
const IND_ALIAS: Record<string, string> = {
  hair_clinic: "aesthetics", iv_therapy: "aesthetics", cosmetic_surgery: "aesthetics",
  physiotherapy: "medical", laser_eye: "medical", fertility: "care",
  weight_management: "medical", healthcare: "medical", hair: "aesthetics",
  "cosmetic-surgery": "aesthetics", "laser-eye": "medical", "weight-management": "medical",
  "iv-therapy": "aesthetics",
};

// ── robots.txt ────────────────────────────────────────────────────────────────
router.get("/robots.txt", (req: Request, res: Response) => {
  const proto = String(req.headers["x-forwarded-proto"] ?? "https");
  const host = String(req.headers["x-forwarded-host"] ?? req.headers["host"] ?? "");
  const origin = `${proto}://${host}`;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end(
    [
      "User-agent: *",
      "Allow: /",
      "Disallow: /api/",
      "",
      "User-agent: GPTBot",
      "Allow: /",
      "Disallow: /api/",
      "",
      "User-agent: PerplexityBot",
      "Allow: /",
      "Disallow: /api/",
      "",
      "User-agent: ClaudeBot",
      "Allow: /",
      "Disallow: /api/",
      "",
      "User-agent: Googlebot",
      "Allow: /",
      "Disallow: /api/",
      "",
      "User-agent: Bingbot",
      "Allow: /",
      "Disallow: /api/",
      "",
      `Sitemap: ${origin}/sitemap.xml`,
    ].join("\n") + "\n",
  );
});

// ── sitemap.xml ───────────────────────────────────────────────────────────────
router.get("/sitemap.xml", async (req: Request, res: Response) => {
  const proto = String(req.headers["x-forwarded-proto"] ?? "https");
  const host = String(req.headers["x-forwarded-host"] ?? req.headers["host"] ?? "");
  const origin = `${proto}://${host}`;
  const today = new Date().toISOString().split("T")[0]!;

  try {
    const clients = await db
      .select({ slug: clientsTable.slug, name: clientsTable.name, config: clientsTable.config })
      .from(clientsTable)
      .where(and(eq(clientsTable.isActive, true), isNull(clientsTable.deletedAt)))
      .orderBy(asc(clientsTable.id));

    const parts = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
      '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
      `  <url><loc>${origin}/</loc><changefreq>weekly</changefreq><priority>0.5</priority></url>`,
      ...clients.map((c) => {
        const cfg = (c.config ?? {}) as Record<string, unknown>;
        const logoUrl = String(cfg.logoUrl ?? "");
        const companyName = String(cfg.companyName ?? c.name);
        return [
          "  <url>",
          `    <loc>${origin}/demo/${c.slug}</loc>`,
          `    <lastmod>${today}</lastmod>`,
          "    <changefreq>daily</changefreq>",
          "    <priority>0.9</priority>",
          ...(logoUrl.startsWith("http")
            ? [
                "    <image:image>",
                `      <image:loc>${esc(logoUrl)}</image:loc>`,
                `      <image:caption>${esc(companyName)}</image:caption>`,
                "    </image:image>",
              ]
            : []),
          "  </url>",
        ].join("\n");
      }),
      "</urlset>",
    ];
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.end(parts.join("\n"));
  } catch (err) {
    logger.error({ err }, "sitemap.xml generation failed");
    res.status(500).end("<?xml version=\"1.0\"?><urlset/>");
  }
});

// ── /demo/:slug ───────────────────────────────────────────────────────────────
router.get("/demo/:slug", async (req: Request, res: Response) => {
  const slug = req.params.slug as string;

  if (!(req.headers.accept ?? "").includes("text/html")) {
    res.status(406).end();
    return;
  }

  try {
    const [client] = await db
      .select()
      .from(clientsTable)
      .where(eq(clientsTable.slug, slug))
      .limit(1);

    if (!client || client.deletedAt) {
      res.status(404).end();
      return;
    }

    const branding = buildBranding(client);

    // Load content from DB (same logic as /api/clients/:slug/content)
    const cfg = (client.config ?? {}) as Record<string, unknown>;
    const demoLang = (cfg.demoLanguage as string | undefined) ?? "de";
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
          eq(companyKnowledgeTable.language, demoLang),
        ),
      );

    type ContentChunk = { question: string; answer: string; confidence: number | null; sourceUrl: string | null };
    const grouped: Record<string, ContentChunk[]> = Object.fromEntries(categories.map((c) => [c, []]));
    for (const row of rows) {
      if (row.category in grouped) grouped[row.category]!.push(row);
    }
    for (const cat of categories) {
      grouped[cat] = grouped[cat]!
        .sort((a, b) => (b.confidence ?? 0) - (a.confidence ?? 0))
        .slice(0, 6);
    }

    const hasCrawlData = rows.length > 0;
    const content = {
      hasCrawlData,
      services: grouped.service ?? [],
      about: grouped.about ?? [],
      contact: grouped.contact ?? [],
      faq: grouped.faq ?? [],
      process: grouped.process ?? [],
    };

    // Page language
    type Lang = "de" | "tr" | "en";
    const lk: Lang = demoLang === "tr" ? "tr" : demoLang === "en" ? "en" : "de";

    // Origin
    const proto = String(req.headers["x-forwarded-proto"] ?? "https");
    const host = String(req.headers["x-forwarded-host"] ?? req.headers["host"] ?? "");
    const origin = `${proto}://${host}`;
    const pageUrl = `${origin}/demo/${slug}`;

    // Resolved values
    const companyName = String(branding.companyName ?? "");
    const city = branding.city ?? "";
    const desc = String(branding.tagline ?? branding.heroHeadline ?? companyName);
    const logoUrl = branding.logoUrl ?? "";
    const phone = branding.phone ?? "";
    const websiteUrl = branding.websiteUrl ?? "";
    const title = `${companyName}${city ? ` · ${city}` : ""} — AI WhatsApp Bot`;

    // Content for body
    const ssrServices: FaqRow[] = hasCrawlData ? content.services.slice(0, 6) : [];
    const ssrAbout: FaqRow[] = hasCrawlData ? content.about.slice(0, 3) : [];
    let ssrFaq: FaqRow[] = hasCrawlData
      ? content.faq.length > 0
        ? content.faq.slice(0, 8)
        : content.services.slice(0, 5)
      : [];
    if (ssrFaq.length === 0) {
      const ind = String(branding.industry ?? "");
      const key = FAQ_FALLBACKS[ind] ? ind : (IND_ALIAS[ind] ?? "aesthetics");
      ssrFaq = FAQ_FALLBACKS[key] ?? FAQ_FALLBACKS["aesthetics"]!;
    }

    // Read template
    let html = getIndexHtml();

    // Inject meta tags (same regex patterns as Vite SSR plugin)
    html = html
      .replace(/(<html[^>]*\slang=")[^"]*"/, `$1${lk}"`)
      .replace(/(<title>)[^<]*(<\/title>)/, `$1${esc(title)}$2`)
      .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/,      `$1${esc(desc)}$2`)
      .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/,      `$1${esc(companyName)}$2`)
      .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/,`$1${esc(desc)}$2`)
      .replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/,     `$1${esc(companyName)}$2`)
      .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/,`$1${esc(desc)}$2`)
      .replace(/(<meta\s+property="og:image"\s+content=")[^"]*(")/,      `$1${esc(logoUrl || "/opengraph.jpg")}$2`)
      .replace(/(<meta\s+name="twitter:image"\s+content=")[^"]*(")/,     `$1${esc(logoUrl || "/opengraph.jpg")}$2`);

    // JSON-LD schemas
    const businessId = `${origin}/demo/${slug}#business`;
    const localBusinessLd: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": businessId,
      name: companyName,
      description: desc,
      ...(websiteUrl ? { url: websiteUrl, sameAs: [websiteUrl] } : {}),
      ...(phone ? { telephone: phone } : {}),
      ...(city ? { address: { "@type": "PostalAddress", addressLocality: city } } : {}),
      ...(logoUrl ? { logo: { "@type": "ImageObject", url: logoUrl }, image: logoUrl } : {}),
    };
    const webPageLd = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": pageUrl,
      url: pageUrl,
      name: title,
      description: desc,
      inLanguage: lk,
      dateModified: new Date().toISOString().split("T")[0],
      isPartOf: { "@type": "WebSite", "@id": origin, url: origin, name: "Dosteli AI" },
      about: { "@type": "LocalBusiness", "@id": businessId },
      speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "[data-speakable]"] },
    };
    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${origin}/` },
        { "@type": "ListItem", position: 2, name: companyName, item: pageUrl },
      ],
    };

    const extraTags: string[] = [
      `  <link rel="canonical" href="${esc(pageUrl)}" />`,
      `  <meta property="og:url" content="${esc(pageUrl)}" />`,
      `  <script type="application/ld+json">${JSON.stringify(localBusinessLd)}</script>`,
      `  <script type="application/ld+json">${JSON.stringify(webPageLd)}</script>`,
      `  <script type="application/ld+json">${JSON.stringify(breadcrumbLd)}</script>`,
    ];
    if (ssrFaq.length > 0) {
      const faqLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: ssrFaq.map(({ question, answer }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      };
      extraTags.push(`  <script type="application/ld+json">${JSON.stringify(faqLd)}</script>`);
    }

    // window.__INITIAL_DATA__ — escape </script> to prevent XSS
    const safeJson = JSON.stringify({ branding, content }).replace(/<\/script/gi, "<\\/script");
    extraTags.push(`  <script>window.__INITIAL_DATA__=${safeJson};</script>`);

    html = html.replace("</head>", `${extraTags.join("\n")}\n</head>`);

    // Semantic SSR body — visible to crawlers, replaced by React on hydration
    const L = {
      services: { de: "Unsere Leistungen",          tr: "Hizmetlerimiz",          en: "Our Services" },
      about:    { de: "Über uns",                    tr: "Hakkımızda",              en: "About Us" },
      faq:      { de: "Häufig gestellte Fragen",     tr: "Sık sorulan sorular",     en: "Frequently Asked Questions" },
      cta:      { de: "Jetzt Termin vereinbaren",    tr: "Hemen randevu alın",      en: "Book an Appointment" },
      contact:  { de: "Kontakt",                     tr: "İletişim",                en: "Contact" },
    };

    const servicesBlock = ssrServices.length > 0 ? `
<section aria-labelledby="ssr-svcs" style="padding:48px 24px;background:#f9fafb">
  <div style="max-width:1100px;margin:0 auto">
    <h2 id="ssr-svcs" data-speakable style="font-size:28px;font-weight:700;color:#111827;margin:0 0 32px;text-align:center">${L.services[lk]}</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px">
      ${ssrServices.map((s) => `<article style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:24px">
        <h3 style="font-size:16px;font-weight:600;color:#111827;margin:0 0 8px">${tx(s.question.replace(/\?$/, "").trim())}</h3>
        <p style="font-size:14px;color:#6b7280;margin:0;line-height:1.6">${tx(s.answer)}</p>
      </article>`).join("")}
    </div>
  </div>
</section>` : "";

    const aboutBlock = ssrAbout.length > 0 ? `
<section aria-labelledby="ssr-about" style="padding:48px 24px;background:#fff">
  <div style="max-width:900px;margin:0 auto">
    <h2 id="ssr-about" data-speakable style="font-size:28px;font-weight:700;color:#111827;margin:0 0 24px">${L.about[lk]}</h2>
    ${ssrAbout.map((a) => `<p style="font-size:16px;color:#374151;line-height:1.7;margin:0 0 16px">${tx(a.answer)}</p>`).join("")}
  </div>
</section>` : "";

    const faqBlock = ssrFaq.length > 0 ? `
<section aria-labelledby="ssr-faq" style="padding:48px 24px;background:#f9fafb">
  <div style="max-width:900px;margin:0 auto">
    <h2 id="ssr-faq" data-speakable style="font-size:28px;font-weight:700;color:#111827;margin:0 0 32px">${L.faq[lk]}</h2>
    <dl>
      ${ssrFaq.map((f) => `<div style="margin-bottom:20px;border:1px solid #e5e7eb;border-radius:8px;padding:20px;background:#fff">
        <dt style="font-size:16px;font-weight:600;color:#111827;margin:0 0 8px">${tx(f.question)}</dt>
        <dd style="font-size:14px;color:#6b7280;margin:0;line-height:1.6">${tx(f.answer)}</dd>
      </div>`).join("")}
    </dl>
  </div>
</section>` : "";

    const contactBlock = `
<section aria-labelledby="ssr-contact" style="padding:64px 24px;background:#111827;text-align:center">
  <div style="max-width:700px;margin:0 auto">
    <h2 id="ssr-contact" data-speakable style="font-size:32px;font-weight:700;color:#fff;margin:0 0 24px">${L.cta[lk]}</h2>
    ${phone ? `<p style="font-size:18px;color:#d1d5db;margin:0 0 8px">📞 <a href="tel:${esc(phone)}" style="color:#d1d5db">${tx(phone)}</a></p>` : ""}
    ${city ? `<p style="font-size:16px;color:#9ca3af;margin:0 0 8px">${tx(city)}</p>` : ""}
    ${websiteUrl ? `<p style="margin:16px 0 0"><a href="${esc(websiteUrl)}" style="color:#60a5fa;font-size:14px" rel="noopener noreferrer">${tx(websiteUrl)}</a></p>` : ""}
  </div>
</section>`;

    const ssrBody = `<div id="ssr-content">
  <header style="background:#fff;border-bottom:1px solid #e5e7eb;padding:16px 24px;display:flex;align-items:center;gap:12px">
    ${logoUrl ? `<img src="${esc(logoUrl)}" alt="${esc(companyName)} logo" height="40" style="height:40px;width:auto;object-fit:contain" />` : ""}
    <span style="font-size:20px;font-weight:700;color:#111827">${tx(companyName)}</span>
  </header>
  <main>
    <section style="padding:80px 24px 64px;background:#111827">
      <div style="max-width:900px;margin:0 auto">
        <h1 data-speakable style="font-size:clamp(32px,5vw,56px);font-weight:800;color:#fff;margin:0 0 24px;line-height:1.1">${tx(branding.heroHeadline ?? branding.tagline ?? companyName)}</h1>
        ${desc ? `<p style="font-size:clamp(16px,2.5vw,20px);color:#d1d5db;margin:0 0 32px;max-width:600px;line-height:1.6">${tx(desc)}</p>` : ""}
        ${phone ? `<p style="font-size:16px;color:#9ca3af;margin:0">📞 <a href="tel:${esc(phone)}" style="color:#9ca3af">${tx(phone)}</a></p>` : ""}
      </div>
    </section>
    ${servicesBlock}
    ${aboutBlock}
    ${faqBlock}
    ${contactBlock}
  </main>
  <footer style="background:#1f2937;padding:32px 24px;text-align:center">
    <p style="color:#9ca3af;font-size:14px;margin:0">${tx(companyName)}${city ? ` · ${tx(city)}` : ""}${websiteUrl ? ` · <a href="${esc(websiteUrl)}" style="color:#9ca3af" rel="noopener noreferrer">${tx(websiteUrl)}</a>` : ""}</p>
  </footer>
</div>`;

    // Inject SSR body — replace placeholder comment if present, else inject before #root
    if (html.includes("<!--ssr-content-->")) {
      html = html.replace("<!--ssr-content-->", ssrBody);
    } else {
      html = html.replace('<div id="root">', `${ssrBody}\n  <div id="root">`);
    }

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    res.end(html);

    logger.info({ slug, hasCrawlData, faqCount: ssrFaq.length }, "SSR demo page served");
  } catch (err) {
    logger.error({ err, slug }, "SSR render error — falling back to bare SPA shell");
    try {
      const html = getIndexHtml();
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(html);
    } catch {
      res.status(500).end("Internal Server Error");
    }
  }
});

export default router;
