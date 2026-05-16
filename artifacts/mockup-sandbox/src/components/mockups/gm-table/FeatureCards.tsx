import { Search, MessageCircle, Bot, Globe, Calendar, ArrowRight } from "lucide-react";

const BG = "linear-gradient(135deg, #0b1528 0%, #0d1e38 100%)";
const CARD = "rgba(17, 34, 60, 0.9)";
const GREEN = "#22c55e";
const GREEN_LIGHT = "#4ade80";

const features = [
  { icon: Search,       problem: "Invisible in AI search (ChatGPT, Perplexity, AI Overviews)", solution: "Optimised for AI search engines — patients find you first" },
  { icon: MessageCircle, problem: "Leads from WhatsApp & Instagram go unanswered for hours",   solution: "AI responds to every message in under 2 minutes, 24/7" },
  { icon: Bot,          problem: "Staff spend hours qualifying the same basic enquiries",        solution: "AI qualifies, filters, and routes leads automatically" },
  { icon: Globe,        problem: "Language barriers losing you multilingual patients",           solution: "Conversations in English, German, Turkish, Arabic and more" },
  { icon: Calendar,     problem: "Leads captured but never followed up on consistently",         solution: "AI books appointments and callbacks without human input" },
];

export function FeatureCards() {
  return (
    <section style={{ background: BG, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className="relative w-full py-20 px-6 overflow-hidden">
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      <div style={{ position: "absolute", top: "35%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(34,197,94,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 100, padding: "5px 14px", marginBottom: 16 }}>
            <span style={{ color: "rgba(255,80,80,0.8)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>The Problem</span>
            <ArrowRight size={12} color={GREEN} />
            <span style={{ color: GREEN, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>The Fix</span>
          </div>
          <h2 style={{ color: "white", fontWeight: 800, fontSize: "clamp(24px,3.5vw,38px)", letterSpacing: "-0.5px", lineHeight: 1.2, margin: "0 0 12px" }}>
            Stop losing patients to practices that move faster
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, maxWidth: 520, margin: "0 auto", lineHeight: 1.6 }}>
            Healthcare businesses that rely on manual processes are losing patients to AI-enabled competitors. GrowthMonk closes that gap.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {features.map((f, i) => {
            const Icon = f.icon;
            const isLast = i === features.length - 1;
            return (
              <div key={i} style={{
                background: CARD,
                border: "1px solid rgba(34,197,94,0.18)",
                borderRadius: 20,
                padding: "28px 24px",
                gridColumn: isLast ? "1 / -1" : undefined,
                maxWidth: isLast ? "calc(50% - 7px)" : undefined,
                position: "relative",
                overflow: "hidden"
              }}>
                {/* top green accent */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${GREEN}, ${GREEN_LIGHT})`, borderRadius: "20px 20px 0 0", opacity: 0.6 }} />

                <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 18 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(34,197,94,0.14)", border: "1px solid rgba(34,197,94,0.28)", display: "flex", alignItems: "center", justifyContent: "center", color: GREEN, flexShrink: 0 }}>
                    <Icon size={19} />
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, lineHeight: 1.45, textDecoration: "line-through", textDecorationColor: "rgba(255,255,255,0.15)", marginTop: 4 }}>
                    {f.problem}
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <ArrowRight size={14} color={GREEN} />
                  <span style={{ color: GREEN, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>The Solution</span>
                </div>
                <p style={{ color: "rgba(255,255,255,0.88)", fontSize: 15, fontWeight: 600, lineHeight: 1.45, margin: 0 }}>
                  {f.solution}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeatureCards;
