import { ArrowRight } from "lucide-react";

const BASE = "/grow";

export function VideoHero() {
  return (
    <section style={{
      position: "relative",
      width: "100%",
      height: "100dvh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      backgroundColor: "#030712",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      boxSizing: "border-box",
      paddingTop: "88px",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      <style dangerouslySetInnerHTML={{ __html: `
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
          from { opacity: 0; transform: translateY(24px); }
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
        .vh-in1 { animation: riseVH 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
        .vh-in2 { animation: riseVH 0.9s cubic-bezier(0.16,1,0.3,1) 0.25s both; }
        .vh-in3 { animation: riseVH 0.9s cubic-bezier(0.16,1,0.3,1) 0.4s both; }
        .vh-in4 { animation: riseVH 0.9s cubic-bezier(0.16,1,0.3,1) 0.55s both; }
        .vh-in5 { animation: riseVH 0.9s cubic-bezier(0.16,1,0.3,1) 0.7s both; }
        .vh-glow { animation: glowPulseVH 2s ease-in-out infinite; }
      ` }} />

      {/* Video backgrounds */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <video autoPlay muted loop playsInline className="vh-vid1"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}>
          <source src={`${BASE}/videos/wellness-meditation.mp4`} type="video/mp4" />
        </video>
        <video autoPlay muted loop playsInline className="vh-vid2"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0 }}>
          <source src={`${BASE}/videos/caregiver-hands-healthcare.mp4`} type="video/mp4" />
        </video>
        <video autoPlay muted loop playsInline className="vh-vid3"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0 }}>
          <source src={`${BASE}/videos/physio-rehab.mp4`} type="video/mp4" />
        </video>
        <video autoPlay muted loop playsInline className="vh-vid4"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0 }}>
          <source src={`${BASE}/videos/dental-clinic-lobby.mp4`} type="video/mp4" />
        </video>
        <video autoPlay muted loop playsInline className="vh-vid5"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0 }}>
          <source src={`${BASE}/videos/optical-frames-boutique.mp4`} type="video/mp4" />
        </video>
      </div>

      {/* Dark overlay */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(160deg, rgba(3,7,18,0.90) 0%, rgba(5,25,12,0.55) 50%, rgba(3,7,18,0.88) 100%)" }} />

      {/* Green glow */}
      <div style={{ position: "absolute", top: "35%", left: "50%", transform: "translateX(-50%)", width: "700px", height: "400px", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(34,197,94,0.13) 0%, transparent 70%)", zIndex: 1, pointerEvents: "none" }} />

      {/* Nav — overlaid on video, sits above paddingTop area */}
      <nav style={{ position: "absolute", top: 0, width: "100%", padding: "22px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 20, boxSizing: "border-box" }}>
        <a href="/grow" style={{ fontWeight: 800, fontSize: "20px", letterSpacing: "-0.4px", textDecoration: "none" }}>
          <span style={{ color: "#22c55e" }}>Growth</span><span style={{ color: "white" }}>Monk</span>
        </a>

        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <div style={{ display: "flex", gap: "28px" }}>
            {(["Features", "How It Works", "Industries", "FAQ"] as const).map((label) => (
              <a key={label} href={`#${label.toLowerCase().replace(/ /g, "-")}`} style={{ color: "rgba(255,255,255,0.55)", fontSize: "14px", fontWeight: 500, textDecoration: "none" }}>
                {label}
              </a>
            ))}
          </div>
          <a href="#cta" style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#22c55e", color: "#030712", padding: "10px 22px", borderRadius: "100px", fontWeight: 700, fontSize: "14px", textDecoration: "none" }}>
            Book a Demo <ArrowRight size={14} />
          </a>
        </div>
      </nav>

      {/* Hero content — centred in the space below nav */}
      <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 32px", maxWidth: "1100px", width: "100%" }}>

        {/* Headline */}
        <div className="vh-in2" style={{ marginBottom: "28px" }}>
          <div style={{ fontSize: "clamp(42px,7.5vw,100px)", fontWeight: 900, lineHeight: 1.02, letterSpacing: "-3.5px", color: "white", marginBottom: "0.04em" }}>
            The AI Growth Engine
          </div>
          <div style={{ fontSize: "clamp(42px,7.5vw,100px)", fontWeight: 900, lineHeight: 1.02, letterSpacing: "-3.5px", display: "flex", justifyContent: "center", alignItems: "baseline" }}>
            <span style={{ color: "white", marginRight: "0.25em" }}>for</span>
            <span style={{ position: "relative", display: "inline-block" }}>
              <span style={{ visibility: "hidden", pointerEvents: "none" }}>
                <span style={{ background: "linear-gradient(90deg, #22c55e, #4ade80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Healthcare</span>
              </span>
              <span className="vh-word1" style={{ position: "absolute", left: 0, top: 0, whiteSpace: "nowrap", background: "linear-gradient(90deg, #22c55e, #4ade80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Healthcare</span>
              <span className="vh-word2" style={{ position: "absolute", left: 0, top: 0, whiteSpace: "nowrap", background: "linear-gradient(90deg, #22c55e, #4ade80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", opacity: 0 }}>Wellness</span>
              <span className="vh-word3" style={{ position: "absolute", left: 0, top: 0, whiteSpace: "nowrap", background: "linear-gradient(90deg, #22c55e, #4ade80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", opacity: 0 }}>Clinics</span>
            </span>
          </div>
        </div>

        {/* Subtext */}
        <p className="vh-in3" style={{ fontSize: "19px", lineHeight: 1.65, color: "rgba(255,255,255,0.65)", maxWidth: "580px", marginBottom: "40px", fontWeight: 500 }}>
          Get discovered in AI search, capture every WhatsApp, website and social media lead, qualify leads automatically, and turn more enquiries into booked consultations - 24/7.
        </p>

        {/* CTAs */}
        <div className="vh-in4" style={{ display: "flex", gap: "12px", marginBottom: "48px", flexWrap: "wrap", justifyContent: "center" }}>
          <a href="#cta" style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "#22c55e", color: "#030712", padding: "15px 34px", borderRadius: "100px", fontWeight: 800, fontSize: "16px", textDecoration: "none", letterSpacing: "-0.2px", boxShadow: "0 0 40px rgba(34,197,94,0.3)" }}>
            Book a Free Demo <ArrowRight size={18} />
          </a>
          <a href="#how-it-works" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.55)", padding: "15px 28px", borderRadius: "100px", fontWeight: 600, fontSize: "16px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.12)" }}>
            See How It Works
          </a>
        </div>

      </div>
    </section>
  );
}
