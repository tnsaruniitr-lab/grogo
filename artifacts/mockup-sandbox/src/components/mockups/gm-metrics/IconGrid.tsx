import { Search, Users, Bot, Clock } from "lucide-react";

const stats = [
  { icon: Search, value: "2-4×", label: "More AI search appearances for your business" },
  { icon: Users,  value: "3×",   label: "More leads discovered and captured" },
  { icon: Bot,    value: "80%",  label: "Of leads qualified automatically by AI" },
  { icon: Clock,  value: "24/7", label: "AI follow-up, never misses a lead" },
];

export function IconGrid() {
  return (
    <section style={{ backgroundColor: "#030712", fontFamily: "'Plus Jakarta Sans', sans-serif", position: "relative", width: "100%", padding: "80px 24px", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%,-50%)", width: 900, height: 450, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(34,197,94,0.17) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />

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

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} style={{ borderRadius: 20, background: "rgba(17,24,39,0.5)", border: "1px solid rgba(55,65,81,0.6)", padding: "26px 22px" }}>
                {/* Icon */}
                <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.28)", display: "flex", alignItems: "center", justifyContent: "center", color: "#4ade80", marginBottom: 18 }}>
                  <Icon size={19} />
                </div>
                <div style={{ fontSize: "clamp(38px,4.5vw,54px)", fontWeight: 900, lineHeight: 1, letterSpacing: "-1.5px", background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 12 }}>
                  {s.value}
                </div>
                <p style={{ color: "rgba(255,255,255,0.60)", fontSize: 13.5, lineHeight: 1.55, fontWeight: 500, margin: 0 }}>
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

export default IconGrid;
