const BG = "linear-gradient(135deg, #0b1528 0%, #0d1e38 100%)";
const GREEN = "#22c55e";
const GREEN_LIGHT = "#4ade80";

const stats = [
  { value: "2-4×", label: "More AI search appearances for your business" },
  { value: "3×",   label: "More leads discovered and captured" },
  { value: "80%",  label: "Of leads qualified automatically by AI" },
  { value: "24/7", label: "AI follow-up, never misses a lead" },
];

export function EditorialNumbers() {
  return (
    <section style={{ background: BG, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      className="relative w-full py-20 px-6 overflow-hidden">
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* ambient glow */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 900, height: 300, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(34,197,94,0.09) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p style={{ color: GREEN, letterSpacing: "0.1em", fontSize: 11, fontWeight: 700, textTransform: "uppercase", marginBottom: 14 }}>
            WHAT GROWTHMONK DELIVERS
          </p>
          <h2 style={{ color: "white", fontWeight: 800, fontSize: "clamp(22px,3.5vw,36px)", letterSpacing: "-0.5px", lineHeight: 1.2, margin: 0 }}>
            Results healthcare businesses can measure
          </h2>
        </div>

        {/* Numbers row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: "center", padding: "0 24px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
              <div style={{ fontSize: "clamp(64px,8vw,100px)", fontWeight: 900, lineHeight: 1, letterSpacing: "-3px", background: `linear-gradient(160deg, ${GREEN_LIGHT} 0%, ${GREEN} 60%, rgba(34,197,94,0.6) 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 20 }}>
                {s.value}
              </div>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.55, fontWeight: 500, margin: 0 }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default EditorialNumbers;
