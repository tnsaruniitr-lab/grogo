import React, { useState } from 'react';
import {
  Phone, ArrowRight, Star, Heart, ShieldCheck, Award, Clock,
  MessageCircle, ChevronDown, CheckCircle, Users, MapPin, Calendar
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// SOLACE — Full Landing Page (website-builder ready)
// Sections: TrustBar · Nav · Hero · AccreditationStrip · Stats ·
//           HowItWorks · Services · Carers · Testimonials · FAQ · CTA · Footer
// Brand: #1A0E06 (dark) · #E8A84C (amber) · #F0EAE1 (cream) · Cormorant serif
// ─────────────────────────────────────────────────────────────────────────────

const BRAND = {
  dark: '#1A0E06',
  mid: '#2A1808',
  darkBorder: '#F0EAE1',
  amber: '#E8A84C',
  amberLight: '#F5C060',
  cream: '#F0EAE1',
  wa: '#25D366',
};

export function CareFullPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#1A0E06] text-[#F0EAE1] overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,600;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap');
        .serif { font-family: 'Cormorant', serif; }
        @keyframes fade-up { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        .a1 { animation: fade-up 0.8s 0.1s ease both; }
        .a2 { animation: fade-up 0.8s 0.3s ease both; }
        .a3 { animation: fade-up 0.8s 0.5s ease both; }
        .a4 { animation: fade-up 0.8s 0.7s ease both; }
        .a5 { animation: fade-up 0.8s 0.9s ease both; }
        @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:.35} }
        .live { animation: pulse-dot 2s ease-in-out infinite; }
        .faq-answer { overflow:hidden; transition: max-height 0.35s ease, opacity 0.3s ease; }
        .faq-answer.open { max-height: 200px; opacity:1; }
        .faq-answer.closed { max-height: 0; opacity:0; }
      `}} />

      {/* ══════════════════════════════════════════════════════
          1. TRUST BAR — very top strip
      ══════════════════════════════════════════════════════ */}
      <div className="w-full bg-[#100806] border-b border-[#F0EAE1]/8 py-2 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-5 flex-wrap">
            <div className="flex items-center gap-1.5 text-[#F0EAE1]/50 text-[11px] tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E8A84C]" strokeWidth={2} />
              <span>CQC <span className="text-[#E8A84C] font-semibold">Outstanding</span></span>
            </div>
            <div className="w-px h-3 bg-[#F0EAE1]/15" />
            <div className="flex items-center gap-1.5 text-[#F0EAE1]/50 text-[11px]">
              <Award className="w-3.5 h-3.5 text-[#E8A84C]" strokeWidth={2} />
              <span>UKHCA <span className="text-[#F0EAE1]/70 font-medium">Member</span></span>
            </div>
            <div className="w-px h-3 bg-[#F0EAE1]/15 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-1.5 text-[#F0EAE1]/50 text-[11px]">
              <Clock className="w-3.5 h-3.5 text-[#E8A84C]" strokeWidth={2} />
              <span>Est. <span className="text-[#F0EAE1]/70 font-medium">2015</span></span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-[#E8A84C] text-[#E8A84C]" />)}
            <span className="text-[#F0EAE1]/70 text-[11px]">
              <span className="font-semibold text-[#F0EAE1]">4.9</span>
              <span className="text-[#F0EAE1]/40"> · 312 Google reviews</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-[#F0EAE1]/50 text-[11px]">
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" strokeWidth={2} />
            <span>WhatsApp reply in <span className="text-[#F0EAE1]/80 font-medium">under 60 sec</span></span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          2. NAV
      ══════════════════════════════════════════════════════ */}
      <nav className="sticky top-0 z-50 px-8 py-4 flex items-center justify-between bg-[#1A0E06]/95 backdrop-blur-md border-b border-[#F0EAE1]/6">
        <div className="flex items-center gap-3">
          <Heart strokeWidth={1.5} className="w-5 h-5 text-[#E8A84C]" />
          <span className="serif text-xl font-semibold tracking-wide text-[#F0EAE1]">SOLACE</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-xs tracking-widest uppercase text-[#F0EAE1]/50 font-light">
          <a href="#services" className="hover:text-[#E8A84C] transition-colors">Services</a>
          <a href="#carers" className="hover:text-[#E8A84C] transition-colors">Our Carers</a>
          <a href="#testimonials" className="hover:text-[#E8A84C] transition-colors">Families</a>
          <a href="#faq" className="hover:text-[#E8A84C] transition-colors">FAQ</a>
          <a href="#contact" className="hover:text-[#E8A84C] transition-colors">Contact</a>
        </div>
        <button className="bg-[#E8A84C] text-[#1A0E06] px-5 py-2.5 text-xs tracking-widest uppercase font-semibold hover:bg-[#F5C060] transition-colors">
          Free Assessment
        </button>
      </nav>

      {/* ══════════════════════════════════════════════════════
          3. HERO — full-bleed video
      ══════════════════════════════════════════════════════ */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <video autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.45) saturate(1.1)' }}>
          <source src="/__mockup/videos/care-compassion.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A0E06]/90 via-[#2A1808]/55 to-[#1A0E06]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A0E06]/65 via-transparent to-[#1A0E06]/20" />

        {/* Live status pill */}
        <div className="absolute top-6 left-8 z-10 a1">
          <div className="flex items-center gap-2 bg-[#E8A84C]/12 backdrop-blur-sm border border-[#E8A84C]/22 px-3 py-1.5 rounded-full">
            <div className="live w-2 h-2 rounded-full bg-[#4CAF50]" />
            <span className="text-[#F0EAE1]/85 text-[11px]">
              <span className="font-semibold text-[#F0EAE1]">47 families</span> matched this month
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl px-8 md:px-16 pt-8">
          <div className="flex items-center gap-3 mb-7 a1">
            <div className="w-8 h-px bg-[#E8A84C]" />
            <span className="text-[#E8A84C] text-xs tracking-[0.3em] uppercase">Premium Home Care · CQC Outstanding</span>
          </div>
          <h1 className="serif text-5xl md:text-[72px] leading-[1.02] text-[#F0EAE1] mb-7 a2">
            Dignified Care,<br />In The Home<br /><em className="text-[#E8A84C]">They Love</em>
          </h1>
          <p className="text-[#F0EAE1]/60 text-lg font-light leading-relaxed max-w-md mb-10 a3">
            Compassionate, professionally-matched carers who treat your family like their own — available across Surrey, Sussex &amp; Kent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 a4">
            <button className="bg-[#E8A84C] text-[#1A0E06] px-8 py-4 text-sm font-semibold flex items-center gap-2 group hover:bg-[#F5C060] transition-colors">
              Book Free Home Assessment <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border border-[#F0EAE1]/20 text-[#F0EAE1]/70 px-8 py-4 text-sm font-light flex items-center gap-2 hover:border-[#F0EAE1]/40 transition-colors">
              <Phone className="w-4 h-4" /> 0800 123 4567
            </button>
          </div>
          {/* WhatsApp reply badge */}
          <div className="flex items-center gap-2 mt-6 a5">
            <div className="flex items-center gap-2 bg-[#25D366]/10 border border-[#25D366]/18 px-4 py-2 rounded-full">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#25D366]">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span className="text-[#F0EAE1]/70 text-xs">AI care advisor replies in <span className="text-[#F0EAE1] font-semibold">under 60 seconds</span> · 24/7</span>
            </div>
          </div>
        </div>

        {/* Review card — lower right */}
        <div className="absolute bottom-10 right-8 z-10 hidden lg:block">
          <div className="bg-[#F0EAE1]/8 backdrop-blur-md border border-[#F0EAE1]/12 p-6 max-w-[260px]">
            <div className="flex items-center gap-1.5 mb-4 bg-[#E8A84C]/15 border border-[#E8A84C]/25 px-2.5 py-1 rounded-full w-fit">
              <ShieldCheck className="w-3 h-3 text-[#E8A84C]" strokeWidth={2.5} />
              <span className="text-[#E8A84C] text-[10px] font-semibold tracking-wide uppercase">CQC Outstanding</span>
            </div>
            <div className="flex gap-1 mb-3">{[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-[#E8A84C] text-[#E8A84C]" />)}</div>
            <p className="text-[#F0EAE1]/80 text-sm italic leading-relaxed mb-3">"Margaret's carer has become part of the family. SOLACE changed everything."</p>
            <span className="text-[#F0EAE1]/35 text-xs">— James H., Guildford</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          4. ACCREDITATION STRIP
      ══════════════════════════════════════════════════════ */}
      <section className="bg-[#140C04] border-y border-[#F0EAE1]/8 py-7 px-8">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-10">
          {[
            { icon: <ShieldCheck className="w-5 h-5 text-[#E8A84C]" />, label: 'CQC Outstanding', sub: 'Reg. No. 1-234567890' },
            { icon: <Award className="w-5 h-5 text-[#E8A84C]" />, label: 'UKHCA Member', sub: 'United Kingdom' },
            { icon: <CheckCircle className="w-5 h-5 text-[#E8A84C]" />, label: 'DBS Checked', sub: 'All carers verified' },
            { icon: <Star className="w-5 h-5 fill-[#E8A84C] text-[#E8A84C]" />, label: 'Google 4.9 ★', sub: '312 verified reviews' },
            { icon: <Users className="w-5 h-5 text-[#E8A84C]" />, label: 'GDPR Compliant', sub: 'ICO Registered' },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-3">
              {b.icon}
              <div>
                <div className="text-[#F0EAE1]/85 text-xs font-medium tracking-wide">{b.label}</div>
                <div className="text-[#F0EAE1]/30 text-[10px]">{b.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          5. STATS BAR
      ══════════════════════════════════════════════════════ */}
      <section className="bg-[#E8A84C] py-10 px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { n: '10+', l: 'Years of care', s: 'Est. 2015' },
            { n: '3,500+', l: 'Families supported', s: 'Across SE England' },
            { n: '98%', l: 'Client satisfaction', s: 'CQC verified' },
            { n: '24/7', l: 'Support line', s: 'Always available' },
          ].map((s, i) => (
            <div key={i}>
              <div className="serif text-4xl font-semibold text-[#1A0E06]">{s.n}</div>
              <div className="text-[#1A0E06]/70 text-xs tracking-widest uppercase mt-1 font-medium">{s.l}</div>
              <div className="text-[#1A0E06]/40 text-[10px] mt-0.5">{s.s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          6. HOW IT WORKS
      ══════════════════════════════════════════════════════ */}
      <section className="py-24 px-8 bg-[#1A0E06]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16 text-center">
            <p className="text-[#E8A84C] text-xs tracking-[0.3em] uppercase mb-3">Simple &amp; Supportive</p>
            <h2 className="serif text-4xl md:text-5xl text-[#F0EAE1]">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-0 relative">
            <div className="hidden md:block absolute top-8 left-[33%] right-[33%] h-px bg-[#E8A84C]/25" />
            {[
              { n: '01', t: 'Free Home Assessment', d: 'We visit you at home — no obligation — to understand exactly what care and companionship is needed.', icon: <Calendar className="w-6 h-6 text-[#E8A84C]" /> },
              { n: '02', t: 'Matched to Your Carer', d: 'We hand-select carers by personality, experience and location. You approve every match before anyone starts.', icon: <Heart className="w-6 h-6 text-[#E8A84C]" /> },
              { n: '03', t: 'Ongoing Support', d: 'Your dedicated coordinator checks in regularly. Change anything, anytime — your family stays in control.', icon: <CheckCircle className="w-6 h-6 text-[#E8A84C]" /> },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center px-8 py-8 relative">
                <div className="w-14 h-14 rounded-full border border-[#E8A84C]/30 flex items-center justify-center mb-5 bg-[#E8A84C]/8 z-10">
                  {step.icon}
                </div>
                <div className="text-[#E8A84C]/40 text-xs tracking-[0.25em] uppercase mb-2">{step.n}</div>
                <h3 className="serif text-xl text-[#F0EAE1] mb-3">{step.t}</h3>
                <p className="text-[#F0EAE1]/45 text-sm leading-relaxed font-light">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          7. SERVICES
      ══════════════════════════════════════════════════════ */}
      <section id="services" className="py-24 px-8 bg-[#140C04]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-[#E8A84C] text-xs tracking-[0.3em] uppercase mb-3">Tailored to Your Family</p>
              <h2 className="serif text-4xl text-[#F0EAE1]">Our Care Services</h2>
            </div>
            <p className="text-[#F0EAE1]/40 text-sm font-light max-w-xs">All services are fully managed, DBS-checked and CQC regulated.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { t: 'Live-In Care', d: 'A dedicated carer present around the clock — familiar, trusted, consistent.', from: '£950/week', tag: 'Most popular' },
              { t: 'Dementia Support', d: 'Specialist carers trained in memory care, with patience and deep respect for your loved one.', from: '£1,050/week', tag: 'Specialist' },
              { t: 'Palliative Care', d: 'Gentle, dignified end-of-life support focused on comfort, connection and peace.', from: 'On assessment', tag: null },
              { t: 'Respite Care', d: 'Short-term cover so family carers can rest, recover and recharge — from one night upward.', from: '£150/day', tag: 'Flexible' },
              { t: 'Companionship', d: 'Friendly, regular visits — conversation, outings, errands and shared moments.', from: '£22/hour', tag: null },
              { t: 'Nursing Care', d: 'Qualified nurses for clinical needs at home, avoiding unnecessary hospital stays.', from: '£1,200/week', tag: 'Clinical' },
            ].map((s, i) => (
              <div key={i} className="p-8 border border-[#F0EAE1]/8 hover:border-[#E8A84C]/30 group transition-colors relative">
                {s.tag && (
                  <span className="absolute top-4 right-4 text-[10px] tracking-widest uppercase text-[#E8A84C] border border-[#E8A84C]/30 px-2 py-0.5">{s.tag}</span>
                )}
                <div className="w-6 h-px bg-[#E8A84C] mb-6 group-hover:w-12 transition-all duration-500" />
                <h3 className="serif text-xl text-[#F0EAE1] mb-3">{s.t}</h3>
                <p className="text-[#F0EAE1]/40 text-sm leading-relaxed font-light mb-5">{s.d}</p>
                <div className="text-[#E8A84C] text-sm font-medium">From {s.from}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          8. OUR CARERS
      ══════════════════════════════════════════════════════ */}
      <section id="carers" className="py-24 px-8 bg-[#1A0E06]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14 text-center">
            <p className="text-[#E8A84C] text-xs tracking-[0.3em] uppercase mb-3">People You Can Trust</p>
            <h2 className="serif text-4xl text-[#F0EAE1]">Our Carers</h2>
            <p className="text-[#F0EAE1]/45 font-light mt-4 max-w-md mx-auto text-sm">Every SOLACE carer is DBS-checked, reference-verified and matched to your family's specific needs before introduction.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Sarah M.', spec: 'Dementia &amp; Live-In', yrs: '11 years', area: 'Surrey', initials: 'SM' },
              { name: 'David K.', spec: 'Palliative &amp; Nursing', yrs: '9 years', area: 'Sussex', initials: 'DK' },
              { name: 'Amara O.', spec: 'Companionship &amp; Respite', yrs: '6 years', area: 'Kent', initials: 'AO' },
              { name: 'Helen P.', spec: 'Live-In &amp; Elderly Care', yrs: '14 years', area: 'Surrey', initials: 'HP' },
            ].map((c, i) => (
              <div key={i} className="p-6 border border-[#F0EAE1]/8 hover:border-[#E8A84C]/25 transition-colors group">
                <div className="w-16 h-16 rounded-full bg-[#E8A84C]/15 border border-[#E8A84C]/25 flex items-center justify-center mb-5 text-[#E8A84C] font-semibold text-lg tracking-wide">
                  {c.initials}
                </div>
                <div className="serif text-lg text-[#F0EAE1] mb-1">{c.name}</div>
                <p className="text-[#F0EAE1]/40 text-xs mb-3" dangerouslySetInnerHTML={{ __html: c.spec }} />
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-[#F0EAE1]/35 text-[11px]">
                    <Clock className="w-3 h-3" /> {c.yrs} experience
                  </div>
                  <div className="flex items-center gap-1.5 text-[#F0EAE1]/35 text-[11px]">
                    <MapPin className="w-3 h-3" /> {c.area}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] mt-2">
                    <CheckCircle className="w-3 h-3 text-[#E8A84C]" strokeWidth={2.5} />
                    <span className="text-[#E8A84C]/80">DBS Enhanced Checked</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          9. TESTIMONIALS
      ══════════════════════════════════════════════════════ */}
      <section id="testimonials" className="py-24 px-8 bg-[#140C04]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14 text-center">
            <p className="text-[#E8A84C] text-xs tracking-[0.3em] uppercase mb-3">Family Stories</p>
            <h2 className="serif text-4xl text-[#F0EAE1]">What Families Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { q: '"Our carer Sarah became like part of the family within a week. Mum is happier than she\'s been in years. SOLACE completely changed our lives."', name: 'James H.', loc: 'Guildford, Surrey', stars: 5 },
              { q: '"Finding a dementia specialist who really understood Dad was something I\'d given up on. SOLACE matched us within 5 days. Outstanding service."', name: 'Caroline T.', loc: 'Brighton, Sussex', stars: 5 },
              { q: '"The coordination team called us every week without fail. When Mum\'s needs changed, they adapted instantly. I\'ve recommended SOLACE to three friends already."', name: 'Robert &amp; Linda F.', loc: 'Tunbridge Wells, Kent', stars: 5 },
            ].map((t, i) => (
              <div key={i} className="p-8 border border-[#F0EAE1]/8 hover:border-[#E8A84C]/20 transition-colors">
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-[#E8A84C] text-[#E8A84C]" />
                  ))}
                </div>
                <p className="text-[#F0EAE1]/75 text-sm italic leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: t.q }} />
                <div>
                  <div className="text-[#F0EAE1]/70 text-sm font-medium">{t.name}</div>
                  <div className="flex items-center gap-1.5 text-[#F0EAE1]/30 text-xs mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span dangerouslySetInnerHTML={{ __html: t.loc }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Google source note */}
          <div className="flex items-center justify-center gap-2 mt-8 text-[#F0EAE1]/25 text-xs">
            <Star className="w-3 h-3 fill-[#F0EAE1]/25 text-[#F0EAE1]/25" />
            <span>Reviews sourced from Google · Average 4.9 from 312 reviews</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          10. FAQ
      ══════════════════════════════════════════════════════ */}
      <section id="faq" className="py-24 px-8 bg-[#1A0E06]">
        <div className="max-w-3xl mx-auto">
          <div className="mb-14 text-center">
            <p className="text-[#E8A84C] text-xs tracking-[0.3em] uppercase mb-3">Common Questions</p>
            <h2 className="serif text-4xl text-[#F0EAE1]">Frequently Asked</h2>
          </div>
          <div className="space-y-0">
            {[
              { q: 'How quickly can care start?', a: 'In most cases we can arrange an initial assessment within 48 hours and begin care within 5–7 days. In urgent situations, we can sometimes place a carer within 24 hours.' },
              { q: 'Are all carers DBS checked?', a: 'Yes — every SOLACE carer undergoes an Enhanced DBS check, two professional references and a face-to-face interview before joining our team. We never place agency staff.' },
              { q: 'What areas do you cover?', a: 'We currently cover Surrey, East &amp; West Sussex and Kent. We\'re expanding to Hampshire and London in 2025 — contact us to join the waiting list.' },
              { q: 'Can we change our carer if it\'s not the right fit?', a: 'Absolutely. If the match isn\'t right for any reason, we\'ll find an alternative immediately — at no extra charge. Your comfort and confidence comes first.' },
              { q: 'Is there a minimum number of hours?', a: 'For visiting care, our minimum is 2 hours per visit. Live-in care is available 7 days a week with full-week packages from Sunday to Sunday.' },
            ].map((f, i) => (
              <div key={i} className="border-b border-[#F0EAE1]/8 last:border-0">
                <button
                  className="w-full flex items-center justify-between py-5 text-left group"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="serif text-lg text-[#F0EAE1] group-hover:text-[#E8A84C] transition-colors">{f.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#E8A84C] transition-transform flex-shrink-0 ml-4 ${openFaq === i ? 'rotate-180' : ''}`}
                    strokeWidth={2}
                  />
                </button>
                <div className={`faq-answer ${openFaq === i ? 'open' : 'closed'}`}>
                  <p className="text-[#F0EAE1]/50 text-sm leading-relaxed pb-5 font-light" dangerouslySetInnerHTML={{ __html: f.a }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          11. FINAL CTA
      ══════════════════════════════════════════════════════ */}
      <section id="contact" className="py-24 px-8 bg-[#2A1808]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#E8A84C] text-xs tracking-[0.3em] uppercase mb-5">No obligation · No pressure</p>
          <h2 className="serif text-4xl md:text-5xl text-[#F0EAE1] mb-5">
            Let's talk about<br /><em className="text-[#E8A84C]">your family</em>
          </h2>
          <p className="text-[#F0EAE1]/50 font-light mb-4 text-base max-w-md mx-auto">A warm, 20-minute call with a care advisor. No sales pitch — just honest guidance about what's right for your situation.</p>
          
          {/* Coverage note */}
          <div className="flex items-center justify-center gap-1.5 text-[#F0EAE1]/35 text-xs mb-10">
            <MapPin className="w-3 h-3" />
            <span>Covering Surrey · Sussex · Kent — free assessment in your home</span>
          </div>

          <button className="bg-[#E8A84C] text-[#1A0E06] px-10 py-5 font-semibold text-base hover:bg-[#F5C060] transition-colors mb-8">
            Book a Free Consultation
          </button>

          {/* Trust badges row */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-8 border-t border-[#F0EAE1]/8">
            {[
              { icon: <ShieldCheck className="w-4 h-4 text-[#E8A84C]" />, label: 'CQC Outstanding' },
              { icon: <CheckCircle className="w-4 h-4 text-[#E8A84C]" />, label: 'DBS Checked Carers' },
              { icon: <Star className="w-4 h-4 fill-[#E8A84C] text-[#E8A84C]" />, label: '4.9 Google Rating' },
              { icon: <Users className="w-4 h-4 text-[#E8A84C]" />, label: '3,500+ Families' },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[#F0EAE1]/45 text-xs">
                {b.icon} {b.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          12. FOOTER
      ══════════════════════════════════════════════════════ */}
      <footer className="py-10 px-8 bg-[#100806] border-t border-[#F0EAE1]/6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[#F0EAE1]/20 text-xs tracking-wide">
          <div className="flex items-center gap-2">
            <Heart strokeWidth={1.5} className="w-3.5 h-3.5 text-[#E8A84C]/50" />
            <span>© {new Date().getFullYear()} SOLACE Care Services Ltd</span>
          </div>
          <div className="flex flex-wrap gap-5 justify-center text-[#F0EAE1]/18 text-[11px] tracking-widest uppercase">
            <span>CQC Reg. 1-234567890</span>
            <span>ICO Reg. ZA123456</span>
            <span>UKHCA Member</span>
            <span>Company No. 09876543</span>
          </div>
          <div className="flex gap-5 text-[11px] tracking-widest uppercase">
            <a href="#" className="hover:text-[#E8A84C]/60 transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#E8A84C]/60 transition-colors">Terms</a>
            <a href="#" className="hover:text-[#E8A84C]/60 transition-colors">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
