import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DemoNav } from "@/components/layout/demo-nav";
import { getDemoT } from "@/lib/demo-i18n";
import {
  MessageCircle,
  CheckCircle2,
  Clock,
  Zap,
  Globe,
  MapPin,
  Loader2,
  ArrowRight,
} from "lucide-react";

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
}

export default function DemoPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [branding, setBranding] = useState<BrandingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleMessages, setVisibleMessages] = useState(0);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/clients/${slug}/branding`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((data: BrandingConfig) => {
        setBranding(data);
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

  const primary = branding?.primaryColor || "#A8C334";
  const secondary = branding?.secondaryColor || "#1a3a1a";
  const t = getDemoT(branding?.demoLanguage);

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

  return (
    <div className="min-h-screen bg-white">
      <DemoNav branding={branding} />

      {/* ── HERO ── */}
      <section className="relative w-full overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-72px)]">

          {/* Left: text content — always light bg, always dark text */}
          <div className="flex-1 flex flex-col justify-center px-8 md:px-16 py-16 lg:py-24 bg-white relative">
            {/* Accent line */}
            <div className="absolute left-0 top-0 bottom-0 w-1 hidden lg:block" style={{ backgroundColor: primary }} />

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="max-w-xl"
            >
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full mb-6"
                style={{ backgroundColor: primary + "18", color: primary }}
              >
                <Zap className="h-3 w-3" />
                {t.badge}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-gray-900 mb-6">
                {headline}
              </h1>

              <p className="text-lg text-gray-500 mb-10 leading-relaxed">
                {branding.tagline && branding.heroHeadline ? branding.tagline : t.defaultSubtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-12">
                <Button
                  size="lg"
                  className="h-12 px-7 rounded-xl gap-2 text-white font-semibold shadow-md hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: primary }}
                  onClick={() => document.getElementById("bot-demo")?.scrollIntoView({ behavior: "smooth" })}
                >
                  <MessageCircle className="h-4 w-4" /> {t.ctaPrimary}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-7 rounded-xl gap-2 font-semibold border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  {t.ctaSecondary} <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-3">
                {[
                  { Icon: CheckCircle2, label: t.features[0] },
                  { Icon: Clock, label: t.features[1] },
                  { Icon: Zap, label: t.features[2] },
                ].map(({ Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg">
                    <Icon className="h-3.5 w-3.5" style={{ color: primary }} />
                    {label}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: phone mockup on brand-colored background */}
          <div
            id="bot-demo"
            className="lg:w-[45%] flex items-center justify-center px-8 py-16"
            style={{ backgroundColor: primary }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative"
              style={{ width: 280 }}
            >
              {/* Glow */}
              <div className="absolute inset-0 rounded-[40px] bg-black/30 blur-3xl scale-90 translate-y-6" />

              {/* Phone shell */}
              <div className="relative bg-[#111] rounded-[40px] p-2.5 shadow-2xl border border-white/10">
                <div className="rounded-[32px] overflow-hidden" style={{ background: "#ECE5DD", minHeight: 500 }}>
                  {/* WhatsApp header */}
                  <div className="px-4 py-3 flex items-center gap-3" style={{ backgroundColor: secondary }}>
                    <div
                      className="h-9 w-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ backgroundColor: primary }}
                    >
                      {branding.companyName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-semibold leading-tight truncate">{branding.companyName}</p>
                      <p className="text-white/60 text-xs">{t.botStatus}</p>
                    </div>
                    <div className="ml-auto shrink-0">
                      <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="p-3 space-y-2 min-h-[400px]">
                    {t.botMessages.slice(0, visibleMessages).map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className="max-w-[82%] rounded-2xl px-3 py-2 text-[11px] leading-relaxed shadow-sm"
                          style={{
                            backgroundColor: msg.from === "user" ? primary : "white",
                            color: msg.from === "user" ? "white" : "#222",
                            borderBottomRightRadius: msg.from === "user" ? 4 : 16,
                            borderBottomLeftRadius: msg.from === "bot" ? 4 : 16,
                          }}
                        >
                          {msg.text}
                        </div>
                      </motion.div>
                    ))}
                    {visibleMessages < t.botMessages.length && (
                      <div className="flex justify-start">
                        <div className="bg-white rounded-2xl px-3 py-2 text-xs text-gray-400 flex gap-1 shadow-sm">
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

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12 max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {t.howTitle(branding.companyName)}
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">{t.howSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.steps.map(({ title, desc }, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div
                  className="h-11 w-11 rounded-xl flex items-center justify-center text-white font-bold text-lg mb-5 shadow-sm"
                  style={{ backgroundColor: primary }}
                >
                  {i + 1}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20" style={{ backgroundColor: secondary || "#111" }}>
        <div className="container mx-auto px-6 md:px-12 text-center max-w-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t.ctaTitle(branding.companyName)}
          </h2>
          <p className="text-white/70 mb-10 leading-relaxed">{t.ctaSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              className="h-12 px-8 rounded-xl gap-2 font-semibold text-white shadow-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: primary }}
            >
              <MessageCircle className="h-4 w-4" /> {t.ctaButton}
            </Button>
            {branding.websiteUrl && (
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 rounded-xl gap-2 border-white/20 text-white hover:bg-white/10 font-semibold"
                onClick={() => window.open(branding.websiteUrl!, "_blank")}
              >
                <Globe className="h-4 w-4" />
                {(() => { try { return new URL(branding.websiteUrl!).hostname; } catch { return branding.websiteUrl; } })()}
              </Button>
            )}
          </div>
          {branding.city && (
            <p className="text-white/40 mt-8 text-sm flex items-center justify-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> {branding.city}
            </p>
          )}
        </div>
      </section>

      {/* ── WhatsApp FAB ── */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2.5, type: "spring", stiffness: 300 }}
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
