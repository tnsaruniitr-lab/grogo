"use client";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";

export function VideoHero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks = [
    { label: "Features",     href: "#features"     },
    { label: "How It Works", href: "#how-it-works"  },
    { label: "Industries",   href: "#industries"    },
    { label: "FAQ",          href: "#faq"           },
  ];
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

        /* ── Hamburger dropdown ── */
        .gm-menu-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          min-width: 200px;
          background: rgba(5,10,20,0.97);
          border: 1px solid rgba(34,197,94,0.18);
          border-radius: 14px;
          padding: 8px 0;
          box-shadow: 0 16px 48px rgba(0,0,0,0.6);
          display: none;
          flex-direction: column;
          z-index: 100;
          backdrop-filter: blur(12px);
        }
        .gm-menu-dropdown.open { display: flex; }
        .gm-menu-dropdown a {
          padding: 12px 20px;
          color: rgba(255,255,255,0.75);
          font-size: 15px;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.15s, background 0.15s;
        }
        .gm-menu-dropdown a:hover {
          color: #4ade80;
          background: rgba(34,197,94,0.07);
        }
        /* ── Mobile ── */
        @media (max-width: 768px) {
          .gm-nav       { padding: 16px 20px !important; }
          .gm-hero-body { padding: 0 24px !important; }
          .gm-hero-headline {
            font-size: 48px !important;
            letter-spacing: -1.5px !important;
            line-height: 1.08 !important;
          }
          .gm-hero-sub {
            font-size: 17px !important;
            line-height: 1.7 !important;
            margin-bottom: 36px !important;
          }
          .gm-hero-ctas { gap: 10px !important; }
          .gm-hero-cta-primary  { padding: 15px 32px !important; font-size: 16px !important; }
          .gm-hero-cta-secondary { display: none !important; }
        }
      ` }} />

      {/* Video backgrounds */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <video autoPlay muted loop playsInline className="vh-vid1"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}>
          <source src="/videos/wellness-meditation.mp4" type="video/mp4" />
        </video>
        <video autoPlay muted loop playsInline className="vh-vid2"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0 }}>
          <source src="/videos/caregiver-hands-healthcare.mp4" type="video/mp4" />
        </video>
        <video autoPlay muted loop playsInline className="vh-vid3"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0 }}>
          <source src="/videos/physio-rehab.mp4" type="video/mp4" />
        </video>
        <video autoPlay muted loop playsInline className="vh-vid4"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0 }}>
          <source src="/videos/dental-clinic-lobby.mp4" type="video/mp4" />
        </video>
        <video autoPlay muted loop playsInline className="vh-vid5"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0 }}>
          <source src="/videos/optical-frames-boutique.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Dark overlay */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(160deg, rgba(3,7,18,0.90) 0%, rgba(5,25,12,0.55) 50%, rgba(3,7,18,0.88) 100%)" }} />

      {/* Green glow */}
      <div style={{ position: "absolute", top: "35%", left: "50%", transform: "translateX(-50%)", width: "700px", height: "400px", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(34,197,94,0.13) 0%, transparent 70%)", zIndex: 1, pointerEvents: "none" }} />

      {/* Nav */}
      <nav className="gm-nav" style={{ position: "absolute", top: 0, width: "100%", padding: "22px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 20, boxSizing: "border-box" }}>
        <a href="/" style={{ fontWeight: 800, fontSize: "20px", letterSpacing: "-0.4px", textDecoration: "none" }}>
          <span style={{ color: "#22c55e" }}>Growth</span><span style={{ color: "white" }}>Monk</span>
        </a>

        {/* Hamburger */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", cursor: "pointer", color: "white" }}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <div className={`gm-menu-dropdown${menuOpen ? " open" : ""}`}>
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            ))}
            <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "6px 0" }} />
            <a href="#cta" onClick={() => setMenuOpen(false)} style={{ color: "#4ade80", fontWeight: 700 }}>
              Book a Demo →
            </a>
          </div>
        </div>
      </nav>

      {/* Hero content */}
      <div className="gm-hero-body" style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 32px", maxWidth: "1100px", width: "100%" }}>

        {/* Headline */}
        <div className="vh-in2" style={{ marginBottom: "28px" }}>
          <div className="gm-hero-headline" style={{ fontSize: "clamp(38px,7.5vw,100px)", fontWeight: 900, lineHeight: 1.02, letterSpacing: "-3.5px", color: "white", marginBottom: "0.04em" }}>
            The AI Growth Engine
          </div>
          <div className="gm-hero-headline" style={{ fontSize: "clamp(38px,7.5vw,100px)", fontWeight: 900, lineHeight: 1.02, letterSpacing: "-3.5px", display: "flex", justifyContent: "center", alignItems: "baseline" }}>
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
        <p className="vh-in3 gm-hero-sub" style={{ fontSize: "19px", lineHeight: 1.65, color: "rgba(255,255,255,0.65)", maxWidth: "580px", marginBottom: "40px", fontWeight: 500 }}>
          Get discovered in AI search, capture every WhatsApp, website and social media lead, qualify leads automatically, and turn more enquiries into booked consultations - 24/7.
        </p>

        {/* CTAs */}
        <div className="vh-in4 gm-hero-ctas" style={{ display: "flex", gap: "12px", marginBottom: "48px", flexWrap: "wrap", justifyContent: "center" }}>
          <a className="gm-hero-cta-primary" href="#cta" style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "#22c55e", color: "#030712", padding: "15px 34px", borderRadius: "100px", fontWeight: 800, fontSize: "16px", textDecoration: "none", letterSpacing: "-0.2px", boxShadow: "0 0 40px rgba(34,197,94,0.3)" }}>
            Book a Free Demo <ArrowRight size={18} />
          </a>
          <a className="gm-hero-cta-secondary" href="#how-it-works" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.55)", padding: "15px 28px", borderRadius: "100px", fontWeight: 600, fontSize: "16px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.12)" }}>
            See How It Works
          </a>
        </div>

      </div>
    </section>
  );
}
