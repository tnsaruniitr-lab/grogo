import { Search, MessageCircle, Bot, Globe, Calendar, ArrowRight } from "lucide-react";

const features = [
  { icon: Search,        problem: "Invisible in AI search (ChatGPT, Perplexity, AI Overviews)", solution: "Optimised for AI search engines — patients find you first" },
  { icon: MessageCircle, problem: "Leads from WhatsApp & Instagram go unanswered for hours",   solution: "AI responds to every message in under 2 minutes, 24/7" },
  { icon: Bot,           problem: "Staff spend hours qualifying the same basic enquiries",       solution: "AI qualifies, filters, and routes leads automatically" },
  { icon: Globe,         problem: "Language barriers losing you multilingual patients",          solution: "Conversations in English, German, Turkish, Arabic and more" },
  { icon: Calendar,      problem: "Leads captured but never followed up on consistently",        solution: "AI books appointments and callbacks without human input" },
];

export function FeatureCards() {
  return (
    <section style={{ backgroundColor: "#030712", fontFamily: "'Plus Jakarta Sans', sans-serif", position: "relative", width: "100%", padding: "80px 24px", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(34,197,94,0.15) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 980, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 100, padding: "5px 16px", marginBottom: 16 }}>
            <span style={{ color: "rgba(248,113,113,0.85)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>The Problem</span>
            <ArrowRight size={11} color="#22c55e" />
            <span style={{ color: "#22c55e", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>The Fix</span>
          </div>
          <h2 style={{ color: "white", fontWeight: 900, fontSize: "clamp(24px,3.5vw,38px)", letterSpacing: "-0.5px", lineHeight: 1.15, margin: "0 0 12px" }}>
            Stop losing patients to practices that move faster
          </h2>
          <p style={{ color: "rgba(255,255,255,0.60)", fontSize: 16, maxWidth: 500, margin: "0 auto", lineHeight: 1.65, fontWeight: 500 }}>
            Healthcare businesses that rely on manual processes are losing patients to AI-enabled competitors. GrowthMonk closes that gap.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {features.map((f, i) => {
            const Icon = f.icon;
            const isLast = i === features.length - 1;
            return (
              <div key={i} style={{
                position: "relative", overflow: "hidden",
                borderRadius: 20,
                background: "rgba(17,24,39,0.5)",
                border: "1px solid rgba(55,65,81,0.6)",
                padding: "26px 22px",
                gridColumn: isLast ? "1 / -1" : undefined,
                maxWidth: isLast ? "calc(50% - 6px)" : undefined,
              }}>
                {/* green top accent */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #22c55e, #4ade80)", opacity: 0.55, borderRadius: "20px 20px 0 0" }} />

                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.28)", display: "flex", alignItems: "center", justifyContent: "center", color: "#4ade80", flexShrink: 0 }}>
                    <Icon size={18} />
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.32)", fontSize: 13, lineHeight: 1.45, textDecoration: "line-through", textDecorationColor: "rgba(255,255,255,0.12)", marginTop: 4 }}>
                    {f.problem}
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <ArrowRight size={13} color="#22c55e" />
                  <span style={{ color: "#22c55e", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>The Solution</span>
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
