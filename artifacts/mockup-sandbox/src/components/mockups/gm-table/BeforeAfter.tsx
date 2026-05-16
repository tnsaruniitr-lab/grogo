import { ArrowRight, X, Check } from "lucide-react";

const pairs = [
  { problem: "Invisible in AI search (ChatGPT, Perplexity, AI Overviews)", solution: "Optimised for AI search engines — patients find you first" },
  { problem: "Leads from WhatsApp & Instagram go unanswered for hours",   solution: "AI responds to every message in under 2 minutes, 24/7" },
  { problem: "Staff spend hours qualifying the same basic enquiries",       solution: "AI qualifies, filters, and routes leads automatically" },
  { problem: "Language barriers losing you multilingual patients",          solution: "Conversations in English, German, Turkish, Arabic and more" },
  { problem: "Leads captured but never followed up on consistently",        solution: "AI books appointments and callbacks without human input" },
];

export function BeforeAfter() {
  return (
    <section style={{ backgroundColor: "#030712", fontFamily: "'Plus Jakarta Sans', sans-serif", position: "relative", width: "100%", padding: "80px 24px", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* glow skewed toward the solution side */}
      <div style={{ position: "absolute", top: "50%", right: "20%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.14) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />

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

        {/* Column labels */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 48px 1fr", marginBottom: 10 }}>
          <div style={{ textAlign: "right", paddingRight: 20 }}>
            <span style={{ color: "rgba(248,113,113,0.65)", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Before</span>
          </div>
          <div />
          <div style={{ paddingLeft: 20 }}>
            <span style={{ color: "#22c55e", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>With GrowthMonk</span>
          </div>
        </div>

        {/* Rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {pairs.map((p, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 48px 1fr", alignItems: "center" }}>
              {/* Problem */}
              <div style={{ borderRadius: 14, background: "rgba(17,24,39,0.5)", border: "1px solid rgba(55,65,81,0.5)", padding: "14px 18px", display: "flex", gap: 10, alignItems: "center", justifyContent: "flex-end", textAlign: "right" }}>
                <span style={{ color: "rgba(255,255,255,0.40)", fontSize: 13.5, lineHeight: 1.45, fontWeight: 500 }}>{p.problem}</span>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.20)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <X size={11} color="rgba(239,68,68,0.7)" strokeWidth={3} />
                </div>
              </div>

              {/* Arrow */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.30)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ArrowRight size={13} color="#22c55e" />
                </div>
              </div>

              {/* Solution */}
              <div style={{ borderRadius: 14, background: "rgba(17,24,39,0.5)", border: "1px solid rgba(34,197,94,0.25)", padding: "14px 18px", display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(34,197,94,0.16)", border: "1px solid rgba(34,197,94,0.35)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Check size={11} color="#22c55e" strokeWidth={3} />
                </div>
                <span style={{ color: "rgba(255,255,255,0.88)", fontSize: 13.5, lineHeight: 1.45, fontWeight: 600 }}>{p.solution}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
