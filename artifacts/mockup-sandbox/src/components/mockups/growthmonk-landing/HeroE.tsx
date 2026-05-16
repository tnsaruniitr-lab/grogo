import React from "react";
import { Activity, ArrowRight, Zap, MessageSquare, Globe } from "lucide-react";

export function HeroE() {
  return (
    <>
      <div
        style={{ position: "relative", width: "100%", height: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", backgroundColor: "#020c14", fontFamily: "'Space Grotesk', sans-serif" }}
      >
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(28px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulseLine {
            0%, 100% { opacity: 0.6; transform: scaleX(1); }
            50% { opacity: 1; transform: scaleX(1.02); }
          }
          @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100vh); }
          }
          .he-1 { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
          .he-2 { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
          .he-3 { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s both; }
          .he-4 { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.7s both; }
          .he-5 { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.9s both; }
          .pulse-line { animation: pulseLine 2.5s ease-in-out infinite; }
          .scanline {
            position: absolute; left: 0; right: 0; height: 2px;
            background: linear-gradient(90deg, transparent, rgba(34,197,94,0.15), transparent);
            animation: scanline 8s linear infinite;
            pointer-events: none; z-index: 2;
          }
        ` }} />

        {/* Video Background — heartbeat pulse */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <video
            autoPlay muted loop playsInline
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "screen", opacity: 0.6 }}
          >
            <source src="/__mockup/videos/heartbeat-pulse-medical.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Dark overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(180deg, rgba(2,12,20,0.96) 0%, rgba(0,20,30,0.7) 50%, rgba(2,12,20,0.95) 100%)" }} />

        {/* Scanline effect */}
        <div className="scanline" />

        {/* Teal grid overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1, opacity: 0.04, backgroundImage: "linear-gradient(rgba(20,184,166,1) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,1) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

        {/* Glow orb center */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "700px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 70%)", zIndex: 1, pointerEvents: "none" }} />

        {/* Nav */}
        <div style={{ position: "absolute", top: 0, width: "100%", padding: "28px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "white", fontWeight: 700, fontSize: "20px", letterSpacing: "-0.4px" }}>
            <Activity size={24} color="#14b8a6" />
            GrowthMonk
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 14px", borderRadius: "100px", border: "1px solid rgba(20,184,166,0.3)", background: "rgba(20,184,166,0.08)" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#14b8a6" }} />
            <span style={{ color: "#14b8a6", fontSize: "12px", fontWeight: 600 }}>System Online</span>
          </div>
        </div>

        {/* Main content */}
        <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 24px" }}>

          <div className="he-1" style={{ marginBottom: "24px", display: "inline-flex", alignItems: "center", gap: "8px", padding: "7px 16px", borderRadius: "6px", background: "rgba(20,184,166,0.1)", border: "1px solid rgba(20,184,166,0.25)" }}>
            <span style={{ color: "#14b8a6", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "monospace" }}>[ AI-POWERED · HEALTHCARE · WELLNESS ]</span>
          </div>

          <h1 className="he-2" style={{ fontSize: "clamp(38px,6.5vw,88px)", fontWeight: 700, lineHeight: 1.06, letterSpacing: "-2px", color: "white", marginBottom: "20px", maxWidth: "860px" }}>
            Your Practice.<br />
            <span style={{ color: "#14b8a6" }}>Always Responding.</span>
          </h1>

          {/* Pulse line decoration */}
          <div className="he-3 pulse-line" style={{ width: "320px", height: "2px", background: "linear-gradient(90deg, transparent, #14b8a6, #22c55e, transparent)", marginBottom: "28px", borderRadius: "2px" }} />

          <p className="he-3" style={{ fontSize: "17px", lineHeight: 1.7, color: "rgba(255,255,255,0.55)", maxWidth: "480px", marginBottom: "40px", fontWeight: 400, letterSpacing: "0.01em" }}>
            AI captures every WhatsApp & Instagram lead. Qualifies in seconds. Books the callback. Never misses a beat.
          </p>

          <div className="he-4" style={{ display: "flex", gap: "12px", marginBottom: "48px" }}>
            <a href="mailto:hello@answermonk.ai" style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "#14b8a6", color: "#020c14", padding: "14px 28px", borderRadius: "8px", fontWeight: 700, fontSize: "16px", textDecoration: "none", letterSpacing: "-0.2px" }}>
              Book a Free Demo
              <ArrowRight size={18} />
            </a>
            <a href="mailto:hello@answermonk.ai" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.4)", padding: "14px 20px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", fontSize: "15px", textDecoration: "none", fontWeight: 500 }}>
              See how it works
            </a>
          </div>

          <div className="he-5" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px 32px", fontSize: "13px", fontWeight: 600, fontFamily: "monospace" }}>
            <span style={{ color: "rgba(255,255,255,0.35)", display: "flex", gap: "6px", alignItems: "center" }}><Zap size={14} color="#14b8a6" /> 80% qualified auto</span>
            <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
            <span style={{ color: "rgba(255,255,255,0.35)", display: "flex", gap: "6px", alignItems: "center" }}><MessageSquare size={14} color="#14b8a6" /> &lt;2 min response</span>
            <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
            <span style={{ color: "rgba(255,255,255,0.35)", display: "flex", gap: "6px", alignItems: "center" }}><Globe size={14} color="#14b8a6" /> 24-hr setup</span>
          </div>
        </div>
      </div>
    </>
  );
}
