import React from "react";

// BellaDerma — Combined Hero
// Single 8s brand-overview video (laser → facial → skin glow)
// Warm rose-gold / Cormorant Garamond — same look & feel as Option B

export function BellaDermaCombined() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400;1,700&family=Inter:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div style={{
        position: "relative", width: "100%", height: "100dvh",
        overflow: "hidden", backgroundColor: "#fdf0e8",
        fontFamily: "'Inter', sans-serif",
      }}>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes bdcRise { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
          @keyframes bdcPulse { 0%,100%{opacity:.35} 50%{opacity:1} }
          @keyframes bdcLine { from{width:0} to{width:52px} }
          @keyframes bdcFadeIn { from{opacity:0} to{opacity:1} }

          .bdc-r1{animation:bdcRise 1s cubic-bezier(.16,1,.3,1) .05s both}
          .bdc-r2{animation:bdcRise 1s cubic-bezier(.16,1,.3,1) .18s both}
          .bdc-r3{animation:bdcRise 1s cubic-bezier(.16,1,.3,1) .32s both}
          .bdc-r4{animation:bdcRise 1s cubic-bezier(.16,1,.3,1) .46s both}
          .bdc-r5{animation:bdcRise 1s cubic-bezier(.16,1,.3,1) .60s both}
          .bdc-r6{animation:bdcRise 1s cubic-bezier(.16,1,.3,1) .74s both}
          .bdc-pulse{animation:bdcPulse 2.6s ease-in-out infinite}
          .bdc-line{animation:bdcLine 1s cubic-bezier(.16,1,.3,1) .8s both; width:0}
          .bdc-fade{animation:bdcFadeIn 1.4s ease .9s both; opacity:0}
        ` }} />

        {/* ── Single combined brand video ── */}
        <video
          autoPlay muted loop playsInline
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%", objectFit: "cover",
            zIndex: 0,
          }}
        >
          <source src="/__mockup/videos/bella-hero-combined.mp4" type="video/mp4" />
        </video>

        {/* ── Warm left-to-right gradient overlay ── */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: "linear-gradient(108deg, rgba(253,240,232,0.97) 0%, rgba(253,234,218,0.84) 32%, rgba(253,228,208,0.40) 58%, rgba(253,222,198,0.06) 100%)",
        }} />
        {/* Bottom vignette */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 180, zIndex: 2,
          background: "linear-gradient(to top, rgba(253,240,232,0.98) 0%, transparent 100%)",
        }} />

        {/* ── Top nav ── */}
        <div className="bdc-r1" style={{
          position: "absolute", top: 0, width: "100%",
          padding: "26px 52px", zIndex: 30,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 22, fontWeight: 700,
            color: "#2a1008", letterSpacing: "0.09em",
          }}>
            BELLA<span style={{ color: "#c07030" }}>DERMA</span>
          </span>
          <nav style={{ display: "flex", gap: 28 }}>
            {["Treatments", "Prices", "About", "Contact"].map(l => (
              <span key={l} style={{ fontSize: 13, fontWeight: 500, color: "#7a4a30", cursor: "pointer" }}>{l}</span>
            ))}
          </nav>
        </div>

        {/* ── Main copy ── */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 20,
          display: "flex", flexDirection: "column",
          justifyContent: "center",
          padding: "0 52px", maxWidth: 620,
        }}>

          {/* Location tag */}
          <div className="bdc-r2" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <span className="bdc-pulse" style={{
              width: 7, height: 7, borderRadius: "50%",
              background: "#c07030", display: "inline-block", flexShrink: 0,
            }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "#c07030" }}>
              Berlin Charlottenburg · Medical Aesthetics Since 2006
            </span>
          </div>

          {/* Main headline */}
          <div className="bdc-r3" style={{ marginBottom: 10 }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(50px,7vw,80px)", fontWeight: 700,
              lineHeight: 1.04, letterSpacing: "-0.5px",
              color: "#1a0808",
            }}>
              Your Beauty,
            </div>
          </div>
          <div className="bdc-r4" style={{ marginBottom: 22 }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(50px,7vw,80px)", fontWeight: 700,
              lineHeight: 1.04, letterSpacing: "-0.5px",
              fontStyle: "italic",
              color: "#c07030",
            }}>
              Expertly Crafted.
            </div>
          </div>

          {/* Divider line */}
          <div className="bdc-line" style={{
            height: 2, marginBottom: 22, flexShrink: 0,
            background: "linear-gradient(90deg, #c07030, #c0703055)",
          }} />

          {/* Services inline */}
          <div className="bdc-r5" style={{
            display: "flex", flexWrap: "wrap" as const, gap: "6px 18px",
            marginBottom: 32,
          }}>
            {[
              ["Laser Hair Removal", "#b84060"],
              ["Botox & Fillers",    "#7a40b8"],
              ["PRP Therapy",        "#c07030"],
              ["Skin Rejuvenation",  "#b84060"],
              ["LED Facial",         "#7a40b8"],
              ["Fat-Away Injection", "#c07030"],
            ].map(([name, col]) => (
              <div key={name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: col, display: "inline-block", flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6a4030", letterSpacing: "0.04em" }}>{name}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="bdc-r6" style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 32, flexWrap: "wrap" as const }}>
            <button style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "15px 36px", borderRadius: 100,
              background: "linear-gradient(135deg, #c07030, #e8903a)",
              color: "#fff", fontWeight: 700, fontSize: 15,
              border: "none",
              boxShadow: "0 4px 28px rgba(192,112,48,0.42)",
              cursor: "pointer", fontFamily: "Inter, sans-serif",
              letterSpacing: "-0.2px",
            }}>
              Book Appointment →
            </button>
            <button style={{
              padding: "15px 24px", borderRadius: 100,
              background: "rgba(255,255,255,0.72)",
              color: "#6a2818", fontWeight: 600, fontSize: 15,
              border: "1px solid rgba(192,112,48,0.25)",
              backdropFilter: "blur(10px)",
              cursor: "pointer", fontFamily: "Inter, sans-serif",
            }}>
              All Services
            </button>
          </div>

          {/* Trust stats */}
          <div className="bdc-fade" style={{ display: "flex", gap: 32, flexWrap: "wrap" as const }}>
            {[["19+","Years"],["50k+","Treatments"],["★ 5.0","Google"],["8","Services"]].map(([n,l]) => (
              <div key={l}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 700, color: "#c07030" }}>{n}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#9a6040", textTransform: "uppercase" as const, letterSpacing: "0.12em" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
