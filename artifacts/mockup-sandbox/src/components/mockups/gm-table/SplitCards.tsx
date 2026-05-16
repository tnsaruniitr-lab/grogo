import { X, Check, ArrowRight } from "lucide-react";

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
    <section style={{ backgroundColor: "#030712", fontFamily: "'Plus Jakarta Sans', sans-serif", position: "relative", width: "100%", padding: "80px 24px", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* hero-matching glow, shifted right toward the "solution" panel */}
      <div style={{ position: "absolute", top: "40%", right: "15%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.16) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />

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
                    <X size={10} color="rgba(239,68,68,0.75)" strokeWidth={3} />
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
                      <Check size={10} color="#22c55e" strokeWidth={3} />
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

export default SplitCards;
