import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { readFileSync } from "fs";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const rawPort = process.env.PORT;
if (!rawPort) throw new Error("PORT environment variable is required but was not provided.");
const port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) throw new Error(`Invalid PORT value: "${rawPort}"`);
const basePath = process.env.BASE_PATH;
if (!basePath) throw new Error("BASE_PATH environment variable is required but was not provided.");

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),

    // ── SSR middleware for AI/search bot crawlers ─────────────────────────────
    // GPTBot, PerplexityBot, ClaudeBot, Bingbot, Googlebot do not execute JS
    // (or defer it). This middleware:
    //   1. Injects brand-specific <head> meta tags + correct JSON-LD schemas
    //   2. Renders a full semantic HTML body visible to every crawler
    //   3. Serves dynamic sitemap.xml (with image: extension) and robots.txt
    // React loads normally and removes the SSR body via main.tsx.
    {
      name: "demo-ssr",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const url = req.url ?? "";
          const proto = String(req.headers["x-forwarded-proto"] ?? "https");
          const host = String(
            req.headers["x-forwarded-host"] ?? req.headers["host"] ?? "",
          );
          const origin = `${proto}://${host}`;

          // ── robots.txt ────────────────────────────────────────────────────
          if (url === "/robots.txt") {
            res.setHeader("Content-Type", "text/plain; charset=utf-8");
            res.end(
              [
                "User-agent: *",
                "Allow: /",
                "Disallow: /api/",
                "",
                "# Explicitly allow AI search crawlers to index all demo pages",
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
            return;
          }

          // ── sitemap.xml ───────────────────────────────────────────────────
          if (url === "/sitemap.xml") {
            try {
              const clientsRes = await fetch(
                "http://localhost:80/api/admin/clients",
              );
              const clients: Array<{ slug: string }> = clientsRes.ok
                ? ((await clientsRes.json()) as Array<{ slug: string }>)
                : [];
              const today = new Date().toISOString().split("T")[0];

              // Fetch branding per client for the image: sitemap extension
              const richClients = await Promise.all(
                clients.map(async (c) => {
                  try {
                    const br = await fetch(
                      `http://localhost:80/api/clients/${c.slug}/branding`,
                    );
                    const b = br.ok
                      ? ((await br.json()) as Record<string, unknown>)
                      : {};
                    const rawLogo = b.logoUrl ? String(b.logoUrl) : "";
                    // Sitemap image:loc must be absolute — resolve relative paths
                    const logoUrl = rawLogo.startsWith("http")
                      ? rawLogo
                      : rawLogo.startsWith("/")
                        ? `${origin}${rawLogo}`
                        : "";
                    return {
                      slug: c.slug,
                      name: String(b.companyName ?? c.slug),
                      logoUrl,
                    };
                  } catch {
                    return { slug: c.slug, name: c.slug, logoUrl: "" };
                  }
                }),
              );

              const parts = [
                '<?xml version="1.0" encoding="UTF-8"?>',
                '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
                '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
                `  <url><loc>${origin}/</loc><changefreq>weekly</changefreq><priority>0.5</priority></url>`,
                ...richClients.map(({ slug, name, logoUrl }) =>
                  [
                    `  <url>`,
                    `    <loc>${origin}/demo/${slug}</loc>`,
                    `    <lastmod>${today}</lastmod>`,
                    `    <changefreq>daily</changefreq>`,
                    `    <priority>0.9</priority>`,
                    ...(logoUrl
                      ? [
                          `    <image:image>`,
                          `      <image:loc>${logoUrl}</image:loc>`,
                          `      <image:caption>${name}</image:caption>`,
                          `    </image:image>`,
                        ]
                      : []),
                    `  </url>`,
                  ].join("\n"),
                ),
                "</urlset>",
              ];
              res.setHeader("Content-Type", "application/xml; charset=utf-8");
              res.end(parts.join("\n"));
            } catch {
              next();
            }
            return;
          }

          // ── /demo/:slug — HTML requests only ─────────────────────────────
          const match = url.match(/^\/demo\/([^/?#&]+)/);
          if (
            !match ||
            !(req.headers["accept"] ?? "").includes("text/html")
          ) {
            return next();
          }

          // ── Industry FAQ fallbacks (used when client has no crawl data) ──
          type FaqRow = { question: string; answer: string };
          const FAQ_FALLBACKS: Record<string, FaqRow[]> = {
            aesthetics: [
              { question: "Wie buche ich einen Termin?", answer: "Schreiben Sie uns auf WhatsApp — unser KI-Assistent antwortet sofort, rund um die Uhr." },
              { question: "Welche Behandlungen bieten Sie an?", answer: "Wir bieten ästhetische Behandlungen wie Botox, Filler, Laserbehandlungen und Hautpflege an." },
              { question: "Ist eine Erstberatung kostenlos?", answer: "Ja, wir bieten kostenlose Erstberatungen an. Unser WhatsApp-Bot bucht direkt einen Termin." },
              { question: "Wie lange dauert eine Behandlung?", answer: "Die Behandlungsdauer variiert je nach Eingriff zwischen 30 Minuten und 2 Stunden." },
              { question: "Sind Ihre Behandlungen sicher?", answer: "Alle Behandlungen werden von zertifizierten Fachärzten mit zugelassenen Produkten durchgeführt." },
            ],
            dental: [
              { question: "Bieten Sie ästhetische Zahnbehandlungen an?", answer: "Ja — Zahnaufhellung, Veneers, unsichtbare Zahnspangen und weitere kosmetische Behandlungen." },
              { question: "Wie buche ich einen Zahnarzttermin?", answer: "Schreiben Sie uns auf WhatsApp — unser Assistent bucht sofort einen passenden Termin." },
              { question: "Akzeptieren Sie Krankenkassen?", answer: "Wir arbeiten mit den meisten gesetzlichen und privaten Krankenkassen zusammen." },
              { question: "Behandeln Sie Angstpatienten?", answer: "Ja, wir haben Erfahrung mit Angstpatienten und bieten ein ruhiges, einfühlsames Umfeld." },
              { question: "Wie lange dauert eine Zahnaufhellung?", answer: "Eine professionelle Zahnaufhellung dauert in der Regel 60–90 Minuten." },
            ],
            medical: [
              { question: "Wie schnell erhalte ich einen Termin?", answer: "Dringende Fälle werden bevorzugt behandelt. Schreiben Sie uns auf WhatsApp — wir antworten sofort." },
              { question: "Welche Sprachen sprechen Sie?", answer: "Unser Team kommuniziert auf Deutsch, Englisch und Türkisch." },
              { question: "Ist meine Anfrage vertraulich?", answer: "Ja, alle Anfragen werden streng vertraulich und DSGVO-konform behandelt." },
              { question: "Sind Hausbesuche möglich?", answer: "In bestimmten Fällen bieten wir Hausbesuche an. Kontaktieren Sie uns für mehr Informationen." },
              { question: "Kann ich eine Überweisung über WhatsApp anfordern?", answer: "Ja, unser KI-Assistent koordiniert Überweisungen und bucht direkt Folgetermine." },
            ],
            wellness: [
              { question: "Welche Wellnessprogramme bieten Sie an?", answer: "Wir bieten Yoga, Meditation, Massage, Ernährungsberatung und individuelle Wellnesspakete an." },
              { question: "Wie buche ich einen Kurs?", answer: "Schreiben Sie uns auf WhatsApp — unser Assistent zeigt freie Plätze und bucht direkt." },
              { question: "Sind Ihre Kurse für Anfänger geeignet?", answer: "Ja, wir haben Kurse für alle Niveaus — von Einsteigern bis zu Fortgeschrittenen." },
              { question: "Bieten Sie Einzelsitzungen oder Pakete an?", answer: "Wir bieten beides — Einzelsitzungen sowie vergünstigte Monatspakete und Jahresabos." },
              { question: "Kann ich mit einem Trainer sprechen, bevor ich buche?", answer: "Natürlich — unser WhatsApp-Bot verbindet Sie sofort mit einem unserer Berater." },
            ],
            care: [
              { question: "Welche Pflegeleistungen bieten Sie an?", answer: "Wir bieten ambulante Pflege, Betreuung zuhause, Demenzbegleitung und 24h-Pflege an." },
              { question: "Wie schnell können Sie Pflege organisieren?", answer: "In dringenden Fällen oft noch am selben Tag. Schreiben Sie uns auf WhatsApp." },
              { question: "Sprechen Ihre Pflegekräfte Türkisch?", answer: "Ja, wir haben muttersprachliche türkischsprachige Pflegekräfte." },
              { question: "Übernimmt die Pflegekasse die Kosten?", answer: "Viele unserer Leistungen werden von der Pflegekasse übernommen. Wir beraten Sie kostenlos." },
              { question: "Wie funktioniert die Anmeldung?", answer: "Einfach auf WhatsApp schreiben — unser KI-Assistent führt Sie durch den gesamten Prozess." },
            ],
          };
          const IND_ALIAS: Record<string, string> = {
            hair_clinic: "aesthetics", iv_therapy: "aesthetics",
            cosmetic_surgery: "aesthetics", physiotherapy: "medical",
            laser_eye: "medical", fertility: "care", weight_management: "medical",
          };

          const slug = match[1];
          try {
            const brandingRes = await fetch(
              `http://localhost:80/api/clients/${slug}/branding`,
            );
            if (!brandingRes.ok) return next();
            const branding = (await brandingRes.json()) as Record<
              string,
              unknown
            >;

            // Fetch all content sections for SSR body + schemas
            let faqItems: FaqRow[] = [];
            let services: FaqRow[] = [];
            let aboutItems: FaqRow[] = [];
            try {
              const contentRes = await fetch(
                `http://localhost:80/api/clients/${slug}/content`,
              );
              if (contentRes.ok) {
                const content = (await contentRes.json()) as {
                  hasCrawlData?: boolean;
                  faq?: FaqRow[];
                  services?: FaqRow[];
                  about?: FaqRow[];
                };
                if (content.hasCrawlData) {
                  services = content.services?.slice(0, 6) ?? [];
                  aboutItems = content.about?.slice(0, 5) ?? [];
                  faqItems = content.faq?.length
                    ? content.faq.slice(0, 8)
                    : (content.services?.slice(0, 5) ?? []);
                }
              }
            } catch {
              /* content is optional */
            }
            // Industry FAQ fallbacks when no crawl data
            if (faqItems.length === 0) {
              const ind = String(branding.industry ?? "");
              const key = FAQ_FALLBACKS[ind]
                ? ind
                : (IND_ALIAS[ind] ?? "aesthetics");
              faqItems = FAQ_FALLBACKS[key] ?? FAQ_FALLBACKS["aesthetics"];
            }

            // Read index.html from disk. We build the full SSR HTML first,
            // then call transformIndexHtml so Vite's dev-client injection
            // happens AFTER our content is already in the document.
            // (transformIndexHtml strips HTML comments in Vite v7, so the
            // <!--ssr-content--> placeholder must be replaced beforehand.)
            let html = readFileSync(
              path.resolve(server.config.root, "index.html"),
              "utf-8",
            );

            // ── Escape helpers ─────────────────────────────────────────────
            // esc(): full HTML attr escaping (for attribute values)
            const esc = (s: unknown) =>
              String(s ?? "")
                .replace(/&/g, "&amp;")
                .replace(/"/g, "&quot;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
            // tx(): text-node escaping only (for inner text, no quote escaping)
            const tx = (s: unknown) =>
              String(s ?? "")
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");

            const companyName = String(branding.companyName ?? "");
            const city = branding.city ? String(branding.city) : "";
            const desc = String(
              branding.tagline ?? branding.heroHeadline ?? companyName,
            );
            const logoUrl = branding.logoUrl ? String(branding.logoUrl) : "";
            const phone = branding.phone ? String(branding.phone) : "";
            const websiteUrl = branding.websiteUrl
              ? String(branding.websiteUrl)
              : "";
            const dl = String(branding.demoLanguage ?? "de");
            const lang = dl === "tr" ? "tr" : dl === "en" ? "en" : "de";
            const headline = String(
              branding.heroHeadline || branding.tagline || companyName,
            );
            const pageUrl = `${origin}${req.url!.split("?")[0]}`;
            const title = `${companyName}${city ? ` · ${city}` : ""} — AI WhatsApp Bot`;

            // ── Meta tag injection (replace in-place) ──────────────────────
            html = html
              .replace(/(<html[^>]*\slang=")[^"]*"/, `$1${lang}"`)
              .replace(/(<title>)[^<]*(<\/title>)/, `$1${esc(title)}$2`)
              .replace(
                /(<meta\s+name="description"\s+content=")[^"]*(")/,
                `$1${esc(desc)}$2`,
              )
              .replace(
                /(<meta\s+property="og:title"\s+content=")[^"]*(")/,
                `$1${esc(companyName)}$2`,
              )
              .replace(
                /(<meta\s+property="og:description"\s+content=")[^"]*(")/,
                `$1${esc(desc)}$2`,
              )
              .replace(
                /(<meta\s+name="twitter:title"\s+content=")[^"]*(")/,
                `$1${esc(companyName)}$2`,
              )
              .replace(
                /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/,
                `$1${esc(desc)}$2`,
              )
              // Replace og:image and twitter:image in-place — no duplicate tags
              .replace(
                /(<meta\s+property="og:image"\s+content=")[^"]*(")/,
                `$1${esc(logoUrl || "/opengraph.jpg")}$2`,
              )
              .replace(
                /(<meta\s+name="twitter:image"\s+content=")[^"]*(")/,
                `$1${esc(logoUrl || "/opengraph.jpg")}$2`,
              );

            // ── Schema.org JSON-LD (correct per schema.org spec) ───────────
            //
            // LocalBusiness — entity definition, no aggregateRating (avoid fake data),
            //   logo as ImageObject, @id for disambiguation, hasOfferCatalog for services
            // WebPage — speakable + dateModified belong HERE, not on LocalBusiness
            // BreadcrumbList — navigation path
            // FAQPage — Q&As from real crawl data or industry fallbacks
            const businessId = `${origin}/demo/${slug}#business`;

            const localBusinessLd: Record<string, unknown> = {
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": businessId,
              name: companyName,
              description: desc,
              ...(websiteUrl
                ? { url: websiteUrl, sameAs: [websiteUrl] }
                : {}),
              ...(phone ? { telephone: phone } : {}),
              ...(city
                ? {
                    address: {
                      "@type": "PostalAddress",
                      addressLocality: city,
                    },
                  }
                : {}),
              ...(logoUrl
                ? {
                    logo: { "@type": "ImageObject", url: logoUrl },
                    image: logoUrl,
                  }
                : {}),
              ...(services.length > 0
                ? {
                    hasOfferCatalog: {
                      "@type": "OfferCatalog",
                      name:
                        lang === "de"
                          ? "Leistungen"
                          : lang === "tr"
                            ? "Hizmetler"
                            : "Services",
                      itemListElement: services.map((s) => ({
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Service",
                          name: s.question.replace(/\?$/, "").trim().slice(0, 80),
                          description: s.answer,
                        },
                      })),
                    },
                  }
                : {}),
            };

            // WebPage — speakable and dateModified are WebPage properties
            const webPageLd = {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "@id": pageUrl,
              url: pageUrl,
              name: title,
              description: desc,
              inLanguage: lang,
              dateModified: new Date().toISOString().split("T")[0],
              isPartOf: {
                "@type": "WebSite",
                "@id": origin,
                url: origin,
                name: "Dosteli",
              },
              about: { "@type": "LocalBusiness", "@id": businessId },
              speakable: {
                "@type": "SpeakableSpecification",
                cssSelector: ["h1", "[data-speakable]"],
              },
            };

            // BreadcrumbList — structured navigation for SERP breadcrumb display
            const breadcrumbLd = {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: `${origin}/`,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: companyName,
                  item: pageUrl,
                },
              ],
            };

            const extraTags: string[] = [
              `  <link rel="canonical" href="${esc(pageUrl)}" />`,
              `  <meta property="og:url" content="${esc(pageUrl)}" />`,
              `  <script type="application/ld+json">${JSON.stringify(localBusinessLd)}</script>`,
              `  <script type="application/ld+json">${JSON.stringify(webPageLd)}</script>`,
              `  <script type="application/ld+json">${JSON.stringify(breadcrumbLd)}</script>`,
            ];

            if (faqItems.length > 0) {
              const faqLd = {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: faqItems.map(({ question, answer }) => ({
                  "@type": "Question",
                  name: question,
                  acceptedAnswer: { "@type": "Answer", text: answer },
                })),
              };
              extraTags.push(
                `  <script type="application/ld+json">${JSON.stringify(faqLd)}</script>`,
              );
            }

            html = html.replace(
              "</head>",
              `${extraTags.join("\n")}\n</head>`,
            );

            // ── Full semantic HTML body (SSR) ──────────────────────────────
            // This renders the full page content into the DOM before React loads.
            // Every crawler sees this — it is NOT inside a <noscript> tag.
            // React's main.tsx removes #ssr-content once it hydrates.

            type LK = "de" | "tr" | "en";
            const lk: LK = lang === "tr" ? "tr" : lang === "en" ? "en" : "de";
            const L = {
              services: { de: "Unsere Leistungen", tr: "Hizmetlerimiz", en: "Our Services" },
              about:    { de: "Über uns",           tr: "Hakkımızda",    en: "About Us" },
              faq:      { de: "Häufig gestellte Fragen", tr: "Sık sorulan sorular", en: "Frequently asked questions" },
              cta:      { de: "Jetzt Termin vereinbaren", tr: "Hemen randevu alın", en: "Book an appointment" },
            } satisfies Record<string, Record<LK, string>>;

            const servicesBlock =
              services.length > 0
                ? `<section aria-labelledby="ssr-svcs" style="padding:48px 24px;background:#f9fafb">
  <div style="max-width:1100px;margin:0 auto">
    <h2 id="ssr-svcs" data-speakable style="font-size:28px;font-weight:700;color:#111827;margin:0 0 32px;text-align:center">${L.services[lk]}</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px">
      ${services
        .map(
          (s) => `<article style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:24px">
        <h3 style="font-size:16px;font-weight:600;color:#111827;margin:0 0 8px">${tx(s.question.replace(/\?$/, "").trim())}</h3>
        <p style="font-size:14px;color:#6b7280;margin:0;line-height:1.6">${tx(s.answer)}</p>
      </article>`,
        )
        .join("")}
    </div>
  </div>
</section>`
                : "";

            const aboutBlock =
              aboutItems.length > 0
                ? `<section aria-labelledby="ssr-about" style="padding:48px 24px">
  <div style="max-width:800px;margin:0 auto">
    <h2 id="ssr-about" style="font-size:28px;font-weight:700;color:#111827;margin:0 0 16px">${L.about[lk]}</h2>
    <p style="color:#374151;line-height:1.7;margin:0 0 16px">${tx(aboutItems[0]!.answer)}</p>
    ${
      aboutItems.length > 1
        ? `<ul style="list-style:none;padding:0;margin:0;display:grid;gap:8px">${aboutItems
            .slice(1)
            .map(
              (a) =>
                `<li style="display:flex;gap:10px;color:#374151"><span style="color:#059669;flex-shrink:0">✓</span><span>${tx(a.answer)}</span></li>`,
            )
            .join("")}</ul>`
        : ""
    }
  </div>
</section>`
                : "";

            const faqBlock =
              faqItems.length > 0
                ? `<section aria-labelledby="ssr-faq" style="padding:48px 24px;background:#f9fafb">
  <div style="max-width:800px;margin:0 auto">
    <h2 id="ssr-faq" data-speakable style="font-size:28px;font-weight:700;color:#111827;margin:0 0 32px;text-align:center">${L.faq[lk]}</h2>
    <dl style="margin:0;display:grid;gap:12px">
      ${faqItems
        .map(
          (f) => `<div style="background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:20px">
        <dt style="font-weight:600;color:#111827;margin:0 0 8px;font-size:15px">${tx(f.question)}</dt>
        <dd style="margin:0;color:#6b7280;font-size:14px;line-height:1.6">${tx(f.answer)}</dd>
      </div>`,
        )
        .join("")}
    </dl>
  </div>
</section>`
                : "";

            const ssrContent = `<main id="ssr-content" lang="${lang}">
  <nav aria-label="Breadcrumb" style="padding:10px 24px;background:#f9fafb;border-bottom:1px solid #e5e7eb;font-size:13px">
    <ol itemscope itemtype="https://schema.org/BreadcrumbList" style="list-style:none;margin:0;padding:0;max-width:1200px;margin:0 auto;display:flex;gap:6px;align-items:center">
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <a itemprop="item" href="${esc(origin)}/" style="color:#6b7280;text-decoration:none"><span itemprop="name">Home</span></a>
        <meta itemprop="position" content="1" />
      </li>
      <li aria-hidden="true" style="color:#d1d5db">›</li>
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem" aria-current="page">
        <span itemprop="name" style="color:#111827;font-weight:500">${tx(companyName)}</span>
        <meta itemprop="position" content="2" />
      </li>
    </ol>
  </nav>
  <header style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);color:#fff;padding:64px 24px;text-align:center">
    <div style="max-width:800px;margin:0 auto">
      ${logoUrl ? `<img src="${esc(logoUrl)}" alt="${tx(companyName)} logo" width="200" height="72" style="max-height:72px;max-width:240px;object-fit:contain;margin-bottom:32px;display:block;margin-left:auto;margin-right:auto" />` : ""}
      <h1 data-speakable style="font-size:clamp(28px,5vw,52px);font-weight:800;line-height:1.1;margin:0 0 16px;color:#fff">${tx(headline)}</h1>
      <p data-speakable style="font-size:clamp(16px,2.5vw,20px);opacity:0.85;max-width:600px;margin:0 auto 32px;color:#f9fafb">${tx(desc)}</p>
      ${
        city || phone || websiteUrl
          ? `<address style="font-style:normal;display:flex;flex-wrap:wrap;gap:16px;justify-content:center;font-size:14px;opacity:0.8;color:#e5e7eb">
        ${city ? `<span>📍 ${tx(city)}</span>` : ""}
        ${phone ? `<a href="tel:${esc(phone)}" style="color:inherit">${tx(phone)}</a>` : ""}
        ${websiteUrl ? `<a href="${esc(websiteUrl)}" style="color:inherit" rel="noopener noreferrer">${tx(websiteUrl)}</a>` : ""}
      </address>`
          : ""
      }
    </div>
  </header>
  ${servicesBlock}
  ${aboutBlock}
  ${faqBlock}
  <section aria-labelledby="ssr-cta" style="padding:48px 24px;text-align:center;background:#111827;color:#fff">
    <h2 id="ssr-cta" style="font-size:24px;font-weight:700;margin:0 0 16px;color:#fff">${L.cta[lk]}</h2>
    ${websiteUrl ? `<p style="margin:0 0 8px"><a href="${esc(websiteUrl)}" style="color:#93c5fd;font-size:18px" rel="noopener noreferrer">${tx(websiteUrl)}</a></p>` : ""}
    ${phone ? `<p style="margin:0"><a href="tel:${esc(phone)}" style="color:#86efac;font-size:18px">${tx(phone)}</a></p>` : ""}
  </section>
</main>`;

            // Replace placeholder BEFORE transformIndexHtml — Vite v7 strips
            // HTML comments during its transform, so this must come first.
            html = html.replace("<!--ssr-content-->", ssrContent);

            // Now let Vite inject the dev client / HMR script into <head>.
            html = await server.transformIndexHtml(req.url!, html);

            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.end(html);
          } catch {
            next();
          }
        });
      },
    },

    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(
        import.meta.dirname,
        "..",
        "..",
        "attached_assets",
      ),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
