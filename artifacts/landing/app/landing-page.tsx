"use client";
import { useState } from "react";
import {
  MessageCircle, Search, Globe, Bot, Calendar, BarChart3,
  ArrowRight, Check, X, Zap, Shield, Star, TrendingUp,
  Users, Clock, Activity, Target, ChevronRight, ChevronLeft, Sparkles,
} from "lucide-react";
import { VideoHero } from "./hero";
import { translations, type Lang, type Translations } from "./i18n/translations";

const FEATURE_ICONS = [Search, MessageCircle, Globe, Bot, Calendar, BarChart3];

export function LandingPage({ lang }: { lang: string }) {
  const safeLang = (["en", "tr", "ar"].includes(lang) ? lang : "en") as Lang;
  const t = translations[safeLang];
  const fontFamily = safeLang === "ar" ? "'Cairo', 'Segoe UI', Arial, sans-serif" : "'Plus Jakarta Sans', sans-serif";

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100" dir={t.dir} style={{ fontFamily }}>
      <main>
        <VideoHero t={t} lang={safeLang} />
        <TrustBar t={t} />
        <Testimonials t={t} />
        <ProblemSolution t={t} />
        <Features t={t} />
        <VideoSlider t={t} />
        <HowItWorks t={t} />
        <Industries t={t} />
        <FAQ t={t} />
        <CTASection t={t} />
      </main>
      <Footer t={t} />

      {/* Floating WhatsApp bubble */}
      <a
        href="https://wa.me/919461049307?text=%5Bgrowthmonk%5D%20"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with GrowthMonk on WhatsApp"
        style={{
          position: "fixed", bottom: "24px", right: "24px", zIndex: 9999,
          width: "56px", height: "56px", borderRadius: "50%",
          backgroundColor: "#25d366",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 24px rgba(37,211,102,0.5)",
          transition: "transform 0.15s, box-shadow 0.15s",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.1)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 6px 32px rgba(37,211,102,0.7)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 24px rgba(37,211,102,0.5)"; }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
      </a>
    </div>
  );
}

function TrustBar({ t }: { t: Translations }) {
  const icons = [Activity, Target, Zap, Clock];
  return (
    <section style={{ backgroundColor: "#030712", position: "relative", overflow: "hidden" }} className="px-6 py-20" aria-label="Key statistics">
      <div style={{ position: "absolute", top: "35%", left: "50%", transform: "translate(-50%,-50%)", width: 900, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(34,197,94,0.18) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
      <div className="relative mx-auto max-w-5xl" style={{ zIndex: 1 }}>
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-green-500">{t.trust.eyebrow}</p>
          <h2 className="text-3xl font-black tracking-tight text-white" style={{ letterSpacing: "-0.5px" }}>{t.trust.heading}</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {t.trust.stats.map((stat, i) => {
            const Icon = icons[i];
            return (
              <div key={i} style={{ position: "relative", overflow: "hidden", borderRadius: 20, background: "rgba(17,24,39,0.5)", border: "1px solid rgba(55,65,81,0.6)", padding: "28px 22px" }}>
                <div style={{ position: "absolute", top: -50, right: -50, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.22) 0%, transparent 70%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent 0%, #22c55e 50%, transparent 100%)", opacity: 0.7 }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                    <span style={{ fontSize: "clamp(40px,5vw,56px)", fontWeight: 900, lineHeight: 1, letterSpacing: "-2px", background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      {stat.value}
                    </span>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#4ade80" }}>
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.60)", fontSize: 13.5, lineHeight: 1.55, fontWeight: 500, margin: 0 }}>{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProblemSolution({ t }: { t: Translations }) {
  return (
    <section style={{ backgroundColor: "#030712", position: "relative", overflow: "hidden" }} className="px-6 py-20" aria-labelledby="problem-heading">
      <div style={{ position: "absolute", top: "40%", right: "15%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.16) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
      <div className="relative mx-auto max-w-5xl" style={{ zIndex: 1 }}>
        <div className="mb-12 text-center">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 100, padding: "5px 16px", marginBottom: 16 }}>
            <span style={{ color: "rgba(248,113,113,0.85)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>{t.ps.eyebrowProblem}</span>
            <ArrowRight className="h-3 w-3 text-green-500" />
            <span style={{ color: "#22c55e", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>{t.ps.eyebrowFix}</span>
          </div>
          <h2 id="problem-heading" className="mb-3 text-4xl font-black text-white" style={{ letterSpacing: "-0.5px" }}>{t.ps.heading}</h2>
          <p style={{ color: "rgba(255,255,255,0.60)", fontSize: 16, maxWidth: 500, margin: "0 auto", lineHeight: 1.65, fontWeight: 500 }}>{t.ps.sub}</p>
        </div>
        <div className="gm-ps-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, position: "relative" }}>
          <div className="gm-vs-badge" style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", zIndex: 10, width: 38, height: 38, borderRadius: "50%", background: "#030712", border: "1px solid rgba(55,65,81,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}>VS</span>
          </div>
          <div style={{ borderRadius: 20, background: "rgba(17,24,39,0.5)", border: "1px solid rgba(55,65,81,0.55)", padding: "32px 26px" }}>
            <p style={{ color: "rgba(248,113,113,0.8)", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>{t.ps.oldTitle}</p>
            <p style={{ color: "rgba(255,255,255,0.30)", fontSize: 13, marginBottom: 24 }}>{t.ps.oldSub}</p>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 14 }}>
              {t.ps.problems.map((p, i) => (
                <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.22)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                    <X className="h-3 w-3" style={{ color: "rgba(239,68,68,0.75)" }} strokeWidth={3} />
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 13.5, lineHeight: 1.5 }}>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ position: "relative", overflow: "hidden", borderRadius: 20, background: "rgba(17,24,39,0.5)", border: "1px solid rgba(34,197,94,0.30)", padding: "32px 26px" }}>
            <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <p style={{ color: "#22c55e", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>{t.ps.newTitle}</p>
              <p style={{ color: "rgba(255,255,255,0.30)", fontSize: 13, marginBottom: 24 }}>{t.ps.newSub}</p>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                {t.ps.solutions.map((s, i) => (
                  <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(34,197,94,0.18)", border: "1px solid rgba(34,197,94,0.38)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                      <Check className="h-3 w-3 text-green-400" strokeWidth={3} />
                    </div>
                    <span style={{ color: "rgba(255,255,255,0.88)", fontSize: 13.5, lineHeight: 1.5, fontWeight: 500 }}>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureBullet({ text, small }: { text: string; small?: boolean }) {
  return (
    <div style={{ display: "flex", gap: 11, alignItems: "flex-start", marginBottom: small ? 9 : 12 }}>
      <div style={{ flexShrink: 0, marginTop: 3, width: 18, height: 18, borderRadius: "50%", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Check className="h-2.5 w-2.5 text-green-400" strokeWidth={2.5} />
      </div>
      <span style={{ color: "rgba(255,255,255,0.62)", fontSize: small ? 13 : 15, lineHeight: 1.6, fontWeight: 500 }}>{text}</span>
    </div>
  );
}

function Features({ t }: { t: Translations }) {
  return (
    <section id="features" style={{ backgroundColor: "#030712", position: "relative", overflow: "hidden" }} className="py-24" aria-labelledby="features-heading">
      <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: 1000, height: 600, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(34,197,94,0.10) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
      <div className="relative mx-auto max-w-5xl px-6" style={{ zIndex: 1 }}>
        <div className="mb-20 text-center">
          <p style={{ color: "#22c55e", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>{t.features.eyebrow}</p>
          <h2 id="features-heading" style={{ color: "white", fontWeight: 900, fontSize: "clamp(28px,4vw,44px)", letterSpacing: "-1px", lineHeight: 1.1, margin: "0 0 16px" }}>{t.features.heading}</h2>
          <p style={{ color: "rgba(255,255,255,0.50)", fontSize: 17, maxWidth: 520, margin: "0 auto", lineHeight: 1.65, fontWeight: 500 }}>{t.features.sub}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 96 }}>
          {t.features.list.map((f, i) => {
            const Icon = FEATURE_ICONS[i];
            const isReversed = i % 2 === 1;
            const isSmall = false;
            return (
              <div key={i} className="gm-feature-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", direction: isReversed ? "rtl" : "ltr" }}>
                <div className="gm-feature-img" style={{ direction: "ltr", position: "relative", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(55,65,81,0.55)", boxShadow: "0 0 80px rgba(34,197,94,0.07), 0 32px 64px rgba(0,0,0,0.45)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={["/features/ai-search.png","/features/whatsapp-capture.png","/features/multilingual.png","/features/qualification.png","/features/booking.png","/features/analytics.png"][i]} alt={f.tag} style={{ width: "100%", display: "block" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, #22c55e 40%, #4ade80 60%, transparent)", opacity: 0.5 }} />
                </div>
                <div className="gm-feature-text" style={{ direction: "ltr" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(34,197,94,0.10)", border: "1px solid rgba(34,197,94,0.22)", borderRadius: 100, padding: "5px 14px", marginBottom: 18 }}>
                    <Icon className="h-3.5 w-3.5 text-green-400" />
                    <span style={{ color: "#22c55e", fontSize: 11, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" }}>{f.tag}</span>
                  </div>
                  <h3 style={{ color: "white", fontWeight: 800, fontSize: "clamp(20px,2.2vw,28px)", letterSpacing: "-0.5px", lineHeight: 1.2, margin: "0 0 22px" }}>{f.title}</h3>
                  <div>{f.bullets.map((b, bi) => <FeatureBullet key={bi} text={b} small={isSmall} />)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function VideoSlider({ t }: { t: Translations }) {
  const [current, setCurrent] = useState(0);
  const slides = [
    { id: "abf566f8383340358b39003375ef166f", title: t.video.slideTitle, description: t.video.slideDesc },
    { id: "e0a4ef9ca97b4472ac93c2404dfad0c9", title: t.video.slide2Title, description: t.video.slide2Desc },
  ];
  const slide = slides[current];
  return (
    <section className="px-6 py-24" style={{ backgroundColor: "#030712" }}>
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-green-500">{t.video.eyebrow}</span>
        </div>
        <h2 className="mb-4 text-center text-4xl font-extrabold text-white">{t.video.heading}</h2>
        <p className="mx-auto mb-10 max-w-xl text-center text-gray-400">{t.video.sub}</p>

        {/* Active video player */}
        <div className="rounded-2xl overflow-hidden mb-5" style={{ border: "1px solid rgba(34,197,94,0.25)", background: "linear-gradient(135deg, rgba(34,197,94,0.06) 0%, rgba(3,7,18,0) 60%)" }}>
          <div style={{ position: "relative", paddingBottom: "52.6%", height: 0 }}>
            <iframe
              key={slide.id}
              src={`https://www.loom.com/embed/${slide.id}`}
              frameBorder="0"
              allowFullScreen
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", borderRadius: "16px 16px 0 0" }}
              title={slide.title}
            />
          </div>
          <div className="px-5 py-4">
            <p className="font-bold text-white text-base">{slide.title}</p>
            <p className="text-sm text-gray-400 mt-0.5">{slide.description}</p>
          </div>
        </div>

        {/* Thumbnail playlist */}
        <div className="grid grid-cols-2 gap-3">
          {slides.map((s, i) => {
            const isActive = i === current;
            return (
              <button
                key={s.id}
                onClick={() => setCurrent(i)}
                className="text-left rounded-xl overflow-hidden transition-all duration-200 focus:outline-none flex items-center gap-3 px-4 py-3"
                style={{
                  border: isActive ? "2px solid #22c55e" : "2px solid rgba(255,255,255,0.08)",
                  background: isActive ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.03)",
                }}
                aria-label={`Watch: ${s.title}`}
              >
                {/* Play icon */}
                <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full" style={{ background: isActive ? "#22c55e" : "rgba(255,255,255,0.12)" }}>
                  <svg viewBox="0 0 16 16" fill="white" className="h-4 w-4 translate-x-0.5">
                    <path d="M4 2.5l9 5.5-9 5.5V2.5z" />
                  </svg>
                </div>
                {/* Text */}
                <div className="min-w-0">
                  {isActive && (
                    <span className="text-[10px] font-bold uppercase tracking-wider mb-0.5 block" style={{ color: "#22c55e" }}>Now playing</span>
                  )}
                  <p className="text-sm font-semibold leading-snug line-clamp-2" style={{ color: isActive ? "white" : "rgba(255,255,255,0.55)" }}>{s.title}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HowItWorks({ t }: { t: Translations }) {
  return (
    <section id="how-it-works" className="px-6 py-24" aria-labelledby="how-heading">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 text-center"><span className="text-sm font-semibold uppercase tracking-widest text-green-500">{t.how.eyebrow}</span></div>
        <h2 id="how-heading" className="mb-4 text-center text-4xl font-extrabold text-white">{t.how.heading}</h2>
        <p className="mx-auto mb-16 max-w-xl text-center text-gray-400">{t.how.sub}</p>
        <div className="relative">
          <div className="absolute left-8 top-0 hidden h-full w-px md:block" style={{ background: "linear-gradient(to bottom, transparent, rgba(34,197,94,0.3), transparent)" }} />
          <div className="space-y-12">
            {t.how.steps.map((step, i) => (
              <div key={i} className="flex gap-8">
                <div className="relative flex-shrink-0">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-green-500/30 bg-green-500/10 text-xl font-black text-green-400">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
                <div className="pb-4 pt-2">
                  <h3 className="mb-2 text-xl font-bold text-white">{step.title}</h3>
                  <p className="mb-3 text-gray-400">{step.description}</p>
                  <p className="text-sm font-medium text-green-500/80">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials({ t }: { t: Translations }) {
  const testimonials = [
    { quote: "We were tired of trying to adapt generic tools to the realities of outpatient care. GrowthMonk helped us launch a healthcare-focused WhatsApp CRM with AI documentation, workforce measurement, and efficiency tracking built around how our team actually works. Even at the pilot stage, it shows strong potential to reduce admin effort, improve operational visibility, and support our broader AI transformation. We're excited to expand this further with their AI Growth Engine.", company: "Dosteli", logo: "/images/logo-dosteli.png", logoBg: "#ffffff" },
    { quote: "As a healthcare brand, we needed a clearer way to understand why we were not being surfaced or cited consistently in AI search. GrowthMonk's healthcare-focused Growth Engine gave us a practical roadmap across website structure, schema, and discoverability, with recommendations grounded in Google and Schema.org guidance. It helped us move from guesswork to clear, actionable fixes our team could implement.", company: "Valeo Health", logo: "/images/logo-valeo-health.png", logoBg: "#F5A623" },
  ];
  return (
    <section style={{ backgroundColor: "#030712", position: "relative", overflow: "hidden" }} className="px-6 py-20" aria-labelledby="testimonials-heading">
      <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(34,197,94,0.10) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
      <div className="relative mx-auto max-w-5xl" style={{ zIndex: 1 }}>
        <div className="mb-12 text-center">
          <p style={{ color: "#22c55e", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>{t.testimonials.eyebrow}</p>
          <h2 id="testimonials-heading" style={{ color: "white", fontWeight: 900, fontSize: "clamp(28px,4vw,44px)", letterSpacing: "-1px", lineHeight: 1.1, margin: 0 }}>{t.testimonials.heading}</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {testimonials.map((te) => (
            <div key={te.company} style={{ position: "relative", borderRadius: 20, background: "rgba(17,24,39,0.6)", border: "1px solid rgba(55,65,81,0.6)", padding: "36px 32px", display: "flex", flexDirection: "column", gap: 24, overflow: "hidden" }}>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent 0%, #22c55e 50%, transparent 100%)", opacity: 0.6 }} />
              <div style={{ fontSize: 72, lineHeight: 1, color: "rgba(34,197,94,0.18)", fontFamily: "Georgia, serif", position: "absolute", top: 16, right: 28, userSelect: "none" }}>&ldquo;</div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 64, height: 40, borderRadius: 10, background: te.logoBg, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0, padding: "4px 8px", boxSizing: "border-box" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={te.logo} alt={te.company + " logo"} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
                </div>
                <div>
                  <div style={{ color: "white", fontWeight: 700, fontSize: 15 }}>{te.company}</div>
                </div>
              </div>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15, lineHeight: 1.75, fontWeight: 500, margin: 0, position: "relative", zIndex: 1 }}>&ldquo;{te.quote}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Industries({ t }: { t: Translations }) {
  return (
    <section id="industries" className="px-6 py-24" aria-labelledby="industries-heading">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 text-center"><span className="text-sm font-semibold uppercase tracking-widest text-green-500">{t.industries.eyebrow}</span></div>
        <h2 id="industries-heading" className="mb-4 text-center text-4xl font-extrabold text-white">{t.industries.heading}</h2>
        <p className="mx-auto mb-16 max-w-xl text-center text-gray-400">{t.industries.sub}</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.industries.list.map((item) => (
            <div key={item.name} className="rounded-xl border border-gray-800 bg-gray-900/30 p-5 transition-all hover:border-green-500/20 hover:bg-gray-900/50">
              <div className="mb-3 text-3xl">{item.icon}</div>
              <h3 className="mb-1 font-semibold text-white">{item.name}</h3>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ({ t }: { t: Translations }) {
  return (
    <section id="faq" className="px-6 py-24" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 text-center"><span className="text-sm font-semibold uppercase tracking-widest text-green-500">{t.faq.eyebrow}</span></div>
        <h2 id="faq-heading" className="mb-4 text-center text-4xl font-extrabold text-white">{t.faq.heading}</h2>
        <p className="mx-auto mb-16 max-w-lg text-center text-gray-400">{t.faq.sub}</p>
        <dl className="space-y-4">
          {t.faq.items.map((faq) => (
            <div key={faq.q} className="rounded-xl border border-gray-800 bg-gray-900/40 p-6">
              <dt className="mb-3 font-semibold text-white">{faq.q}</dt>
              <dd className="text-sm leading-relaxed text-gray-400">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function CTASection({ t }: { t: Translations }) {
  return (
    <section id="cta" className="px-6 py-24" aria-labelledby="cta-heading">
      <div className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-3xl p-12 text-center" style={{ background: "linear-gradient(135deg, #052e16 0%, #14532d 50%, #052e16 100%)", border: "1px solid rgba(34,197,94,0.3)" }}>
          <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(34,197,94,0.12), transparent)" }} />
          <div className="relative">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-500/20 px-4 py-1.5 text-sm font-medium text-green-300">
              <Zap className="h-3.5 w-3.5" />{t.cta.eyebrow}
            </div>
            <h2 id="cta-heading" className="mb-4 text-4xl font-extrabold text-white md:text-5xl">{t.cta.heading}</h2>
            <p className="mx-auto mb-8 max-w-xl text-lg text-green-100/70">{t.cta.sub}</p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a href="mailto:hello@growthmonk.ai?subject=GrowthMonk Demo Request" className="inline-flex items-center gap-2 rounded-full bg-green-500 px-8 py-3.5 font-semibold text-white shadow-lg shadow-green-900/50 transition-all hover:bg-green-400">
                {t.cta.button}<ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {t.cta.badges.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-green-300/70">
                  <Check className="h-3.5 w-3.5 text-green-400" />{item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ t }: { t: Translations }) {
  return (
    <footer className="border-t border-gray-800/60 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col gap-1" style={{ direction: "ltr" }}>
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-500">
                <TrendingUp className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-bold text-white">GrowthMonk</span>
            </div>
            <span className="text-xs text-gray-500">Operated by Dreamport Technology Private Limited</span>
          </div>
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
              <li><a href="#features" className="transition-colors hover:text-gray-300">{t.footer.features}</a></li>
              <li><a href="#how-it-works" className="transition-colors hover:text-gray-300">{t.footer.howItWorks}</a></li>
              <li><a href="#industries" className="transition-colors hover:text-gray-300">{t.footer.industries}</a></li>
              <li><a href="#faq" className="transition-colors hover:text-gray-300">{t.footer.faq}</a></li>
              <li><a href="mailto:hello@growthmonk.ai" className="transition-colors hover:text-gray-300">{t.footer.contact}</a></li>
              <li><a href="/privacy-policy" className="transition-colors hover:text-gray-300">Privacy</a></li>
              <li><a href="/terms" className="transition-colors hover:text-gray-300">Terms</a></li>
              <li><a href="/data-deletion" className="transition-colors hover:text-gray-300">Data Deletion</a></li>
            </ul>
          </nav>
          <p className="text-sm text-gray-600">© {new Date().getFullYear()} Dreamport Technology Private Limited</p>
        </div>
      </div>
    </footer>
  );
}
