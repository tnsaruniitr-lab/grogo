import { Activity, Target, Zap, Clock } from "lucide-react";

const stats = [
  { value: "2-4×", label: "More AI search appearances for your business", icon: Activity },
  { value: "3×",   label: "More leads discovered and captured",            icon: Target },
  { value: "80%",  label: "Of leads qualified automatically by AI",        icon: Zap },
  { value: "24/7", label: "AI follow-up, never misses a lead",             icon: Clock },
];

export function GlowCards() {
  return (
    <section style={{ backgroundColor: "#030712", fontFamily: "'Plus Jakarta Sans', sans-serif", position: "relative", width: "100%", padding: "80px 24px", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* Hero-matching green glow — strong, centred */}
      <div style={{ position: "absolute", top: "35%", left: "50%", transform: "translate(-50%,-50%)", width: 900, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(34,197,94,0.18) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 980, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <p style={{ color: "#22c55e", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
            WHAT GROWTHMONK DELIVERS
          </p>
          <h2 style={{ color: "white", fontWeight: 900, fontSize: "clamp(24px,3.5vw,38px)", letterSpacing: "-0.5px", lineHeight: 1.15, margin: 0 }}>
            Results healthcare businesses can measure
          </h2>
        </div>

        {/* 4 cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} style={{ position: "relative", overflow: "hidden", borderRadius: 20, background: "rgba(17,24,39,0.5)", border: "1px solid rgba(55,65,81,0.6)", padding: "28px 22px" }}>
                {/* per-card green bloom */}
                <div style={{ position: "absolute", top: -50, right: -50, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.22) 0%, transparent 70%)", pointerEvents: "none" }} />
                {/* bottom green line */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent 0%, #22c55e 50%, transparent 100%)", opacity: 0.7 }} />

                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                    <span style={{ fontSize: "clamp(44px,5.5vw,60px)", fontWeight: 900, lineHeight: 1, letterSpacing: "-2px", background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      {s.value}
                    </span>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#4ade80" }}>
                      <Icon size={15} />
                    </div>
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.60)", fontSize: 13.5, lineHeight: 1.55, fontWeight: 500, margin: 0 }}>
                    {s.label}
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
