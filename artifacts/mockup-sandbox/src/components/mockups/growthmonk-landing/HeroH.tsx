import React from "react";
import { ArrowRight, MessageSquare, CheckCircle2, Phone } from "lucide-react";

export function HeroH() {
  return (
    <>
      <div style={{ position: "relative", width: "100%", height: "100dvh", display: "flex", alignItems: "center", overflow: "hidden", backgroundColor: "#030712", fontFamily: "'Outfit', sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes cf1h {
            0%   { opacity: 1; }
            29%  { opacity: 1; }
            33%  { opacity: 0; }
            96%  { opacity: 0; }
            100% { opacity: 1; }
          }
          @keyframes cf2h {
            0%   { opacity: 0; }
            29%  { opacity: 0; }
            33%  { opacity: 1; }
            62%  { opacity: 1; }
            67%  { opacity: 0; }
            100% { opacity: 0; }
          }
          @keyframes cf3h {
            0%   { opacity: 0; }
            62%  { opacity: 0; }
            67%  { opacity: 1; }
            96%  { opacity: 1; }
            100% { opacity: 0; }
          }
          @keyframes slideR {
            from { opacity: 0; transform: translateX(32px); }
            to   { opacity: 1; transform: translateX(0); }
          }
          @keyframes slideL {
            from { opacity: 0; transform: translateX(-32px); }
            to   { opacity: 1; transform: translateX(0); }
          }
          @keyframes sceneLabel {
            0%, 28% { opacity: 1; transform: translateY(0); }
            33%     { opacity: 0; transform: translateY(-8px); }
            95%     { opacity: 0; transform: translateY(8px); }
            100%    { opacity: 1; transform: translateY(0); }
          }
          .hh-vid1 { animation: cf1h 24s ease-in-out infinite; }
          .hh-vid2 { animation: cf2h 24s ease-in-out infinite; }
          .hh-vid3 { animation: cf3h 24s ease-in-out infinite; }
          .hh-left  { animation: slideL 1s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
          .hh-right { animation: slideR 1s cubic-bezier(0.16,1,0.3,1) 0.4s both; }
          .scene-wellness { animation: sceneLabel 24s ease-in-out 0s infinite; }
          .scene-care     { animation: sceneLabel 24s ease-in-out -16s infinite; }
          .scene-physio   { animation: sceneLabel 24s ease-in-out -8s infinite; }
        ` }} />

        {/* Crossfading videos — right half only */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          {/* Dark left panel */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, #030712 45%, transparent 75%)", zIndex: 2, pointerEvents: "none" }} />
          <video autoPlay muted loop playsInline className="hh-vid1"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 1 }}>
            <source src="/__mockup/videos/wellness-meditation.mp4" type="video/mp4" />
          </video>
          <video autoPlay muted loop playsInline className="hh-vid2"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0 }}>
            <source src="/__mockup/videos/caregiver-hands-healthcare.mp4" type="video/mp4" />
          </video>
          <video autoPlay muted loop playsInline className="hh-vid3"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0 }}>
            <source src="/__mockup/videos/physio-rehab.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Bottom vignette */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "200px", background: "linear-gradient(to top, #030712, transparent)", zIndex: 3, pointerEvents: "none" }} />

        {/* Nav */}
        <div style={{ position: "absolute", top: 0, width: "100%", padding: "28px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 20 }}>
          <span style={{ color: "white", fontWeight: 800, fontSize: "20px", letterSpacing: "-0.4px" }}>GrowthMonk</span>
          <a href="mailto:hello@answermonk.ai" style={{ padding: "10px 22px", borderRadius: "100px", background: "#22c55e", color: "#030712", fontSize: "14px", fontWeight: 700, textDecoration: "none" }}>
            Get Started
          </a>
        </div>

        {/* Left text panel */}
        <div className="hh-left" style={{ position: "relative", zIndex: 10, padding: "0 64px", maxWidth: "620px", display: "flex", flexDirection: "column", gap: "0" }}>

          {/* Scene switcher pill */}
          <div style={{ marginBottom: "28px", display: "flex", gap: "8px" }}>
            {[
              { cls: "scene-wellness", label: "Wellness" },
              { cls: "scene-care",     label: "Elderly Care" },
              { cls: "scene-physio",   label: "Physiotherapy" },
            ].map(({ cls, label }) => (
              <span key={label} className={cls} style={{ padding: "5px 12px", borderRadius: "100px", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", color: "#86efac", fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", position: "absolute" }}>
                {label}
              </span>
            ))}
            <span style={{ visibility: "hidden", padding: "5px 12px", fontSize: "12px" }}>placeholder</span>
          </div>

          <h1 style={{ fontSize: "clamp(38px,5.5vw,80px)", fontWeight: 900, lineHeight: 1.04, letterSpacing: "-2.5px", color: "white", marginBottom: "24px" }}>
            Never Miss a<br />
            <span style={{ color: "#22c55e" }}>Care Lead.</span>
          </h1>

          <p style={{ fontSize: "17px", lineHeight: 1.7, color: "rgba(255,255,255,0.55)", marginBottom: "36px", fontWeight: 400, maxWidth: "440px" }}>
            AI that works across wellness, elderly care, and physiotherapy — capturing every WhatsApp enquiry and booking callbacks automatically.
          </p>

          <div style={{ display: "flex", gap: "12px", marginBottom: "44px" }}>
            <a href="mailto:hello@answermonk.ai" style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "#22c55e", color: "#030712", padding: "15px 32px", borderRadius: "100px", fontWeight: 800, fontSize: "16px", textDecoration: "none", letterSpacing: "-0.3px" }}>
              Book a Demo <ArrowRight size={18} />
            </a>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { icon: <CheckCircle2 size={16} color="#22c55e" />, text: "Responds in under 2 minutes, 24/7" },
              { icon: <MessageSquare size={16} color="#22c55e" />, text: "WhatsApp & Instagram, German & Turkish" },
              { icon: <Phone size={16} color="#22c55e" />, text: "Automatically books patient callbacks" },
            ].map(({ icon, text }, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", color: "rgba(255,255,255,0.5)", fontSize: "14px", fontWeight: 500 }}>
                {icon} {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
