import { Search, MessageCircle, Globe, Bot, Calendar, BarChart3, Check } from "lucide-react";

const BASE = "https://3a0ae458-388e-4499-8eb8-1f81a1a81110-00-1p4416g4evu42.pike.replit.dev/grow/features";

const features = [
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
    img: `${BASE}/ai-search.png`,
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
    img: `${BASE}/whatsapp-capture.png`,
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
    img: `${BASE}/multilingual.png`,
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
    img: `${BASE}/qualification.png`,
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
    img: `${BASE}/booking.png`,
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
    img: `${BASE}/analytics.png`,
  },
];

function BulletPoint({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", gap: 11, alignItems: "flex-start", marginBottom: 12 }}>
      <div style={{ flexShrink: 0, marginTop: 3, width: 18, height: 18, borderRadius: "50%", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Check size={10} color="#22c55e" strokeWidth={2.5} />
      </div>
      <span style={{ color: "rgba(255,255,255,0.62)", fontSize: 15, lineHeight: 1.6, fontWeight: 500 }}>{text}</span>
    </div>
  );
}

export function AlternatingRowsV2() {
  return (
    <div style={{ backgroundColor: "#030712", fontFamily: "'Plus Jakarta Sans', sans-serif", width: "100%", padding: "72px 0" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* Section header */}
      <div style={{ textAlign: "center", marginBottom: 72, padding: "0 24px" }}>
        <p style={{ color: "#22c55e", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Platform Features</p>
        <h2 style={{ color: "white", fontWeight: 900, fontSize: "clamp(28px,4vw,44px)", letterSpacing: "-1px", lineHeight: 1.1, margin: "0 0 16px" }}>
          Everything you need to grow faster
        </h2>
        <p style={{ color: "rgba(255,255,255,0.50)", fontSize: 17, maxWidth: 520, margin: "0 auto", lineHeight: 1.65, fontWeight: 500 }}>
          GrowthMonk combines AI search visibility, lead capture, qualification, and booking into one connected platform built for healthcare.
        </p>
      </div>

      {/* Alternating rows */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", flexDirection: "column", gap: 96 }}>
        {features.map((f, i) => {
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
                <img src={f.img} alt={f.tag} style={{ width: "100%", display: "block" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, #22c55e 40%, #4ade80 60%, transparent)", opacity: 0.5 }} />
              </div>

              {/* Text */}
              <div style={{ direction: "ltr" }}>
                {/* Tag pill */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(34,197,94,0.10)", border: "1px solid rgba(34,197,94,0.22)", borderRadius: 100, padding: "5px 14px", marginBottom: 18 }}>
                  <Icon size={13} color="#22c55e" />
                  <span style={{ color: "#22c55e", fontSize: 11, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" }}>{f.tag}</span>
                </div>

                {/* Headline */}
                <h3 style={{ color: "white", fontWeight: 800, fontSize: "clamp(20px,2.2vw,28px)", letterSpacing: "-0.5px", lineHeight: 1.2, margin: "0 0 22px" }}>
                  {f.title}
                </h3>

                {/* Bullet points */}
                <div>
                  {f.bullets.map((b, bi) => (
                    <BulletPoint key={bi} text={b} />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
