import React from 'react';
import { Phone, ArrowRight, Star, Heart } from 'lucide-react';

// SOLACE — Video background version. AI-generated carer + elderly person footage.
// Full-bleed video with warm amber/cream overlay. Intimate, human, trustworthy.
export function CareV3() {
  return (
    <div className="min-h-screen bg-[#1A0E06] text-[#F0EAE1] overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,600;1,400;1,600&family=Inter:wght@300;400;500&display=swap');
        .solace3-serif { font-family: 'Cormorant', serif; }
        @keyframes s3fade { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .s3-1 { animation: s3fade 0.9s 0.1s ease forwards; opacity:0; }
        .s3-2 { animation: s3fade 0.9s 0.3s ease forwards; opacity:0; }
        .s3-3 { animation: s3fade 0.9s 0.5s ease forwards; opacity:0; }
        .s3-4 { animation: s3fade 0.9s 0.7s ease forwards; opacity:0; }
      `}} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between bg-gradient-to-b from-black/40 to-transparent">
        <div className="flex items-center gap-3">
          <Heart strokeWidth={1.5} className="w-5 h-5 text-[#E8A84C]" />
          <span className="solace3-serif text-xl font-semibold tracking-wide text-[#F0EAE1]">SOLACE</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-xs tracking-widest uppercase text-[#F0EAE1]/50 font-light">
          <a href="#" className="hover:text-[#E8A84C] transition-colors">Services</a>
          <a href="#" className="hover:text-[#E8A84C] transition-colors">Our Carers</a>
          <a href="#" className="hover:text-[#E8A84C] transition-colors">Families</a>
          <a href="#" className="hover:text-[#E8A84C] transition-colors">Contact</a>
        </div>
        <button className="bg-[#E8A84C] text-[#1A0E06] px-5 py-2.5 text-xs tracking-widest uppercase font-semibold hover:bg-[#F5C060] transition-colors">
          Free Assessment
        </button>
      </nav>

      {/* Hero — full-bleed video, split text */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* AI-generated care video */}
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.48) saturate(1.1) warmth(1.2)' }}
        >
          <source src="/__mockup/videos/care-compassion.mp4" type="video/mp4" />
        </video>

        {/* Warm amber/cream overlay — matches the golden-hour footage tone */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A0E06]/88 via-[#2A1808]/50 to-[#1A0E06]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A0E06]/70 via-transparent to-[#1A0E06]/30" />

        {/* Left content column */}
        <div className="relative z-10 max-w-xl px-8 md:px-16 pt-24">
          <div className="flex items-center gap-3 mb-8 s3-1">
            <div className="w-8 h-px bg-[#E8A84C]" />
            <span className="text-[#E8A84C] text-xs tracking-[0.3em] uppercase">Premium Home Care · Est. 2015</span>
          </div>
          <h1 className="solace3-serif text-5xl md:text-6xl lg:text-[76px] leading-[1.02] text-[#F0EAE1] mb-8 s3-2">
            Dignified<br />
            Care, In<br />
            <em className="text-[#E8A84C]">The Home<br />They Love</em>
          </h1>
          <p className="text-[#F0EAE1]/60 text-lg font-light leading-relaxed max-w-md mb-12 s3-3">
            Compassionate, professionally-matched carers who treat your family like their own. Because everyone deserves to age with grace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 s3-4">
            <button className="bg-[#E8A84C] text-[#1A0E06] px-8 py-4 text-sm font-semibold flex items-center gap-2 group hover:bg-[#F5C060] transition-colors">
              Book Free Home Assessment <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border border-[#F0EAE1]/20 text-[#F0EAE1]/70 px-8 py-4 text-sm font-light flex items-center gap-2 hover:border-[#F0EAE1]/40 transition-colors">
              <Phone className="w-4 h-4" /> 0800 123 4567
            </button>
          </div>
        </div>

        {/* Trust card — lower right */}
        <div className="absolute bottom-10 right-8 z-10 hidden lg:block">
          <div className="bg-[#F0EAE1]/8 backdrop-blur-md border border-[#F0EAE1]/12 p-6 max-w-[240px]">
            <div className="flex gap-1 mb-3">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-[#E8A84C] text-[#E8A84C]" />)}
            </div>
            <p className="text-[#F0EAE1]/80 text-sm italic leading-relaxed mb-3">
              "Margaret's carer has become part of the family. SOLACE changed everything."
            </p>
            <span className="text-[#F0EAE1]/35 text-xs">— James H., Guildford</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#E8A84C] py-10 px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { n: '10+', l: 'Years of care' },
            { n: '3,500+', l: 'Families supported' },
            { n: '98%', l: 'Client satisfaction' },
            { n: '24/7', l: 'Support line' },
          ].map((s, i) => (
            <div key={i}>
              <div className="solace3-serif text-4xl font-semibold text-[#1A0E06]">{s.n}</div>
              <div className="text-[#1A0E06]/60 text-xs tracking-widest uppercase mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-24 px-8 bg-[#1A0E06]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <p className="text-[#E8A84C] text-xs tracking-[0.3em] uppercase mb-3">How We Help</p>
            <h2 className="solace3-serif text-4xl text-[#F0EAE1]">Our Care Services</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { t: 'Live-In Care', d: 'A dedicated carer, present around the clock — always familiar, always trusted.' },
              { t: 'Dementia Support', d: 'Specialist carers trained in memory care, with patience and deep respect.' },
              { t: 'Palliative Care', d: 'Gentle, dignified end-of-life support focused on comfort and connection.' },
              { t: 'Respite Care', d: 'Short-term cover so family carers can rest, recover and recharge.' },
              { t: 'Companionship', d: 'Friendly, regular visits — conversation, outings, shared moments.' },
              { t: 'Nursing Care', d: 'Qualified nurses for clinical needs, at home rather than in hospital.' },
            ].map((s, i) => (
              <div key={i} className="p-8 border border-[#F0EAE1]/8 hover:border-[#E8A84C]/30 group transition-colors">
                <div className="w-6 h-px bg-[#E8A84C] mb-6 group-hover:w-12 transition-all duration-500" />
                <h3 className="solace3-serif text-xl text-[#F0EAE1] mb-3">{s.t}</h3>
                <p className="text-[#F0EAE1]/40 text-sm leading-relaxed font-light">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-8 bg-[#2A1808]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="solace3-serif text-4xl md:text-5xl text-[#F0EAE1] mb-6">
            Let's talk about<br /><em className="text-[#E8A84C]">your family</em>
          </h2>
          <p className="text-[#F0EAE1]/50 font-light mb-10 text-lg">No pressure. No obligation. Just a warm conversation about what matters most.</p>
          <button className="bg-[#E8A84C] text-[#1A0E06] px-10 py-5 font-semibold text-base hover:bg-[#F5C060] transition-colors">
            Book a Free Consultation
          </button>
        </div>
      </section>

      <footer className="py-10 px-8 bg-[#100806] text-center text-[#F0EAE1]/20 text-xs tracking-widest uppercase">
        © {new Date().getFullYear()} SOLACE Care Services · CQC Registered · England
      </footer>
    </div>
  );
}
