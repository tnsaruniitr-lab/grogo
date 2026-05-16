import { Search, Users, Bot, Clock } from "lucide-react";

const BG = "linear-gradient(135deg, #0b1528 0%, #0d1e38 100%)";
const CARD = "rgba(17, 34, 60, 0.9)";
const GREEN = "#22c55e";
const GREEN_LIGHT = "#4ade80";

const stats = [
  { icon: Search, value: "2-4×", label: "More AI search appearances for your business" },
  { icon: Users,  value: "3×",   label: "More leads discovered and captured" },
  { icon: Bot,    value: "80%",  label: "Of leads qualified automatically by AI" },
  { icon: Clock,  value: "24/7", label: "AI follow-up, never misses a lead" },
];

export function IconGrid() {
  return (
    <section style={{ background: BG, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className="relative w-full py-20 px-6 overflow-hidden">
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 350, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(34,197,94,0.09) 0%, transparent 70%)", pointerEvents: "none" }} />

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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} style={{ background: CARD, border: `1px solid rgba(34,197,94,0.22)`, borderRadius: 20, padding: "28px 24px" }}>
                {/* Icon container */}
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(34,197,94,0.14)", border: "1px solid rgba(34,197,94,0.30)", display: "flex", alignItems: "center", justifyContent: "center", color: GREEN, marginBottom: 20 }}>
                  <Icon size={20} />
                </div>

                <div style={{ fontSize: "clamp(36px,4.5vw,52px)", fontWeight: 900, lineHeight: 1, letterSpacing: "-1px", background: `linear-gradient(135deg, ${GREEN_LIGHT}, ${GREEN})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 12 }}>
                  {s.value}
                </div>

                <p style={{ color: "rgba(255,255,255,0.62)", fontSize: 14, lineHeight: 1.55, fontWeight: 500, margin: 0 }}>
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
