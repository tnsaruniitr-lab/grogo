export function LaserTreatment() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="/__mockup/videos/laser-hair-removal.mp4"
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.18) 0%, rgba(240,248,255,0.28) 40%, rgba(220,240,255,0.55) 75%, rgba(248,252,255,0.85) 100%)",
        }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
        <p
          className="text-xs font-semibold uppercase tracking-[0.32em] mb-5"
          style={{ color: "#4a88b8", fontFamily: "Montserrat, sans-serif", letterSpacing: "0.3em" }}
        >
          BellaDerma · Berlin Charlottenburg
        </p>
        <h1
          className="text-6xl font-bold leading-tight mb-5"
          style={{
            color: "#0f2a45",
            fontFamily: "Playfair Display, serif",
            textShadow: "0 2px 24px rgba(200,230,255,0.6)",
          }}
        >
          Laser Hair
          <br />
          <span style={{ color: "#2e7fc0" }}>Removal Berlin</span>
        </h1>
        <p
          className="text-lg max-w-md mb-8"
          style={{ color: "#1a3a58", fontFamily: "Montserrat, sans-serif", lineHeight: 1.75 }}
        >
          Permanent results with the MedioStar® diode laser.
          <br />
          Since 2006 — over 19 years of expertise.
        </p>
        <div className="flex gap-4">
          <button
            className="px-8 py-3 rounded-full text-sm font-semibold tracking-widest uppercase"
            style={{
              background: "linear-gradient(135deg, #2e7fc0, #4ba8e8)",
              color: "#fff",
              fontFamily: "Montserrat, sans-serif",
              boxShadow: "0 4px 28px rgba(46,127,192,0.45)",
              border: "none",
            }}
          >
            Book Appointment
          </button>
          <button
            className="px-8 py-3 rounded-full text-sm font-semibold tracking-widest uppercase"
            style={{
              background: "rgba(255,255,255,0.7)",
              color: "#1a3a58",
              fontFamily: "Montserrat, sans-serif",
              boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
              border: "1px solid rgba(46,127,192,0.3)",
              backdropFilter: "blur(8px)",
            }}
          >
            Our Services
          </button>
        </div>

        <div className="flex gap-8 mt-12">
          {[["19+", "Years Experience"], ["50k+", "Treatments"], ["All", "Skin Types"]].map(([num, label]) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold" style={{ color: "#2e7fc0", fontFamily: "Playfair Display, serif" }}>{num}</div>
              <div className="text-xs uppercase tracking-widest mt-1" style={{ color: "#4a6a88", fontFamily: "Montserrat, sans-serif" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
