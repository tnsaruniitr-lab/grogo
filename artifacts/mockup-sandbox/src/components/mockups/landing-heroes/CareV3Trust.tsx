import React from 'react';
import { Phone, ArrowRight, Star, Heart, ShieldCheck, Award, Clock, MessageCircle } from 'lucide-react';

// SOLACE — Care V3 + Trust Signals variant
// Adds: thin CQC trust bar above nav, hero overlay badges (WhatsApp response + live status),
// and a "verified" pill in the review card.
export function CareV3Trust() {
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
        .s3-5 { animation: s3fade 0.9s 0.85s ease forwards; opacity:0; }
        @keyframes pulse-dot { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        .live-dot { animation: pulse-dot 2s ease-in-out infinite; }
      `}} />

      {/* ── TRUST BAR — very top, above nav ──────────────────────────── */}
      <div className="w-full bg-[#100806] border-b border-[#F0EAE1]/8 py-2 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">

          {/* Left: Regulator badges */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5 text-[#F0EAE1]/50 text-[11px] tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E8A84C]" strokeWidth={2} />
              <span>CQC <span className="text-[#E8A84C] font-medium">Outstanding</span></span>
            </div>
            <div className="w-px h-3 bg-[#F0EAE1]/15" />
            <div className="flex items-center gap-1.5 text-[#F0EAE1]/50 text-[11px] tracking-wide">
              <Award className="w-3.5 h-3.5 text-[#E8A84C]" strokeWidth={2} />
              <span>UKHCA <span className="text-[#F0EAE1]/70 font-medium">Member</span></span>
            </div>
            <div className="w-px h-3 bg-[#F0EAE1]/15 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-1.5 text-[#F0EAE1]/50 text-[11px] tracking-wide">
              <Clock className="w-3.5 h-3.5 text-[#E8A84C]" strokeWidth={2} />
              <span>Est. <span className="text-[#F0EAE1]/70 font-medium">2015</span></span>
            </div>
          </div>

          {/* Centre: Google rating */}
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-3 h-3 fill-[#E8A84C] text-[#E8A84C]" />
              ))}
            </div>
            <span className="text-[#F0EAE1]/70 text-[11px]">
              <span className="font-semibold text-[#F0EAE1]">4.9</span>
              <span className="text-[#F0EAE1]/40"> · 312 Google reviews</span>
            </span>
          </div>

          {/* Right: WhatsApp response promise */}
          <div className="hidden md:flex items-center gap-1.5 text-[#F0EAE1]/50 text-[11px]">
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" strokeWidth={2} />
            <span>WhatsApp reply in <span className="text-[#F0EAE1]/80 font-medium">under 60 sec</span></span>
          </div>

        </div>
      </div>

      {/* ── Navigation ──────────────────────────────────────────────── */}
      <nav className="absolute top-[34px] left-0 right-0 z-50 px-8 py-5 flex items-center justify-between bg-gradient-to-b from-black/40 to-transparent">
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

      {/* ── Hero — full-bleed video ──────────────────────────────────── */}
      <section className="relative flex items-center overflow-hidden" style={{ height: 'calc(100vh - 34px)', marginTop: '34px' }}>
        {/* AI-generated care video */}
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.48) saturate(1.1)' }}
        >
          <source src="/__mockup/videos/care-compassion.mp4" type="video/mp4" />
        </video>

        {/* Warm amber overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A0E06]/88 via-[#2A1808]/50 to-[#1A0E06]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A0E06]/70 via-transparent to-[#1A0E06]/30" />

        {/* ── TRUST BADGE — top left of hero (below nav) ────────────── */}
        <div className="absolute top-20 left-8 z-10 s3-1">
          <div className="flex items-center gap-2 bg-[#E8A84C]/15 backdrop-blur-sm border border-[#E8A84C]/25 px-3 py-1.5 rounded-full">
            <div className="live-dot w-2 h-2 rounded-full bg-[#4CAF50]" />
            <span className="text-[#F0EAE1]/85 text-[11px] tracking-wide">
              <span className="font-semibold text-[#F0EAE1]">47 families</span> supported this month
            </span>
          </div>
        </div>

        {/* Left content column */}
        <div className="relative z-10 max-w-xl px-8 md:px-16 pt-16">
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

          {/* ── WhatsApp response badge — below CTAs ──────────────── */}
          <div className="flex items-center gap-2 mt-6 s3-5">
            <div className="flex items-center gap-2 bg-[#25D366]/12 border border-[#25D366]/20 px-4 py-2 rounded-full">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#25D366]">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span className="text-[#F0EAE1]/70 text-xs">
                AI assistant replies in <span className="text-[#F0EAE1] font-semibold">under 60 seconds</span> · 24/7
              </span>
            </div>
          </div>
        </div>

        {/* ── Trust review card — lower right (with CQC badge) ──────── */}
        <div className="absolute bottom-10 right-8 z-10 hidden lg:block">
          <div className="bg-[#F0EAE1]/8 backdrop-blur-md border border-[#F0EAE1]/12 p-6 max-w-[260px]">
            {/* CQC verified pill */}
            <div className="flex items-center gap-1.5 mb-4 bg-[#E8A84C]/15 border border-[#E8A84C]/25 px-2.5 py-1 rounded-full w-fit">
              <ShieldCheck className="w-3 h-3 text-[#E8A84C]" strokeWidth={2.5} />
              <span className="text-[#E8A84C] text-[10px] font-semibold tracking-wide uppercase">CQC Outstanding</span>
            </div>
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

      {/* ── Stats ───────────────────────────────────────────────────── */}
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

      {/* ── Services ────────────────────────────────────────────────── */}
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

      {/* ── CTA ─────────────────────────────────────────────────────── */}
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
        © {new Date().getFullYear()} SOLACE Care Services · CQC Outstanding · UKHCA Member · England
      </footer>
    </div>
  );
}
