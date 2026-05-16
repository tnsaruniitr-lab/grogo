import {
  MessageCircle,
  Search,
  Globe,
  Bot,
  Calendar,
  BarChart3,
  ArrowRight,
  Check,
  X,
  Zap,
  Shield,
  Star,
  TrendingUp,
  Users,
  Clock,
  Activity,
  Target,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { VideoHero } from "./hero";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-gray-100">
      <main>
        <VideoHero />
        <TrustBar />
        <ProblemSolution />
        <Features />
        <HowItWorks />
        <Industries />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

function TrustBar() {
  const stats = [
    { value: "2-4×", label: "More AI search appearances for your business", icon: Activity },
    { value: "3×",   label: "More leads discovered and captured",            icon: Target },
    { value: "80%",  label: "Of leads qualified automatically by AI",        icon: Zap },
    { value: "24/7", label: "AI follow-up, never misses a lead",             icon: Clock },
  ];

  return (
    <section style={{ backgroundColor: "#030712", position: "relative", overflow: "hidden" }}
      className="px-6 py-20" aria-label="Key statistics">
      <div style={{ position: "absolute", top: "35%", left: "50%", transform: "translate(-50%,-50%)", width: 900, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(34,197,94,0.18) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
      <div className="relative mx-auto max-w-5xl" style={{ zIndex: 1 }}>
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-green-500">
            What GrowthMonk delivers
          </p>
          <h2 className="text-3xl font-black tracking-tight text-white" style={{ letterSpacing: "-0.5px" }}>
            Results healthcare businesses can measure
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.value} style={{ position: "relative", overflow: "hidden", borderRadius: 20, background: "rgba(17,24,39,0.5)", border: "1px solid rgba(55,65,81,0.6)", padding: "28px 22px" }}>
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
                  <p style={{ color: "rgba(255,255,255,0.60)", fontSize: 13.5, lineHeight: 1.55, fontWeight: 500, margin: 0 }}>
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProblemSolution() {
  const problems = [
    "Invisible in AI search (ChatGPT, Perplexity, AI Overviews)",
    "Leads from WhatsApp & Instagram go unanswered for hours",
    "Staff spend hours qualifying the same basic enquiries",
    "Language barriers losing you multilingual patients",
    "Leads captured but never followed up on consistently",
  ];
  const solutions = [
    "Optimised for AI search engines — patients find you first",
    "AI responds to every message in under 2 minutes, 24/7",
    "AI qualifies, filters, and routes leads automatically",
    "Conversations in English, German, Turkish, Arabic and more",
    "AI books appointments and callbacks without human input",
  ];

  return (
    <section style={{ backgroundColor: "#030712", position: "relative", overflow: "hidden" }}
      className="px-6 py-20" aria-labelledby="problem-heading">
      <div style={{ position: "absolute", top: "40%", right: "15%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.16) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />

      <div className="relative mx-auto max-w-5xl" style={{ zIndex: 1 }}>
        {/* Header */}
        <div className="mb-12 text-center">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 100, padding: "5px 16px", marginBottom: 16 }}>
            <span style={{ color: "rgba(248,113,113,0.85)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>The Problem</span>
            <ArrowRight className="h-3 w-3 text-green-500" />
            <span style={{ color: "#22c55e", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>The Fix</span>
          </div>
          <h2 id="problem-heading" className="mb-3 text-4xl font-black text-white" style={{ letterSpacing: "-0.5px" }}>
            Stop losing patients to practices that move faster
          </h2>
          <p style={{ color: "rgba(255,255,255,0.60)", fontSize: 16, maxWidth: 500, margin: "0 auto", lineHeight: 1.65, fontWeight: 500 }}>
            Healthcare businesses that rely on manual processes are losing patients to AI-enabled competitors. GrowthMonk closes that gap.
          </p>
        </div>

        {/* Two panels */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, position: "relative" }}>
          {/* VS badge */}
          <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", zIndex: 10, width: 38, height: 38, borderRadius: "50%", background: "#030712", border: "1px solid rgba(55,65,81,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}>VS</span>
          </div>

          {/* Old way */}
          <div style={{ borderRadius: 20, background: "rgba(17,24,39,0.5)", border: "1px solid rgba(55,65,81,0.55)", padding: "32px 26px" }}>
            <p style={{ color: "rgba(248,113,113,0.8)", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>✗  The Old Way</p>
            <p style={{ color: "rgba(255,255,255,0.30)", fontSize: 13, marginBottom: 24 }}>Slow, manual, leaky funnel</p>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 14 }}>
              {problems.map((p, i) => (
                <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.22)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                    <X className="h-3 w-3" style={{ color: "rgba(239,68,68,0.75)" }} strokeWidth={3} />
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 13.5, lineHeight: 1.5 }}>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* GrowthMonk way */}
          <div style={{ position: "relative", overflow: "hidden", borderRadius: 20, background: "rgba(17,24,39,0.5)", border: "1px solid rgba(34,197,94,0.30)", padding: "32px 26px" }}>
            <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <p style={{ color: "#22c55e", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>✓  The GrowthMonk Way</p>
              <p style={{ color: "rgba(255,255,255,0.30)", fontSize: 13, marginBottom: 24 }}>Automated, instant, always-on</p>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                {solutions.map((s, i) => (
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

const featuresList = [
  {
    icon: Search,
    tag: "AI Search Discovery",
    title: "Get found before your competitors — in AI search",
    bullets: [
      "Generate a fully AEO, SEO & GEO-optimised website in hours — or audit yours to close the gap",
      "Analyse what top competitors are doing to rank in ChatGPT, Perplexity and Google AI Overviews",
      "Identify authority sources and let our agent earn you citations automatically",
      "Humanised blog content that AI engines can cite, quote and extract — built on official frameworks from Google, Perplexity and Schema.org",
    ],
    img: "/grow/features/ai-search.png",
  },
  {
    icon: MessageCircle,
    tag: "WhatsApp & Social Capture",
    title: "Capture every lead the moment they message",
    bullets: [
      "AI responds to every WhatsApp, Instagram DM and Facebook message in under 90 seconds — 24/7",
      "No enquiry falls through the cracks — every channel captured in one connected inbox",
      "Handles high volume without adding headcount — scales instantly at zero marginal cost",
      "Smart handoff to your team when a human touch is needed",
    ],
    img: "/grow/features/whatsapp-capture.png",
  },
  {
    icon: Globe,
    tag: "Multilingual Conversations",
    title: "Speak every patient's language — automatically",
    bullets: [
      "Detects the patient's language from the very first message — no setup or rules needed",
      "Responds fluently in English, German, Turkish, Arabic and more throughout the conversation",
      "Language is locked for the full interaction — no jarring mid-flow switching",
      "Zero staff language skills required — serve any community your practice reaches",
    ],
    img: "/grow/features/multilingual.png",
  },
  {
    icon: Bot,
    tag: "Automated Qualification",
    title: "Your team only talks to serious prospects",
    bullets: [
      "AI asks the right questions to understand each patient's need and intent",
      "Scores and qualifies every lead automatically — no manual review required",
      "Routes hot leads straight to your team and filters out time-wasters",
      "Staff only handle ready-to-book prospects — focus on converting, not filtering",
    ],
    img: "/grow/features/qualification.png",
  },
  {
    icon: Calendar,
    tag: "Instant Booking",
    title: "Your calendar fills while you deliver care",
    bullets: [
      "Converts qualified leads into booked consultations automatically — no back-and-forth",
      "Schedules callbacks for patients who need more time before committing",
      "Syncs with your calendar in real time — zero double-booking, zero manual entry",
      "Works around the clock so you wake up to a full diary every morning",
    ],
    img: "/grow/features/booking.png",
  },
  {
    icon: BarChart3,
    tag: "Live Analytics Dashboard",
    title: "Complete visibility — zero manual tracking",
    bullets: [
      "Track every lead, conversation and conversion in real time — all in one place",
      "See source, language, AI-detected intent and status at a glance",
      "Nothing is logged manually — every data point is captured automatically",
      "Spot drop-off points and optimise your funnel with live, actionable data",
    ],
    img: "/grow/features/analytics.png",
  },
];

function FeatureBullet({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", gap: 11, alignItems: "flex-start", marginBottom: 12 }}>
      <div style={{ flexShrink: 0, marginTop: 3, width: 18, height: 18, borderRadius: "50%", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Check className="h-2.5 w-2.5 text-green-400" strokeWidth={2.5} />
      </div>
      <span style={{ color: "rgba(255,255,255,0.62)", fontSize: 15, lineHeight: 1.6, fontWeight: 500 }}>{text}</span>
    </div>
  );
}

function Features() {
  return (
    <section
      id="features"
      style={{ backgroundColor: "#030712", position: "relative", overflow: "hidden" }}
      className="py-24"
      aria-labelledby="features-heading"
    >
      {/* ambient glow */}
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translate(-50%,-50%)", width: 1000, height: 600, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(34,197,94,0.10) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />

      <div className="relative mx-auto max-w-5xl px-6" style={{ zIndex: 1 }}>
        {/* Section header */}
        <div className="mb-20 text-center">
          <p style={{ color: "#22c55e", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
            Platform Features
          </p>
          <h2
            id="features-heading"
            style={{ color: "white", fontWeight: 900, fontSize: "clamp(28px,4vw,44px)", letterSpacing: "-1px", lineHeight: 1.1, margin: "0 0 16px" }}
          >
            Everything you need to grow faster
          </h2>
          <p style={{ color: "rgba(255,255,255,0.50)", fontSize: 17, maxWidth: 520, margin: "0 auto", lineHeight: 1.65, fontWeight: 500 }}>
            GrowthMonk combines AI search visibility, lead capture, qualification, and booking into one connected platform built for healthcare.
          </p>
        </div>

        {/* Alternating rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 96 }}>
          {featuresList.map((f, i) => {
            const Icon = f.icon;
            const isReversed = i % 2 === 1;
            return (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 64,
                  alignItems: "center",
                  direction: isReversed ? "rtl" : "ltr",
                }}
              >
                {/* Image */}
                <div style={{ direction: "ltr", position: "relative", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(55,65,81,0.55)", boxShadow: "0 0 80px rgba(34,197,94,0.07), 0 32px 64px rgba(0,0,0,0.45)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.img} alt={f.tag} style={{ width: "100%", display: "block" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, #22c55e 40%, #4ade80 60%, transparent)", opacity: 0.5 }} />
                </div>

                {/* Text */}
                <div style={{ direction: "ltr" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(34,197,94,0.10)", border: "1px solid rgba(34,197,94,0.22)", borderRadius: 100, padding: "5px 14px", marginBottom: 18 }}>
                    <Icon className="h-3.5 w-3.5 text-green-400" />
                    <span style={{ color: "#22c55e", fontSize: 11, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" }}>{f.tag}</span>
                  </div>
                  <h3 style={{ color: "white", fontWeight: 800, fontSize: "clamp(20px,2.2vw,28px)", letterSpacing: "-0.5px", lineHeight: 1.2, margin: "0 0 22px" }}>
                    {f.title}
                  </h3>
                  <div>
                    {f.bullets.map((b, bi) => (
                      <FeatureBullet key={bi} text={b} />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Connect your channels",
      description:
        "Link your WhatsApp Business number, Instagram, and other social media channels to GrowthMonk in minutes. No technical skills needed — we handle the integration.",
      detail: "WhatsApp · Instagram · Facebook · Website chat",
    },
    {
      number: "02",
      title: "AI captures and qualifies every lead",
      description:
        "The moment a potential patient sends a message, our AI responds instantly — in their language. It asks the right questions, understands their need, and qualifies their intent automatically.",
      detail: "24/7 response · Multilingual · Zero staff time",
    },
    {
      number: "03",
      title: "You receive booked appointments",
      description:
        "Qualified patients are booked into your calendar or scheduled for a callback automatically. You open your dashboard to a list of warm, qualified leads ready to convert.",
      detail: "Auto-booking · Callback scheduling · Live dashboard",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="px-6 py-24"
      aria-labelledby="how-heading"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-green-500">
            How It Works
          </span>
        </div>
        <h2
          id="how-heading"
          className="mb-4 text-center text-4xl font-extrabold text-white"
        >
          Up and running in 24 hours
        </h2>
        <p className="mx-auto mb-16 max-w-xl text-center text-gray-400">
          Three steps from sign-up to a fully automated lead pipeline for your
          healthcare business.
        </p>

        <div className="relative">
          <div
            className="absolute left-8 top-0 hidden h-full w-px md:block"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(34,197,94,0.3), transparent)",
            }}
          />

          <div className="space-y-12">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-8">
                <div className="relative flex-shrink-0">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-green-500/30 bg-green-500/10 text-xl font-black text-green-400">
                    {step.number}
                  </div>
                </div>
                <div className="pb-4 pt-2">
                  <h3 className="mb-2 text-xl font-bold text-white">
                    {step.title}
                  </h3>
                  <p className="mb-3 text-gray-400">{step.description}</p>
                  <p className="text-sm font-medium text-green-500/80">
                    {step.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Industries() {
  const industries = [
    {
      name: "Medical Clinics",
      icon: "🏥",
      desc: "GP practices, specialist clinics, and private hospitals",
    },
    {
      name: "Dental Practices",
      icon: "🦷",
      desc: "General dentistry, orthodontics, and implant centres",
    },
    {
      name: "MedSpas & Aesthetics",
      icon: "✨",
      desc: "Aesthetic clinics, laser centres, and skin practices",
    },
    {
      name: "Physiotherapy",
      icon: "🤸",
      desc: "Physio, sports rehab, and movement clinics",
    },
    {
      name: "Mental Health",
      icon: "🧠",
      desc: "Therapy, counselling, and psychiatry practices",
    },
    {
      name: "Care Services",
      icon: "❤️",
      desc: "Home nursing, elderly care, and care agencies",
    },
    {
      name: "Nutrition & Wellness",
      icon: "🥗",
      desc: "Nutritionists, dietitians, and wellness coaches",
    },
    {
      name: "Fertility & IVF",
      icon: "👶",
      desc: "Fertility clinics and reproductive health centres",
    },
  ];

  return (
    <section
      id="industries"
      className="px-6 py-24"
      aria-labelledby="industries-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-green-500">
            Industries
          </span>
        </div>
        <h2
          id="industries-heading"
          className="mb-4 text-center text-4xl font-extrabold text-white"
        >
          Built for every healthcare vertical
        </h2>
        <p className="mx-auto mb-16 max-w-xl text-center text-gray-400">
          Whether you run a boutique medspa or a multi-location clinic,
          GrowthMonk adapts to your specialty and patient demographics.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((item) => (
            <div
              key={item.name}
              className="rounded-xl border border-gray-800 bg-gray-900/30 p-5 transition-all hover:border-green-500/20 hover:bg-gray-900/50"
            >
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

function FAQ() {
  const faqs = [
    {
      q: "What is GrowthMonk?",
      a: "GrowthMonk is an AI growth engine for healthcare and wellness businesses. It helps clinics, medspas, dental practices, and care providers get discovered in AI search engines like ChatGPT and Perplexity, capture leads from WhatsApp and social media, and automatically qualify and convert those leads into booked appointments.",
    },
    {
      q: "How does GrowthMonk capture leads from WhatsApp?",
      a: "GrowthMonk connects to your WhatsApp Business number via the official Meta API. When a patient messages you, the AI bot responds instantly, captures their details, qualifies their needs, and either books an appointment or schedules a callback — automatically, 24 hours a day.",
    },
    {
      q: "Does GrowthMonk support multiple languages?",
      a: "Yes. GrowthMonk detects the patient's language automatically and continues in that language for the entire conversation. Currently supported: English, German, Turkish, and Arabic, with more languages being added.",
    },
    {
      q: "What is Answer Engine Optimization (AEO) for healthcare?",
      a: "AEO is the practice of structuring your content so AI search engines (ChatGPT, Perplexity, Google AI Overviews) cite your practice when patients ask health questions. GrowthMonk builds your AEO foundation — structured data, semantic content, and Q&A pages — so you appear in AI answers before your competitors.",
    },
    {
      q: "How long does setup take?",
      a: "Most healthcare businesses are fully set up and live within 24 hours of onboarding. Our team handles the channel integrations, AI configuration, and knowledge base setup. You just review and approve.",
    },
    {
      q: "Is patient data safe and GDPR-compliant?",
      a: "Yes. GrowthMonk is built with data privacy by design. All patient conversations are encrypted, data is processed within compliant infrastructure, and you retain full control over what is stored and for how long.",
    },
  ];

  return (
    <section
      id="faq"
      className="px-6 py-24"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-green-500">
            FAQ
          </span>
        </div>
        <h2
          id="faq-heading"
          className="mb-4 text-center text-4xl font-extrabold text-white"
        >
          Common questions
        </h2>
        <p className="mx-auto mb-16 max-w-lg text-center text-gray-400">
          Everything you need to know about GrowthMonk and AI-powered growth for
          healthcare.
        </p>

        <dl className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.q}
              className="rounded-xl border border-gray-800 bg-gray-900/40 p-6"
            >
              <dt className="mb-3 font-semibold text-white">{faq.q}</dt>
              <dd className="text-sm leading-relaxed text-gray-400">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section
      id="cta"
      className="px-6 py-24"
      aria-labelledby="cta-heading"
    >
      <div className="mx-auto max-w-4xl">
        <div
          className="relative overflow-hidden rounded-3xl p-12 text-center"
          style={{
            background:
              "linear-gradient(135deg, #052e16 0%, #14532d 50%, #052e16 100%)",
            border: "1px solid rgba(34,197,94,0.3)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(34,197,94,0.12), transparent)",
            }}
          />
          <div className="relative">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-500/20 px-4 py-1.5 text-sm font-medium text-green-300">
              <Zap className="h-3.5 w-3.5" />
              Start growing today
            </div>
            <h2
              id="cta-heading"
              className="mb-4 text-4xl font-extrabold text-white md:text-5xl"
            >
              Ready to grow your practice with AI?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-lg text-green-100/70">
              Book a free 30-minute demo. We&apos;ll show you exactly how
              GrowthMonk would work for your practice — live, no slides, no
              sales pitch.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href="mailto:hello@answermonk.ai?subject=GrowthMonk Demo Request"
                className="inline-flex items-center gap-2 rounded-full bg-green-500 px-8 py-3.5 font-semibold text-white shadow-lg shadow-green-900/50 transition-all hover:bg-green-400"
              >
                Book Your Free Demo
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {[
                "No credit card",
                "24-hour setup",
                "Cancel anytime",
                "GDPR compliant",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm text-green-300/70"
                >
                  <Check className="h-3.5 w-3.5 text-green-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-800/60 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-500">
              <TrendingUp className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-white">GrowthMonk</span>
            <span className="text-gray-600">by AnswerMonk.ai</span>
          </div>

          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
              <li>
                <a href="#features" className="transition-colors hover:text-gray-300">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="transition-colors hover:text-gray-300">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#industries" className="transition-colors hover:text-gray-300">
                  Industries
                </a>
              </li>
              <li>
                <a href="#faq" className="transition-colors hover:text-gray-300">
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@answermonk.ai"
                  className="transition-colors hover:text-gray-300"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} GrowthMonk by AnswerMonk.ai
          </p>
        </div>
      </div>
    </footer>
  );
}
