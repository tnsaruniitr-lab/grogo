import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

// AURIC — Video background version. AI-generated medspa treatment footage.
// Full-bleed video with dark amber overlay. Cinematic, editorial.
export function MedSpaV3() {
  return (
    <div className="min-h-screen bg-[#0E0804] text-[#F5EEE6] overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,600&family=Inter:wght@300;400;500&display=swap');
        .auric3-serif { font-family: 'Playfair Display', serif; }
        @keyframes a3fade { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
        .a3-1 { animation: a3fade 1s 0.15s ease forwards; opacity:0; }
        .a3-2 { animation: a3fade 1s 0.35s ease forwards; opacity:0; }
        .a3-3 { animation: a3fade 1s 0.55s ease forwards; opacity:0; }
        .a3-4 { animation: a3fade 1s 0.75s ease forwards; opacity:0; }
      `}} />

      {/* Navigation — overlaid on video */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-[#C4882A]" />
          <span className="auric3-serif text-lg font-bold tracking-tight text-[#F5EEE6]">AURIC</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-[#F5EEE6]/65 font-light tracking-wide">
          <a href="#" className="hover:text-[#C4882A] transition-colors">Treatments</a>
          <a href="#" className="hover:text-[#C4882A] transition-colors">Science</a>
          <a href="#" className="hover:text-[#C4882A] transition-colors">Results</a>
          <a href="#" className="hover:text-[#C4882A] transition-colors">Journal</a>
        </div>
        <button className="border border-[#C4882A] text-[#C4882A] px-5 py-2.5 text-sm tracking-wider font-light hover:bg-[#C4882A] hover:text-white transition-colors">
          Book Consultation
        </button>
      </nav>

      {/* Hero — full-bleed video */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* AI-generated video background */}
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.55) saturate(1.15)' }}
        >
          <source src="/__mockup/videos/medspa-treatment.mp4" type="video/mp4" />
        </video>

        {/* Brand overlay — dark amber gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E0804]/85 via-[#1A0E04]/50 to-[#0E0804]/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0804]/60 via-transparent to-[#0E0804]/30" />

        {/* Content — left column */}
        <div className="relative z-10 max-w-2xl px-8 md:px-16 pt-24 pb-16">
          <div className="a3-1">
            <span className="inline-flex items-center gap-2 text-[#C4882A] text-xs tracking-[0.3em] uppercase font-medium mb-8">
              <Sparkles className="w-3 h-3" /> Medical Aesthetics · London
            </span>
          </div>
          <h1 className="auric3-serif text-5xl md:text-6xl lg:text-[80px] leading-[1.02] text-[#F5EEE6] mb-8 a3-2">
            Where<br />
            <em className="text-[#C4882A]">Precision</em><br />
            Meets Glow
          </h1>
          <p className="text-[#F5EEE6]/60 text-lg font-light leading-relaxed mb-12 max-w-lg a3-3">
            Physician-led treatments crafted for results you can see and feel. Every procedure, every patient — held to the highest clinical standard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 a3-4">
            <button className="bg-[#C4882A] text-white px-8 py-4 text-sm tracking-widest uppercase font-medium flex items-center gap-3 group hover:bg-[#A87020] transition-colors">
              Book Free Consultation <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border border-[#F5EEE6]/25 text-[#F5EEE6]/75 px-8 py-4 text-sm tracking-widest uppercase font-light hover:border-[#F5EEE6]/50 transition-colors">
              View All Treatments
            </button>
          </div>
        </div>

        {/* Floating review card — bottom right */}
        <div className="absolute bottom-12 right-8 z-10 hidden md:block">
          <div className="bg-black/30 backdrop-blur-md border border-white/10 p-5 max-w-xs">
            <p className="text-[#F5EEE6]/85 text-sm italic leading-relaxed mb-3">
              "The results are extraordinary. I've never felt so confident in my skin."
            </p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#C4882A]/40 flex items-center justify-center text-xs text-[#C4882A]">S</div>
              <span className="text-[#F5EEE6]/40 text-xs tracking-wide">Sophia M. — Chelsea</span>
            </div>
          </div>
        </div>
      </section>

      {/* Treatment strip */}
      <section className="bg-[#C4882A] py-4 overflow-hidden">
        <div className="flex gap-16 text-[#0E0804]/70 text-xs tracking-[0.25em] uppercase font-medium whitespace-nowrap" style={{ animation: 'scroll 25s linear infinite' }}>
          {Array(5).fill(['Botox · Filler · Laser · Morpheus8 · Microneedling · PRP · Profhilo · Hydrafacial']).map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </section>

      {/* Treatments grid */}
      <section className="py-24 px-8 bg-[#0E0804]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="text-[#C4882A] text-xs tracking-[0.3em] uppercase mb-3">Signature Treatments</p>
              <h2 className="auric3-serif text-4xl text-[#F5EEE6]">Crafted for Results</h2>
            </div>
            <button className="text-[#C4882A] text-sm tracking-wider hidden md:flex items-center gap-2 hover:gap-3 transition-all">
              All treatments <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {[
              { title: 'Botox & Toxins', tag: 'Anti-Ageing', desc: 'Natural relaxation of expression lines. Results from 48 hours.' },
              { title: 'Dermal Fillers', tag: 'Volume & Lift', desc: 'Restore youthful volume with hyaluronic acid precision placement.' },
              { title: 'Morpheus8', tag: 'Skin Tightening', desc: 'Radiofrequency microneedling for dramatic collagen remodelling.' },
              { title: 'Medical Peels', tag: 'Renewal', desc: 'Physician-grade formulations that transform skin tone and texture.' },
              { title: 'Laser Resurfacing', tag: 'Correction', desc: 'Target pigmentation, scarring and fine lines with clinical precision.' },
              { title: 'PRP Therapy', tag: 'Regeneration', desc: 'Harness your own growth factors for natural skin and hair renewal.' },
            ].map((t, i) => (
              <div key={i} className="bg-[#0E0804] p-8 group hover:bg-[#1A1208] transition-colors cursor-pointer">
                <span className="text-[#C4882A] text-[10px] tracking-[0.25em] uppercase">{t.tag}</span>
                <h3 className="auric3-serif text-xl text-[#F5EEE6] mt-2 mb-3">{t.title}</h3>
                <p className="text-[#F5EEE6]/40 text-sm leading-relaxed font-light">{t.desc}</p>
                <div className="mt-6 w-6 h-px bg-[#C4882A] group-hover:w-12 transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote block */}
      <section className="py-20 px-8 bg-[#C4882A]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="auric3-serif italic text-4xl text-[#0E0804] leading-relaxed mb-6">
            "Science without artistry is cold. Artistry without science is unsafe. We practise both."
          </p>
          <span className="text-[#0E0804]/60 text-xs tracking-widest uppercase">— Dr. Amara O., Lead Physician</span>
        </div>
      </section>

      <footer className="py-10 px-8 bg-[#080503] text-center text-[#F5EEE6]/20 text-xs tracking-widest uppercase">
        © {new Date().getFullYear()} AURIC Medical Aesthetics · London · Regulated by the CQC
      </footer>
    </div>
  );
}
