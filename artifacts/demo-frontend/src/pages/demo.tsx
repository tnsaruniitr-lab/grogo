import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DemoNav } from "@/components/layout/demo-nav";
import { getDemoT } from "@/lib/demo-i18n";
import { getIndustryTheme, getLang, PRIMARY_VERTICALS, INDUSTRY_VIDEO_MAP } from "@/lib/industry-themes";
import patternImg from "@/assets/pattern.png";
import heroImg from "@/assets/hero-person.png";
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

const ICON_MAP: Record<string, LucideIcon> = {
  Home: HomeIcon, Heart, Users, Sparkles, Gem, Star,
  Stethoscope, Activity, Smile, Shield, Leaf, Wind,
};

function resolveIcons(names: [string, string, string]): [LucideIcon, LucideIcon, LucideIcon] {
  return names.map((n) => ICON_MAP[n] ?? Star) as [LucideIcon, LucideIcon, LucideIcon];
}

interface BrandingConfig {
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

const CARE_INDUSTRIES = new Set(["care", "medical", "dental", "fitness"]);

function resolveColors(branding: BrandingConfig): { primary: string; secondary: string } {
  if (branding.primaryColor && branding.secondaryColor) {
    return { primary: branding.primaryColor, secondary: branding.secondaryColor };
  }
  const industry = branding.industry ?? "other";
  const FALLBACKS: Record<string, { primary: string; secondary: string }> = {
    care:        { primary: "#4A7C59", secondary: "#1B2B3A" },
    aesthetics:  { primary: "#C9A84C", secondary: "#1A1A2E" },
    dental:      { primary: "#2E86AB", secondary: "#2D3047" },
    medical:     { primary: "#1B4F8A", secondary: "#0D1B2A" },
    legal:       { primary: "#1C2951", secondary: "#0B0E1A" },
    finance:     { primary: "#0D5C40", secondary: "#071C13" },
    retail:      { primary: "#7C3AED", secondary: "#1E1B4B" },
    hospitality: { primary: "#C1694F", secondary: "#2C1A14" },
    education:   { primary: "#2563EB", secondary: "#1E1B4B" },
    fitness:     { primary: "#F97316", secondary: "#1C0E05" },
    other:       { primary: "#374151", secondary: "#111827" },
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
        .then((r) => r.ok ? r.json() as Promise<ClientContent> : null)
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

  const { primary, secondary } = branding
    ? resolveColors(branding)
    : { primary: "#374151", secondary: "#111827" };
  const t = getDemoT(branding?.demoLanguage);
  const theme = getIndustryTheme(branding?.industry);
  const lang = getLang(branding?.demoLanguage);
  const themeIcons = resolveIcons(theme.serviceIconNames);
  const isPrimary = PRIMARY_VERTICALS.has(branding?.industry ?? "");
  const videoSrc = branding ? (INDUSTRY_VIDEO_MAP[branding.industry ?? ""] ?? null) : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !branding) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4 bg-background">
        <p className="text-2xl font-bold text-foreground">{t.notFound.title}</p>
        <p className="text-muted-foreground">{t.notFound.desc}</p>
        <Button variant="outline" onClick={() => window.history.back()}>{t.notFound.back}</Button>
      </div>
    );
  }

  const headline = branding.heroHeadline || branding.tagline || branding.companyName;
  const subtext = branding.tagline && branding.heroHeadline ? branding.tagline : t.defaultSubtitle;
  const initials = branding.companyName.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <DemoNav branding={branding} />

      {/* ── HERO ── */}
      <section className="relative w-full overflow-hidden pt-12 lg:pt-0 lg:h-[calc(100vh-80px)] flex items-center" style={{ backgroundColor: primary }}>
        {/* Video background — shown when industry has a mapped video */}
        {videoSrc && (
          <video
            autoPlay muted loop playsInline preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "brightness(0.58) saturate(1.1)" }}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}
        {/* Brand-color gradient overlay: strong on text side, fades right so video shows through */}
        {videoSrc && (
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(105deg, ${primary}DD 0%, ${primary}99 45%, ${primary}33 100%)` }}
          />
        )}
        <div
          className={`absolute inset-0 z-0 pointer-events-none mix-blend-multiply ${videoSrc ? "opacity-5" : "opacity-20"}`}
          style={{ backgroundImage: `url(${patternImg})`, backgroundSize: "400px" }}
        />

        <div className="container mx-auto px-4 md:px-8 relative z-10 h-full">
          <div className="flex flex-col lg:flex-row items-center justify-between h-full gap-12">

            {/* Left: text */}
            <motion.div
              className="flex-1 text-white max-w-2xl py-12 lg:py-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white drop-shadow-sm">
                {headline}
              </h1>
              <p className="text-xl md:text-2xl font-medium mb-10 text-white/90 max-w-lg">
                {subtext}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="text-lg h-14 px-8 rounded-full shadow-lg font-semibold hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: secondary, color: "white" }}
                  onClick={() => document.getElementById("bot-demo")?.scrollIntoView({ behavior: "smooth" })}
                >
                  <MessageCircle className="h-5 w-5 mr-2" /> {t.ctaPrimary}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white/10 text-lg h-14 px-8 rounded-full"
                >
                  {t.ctaSecondary} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <div className="mt-16 flex items-center gap-4 bg-black/10 p-4 rounded-2xl backdrop-blur-sm max-w-md border border-white/20">
                <div className="flex -space-x-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-full border-2 flex items-center justify-center text-white font-bold overflow-hidden"
                      style={{ borderColor: primary, backgroundColor: secondary }}
                    >
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${slug}${i}&backgroundColor=${secondary.replace("#", "")}`}
                        alt="Team member"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-bold text-lg text-white">{t.teamLabel}</p>
                  <p className="text-sm text-white/80">{t.teamSub}</p>
                </div>
              </div>
            </motion.div>

            {/* Right: hero image + floating bot card */}
            <motion.div
              className="flex-1 relative h-full w-full flex items-end justify-center lg:justify-end"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative w-full max-w-lg h-[500px] lg:h-[90%] mt-auto flex items-end">
                {branding.heroImageUrl ? (
                  <img
                    src={branding.heroImageUrl}
                    alt={branding.companyName}
                    className="w-full h-full object-cover rounded-3xl shadow-2xl z-10"
                  />
                ) : CARE_INDUSTRIES.has(branding.industry ?? "other") || !branding.industry ? (
                  <img
                    src={heroImg}
                    alt="Care professional"
                    className="w-full h-full object-contain object-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-10"
                  />
                ) : (
                  /* Non-care industry with no OG image — show decorative brand card */
                  <div className="w-full h-full flex flex-col items-center justify-center z-10 gap-6 pb-16">
                    {branding.logoUrl ? (
                      <img
                        src={branding.logoUrl}
                        alt={branding.companyName}
                        className="max-h-32 max-w-[280px] object-contain drop-shadow-lg"
                      />
                    ) : (
                      <div
                        className="w-32 h-32 rounded-3xl flex items-center justify-center text-white text-5xl font-extrabold shadow-2xl"
                        style={{ backgroundColor: secondary }}
                      >
                        {initials}
                      </div>
                    )}
                    <div className="text-center text-white/80 text-lg font-medium max-w-xs">
                      {branding.city && <p className="text-white/60 text-sm mt-1">📍 {branding.city}</p>}
                    </div>
                  </div>
                )}

                {/* Floating bot preview card */}
                <div
                  id="bot-demo"
                  className="absolute bottom-12 -left-6 lg:left-0 bg-white rounded-2xl shadow-xl z-20 animate-in fade-in zoom-in slide-in-from-bottom-4 duration-700 delay-500 overflow-hidden"
                  style={{ width: 200 }}
                >
                  <div className="px-3 py-2 flex items-center gap-2" style={{ backgroundColor: secondary }}>
                    <div className="h-7 w-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ backgroundColor: primary }}>
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-[11px] font-semibold leading-tight truncate">{branding.companyName}</p>
                      <p className="text-white/60 text-[10px]">{theme.botPersonaLabel[lang]}</p>
                    </div>
                    <div className="ml-auto shrink-0 h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                  </div>
                  <div className="p-2 space-y-1.5 bg-[#ECE5DD]">
                    {theme.botMessages[lang].slice(0, Math.min(visibleMessages, 2)).map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className="max-w-[90%] rounded-xl px-2 py-1 text-[10px] leading-relaxed shadow-sm"
                          style={{
                            backgroundColor: msg.from === "user" ? primary : "white",
                            color: msg.from === "user" ? "white" : "#222",
                          }}
                        >
                          {msg.text}
                        </div>
                      </motion.div>
                    ))}
                    {visibleMessages < 2 && (
                      <div className="flex justify-start">
                        <div className="bg-white rounded-xl px-2 py-1 text-[10px] text-gray-400 flex gap-0.5 shadow-sm">
                          <span className="animate-bounce" style={{ animationDelay: "0ms" }}>·</span>
                          <span className="animate-bounce" style={{ animationDelay: "150ms" }}>·</span>
                          <span className="animate-bounce" style={{ animationDelay: "300ms" }}>·</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── TRUST BAR — primary verticals only ── */}
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

      <section id="leistungen" className="py-24 bg-background">
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
                  isReal: true,
                  i,
                }))
              : theme.servicesFallback[lang].map(({ title, desc }, i) => ({ title, desc, isReal: false, i }))
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
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors"
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
      <section className="py-24 overflow-hidden" style={{ backgroundColor: "hsl(var(--muted))" }}>
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
      <section className="py-20 bg-background">
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
          <div className="flex justify-center gap-12 mt-10">
            {theme.stats[lang].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="text-4xl font-extrabold" style={{ color: primary }}>{num}</div>
                <div className="text-sm font-medium text-muted-foreground mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS (bot) ── */}
      <section className="py-20" style={{ backgroundColor: "hsl(var(--muted))" }}>
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3" style={{ color: secondary }}>
              {t.howTitle(branding.companyName)}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{t.howSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {theme.steps[lang].map(({ title, desc }, i) => (
              <div key={i} className="bg-card rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow">
                <div
                  className="h-11 w-11 rounded-xl flex items-center justify-center text-white font-bold text-lg mb-5 shadow-sm"
                  style={{ backgroundColor: primary }}
                >
                  {i + 1}
                </div>
                <h3 className="font-bold mb-2" style={{ color: secondary }}>{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
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
                {["#leistungen"].map((href, i) => (
                  <li key={i}>
                    <a href={href} className="text-white/60 hover:text-white transition-colors">
                      {t.navServices}
                    </a>
                  </li>
                ))}
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
