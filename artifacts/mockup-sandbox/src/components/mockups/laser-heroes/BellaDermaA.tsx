import React from "react";

// BellaDerma — Option A: Clinical Blue/White
// 3-scene video crossfade: laser → botox/facial → PRP/filler (24s cycle)
// Mirrors HeroK pattern: autoPlay muted loop playsInline + CSS opacity keyframes
// Light luminosity blend keeps the look bright and medical

export function BellaDermaA() {
  const services = [
    { label: "Laser Hair Removal Berlin",   desc: "Permanent hair removal with MedioStar® diode laser — never shave again." },
    { label: "Botox & Facial Treatments",   desc: "Smooth wrinkles, refresh your complexion — natural, immediate results." },
    { label: "PRP & Hyaluronic Fillers",    desc: "Platelet-rich plasma therapy and precision fillers for lasting rejuvenation." },
  ];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <div style={{ position:"relative", width:"100%", height:"100dvh", overflow:"hidden", backgroundColor:"#e8f4ff", fontFamily:"'Inter',sans-serif" }}>

        <style dangerouslySetInnerHTML={{ __html: `
          /* ── 3-scene video crossfade — 24s cycle, 8s per scene, 1s dissolve ── */
          @keyframes bdaV1 {
            0%   { opacity:1 }  29%  { opacity:1 }  33%  { opacity:0 }
            96%  { opacity:0 }  100% { opacity:1 }
          }
          @keyframes bdaV2 {
            0%   { opacity:0 }  29%  { opacity:0 }  33%  { opacity:1 }
            62%  { opacity:1 }  67%  { opacity:0 }  100% { opacity:0 }
          }
          @keyframes bdaV3 {
            0%   { opacity:0 }  62%  { opacity:0 }  67%  { opacity:1 }
            96%  { opacity:1 }  100% { opacity:0 }
          }

          /* ── Service text crossfade — same timing ── */
          @keyframes bdaT1 {
            0%   { opacity:1 }  29%  { opacity:1 }  33%  { opacity:0 }
            96%  { opacity:0 }  100% { opacity:1 }
          }
          @keyframes bdaT2 {
            0%   { opacity:0 }  29%  { opacity:0 }  33%  { opacity:1 }
            62%  { opacity:1 }  67%  { opacity:0 }  100% { opacity:0 }
          }
          @keyframes bdaT3 {
            0%   { opacity:0 }  62%  { opacity:0 }  67%  { opacity:1 }
            96%  { opacity:1 }  100% { opacity:0 }
          }

          @keyframes bdaRise { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
          @keyframes bdaPulse { 0%,100%{opacity:.45} 50%{opacity:1} }
          @keyframes bdaDot   { 0%,100%{width:24px} 33%{width:8px} 67%{width:8px} }

          .bda-v1 { animation: bdaV1 24s ease-in-out infinite; }
          .bda-v2 { animation: bdaV2 24s ease-in-out infinite; opacity:0; }
          .bda-v3 { animation: bdaV3 24s ease-in-out infinite; opacity:0; }

          .bda-s1 { animation: bdaT1 24s ease-in-out infinite; position:absolute; top:0; left:0; width:100%; }
          .bda-s2 { animation: bdaT2 24s ease-in-out infinite; position:absolute; top:0; left:0; width:100%; opacity:0; }
          .bda-s3 { animation: bdaT3 24s ease-in-out infinite; position:absolute; top:0; left:0; width:100%; opacity:0; }

          .bda-r1 { animation: bdaRise 1s cubic-bezier(.16,1,.3,1) .1s both }
          .bda-r2 { animation: bdaRise 1s cubic-bezier(.16,1,.3,1) .25s both }
          .bda-r3 { animation: bdaRise 1s cubic-bezier(.16,1,.3,1) .4s both }
          .bda-r4 { animation: bdaRise 1s cubic-bezier(.16,1,.3,1) .55s both }
          .bda-r5 { animation: bdaRise 1s cubic-bezier(.16,1,.3,1) .7s both }
          .bda-pulse { animation: bdaPulse 2.4s ease-in-out infinite }
        ` }} />

        {/* ── 3-scene video backgrounds ── */}
        <div style={{ position:"absolute", inset:0, zIndex:0 }}>
          <video autoPlay muted loop playsInline className="bda-v1"
            style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }}>
            <source src="/__mockup/videos/bella-laser-hair-v2.mp4" type="video/mp4" />
          </video>
          <video autoPlay muted loop playsInline className="bda-v2"
            style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }}>
            <source src="/__mockup/videos/bella-botox-facial-v2.mp4" type="video/mp4" />
          </video>
          <video autoPlay muted loop playsInline className="bda-v3"
            style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }}>
            <source src="/__mockup/videos/bella-prp-filler-v2.mp4" type="video/mp4" />
          </video>
        </div>

        {/* ── Bright left overlay for text legibility ── */}
        <div style={{ position:"absolute", inset:0, zIndex:1,
          background:"linear-gradient(to right, rgba(232,244,255,0.92) 0%, rgba(232,244,255,0.72) 40%, rgba(232,244,255,0.18) 65%, rgba(232,244,255,0) 100%)"
        }} />
        {/* Bottom fade */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:120, zIndex:2,
          background:"linear-gradient(to top, rgba(220,238,255,0.9), transparent)"
        }} />

        {/* ── Nav ── */}
        <div className="bda-r1" style={{ position:"absolute", top:0, width:"100%", padding:"24px 52px", display:"flex", justifyContent:"space-between", alignItems:"center", zIndex:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#1a6fc0,#4da8f0)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ color:"#fff", fontSize:"15px", fontWeight:800 }}>B</span>
            </div>
            <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"18px", fontWeight:700, color:"#0a1e38", letterSpacing:"0.02em" }}>BellaDerma</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 16px", borderRadius:100, background:"rgba(26,111,192,0.08)", border:"1px solid rgba(26,111,192,0.22)" }}>
            <span className="bda-pulse" style={{ width:7, height:7, borderRadius:"50%", background:"#1a6fc0", display:"inline-block" }} />
            <span style={{ color:"#1a4a80", fontSize:"12px", fontWeight:600 }}>Berlin Charlottenburg · 8 Treatments</span>
          </div>
        </div>

        {/* ── Main content ── */}
        <div style={{ position:"absolute", inset:0, zIndex:10, display:"flex", flexDirection:"column", justifyContent:"center", padding:"0 52px", maxWidth:"640px" }}>

          {/* Service tag — animates with each scene */}
          <div className="bda-r2" style={{ marginBottom:20, position:"relative", height:26 }}>
            {services.map((s, i) => (
              <div key={i} className={`bda-s${i+1}`} style={{ display:"inline-flex", alignItems:"center", gap:6 }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:"#1a6fc0", display:"inline-block", flexShrink:0 }} />
                <span style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"#1a4a80" }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* Headline — static big line + rotating service accent */}
          <div className="bda-r3" style={{ marginBottom:16 }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(38px,5.5vw,62px)", fontWeight:800, lineHeight:1.07, color:"#0a1e38", letterSpacing:"-1.5px" }}>
              Our Treatments
            </div>
            {/* Rotating second line per scene */}
            <div style={{ position:"relative", height:"clamp(44px,6vw,68px)", marginTop:4 }}>
              {[
                { text:"Laser Hair Removal", color:"#1a6fc0" },
                { text:"Botox & Cosmetic",   color:"#6a3db8" },
                { text:"PRP & Fillers",       color:"#b83060" },
              ].map((w, i) => (
                <div key={i} className={`bda-s${i+1}`}
                  style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(38px,5.5vw,62px)", fontWeight:800, lineHeight:1.07, letterSpacing:"-1.5px", color:w.color }}>
                  {w.text}
                </div>
              ))}
            </div>
          </div>

          {/* Description — animates with each scene */}
          <div className="bda-r4" style={{ marginBottom:36, position:"relative", minHeight:50 }}>
            {services.map((s, i) => (
              <p key={i} className={`bda-s${i+1}`} style={{ margin:0, fontSize:"16px", lineHeight:1.72, color:"#2a4a6a", maxWidth:"420px" }}>
                {s.desc}
              </p>
            ))}
          </div>

          {/* CTAs */}
          <div className="bda-r5" style={{ display:"flex", gap:12, alignItems:"center", marginBottom:28 }}>
            <button style={{ padding:"14px 32px", borderRadius:100, background:"linear-gradient(135deg,#1a6fc0,#4da8f0)", color:"#fff", fontWeight:700, fontSize:"15px", border:"none", boxShadow:"0 4px 24px rgba(26,111,192,0.42)", cursor:"pointer", fontFamily:"Inter,sans-serif" }}>
              Book Appointment
            </button>
            <button style={{ padding:"14px 22px", borderRadius:100, background:"rgba(255,255,255,0.75)", color:"#0a1e38", fontWeight:600, fontSize:"15px", border:"1px solid rgba(26,111,192,0.2)", backdropFilter:"blur(8px)", cursor:"pointer", fontFamily:"Inter,sans-serif" }}>
              View All Offers →
            </button>
          </div>

          {/* Trust strip */}
          <div className="bda-r5" style={{ display:"flex", gap:28, flexWrap:"wrap" }}>
            {[["19+","Years"],["50k+","Treatments"],["★ 5.0","Google"],["8","Services"]].map(([n,l]) => (
              <div key={l}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"20px", fontWeight:700, color:"#1a6fc0" }}>{n}</div>
                <div style={{ fontSize:"10px", fontWeight:600, color:"#4a7aaa", textTransform:"uppercase", letterSpacing:"0.1em" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Scene indicator ── */}
        <div style={{ position:"absolute", bottom:24, left:52, zIndex:20, display:"flex", gap:6, alignItems:"center" }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ height:4, borderRadius:2, background:"#1a6fc0",
              animation:`bdaV${i+1} 24s ease-in-out infinite`,
              opacity: i === 0 ? 1 : 0.3
            }} />
          ))}
        </div>
      </div>
    </>
  );
}
