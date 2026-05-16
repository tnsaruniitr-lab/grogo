import { ArrowRight, X, Check } from "lucide-react";

const BG = "linear-gradient(135deg, #0b1528 0%, #0d1e38 100%)";
const GREEN = "#22c55e";
const GREEN_LIGHT = "#4ade80";

const pairs = [
  { problem: "Invisible in AI search (ChatGPT, Perplexity, AI Overviews)", solution: "Optimised for AI search engines — patients find you first" },
  { problem: "Leads from WhatsApp & Instagram go unanswered for hours",   solution: "AI responds to every message in under 2 minutes, 24/7" },
  { problem: "Staff spend hours qualifying the same basic enquiries",       solution: "AI qualifies, filters, and routes leads automatically" },
  { problem: "Language barriers losing you multilingual patients",          solution: "Conversations in English, German, Turkish, Arabic and more" },
  { problem: "Leads captured but never followed up on consistently",        solution: "AI books appointments and callbacks without human input" },
];

export function BeforeAfter() {
  return (
    <section style={{ background: BG, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className="relative w-full py-20 px-6 overflow-hidden">
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      <div style={{ position: "absolute", top: "50%", right: "25%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

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

        {/* Column headers */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 56px 1fr", gap: 0, marginBottom: 12 }}>
          <div style={{ textAlign: "right", paddingRight: 24 }}>
            <span style={{ color: "rgba(239,68,68,0.7)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Before</span>
          </div>
          <div />
          <div style={{ paddingLeft: 24 }}>
            <span style={{ color: GREEN, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>With GrowthMonk</span>
          </div>
        </div>

        {/* Rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {pairs.map((p, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 56px 1fr", gap: 0, alignItems: "center" }}>
              {/* Problem */}
              <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 14, padding: "16px 20px", display: "flex", gap: 12, alignItems: "center", justifyContent: "flex-end", textAlign: "right" }}>
                <span style={{ color: "rgba(255,255,255,0.50)", fontSize: 14, lineHeight: 1.45, fontWeight: 500 }}>{p.problem}</span>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <X size={12} color="rgba(239,68,68,0.8)" strokeWidth={3} />
                </div>
              </div>

              {/* Arrow */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: `rgba(34,197,94,0.14)`, border: `1px solid rgba(34,197,94,0.3)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ArrowRight size={14} color={GREEN} />
                </div>
              </div>

              {/* Solution */}
              <div style={{ background: "rgba(34,197,94,0.07)", border: `1px solid rgba(34,197,94,0.22)`, borderRadius: 14, padding: "16px 20px", display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(34,197,94,0.18)", border: "1px solid rgba(34,197,94,0.32)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Check size={12} color={GREEN} strokeWidth={3} />
                </div>
                <span style={{ color: "rgba(255,255,255,0.88)", fontSize: 14, lineHeight: 1.45, fontWeight: 600 }}>{p.solution}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
