import { Activity, Target, Zap, Clock } from "lucide-react";

const BG = "linear-gradient(135deg, #0b1528 0%, #0d1e38 100%)";
const CARD = "rgba(17, 34, 60, 0.9)";
const GREEN = "#22c55e";
const GREEN_LIGHT = "#4ade80";

const stats = [
  { value: "2-4×", label: "More AI search appearances for your business", icon: Activity },
  { value: "3×",   label: "More leads discovered and captured",            icon: Target },
  { value: "80%",  label: "Of leads qualified automatically by AI",        icon: Zap },
  { value: "24/7", label: "AI follow-up, never misses a lead",             icon: Clock },
];

export function GlowCards() {
  return (
    <section style={{ background: BG, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className="relative w-full py-20 px-6 overflow-hidden">
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* ambient green glow */}
      <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 400, borderRadius: "50%", background: `radial-gradient(ellipse, rgba(34,197,94,0.10) 0%, transparent 70%)`, pointerEvents: "none" }} />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <p style={{ color: GREEN, letterSpacing: "0.1em", fontSize: 11, fontWeight: 700, textTransform: "uppercase", marginBottom: 14 }}>
            WHAT GROWTHMONK DELIVERS
          </p>
          <h2 style={{ color: "white", fontWeight: 800, fontSize: "clamp(22px,3.5vw,36px)", letterSpacing: "-0.5px", lineHeight: 1.2, margin: 0 }}>
            Results healthcare businesses can measure
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} style={{ background: CARD, border: `1px solid rgba(34,197,94,0.22)`, borderRadius: 20, padding: "28px 24px", position: "relative", overflow: "hidden" }}>
                {/* inner glow */}
                <div style={{ position: "absolute", top: -40, right: -40, width: 130, height: 130, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
                {/* bottom accent */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${GREEN}, transparent)`, borderRadius: "0 0 20px 20px" }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <span style={{ fontSize: "clamp(40px,5vw,58px)", fontWeight: 900, lineHeight: 1, background: `linear-gradient(135deg, ${GREEN_LIGHT}, ${GREEN})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-1px" }}>
                    {s.value}
                  </span>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: GREEN }}>
                    <Icon size={16} />
                  </div>
                </div>

                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, lineHeight: 1.55, fontWeight: 500, margin: 0 }}>
                  {s.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
