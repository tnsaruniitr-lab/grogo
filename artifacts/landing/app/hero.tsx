"use client";
import { ArrowRight, Menu, X, Globe, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import type { Lang, Translations } from "./i18n/translations";

const HOLD_MS = 6000;
const FADE_MS = 450;

const LANG_OPTIONS: { code: Lang; label: string; href: string }[] = [
  { code: "en", label: "EN", href: "/" },
  { code: "de", label: "DE", href: "/de" },
  { code: "tr", label: "TR", href: "/tr" },
  { code: "ar", label: "AR", href: "/ar" },
];

const LANG_LABELS: Record<Lang, string> = { en: "English", de: "Deutsch", tr: "Türkçe", ar: "العربية" };

function LangDropdown({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          height: 40, padding: "0 14px",
          borderRadius: 10,
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.12)",
          cursor: "pointer", color: "white",
          fontSize: 12, fontWeight: 700, letterSpacing: "0.06em",
          direction: "ltr",
        }}
        aria-label="Select language"
        aria-expanded={open}
      >
        <Globe size={14} style={{ color: "#4ade80", flexShrink: 0 }} />
        <span>{lang.toUpperCase()}</span>
        <ChevronDown size={12} style={{ color: "rgba(255,255,255,0.4)", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", right: 0,
          background: "rgba(5,10,20,0.97)",
          border: "1px solid rgba(34,197,94,0.18)",
          borderRadius: 12, padding: "6px",
          boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
          backdropFilter: "blur(12px)",
          zIndex: 200, minWidth: 148, direction: "ltr",
        }}>
          {LANG_OPTIONS.map((l) => (
            <a
              key={l.code}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: 8,
                textDecoration: "none",
                background: lang === l.code ? "rgba(34,197,94,0.12)" : "transparent",
                transition: "background 0.12s",
              }}
            >
              <span style={{
                width: 28, height: 20, borderRadius: 4,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 800, letterSpacing: "0.06em",
                background: lang === l.code ? "#22c55e" : "rgba(255,255,255,0.08)",
                color: lang === l.code ? "#030712" : "rgba(255,255,255,0.5)",
                flexShrink: 0,
              }}>
                {l.label}
              </span>
              <span style={{
                fontSize: 13, fontWeight: 500,
                color: lang === l.code ? "#4ade80" : "rgba(255,255,255,0.65)",
              }}>
                {LANG_LABELS[l.code]}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export function VideoHero({ t, lang }: { t: Translations; lang: Lang }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [wordIdx, setWordIdx] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setWordVisible(false);
      timerRef.current = setTimeout(() => {
        setWordIdx((i) => (i + 1) % t.hero.words.length);
        setWordVisible(true);
      }, FADE_MS);
    }, HOLD_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [wordIdx, t.hero.words.length]);

  const navLinks = [
    { label: t.nav.features,    href: "#features"     },
    { label: t.nav.howItWorks,  href: "#how-it-works"  },
    { label: t.nav.industries,  href: "#industries"    },
    { label: t.nav.faq,         href: "#faq"           },
  ];

  const isRtl = t.dir === "rtl";
  const arFont = lang === "ar" ? "'Cairo', 'Segoe UI', Arial, sans-serif" : "'Plus Jakarta Sans', sans-serif";

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
      fontFamily: arFont,
      boxSizing: "border-box",
      paddingTop: "88px",
      direction: t.dir,
    }}>
      {lang === "ar" && (
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      )}
      {lang !== "ar" && (
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes cfl1 { 0% { opacity: 1; } 17.5% { opacity: 1; } 20% { opacity: 0; } 97.5% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes cfl2 { 0% { opacity: 0; } 17.5% { opacity: 0; } 20% { opacity: 1; } 37.5% { opacity: 1; } 40% { opacity: 0; } 100% { opacity: 0; } }
        @keyframes cfl3 { 0% { opacity: 0; } 37.5% { opacity: 0; } 40% { opacity: 1; } 57.5% { opacity: 1; } 60% { opacity: 0; } 100% { opacity: 0; } }
        @keyframes cfl4 { 0% { opacity: 0; } 57.5% { opacity: 0; } 60% { opacity: 1; } 77.5% { opacity: 1; } 80% { opacity: 0; } 100% { opacity: 0; } }
        @keyframes cfl5 { 0% { opacity: 0; } 77.5% { opacity: 0; } 80% { opacity: 1; } 97.5% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes riseVH { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes glowPulseVH { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
        .vh-vid1 { animation: cfl1 40s ease-in-out infinite; }
        .vh-vid2 { animation: cfl2 40s ease-in-out infinite; }
        .vh-vid3 { animation: cfl3 40s ease-in-out infinite; }
        .vh-vid4 { animation: cfl4 40s ease-in-out infinite; }
        .vh-vid5 { animation: cfl5 40s ease-in-out infinite; }
        .vh-in1 { animation: riseVH 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
        .vh-in2 { animation: riseVH 0.9s cubic-bezier(0.16,1,0.3,1) 0.25s both; }
        .vh-in3 { animation: riseVH 0.9s cubic-bezier(0.16,1,0.3,1) 0.4s both; }
        .vh-in4 { animation: riseVH 0.9s cubic-bezier(0.16,1,0.3,1) 0.55s both; }
        .vh-in5 { animation: riseVH 0.9s cubic-bezier(0.16,1,0.3,1) 0.7s both; }
        .vh-glow { animation: glowPulseVH 2s ease-in-out infinite; }
        .gm-menu-dropdown {
          position: absolute;
          top: 100%;
          ${isRtl ? "left: 0;" : "right: 0;"}
          min-width: 220px;
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
          text-align: ${isRtl ? "right" : "left"};
        }
        .gm-menu-dropdown a:hover { color: #4ade80; background: rgba(34,197,94,0.07); }
        @media (max-width: 768px) {
          .gm-nav { padding: 16px 20px !important; }
          .gm-hero-body { padding: 0 24px !important; }
          .gm-hero-headline { font-size: 48px !important; letter-spacing: -1.5px !important; line-height: 1.08 !important; }
          .gm-hero-sub { font-size: 17px !important; line-height: 1.7 !important; margin-bottom: 36px !important; }
          .gm-hero-ctas { gap: 10px !important; }
          .gm-hero-cta-primary { padding: 15px 32px !important; font-size: 16px !important; }
          .gm-hero-cta-secondary { display: none !important; }
        }
      ` }} />

      {/* Video backgrounds */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <video autoPlay muted loop playsInline className="vh-vid1" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}>
          <source src="/videos/care-compassion.mp4" type="video/mp4" />
        </video>
        <video autoPlay muted loop playsInline className="vh-vid2" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0 }}>
          <source src="/videos/wellness-meditation.mp4" type="video/mp4" />
        </video>
        <video autoPlay muted loop playsInline className="vh-vid3" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0 }}>
          <source src="/videos/medspa-treatment.mp4" type="video/mp4" />
        </video>
        <video autoPlay muted loop playsInline className="vh-vid4" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0 }}>
          <source src="/videos/dental-smile.mp4" type="video/mp4" />
        </video>
        <video autoPlay muted loop playsInline className="vh-vid5" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0 }}>
          <source src="/videos/physio-rehab.mp4" type="video/mp4" />
        </video>
      </div>

      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(160deg, rgba(3,7,18,0.78) 0%, rgba(5,25,12,0.40) 50%, rgba(3,7,18,0.75) 100%)" }} />
      <div className="vh-glow" style={{ position: "absolute", top: "35%", left: "50%", transform: "translateX(-50%)", width: "700px", height: "400px", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(34,197,94,0.20) 0%, transparent 70%)", zIndex: 1, pointerEvents: "none" }} />

      {/* Nav */}
      <nav className="gm-nav" style={{ position: "absolute", top: 0, width: "100%", padding: "22px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 20, boxSizing: "border-box" }}>
        <a href="/" style={{ fontWeight: 800, fontSize: "20px", letterSpacing: "-0.4px", textDecoration: "none", direction: "ltr" }}>
          <span style={{ color: "#22c55e" }}>Growth</span><span style={{ color: "white" }}>Monk</span>
        </a>

        {/* Right side: lang switcher + hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Language dropdown */}
          <LangDropdown lang={lang} />

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
                {t.nav.bookDemo}
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero content */}
      <div className="gm-hero-body" style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 32px", maxWidth: "1100px", width: "100%" }}>
        <h1 className="vh-in2" style={{ marginBottom: "28px", fontFamily: "inherit", padding: 0, margin: "0 0 28px", fontWeight: "inherit" }}>
          <div className="gm-hero-headline" style={{ fontSize: "clamp(38px,7.5vw,100px)", fontWeight: 900, lineHeight: 1.02, letterSpacing: lang === "ar" ? "-1px" : "-3.5px", color: "white", marginBottom: "0.04em" }}>
            {t.hero.headline1}
          </div>
          <div className="gm-hero-headline" style={{ fontSize: "clamp(38px,7.5vw,100px)", fontWeight: 900, lineHeight: 1.02, letterSpacing: lang === "ar" ? "-1px" : "-3.5px", display: "flex", justifyContent: "center", alignItems: "baseline", gap: "0.22em", direction: "ltr" }}>
            <span style={{ color: "white" }}>{t.hero.headline2}</span>
            <span style={{
              background: "linear-gradient(90deg, #22c55e, #4ade80)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              opacity: wordVisible ? 1 : 0,
              transition: `opacity ${FADE_MS}ms ease`,
              whiteSpace: "nowrap",
              display: "inline-block",
            }}>
              {t.hero.words[wordIdx]}
            </span>
          </div>
        </h1>

        <p className="sr-only">
          GrowthMonk helps clinics, medspas, dental practices, and wellness centres grow revenue, capture more patient leads from WhatsApp and social media, and get discovered in AI search engines like ChatGPT, Perplexity, and Google AI Overviews — before competitors. It qualifies patient enquiries automatically in under 90 seconds and books consultations directly into your calendar, available 24/7 in English, German, Turkish, and Arabic.
        </p>

        <p className="vh-in3 gm-hero-sub" style={{ fontSize: "19px", lineHeight: 1.65, color: "rgba(255,255,255,0.82)", maxWidth: "520px", marginBottom: "40px", fontWeight: 600 }}>
          {t.hero.sub}
        </p>

        <div className="vh-in4 gm-hero-ctas" style={{ display: "flex", gap: "12px", marginBottom: "48px", flexWrap: "wrap", justifyContent: "center" }}>
          <a className="gm-hero-cta-primary" href="#cta" style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "#22c55e", color: "#030712", padding: "15px 34px", borderRadius: "100px", fontWeight: 800, fontSize: "16px", textDecoration: "none", letterSpacing: "-0.2px", boxShadow: "0 0 40px rgba(34,197,94,0.3)" }}>
            {t.hero.ctaPrimary} <ArrowRight size={18} />
          </a>
          <a className="gm-hero-cta-secondary" href="#how-it-works" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.55)", padding: "15px 28px", borderRadius: "100px", fontWeight: 600, fontSize: "16px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.12)" }}>
            {t.hero.ctaSecondary}
          </a>
        </div>
      </div>
    </section>
  );
}
