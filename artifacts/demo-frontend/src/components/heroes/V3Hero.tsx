import { ArrowRight, CheckCircle2, Facebook, Instagram, Linkedin, Phone, Star, Twitter } from "lucide-react";

interface V3HeroProps {
  industry: string;
  companyName: string;
  logoUrl?: string | null;
  headline: string;
  subtext: string;
  phone?: string | null;
  city?: string | null;
  onCtaClick: () => void;
  preview?: boolean;
  previewImageUrl?: string;
}

interface HeroConfig {
  video: string;
  accent: string;
  bg: string;
  overlayH: string;
  overlayV: string;
  serif: string;
  seriffontImport: string;
  serifClass: string;
  categoryLabel: string;
  subcategoryLabel: string;
  ctaLabel: string;
  reviewQuote: string;
  reviewName: string;
  trustItems: string[];
}

const CONFIGS: Record<string, HeroConfig> = {
  aesthetics: {
    video: "/__mockup/videos/medspa-treatment.mp4",
    accent: "#C4882A",
    bg: "#0E0804",
    overlayH:
      "linear-gradient(to right, rgba(14,8,4,0.90) 0%, rgba(26,14,4,0.55) 50%, rgba(14,8,4,0.15) 100%)",
    overlayV:
      "linear-gradient(to top, rgba(14,8,4,0.65) 0%, transparent 50%, rgba(14,8,4,0.30) 100%)",
    serif: "'Playfair Display', serif",
    seriffontImport:
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@300;400;500&display=swap",
    serifClass: "v3hero-serif",
    categoryLabel: "Medical Aesthetics",
    subcategoryLabel: "Botox · Filler · Laser · Skin Science",
    ctaLabel: "Book Free Consultation",
    reviewQuote:
      '"The results are extraordinary. I\'ve never felt so confident in my skin."',
    reviewName: "Sophia M.",
    trustItems: ["CQC Registered", "GMC Certified", "500+ 5★ Reviews", "Award Winner 2024"],
  },
  wellness: {
    video: "/__mockup/videos/wellness-meditation.mp4",
    accent: "#8BAF6A",
    bg: "#0D1209",
    overlayH:
      "linear-gradient(to right, rgba(13,18,9,0.90) 0%, rgba(13,18,9,0.55) 50%, rgba(13,18,9,0.15) 100%)",
    overlayV:
      "linear-gradient(to top, rgba(13,18,9,0.92) 0%, rgba(13,18,9,0.35) 50%, rgba(13,18,9,0.20) 100%)",
    serif: "'EB Garamond', serif",
    seriffontImport:
      "https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@300;400;500&display=swap",
    serifClass: "v3hero-serif",
    categoryLabel: "Wellness & Mindfulness",
    subcategoryLabel: "Yoga · Breathwork · Meditation · Retreats",
    ctaLabel: "Begin Your Practice",
    reviewQuote:
      '"A sanctuary I return to again and again. Truly transformative."',
    reviewName: "Maya L.",
    trustItems: ["200+ Classes/Month", "Expert Instructors", "All Levels Welcome", "7-Day Free Trial"],
  },
  care: {
    video: "/__mockup/videos/care-compassion.mp4",
    accent: "#E8A84C",
    bg: "#1A0E06",
    overlayH:
      "linear-gradient(to right, rgba(26,14,6,0.90) 0%, rgba(42,24,8,0.55) 50%, rgba(26,14,6,0.10) 100%)",
    overlayV:
      "linear-gradient(to top, rgba(26,14,6,0.72) 0%, transparent 50%, rgba(26,14,6,0.32) 100%)",
    serif: "'Cormorant', serif",
    seriffontImport:
      "https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,600;1,400;1,600&family=Inter:wght@300;400;500&display=swap",
    serifClass: "v3hero-serif",
    categoryLabel: "Premium Home Care",
    subcategoryLabel: "Live-in · Dementia · Respite · Nursing",
    ctaLabel: "Book Free Assessment",
    reviewQuote: '"Margaret\'s carer became part of the family. Life-changing."',
    reviewName: "James H.",
    trustItems: ["CQC Registered", "DBS Checked Carers", "3,500+ Families", "24/7 Support"],
  },
  "cosmetic-surgery": {
    video: "/__mockup/videos/cosmetic-surgery.mp4",
    accent: "#C9B99A",
    bg: "#0B0907",
    overlayH:
      "linear-gradient(to right, rgba(11,9,7,0.90) 0%, rgba(11,9,7,0.55) 50%, rgba(11,9,7,0.15) 100%)",
    overlayV:
      "linear-gradient(to top, rgba(11,9,7,0.65) 0%, transparent 50%, rgba(11,9,7,0.30) 100%)",
    serif: "'Playfair Display', serif",
    seriffontImport:
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500&display=swap",
    serifClass: "v3hero-serif",
    categoryLabel: "Cosmetic Surgery",
    subcategoryLabel: "Rhinoplasty · Breast · Liposuction · Blepharoplasty",
    ctaLabel: "Book a Consultation",
    reviewQuote: '"Precise, professional and genuinely life-changing results."',
    reviewName: "Elena B.",
    trustItems: ["Board-Certified Surgeons", "Accredited Facility", "10yr Aftercare", "5★ Reviews"],
  },
  hair: {
    video: "/__mockup/videos/hair-clinic.mp4",
    accent: "#2A9BD4",
    bg: "#060E14",
    overlayH:
      "linear-gradient(to right, rgba(6,14,20,0.90) 0%, rgba(6,14,20,0.55) 50%, rgba(6,14,20,0.15) 100%)",
    overlayV:
      "linear-gradient(to top, rgba(6,14,20,0.70) 0%, transparent 50%, rgba(6,14,20,0.30) 100%)",
    serif: "'EB Garamond', serif",
    seriffontImport:
      "https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500&display=swap",
    serifClass: "v3hero-serif",
    categoryLabel: "Hair Restoration",
    subcategoryLabel: "FUE · FUT · PRP · Scalp Micropigmentation",
    ctaLabel: "Free Hair Assessment",
    reviewQuote: '"My confidence is completely restored. Incredible results."',
    reviewName: "David K.",
    trustItems: ["8,000+ Procedures", "GMC Registered", "Lifetime Guarantee", "0% Finance"],
  },
  "weight-management": {
    video: "/__mockup/videos/weight-management.mp4",
    accent: "#4CAF80",
    bg: "#040C07",
    overlayH:
      "linear-gradient(to right, rgba(4,12,7,0.90) 0%, rgba(4,12,7,0.55) 50%, rgba(4,12,7,0.15) 100%)",
    overlayV:
      "linear-gradient(to top, rgba(4,12,7,0.70) 0%, transparent 50%, rgba(4,12,7,0.30) 100%)",
    serif: "'Playfair Display', serif",
    seriffontImport:
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500&display=swap",
    serifClass: "v3hero-serif",
    categoryLabel: "Medical Weight Loss",
    subcategoryLabel: "GLP-1 · Dietary · Non-surgical Sculpting",
    ctaLabel: "Start Your Journey",
    reviewQuote: '"Lost 24kg in 6 months with full medical support. Unbelievable."',
    reviewName: "Sarah T.",
    trustItems: ["Doctor-Led Programme", "Clinically Proven", "Personalised Plans", "Ongoing Support"],
  },
  "iv-therapy": {
    video: "/__mockup/videos/iv-therapy.mp4",
    accent: "#9B72CF",
    bg: "#080512",
    overlayH:
      "linear-gradient(to right, rgba(8,5,18,0.90) 0%, rgba(8,5,18,0.55) 50%, rgba(8,5,18,0.15) 100%)",
    overlayV:
      "linear-gradient(to top, rgba(8,5,18,0.70) 0%, transparent 50%, rgba(8,5,18,0.30) 100%)",
    serif: "'Playfair Display', serif",
    seriffontImport:
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500&display=swap",
    serifClass: "v3hero-serif",
    categoryLabel: "IV Therapy & Drips",
    subcategoryLabel: "Myers · Glutathione · NAD+ · Vitamin Drips",
    ctaLabel: "Book IV Session",
    reviewQuote: '"The energy boost is immediate and remarkable."',
    reviewName: "Alexandra R.",
    trustItems: ["Nurse-Administered", "Pharmaceutical Grade", "Same-Day Appointments", "Home Visits"],
  },
  fertility: {
    video: "/__mockup/videos/fertility-ivf.mp4",
    accent: "#C4788A",
    bg: "#140B0E",
    overlayH:
      "linear-gradient(to right, rgba(20,11,14,0.90) 0%, rgba(20,11,14,0.55) 50%, rgba(20,11,14,0.15) 100%)",
    overlayV:
      "linear-gradient(to top, rgba(20,11,14,0.70) 0%, transparent 50%, rgba(20,11,14,0.30) 100%)",
    serif: "'Cormorant', serif",
    seriffontImport:
      "https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,600;1,400;1,600&family=Inter:wght@300;400;500&display=swap",
    serifClass: "v3hero-serif",
    categoryLabel: "Fertility & IVF",
    subcategoryLabel: "IVF · IUI · Egg Freezing · Consultations",
    ctaLabel: "Book a Consultation",
    reviewQuote: '"After years of trying, they made our dream possible."',
    reviewName: "Emma & Tom W.",
    trustItems: ["HFEA Licensed", "75% Success Rate", "Compassionate Care", "Full Transparency"],
  },
  dental: {
    video: "/__mockup/videos/dental-smile.mp4",
    accent: "#3B9BD4",
    bg: "#040C14",
    overlayH:
      "linear-gradient(to right, rgba(4,12,20,0.90) 0%, rgba(4,12,20,0.55) 50%, rgba(4,12,20,0.15) 100%)",
    overlayV:
      "linear-gradient(to top, rgba(4,12,20,0.70) 0%, transparent 50%, rgba(4,12,20,0.30) 100%)",
    serif: "'Playfair Display', serif",
    seriffontImport:
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500&display=swap",
    serifClass: "v3hero-serif",
    categoryLabel: "Dental & Orthodontics",
    subcategoryLabel: "Implants · Invisalign · Whitening · Smile Design",
    ctaLabel: "Book Smile Consultation",
    reviewQuote: '"Best decision I ever made. Incredible smile transformation."',
    reviewName: "Laura M.",
    trustItems: ["GDC Registered", "Invisalign Diamond", "Sedation Available", "0% Finance"],
  },
  physiotherapy: {
    video: "/__mockup/videos/physio-rehab.mp4",
    accent: "#4A9B6A",
    bg: "#060E08",
    overlayH:
      "linear-gradient(to right, rgba(6,14,8,0.90) 0%, rgba(6,14,8,0.55) 50%, rgba(6,14,8,0.15) 100%)",
    overlayV:
      "linear-gradient(to top, rgba(6,14,8,0.70) 0%, transparent 50%, rgba(6,14,8,0.30) 100%)",
    serif: "'EB Garamond', serif",
    seriffontImport:
      "https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500&display=swap",
    serifClass: "v3hero-serif",
    categoryLabel: "Physiotherapy & Rehab",
    subcategoryLabel: "Sports Rehab · Manual Therapy · Acupuncture",
    ctaLabel: "Book Assessment",
    reviewQuote: '"Recovered from injury 3× faster than expected. Outstanding."',
    reviewName: "Michael J.",
    trustItems: ["HCPC Registered", "Same-Day Bookings", "Sports Specialists", "All Insurers"],
  },
  "laser-eye": {
    video: "/__mockup/videos/laser-eye.mp4",
    accent: "#2A74CB",
    bg: "#04080F",
    overlayH:
      "linear-gradient(to right, rgba(4,8,15,0.90) 0%, rgba(4,8,15,0.55) 50%, rgba(4,8,15,0.15) 100%)",
    overlayV:
      "linear-gradient(to top, rgba(4,8,15,0.70) 0%, transparent 50%, rgba(4,8,15,0.30) 100%)",
    serif: "'Playfair Display', serif",
    seriffontImport:
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500&display=swap",
    serifClass: "v3hero-serif",
    categoryLabel: "Laser Eye Surgery",
    subcategoryLabel: "LASIK · LASEK · Cataract · Lens Replacement",
    ctaLabel: "Check My Suitability",
    reviewQuote: '"Perfect vision from day one. Genuinely life-changing."',
    reviewName: "Christopher A.",
    trustItems: ["CQC Registered", "10,000+ Procedures", "Lifetime Guarantee", "0% Finance"],
  },
};

const DEFAULT_CONFIG: HeroConfig = {
  video: "/__mockup/videos/medspa-treatment.mp4",
  accent: "#C4882A",
  bg: "#0E0804",
  overlayH:
    "linear-gradient(to right, rgba(14,8,4,0.90) 0%, rgba(14,8,4,0.55) 50%, rgba(14,8,4,0.15) 100%)",
  overlayV:
    "linear-gradient(to top, rgba(14,8,4,0.65) 0%, transparent 50%, rgba(14,8,4,0.30) 100%)",
  serif: "'Playfair Display', serif",
  seriffontImport:
    "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500&display=swap",
  serifClass: "v3hero-serif",
  categoryLabel: "Professional Services",
  subcategoryLabel: "",
  ctaLabel: "Book Consultation",
  reviewQuote: '"Exceptional service and incredible results."',
  reviewName: "A. Client",
  trustItems: ["Fully Insured", "Professional Team", "5★ Reviews", "Instant Response"],
};

export function V3Hero({
  industry,
  companyName,
  logoUrl,
  headline,
  subtext,
  phone,
  city,
  onCtaClick,
  preview = false,
  previewImageUrl,
}: V3HeroProps) {
  const cfg = CONFIGS[industry] ?? DEFAULT_CONFIG;

  return (
    <section
      className="relative h-screen flex items-start overflow-hidden"
      style={{ backgroundColor: cfg.bg, fontFamily: "'Inter', sans-serif" }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('${cfg.seriffontImport}');
        .v3hero-serif { font-family: ${cfg.serif}; }
        ${preview ? `
          .v3-1,.v3-2,.v3-3,.v3-4,.v3-5 { opacity:1; }
        ` : `
          @keyframes v3fade { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
          .v3-1 { animation: v3fade 0.9s 0.10s ease forwards; opacity:0; }
          .v3-2 { animation: v3fade 0.9s 0.30s ease forwards; opacity:0; }
          .v3-3 { animation: v3fade 0.9s 0.50s ease forwards; opacity:0; }
          .v3-4 { animation: v3fade 0.9s 0.70s ease forwards; opacity:0; }
          .v3-5 { animation: v3fade 0.9s 0.90s ease forwards; opacity:0; }
        `}
      `}} />

      {/* Background — static image in preview mode (instant), video otherwise */}
      {preview ? (
        <img
          src={previewImageUrl ?? ""}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.52) saturate(1.12)" }}
        />
      ) : (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.52) saturate(1.12)" }}
        >
          <source src={cfg.video} type="video/mp4" />
        </video>
      )}

      {/* Horizontal overlay — strong left fade */}
      <div className="absolute inset-0" style={{ background: cfg.overlayH }} />
      {/* Vertical overlay — bottom vignette */}
      <div className="absolute inset-0" style={{ background: cfg.overlayV }} />

      {/* Slim top nav bar */}
      <nav className="absolute top-0 left-0 right-0 z-20 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt={companyName} className="h-14 w-auto max-w-[200px] object-contain" />
          ) : (
            <span
              className="v3hero-serif text-2xl font-semibold tracking-wide"
              style={{ color: "#F5EEE6" }}
            >
              {companyName}
            </span>
          )}
        </div>
        <div
          className="hidden md:flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase font-light"
          style={{ color: "rgba(245,238,230,0.45)" }}
        >
          {city && <span>{city}</span>}
          {city && phone && <span>·</span>}
          {phone && <span>{phone}</span>}
        </div>
        {/* Social icons — decorative, no links */}
        <div className="hidden md:flex items-center gap-2">
          {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
            <div
              key={i}
              className="h-8 w-8 rounded-full flex items-center justify-center cursor-default"
              style={{
                background: "rgba(245,238,230,0.08)",
                border: "1px solid rgba(245,238,230,0.14)",
              }}
            >
              <Icon className="h-3.5 w-3.5" style={{ color: "rgba(245,238,230,0.55)" }} />
            </div>
          ))}
        </div>
        <button
          onClick={onCtaClick}
          className="border px-5 py-2.5 text-xs tracking-wider font-light transition-colors hover:bg-white/10"
          style={{ borderColor: `${cfg.accent}80`, color: cfg.accent }}
        >
          {cfg.ctaLabel}
        </button>
      </nav>

      {/* Main content — left column */}
      <div className="relative z-10 max-w-2xl px-8 md:px-16 pt-24 pb-16">
        <div className="v3-1">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-8 h-px" style={{ backgroundColor: cfg.accent }} />
            <span
              className="text-[11px] tracking-[0.3em] uppercase font-medium"
              style={{ color: cfg.accent }}
            >
              {cfg.categoryLabel}
              {city ? ` · ${city}` : ""}
            </span>
          </div>
        </div>

        <h1
          className="v3hero-serif text-5xl md:text-6xl lg:text-[76px] leading-[1.03] mb-8 v3-2"
          style={{ color: "#F5EEE6" }}
        >
          {headline.includes("\n")
            ? headline.split("\n").map((line, i) => (
                <span key={i}>
                  {i === 1 ? <em style={{ color: cfg.accent }}>{line}</em> : line}
                  <br />
                </span>
              ))
            : headline}
        </h1>

        <p
          className="text-lg font-light leading-relaxed max-w-md mb-12 v3-3"
          style={{ color: "rgba(245,238,230,0.60)" }}
        >
          {subtext || cfg.subcategoryLabel}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 v3-4">
          <button
            onClick={onCtaClick}
            className="px-8 py-4 text-sm font-semibold flex items-center gap-2 group transition-colors"
            style={{ backgroundColor: cfg.accent, color: cfg.bg }}
          >
            {cfg.ctaLabel}{" "}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          {phone && (
            <button
              className="border px-8 py-4 text-sm font-light flex items-center gap-2 transition-colors hover:bg-white/10"
              style={{ borderColor: "rgba(245,238,230,0.20)", color: "rgba(245,238,230,0.70)" }}
            >
              <Phone className="w-4 h-4" /> {phone}
            </button>
          )}
        </div>

        {/* Trust badge pills */}
        <div className="mt-8 flex flex-wrap gap-2 v3-5">
          {cfg.trustItems.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
              style={{
                color: "rgba(245,238,230,0.80)",
                background: "rgba(0,0,0,0.35)",
                border: `1px solid ${cfg.accent}40`,
                backdropFilter: "blur(6px)",
              }}
            >
              <CheckCircle2 className="h-3 w-3 shrink-0" style={{ color: cfg.accent }} />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Floating review card — bottom right */}
      <div className="absolute bottom-10 right-8 z-20 hidden lg:block">
        <div
          className="backdrop-blur-md border p-5 max-w-[260px]"
          style={{
            backgroundColor: "rgba(0,0,0,0.28)",
            borderColor: "rgba(245,238,230,0.10)",
          }}
        >
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className="w-3 h-3"
                style={{ fill: cfg.accent, color: cfg.accent }}
              />
            ))}
          </div>
          <p
            className="text-sm italic leading-relaxed mb-3"
            style={{ color: "rgba(245,238,230,0.80)" }}
          >
            {cfg.reviewQuote}
          </p>
          <span
            className="text-xs"
            style={{ color: "rgba(245,238,230,0.35)" }}
          >
            — {cfg.reviewName}
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute right-8 bottom-16 z-20 hidden md:flex flex-col items-center gap-2"
        style={{ color: "rgba(245,238,230,0.25)" }}
      >
        <div className="h-12 w-px" style={{ backgroundColor: "rgba(245,238,230,0.18)" }} />
        <span
          className="text-[10px] tracking-widest uppercase"
          style={{ writingMode: "vertical-rl" }}
        >
          Scroll
        </span>
      </div>
    </section>
  );
}
