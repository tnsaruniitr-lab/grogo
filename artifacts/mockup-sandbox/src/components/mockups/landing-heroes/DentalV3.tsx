import React from 'react';
import { ArrowRight, Star } from 'lucide-react';

// BLANC — Premium cosmetic dental. AI video: radiant smile reveal, warm clinical.
export function DentalV3() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1C1C1A] overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500&display=swap');
        .blanc-serif { font-family: 'Playfair Display', serif; }
        @keyframes bl-up { from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)} }
        .bl-1{animation:bl-up 0.9s 0.1s ease forwards;opacity:0}
        .bl-2{animation:bl-up 0.9s 0.25s ease forwards;opacity:0}
        .bl-3{animation:bl-up 0.9s 0.4s ease forwards;opacity:0}
        .bl-4{animation:bl-up 0.9s 0.55s ease forwards;opacity:0}
      `}} />

      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-black/5">
        <div className="blanc-serif text-xl font-bold tracking-wide text-[#1C1C1A]">BLANC<span className="text-[#B8973E]">.</span></div>
        <div className="hidden md:flex gap-8 text-sm text-[#1C1C1A]/55 font-light tracking-wide">
          <a href="#" className="hover:text-[#B8973E] transition-colors">Treatments</a>
          <a href="#" className="hover:text-[#B8973E] transition-colors">Technology</a>
          <a href="#" className="hover:text-[#B8973E] transition-colors">Gallery</a>
          <a href="#" className="hover:text-[#B8973E] transition-colors">Pricing</a>
        </div>
        <button className="bg-[#1C1C1A] text-white px-5 py-2.5 text-sm tracking-wider hover:bg-[#B8973E] transition-colors">Book Free Consult</button>
      </nav>

      <section className="relative min-h-screen flex items-center overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" style={{filter:'brightness(0.52) saturate(1.1)'}}>
          <source src="/__mockup/videos/dental-smile.mp4" type="video/mp4" />
        </video>
        {/* Warm ivory overlay — lets the smile warmth through */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0A06]/88 via-[#181208]/55 to-[#0D0A06]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0A06]/60 via-transparent to-[#0D0A06]/25" />

        <div className="relative z-10 max-w-2xl px-8 md:px-16 pt-24 pb-16">
          <p className="text-[#B8973E] text-xs tracking-[0.35em] uppercase mb-8 bl-1">Cosmetic Dentistry · London</p>
          <h1 className="blanc-serif text-5xl md:text-6xl lg:text-[78px] leading-[1.02] text-white mb-8 bl-2">
            Your Most<br /><em className="text-[#D4B860]">Confident</em><br />Smile
          </h1>
          <p className="text-white/60 text-lg font-light leading-relaxed max-w-md mb-12 bl-3">
            Precision cosmetic dentistry by specialist clinicians. Veneers, Invisalign, whitening and implants — crafted to feel completely natural.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 bl-4">
            <button className="bg-[#B8973E] text-white px-8 py-4 text-sm tracking-widest uppercase font-medium flex items-center gap-2 group hover:bg-[#D4B860] transition-colors">
              Free Smile Consultation <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border border-white/20 text-white/70 px-8 py-4 text-sm tracking-widest uppercase font-light hover:border-white/40 transition-colors">View Smile Gallery</button>
          </div>
        </div>

        <div className="absolute bottom-10 left-0 right-0 z-10 flex justify-center">
          <div className="flex items-center gap-6 bg-white/8 backdrop-blur-sm border border-white/12 px-8 py-4 rounded-full">
            <div className="flex gap-1">{[1,2,3,4,5].map(i=><Star key={i} className="w-3.5 h-3.5 fill-[#B8973E] text-[#B8973E]"/>)}</div>
            <span className="text-white/65 text-xs font-light">4.9 · 2,400+ smiles transformed</span>
            <span className="text-white/25 text-xs">|</span>
            <span className="text-white/65 text-xs font-light">GDC Registered · BDA Member</span>
          </div>
        </div>
      </section>

      <section className="bg-[#B8973E] py-4 overflow-hidden">
        <div className="flex gap-16 text-[#1C1C1A]/70 text-xs tracking-[0.25em] uppercase font-medium whitespace-nowrap" style={{animation:'scroll 28s linear infinite'}}>
          {Array(5).fill('Porcelain Veneers · Invisalign · Dental Implants · Composite Bonding · Teeth Whitening · Smile Design').map((t,i)=><span key={i}>{t}</span>)}
        </div>
      </section>

      <section className="py-24 px-8 bg-[#FAFAF8]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <p className="text-[#B8973E] text-xs tracking-[0.3em] uppercase mb-3">Signature Treatments</p>
            <h2 className="blanc-serif text-4xl text-[#1C1C1A]">The BLANC Collection</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1C1C1A]/8">
            {[
              {t:'Porcelain Veneers', s:'From £650/tooth', d:'Wafer-thin shells bonded to the front of teeth for a flawless, natural-looking smile.'},
              {t:'Dental Implants', s:'From £2,200', d:'Permanent, natural-feeling replacements for missing teeth — built to last a lifetime.'},
              {t:'Invisalign', s:'From £2,800', d:'Near-invisible aligners that straighten teeth without disrupting your life.'},
              {t:'Composite Bonding', s:'From £250/tooth', d:'Same-day smile makeovers using tooth-coloured resin — no drilling required.'},
              {t:'Teeth Whitening', s:'From £395', d:'Professional-grade whitening for a brilliantly bright, natural result.'},
              {t:'Full Smile Design', s:'Bespoke', d:'A complete digital smile plan — every element coordinated for perfect harmony.'},
            ].map((t,i)=>(
              <div key={i} className="bg-[#FAFAF8] p-8 group hover:bg-[#F5F0E6] transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="blanc-serif text-xl text-[#1C1C1A]">{t.t}</h3>
                  <span className="text-[#B8973E] text-xs tracking-wide font-medium">{t.s}</span>
                </div>
                <p className="text-[#1C1C1A]/50 text-sm leading-relaxed font-light">{t.d}</p>
                <div className="mt-6 w-6 h-px bg-[#B8973E] group-hover:w-12 transition-all duration-500"/>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-8 bg-[#1C1C1A]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="blanc-serif italic text-4xl text-white leading-relaxed mb-6">"A smile is the first thing people see. We make sure it tells the right story."</p>
          <span className="text-white/40 text-xs tracking-widest uppercase">— Dr. Elena V., Principal Dentist</span>
        </div>
      </section>

      <section className="py-20 px-8 bg-[#B8973E]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="blanc-serif text-4xl text-[#1C1C1A] mb-4">Start with a free smile consultation</h2>
          <p className="text-[#1C1C1A]/65 mb-10 font-light">A 30-minute conversation to understand your goals and show you what's possible. No obligation.</p>
          <button className="bg-[#1C1C1A] text-white px-10 py-4 font-medium hover:bg-[#2C2C2A] transition-colors">Book Your Free Consultation</button>
        </div>
      </section>

      <footer className="py-10 px-8 bg-[#0D0A06] text-center text-white/20 text-xs tracking-widest uppercase">
        © {new Date().getFullYear()} BLANC Cosmetic Dentistry · GDC Registered · London
      </footer>
    </div>
  );
}
