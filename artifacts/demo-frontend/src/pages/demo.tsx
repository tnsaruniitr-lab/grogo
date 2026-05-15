import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DemoNav } from "@/components/layout/demo-nav";
import { getDemoT } from "@/lib/demo-i18n";
import {
  getIndustryTheme,
  getLang,
  PRIMARY_VERTICALS,
  INDUSTRY_SCHEMA_TYPES,
  getTestimonials,
  getFAQFallbacks,
  type Testimonial,
} from "@/lib/industry-themes";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import careImg from "@/assets/care.png";
import { Link } from "wouter";
import {
  CheckCircle2,
  ShieldCheck,
  Award,
  Clock,
  Loader2,
  ArrowRight,
  Heart,
  Users,
  Home as HomeIcon,
  PhoneCall,
  MessageCircle,
  Sparkles,
  Gem,
  Star,
  Stethoscope,
  Activity,
  Smile,
  Shield,
  Leaf,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { IndustryPicker } from "@/components/heroes/IndustryPicker";
import { V3Hero } from "@/components/heroes/V3Hero";

const ICON_MAP: Record<string, LucideIcon> = {
  Home: HomeIcon, Heart, Users, Sparkles, Gem, Star,
  Stethoscope, Activity, Smile, Shield, Leaf, Wind,
};

function resolveIcons(names: [string, string, string]): [LucideIcon, LucideIcon, LucideIcon] {
  return names.map((n) => ICON_MAP[n] ?? Star) as [LucideIcon, LucideIcon, LucideIcon];
}

interface BrandingConfig {
  clientId?: number;
  companyName: string;
  slug: string;
  tagline?: string | null;
  heroHeadline?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  logoUrl?: string | null;
  city?: string | null;
  phone?: string | null;
  websiteUrl?: string | null;
  demoLanguage?: string | null;
  industry?: string | null;
  heroImageUrl?: string | null;
}

function resolveColors(branding: BrandingConfig): { primary: string; secondary: string } {
  if (branding.primaryColor && branding.secondaryColor) {
    return { primary: branding.primaryColor, secondary: branding.secondaryColor };
  }
  const industry = branding.industry ?? "other";
  const FALLBACKS: Record<string, { primary: string; secondary: string }> = {
    care:                { primary: "#E8A84C", secondary: "#1B2B3A" },
    aesthetics:          { primary: "#C4882A", secondary: "#1A1008" },
    dental:              { primary: "#3B9BD4", secondary: "#0A1A24" },
    medical:             { primary: "#1B4F8A", secondary: "#0D1B2A" },
    wellness:            { primary: "#8BAF6A", secondary: "#0D1209" },
    "cosmetic-surgery":  { primary: "#C9B99A", secondary: "#0B0907" },
    hair:                { primary: "#2A9BD4", secondary: "#060E14" },
    "weight-management": { primary: "#4CAF80", secondary: "#040C07" },
    "iv-therapy":        { primary: "#9B72CF", secondary: "#080512" },
    fertility:           { primary: "#C4788A", secondary: "#140B0E" },
    physiotherapy:       { primary: "#4A9B6A", secondary: "#060E08" },
    "laser-eye":         { primary: "#2A74CB", secondary: "#04080F" },
    other:               { primary: "#374151", secondary: "#111827" },
  };
  const fallback = FALLBACKS[industry] ?? FALLBACKS.other!;
  return {
    primary: branding.primaryColor || fallback.primary,
    secondary: branding.secondaryColor || fallback.secondary,
  };
}

interface KnowledgeChunk {
  question: string;
  answer: string;
  confidence: number;
  sourceUrl?: string | null;
}

interface ClientContent {
  hasCrawlData: boolean;
  services: KnowledgeChunk[];
  about: KnowledgeChunk[];
  contact: KnowledgeChunk[];
  faq: KnowledgeChunk[];
  process: KnowledgeChunk[];
}

function chunkTitle(q: string, max = 48): string {
  const clean = q.replace(/\?$/, "").trim();
  return clean.length > max ? clean.slice(0, max - 1) + "…" : clean;
}

export default function DemoPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [branding, setBranding] = useState<BrandingConfig | null>(null);
  const [content, setContent] = useState<ClientContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleMessages, setVisibleMessages] = useState(0);

  useEffect(() => {
    if (!slug) return;
    Promise.all([
      fetch(`/api/clients/${slug}/branding`).then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json() as Promise<BrandingConfig>;
      }),
      fetch(`/api/clients/${slug}/content`)
        .then((r) => (r.ok ? (r.json() as Promise<ClientContent>) : null))
        .catch(() => null),
    ])
      .then(([b, c]) => {
        setBranding(b);
        setContent(c);
      })
      .catch(() => setError("not found"))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!branding) return;
    setVisibleMessages(0);
    const timer = setInterval(() => {
      setVisibleMessages((v) => {
        if (v >= 5) { clearInterval(timer); return v; }
        return v + 1;
      });
    }, 900);
    return () => clearInterval(timer);
  }, [branding]);

  // ── Client-side SEO: update <head> after React hydrates ──────────────────
  useEffect(() => {
    if (!branding) return;
    const ind = branding.industry ?? "other";
    const schemaType = (INDUSTRY_SCHEMA_TYPES[ind]?.[0]) ?? "LocalBusiness";
    document.title = `${branding.companyName} — WhatsApp AI Bot Demo`;
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.name = name; document.head.appendChild(el); }
      el.content = content;
    };
    const setOg = (prop: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[property="${prop}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute("property", prop); document.head.appendChild(el); }
      el.content = content;
    };
    setMeta("description", `${branding.companyName} — AI WhatsApp bot. ${branding.tagline ?? ""}`);
    setOg("og:title", `${branding.companyName} — AI WhatsApp Bot`);
    setOg("og:description", branding.tagline ?? `AI-powered WhatsApp bot for ${schemaType}`);
    if (branding.logoUrl) setOg("og:image", branding.logoUrl);
  }, [branding]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const t = getDemoT(branding?.demoLanguage ?? null);

  if (error || !branding) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4 bg-background">
        <p className="text-2xl font-bold text-foreground">{t.notFound.title}</p>
        <p className="text-muted-foreground">{t.notFound.desc}</p>
        <Button variant="outline" onClick={() => window.history.back()}>{t.notFound.back}</Button>
      </div>
    );
  }

  // ── If no industry set, show the full-screen picker ──────────────────────
  if (!branding.industry) {
    return (
      <IndustryPicker
        branding={branding}
        onSelect={(industry, updated) => setBranding(updated)}
      />
    );
  }

  const headline = branding.heroHeadline || branding.tagline || branding.companyName;
  const subtext = branding.tagline && branding.heroHeadline ? branding.tagline : t.defaultSubtitle;
  const { primary, secondary } = resolveColors(branding);
  const lang = getLang(branding.demoLanguage);
  const theme = getIndustryTheme(branding.industry);
  const themeIcons = resolveIcons(theme.serviceIconNames);
  const isPrimary = PRIMARY_VERTICALS.has(branding.industry ?? "");
  const testimonials: Testimonial[] = getTestimonials(branding.industry);

  const faqItems: Array<{ q: string; a: string }> =
    content?.hasCrawlData && content.faq.length > 0
      ? content.faq.slice(0, 8).map((c) => ({ q: c.question, a: c.answer }))
      : content?.hasCrawlData && content.services.length > 0
        ? content.services.slice(0, 5).map((c) => ({ q: c.question, a: c.answer }))
        : getFAQFallbacks(branding.industry).slice(0, 5).map((f) => ({ q: f.q[lang], a: f.a[lang] }));

  return (
    <div className="min-h-screen bg-background">
      {/* DemoNav sits above the hero visually but the hero is full-bleed, so we need it as fixed */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        {/* transparent — nav is inside V3Hero itself */}
      </div>

      {/* ── V3 VIDEO HERO ── */}
      <V3Hero
        industry={branding.industry}
        companyName={branding.companyName}
        logoUrl={branding.logoUrl}
        headline={headline}
        subtext={subtext}
        phone={branding.phone}
        city={branding.city}
        onCtaClick={() =>
          document.getElementById("bot-demo")?.scrollIntoView({ behavior: "smooth" })
        }
      />

      {/* Thin accent line between hero and body */}
      <div className="h-1 w-full" style={{ backgroundColor: primary }} />

      {/* ── TRUST BAR ── */}
      {isPrimary && (
        <section className="py-5 border-b bg-card">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-3">
              {theme.trustBadges.map((badge, i) => {
                const TrustIcon = [ShieldCheck, Award, Clock, Star][i % 4];
                return (
                  <div key={badge} className="flex items-center gap-2 text-sm font-medium" style={{ color: secondary }}>
                    <TrustIcon className="w-4 h-4 shrink-0" style={{ color: primary }} />
                    <span>{badge}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── SERVICES ── */}
      <section id="leistungen" className="py-24 bg-muted/40">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6" style={{ color: secondary }}>{t.servicesTitle}</h2>
            <p className="text-lg text-muted-foreground">{theme.servicesSubtitle[lang]}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {(content?.hasCrawlData && content.services.length > 0
              ? content.services.slice(0, 3).map((chunk, i) => ({
                  title: chunkTitle(chunk.question),
                  desc: chunk.answer,
                  i,
                }))
              : theme.servicesFallback[lang].map(({ title, desc }, i) => ({ title, desc, i }))
            ).map(({ title, desc, i }) => {
              const Icon = themeIcons[i % themeIcons.length];
              if (isPrimary) {
                return (
                  <div
                    key={i}
                    className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border-t-2"
                    style={{ borderTopColor: primary }}
                  >
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center mb-6"
                      style={{ backgroundColor: primary + "14" }}
                    >
                      <Icon className="w-5 h-5" style={{ color: primary }} />
                    </div>
                    <h3 className="text-lg font-semibold mb-3 leading-snug" style={{ color: secondary }}>{title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{desc}</p>
                  </div>
                );
              }
              return (
                <div
                  key={i}
                  className="bg-card border rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 duration-300 group"
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: primary + "18" }}
                  >
                    <Icon className="w-10 h-10" style={{ color: primary }} />
                  </div>
                  <h3 className="text-xl font-bold mb-4 leading-snug" style={{ color: secondary }}>{title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── INFO / IMAGE SECTION ── */}
      <section className="py-24 overflow-hidden bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 relative">
              <div className="absolute inset-0 transform -rotate-6 rounded-3xl" style={{ backgroundColor: primary + "33" }} />
              <img
                src={careImg}
                alt="Care"
                className="relative rounded-3xl shadow-xl w-full object-cover aspect-square md:aspect-[4/3]"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-4xl font-bold mb-6 tracking-tight" style={{ color: secondary }}>{theme.infoTitle[lang]}</h2>
              <p className="text-lg text-muted-foreground mb-6">
                {content?.hasCrawlData && content.about.length > 0
                  ? content.about[0].answer
                  : theme.infoBody[lang]}
              </p>
              <ul className="space-y-4 mb-8">
                {(content?.hasCrawlData && content.about.length > 1
                  ? content.about.slice(1, 5).map((c) => c.answer)
                  : theme.infoPoints[lang]
                ).map((item, i) => (
                  <li key={i} className="flex items-start gap-3 font-medium" style={{ color: secondary }}>
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: primary }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="rounded-full h-14 px-8 text-lg group text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: secondary }}
              >
                {theme.infoButton[lang]}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT / STATS ── */}
      <section className="py-20 bg-muted/40">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6" style={{ color: secondary }}>
            {t.aboutTitle(branding.companyName)}
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            {content?.hasCrawlData && content.about.length > 0
              ? content.about[content.about.length - 1].answer
              : t.aboutBody}
          </p>
          {branding.city && (
            <p className="text-sm text-muted-foreground mb-8">📍 {branding.city}</p>
          )}
          <div className="flex flex-wrap justify-center gap-12 mt-10">
            {(content?.hasCrawlData ? theme.stats[lang] : theme.stats[lang]).map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="text-4xl font-extrabold" style={{ color: primary }}>{num}</div>
                <div className="text-sm font-medium text-muted-foreground mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: secondary }}>
              {lang === "de" ? "Was unsere Kunden sagen" : lang === "tr" ? "Müşterilerimiz ne diyor" : "What our clients say"}
            </h2>
            <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" style={{ color: primary }} />
              ))}
              <span className="ml-1 font-semibold" style={{ color: secondary }}>{theme.stats[lang][1]?.[0] ?? "4.9"}</span>
              <span>·</span>
              <span>{lang === "de" ? "124+ Bewertungen" : lang === "tr" ? "124+ değerlendirme" : "124+ reviews"}</span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((test, i) => (
              <div key={i} className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
                <div className="flex gap-0.5">
                  {Array.from({ length: test.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-current" style={{ color: primary }} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 italic">
                  &ldquo;{test.text[lang]}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-3 border-t">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ backgroundColor: primary }}
                  >
                    {test.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold leading-tight" style={{ color: secondary }}>{test.name}</div>
                    <div className="text-xs text-muted-foreground">{test.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-muted/40">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2" style={{ color: secondary }} data-speakable>
              {lang === "de" ? "Häufig gestellte Fragen" : lang === "tr" ? "Sık sorulan sorular" : "Frequently asked questions"}
            </h2>
          </div>
          <Accordion type="single" collapsible className="space-y-2">
            {faqItems.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-card border rounded-xl px-6 shadow-sm">
                <AccordionTrigger
                  className="text-left font-semibold text-sm py-4 hover:no-underline"
                  style={{ color: secondary }}
                >
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── WHATSAPP CONTACT ── */}
      <section id="bot-demo" className="py-20 bg-background" style={{ scrollMarginTop: "0px" }}>
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3" style={{ color: secondary }}>
              {t.howTitle(branding.companyName)}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{t.howSubtitle}</p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-12 mb-14">
            {/* WhatsApp chat mockup */}
            <motion.div
              className="flex-1 flex justify-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-72">
                <div className="px-4 py-3 flex items-center gap-3" style={{ backgroundColor: secondary }}>
                  <div
                    className="h-9 w-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ backgroundColor: primary }}
                  >
                    {branding.companyName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-semibold leading-tight truncate">{branding.companyName}</p>
                    <p className="text-white/60 text-xs">{theme.botPersonaLabel[lang]}</p>
                  </div>
                  <div className="ml-auto shrink-0 h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                </div>
                <div className="p-3 space-y-2 bg-[#ECE5DD]">
                  {theme.botMessages[lang].slice(0, Math.min(visibleMessages, 3)).map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className="max-w-[88%] rounded-xl px-3 py-1.5 text-xs leading-relaxed shadow-sm"
                        style={{
                          backgroundColor: msg.from === "user" ? primary : "white",
                          color: msg.from === "user" ? "white" : "#222",
                        }}
                      >
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                  {visibleMessages < 1 && (
                    <div className="flex justify-start">
                      <div className="bg-white rounded-xl px-3 py-2 text-xs text-gray-400 flex gap-0.5 shadow-sm">
                        <span className="animate-bounce" style={{ animationDelay: "0ms" }}>·</span>
                        <span className="animate-bounce" style={{ animationDelay: "150ms" }}>·</span>
                        <span className="animate-bounce" style={{ animationDelay: "300ms" }}>·</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
            {/* Steps */}
            <motion.div
              className="flex-1 space-y-5"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {theme.steps[lang].map(({ title, desc }, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm"
                    style={{ backgroundColor: primary }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1" style={{ color: secondary }}>{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20" style={{ backgroundColor: secondary }}>
        <div className="container mx-auto px-6 md:px-12 text-center max-w-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">{t.ctaTitle(branding.companyName)}</h2>
          <p className="text-white/70 mb-10 leading-relaxed">{t.ctaSubtitle}</p>
          <Button
            size="lg"
            className="h-12 px-8 rounded-xl gap-2 font-semibold text-white shadow-lg hover:opacity-90 transition-opacity"
            style={{ backgroundColor: primary }}
            onClick={() => document.getElementById("bot-demo")?.scrollIntoView({ behavior: "smooth" })}
          >
            <MessageCircle className="h-4 w-4" /> {t.ctaButton}
          </Button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-16" style={{ backgroundColor: secondary }}>
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                {branding.logoUrl ? (
                  <img src={branding.logoUrl} alt={branding.companyName} className="h-10 object-contain" />
                ) : (
                  <span className="text-3xl font-extrabold tracking-tight text-white">
                    {branding.companyName.toUpperCase()}
                  </span>
                )}
              </div>
              <p className="text-white/60 max-w-sm mb-6 text-lg">{subtext}</p>
              {branding.phone && (
                <div className="flex items-center gap-2 font-bold text-xl" style={{ color: primary }}>
                  <PhoneCall className="w-6 h-6" />
                  <span>{branding.phone}</span>
                </div>
              )}
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4 text-white">Navigation</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#leistungen" className="text-white/60 hover:text-white transition-colors">
                    {t.navServices}
                  </a>
                </li>
                {branding.websiteUrl && (
                  <li>
                    <a
                      href={branding.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      {t.navWebsite}
                    </a>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4 text-white">Demo Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href={`/demo/${branding.slug}/dashboard`}
                    className="font-semibold flex items-center gap-1 hover:opacity-80 transition-opacity"
                    style={{ color: primary }}
                  >
                    Live-Dashboard <ArrowRight className="w-4 h-4" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/10 text-center text-white/40 text-sm font-medium">
            © {new Date().getFullYear()} {branding.companyName}. Demo by Dosteli System.
          </div>
        </div>
      </footer>

      {/* ── WhatsApp FAB ── */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2, type: "spring", stiffness: 300 }}
          className="h-14 w-14 rounded-full flex items-center justify-center shadow-xl text-white hover:scale-110 transition-transform"
          style={{ backgroundColor: "#25D366" }}
          title="WhatsApp"
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
