import React, { useEffect } from "react";
import { ArrowRight, CheckCircle2, MessageSquare, Clock } from "lucide-react";

export function HeroB() {
  useEffect(() => {
    document.body.style.backgroundColor = '#030712';
    document.documentElement.style.backgroundColor = '#030712';
    return () => {
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
    };
  }, []);

  return (
    <div style={{ backgroundColor: "#030712", color: "white", minHeight: "100vh", width: "100%", overflow: "hidden", fontFamily: "'Outfit', sans-serif", position: "relative" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-32px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(32px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-b-left { animation: slideInLeft 0.7s ease forwards; }
        .hero-b-right { animation: slideInRight 0.7s ease 0.15s both; }
        .hero-b-badge { animation: fadeUp 0.5s ease forwards; }
      ` }} />

      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 40px", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "28px", height: "28px", backgroundColor: "#22C55E", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "14px" }}>🌱</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: "18px", letterSpacing: "-0.3px" }}>GrowthMonk</span>
        </div>
        <a href="mailto:hello@answermonk.ai" style={{ backgroundColor: "#22C55E", color: "#030712", padding: "10px 22px", borderRadius: "100px", fontWeight: 600, fontSize: "14px", textDecoration: "none", letterSpacing: "-0.2px" }}>
          Book a Demo
        </a>
      </nav>

      <div style={{ display: "flex", alignItems: "stretch", minHeight: "calc(100vh - 68px)" }}>
        <div className="hero-b-left" style={{ flex: 1, padding: "60px 48px 60px 60px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div className="hero-b-badge" style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "100px", padding: "6px 14px", marginBottom: "28px", width: "fit-content" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#22C55E" }} />
            <span style={{ fontSize: "12px", color: "#22C55E", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>AI-Powered · Healthcare & Wellness</span>
          </div>

          <h1 style={{ fontSize: "clamp(36px, 4.5vw, 58px)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-1.5px", marginBottom: "20px", margin: "0 0 20px" }}>
            The AI Growth<br />
            Engine for<br />
            <span style={{ color: "#22C55E" }}>Healthcare.</span>
          </h1>

          <p style={{ fontSize: "17px", lineHeight: 1.65, color: "rgba(255,255,255,0.65)", maxWidth: "440px", marginBottom: "36px" }}>
            Get discovered in AI search. Capture leads on WhatsApp & Instagram. Qualify and book automatically — 24/7, in any language.
          </p>

          <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "44px" }}>
            <a href="mailto:hello@answermonk.ai" style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "#22C55E", color: "#030712", padding: "14px 28px", borderRadius: "12px", fontWeight: 700, fontSize: "16px", textDecoration: "none", letterSpacing: "-0.3px" }}>
              Book a Free Demo
              <ArrowRight size={18} />
            </a>
            <a href="mailto:hello@answermonk.ai" style={{ color: "rgba(255,255,255,0.55)", fontSize: "14px", fontWeight: 500, textDecoration: "none" }}>
              See how it works →
            </a>
          </div>

          <div style={{ display: "flex", gap: "28px" }}>
            {[
              { icon: <CheckCircle2 size={15} color="#22C55E" />, text: "80% leads qualified auto" },
              { icon: <Clock size={15} color="#22C55E" />, text: "< 2 min response time" },
              { icon: <MessageSquare size={15} color="#22C55E" />, text: "24-hr setup" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {item.icon}
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-b-right" style={{ width: "42%", backgroundColor: "rgba(255,255,255,0.03)", borderLeft: "1px solid rgba(255,255,255,0.07)", padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "16px" }}>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Live conversation preview</p>

          {[
            { from: "user", text: "Hallo, ich suche Pflegedienst für meine Mutter", time: "09:41" },
            { from: "bot", text: "Guten Morgen! Ich helfe Ihnen gerne. In welcher Region suchen Sie Pflegedienst?", time: "09:41" },
            { from: "user", text: "In München, Schwabing", time: "09:42" },
            { from: "bot", text: "Perfekt! Wir sind in München aktiv. Darf ich fragen, welche Art von Pflege Sie benötigen?", time: "09:42" },
            { from: "user", text: "Ambulante Pflege, sie braucht Hilfe morgens", time: "09:43" },
            { from: "bot", text: "Verstanden. Ich kann einen Beratungstermin für Sie vereinbaren — wann passt es Ihnen?", time: "09:43" },
          ].map((msg, i) => (
            <div key={i} style={{ display: "flex", flexDirection: msg.from === "user" ? "row-reverse" : "row", gap: "8px", alignItems: "flex-end" }}>
              {msg.from === "bot" && (
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "#22C55E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "12px" }}>🌱</div>
              )}
              <div style={{
                backgroundColor: msg.from === "user" ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.07)",
                border: msg.from === "user" ? "1px solid rgba(34,197,94,0.2)" : "1px solid rgba(255,255,255,0.08)",
                borderRadius: msg.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                padding: "10px 14px",
                maxWidth: "75%",
              }}>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)", lineHeight: 1.5, margin: 0 }}>{msg.text}</p>
                <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", margin: "4px 0 0", textAlign: msg.from === "user" ? "left" : "right" }}>{msg.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
