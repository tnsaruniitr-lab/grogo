import { ArrowRight, MessageSquare, Zap, Globe, Star, TrendingUp } from "lucide-react";

export function VideoHero() {
  return (
    <section style={{ position: "relative", width: "100%", height: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", backgroundColor: "#030712", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
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

        /* ── Word rotation — 24s cycle, 8s per word ── */
        @keyframes hlw1 {
          0%     { opacity: 1; }
          29.2%  { opacity: 1; }
          33.3%  { opacity: 0; }
          95.8%  { opacity: 0; }
          100%   { opacity: 1; }
        }
        @keyframes hlw2 {
          0%     { opacity: 0; }
          29.2%  { opacity: 0; }
          33.3%  { opacity: 1; }
          62.5%  { opacity: 1; }
          66.7%  { opacity: 0; }
          100%   { opacity: 0; }
        }
        @keyframes hlw3 {
          0%     { opacity: 0; }
          62.5%  { opacity: 0; }
          66.7%  { opacity: 1; }
          95.8%  { opacity: 1; }
          100%   { opacity: 0; }
        }

        @keyframes riseVH {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes glowPulseVH {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }

        .vh-vid1 { animation: cfl1 40s ease-in-out infinite; }
        .vh-vid2 { animation: cfl2 40s ease-in-out infinite; }
        .vh-vid3 { animation: cfl3 40s ease-in-out infinite; }
        .vh-vid4 { animation: cfl4 40s ease-in-out infinite; }
        .vh-vid5 { animation: cfl5 40s ease-in-out infinite; }

        .vh-word1 { animation: hlw1 24s ease-in-out infinite; }
        .vh-word2 { animation: hlw2 24s ease-in-out infinite; }
        .vh-word3 { animation: hlw3 24s ease-in-out infinite; }

        .vh-in1 { animation: riseVH 1s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
        .vh-in2 { animation: riseVH 1s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
        .vh-in3 { animation: riseVH 1s cubic-bezier(0.16,1,0.3,1) 0.5s both; }
        .vh-in4 { animation: riseVH 1s cubic-bezier(0.16,1,0.3,1) 0.7s both; }
        .vh-in5 { animation: riseVH 1s cubic-bezier(0.16,1,0.3,1) 0.9s both; }
        .vh-glow { animation: glowPulseVH 2s ease-in-out infinite; }
      ` }} />

      {/* 5-scene crossfading video backgrounds */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <video autoPlay muted loop playsInline className="vh-vid1"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "luminosity", opacity: 1 }}>
          <source src="/videos/wellness-meditation.mp4" type="video/mp4" />
        </video>
        <video autoPlay muted loop playsInline className="vh-vid2"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "luminosity", opacity: 0 }}>
          <source src="/videos/caregiver-hands-healthcare.mp4" type="video/mp4" />
        </video>
        <video autoPlay muted loop playsInline className="vh-vid3"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "luminosity", opacity: 0 }}>
          <source src="/videos/physio-rehab.mp4" type="video/mp4" />
        </video>
        <video autoPlay muted loop playsInline className="vh-vid4"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "luminosity", opacity: 0 }}>
          <source src="/videos/dental-clinic-lobby.mp4" type="video/mp4" />
        </video>
        <video autoPlay muted loop playsInline className="vh-vid5"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "luminosity", opacity: 0 }}>
          <source src="/videos/optical-frames-boutique.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Dark overlay */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(160deg, rgba(3,7,18,0.92) 0%, rgba(5,25,12,0.6) 50%, rgba(3,7,18,0.90) 100%)" }} />

      {/* Green glow */}
      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: "700px", height: "400px", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(34,197,94,0.15) 0%, transparent 70%)", zIndex: 1, pointerEvents: "none" }} />

      {/* Nav — overlaid on video */}
      <nav style={{ position: "absolute", top: 0, width: "100%", padding: "28px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 20 }}>
        <a href="/grow" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TrendingUp size={16} color="white" />
          </div>
          <span style={{ color: "white", fontWeight: 800, fontSize: "18px", letterSpacing: "-0.4px" }}>GrowthMonk</span>
        </a>

        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <div style={{ display: "flex", gap: "28px" }}>
            {["#features", "#how-it-works", "#industries", "#faq"].map((href, i) => (
              <a key={href} href={href} style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", fontWeight: 500, textDecoration: "none" }}>
                {["Features", "How It Works", "Industries", "FAQ"][i]}
              </a>
            ))}
          </div>
          <a href="#cta" style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#22c55e", color: "#030712", padding: "10px 22px", borderRadius: "100px", fontWeight: 700, fontSize: "14px", textDecoration: "none" }}>
            Book a Demo <ArrowRight size={14} />
          </a>
        </div>
      </nav>

      {/* Main content */}
      <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 24px", maxWidth: "1140px" }}>

        <div className="vh-in1" style={{ marginBottom: "28px", display: "inline-flex", alignItems: "center", gap: "8px", padding: "7px 16px", borderRadius: "100px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
          <span className="vh-glow" style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#22c55e", display: "inline-block" }} />
          <span style={{ color: "#86efac", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>AI-Powered Growth Platform</span>
        </div>

        {/* Headline with rotating word */}
        <div className="vh-in2" style={{ marginBottom: "32px" }}>
          <div style={{ fontSize: "clamp(44px,8.5vw,108px)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-4px", color: "white", marginBottom: "0.05em" }}>
            The AI Growth Engine
          </div>
          <div style={{ fontSize: "clamp(44px,8.5vw,108px)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-4px", display: "flex", justifyContent: "center", alignItems: "baseline" }}>
            <span style={{ color: "white", marginRight: "0.28em" }}>for</span>
            <span style={{ position: "relative", display: "inline-block" }}>
              {/* Invisible sizer — widest word */}
              <span style={{ visibility: "hidden", pointerEvents: "none" }}>
                <span style={{ background: "linear-gradient(90deg, #22c55e, #4ade80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Healthcare</span>
              </span>
              <span className="vh-word1" style={{ position: "absolute", left: 0, top: 0, whiteSpace: "nowrap", background: "linear-gradient(90deg, #22c55e, #4ade80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Healthcare</span>
              <span className="vh-word2" style={{ position: "absolute", left: 0, top: 0, whiteSpace: "nowrap", background: "linear-gradient(90deg, #22c55e, #4ade80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", opacity: 0 }}>Wellness</span>
              <span className="vh-word3" style={{ position: "absolute", left: 0, top: 0, whiteSpace: "nowrap", background: "linear-gradient(90deg, #22c55e, #4ade80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", opacity: 0 }}>Clinics</span>
            </span>
          </div>
        </div>

        <p className="vh-in3" style={{ fontSize: "20px", lineHeight: 1.6, color: "rgba(255,255,255,0.68)", maxWidth: "620px", marginBottom: "44px", fontWeight: 500 }}>
          Get discovered in AI search, capture every WhatsApp, website and social media lead, qualify leads automatically, and turn more enquiries into booked consultations - 24/7.
        </p>

        <div className="vh-in4" style={{ display: "flex", gap: "12px", marginBottom: "52px" }}>
          <a href="#cta" style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "#22c55e", color: "#030712", padding: "16px 36px", borderRadius: "100px", fontWeight: 800, fontSize: "17px", textDecoration: "none", letterSpacing: "-0.3px", boxShadow: "0 0 48px rgba(34,197,94,0.35)" }}>
            Book a Free Demo <ArrowRight size={20} />
          </a>
          <a href="#how-it-works" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.6)", padding: "16px 28px", borderRadius: "100px", fontWeight: 600, fontSize: "17px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.12)" }}>
            See How It Works
          </a>
        </div>

        <div className="vh-in5" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px 40px", color: "rgba(255,255,255,0.38)", fontSize: "13px", fontWeight: 600 }}>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Zap size={14} color="#22c55e" /> 2-4x AI search appearances</span>
          <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><MessageSquare size={14} color="#22c55e" /> &lt;2 min response</span>
          <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Globe size={14} color="#22c55e" /> 24-hr setup</span>
          <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Star size={14} color="#22c55e" /> DE &amp; TR bilingual</span>
        </div>
      </div>
    </section>
  );
}
