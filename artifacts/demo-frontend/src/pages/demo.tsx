import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DemoNav } from "@/components/layout/demo-nav";
import { getDemoT } from "@/lib/demo-i18n";
import {
  MessageCircle,
  CheckCircle2,
  Heart,
  Users,
  Loader2,
  MapPin,
  Globe,
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
        applyTheme(data);
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

  const primary = branding?.primaryColor ?? "#A8C334";
  const secondary = branding?.secondaryColor ?? "#1a3a1a";
  const t = getDemoT(branding?.demoLanguage);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !branding) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-2xl font-bold text-muted-foreground">{t.notFound.title}</p>
        <p className="text-muted-foreground">{t.notFound.desc}</p>
        <Button variant="outline" onClick={() => window.history.back()}>{t.notFound.back}</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DemoNav branding={branding} />

      <section
        className="relative w-full overflow-hidden py-20 lg:py-28"
        style={{ backgroundColor: primary }}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div
              className="flex-1 max-w-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30">
                {t.badge}
              </Badge>
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white drop-shadow-sm">
                {branding.heroHeadline || branding.tagline || `${branding.companyName} — KI-WhatsApp-Bot`}
              </h1>
              <p className="text-xl font-medium mb-10 text-white/90 max-w-lg">
                {branding.tagline && branding.heroHeadline
                  ? branding.tagline
                  : t.defaultSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="text-lg h-14 px-8 rounded-full shadow-lg gap-2"
                  style={{ backgroundColor: secondary, color: "white" }}
                  onClick={() => document.getElementById("bot-demo")?.scrollIntoView({ behavior: "smooth" })}
                >
                  <MessageCircle className="h-5 w-5" /> {t.ctaPrimary}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white/10 text-lg h-14 px-8 rounded-full"
                >
                  {t.ctaSecondary}
                </Button>
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                {t.features.map((label, i) => {
                  const Icon = [CheckCircle2, Heart, Users][i] ?? CheckCircle2;
                  return (
                    <div key={label} className="flex items-center gap-2 bg-black/10 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/20">
                      <Icon className="h-4 w-4 text-white" />
                      <span className="text-white text-sm font-medium">{label}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              id="bot-demo"
              className="w-full max-w-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative mx-auto" style={{ width: 300 }}>
                <div className="absolute inset-0 rounded-[40px] bg-black/40 blur-2xl scale-90 translate-y-4" />
                <div className="relative bg-[#111] rounded-[40px] p-3 shadow-2xl border border-white/10">
                  <div
                    className="rounded-[30px] overflow-hidden"
                    style={{ background: "#ECE5DD", minHeight: 480 }}
                  >
                    <div
                      className="px-4 py-3 flex items-center gap-3"
                      style={{ backgroundColor: secondary }}
                    >
                      <div
                        className="h-9 w-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: primary }}
                      >
                        {branding.companyName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold leading-tight">{branding.companyName}</p>
                        <p className="text-white/60 text-xs">{t.botStatus}</p>
                      </div>
                    </div>

                    <div className="p-3 space-y-2 min-h-[360px]">
                      {t.botMessages.slice(0, visibleMessages).map((msg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className="max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-sm"
                            style={{
                              backgroundColor: msg.from === "user" ? primary : "white",
                              color: msg.from === "user" ? "white" : "#333",
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
                          <div className="bg-white rounded-2xl px-3 py-2 text-xs text-muted-foreground flex gap-1">
                            <span className="animate-bounce" style={{ animationDelay: "0ms" }}>·</span>
                            <span className="animate-bounce" style={{ animationDelay: "150ms" }}>·</span>
                            <span className="animate-bounce" style={{ animationDelay: "300ms" }}>·</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {t.howTitle(branding.companyName)}
          </h2>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
            {t.howSubtitle}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.steps.map(({ step, title, desc }: { step?: string; title: string; desc: string }, i) => (
              <div key={i} className="rounded-xl border border-border p-6 text-left">
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4"
                  style={{ backgroundColor: primary }}
                >
                  {i + 1}
                </div>
                <h3 className="font-bold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: secondary }}>
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t.ctaTitle(branding.companyName)}
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            {t.ctaSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg h-14 px-8 rounded-full gap-2"
              style={{ backgroundColor: primary, color: "white" }}
            >
              <MessageCircle className="h-5 w-5" /> {t.ctaButton}
            </Button>
            {branding.websiteUrl && (
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10 text-lg h-14 px-8 rounded-full gap-2"
                onClick={() => window.open(branding.websiteUrl!, "_blank")}
              >
                <Globe className="h-5 w-5" /> {new URL(branding.websiteUrl).hostname}
              </Button>
            )}
          </div>
          {branding.city && (
            <p className="text-white/50 mt-6 text-sm flex items-center justify-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {branding.city}
            </p>
          )}
        </div>
      </section>

      <div className="fixed bottom-6 right-6 z-50">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2, type: "spring" }}
        >
          <button
            className="h-14 w-14 rounded-full flex items-center justify-center shadow-xl text-white"
            style={{ backgroundColor: "#25D366" }}
          >
            <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </button>
        </motion.div>
      </div>
    </div>
  );
}

function applyTheme(branding: BrandingConfig) {
  const root = document.documentElement;
  if (branding.primaryColor) root.style.setProperty("--branded-primary", branding.primaryColor);
  if (branding.secondaryColor) root.style.setProperty("--branded-secondary", branding.secondaryColor);
}
