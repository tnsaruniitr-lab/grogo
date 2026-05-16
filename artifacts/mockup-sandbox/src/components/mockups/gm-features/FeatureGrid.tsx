import { Search, MessageCircle, Globe, Bot, Calendar, BarChart3 } from "lucide-react";

const BASE = "https://3a0ae458-388e-4499-8eb8-1f81a1a81110-00-1p4416g4evu42.pike.replit.dev/grow/features";

const features = [
  {
    icon: Search,
    tag: "AI Search Discovery",
    title: "Get found in AI search",
    body: "Appear in ChatGPT, Perplexity and AI Overviews when patients ask health questions.",
    img: `${BASE}/ai-search.png`,
  },
  {
    icon: MessageCircle,
    tag: "WhatsApp & Social Capture",
    title: "Capture every message",
    body: "AI answers every WhatsApp, Instagram DM and Facebook enquiry instantly, 24/7.",
    img: `${BASE}/whatsapp-capture.png`,
  },
  {
    icon: Globe,
    tag: "Multilingual Conversations",
    title: "Any language, automatically",
    body: "Responds in English, German, Turkish, Arabic and more — no staff language skills needed.",
    img: `${BASE}/multilingual.png`,
  },
  {
    icon: Bot,
    tag: "Automated Qualification",
    title: "Only talk to hot leads",
    body: "AI qualifies intent and routes leads so your team only handles serious prospects.",
    img: `${BASE}/qualification.png`,
  },
  {
    icon: Calendar,
    tag: "Instant Booking",
    title: "Calendar fills itself",
    body: "Qualified leads are auto-booked into consultations or callbacks — zero back-and-forth.",
    img: `${BASE}/booking.png`,
  },
  {
    icon: BarChart3,
    tag: "Live Analytics",
    title: "Total visibility",
    body: "Every lead, conversation and conversion tracked in real time. Zero manual logging.",
    img: `${BASE}/analytics.png`,
  },
];

export function FeatureGrid() {
  return (
    <div style={{ backgroundColor: "#030712", fontFamily: "'Plus Jakarta Sans', sans-serif", width: "100%", padding: "72px 24px" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* ambient glow */}
      <div style={{ position: "fixed", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 900, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(34,197,94,0.12) 0%, transparent 65%)", pointerEvents: "none" }} />

      {/* Section header */}
      <div style={{ textAlign: "center", marginBottom: 56, position: "relative", zIndex: 1 }}>
        <p style={{ color: "#22c55e", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Platform Features</p>
        <h2 style={{ color: "white", fontWeight: 900, fontSize: "clamp(28px,4vw,44px)", letterSpacing: "-1px", lineHeight: 1.1, margin: "0 0 16px" }}>
          Everything you need to grow faster
        </h2>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 17, maxWidth: 520, margin: "0 auto", lineHeight: 1.65, fontWeight: 500 }}>
          GrowthMonk combines AI search visibility, lead capture, qualification, and booking into one connected platform built for healthcare.
        </p>
      </div>

      {/* 2×3 grid */}
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, position: "relative", zIndex: 1 }}>
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} style={{ borderRadius: 20, background: "rgba(17,24,39,0.55)", border: "1px solid rgba(55,65,81,0.6)", overflow: "hidden" }}>
              {/* Image */}
              <div style={{ position: "relative", overflow: "hidden" }}>
                <img src={f.img} alt={f.tag} style={{ width: "100%", display: "block", aspectRatio: "16/9", objectFit: "cover" }} />
                {/* dark gradient at bottom of image for text readability */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(to bottom, transparent, rgba(17,24,39,0.95))" }} />
                {/* tag badge over image */}
                <div style={{ position: "absolute", bottom: 16, left: 16, display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.30)", borderRadius: 100, padding: "4px 12px", backdropFilter: "blur(8px)" }}>
                  <Icon size={12} color="#22c55e" />
                  <span style={{ color: "#4ade80", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" }}>{f.tag}</span>
                </div>
              </div>

              {/* Text */}
              <div style={{ padding: "22px 24px 26px" }}>
                <h3 style={{ color: "white", fontWeight: 800, fontSize: 18, letterSpacing: "-0.3px", lineHeight: 1.25, margin: "0 0 10px" }}>
                  {f.title}
                </h3>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.65, fontWeight: 500, margin: 0 }}>
                  {f.body}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
