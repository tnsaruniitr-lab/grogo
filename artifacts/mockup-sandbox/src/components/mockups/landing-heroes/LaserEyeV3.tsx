import React from 'react';
import { ArrowRight, Eye } from 'lucide-react';

// CLARO — Premium laser eye surgery. AI video: clarity of vision, clean clinical.
export function LaserEyeV3() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0D1A2A] overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');
        .claro-serif { font-family: 'DM Serif Display', serif; }
        @keyframes cl-up { from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)} }
        .cl-1{animation:cl-up 0.85s 0.1s ease forwards;opacity:0}
        .cl-2{animation:cl-up 0.85s 0.25s ease forwards;opacity:0}
        .cl-3{animation:cl-up 0.85s 0.4s ease forwards;opacity:0}
        .cl-4{animation:cl-up 0.85s 0.55s ease forwards;opacity:0}
      `}} />

      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between bg-white/90 backdrop-blur-sm border-b border-black/6">
        <div className="flex items-center gap-2">
          <Eye strokeWidth={1.5} className="w-5 h-5 text-[#1A6AE8]"/>
          <span className="claro-serif text-xl text-[#0D1A2A]">CLARO</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm text-[#0D1A2A]/50 font-light">
          <a href="#" className="hover:text-[#1A6AE8] transition-colors">Treatments</a>
          <a href="#" className="hover:text-[#1A6AE8] transition-colors">Am I Suitable?</a>
          <a href="#" className="hover:text-[#1A6AE8] transition-colors">Technology</a>
          <a href="#" className="hover:text-[#1A6AE8] transition-colors">Pricing</a>
        </div>
        <button className="bg-[#1A6AE8] text-white px-5 py-2.5 text-sm font-medium hover:bg-[#2A7AF8] transition-colors">Free Suitability Check</button>
      </nav>

      <section className="relative min-h-screen flex items-center overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" style={{filter:'brightness(0.38) saturate(0.9)'}}>
          <source src="/__mockup/videos/laser-eye.mp4" type="video/mp4" />
        </video>
        {/* Light clean overlay for the bright video */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1A2A]/90 via-[#102040]/55 to-[#0D1A2A]/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1A2A]/60 via-transparent to-[#0D1A2A]/25" />

        <div className="relative z-10 max-w-xl px-8 md:px-16 pt-24 pb-16">
          <p className="text-[#5A9AF5] text-xs tracking-[0.35em] uppercase mb-8 cl-1">LASIK · LASEK · SMILE · ReLEx</p>
          <h1 className="claro-serif text-5xl md:text-6xl lg:text-[78px] leading-[1.02] text-white mb-8 cl-2">
            See the World<br /><em className="text-[#5A9AF5]">Perfectly</em><br />Again
          </h1>
          <p className="text-white/55 text-lg font-light leading-relaxed max-w-md mb-12 cl-3">
            The latest laser vision correction technology. Most patients achieve 20/20 vision or better. Permanent results, proven safety record, interest-free finance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 cl-4">
            <button className="bg-[#1A6AE8] text-white px-8 py-4 text-sm tracking-wider font-semibold flex items-center gap-2 group hover:bg-[#2A7AF8] transition-colors">
              Free Suitability Assessment <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border border-white/20 text-white/65 px-8 py-4 text-sm tracking-wider font-light hover:border-white/40 transition-colors">How It Works</button>
          </div>
        </div>

        <div className="absolute bottom-10 left-0 right-0 z-10 flex justify-center">
          <div className="bg-white/8 backdrop-blur-sm border border-white/12 px-10 py-4 flex gap-10">
            {[['96%','Achieve 20/20+'],['30 min','Procedure time'],['£595/eye','From']].map(([n,l],i)=>(
              <div key={i} className="text-center">
                <div className="claro-serif text-2xl text-[#5A9AF5]">{n}</div>
                <div className="text-white/40 text-xs tracking-wide mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#1A6AE8] py-10 px-8">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            ['LASIK','The most established procedure — rapid recovery, excellent outcomes for most prescriptions.'],
            ['SMILE','Keyhole laser surgery — no flap, minimal dry eye risk, suitable for active lifestyles.'],
            ['LASEK / PRK','Best for thinner corneas or high prescriptions — slightly longer recovery, exceptional results.'],
          ].map(([t,d],i)=>(
            <div key={i}>
              <h3 className="claro-serif text-2xl text-white mb-2">{t}</h3>
              <p className="text-white/65 text-sm font-light leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-8 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <p className="text-[#1A6AE8] text-xs tracking-[0.3em] uppercase mb-3">Your Journey</p>
            <h2 className="claro-serif text-4xl text-[#0D1A2A]">Four Simple Steps</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {n:'01',t:'Free Assessment',d:'Complete your online suitability questionnaire in 2 minutes — no commitment required.'},
              {n:'02',t:'Clinic Consultation',d:'Comprehensive eye examination by our specialist surgeons to confirm your suitability.'},
              {n:'03',t:'Your Procedure',d:'30-minute procedure in our accredited theatre. Walk in, walk out — typically the same day.'},
              {n:'04',t:'See Clearly',d:'Most patients notice the improvement within hours. Follow-up care included for 12 months.'},
            ].map((s,i)=>(
              <div key={i} className="p-8 border border-[#0D1A2A]/8 hover:border-[#1A6AE8]/30 group transition-colors">
                <div className="claro-serif text-4xl text-[#1A6AE8]/20 mb-4">{s.n}</div>
                <h3 className="font-semibold text-[#0D1A2A] mb-3">{s.t}</h3>
                <p className="text-[#0D1A2A]/45 text-sm leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-8 bg-[#0D1A2A]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="claro-serif text-4xl md:text-5xl text-white mb-4">Ready to lose the glasses?</h2>
          <p className="text-white/50 mb-10 font-light">Free suitability check · No obligation · Results same day</p>
          <button className="bg-[#1A6AE8] text-white px-10 py-4 font-semibold hover:bg-[#2A7AF8] transition-colors">Check My Suitability</button>
        </div>
      </section>

      <footer className="py-10 px-8 bg-[#060E18] text-center text-white/20 text-xs tracking-widest uppercase">
        © {new Date().getFullYear()} CLARO Vision · RCOphth Registered · CQC Accredited · London
      </footer>
    </div>
  );
}
