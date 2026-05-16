import { X, Check, ArrowRight } from "lucide-react";

const BG = "linear-gradient(135deg, #0b1528 0%, #0d1e38 100%)";
const GREEN = "#22c55e";
const GREEN_LIGHT = "#4ade80";

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

export function SplitCards() {
  return (
    <section style={{ background: BG, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className="relative w-full py-20 px-6 overflow-hidden">
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      <div style={{ position: "absolute", top: "40%", right: "20%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

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

        {/* Two panels */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "stretch", position: "relative" }}>
          {/* VS badge */}
          <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", zIndex: 10, width: 40, height: 40, borderRadius: "50%", background: "#0d1e38", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em" }}>VS</span>
          </div>

          {/* Old way */}
          <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 20, padding: "32px 28px" }}>
            <div style={{ marginBottom: 24 }}>
              <p style={{ color: "rgba(239,68,68,0.85)", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>✗  The Old Way</p>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>Slow, manual, leaky funnel</p>
            </div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 16 }}>
              {problems.map((p, i) => (
                <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                    <X size={11} color="rgba(239,68,68,0.8)" strokeWidth={3} />
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.5 }}>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* GrowthMonk way */}
          <div style={{ background: "rgba(34,197,94,0.06)", border: `1px solid rgba(34,197,94,0.25)`, borderRadius: 20, padding: "32px 28px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ marginBottom: 24, position: "relative", zIndex: 1 }}>
              <p style={{ color: GREEN, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>✓  The GrowthMonk Way</p>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>Automated, instant, always-on</p>
            </div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 16, position: "relative", zIndex: 1 }}>
              {solutions.map((s, i) => (
                <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(34,197,94,0.18)", border: "1px solid rgba(34,197,94,0.35)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                    <Check size={11} color={GREEN} strokeWidth={3} />
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.88)", fontSize: 14, lineHeight: 1.5, fontWeight: 500 }}>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SplitCards;
