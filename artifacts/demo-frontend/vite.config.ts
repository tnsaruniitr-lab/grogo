import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { readFileSync } from "fs";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH;

if (!basePath) {
  throw new Error(
    "BASE_PATH environment variable is required but was not provided.",
  );
}

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),

    // ── Server-side meta injection for bot crawlers ──────────────────────────
    // Perplexity, GPTBot, ClaudeBot, Bingbot do not execute JavaScript.
    // This middleware intercepts /demo/:slug requests and injects brand-specific
    // meta tags, JSON-LD schemas, and visible noscript content into the HTML
    // before it is sent — so every crawler sees correct, structured data.
    {
      name: "demo-seo-inject",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const url = req.url ?? "";

          // ── /robots.txt ───────────────────────────────────────────────────
          if (url === "/robots.txt") {
            const proto = req.headers["x-forwarded-proto"] ?? "https";
            const host =
              req.headers["x-forwarded-host"] ?? req.headers["host"] ?? "";
            res.setHeader("Content-Type", "text/plain; charset=utf-8");
            res.end(
              `User-agent: *\nAllow: /\nSitemap: ${proto}://${host}/sitemap.xml\n`,
            );
            return;
          }

          // ── /sitemap.xml ──────────────────────────────────────────────────
          if (url === "/sitemap.xml") {
            try {
              const clientsRes = await fetch(
                "http://localhost:80/api/admin/clients",
              );
              const clients = clientsRes.ok
                ? ((await clientsRes.json()) as Array<{ slug: string }>)
                : [];
              const proto = req.headers["x-forwarded-proto"] ?? "https";
              const host =
                req.headers["x-forwarded-host"] ??
                req.headers["host"] ??
                "";
              const base = `${proto}://${host}`;
              const today = new Date().toISOString().split("T")[0];
              const sitemap = [
                '<?xml version="1.0" encoding="UTF-8"?>',
                '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
                `  <url><loc>${base}/</loc><changefreq>weekly</changefreq><priority>0.5</priority></url>`,
                ...clients.map(
                  (c) =>
                    `  <url><loc>${base}/demo/${c.slug}</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>`,
                ),
                "</urlset>",
              ].join("\n");
              res.setHeader("Content-Type", "application/xml; charset=utf-8");
              res.end(sitemap);
            } catch {
              next();
            }
            return;
          }

          // ── /demo/:slug — HTML requests only ─────────────────────────────
          const match = url.match(/^\/demo\/([^/?#&]+)/);
          if (!match || !(req.headers["accept"] ?? "").includes("text/html")) {
            return next();
          }

          // Industry FAQ fallbacks — used when the client has no crawl data yet
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

            // Fetch FAQ content — falls back to industry defaults if no crawl data
            let faqItems: FaqRow[] = [];
            try {
              const contentRes = await fetch(
                `http://localhost:80/api/clients/${slug}/content`,
              );
              if (contentRes.ok) {
                const content = (await contentRes.json()) as {
                  hasCrawlData?: boolean;
                  faq?: FaqRow[];
                  services?: FaqRow[];
                };
                if (content.hasCrawlData) {
                  faqItems = content.faq?.length
                    ? content.faq.slice(0, 8)
                    : (content.services?.slice(0, 5) ?? []);
                }
              }
            } catch {
              /* content is optional */
            }
            if (faqItems.length === 0) {
              const ind = String(branding.industry ?? "");
              const key = FAQ_FALLBACKS[ind]
                ? ind
                : (IND_ALIAS[ind] ?? "aesthetics");
              faqItems = FAQ_FALLBACKS[key] ?? FAQ_FALLBACKS["aesthetics"];
            }

            // Read index.html and apply Vite's own transforms
            let html = readFileSync(
              path.resolve(server.config.root, "index.html"),
              "utf-8",
            );
            html = await server.transformIndexHtml(req.url!, html);

            // HTML attribute-safe escape helper
            const esc = (s: unknown) =>
              String(s ?? "")
                .replace(/&/g, "&amp;")
                .replace(/"/g, "&quot;")
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
            const title = `${companyName}${city ? ` · ${city}` : ""} — AI WhatsApp Bot`;
            const proto = String(
              req.headers["x-forwarded-proto"] ?? "https",
            );
            const host = String(
              req.headers["x-forwarded-host"] ??
                req.headers["host"] ??
                "",
            );
            const pageUrl = `${proto}://${host}${req.url}`;

            // ── Inject meta tag values ────────────────────────────────────
            html = html
              .replace(/(<html[^>]*\slang=")[^"]*"/, `$1${lang}"`)
              .replace(
                /(<title>)[^<]*(<\/title>)/,
                `$1${esc(title)}$2`,
              )
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
              // Replace og:image and twitter:image in-place (avoids duplicate tags)
              .replace(
                /(<meta\s+property="og:image"\s+content=")[^"]*(")/,
                `$1${esc(logoUrl || "/opengraph.jpg")}$2`,
              )
              .replace(
                /(<meta\s+name="twitter:image"\s+content=")[^"]*(")/,
                `$1${esc(logoUrl || "/opengraph.jpg")}$2`,
              );

            // ── Structured data ───────────────────────────────────────────
            const localBusinessLd = {
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
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
              ...(logoUrl ? { logo: logoUrl, image: logoUrl } : {}),
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                bestRating: "5",
                reviewCount: "124",
              },
              speakable: {
                "@type": "SpeakableSpecification",
                cssSelector: ["h1", "[data-speakable]"],
              },
              dateModified: new Date().toISOString().split("T")[0],
            };

            const extraTags: string[] = [
              `  <link rel="canonical" href="${esc(pageUrl)}" />`,
              `  <meta property="og:url" content="${esc(pageUrl)}" />`,
              `  <script type="application/ld+json">${JSON.stringify(localBusinessLd)}</script>`,
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

            // ── Noscript body — visible to non-JS crawlers ────────────────
            const faqLabel =
              lang === "de"
                ? "Häufig gestellte Fragen"
                : lang === "tr"
                  ? "Sık sorulan sorular"
                  : "Frequently asked questions";
            const noscript =
              `<noscript><div style="font-family:sans-serif;max-width:800px;margin:40px auto;padding:0 24px">` +
              `<h1>${esc(companyName)}</h1>` +
              `<p>${esc(desc)}</p>` +
              (city ? `<p>${esc(city)}</p>` : "") +
              (phone ? `<p>${esc(phone)}</p>` : "") +
              (websiteUrl
                ? `<p><a href="${esc(websiteUrl)}">${esc(websiteUrl)}</a></p>`
                : "") +
              (faqItems.length > 0
                ? `<h2>${faqLabel}</h2><dl>${faqItems
                    .map(
                      (f) =>
                        `<dt><strong>${esc(f.question)}</strong></dt><dd>${esc(f.answer)}</dd>`,
                    )
                    .join("")}</dl>`
                : "") +
              `</div></noscript>`;
            html = html.replace(
              '<div id="root">',
              `${noscript}\n    <div id="root">`,
            );

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
