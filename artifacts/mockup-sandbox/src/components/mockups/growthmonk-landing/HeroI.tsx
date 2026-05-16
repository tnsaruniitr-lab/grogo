import React from "react";
import { ArrowRight, Zap, MessageSquare, Globe } from "lucide-react";

export function HeroI() {
  return (
    <>
      <div style={{ position: "relative", width: "100%", height: "100dvh", display: "flex", alignItems: "flex-end", justifyContent: "flex-start", overflow: "hidden", backgroundColor: "#030712", fontFamily: "'Space Grotesk', sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes cf1i {
            0%   { opacity: 1; }
            29%  { opacity: 1; }
            33%  { opacity: 0; }
            96%  { opacity: 0; }
            100% { opacity: 1; }
          }
          @keyframes cf2i {
            0%   { opacity: 0; }
            29%  { opacity: 0; }
            33%  { opacity: 1; }
            62%  { opacity: 1; }
            67%  { opacity: 0; }
            100% { opacity: 0; }
          }
          @keyframes cf3i {
            0%   { opacity: 0; }
            62%  { opacity: 0; }
            67%  { opacity: 1; }
            96%  { opacity: 1; }
            100% { opacity: 0; }
          }
          @keyframes riseI {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes progressBar {
            0%   { width: 0%; }
            29%  { width: 100%; }
            33%  { width: 0%; }
            62%  { width: 100%; }
            66%  { width: 0%; }
            96%  { width: 100%; }
            100% { width: 100%; }
          }
          @keyframes glowI {
            0%, 100% { box-shadow: 0 0 40px rgba(34,197,94,0.2); }
            50%       { box-shadow: 0 0 80px rgba(34,197,94,0.4); }
          }
          .hi-vid1 { animation: cf1i 24s ease-in-out infinite; }
          .hi-vid2 { animation: cf2i 24s ease-in-out infinite; }
          .hi-vid3 { animation: cf3i 24s ease-in-out infinite; }
          .hi-1 { animation: riseI 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
          .hi-2 { animation: riseI 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
          .hi-3 { animation: riseI 0.9s cubic-bezier(0.16,1,0.3,1) 0.45s both; }
          .hi-4 { animation: riseI 0.9s cubic-bezier(0.16,1,0.3,1) 0.6s both; }
          .hi-cta { animation: glowI 3s ease-in-out infinite; }
          .progress-fill { animation: progressBar 24s ease-in-out infinite; }
        ` }} />

        {/* Full-bleed crossfading videos */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <video autoPlay muted loop playsInline className="hi-vid1"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 1 }}>
            <source src="/__mockup/videos/wellness-meditation.mp4" type="video/mp4" />
          </video>
          <video autoPlay muted loop playsInline className="hi-vid2"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0 }}>
            <source src="/__mockup/videos/caregiver-hands-healthcare.mp4" type="video/mp4" />
          </video>
          <video autoPlay muted loop playsInline className="hi-vid3"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0 }}>
            <source src="/__mockup/videos/physio-rehab.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Strong bottom gradient — text sits at bottom */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(to top, rgba(3,7,18,1) 0%, rgba(3,7,18,0.85) 35%, rgba(3,7,18,0.3) 65%, rgba(3,7,18,0.1) 100%)" }} />

        {/* Nav */}
        <div style={{ position: "absolute", top: 0, width: "100%", padding: "28px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 20 }}>
          <span style={{ color: "white", fontWeight: 700, fontSize: "20px", letterSpacing: "-0.5px" }}>GrowthMonk</span>
          <div style={{ display: "flex", gap: "8px" }}>
            {["Wellness", "Care", "Physio"].map((l) => (
              <span key={l} style={{ padding: "5px 12px", borderRadius: "100px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)", fontSize: "12px", fontWeight: 600 }}>{l}</span>
            ))}
          </div>
        </div>

        {/* Scene progress bar */}
        <div style={{ position: "absolute", bottom: "200px", left: "48px", right: "48px", zIndex: 20, display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.3)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            <span>Wellness</span><span>Elderly Care</span><span>Physiotherapy</span>
          </div>
          <div style={{ height: "2px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", overflow: "hidden" }}>
            <div className="progress-fill" style={{ height: "100%", background: "linear-gradient(90deg, #22c55e, #4ade80)", borderRadius: "2px", width: "0%" }} />
          </div>
        </div>

        {/* Bottom text content */}
        <div style={{ position: "relative", zIndex: 10, padding: "0 48px 140px", maxWidth: "820px" }}>
          <div className="hi-1" style={{ marginBottom: "20px", display: "inline-flex", alignItems: "center", gap: "8px", padding: "7px 16px", borderRadius: "6px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
            <span style={{ color: "#86efac", fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>AI-Powered Healthcare Growth</span>
          </div>

          <h1 className="hi-2" style={{ fontSize: "clamp(40px,6.5vw,90px)", fontWeight: 700, lineHeight: 1.04, letterSpacing: "-2.5px", color: "white", marginBottom: "20px" }}>
            Every Enquiry.<br />
            <span style={{ color: "#22c55e" }}>Captured. Qualified.<br />Converted.</span>
          </h1>

          <p className="hi-3" style={{ fontSize: "17px", lineHeight: 1.65, color: "rgba(255,255,255,0.5)", marginBottom: "36px", fontWeight: 400, maxWidth: "480px" }}>
            Wellness, elderly care, physiotherapy — one AI that handles every lead across every service, in German and Turkish.
          </p>

          <div className="hi-4" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <a href="mailto:hello@answermonk.ai" className="hi-cta" style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "#22c55e", color: "#030712", padding: "15px 32px", borderRadius: "10px", fontWeight: 700, fontSize: "16px", textDecoration: "none", letterSpacing: "-0.2px" }}>
              Book a Demo <ArrowRight size={18} />
            </a>
            <div style={{ display: "flex", gap: "24px", color: "rgba(255,255,255,0.35)", fontSize: "13px", fontWeight: 500 }}>
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><Zap size={13} color="#22c55e" /> 80% auto-qualified</span>
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><MessageSquare size={13} color="#22c55e" /> &lt;2 min reply</span>
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><Globe size={13} color="#22c55e" /> DE &amp; TR</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
