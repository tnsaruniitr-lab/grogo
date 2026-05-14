import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';

// AURA — Premium IV drip & vitamin therapy. AI video: elegant IV infusion, luxury clinic.
export function IVTherapyV3() {
  return (
    <div className="min-h-screen bg-[#0F0A1E] text-[#EDE8F5] overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500&display=swap');
        .aura-serif { font-family: 'Cormorant', serif; }
        @keyframes au-up { from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)} }
        .au-1{animation:au-up 1s 0.1s ease forwards;opacity:0}
        .au-2{animation:au-up 1s 0.3s ease forwards;opacity:0}
        .au-3{animation:au-up 1s 0.5s ease forwards;opacity:0}
        .au-4{animation:au-up 1s 0.7s ease forwards;opacity:0}
      `}} />

      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap strokeWidth={1.5} className="w-4 h-4 text-[#C4A84C]"/>
          <span className="aura-serif text-xl font-semibold tracking-[0.15em] text-[#EDE8F5]">AURA</span>
          <span className="text-[#EDE8F5]/30 text-xs tracking-widest ml-1">IV WELLNESS</span>
        </div>
        <div className="hidden md:flex gap-8 text-xs tracking-widest uppercase text-[#EDE8F5]/40 font-light">
          <a href="#" className="hover:text-[#C4A84C] transition-colors">Drips</a>
          <a href="#" className="hover:text-[#C4A84C] transition-colors">Boosters</a>
          <a href="#" className="hover:text-[#C4A84C] transition-colors">Concierge</a>
          <a href="#" className="hover:text-[#C4A84C] transition-colors">Membership</a>
        </div>
        <button className="border border-[#C4A84C]/50 text-[#C4A84C] px-5 py-2 text-xs tracking-[0.2em] uppercase hover:bg-[#C4A84C]/10 transition-colors">Book Drip</button>
      </nav>

      <section className="relative min-h-screen flex items-center overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" style={{filter:'brightness(0.42) saturate(1.05)'}}>
          <source src="/__mockup/videos/iv-therapy.mp4" type="video/mp4" />
        </video>
        {/* Deep indigo/amethyst overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F0A1E]/92 via-[#1A1030]/58 to-[#0F0A1E]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0A1E]/65 via-transparent to-[#0F0A1E]/30" />

        <div className="relative z-10 max-w-xl px-8 md:px-16 pt-24 pb-16">
          <p className="text-[#C4A84C] text-xs tracking-[0.35em] uppercase mb-8 au-1">IV Infusion · Vitamin Therapy · NAD+</p>
          <h1 className="aura-serif text-5xl md:text-6xl lg:text-[78px] leading-[1.02] text-[#EDE8F5] mb-8 au-2">
            Recharge<br /><em className="text-[#C4A84C]">From</em><br />Within
          </h1>
          <p className="text-[#EDE8F5]/55 text-lg font-light leading-relaxed max-w-md mb-12 au-3">
            Medical-grade IV drips, vitamin injections and NAD+ protocols. Delivered in our luxury clinic or at your home, hotel or office.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 au-4">
            <button className="bg-[#C4A84C] text-[#0F0A1E] px-8 py-4 text-sm tracking-widest uppercase font-semibold flex items-center gap-2 group hover:bg-[#D4B860] transition-colors">
              Book Your Drip <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
            </button>
            <button className="border border-[#EDE8F5]/20 text-[#EDE8F5]/70 px-8 py-4 text-sm tracking-widest uppercase font-light hover:border-[#EDE8F5]/40 transition-colors">Explore Protocols</button>
          </div>
        </div>

        {/* Concierge badge */}
        <div className="absolute bottom-10 right-8 z-10 hidden md:block">
          <div className="bg-white/6 backdrop-blur-md border border-white/10 px-6 py-4 text-center">
            <p className="text-[#C4A84C] text-xs tracking-widest uppercase mb-1">Concierge Available</p>
            <p className="text-[#EDE8F5]/60 text-xs font-light">Home · Hotel · Office delivery</p>
          </div>
        </div>
      </section>

      <section className="bg-[#C4A84C] py-4 overflow-hidden">
        <div className="flex gap-16 text-[#0F0A1E]/70 text-xs tracking-[0.25em] uppercase font-medium whitespace-nowrap" style={{animation:'scroll 28s linear infinite'}}>
          {Array(5).fill('Myers Cocktail · NAD+ · Glutathione · Vitamin C · B12 · Immune Boost · Hangover Cure · Beauty Drip').map((t,i)=><span key={i}>{t}</span>)}
        </div>
      </section>

      <section className="py-24 px-8 bg-[#0F0A1E]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <p className="text-[#C4A84C] text-xs tracking-[0.3em] uppercase mb-3">Our Protocols</p>
            <h2 className="aura-serif text-4xl text-[#EDE8F5]">Drips Designed for <em>Real Results</em></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {t:'Energy & Performance',p:'From £149',d:'Myers Cocktail plus B-vitamins, magnesium and amino acids for sustained energy and mental clarity.'},
              {t:'NAD+ Longevity',p:'From £399',d:'The gold standard for cellular energy, DNA repair and anti-ageing — delivered over 2–4 hours.'},
              {t:'Immune Fortress',p:'From £179',d:'High-dose Vitamin C, zinc and glutathione to fortify your immune system year-round.'},
              {t:'Beauty Radiance',p:'From £159',d:'Glutathione, biotin and collagen cofactors for luminous skin, strong hair and nails.'},
              {t:'Hangover Recovery',p:'From £129',d:'Rapid rehydration, anti-nausea medication and electrolytes. Back to full function in 45 minutes.'},
              {t:'Altitude & Jet Lag',p:'From £149',d:'Pre-travel ozone and B12 loading plus IV fluids post-flight to land running.'},
            ].map((t,i)=>(
              <div key={i} className="p-8 border border-[#EDE8F5]/8 hover:border-[#C4A84C]/30 group transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="aura-serif text-xl text-[#EDE8F5]">{t.t}</h3>
                  <span className="text-[#C4A84C] text-xs tracking-wide">{t.p}</span>
                </div>
                <p className="text-[#EDE8F5]/40 text-sm leading-relaxed font-light">{t.d}</p>
                <div className="mt-6 w-6 h-px bg-[#C4A84C] group-hover:w-12 transition-all duration-500"/>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-8 bg-[#C4A84C]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="aura-serif text-4xl md:text-5xl text-[#0F0A1E] mb-6">Feel the difference in 45 minutes</h2>
          <p className="text-[#0F0A1E]/60 mb-10 font-light text-lg">Clinic, concierge or corporate. Our medical team comes to you.</p>
          <button className="bg-[#0F0A1E] text-[#EDE8F5] px-10 py-4 font-medium hover:bg-[#1A1030] transition-colors">Book Your Protocol</button>
        </div>
      </section>

      <footer className="py-10 px-8 bg-[#080612] text-center text-[#EDE8F5]/20 text-xs tracking-widest uppercase">
        © {new Date().getFullYear()} AURA IV Wellness · GMC Registered · London · Dubai · Marbella
      </footer>
    </div>
  );
}
