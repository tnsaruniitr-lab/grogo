export function FacialAesthetic() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="/__mockup/videos/facial-aesthetic.mp4"
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,248,245,0.15) 0%, rgba(255,235,225,0.22) 40%, rgba(255,220,210,0.52) 75%, rgba(255,250,248,0.88) 100%)",
        }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
        <p
          className="text-xs font-semibold uppercase tracking-[0.32em] mb-5"
          style={{ color: "#b06050", fontFamily: "Montserrat, sans-serif" }}
        >
          BellaDerma · Berlin Charlottenburg
        </p>
        <h1
          className="text-6xl font-bold leading-tight mb-5"
          style={{
            color: "#2a1008",
            fontFamily: "Playfair Display, serif",
            textShadow: "0 2px 24px rgba(255,200,180,0.5)",
          }}
        >
          Aesthetic
          <br />
          <span style={{ color: "#c0503a" }}>Medicine Berlin</span>
        </h1>
        <p
          className="text-lg max-w-md mb-8"
          style={{ color: "#5a2a1a", fontFamily: "Montserrat, sans-serif", lineHeight: 1.75 }}
        >
          Botox · Hyaluronic Acid · PRP Therapy · Cosmetic
          <br />
          Expert care for radiant, youthful skin.
        </p>
        <div className="flex gap-4">
          <button
            className="px-8 py-3 rounded-full text-sm font-semibold tracking-widest uppercase"
            style={{
              background: "linear-gradient(135deg, #c0503a, #d87860)",
              color: "#fff",
              fontFamily: "Montserrat, sans-serif",
              boxShadow: "0 4px 28px rgba(192,80,58,0.45)",
              border: "none",
            }}
          >
            Book Appointment
          </button>
          <button
            className="px-8 py-3 rounded-full text-sm font-semibold tracking-widest uppercase"
            style={{
              background: "rgba(255,255,255,0.7)",
              color: "#5a2a1a",
              fontFamily: "Montserrat, sans-serif",
              boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
              border: "1px solid rgba(192,80,58,0.25)",
              backdropFilter: "blur(8px)",
            }}
          >
            Our Services
          </button>
        </div>

        <div className="flex gap-8 mt-12">
          {[["8", "Treatments"], ["19+", "Years"], ["5★", "Rated"]].map(([num, label]) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold" style={{ color: "#c0503a", fontFamily: "Playfair Display, serif" }}>{num}</div>
              <div className="text-xs uppercase tracking-widest mt-1" style={{ color: "#8a5040", fontFamily: "Montserrat, sans-serif" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
