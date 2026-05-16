import React, { useEffect, useState } from "react";
import { Search, MessageSquare, Zap, Clock } from "lucide-react";

export function HeroCv2() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ backgroundColor: "#030712", color: "white", minHeight: "100vh", width: "100%", overflow: "hidden", fontFamily: "'Space Grotesk', sans-serif", position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600&display=swap" />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.25); opacity: 0.55; }
        }
        @keyframes float-a {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-14px) translateX(8px); }
        }
        @keyframes float-b {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(18px) translateX(-12px); }
        }
        @keyframes float-c {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-18px) translateX(-8px); }
        }
        @keyframes float-d {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(12px) translateX(14px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dot-pulse { animation: pulse-dot 2s ease-in-out infinite; }
        .float-a { animation: float-a 8s ease-in-out infinite; }
        .float-b { animation: float-b 12s ease-in-out infinite; }
        .float-c { animation: float-c 10s ease-in-out infinite; }
        .float-d { animation: float-d 14s ease-in-out infinite; }
        .fade-in { animation: fadeIn 0.8s ease both; }
        .fade-in-1 { animation: fadeIn 0.8s 0.1s ease both; }
        .fade-in-2 { animation: fadeIn 0.8s 0.25s ease both; }
        .fade-in-3 { animation: fadeIn 0.8s 0.4s ease both; }
        .cta-outline {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 32px; border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.35);
          background: transparent; color: white;
          font-size: 15px; font-weight: 500; cursor: pointer;
          font-family: inherit; letter-spacing: -0.01em;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
          text-decoration: none;
        }
        .cta-outline:hover {
          background: #22C55E; color: #052e0f; border-color: #22C55E;
        }
      `}} />

      {/* Video background */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #030712 0%, #071a0e 50%, #030712 100%)" }} />
        <video
          autoPlay muted loop playsInline
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.35, mixBlendMode: "screen" }}
        >
          <source src="/__mockup/videos/ai-data-flow.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(3,7,18,0.72)", zIndex: 2 }} />
        {/* Noise grain */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.18, zIndex: 3, pointerEvents: "none",
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"
        }} />
      </div>

      {/* Floating stat cards */}
      <div style={{ position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none" }}>
        {/* Card TL */}
        <div className="float-a" style={{ position: "absolute", top: "22%", left: "8%", opacity: mounted ? 1 : 0, transition: "opacity 0.6s 0.3s" }}>
          <div style={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 16, padding: "14px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ backgroundColor: "rgba(255,255,255,0.08)", padding: 8, borderRadius: 10 }}>
              <Search size={18} color="#4ade80" />
            </div>
            <div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 3 }}>Discovery</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "white" }}>3x AI search visibility</div>
            </div>
          </div>
        </div>

        {/* Card BL */}
        <div className="float-b" style={{ position: "absolute", bottom: "22%", left: "5%", opacity: mounted ? 1 : 0, transition: "opacity 0.6s 0.5s" }}>
          <div style={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 16, padding: "14px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ backgroundColor: "rgba(255,255,255,0.08)", padding: 8, borderRadius: 10 }}>
              <Zap size={18} color="#facc15" />
            </div>
            <div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 3 }}>Automation</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "white" }}>80% leads auto-qualified</div>
            </div>
          </div>
        </div>

        {/* Card TR */}
        <div className="float-c" style={{ position: "absolute", top: "28%", right: "7%", opacity: mounted ? 1 : 0, transition: "opacity 0.6s 0.4s" }}>
          <div style={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 16, padding: "14px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ backgroundColor: "rgba(255,255,255,0.08)", padding: 8, borderRadius: 10 }}>
              <MessageSquare size={18} color="#60a5fa" />
            </div>
            <div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 3 }}>Response</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "white" }}>&lt;2 min first reply</div>
            </div>
          </div>
        </div>

        {/* Card BR */}
        <div className="float-d" style={{ position: "absolute", bottom: "26%", right: "10%", opacity: mounted ? 1 : 0, transition: "opacity 0.6s 0.6s" }}>
          <div style={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 16, padding: "14px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ backgroundColor: "rgba(255,255,255,0.08)", padding: 8, borderRadius: 10 }}>
              <Clock size={18} color="#c084fc" />
            </div>
            <div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 3 }}>Setup</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "white" }}>24-hr setup, no code</div>
            </div>
          </div>
        </div>
      </div>

      {/* Center content */}
      <div style={{ position: "relative", zIndex: 20, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 48px 48px", textAlign: "center" }}>

        {/* Status dot */}
        <div className="fade-in" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
          <div className="dot-pulse" style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#22C55E" }} />
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em", textTransform: "uppercase" }}>AI systems online · 24/7</span>
        </div>

        {/* Headline */}
        <h1 className="fade-in-1" style={{ fontSize: "clamp(52px, 8vw, 84px)", fontWeight: 300, lineHeight: 1.08, letterSpacing: "-0.04em", color: "white", marginBottom: 20, maxWidth: 700 }}>
          Healthcare AI<br />
          <span style={{ fontWeight: 600 }}>that works.</span>
        </h1>

        {/* Sub */}
        <p className="fade-in-2" style={{ fontSize: 17, color: "rgba(255,255,255,0.45)", maxWidth: 480, lineHeight: 1.65, marginBottom: 44, fontWeight: 300 }}>
          Get discovered in AI search. Capture and qualify leads on WhatsApp &amp; Instagram, in any language.
        </p>

        {/* CTA */}
        <div className="fade-in-3">
          <a href="mailto:hello@answermonk.ai" className="cta-outline">
            Book a Free Demo
          </a>
        </div>

      </div>

      {/* Bottom industry pills */}
      <div style={{ position: "relative", zIndex: 20, padding: "0 48px 40px", display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, maxWidth: 720 }}>
          {["Dental", "Medspa", "Fertility", "Physio", "Mental Health", "Nutrition", "Care", "Aesthetics"].map(s => (
            <span key={s} style={{ fontSize: 11, padding: "5px 14px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.45)", letterSpacing: "0.04em" }}>{s}</span>
          ))}
        </div>
      </div>

    </div>
  );
}
