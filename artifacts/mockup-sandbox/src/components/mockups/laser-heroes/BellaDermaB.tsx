import React from "react";

// BellaDerma — Option B: Warm Rose-Gold / Luxury
// 3-scene video crossfade: laser → botox/facial → PRP/filler (24s cycle)
// Warm cream background with luminosity blend gives a warm spa/luxury feel

export function BellaDermaB() {
  const scenes = [
    { tag:"Laser Hair Removal",   headline:"Permanently", accent:"Hair-Free Skin",    desc:"MedioStar® diode laser — gentle, permanent, for all skin types.", color:"#b84060" },
    { tag:"Botox & Facial Care",  headline:"Radiant,",    accent:"Youthful Beauty",   desc:"Botox, IPL skin rejuvenation, cosmetic facials — natural results.", color:"#7a40b8" },
    { tag:"PRP & Hyaluronic",     headline:"Sculpted,",   accent:"Natural Glow",      desc:"Hyaluronic fillers and PRP blood plasma therapy — visible immediately.", color:"#c07030" },
  ];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <div style={{ position:"relative", width:"100%", height:"100dvh", overflow:"hidden", backgroundColor:"#fdf0e8", fontFamily:"'Inter',sans-serif" }}>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes bdbV1 {
            0%   { opacity:1 }  29%  { opacity:1 }  33%  { opacity:0 }
            96%  { opacity:0 }  100% { opacity:1 }
          }
          @keyframes bdbV2 {
            0%   { opacity:0 }  29%  { opacity:0 }  33%  { opacity:1 }
            62%  { opacity:1 }  67%  { opacity:0 }  100% { opacity:0 }
          }
          @keyframes bdbV3 {
            0%   { opacity:0 }  62%  { opacity:0 }  67%  { opacity:1 }
            96%  { opacity:1 }  100% { opacity:0 }
          }
          @keyframes bdbT1 {
            0%   { opacity:1 }  29%  { opacity:1 }  33%  { opacity:0 }
            96%  { opacity:0 }  100% { opacity:1 }
          }
          @keyframes bdbT2 {
            0%   { opacity:0 }  29%  { opacity:0 }  33%  { opacity:1 }
            62%  { opacity:1 }  67%  { opacity:0 }  100% { opacity:0 }
          }
          @keyframes bdbT3 {
            0%   { opacity:0 }  62%  { opacity:0 }  67%  { opacity:1 }
            96%  { opacity:1 }  100% { opacity:0 }
          }

          @keyframes bdbRise { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
          @keyframes bdbPulse { 0%,100%{opacity:.4} 50%{opacity:1} }
          @keyframes bdbShim  {
            0%,100%{ background-position:0% 50% }
            50%    { background-position:100% 50% }
          }

          .bdb-v1 { animation: bdbV1 24s ease-in-out infinite; }
          .bdb-v2 { animation: bdbV2 24s ease-in-out infinite; opacity:0; }
          .bdb-v3 { animation: bdbV3 24s ease-in-out infinite; opacity:0; }

          .bdb-s1 { animation: bdbT1 24s ease-in-out infinite; position:absolute; top:0; left:0; width:100%; }
          .bdb-s2 { animation: bdbT2 24s ease-in-out infinite; position:absolute; top:0; left:0; width:100%; opacity:0; }
          .bdb-s3 { animation: bdbT3 24s ease-in-out infinite; position:absolute; top:0; left:0; width:100%; opacity:0; }

          .bdb-r1 { animation: bdbRise 1s cubic-bezier(.16,1,.3,1) .1s both }
          .bdb-r2 { animation: bdbRise 1s cubic-bezier(.16,1,.3,1) .25s both }
          .bdb-r3 { animation: bdbRise 1s cubic-bezier(.16,1,.3,1) .4s both }
          .bdb-r4 { animation: bdbRise 1s cubic-bezier(.16,1,.3,1) .55s both }
          .bdb-r5 { animation: bdbRise 1s cubic-bezier(.16,1,.3,1) .7s both }
          .bdb-pulse { animation: bdbPulse 2.5s ease-in-out infinite }
        ` }} />

        {/* ── 3-scene video backgrounds ── */}
        <div style={{ position:"absolute", inset:0, zIndex:0 }}>
          <video autoPlay muted loop playsInline className="bdb-v1"
            style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }}>
            <source src="/__mockup/videos/bella-laser-hair.mp4" type="video/mp4" />
          </video>
          <video autoPlay muted loop playsInline className="bdb-v2"
            style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }}>
            <source src="/__mockup/videos/bella-botox-facial.mp4" type="video/mp4" />
          </video>
          <video autoPlay muted loop playsInline className="bdb-v3"
            style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }}>
            <source src="/__mockup/videos/bella-prp-filler.mp4" type="video/mp4" />
          </video>
        </div>

        {/* ── Warm overlay — stronger left side, gentle everywhere else ── */}
        <div style={{ position:"absolute", inset:0, zIndex:1,
          background:"linear-gradient(105deg, rgba(253,240,232,0.95) 0%, rgba(253,235,220,0.78) 38%, rgba(253,230,210,0.32) 62%, rgba(253,225,200,0) 100%)"
        }} />
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:160, zIndex:2,
          background:"linear-gradient(to top, rgba(253,240,232,0.95), transparent)"
        }} />

        {/* ── Nav ── */}
        <div className="bdb-r1" style={{ position:"absolute", top:0, width:"100%", padding:"26px 52px", display:"flex", justifyContent:"space-between", alignItems:"center", zIndex:20 }}>
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"22px", fontWeight:700, color:"#2a1008", letterSpacing:"0.08em" }}>
            BELLA<span style={{ color:"#c07030" }}>DERMA</span>
          </span>
          <nav style={{ display:"flex", gap:24 }}>
            {["Treatments","Prices","About","Contact"].map(l => (
              <span key={l} style={{ fontSize:"13px", fontWeight:500, color:"#7a4a30", cursor:"pointer" }}>{l}</span>
            ))}
          </nav>
        </div>

        {/* ── Main content ── */}
        <div style={{ position:"absolute", inset:0, zIndex:10, display:"flex", flexDirection:"column", justifyContent:"center", padding:"0 52px", maxWidth:"640px" }}>

          {/* Tag line — per scene */}
          <div className="bdb-r2" style={{ marginBottom:22, position:"relative", height:22 }}>
            {scenes.map((s, i) => (
              <div key={i} className={`bdb-s${i+1}`} style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ display:"block", width:40, height:2, background:`linear-gradient(90deg,${s.color},${s.color}55)`, flexShrink:0 }} />
                <span style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:s.color }}>{s.tag}</span>
              </div>
            ))}
          </div>

          {/* Headline */}
          <div className="bdb-r3" style={{ marginBottom:18 }}>
            {/* Static first word */}
            <div style={{ position:"relative" }}>
              {/* Rotating headline per scene */}
              <div style={{ position:"relative", minHeight:"clamp(96px,13vw,148px)" }}>
                {scenes.map((s, i) => (
                  <div key={i} className={`bdb-s${i+1}`}
                    style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(46px,6.8vw,76px)", fontWeight:700, lineHeight:1.06, letterSpacing:"-0.5px", color:"#1a0808" }}>
                    {s.headline}
                    <br />
                    <em style={{ color:s.color, fontStyle:"italic" }}>{s.accent}</em>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bdb-r4" style={{ marginBottom:36, position:"relative", minHeight:52 }}>
            {scenes.map((s, i) => (
              <p key={i} className={`bdb-s${i+1}`} style={{ margin:0, fontSize:"16px", lineHeight:1.75, color:"#6a4030", maxWidth:"400px" }}>
                {s.desc}
              </p>
            ))}
          </div>

          {/* CTAs */}
          <div className="bdb-r5" style={{ display:"flex", gap:14, alignItems:"center", marginBottom:28 }}>
            {/* Accent color shifts with scene */}
            <button style={{ padding:"15px 36px", borderRadius:100, background:"linear-gradient(135deg,#c07030,#e8903a)", color:"#fff", fontWeight:700, fontSize:"15px", border:"none", boxShadow:"0 4px 28px rgba(192,112,48,0.4)", cursor:"pointer", fontFamily:"Inter,sans-serif", letterSpacing:"-0.2px" }}>
              Book Appointment
            </button>
            <button style={{ padding:"15px 22px", borderRadius:100, background:"rgba(255,255,255,0.72)", color:"#6a2818", fontWeight:600, fontSize:"15px", border:"1px solid rgba(192,112,48,0.22)", backdropFilter:"blur(10px)", cursor:"pointer", fontFamily:"Inter,sans-serif" }}>
              All Services →
            </button>
          </div>

          {/* Trust strip */}
          <div className="bdb-r5" style={{ display:"flex", gap:28, flexWrap:"wrap" }}>
            {[["19+","Years"],["50k+","Treatments"],["★ 5.0","Google"],["8","Services"]].map(([n,l]) => (
              <div key={l}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"22px", fontWeight:700, color:"#c07030" }}>{n}</div>
                <div style={{ fontSize:"10px", fontWeight:600, color:"#9a6040", textTransform:"uppercase", letterSpacing:"0.1em" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom service strip ── */}
        <div style={{ position:"absolute", bottom:20, left:0, right:0, zIndex:20, display:"flex", justifyContent:"center", gap:28 }}>
          {[
            ["Laser Hair Removal","#b84060"],
            ["Skin Rejuvenation","#7a40b8"],
            ["Botox","#b84060"],
            ["PRP Therapy","#c07030"],
            ["Hyaluronic","#c07030"],
            ["Fat-Away Injection","#7a40b8"],
          ].map(([name, col]) => (
            <div key={name} style={{ display:"flex", alignItems:"center", gap:5 }}>
              <span style={{ width:4, height:4, borderRadius:"50%", background:col as string, display:"inline-block" }} />
              <span style={{ fontSize:"11px", fontWeight:600, color:"#8a5040", letterSpacing:"0.04em" }}>{name as string}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
