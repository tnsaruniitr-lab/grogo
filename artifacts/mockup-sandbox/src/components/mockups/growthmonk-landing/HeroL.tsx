import React from "react";
import { ArrowRight, MessageSquare, Zap, Globe, Star } from "lucide-react";

// HeroL — 5-scene crossfade + rotating word (Healthcare / Wellness / Clinics)
// wellness → care → physio → dental-clinic-lobby → optical-frames-boutique
export function HeroL() {
  return (
    <>
      <div style={{ position: "relative", width: "100%", height: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", backgroundColor: "#030712", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

        <style dangerouslySetInnerHTML={{ __html: `
          /* ── 5-scene crossfade — 40s cycle, 8s per scene, 1s dissolve ── */
          @keyframes cfl1 {
            0%    { opacity: 1; }
            17.5% { opacity: 1; }
            20%   { opacity: 0; }
            97.5% { opacity: 0; }
            100%  { opacity: 1; }
          }
          @keyframes cfl2 {
            0%    { opacity: 0; }
            17.5% { opacity: 0; }
            20%   { opacity: 1; }
            37.5% { opacity: 1; }
            40%   { opacity: 0; }
            100%  { opacity: 0; }
          }
          @keyframes cfl3 {
            0%    { opacity: 0; }
            37.5% { opacity: 0; }
            40%   { opacity: 1; }
            57.5% { opacity: 1; }
            60%   { opacity: 0; }
            100%  { opacity: 0; }
          }
          @keyframes cfl4 {
            0%    { opacity: 0; }
            57.5% { opacity: 0; }
            60%   { opacity: 1; }
            77.5% { opacity: 1; }
            80%   { opacity: 0; }
            100%  { opacity: 0; }
          }
          @keyframes cfl5 {
            0%    { opacity: 0; }
            77.5% { opacity: 0; }
            80%   { opacity: 1; }
            97.5% { opacity: 1; }
            100%  { opacity: 0; }
          }

          /* ── Word rotation — 24s cycle, 8s per word, opacity only ── */
          @keyframes hlw1 {
            0%        { opacity: 1; }
            29.2%     { opacity: 1; }
            33.3%     { opacity: 0; }
            95.8%     { opacity: 0; }
            100%      { opacity: 1; }
          }
          @keyframes hlw2 {
            0%        { opacity: 0; }
            29.2%     { opacity: 0; }
            33.3%     { opacity: 1; }
            62.5%     { opacity: 1; }
            66.7%     { opacity: 0; }
            100%      { opacity: 0; }
          }
          @keyframes hlw3 {
            0%        { opacity: 0; }
            62.5%     { opacity: 0; }
            66.7%     { opacity: 1; }
            95.8%     { opacity: 1; }
            100%      { opacity: 0; }
          }

          @keyframes riseL {
            from { opacity: 0; transform: translateY(28px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes glowPulseL {
            0%, 100% { opacity: 0.6; }
            50%       { opacity: 1; }
          }

          .hl-vid1 { animation: cfl1 40s ease-in-out infinite; }
          .hl-vid2 { animation: cfl2 40s ease-in-out infinite; }
          .hl-vid3 { animation: cfl3 40s ease-in-out infinite; }
          .hl-vid4 { animation: cfl4 40s ease-in-out infinite; }
          .hl-vid5 { animation: cfl5 40s ease-in-out infinite; }

          .hl-word1 { animation: hlw1 24s ease-in-out infinite; }
          .hl-word2 { animation: hlw2 24s ease-in-out infinite; }
          .hl-word3 { animation: hlw3 24s ease-in-out infinite; }

          .hl-1 { animation: riseL 1s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
          .hl-2 { animation: riseL 1s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
          .hl-3 { animation: riseL 1s cubic-bezier(0.16,1,0.3,1) 0.5s both; }
          .hl-4 { animation: riseL 1s cubic-bezier(0.16,1,0.3,1) 0.7s both; }
          .hl-5 { animation: riseL 1s cubic-bezier(0.16,1,0.3,1) 0.9s both; }
          .hl-glow { animation: glowPulseL 2s ease-in-out infinite; }
        ` }} />

        {/* 5-scene crossfading backgrounds */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <video autoPlay muted loop playsInline className="hl-vid1"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "luminosity", opacity: 1 }}>
            <source src="/__mockup/videos/wellness-meditation.mp4" type="video/mp4" />
          </video>
          <video autoPlay muted loop playsInline className="hl-vid2"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "luminosity", opacity: 0 }}>
            <source src="/__mockup/videos/caregiver-hands-healthcare.mp4" type="video/mp4" />
          </video>
          <video autoPlay muted loop playsInline className="hl-vid3"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "luminosity", opacity: 0 }}>
            <source src="/__mockup/videos/physio-rehab.mp4" type="video/mp4" />
          </video>
          <video autoPlay muted loop playsInline className="hl-vid4"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "luminosity", opacity: 0 }}>
            <source src="/__mockup/videos/dental-clinic-lobby.mp4" type="video/mp4" />
          </video>
          <video autoPlay muted loop playsInline className="hl-vid5"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "luminosity", opacity: 0 }}>
            <source src="/__mockup/videos/optical-frames-boutique.mp4" type="video/mp4" />
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
            <span className="hl-glow" style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#22c55e", display: "inline-block" }} />
            <span style={{ color: "#86efac", fontSize: "13px", fontWeight: 600 }}>Live · Healthcare · Wellness · Clinics</span>
          </div>
        </div>

        {/* Main content */}
        <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 24px", maxWidth: "960px", marginTop: "-40px" }}>

          <div className="hl-1" style={{ marginBottom: "28px", display: "inline-flex", alignItems: "center", gap: "8px", padding: "7px 16px", borderRadius: "100px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
            <span style={{ color: "#86efac", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>AI-Powered Growth Platform</span>
          </div>

          {/* Headline with rotating word */}
          <div className="hl-2" style={{ marginBottom: "32px" }}>
            <div style={{ fontSize: "clamp(40px,6.5vw,90px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-3px", color: "white", marginBottom: "0.05em" }}>
              The AI Growth Engine
            </div>
            <div style={{ fontSize: "clamp(40px,6.5vw,90px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-3px", display: "flex", justifyContent: "center", alignItems: "baseline" }}>
              <span style={{ color: "white", marginRight: "0.28em" }}>for</span>
              {/* Rotating word slot — invisible sizer keeps width stable */}
              <span style={{ position: "relative", display: "inline-block" }}>
                {/* Invisible sizer: widest word */}
                <span style={{ visibility: "hidden", pointerEvents: "none" }}>
                  <span style={{ background: "linear-gradient(90deg, #22c55e, #4ade80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Healthcare.</span>
                </span>
                {/* Animated words */}
                <span className="hl-word1" style={{ position: "absolute", left: 0, top: 0, whiteSpace: "nowrap", background: "linear-gradient(90deg, #22c55e, #4ade80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Healthcare.</span>
                <span className="hl-word2" style={{ position: "absolute", left: 0, top: 0, whiteSpace: "nowrap", background: "linear-gradient(90deg, #22c55e, #4ade80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", opacity: 0 }}>Wellness.</span>
                <span className="hl-word3" style={{ position: "absolute", left: 0, top: 0, whiteSpace: "nowrap", background: "linear-gradient(90deg, #22c55e, #4ade80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", opacity: 0 }}>Clinics.</span>
              </span>
            </div>
          </div>

          <p className="hl-3" style={{ fontSize: "19px", lineHeight: 1.7, color: "rgba(255,255,255,0.55)", maxWidth: "540px", marginBottom: "44px", fontWeight: 400 }}>
            Capture every WhatsApp enquiry. Qualify leads automatically. Book callbacks without lifting a finger — 24/7, in German &amp; Turkish.
          </p>

          <div className="hl-4" style={{ display: "flex", gap: "12px", marginBottom: "52px" }}>
            <a href="mailto:hello@answermonk.ai" style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "#22c55e", color: "#030712", padding: "16px 36px", borderRadius: "100px", fontWeight: 800, fontSize: "17px", textDecoration: "none", letterSpacing: "-0.3px", boxShadow: "0 0 48px rgba(34,197,94,0.35)" }}>
              Book a Free Demo <ArrowRight size={20} />
            </a>
          </div>

          <div className="hl-5" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px 40px", color: "rgba(255,255,255,0.38)", fontSize: "13px", fontWeight: 600 }}>
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
