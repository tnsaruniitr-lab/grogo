// BellaDerma — Warm Rose-Gold / Luxury edition
// 3 scenes crossfade (18s cycle): Laser → Facial/Botox → PRP/Hyaluronic
// Full-bleed image background, centered content, warm palette

const SERVICES = [
  {
    bg: "/__mockup/images/bella-services-1.png",
    bgPos: "50% 20%",
    tag: "Laser Hair Removal",
    title: "Permanently",
    titleAccent: "Hair-Free Skin",
    sub: "MedioStar® diode laser — the gold standard for all skin & hair types.",
    color: "#b84060",
  },
  {
    bg: "/__mockup/images/bella-services-2.png",
    bgPos: "78% 18%",
    tag: "Botox & Cosmetic Treatments",
    title: "Radiant,",
    titleAccent: "Youthful Beauty",
    sub: "Botox, IPL skin rejuvenation, facial cosmetics — immediate, visible results.",
    color: "#7a50c0",
  },
  {
    bg: "/__mockup/images/bella-services-3.png",
    bgPos: "18% 15%",
    tag: "PRP · Hyaluronic · Fillers",
    title: "Sculpted",
    titleAccent: "Natural Glow",
    sub: "Hyaluronic fillers, PRP blood plasma therapy, precision fat-away injections.",
    color: "#c07030",
  },
];

const N = SERVICES.length;
const SCENE = 6;
const FADE  = 0.8;
const CYCLE = N * SCENE;

function pct(s: number) { return `${((s / CYCLE) * 100).toFixed(2)}%`; }
function kf(i: number) {
  const start = i * SCENE, end = start + SCENE, fo = end - FADE;
  if (i === 0) return `0%{opacity:1} ${pct(fo)}{opacity:1} ${pct(end)}{opacity:0} ${pct(CYCLE-FADE)}{opacity:0} 100%{opacity:1}`;
  return `0%{opacity:0} ${pct(start)}{opacity:0} ${pct(start+FADE)}{opacity:1} ${pct(fo)}{opacity:1} ${pct(end)}{opacity:0} 100%{opacity:0}`;
}

export function BellaDermaB() {
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap');
    .bdb-root { font-family:'Inter',sans-serif; }
    ${SERVICES.map((_,i) => `
      @keyframes bdbBg${i} { ${kf(i)} }
      .bdb-bg${i} { animation:bdbBg${i} ${CYCLE}s ease-in-out infinite; opacity:${i===0?1:0}; }
      .bdb-tx${i} { animation:bdbBg${i} ${CYCLE}s ease-in-out infinite; opacity:${i===0?1:0}; }
    `).join("")}
    @keyframes bdbRise  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
    @keyframes bdbKB    { from{transform:scale(1)} to{transform:scale(1.1)} }
    @keyframes bdbShim  { 0%,100%{opacity:.4} 50%{opacity:.9} }
    .bdb-r1 { animation:bdbRise .9s cubic-bezier(.16,1,.3,1) .1s both }
    .bdb-r2 { animation:bdbRise .9s cubic-bezier(.16,1,.3,1) .25s both }
    .bdb-r3 { animation:bdbRise .9s cubic-bezier(.16,1,.3,1) .4s both }
    .bdb-r4 { animation:bdbRise .9s cubic-bezier(.16,1,.3,1) .55s both }
    .bdb-r5 { animation:bdbRise .9s cubic-bezier(.16,1,.3,1) .7s both }
    .bdb-kb  { animation:bdbKB ${CYCLE}s ease-in-out infinite alternate }
    .bdb-shim{ animation:bdbShim 3s ease-in-out infinite }
    .bdb-line{ display:block; width:48px; height:2px; margin-bottom:20px }
  `;

  return (
    <div className="bdb-root" style={{ position:"relative", width:"100%", height:"100dvh", overflow:"hidden", background:"#fff8f2" }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ── Crossfading backgrounds ── */}
      <div style={{ position:"absolute", inset:0, zIndex:0 }}>
        {SERVICES.map((s, i) => (
          <div key={i} className={`bdb-bg${i}`} style={{ position:"absolute", inset:0 }}>
            <div className="bdb-kb" style={{
              position:"absolute", inset:"-10px",
              backgroundImage:`url(${s.bg})`,
              backgroundSize:"cover",
              backgroundPosition: s.bgPos,
            }} />
          </div>
        ))}
      </div>

      {/* ── Warm bright overlay — strong on left for text legibility ── */}
      <div style={{ position:"absolute", inset:0, zIndex:1,
        background:"linear-gradient(105deg, rgba(255,252,248,0.96) 0%, rgba(255,245,235,0.82) 38%, rgba(255,235,220,0.38) 65%, rgba(255,230,210,0.05) 100%)"
      }} />
      {/* Bottom fade */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:180, zIndex:2,
        background:"linear-gradient(to top, rgba(255,248,242,0.98) 0%, transparent 100%)"
      }} />
      {/* Shimmer accent glow */}
      {SERVICES.map((s,i) => (
        <div key={i} className={`bdb-tx${i} bdb-shim`} style={{
          position:"absolute", top:"25%", left:"5%",
          width:500, height:500, borderRadius:"50%", zIndex:1, pointerEvents:"none",
          background:`radial-gradient(ellipse, ${s.color}18 0%, transparent 70%)`,
        }} />
      ))}

      {/* ── Nav ── */}
      <div className="bdb-r1" style={{ position:"absolute", top:0, width:"100%", padding:"26px 52px", display:"flex", justifyContent:"space-between", alignItems:"center", zIndex:20 }}>
        <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"22px", fontWeight:700, color:"#2a1008", letterSpacing:"0.05em" }}>
          BELLA<span style={{ color:"#c07030" }}>DERMA</span>
        </span>
        <div style={{ display:"flex", gap:20 }}>
          {["Treatments","Prices","About","Contact"].map(l => (
            <span key={l} style={{ fontSize:"13px", fontWeight:500, color:"#6a4030", cursor:"pointer" }}>{l}</span>
          ))}
        </div>
      </div>

      {/* ── Main copy ── */}
      <div style={{ position:"absolute", inset:0, zIndex:10, display:"flex", flexDirection:"column", justifyContent:"center", padding:"0 52px", maxWidth:"640px" }}>

        {/* Scene tag */}
        <div className="bdb-r2" style={{ marginBottom:22, height:28, position:"relative" }}>
          {SERVICES.map((s, i) => (
            <div key={i} className={`bdb-tx${i}`} style={{ position:"absolute", top:0, left:0, display:"flex", alignItems:"center", gap:8 }}>
              <span className="bdb-line" style={{ background:`linear-gradient(90deg,${s.color},${s.color}55)` }} />
              <span style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:s.color }}>{s.tag}</span>
            </div>
          ))}
        </div>

        {/* Big headline */}
        <div className="bdb-r3" style={{ marginBottom:18, position:"relative", minHeight:130 }}>
          {SERVICES.map((s, i) => (
            <div key={i} className={`bdb-tx${i}`} style={{ position:"absolute", top:0, left:0 }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(44px,6.5vw,72px)", fontWeight:700, lineHeight:1.05, color:"#1a0808", letterSpacing:"-0.5px" }}>
                {s.title}
                <br />
                <em style={{ color: s.color, fontStyle:"italic" }}>{s.titleAccent}</em>
              </div>
            </div>
          ))}
        </div>

        {/* Sub */}
        <div className="bdb-r4" style={{ marginBottom:36, position:"relative", minHeight:52 }}>
          {SERVICES.map((s, i) => (
            <p key={i} className={`bdb-tx${i}`} style={{ position:"absolute", top:0, left:0, margin:0, fontSize:"16px", lineHeight:1.75, color:"#6a4030", maxWidth:"420px" }}>
              {s.sub}
            </p>
          ))}
        </div>

        {/* CTAs */}
        <div className="bdb-r5" style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
          <button style={{ padding:"15px 36px", borderRadius:"100px", background:"linear-gradient(135deg,#c07030,#e09050)", color:"#fff", fontWeight:700, fontSize:"15px", border:"none", fontFamily:"Inter,sans-serif", boxShadow:"0 4px 28px rgba(192,112,48,0.42)", cursor:"pointer", letterSpacing:"-0.2px" }}>
            Book Appointment
          </button>
          <button style={{ padding:"15px 24px", borderRadius:"100px", background:"rgba(255,255,255,0.75)", color:"#6a2818", fontWeight:600, fontSize:"15px", border:"1px solid rgba(192,112,48,0.25)", backdropFilter:"blur(10px)", cursor:"pointer", fontFamily:"Inter,sans-serif" }}>
            View All Services →
          </button>
        </div>
      </div>

      {/* ── Bottom service strip ── */}
      <div style={{ position:"absolute", bottom:22, left:0, right:0, zIndex:20, display:"flex", justifyContent:"center", gap:32 }}>
        {[["💆","Laser Hair Removal"],["✨","Skin Rejuvenation"],["💉","Botox & Fillers"],["🩸","PRP Therapy"],["🔬","Fat-Away Injection"]].map(([icon, name]) => (
          <div key={name} style={{ display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ fontSize:"11px" }}>{icon}</span>
            <span style={{ fontSize:"11px", fontWeight:600, color:"#8a5040", letterSpacing:"0.04em" }}>{name}</span>
          </div>
        ))}
      </div>

      {/* ── Scene dots ── */}
      <div style={{ position:"absolute", left:52, bottom:60, zIndex:20, display:"flex", gap:6 }}>
        {SERVICES.map((s, i) => (
          <div key={i} className={`bdb-tx${i}`} style={{
            height:6, width:6, borderRadius:"50%",
            background: s.color, transition:"opacity 0.4s",
          }} />
        ))}
      </div>
    </div>
  );
}
