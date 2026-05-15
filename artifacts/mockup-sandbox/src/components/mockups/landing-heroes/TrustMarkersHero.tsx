import { ArrowRight, CheckCircle2, Star } from "lucide-react";

const ACCENT = "#E8A84C";
const BG = "#1A0E06";
const OVERLAY_H =
  "linear-gradient(to right, rgba(26,14,6,0.90) 0%, rgba(42,24,8,0.55) 50%, rgba(26,14,6,0.10) 100%)";
const OVERLAY_V =
  "linear-gradient(to top, rgba(26,14,6,0.72) 0%, transparent 50%, rgba(26,14,6,0.32) 100%)";

const TRUST_ITEMS = [
  "MDK-geprüft",
  "200+ Familien",
  "Zweisprachig DE/TR",
  "24/7 Erreichbar",
];

export function TrustMarkersHero() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,600;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap');
        .hero-serif { font-family: 'Cormorant', serif; }
        @keyframes fade-up { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .f1 { animation: fade-up 0.9s 0.1s ease forwards; opacity:0; }
        .f2 { animation: fade-up 0.9s 0.3s ease forwards; opacity:0; }
        .f3 { animation: fade-up 0.9s 0.5s ease forwards; opacity:0; }
        .f4 { animation: fade-up 0.9s 0.7s ease forwards; opacity:0; }
        .f5 { animation: fade-up 0.9s 0.9s ease forwards; opacity:0; }
        .f6 { animation: fade-up 0.9s 1.05s ease forwards; opacity:0; }
      `}</style>

      {/* ── HERO ── */}
      <section
        className="relative flex items-start overflow-hidden"
        style={{ backgroundColor: BG, height: "100vh", minHeight: 640 }}
      >
        {/* Background image (using care industry photo) */}
        <img
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&auto=format&fit=crop"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.52) saturate(1.08)" }}
        />
        <div className="absolute inset-0" style={{ background: OVERLAY_H }} />
        <div className="absolute inset-0" style={{ background: OVERLAY_V }} />

        {/* Top nav */}
        <nav className="absolute top-0 left-0 right-0 z-20 px-10 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="hero-serif text-2xl font-semibold tracking-wide"
              style={{ color: "#F5EEE6" }}
            >
              DOSTELI
            </span>
          </div>
          <button
            className="text-sm font-medium px-5 py-2 rounded border"
            style={{
              color: ACCENT,
              borderColor: `${ACCENT}55`,
              background: `${ACCENT}12`,
            }}
          >
            Jetzt anrufen
          </button>
        </nav>

        {/* Content grid */}
        <div className="relative z-10 flex w-full items-start px-10 md:px-16" style={{ paddingTop: "14vh" }}>
          <div className="flex-1 max-w-xl">

            {/* Category label */}
            <div className="f1 flex items-center gap-3 mb-5">
              <div className="h-px w-8" style={{ backgroundColor: ACCENT }} />
              <span
                className="text-xs font-semibold uppercase tracking-[0.18em]"
                style={{ color: ACCENT }}
              >
                Ambulante Pflege
              </span>
            </div>

            {/* Headline */}
            <h1
              className="hero-serif f2 font-semibold leading-[1.08] mb-4"
              style={{ color: "#F5EEE6", fontSize: "clamp(2.6rem, 5vw, 4rem)" }}
            >
              Culturally Sensitive
              <br />
              <em>Care Solutions</em>
            </h1>

            {/* Subtext */}
            <p className="f3 text-base font-light mb-8" style={{ color: "#C8B99A", lineHeight: 1.65 }}>
              Professionelle Unterstützung für Pflegebedürftige —<br />
              auf Deutsch und Türkisch.
            </p>

            {/* CTA */}
            <div className="f4 mb-8">
              <button
                className="inline-flex items-center gap-2 text-sm font-semibold px-7 py-3.5 rounded"
                style={{ backgroundColor: ACCENT, color: BG }}
              >
                Kostenlose Beratung
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* ── TRUST BADGES ── new element */}
            <div className="f5 flex flex-wrap gap-2">
              {TRUST_ITEMS.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                  style={{
                    color: "#D4C4A8",
                    background: "rgba(0,0,0,0.35)",
                    border: `1px solid ${ACCENT}40`,
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <CheckCircle2
                    className="h-3 w-3 shrink-0"
                    style={{ color: ACCENT }}
                  />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Review card — right side */}
          <div
            className="f6 hidden md:block ml-auto mt-auto mb-12 rounded-xl p-5 max-w-xs"
            style={{
              background: "rgba(10,6,2,0.72)",
              border: "1px solid rgba(232,168,76,0.20)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="flex gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" style={{ color: ACCENT }} />
              ))}
            </div>
            <p className="text-sm font-light italic mb-3" style={{ color: "#D4C4A8", lineHeight: 1.6 }}>
              "Margarets Pflegerin wurde Teil unserer Familie.
              Lebensverändernd."
            </p>
            <p className="text-xs font-medium" style={{ color: ACCENT }}>
              — James H.
            </p>
          </div>
        </div>

        {/* Scroll label */}
        <div
          className="absolute right-6 bottom-8 z-20 flex flex-col items-center gap-2"
          style={{ color: `${ACCENT}80` }}
        >
          <span
            className="text-[9px] font-semibold uppercase tracking-[0.2em]"
            style={{
              writingMode: "vertical-rl",
              letterSpacing: "0.2em",
            }}
          >
            SCROLL
          </span>
          <div className="w-px h-8" style={{ background: `${ACCENT}50` }} />
        </div>
      </section>

      {/* ── ANNOTATION PANEL (shows what changed) ── */}
      <div className="bg-gray-950 text-white px-10 py-8">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-5">
          What's new — Trust markers
        </h2>
        <div className="grid grid-cols-3 gap-6 text-sm">
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <p className="font-semibold text-white mb-1.5">Placement</p>
            <p className="text-gray-400 leading-relaxed">
              Below the CTA button — trust is established right at the point of action, not after it.
            </p>
          </div>
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <p className="font-semibold text-white mb-1.5">Style</p>
            <p className="text-gray-400 leading-relaxed">
              Semi-transparent pill badges with accent-coloured check icons and blur backdrop — premium, not logo-wall.
            </p>
          </div>
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <p className="font-semibold text-white mb-1.5">Data source</p>
            <p className="text-gray-400 leading-relaxed">
              Already defined per-industry in V3Hero configs (<code className="text-amber-400">trustItems[]</code>). Zero new data needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
