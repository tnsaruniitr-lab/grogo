import React from "react";
import { ArrowRight, MessageSquare, Zap, Globe, Star } from "lucide-react";

// 5-scene crossfade: wellness → care → physio → dental → laser-eye (40s cycle)
// Rotating words: Healthcare / Wellness / Clinics / Dental / Optical (25s cycle)
export function HeroK() {
  const words = ["Healthcare", "Wellness", "Clinics", "Dental", "Optical"];

  return (
    <>
      <div style={{ position: "relative", width: "100%", height: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", backgroundColor: "#030712", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

        <style dangerouslySetInnerHTML={{ __html: `
          /* ── 5-scene video crossfade — 40s cycle, 8s per scene, 1s dissolve ── */
          @keyframes cfk1 {
            0%     { opacity: 1; }
            17.5%  { opacity: 1; }
            20%    { opacity: 0; }
            97.5%  { opacity: 0; }
            100%   { opacity: 1; }
          }
          @keyframes cfk2 {
            0%     { opacity: 0; }
            17.5%  { opacity: 0; }
            20%    { opacity: 1; }
            37.5%  { opacity: 1; }
            40%    { opacity: 0; }
            100%   { opacity: 0; }
          }
          @keyframes cfk3 {
            0%     { opacity: 0; }
            37.5%  { opacity: 0; }
            40%    { opacity: 1; }
            57.5%  { opacity: 1; }
            60%    { opacity: 0; }
            100%   { opacity: 0; }
          }
          @keyframes cfk4 {
            0%     { opacity: 0; }
            57.5%  { opacity: 0; }
            60%    { opacity: 1; }
            77.5%  { opacity: 1; }
            80%    { opacity: 0; }
            100%   { opacity: 0; }
          }
          @keyframes cfk5 {
            0%     { opacity: 0; }
            77.5%  { opacity: 0; }
            80%    { opacity: 1; }
            97.5%  { opacity: 1; }
            100%   { opacity: 0; }
          }

          /* ── 5-word rotation — 25s cycle, 5s per word, slide up in/out ── */
          @keyframes rotW0 {
            0%    { opacity: 1;  transform: translateY(0); }
            16%   { opacity: 1;  transform: translateY(0); }
            20%   { opacity: 0;  transform: translateY(-110%); }
            96%   { opacity: 0;  transform: translateY(110%); }
            100%  { opacity: 1;  transform: translateY(0); }
          }
          @keyframes rotW1 {
            0%    { opacity: 0;  transform: translateY(110%); }
            16%   { opacity: 0;  transform: translateY(110%); }
            20%   { opacity: 1;  transform: translateY(0); }
            36%   { opacity: 1;  transform: translateY(0); }
            40%   { opacity: 0;  transform: translateY(-110%); }
            100%  { opacity: 0;  transform: translateY(110%); }
          }
          @keyframes rotW2 {
            0%    { opacity: 0;  transform: translateY(110%); }
            36%   { opacity: 0;  transform: translateY(110%); }
            40%   { opacity: 1;  transform: translateY(0); }
            56%   { opacity: 1;  transform: translateY(0); }
            60%   { opacity: 0;  transform: translateY(-110%); }
            100%  { opacity: 0;  transform: translateY(110%); }
          }
          @keyframes rotW3 {
            0%    { opacity: 0;  transform: translateY(110%); }
            56%   { opacity: 0;  transform: translateY(110%); }
            60%   { opacity: 1;  transform: translateY(0); }
            76%   { opacity: 1;  transform: translateY(0); }
            80%   { opacity: 0;  transform: translateY(-110%); }
            100%  { opacity: 0;  transform: translateY(110%); }
          }
          @keyframes rotW4 {
            0%    { opacity: 0;  transform: translateY(110%); }
            76%   { opacity: 0;  transform: translateY(110%); }
            80%   { opacity: 1;  transform: translateY(0); }
            96%   { opacity: 1;  transform: translateY(0); }
            100%  { opacity: 0;  transform: translateY(-110%); }
          }

          @keyframes riseK {
            from { opacity: 0; transform: translateY(28px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes glowPulseK {
            0%, 100% { opacity: 0.6; }
            50%       { opacity: 1; }
          }

          .hk-vid1 { animation: cfk1 40s ease-in-out infinite; }
          .hk-vid2 { animation: cfk2 40s ease-in-out infinite; }
          .hk-vid3 { animation: cfk3 40s ease-in-out infinite; }
          .hk-vid4 { animation: cfk4 40s ease-in-out infinite; }
          .hk-vid5 { animation: cfk5 40s ease-in-out infinite; }

          .hk-1 { animation: riseK 1s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
          .hk-2 { animation: riseK 1s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
          .hk-3 { animation: riseK 1s cubic-bezier(0.16,1,0.3,1) 0.5s both; }
          .hk-4 { animation: riseK 1s cubic-bezier(0.16,1,0.3,1) 0.7s both; }
          .hk-5 { animation: riseK 1s cubic-bezier(0.16,1,0.3,1) 0.9s both; }
          .hk-glow { animation: glowPulseK 2s ease-in-out infinite; }

          /* Rotating word slot — block-level, owns its own clipping */
          .hk-slot {
            position: relative;
            overflow: hidden;
            height: 1.15em;
            display: inline-block;
            min-width: 300px;
            vertical-align: top;
          }
          .hk-word {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            background: linear-gradient(90deg, #22c55e, #4ade80);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            white-space: nowrap;
          }
          .hk-w0 { animation: rotW0 25s cubic-bezier(0.16,1,0.3,1) 1s infinite; }
          .hk-w1 { animation: rotW1 25s cubic-bezier(0.16,1,0.3,1) 1s infinite; }
          .hk-w2 { animation: rotW2 25s cubic-bezier(0.16,1,0.3,1) 1s infinite; }
          .hk-w3 { animation: rotW3 25s cubic-bezier(0.16,1,0.3,1) 1s infinite; }
          .hk-w4 { animation: rotW4 25s cubic-bezier(0.16,1,0.3,1) 1s infinite; }
        ` }} />

        {/* 5-scene crossfading video backgrounds */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <video autoPlay muted loop playsInline className="hk-vid1"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "luminosity", opacity: 1 }}>
            <source src="/__mockup/videos/wellness-meditation.mp4" type="video/mp4" />
          </video>
          <video autoPlay muted loop playsInline className="hk-vid2"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "luminosity", opacity: 0 }}>
            <source src="/__mockup/videos/caregiver-hands-healthcare.mp4" type="video/mp4" />
          </video>
          <video autoPlay muted loop playsInline className="hk-vid3"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "luminosity", opacity: 0 }}>
            <source src="/__mockup/videos/physio-rehab.mp4" type="video/mp4" />
          </video>
          <video autoPlay muted loop playsInline className="hk-vid4"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "luminosity", opacity: 0 }}>
            <source src="/__mockup/videos/dental-smile.mp4" type="video/mp4" />
          </video>
          <video autoPlay muted loop playsInline className="hk-vid5"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "luminosity", opacity: 0 }}>
            <source src="/__mockup/videos/laser-eye.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Dark overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(160deg, rgba(3,7,18,0.92) 0%, rgba(5,25,12,0.6) 50%, rgba(3,7,18,0.90) 100%)" }} />

        {/* Green glow */}
        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: "700px", height: "400px", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(34,197,94,0.15) 0%, transparent 70%)", zIndex: 1, pointerEvents: "none" }} />

        {/* Nav */}
        <div style={{ position: "absolute", top: 0, width: "100%", padding: "28px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 20 }}>
          <span style={{ color: "white", fontWeight: 800, fontSize: "20px", letterSpacing: "-0.4px" }}>GrowthMonk</span>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 16px", borderRadius: "100px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)" }}>
            <span className="hk-glow" style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#22c55e", display: "inline-block" }} />
            <span style={{ color: "#86efac", fontSize: "13px", fontWeight: 600 }}>Wellness · Care · Physio · Dental · Optical</span>
          </div>
        </div>

        {/* Main content */}
        <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 24px", maxWidth: "960px", marginTop: "-40px" }}>

          <div className="hk-1" style={{ marginBottom: "28px", display: "inline-flex", alignItems: "center", gap: "8px", padding: "7px 16px", borderRadius: "100px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
            <span style={{ color: "#86efac", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>AI-Powered Growth Platform</span>
          </div>

          {/* ── Headline — flex column, rotating word is its own block, NOT inside h1 ── */}
          <div className="hk-2" style={{ marginBottom: "32px" }}>
            {/* Line 1 — static */}
            <div style={{ fontSize: "clamp(40px,6.5vw,90px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-3px", color: "white" }}>
              The AI Growth Engine
            </div>
            {/* Line 2 — "for" + rotating slot as flex siblings, no h1 wrapping the slot */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: "0.22em", fontSize: "clamp(40px,6.5vw,90px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-3px" }}>
              <span style={{ color: "white" }}>for</span>
              {/* Slot is a sibling div — owns its own overflow:hidden, parent line-box cannot clip it */}
              <span className="hk-slot">
                {words.map((word, i) => (
                  <span key={word} className={`hk-word hk-w${i}`}>{word}</span>
                ))}
              </span>
            </div>
          </div>

          <p className="hk-3" style={{ fontSize: "19px", lineHeight: 1.7, color: "rgba(255,255,255,0.55)", maxWidth: "540px", marginBottom: "44px", fontWeight: 400 }}>
            Capture every WhatsApp enquiry. Qualify leads automatically. Book callbacks without lifting a finger — 24/7, in German &amp; Turkish.
          </p>

          <div className="hk-4" style={{ display: "flex", gap: "12px", marginBottom: "52px" }}>
            <a href="mailto:hello@answermonk.ai" style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "#22c55e", color: "#030712", padding: "16px 36px", borderRadius: "100px", fontWeight: 800, fontSize: "17px", textDecoration: "none", letterSpacing: "-0.3px", boxShadow: "0 0 48px rgba(34,197,94,0.35)" }}>
              Book a Free Demo <ArrowRight size={20} />
            </a>
          </div>

          <div className="hk-5" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px 40px", color: "rgba(255,255,255,0.38)", fontSize: "13px", fontWeight: 600 }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Zap size={14} color="#22c55e" /> 80% leads auto-qualified</span>
            <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><MessageSquare size={14} color="#22c55e" /> &lt;2 min response</span>
            <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Globe size={14} color="#22c55e" /> 24-hr setup</span>
            <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Star size={14} color="#22c55e" /> DE &amp; TR bilingual</span>
          </div>
        </div>

        {/* Scene labels — bottom left */}
        <div style={{ position: "absolute", bottom: "28px", left: "40px", zIndex: 20, display: "flex", gap: "8px", alignItems: "center" }}>
          {["Wellness", "Care", "Physio", "Dental", "Optical"].map((label) => (
            <span key={label} style={{ padding: "4px 10px", borderRadius: "100px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.35)", fontSize: "11px", fontWeight: 600 }}>{label}</span>
          ))}
        </div>
      </div>
    </>
  );
}
