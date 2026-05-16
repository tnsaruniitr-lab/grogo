const stats = [
  { value: "2-4×", label: "More AI search appearances for your business" },
  { value: "3×",   label: "More leads discovered and captured" },
  { value: "80%",  label: "Of leads qualified automatically by AI" },
  { value: "24/7", label: "AI follow-up, never misses a lead" },
];

export function EditorialNumbers() {
  return (
    <section style={{ backgroundColor: "#030712", fontFamily: "'Plus Jakarta Sans', sans-serif", position: "relative", width: "100%", padding: "80px 24px", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* Strong centred glow matching hero */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 1000, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(34,197,94,0.16) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 980, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ color: "#22c55e", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
            WHAT GROWTHMONK DELIVERS
          </p>
          <h2 style={{ color: "white", fontWeight: 900, fontSize: "clamp(24px,3.5vw,38px)", letterSpacing: "-0.5px", lineHeight: 1.15, margin: 0 }}>
            Results healthcare businesses can measure
          </h2>
        </div>

        {/* Numbers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: "center", padding: "0 20px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
              <div style={{ fontSize: "clamp(64px,8vw,104px)", fontWeight: 900, lineHeight: 1, letterSpacing: "-4px", background: "linear-gradient(160deg, #4ade80 0%, #22c55e 55%, rgba(34,197,94,0.7) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 20 }}>
                {s.value}
              </div>
              <p style={{ color: "rgba(255,255,255,0.60)", fontSize: 13.5, lineHeight: 1.55, fontWeight: 500, margin: 0 }}>
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
