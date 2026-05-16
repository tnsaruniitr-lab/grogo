import React from "react";
import { ArrowRight, MessageSquare, Zap, Globe, Star } from "lucide-react";

// 3-scene crossfade: wellness → care → physio (24s cycle)
// Rotating words fade in/out — no slide, no overflow clipping
export function HeroK() {
  const words = ["Healthcare", "Wellness", "Clinics"];

  return (
    <>
      <div style={{ position: "relative", width: "100%", height: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", backgroundColor: "#030712", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

        <style dangerouslySetInnerHTML={{ __html: `
          /* ── 3-scene video crossfade — 24s cycle, 8s per scene, 1s dissolve ── */
          @keyframes cfk1 {
            0%    { opacity: 1; }
            29%   { opacity: 1; }
            33%   { opacity: 0; }
            96%   { opacity: 0; }
            100%  { opacity: 1; }
          }
          @keyframes cfk2 {
            0%    { opacity: 0; }
            29%   { opacity: 0; }
            33%   { opacity: 1; }
            62%   { opacity: 1; }
            67%   { opacity: 0; }
            100%  { opacity: 0; }
          }
          @keyframes cfk3 {
            0%    { opacity: 0; }
            62%   { opacity: 0; }
            67%   { opacity: 1; }
            96%   { opacity: 1; }
            100%  { opacity: 0; }
          }

          /* ── Word crossfade — pure opacity, no translate, no overflow needed ── */
          /* 15s cycle, 5s per word, 1s fade */
          @keyframes rotW0 {
            0%    { opacity: 1; }
            27%   { opacity: 1; }
            33%   { opacity: 0; }
            95%   { opacity: 0; }
            100%  { opacity: 1; }
          }
          @keyframes rotW1 {
            0%    { opacity: 0; }
            27%   { opacity: 0; }
            33%   { opacity: 1; }
            60%   { opacity: 1; }
            67%   { opacity: 0; }
            100%  { opacity: 0; }
          }
          @keyframes rotW2 {
            0%    { opacity: 0; }
            60%   { opacity: 0; }
            67%   { opacity: 1; }
            95%   { opacity: 1; }
            100%  { opacity: 0; }
          }

          @keyframes riseK {
            from { opacity: 0; transform: translateY(28px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes glowPulseK {
            0%, 100% { opacity: 0.6; }
            50%       { opacity: 1; }
          }

          .hk-vid1 { animation: cfk1 24s ease-in-out infinite; }
          .hk-vid2 { animation: cfk2 24s ease-in-out infinite; }
          .hk-vid3 { animation: cfk3 24s ease-in-out infinite; }

          .hk-1 { animation: riseK 1s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
          .hk-2 { animation: riseK 1s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
          .hk-3 { animation: riseK 1s cubic-bezier(0.16,1,0.3,1) 0.5s both; }
          .hk-4 { animation: riseK 1s cubic-bezier(0.16,1,0.3,1) 0.7s both; }
          .hk-5 { animation: riseK 1s cubic-bezier(0.16,1,0.3,1) 0.9s both; }
          .hk-glow { animation: glowPulseK 2s ease-in-out infinite; }

          /* Word slot — stacked, opacity crossfade only, no clip needed */
          .hk-slot {
            position: relative;
            display: inline-block;
          }
          .hk-word {
            background: linear-gradient(90deg, #22c55e, #4ade80);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            white-space: nowrap;
          }
          .hk-word-under {
            /* hidden words sit invisibly but maintain slot width */
            position: absolute;
            left: 0;
            top: 0;
            pointer-events: none;
          }
          .hk-w0 { animation: rotW0 15s ease-in-out 1s infinite; }
          .hk-w1 { animation: rotW1 15s ease-in-out 1s infinite; }
          .hk-w2 { animation: rotW2 15s ease-in-out 1s infinite; }
        ` }} />

        {/* 3-scene crossfading video backgrounds */}
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
            <span style={{ color: "#86efac", fontSize: "13px", fontWeight: 600 }}>Live · Wellness · Care · Physio</span>
          </div>
        </div>

        {/* Main content */}
        <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 24px", maxWidth: "960px", marginTop: "-40px" }}>

          <div className="hk-1" style={{ marginBottom: "28px", display: "inline-flex", alignItems: "center", gap: "8px", padding: "7px 16px", borderRadius: "100px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
            <span style={{ color: "#86efac", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>AI-Powered Growth Platform</span>
          </div>

          {/* Headline — two separate block lines, slot is NOT inside an h1 */}
          <div className="hk-2" style={{ marginBottom: "32px" }}>
            {/* Line 1 */}
            <div style={{ fontSize: "clamp(40px,6.5vw,90px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-3px", color: "white", marginBottom: "0.05em" }}>
              The AI Growth Engine
            </div>
            {/* Line 2 — "for" and the rotating slot are plain inline text, no h1 wrapping */}
            <div style={{ fontSize: "clamp(40px,6.5vw,90px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-3px", color: "white" }}>
              {"for "}
              {/* Slot: the widest word ("Healthcare") always occupies space; others overlay it */}
              <span className="hk-slot">
                {/* Invisible sizer — always present, keeps the slot wide enough */}
                <span style={{ visibility: "hidden", pointerEvents: "none" }}>Healthcare</span>
                {/* Animated words — positioned over the sizer */}
                {words.map((word, i) => (
                  <span
                    key={word}
                    className={`hk-word hk-word-under hk-w${i}`}
                    style={{ opacity: i === 0 ? 1 : 0 }}
                  >
                    {word}
                  </span>
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
      </div>
    </>
  );
}
