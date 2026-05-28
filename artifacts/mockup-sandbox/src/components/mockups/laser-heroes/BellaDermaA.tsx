// BellaDerma — Clinical Blue/White edition
// 3 scenes crossfade (18s cycle): Laser → Facial/Botox → PRP/Hyaluronic
// Service name + description transitions in perfect sync with background

const SERVICES = [
  {
    bg: "/__mockup/images/bella-services-1.png",
    bgPos: "50% 30%",          // center on smiling woman / laser treatment
    tag: "Laser · Hair Removal",
    title: "Permanent Hair",
    titleAccent: "Removal Berlin",
    sub: "Never shave again — our MedioStar® diode laser delivers lasting smoothness for every skin type.",
    accent: "#2a7fc0",
    pill: "#dff0ff",
    pillText: "#1a5a9a",
  },
  {
    bg: "/__mockup/images/bella-services-2.png",
    bgPos: "75% 25%",          // focus on botox / cosmetic close-up
    tag: "Botox · Cosmetic · IPL",
    title: "Skin Rejuvenation",
    titleAccent: "& Facial Treatments",
    sub: "From IPL skin beautification to Botox and facial cosmetics — visible results, natural glow.",
    accent: "#6a3dc0",
    pill: "#f0ebff",
    pillText: "#4a2a9a",
  },
  {
    bg: "/__mockup/images/bella-services-3.png",
    bgPos: "20% 20%",          // focus on hyaluronic injection close-up face
    tag: "PRP · Hyaluronic · Fillers",
    title: "Aesthetic Medicine",
    titleAccent: "& Rejuvenation",
    sub: "Hyaluronic fillers, PRP therapy, fat-away injections — science-backed, immediately visible results.",
    accent: "#b84a7a",
    pill: "#ffe8f3",
    pillText: "#8a2050",
  },
];

const N = SERVICES.length;
const SCENE = 6;   // seconds per scene
const FADE = 0.8;  // seconds dissolve
const CYCLE = N * SCENE;

function pct(s: number) { return `${((s / CYCLE) * 100).toFixed(2)}%`; }

// Each panel fades in at its slot, holds, then fades out
function bgKf(i: number) {
  const start = i * SCENE;
  const end   = start + SCENE;
  const fi    = start;
  const fo    = end - FADE;
  const ni    = end;  // next panel starts (wraps)
  if (i === 0) {
    return `
      0%          { opacity:1 }
      ${pct(fo)}  { opacity:1 }
      ${pct(ni)}  { opacity:0 }
      ${pct(CYCLE - FADE)} { opacity:0 }
      100%        { opacity:1 }
    `;
  }
  return `
    0%           { opacity:0 }
    ${pct(fi)}   { opacity:0 }
    ${pct(fi + FADE)} { opacity:1 }
    ${pct(fo)}   { opacity:1 }
    ${pct(ni)}   { opacity:0 }
    100%         { opacity:0 }
  `;
}

export function BellaDermaA() {
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');

    .bda-root { font-family:'Inter',sans-serif; }

    ${SERVICES.map((_, i) => `
      @keyframes bdaBg${i} { ${bgKf(i)} }
      @keyframes bdaTx${i} { ${bgKf(i)} }
      .bda-bg${i}  { animation: bdaBg${i} ${CYCLE}s ease-in-out ${i === 0 ? "0s" : `${i * SCENE}s`} infinite; opacity:${i === 0 ? 1 : 0}; }
      .bda-tx${i}  { animation: bdaTx${i} ${CYCLE}s ease-in-out 0s infinite; opacity:${i === 0 ? 1 : 0}; }
    `).join("")}

    @keyframes bdaRise { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
    @keyframes bdaKenBurns { from { transform:scale(1); } to { transform:scale(1.08); } }
    @keyframes bdaPulse { 0%,100%{opacity:.5} 50%{opacity:1} }

    .bda-r1 { animation: bdaRise 0.9s cubic-bezier(.16,1,.3,1) 0.1s both; }
    .bda-r2 { animation: bdaRise 0.9s cubic-bezier(.16,1,.3,1) 0.25s both; }
    .bda-r3 { animation: bdaRise 0.9s cubic-bezier(.16,1,.3,1) 0.4s both; }
    .bda-r4 { animation: bdaRise 0.9s cubic-bezier(.16,1,.3,1) 0.55s both; }
    .bda-r5 { animation: bdaRise 0.9s cubic-bezier(.16,1,.3,1) 0.7s both; }
    .bda-dot { animation: bdaPulse 2.4s ease-in-out infinite; }

    .bda-imgwrap { animation: bdaKenBurns ${CYCLE}s ease-in-out infinite alternate; }
  `;

  return (
    <div className="bda-root" style={{ position:"relative", width:"100%", height:"100dvh", overflow:"hidden", background:"#f0f8ff" }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ── Crossfading background images ── */}
      <div style={{ position:"absolute", inset:0, zIndex:0 }}>
        {SERVICES.map((s, i) => (
          <div key={i} className={`bda-bg${i}`} style={{ position:"absolute", inset:0 }}>
            <div
              className="bda-imgwrap"
              style={{
                position:"absolute", inset:"-8px",
                backgroundImage: `url(${s.bg})`,
                backgroundSize: "cover",
                backgroundPosition: s.bgPos,
              }}
            />
          </div>
        ))}
      </div>

      {/* ── Bright gradient overlay ── */}
      <div style={{ position:"absolute", inset:0, zIndex:1,
        background:"linear-gradient(to right, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.55) 55%, rgba(255,255,255,0.12) 100%)"
      }} />
      {/* Bottom fade */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"160px", zIndex:2,
        background:"linear-gradient(to top, rgba(240,248,255,0.95), transparent)"
      }} />

      {/* ── Nav ── */}
      <div className="bda-r1" style={{ position:"absolute", top:0, width:"100%", padding:"24px 48px", display:"flex", justifyContent:"space-between", alignItems:"center", zIndex:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#2a7fc0,#5ab4f0)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:"#fff", fontSize:"14px", fontWeight:800 }}>B</span>
          </div>
          <span style={{ fontSize:"17px", fontWeight:700, color:"#0f2a45", letterSpacing:"-0.3px" }}>BellaDerma</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"6px 16px", borderRadius:"100px", background:"rgba(42,127,192,0.08)", border:"1px solid rgba(42,127,192,0.22)" }}>
          <span className="bda-dot" style={{ width:7, height:7, borderRadius:"50%", background:"#2a7fc0", display:"inline-block" }} />
          <span style={{ color:"#1a5a9a", fontSize:"12px", fontWeight:600 }}>Berlin Charlottenburg · Since 2006</span>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ position:"absolute", inset:0, zIndex:10, display:"flex", flexDirection:"column", justifyContent:"center", padding:"0 56px", maxWidth:"680px" }}>

        {/* Service pill — transitions per scene */}
        <div className="bda-r2" style={{ marginBottom:20, height:30, position:"relative" }}>
          {SERVICES.map((s, i) => (
            <div key={i} className={`bda-tx${i}`} style={{
              position:"absolute", top:0, left:0,
              display:"inline-flex", alignItems:"center", gap:6,
              padding:"5px 14px", borderRadius:"100px",
              background: s.pill, border:`1px solid ${s.accent}33`,
            }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:s.accent, display:"inline-block" }} />
              <span style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:s.pillText }}>{s.tag}</span>
            </div>
          ))}
        </div>

        {/* Headline — transitions per scene */}
        <div className="bda-r3" style={{ marginBottom:16, minHeight:120, position:"relative" }}>
          {SERVICES.map((s, i) => (
            <div key={i} className={`bda-tx${i}`} style={{ position:"absolute", top:0, left:0 }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(36px,5.5vw,58px)", fontWeight:800, lineHeight:1.08, color:"#0a1e30", letterSpacing:"-1px" }}>
                {s.title}
                <br />
                <span style={{ color: s.accent }}>{s.titleAccent}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Subtext — transitions per scene */}
        <div className="bda-r4" style={{ marginBottom:32, minHeight:56, position:"relative" }}>
          {SERVICES.map((s, i) => (
            <p key={i} className={`bda-tx${i}`} style={{ position:"absolute", top:0, left:0, margin:0, fontSize:"16px", lineHeight:1.7, color:"#3a5570", maxWidth:"440px" }}>
              {s.sub}
            </p>
          ))}
        </div>

        {/* CTAs */}
        <div className="bda-r5" style={{ display:"flex", gap:12, alignItems:"center" }}>
          <button style={{ padding:"14px 32px", borderRadius:"100px", background:"linear-gradient(135deg,#2a7fc0,#5ab4f0)", color:"#fff", fontWeight:700, fontSize:"15px", border:"none", boxShadow:"0 4px 24px rgba(42,127,192,0.4)", cursor:"pointer", fontFamily:"Inter,sans-serif", letterSpacing:"-0.2px" }}>
            Book Appointment
          </button>
          <button style={{ padding:"14px 24px", borderRadius:"100px", background:"rgba(255,255,255,0.8)", color:"#0f2a45", fontWeight:600, fontSize:"15px", border:"1px solid rgba(42,127,192,0.2)", backdropFilter:"blur(8px)", cursor:"pointer", fontFamily:"Inter,sans-serif" }}>
            All Services →
          </button>
        </div>

        {/* Trust bar */}
        <div className="bda-r5" style={{ marginTop:28, display:"flex", gap:24, flexWrap:"wrap" }}>
          {[["19+","Years Experience"],["50k+","Treatments"],["8","Services"],["★ 5.0","Google Rating"]].map(([n,l]) => (
            <div key={l}>
              <div style={{ fontSize:"18px", fontWeight:800, color:"#2a7fc0", fontFamily:"'Playfair Display',serif" }}>{n}</div>
              <div style={{ fontSize:"11px", fontWeight:600, color:"#6a8aaa", textTransform:"uppercase", letterSpacing:"0.08em" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Scene indicator dots ── */}
      <div style={{ position:"absolute", bottom:28, left:"56px", zIndex:20, display:"flex", gap:8 }}>
        {SERVICES.map((s, i) => (
          <div key={i} className={`bda-tx${i}`} style={{
            width: i === 0 ? 24 : 8, height:8, borderRadius:4,
            background: s.accent, opacity: i === 0 ? 1 : 0.35,
            transition:"width 0.4s"
          }} />
        ))}
      </div>
    </div>
  );
}
