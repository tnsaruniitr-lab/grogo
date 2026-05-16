import React from "react";
import { ArrowRight, MessageSquare, Zap, Globe, Star } from "lucide-react";

// HeroG clone — identical layout, slower & dreamier crossfade (48s cycle, 2s dissolve)
export function HeroJ() {
  return (
    <>
      <div style={{ position: "relative", width: "100%", height: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", backgroundColor: "#030712", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes cfj1 {
            0%   { opacity: 1; }
            30%  { opacity: 1; }
            35%  { opacity: 0; }
            97%  { opacity: 0; }
            100% { opacity: 1; }
          }
          @keyframes cfj2 {
            0%   { opacity: 0; }
            30%  { opacity: 0; }
            35%  { opacity: 1; }
            63%  { opacity: 1; }
            68%  { opacity: 0; }
            100% { opacity: 0; }
          }
          @keyframes cfj3 {
            0%   { opacity: 0; }
            63%  { opacity: 0; }
            68%  { opacity: 1; }
            97%  { opacity: 1; }
            100% { opacity: 0; }
          }
          @keyframes riseJ {
            from { opacity: 0; transform: translateY(28px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes glowPulseJ {
            0%, 100% { opacity: 0.6; }
            50%       { opacity: 1; }
          }
          .hj-vid1 { animation: cfj1 48s ease-in-out infinite; }
          .hj-vid2 { animation: cfj2 48s ease-in-out infinite; }
          .hj-vid3 { animation: cfj3 48s ease-in-out infinite; }
          .hj-1 { animation: riseJ 1s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
          .hj-2 { animation: riseJ 1s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
          .hj-3 { animation: riseJ 1s cubic-bezier(0.16,1,0.3,1) 0.5s both; }
          .hj-4 { animation: riseJ 1s cubic-bezier(0.16,1,0.3,1) 0.7s both; }
          .hj-5 { animation: riseJ 1s cubic-bezier(0.16,1,0.3,1) 0.9s both; }
          .hj-glow { animation: glowPulseJ 3s ease-in-out infinite; }
        ` }} />

        {/* Crossfading video backgrounds — slow 48s cycle */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <video autoPlay muted loop playsInline className="hj-vid1"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "luminosity", opacity: 1 }}>
            <source src="/__mockup/videos/wellness-meditation.mp4" type="video/mp4" />
          </video>
          <video autoPlay muted loop playsInline className="hj-vid2"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "luminosity", opacity: 0 }}>
            <source src="/__mockup/videos/caregiver-hands-healthcare.mp4" type="video/mp4" />
          </video>
          <video autoPlay muted loop playsInline className="hj-vid3"
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
            <span className="hj-glow" style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#22c55e", display: "inline-block" }} />
            <span style={{ color: "#86efac", fontSize: "13px", fontWeight: 600 }}>Live · Wellness · Care · Physio</span>
          </div>
        </div>

        {/* Main content */}
        <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 24px", maxWidth: "920px", marginTop: "-40px" }}>

          <div className="hj-1" style={{ marginBottom: "28px", display: "flex", alignItems: "center", gap: "6px" }}>
            {["Wellness", "·", "Elderly Care", "·", "Physiotherapy"].map((t, i) => (
              <span key={i} style={{ color: i % 2 === 1 ? "rgba(255,255,255,0.2)" : "#86efac", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>{t}</span>
            ))}
          </div>

          <h1 className="hj-2" style={{ fontSize: "clamp(44px,7vw,100px)", fontWeight: 900, lineHeight: 1.02, letterSpacing: "-3px", color: "white", marginBottom: "8px" }}>
            One AI. Every
          </h1>
          <h1 className="hj-2" style={{ fontSize: "clamp(44px,7vw,100px)", fontWeight: 900, lineHeight: 1.02, letterSpacing: "-3px", marginBottom: "32px" }}>
            <span style={{ background: "linear-gradient(90deg, #22c55e, #4ade80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Care Journey.</span>
          </h1>

          <p className="hj-3" style={{ fontSize: "19px", lineHeight: 1.7, color: "rgba(255,255,255,0.55)", maxWidth: "540px", marginBottom: "44px", fontWeight: 400 }}>
            From wellness enquiries to elderly care callbacks and physio bookings — AI captures every lead, in any language, around the clock.
          </p>

          <div className="hj-4" style={{ display: "flex", gap: "12px", marginBottom: "52px" }}>
            <a href="mailto:hello@answermonk.ai" style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "#22c55e", color: "#030712", padding: "16px 36px", borderRadius: "100px", fontWeight: 800, fontSize: "17px", textDecoration: "none", letterSpacing: "-0.3px", boxShadow: "0 0 48px rgba(34,197,94,0.35)" }}>
              Book a Free Demo <ArrowRight size={20} />
            </a>
          </div>

          <div className="hj-5" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px 40px", color: "rgba(255,255,255,0.38)", fontSize: "13px", fontWeight: 600 }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Zap size={14} color="#22c55e" /> 80% leads auto-qualified</span>
            <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><MessageSquare size={14} color="#22c55e" /> &lt;2 min response</span>
            <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Globe size={14} color="#22c55e" /> 24-hr setup</span>
            <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Star size={14} color="#22c55e" /> DE &amp; TR bilingual</span>
          </div>
        </div>

        {/* Scene label bottom-left */}
        <div style={{ position: "absolute", bottom: "28px", left: "40px", zIndex: 20, display: "flex", gap: "8px", alignItems: "center" }}>
          {["Wellness", "Care", "Physio"].map((label, i) => (
            <span key={i} style={{ padding: "4px 10px", borderRadius: "100px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.35)", fontSize: "11px", fontWeight: 600 }}>{label}</span>
          ))}
        </div>
      </div>
    </>
  );
}
