import { Search, MessageCircle, Globe, Bot, Calendar, BarChart3 } from "lucide-react";

const BASE = "https://3a0ae458-388e-4499-8eb8-1f81a1a81110-00-1p4416g4evu42.pike.replit.dev/grow/features";

const features = [
  {
    icon: Search,
    tag: "AI Search Discovery",
    title: "Get found before your competitors — in AI search",
    body: "Optimise your practice to appear when patients ask health questions on ChatGPT, Perplexity, Google AI Overviews, and other AI engines. AEO-first from day one.",
    img: `${BASE}/ai-search.png`,
  },
  {
    icon: MessageCircle,
    tag: "WhatsApp & Social Capture",
    title: "Capture every lead the moment they message",
    body: "Every WhatsApp, Instagram DM, and Facebook message is answered instantly by AI. No enquiry falls through the cracks — ever.",
    img: `${BASE}/whatsapp-capture.png`,
  },
  {
    icon: Globe,
    tag: "Multilingual Conversations",
    title: "Speak every patient's language — automatically",
    body: "AI detects the patient's language and responds in English, German, Turkish, Arabic and more — for the entire conversation. Zero staff language skills needed.",
    img: `${BASE}/multilingual.png`,
  },
  {
    icon: Bot,
    tag: "Automated Qualification",
    title: "Your team only talks to serious prospects",
    body: "The AI asks the right questions, understands need and intent, and qualifies or routes leads intelligently — so your staff focus on converting, not filtering.",
    img: `${BASE}/qualification.png`,
  },
  {
    icon: Calendar,
    tag: "Instant Booking",
    title: "Calendar fills while you deliver care",
    body: "Qualified leads are converted into booked consultations or scheduled callbacks automatically. No back-and-forth, no manual scheduling.",
    img: `${BASE}/booking.png`,
  },
  {
    icon: BarChart3,
    tag: "Live Analytics Dashboard",
    title: "Complete visibility — zero manual tracking",
    body: "See every lead, conversation, and conversion in real time. Track source, language, status, and AI-detected intent in one live dashboard.",
    img: `${BASE}/analytics.png`,
  },
];

export function AlternatingRows() {
  return (
    <div style={{ backgroundColor: "#030712", fontFamily: "'Plus Jakarta Sans', sans-serif", width: "100%", padding: "72px 0" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* Section header */}
      <div style={{ textAlign: "center", marginBottom: 72, padding: "0 24px" }}>
        <p style={{ color: "#22c55e", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Platform Features</p>
        <h2 style={{ color: "white", fontWeight: 900, fontSize: "clamp(28px,4vw,44px)", letterSpacing: "-1px", lineHeight: 1.1, margin: "0 0 16px" }}>
          Everything you need to grow faster
        </h2>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 17, maxWidth: 520, margin: "0 auto", lineHeight: 1.65, fontWeight: 500 }}>
          GrowthMonk combines AI search visibility, lead capture, qualification, and booking into one connected platform built for healthcare.
        </p>
      </div>

      {/* Alternating rows */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", flexDirection: "column", gap: 80 }}>
        {features.map((f, i) => {
          const Icon = f.icon;
          const isReversed = i % 2 === 1;
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center", direction: isReversed ? "rtl" : "ltr" }}>
              {/* Image */}
              <div style={{ direction: "ltr", position: "relative", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(55,65,81,0.6)", boxShadow: "0 0 60px rgba(34,197,94,0.08), 0 24px 48px rgba(0,0,0,0.4)" }}>
                <img src={f.img} alt={f.tag} style={{ width: "100%", display: "block", borderRadius: 20 }} />
                {/* green bottom glow line */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, #22c55e, transparent)", opacity: 0.6 }} />
              </div>

              {/* Text */}
              <div style={{ direction: "ltr" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(34,197,94,0.10)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 100, padding: "5px 14px", marginBottom: 20 }}>
                  <Icon size={13} color="#22c55e" />
                  <span style={{ color: "#22c55e", fontSize: 11, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase" }}>{f.tag}</span>
                </div>
                <h3 style={{ color: "white", fontWeight: 800, fontSize: "clamp(20px,2.5vw,30px)", letterSpacing: "-0.5px", lineHeight: 1.2, margin: "0 0 16px" }}>
                  {f.title}
                </h3>
                <p style={{ color: "rgba(255,255,255,0.58)", fontSize: 16, lineHeight: 1.7, fontWeight: 500, margin: 0 }}>
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
