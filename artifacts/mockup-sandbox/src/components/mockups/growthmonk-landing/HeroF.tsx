import React from "react";
import { Leaf, ArrowRight, Zap, MessageSquare, Globe, ChevronDown } from "lucide-react";

export function HeroF() {
  return (
    <>
      <div
        style={{ position: "relative", width: "100%", height: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", backgroundColor: "#050d09", fontFamily: "'Outfit', sans-serif" }}
      >
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes riseIn {
            from { opacity: 0; transform: translateY(24px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes shimmer {
            0% { background-position: -400px 0; }
            100% { background-position: 400px 0; }
          }
          @keyframes breathe {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.05); opacity: 0.7; }
          }
          @keyframes bounceDown {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(6px); }
          }
          .hf-1 { animation: riseIn 1s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
          .hf-2 { animation: riseIn 1s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
          .hf-3 { animation: riseIn 1s cubic-bezier(0.16,1,0.3,1) 0.55s both; }
          .hf-4 { animation: riseIn 1s cubic-bezier(0.16,1,0.3,1) 0.75s both; }
          .hf-5 { animation: riseIn 1s cubic-bezier(0.16,1,0.3,1) 0.95s both; }
          .breathe-orb { animation: breathe 6s ease-in-out infinite; }
          .bounce-down { animation: bounceDown 2.2s ease-in-out infinite; }
          .shimmer-text {
            background: linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(134,239,172,1) 30%, rgba(255,255,255,0.9) 60%, rgba(134,239,172,1) 90%);
            background-size: 400px 100%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shimmer 4s linear infinite;
          }
        ` }} />

        {/* Video Background — wellness clinic interior */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <video
            autoPlay muted loop playsInline
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.55 }}
          >
            <source src="/__mockup/videos/wellness-clinic-interior.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Deep green overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(180deg, rgba(5,13,9,0.88) 0%, rgba(5,22,10,0.6) 40%, rgba(5,13,9,0.9) 100%)" }} />

        {/* Organic glow orbs */}
        <div className="breathe-orb" style={{ position: "absolute", top: "-10%", right: "5%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.18) 0%, transparent 65%)", zIndex: 1, pointerEvents: "none" }} />
        <div className="breathe-orb" style={{ position: "absolute", bottom: "-5%", left: "0%", width: "450px", height: "450px", borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 65%)", zIndex: 1, pointerEvents: "none", animationDelay: "3s" }} />

        {/* Nav */}
        <div style={{ position: "absolute", top: 0, width: "100%", padding: "24px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "white", fontWeight: 800, fontSize: "20px", letterSpacing: "-0.4px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Leaf size={18} color="#050d09" fill="#050d09" />
            </div>
            GrowthMonk
          </div>
          <a href="mailto:hello@answermonk.ai" style={{ padding: "10px 20px", borderRadius: "100px", border: "1px solid rgba(34,197,94,0.3)", color: "#86efac", fontSize: "14px", fontWeight: 600, textDecoration: "none", backdropFilter: "blur(8px)", background: "rgba(34,197,94,0.07)" }}>
            Get Started
          </a>
        </div>

        {/* Main content */}
        <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 24px", maxWidth: "900px" }}>

          <div className="hf-1" style={{ marginBottom: "24px", display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 14px 6px 8px", borderRadius: "100px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", backdropFilter: "blur(10px)" }}>
            <span style={{ padding: "2px 8px", borderRadius: "100px", background: "#22c55e", color: "#050d09", fontSize: "10px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>NEW</span>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", fontWeight: 500 }}>AI-Powered Healthcare Growth</span>
          </div>

          <h1 className="hf-2" style={{ fontSize: "clamp(40px,6.8vw,92px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-2.5px", color: "white", marginBottom: "8px" }}>
            Grow Your Practice.
          </h1>
          <h1 className="hf-2" style={{ fontSize: "clamp(40px,6.8vw,92px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-2.5px", marginBottom: "28px" }}>
            <span className="shimmer-text">While You Heal.</span>
          </h1>

          <p className="hf-3" style={{ fontSize: "18px", lineHeight: 1.7, color: "rgba(255,255,255,0.6)", maxWidth: "520px", marginBottom: "44px", fontWeight: 400 }}>
            AI that captures every WhatsApp and Instagram enquiry. Qualifies leads. Books callbacks. In German, Turkish, and any language.
          </p>

          <div className="hf-4" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", marginBottom: "56px" }}>
            <a href="mailto:hello@answermonk.ai" style={{ display: "inline-flex", alignItems: "center", gap: "10px", backgroundColor: "#22c55e", color: "#050d09", padding: "18px 40px", borderRadius: "100px", fontWeight: 800, fontSize: "18px", textDecoration: "none", letterSpacing: "-0.5px", boxShadow: "0 0 60px rgba(34,197,94,0.3)" }}>
              Book a Free Demo
              <ArrowRight size={20} />
            </a>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", fontWeight: 400 }}>No commitment · Setup in 24 hours</p>
          </div>

          <div className="hf-5" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px 40px", color: "rgba(255,255,255,0.4)", fontSize: "14px", fontWeight: 600 }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Zap size={15} color="#22c55e" /> 80% leads auto-qualified</span>
            <span style={{ width: "1px", height: "16px", background: "rgba(255,255,255,0.1)", alignSelf: "center" }} />
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><MessageSquare size={15} color="#22c55e" /> &lt; 2 min response</span>
            <span style={{ width: "1px", height: "16px", background: "rgba(255,255,255,0.1)", alignSelf: "center" }} />
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Globe size={15} color="#22c55e" /> 24-hr setup</span>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position: "absolute", bottom: "24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", zIndex: 10 }}>
          <ChevronDown size={24} color="rgba(255,255,255,0.25)" className="bounce-down" />
        </div>
      </div>
    </>
  );
}
