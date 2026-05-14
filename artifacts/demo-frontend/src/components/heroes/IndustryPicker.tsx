import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";

interface PickerBranding {
  companyName: string;
  slug: string;
  clientId?: number;
  industry?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  tagline?: string | null;
  heroHeadline?: string | null;
  logoUrl?: string | null;
  city?: string | null;
  phone?: string | null;
  websiteUrl?: string | null;
  demoLanguage?: string | null;
  heroImageUrl?: string | null;
}

interface IndustryPickerProps {
  branding: PickerBranding;
  onSelect: (industry: string, updatedBranding: PickerBranding) => void;
}

const INDUSTRIES = [
  {
    key: "aesthetics",
    label: "Medical Aesthetics",
    brand: "AURIC",
    color: "#C4882A",
    bg: "rgba(196,136,42,0.12)",
    desc: "Botox · Filler · Laser · Microneedling",
  },
  {
    key: "wellness",
    label: "Wellness & Yoga",
    brand: "TĒRA",
    color: "#8BAF6A",
    bg: "rgba(139,175,106,0.12)",
    desc: "Breathwork · Meditation · Retreats",
  },
  {
    key: "care",
    label: "Home & Elderly Care",
    brand: "SOLACE",
    color: "#E8A84C",
    bg: "rgba(232,168,76,0.12)",
    desc: "Live-in · Dementia · Respite Care",
  },
  {
    key: "cosmetic-surgery",
    label: "Cosmetic Surgery",
    brand: "FORMA",
    color: "#C9B99A",
    bg: "rgba(201,185,154,0.12)",
    desc: "Rhinoplasty · Breast · Liposuction",
  },
  {
    key: "hair",
    label: "Hair Clinic",
    brand: "REVIVE",
    color: "#2A9BD4",
    bg: "rgba(42,155,212,0.12)",
    desc: "FUE · FUT · PRP · Scalp SMP",
  },
  {
    key: "weight-management",
    label: "Weight Management",
    brand: "VIVA",
    color: "#4CAF80",
    bg: "rgba(76,175,128,0.12)",
    desc: "Medical weight loss · GLP-1 · Sculpting",
  },
  {
    key: "iv-therapy",
    label: "IV Therapy & Drips",
    brand: "AURA",
    color: "#9B72CF",
    bg: "rgba(155,114,207,0.12)",
    desc: "Myers · Glutathione · NAD+ · Vitamins",
  },
  {
    key: "fertility",
    label: "Fertility & IVF",
    brand: "SOLARA",
    color: "#C4788A",
    bg: "rgba(196,120,138,0.12)",
    desc: "IVF · IUI · Egg Freezing",
  },
  {
    key: "dental",
    label: "Dental & Orthodontics",
    brand: "BLANC",
    color: "#3B9BD4",
    bg: "rgba(59,155,212,0.12)",
    desc: "Implants · Invisalign · Whitening",
  },
  {
    key: "physiotherapy",
    label: "Physiotherapy",
    brand: "KINĒSIS",
    color: "#4A9B6A",
    bg: "rgba(74,155,106,0.12)",
    desc: "Sports rehab · Manual therapy",
  },
  {
    key: "laser-eye",
    label: "Laser Eye Surgery",
    brand: "CLARO",
    color: "#2A74CB",
    bg: "rgba(42,116,203,0.12)",
    desc: "LASIK · LASEK · Lens replacement",
  },
];

export function IndustryPicker({ branding, onSelect }: IndustryPickerProps) {
  const [saving, setSaving] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  async function handleSelect(industryKey: string) {
    setSaving(industryKey);
    try {
      if (branding.clientId) {
        await fetch(`/api/admin/clients/${branding.clientId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ branding: { ...branding, industry: industryKey } }),
        });
      }
      onSelect(industryKey, { ...branding, industry: industryKey });
    } catch {
      onSelect(industryKey, { ...branding, industry: industryKey });
    } finally {
      setSaving(null);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{
        background: "linear-gradient(135deg, #060608 0%, #0E0C14 50%, #08060C 100%)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500&display=swap');
        .picker-serif { font-family: 'Playfair Display', serif; }
        @keyframes picker-fade { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .picker-in { animation: picker-fade 0.7s ease forwards; }
        .picker-in-2 { animation: picker-fade 0.7s 0.15s ease forwards; opacity:0; }
        .picker-in-3 { animation: picker-fade 0.7s 0.25s ease forwards; opacity:0; }
        .industry-card { transition: all 0.22s ease; border: 1px solid rgba(255,255,255,0.07); }
        .industry-card:hover { border-color: rgba(255,255,255,0.18); transform: translateY(-2px); }
      `}} />

      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-5xl">
          <div className="text-center mb-14 picker-in">
            <p className="text-[11px] tracking-[0.35em] uppercase text-white/35 mb-4">
              {branding.companyName}
            </p>
            <h1 className="picker-serif text-4xl md:text-5xl text-white mb-4 leading-tight">
              What kind of business<br />
              <em className="text-white/55">are you?</em>
            </h1>
            <p className="text-white/40 text-sm font-light max-w-sm mx-auto">
              We'll personalise the demo to match your sector — pick the closest fit.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 picker-in-3">
            {INDUSTRIES.map((ind) => {
              const isLoading = saving === ind.key;
              const isHovered = hovered === ind.key;
              return (
                <button
                  key={ind.key}
                  className="industry-card text-left p-5 rounded-xl relative overflow-hidden group"
                  style={{
                    background: isHovered ? ind.bg : "rgba(255,255,255,0.03)",
                  }}
                  onMouseEnter={() => setHovered(ind.key)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => !saving && handleSelect(ind.key)}
                  disabled={!!saving}
                >
                  <div
                    className="w-2 h-2 rounded-full mb-4"
                    style={{ backgroundColor: ind.color }}
                  />
                  <p
                    className="text-[10px] tracking-[0.25em] uppercase font-medium mb-1"
                    style={{ color: ind.color }}
                  >
                    {ind.brand}
                  </p>
                  <p className="text-white text-sm font-medium leading-snug mb-2">
                    {ind.label}
                  </p>
                  <p className="text-white/35 text-[11px] font-light leading-relaxed">
                    {ind.desc}
                  </p>
                  <div className="mt-4 flex items-center gap-1.5">
                    {isLoading ? (
                      <Loader2
                        className="w-3.5 h-3.5 animate-spin"
                        style={{ color: ind.color }}
                      />
                    ) : (
                      <ArrowRight
                        className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0 transition-transform"
                        style={{ color: ind.color }}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
