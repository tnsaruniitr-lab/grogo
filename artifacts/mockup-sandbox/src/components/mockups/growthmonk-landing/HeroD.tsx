import React from "react";
import { Heart, ArrowRight, Zap, MessageSquare, Globe } from "lucide-react";

export function HeroD() {
  return (
    <>
      <div
        style={{ position: "relative", width: "100%", height: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", backgroundColor: "#0c0a07", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes heatPulse {
            0%, 100% { opacity: 0.18; }
            50% { opacity: 0.28; }
          }
          .hd-1 { animation: fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
          .hd-2 { animation: fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
          .hd-3 { animation: fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.5s both; }
          .hd-4 { animation: fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.7s both; }
          .hd-5 { animation: fadeUp 1s cubic-bezier(0.16,1,0.3,1) 0.9s both; }
          .heat-orb { animation: heatPulse 4s ease-in-out infinite; }
        ` }} />

        {/* Video Background — warm caregiver hands */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <video
            autoPlay muted loop playsInline
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "luminosity", opacity: 0.45 }}
          >
            <source src="/__mockup/videos/caregiver-hands-healthcare.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Warm amber gradient overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(160deg, rgba(12,8,4,0.92) 0%, rgba(60,30,8,0.55) 50%, rgba(12,8,4,0.88) 100%)" }} />

        {/* Warm glow orbs */}
        <div className="heat-orb" style={{ position: "absolute", top: "20%", left: "10%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(251,146,60,0.35) 0%, transparent 70%)", zIndex: 1, pointerEvents: "none" }} />
        <div className="heat-orb" style={{ position: "absolute", bottom: "15%", right: "8%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(234,179,8,0.18) 0%, transparent 70%)", zIndex: 1, pointerEvents: "none" }} />

        {/* Nav */}
        <div style={{ position: "absolute", top: 0, width: "100%", padding: "28px 40px", display: "flex", justifyContent: "center", zIndex: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.92)", fontWeight: 800, fontSize: "22px", letterSpacing: "-0.5px" }}>
            <Heart size={26} fill="#f97316" color="#f97316" />
            GrowthMonk
          </div>
        </div>

        {/* Main content */}
        <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 24px", marginTop: "-32px" }}>

          <div className="hd-1" style={{ marginBottom: "28px", display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 18px", borderRadius: "100px", background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.3)", backdropFilter: "blur(12px)" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#f97316", display: "inline-block" }} />
            <span style={{ color: "#fb923c", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Healthcare & Wellness · AI-Powered</span>
          </div>

          <h1 className="hd-2" style={{ fontSize: "clamp(42px,7vw,96px)", fontWeight: 900, lineHeight: 1.04, letterSpacing: "-2px", color: "white", marginBottom: "24px", maxWidth: "900px" }}>
            Turn Every Patient<br />
            <span style={{ background: "linear-gradient(90deg, #fb923c, #facc15)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Enquiry into Care.
            </span>
          </h1>

          <p className="hd-3" style={{ fontSize: "18px", lineHeight: 1.7, color: "rgba(255,255,255,0.65)", maxWidth: "520px", marginBottom: "40px", fontWeight: 500 }}>
            AI that qualifies care leads, speaks German & Turkish, and books your callbacks — automatically, 24/7.
          </p>

          <div className="hd-4" style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "52px" }}>
            <a href="mailto:hello@answermonk.ai" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "linear-gradient(135deg, #f97316, #ea580c)", color: "white", padding: "16px 32px", borderRadius: "100px", fontWeight: 700, fontSize: "17px", textDecoration: "none", letterSpacing: "-0.3px", boxShadow: "0 8px 32px rgba(249,115,22,0.4)" }}>
              Book a Free Demo
              <ArrowRight size={20} />
            </a>
          </div>

          <div className="hd-5" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "24px 36px", color: "rgba(255,255,255,0.45)", fontSize: "14px", fontWeight: 600 }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Zap size={16} color="#fb923c" /> 80% leads qualified auto</span>
            <span style={{ width: "1px", height: "16px", background: "rgba(255,255,255,0.15)", alignSelf: "center" }} />
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><MessageSquare size={16} color="#fb923c" /> &lt; 2 min response time</span>
            <span style={{ width: "1px", height: "16px", background: "rgba(255,255,255,0.15)", alignSelf: "center" }} />
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Globe size={16} color="#fb923c" /> 24-hr setup</span>
          </div>
        </div>
      </div>
    </>
  );
}
