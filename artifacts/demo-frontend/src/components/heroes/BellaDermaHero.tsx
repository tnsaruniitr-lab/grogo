import { ArrowRight, Phone } from "lucide-react";

// Option B — Warm Rose-Gold / Luxury
// 3-scene video crossfade: laser → botox/facial → PRP/filler (24s cycle)

interface BellaDermaHeroProps {
  companyName: string;
  logoUrl?: string | null;
  headline: string;
  subtext: string;
  phone?: string | null;
  city?: string | null;
  onCtaClick: () => void;
}

const SCENES = [
  {
    video: "bella-laser-hair-v2.mp4",
    tag:     "Laser Hair Removal",
    heading: "Permanently",
    accent:  "Hair-Free Skin",
    desc:    "MedioStar® diode laser — gentle, permanent, for all skin types.",
    color:   "#b84060",
  },
  {
    video: "bella-botox-facial-v2.mp4",
    tag:     "Botox & Facial Care",
    heading: "Radiant,",
    accent:  "Youthful Beauty",
    desc:    "Botox, IPL skin rejuvenation, cosmetic facials — natural results.",
    color:   "#7a40b8",
  },
  {
    video: "bella-prp-filler-v2.mp4",
    tag:     "PRP & Hyaluronic",
    heading: "Sculpted,",
    accent:  "Natural Glow",
    desc:    "Hyaluronic fillers and PRP blood plasma therapy — visible immediately.",
    color:   "#c07030",
  },
];

const BASE = import.meta.env.BASE_URL;

export function BellaDermaHero({
  companyName,
  logoUrl,
  headline,
  subtext,
  phone,
  city,
  onCtaClick,
}: BellaDermaHeroProps) {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <section
        style={{
          position: "relative",
          width: "100%",
          height: "100dvh",
          overflow: "hidden",
          backgroundColor: "#fdf0e8",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes bdV1 {
            0%{opacity:1} 29%{opacity:1} 33%{opacity:0} 96%{opacity:0} 100%{opacity:1}
          }
          @keyframes bdV2 {
            0%{opacity:0} 29%{opacity:0} 33%{opacity:1} 62%{opacity:1} 67%{opacity:0} 100%{opacity:0}
          }
          @keyframes bdV3 {
            0%{opacity:0} 62%{opacity:0} 67%{opacity:1} 96%{opacity:1} 100%{opacity:0}
          }
          .bd-v1 { animation: bdV1 24s ease-in-out infinite; }
          .bd-v2 { animation: bdV2 24s ease-in-out infinite; opacity:0; }
          .bd-v3 { animation: bdV3 24s ease-in-out infinite; opacity:0; }

          .bd-s1 { animation: bdV1 24s ease-in-out infinite; position:absolute; top:0; left:0; width:100%; }
          .bd-s2 { animation: bdV2 24s ease-in-out infinite; position:absolute; top:0; left:0; width:100%; opacity:0; }
          .bd-s3 { animation: bdV3 24s ease-in-out infinite; position:absolute; top:0; left:0; width:100%; opacity:0; }

          @keyframes bdRise { from{opacity:0;transform:translateY(26px)} to{opacity:1;transform:translateY(0)} }
          @keyframes bdPulse { 0%,100%{opacity:.4} 50%{opacity:1} }
          .bd-r1{animation:bdRise 1s cubic-bezier(.16,1,.3,1) .1s both}
          .bd-r2{animation:bdRise 1s cubic-bezier(.16,1,.3,1) .25s both}
          .bd-r3{animation:bdRise 1s cubic-bezier(.16,1,.3,1) .40s both}
          .bd-r4{animation:bdRise 1s cubic-bezier(.16,1,.3,1) .55s both}
          .bd-r5{animation:bdRise 1s cubic-bezier(.16,1,.3,1) .70s both}
          .bd-dot{animation:bdPulse 2.5s ease-in-out infinite}
        ` }} />

        {/* ── 3-scene video backgrounds ── */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          {SCENES.map((s, i) => (
            <video
              key={i}
              autoPlay muted loop playsInline
              className={`bd-v${i + 1}`}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            >
              <source src={`${BASE}videos/${s.video}`} type="video/mp4" />
            </video>
          ))}
        </div>

        {/* ── Warm overlay — text legibility on left, video visible on right ── */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: "linear-gradient(105deg, rgba(253,240,232,0.96) 0%, rgba(253,235,220,0.82) 35%, rgba(253,230,210,0.35) 60%, rgba(253,225,200,0) 100%)",
        }} />
        {/* Bottom vignette */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 180, zIndex: 2,
          background: "linear-gradient(to top, rgba(253,240,232,0.96), transparent)",
        }} />

        {/* ── Nav ── */}
        <nav className="bd-r1" style={{
          position: "absolute", top: 0, width: "100%", padding: "26px 52px",
          display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {logoUrl ? (
              <img src={logoUrl} alt={companyName} style={{ height: 44, objectFit: "contain", maxWidth: 160 }} />
            ) : (
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 22, fontWeight: 700, color: "#2a1008", letterSpacing: "0.08em",
              }}>
                {companyName.toUpperCase()}
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span className="bd-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "#c07030", display: "inline-block" }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#7a4a30" }}>
              {city ?? "Berlin Charlottenburg"} · Since 2006
            </span>
          </div>
        </nav>

        {/* ── Main copy ── */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 10,
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "0 52px", maxWidth: 640,
        }}>

          {/* Scene tag */}
          <div className="bd-r2" style={{ marginBottom: 22, position: "relative", height: 22 }}>
            {SCENES.map((s, i) => (
              <div key={i} className={`bd-s${i + 1}`} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ display: "block", width: 40, height: 2, background: `linear-gradient(90deg,${s.color},${s.color}55)`, flexShrink: 0 }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: s.color }}>
                  {s.tag}
                </span>
              </div>
            ))}
          </div>

          {/* Headline — scene-synced */}
          <div className="bd-r3" style={{ marginBottom: 18, position: "relative", minHeight: "clamp(100px,14vw,150px)" }}>
            {SCENES.map((s, i) => (
              <div key={i} className={`bd-s${i + 1}`} style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(46px,6.5vw,74px)", fontWeight: 700, lineHeight: 1.06,
                letterSpacing: "-0.5px", color: "#1a0808",
              }}>
                {s.heading}
                <br />
                <em style={{ color: s.color, fontStyle: "italic" }}>{s.accent}</em>
              </div>
            ))}
          </div>

          {/* Sub — scene-synced */}
          <div className="bd-r4" style={{ marginBottom: 36, position: "relative", minHeight: 52 }}>
            {SCENES.map((s, i) => (
              <p key={i} className={`bd-s${i + 1}`} style={{ margin: 0, fontSize: 16, lineHeight: 1.75, color: "#6a4030", maxWidth: 420 }}>
                {s.desc}
              </p>
            ))}
          </div>

          {/* CTAs */}
          <div className="bd-r5" style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" as const, marginBottom: 28 }}>
            <button
              onClick={onCtaClick}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "15px 34px", borderRadius: 100,
                background: "linear-gradient(135deg,#c07030,#e8903a)",
                color: "#fff", fontWeight: 700, fontSize: 15,
                border: "none", fontFamily: "Inter,sans-serif",
                boxShadow: "0 4px 28px rgba(192,112,48,0.42)",
                cursor: "pointer", letterSpacing: "-0.2px",
              }}
            >
              Book Appointment <ArrowRight size={16} />
            </button>
            {phone && (
              <button
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "15px 22px", borderRadius: 100,
                  background: "rgba(255,255,255,0.75)",
                  color: "#6a2818", fontWeight: 600, fontSize: 15,
                  border: "1px solid rgba(192,112,48,0.25)",
                  backdropFilter: "blur(10px)",
                  cursor: "pointer", fontFamily: "Inter,sans-serif",
                }}
              >
                <Phone size={15} /> {phone}
              </button>
            )}
          </div>

          {/* Trust strip */}
          <div className="bd-r5" style={{ display: "flex", gap: 28, flexWrap: "wrap" as const }}>
            {[["19+", "Years"], ["50k+", "Treatments"], ["★ 5.0", "Google"], ["8", "Services"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, color: "#c07030" }}>{n}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#9a6040", textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom service strip ── */}
        <div style={{
          position: "absolute", bottom: 20, left: 0, right: 0, zIndex: 20,
          display: "flex", justifyContent: "center", gap: 28, flexWrap: "wrap" as const,
          padding: "0 20px",
        }}>
          {[
            ["Laser Hair Removal", "#b84060"],
            ["Skin Rejuvenation",  "#7a40b8"],
            ["Botox",              "#b84060"],
            ["PRP Therapy",        "#c07030"],
            ["Hyaluronic Acid",    "#c07030"],
            ["Fat-Away Injection", "#7a40b8"],
          ].map(([name, col]) => (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: col, display: "inline-block" }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: "#8a5040", letterSpacing: "0.04em" }}>{name}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
