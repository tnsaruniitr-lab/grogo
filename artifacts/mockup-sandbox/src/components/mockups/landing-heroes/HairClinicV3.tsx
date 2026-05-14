import React from 'react';
import { ArrowRight } from 'lucide-react';

// REVIVE — Premium hair sciences clinic. AI video: expert hair treatment, lustrous hair.
export function HairClinicV3() {
  return (
    <div className="min-h-screen bg-[#1A1208] text-[#F5EDE0] overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,600;1,400;1,600&family=Inter:wght@300;400;500&display=swap');
        .revive-serif { font-family: 'Cormorant', serif; }
        @keyframes rv-up { from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)} }
        .rv-1{animation:rv-up 0.9s 0.1s ease forwards;opacity:0}
        .rv-2{animation:rv-up 0.9s 0.3s ease forwards;opacity:0}
        .rv-3{animation:rv-up 0.9s 0.5s ease forwards;opacity:0}
        .rv-4{animation:rv-up 0.9s 0.7s ease forwards;opacity:0}
      `}} />

      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between">
        <div className="revive-serif text-xl font-semibold tracking-[0.12em] text-[#F5EDE0]">REVIVE <span className="text-[#C48040] font-normal text-base">Hair Sciences</span></div>
        <div className="hidden md:flex gap-8 text-xs tracking-widest uppercase text-[#F5EDE0]/45 font-light">
          <a href="#" className="hover:text-[#C48040] transition-colors">Treatments</a>
          <a href="#" className="hover:text-[#C48040] transition-colors">Transplants</a>
          <a href="#" className="hover:text-[#C48040] transition-colors">Diagnostics</a>
          <a href="#" className="hover:text-[#C48040] transition-colors">Results</a>
        </div>
        <button className="border border-[#C48040]/60 text-[#C48040] px-5 py-2 text-xs tracking-[0.2em] uppercase hover:bg-[#C48040]/10 transition-colors">Free Hair Analysis</button>
      </nav>

      <section className="relative min-h-screen flex items-center overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" style={{filter:'brightness(0.48) saturate(1.15)'}}>
          <source src="/__mockup/videos/hair-clinic.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1208]/90 via-[#2A1E0C]/55 to-[#1A1208]/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1208]/65 via-transparent to-[#1A1208]/30" />

        <div className="relative z-10 max-w-xl px-8 md:px-16 pt-24 pb-16">
          <div className="flex items-center gap-3 mb-8 rv-1">
            <div className="w-8 h-px bg-[#C48040]"/>
            <span className="text-[#C48040] text-xs tracking-[0.3em] uppercase">Trichology · PRP · FUE Transplants</span>
          </div>
          <h1 className="revive-serif text-5xl md:text-6xl lg:text-[76px] leading-[1.02] text-[#F5EDE0] mb-8 rv-2">
            Restore<br /><em className="text-[#C48040]">What's</em><br />Yours
          </h1>
          <p className="text-[#F5EDE0]/55 text-lg font-light leading-relaxed max-w-md mb-12 rv-3">
            Medically-led hair restoration using the latest technology — from PRP and mesotherapy to FUE hair transplants. Regrow confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 rv-4">
            <button className="bg-[#C48040] text-white px-8 py-4 text-sm tracking-widest uppercase font-medium flex items-center gap-2 group hover:bg-[#D49050] transition-colors">
              Free Hair Analysis <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
            </button>
            <button className="border border-[#F5EDE0]/20 text-[#F5EDE0]/70 px-8 py-4 text-sm tracking-widest uppercase font-light hover:border-[#F5EDE0]/40 transition-colors">View Results</button>
          </div>
        </div>

        {/* Right-side floating stat card */}
        <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 z-10 hidden lg:flex flex-col gap-6">
          {[['95%','Success rate'],['8,000+','Grafts placed'],['15+','Years expertise']].map(([n,l],i)=>(
            <div key={i} className="text-right">
              <div className="revive-serif text-4xl text-[#C48040]">{n}</div>
              <div className="text-[#F5EDE0]/35 text-xs tracking-widest uppercase mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#C48040] py-4 overflow-hidden">
        <div className="flex gap-16 text-[#1A1208]/70 text-xs tracking-[0.25em] uppercase font-medium whitespace-nowrap" style={{animation:'scroll 28s linear infinite'}}>
          {Array(5).fill('PRP Therapy · FUE Transplant · Mesotherapy · LLLT Laser · Scalp Micropigmentation · Hair Loss Diagnosis').map((t,i)=><span key={i}>{t}</span>)}
        </div>
      </section>

      <section className="py-24 px-8 bg-[#1A1208]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <p className="text-[#C48040] text-xs tracking-[0.3em] uppercase mb-3">Our Treatments</p>
            <h2 className="revive-serif text-4xl text-[#F5EDE0]">Science-Led Restoration</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {t:'PRP Hair Therapy',d:'Platelet-rich plasma injections stimulate dormant follicles for measurable regrowth.'},
              {t:'FUE Hair Transplant',d:'Follicular Unit Extraction — the gold standard for permanent, natural-looking restoration.'},
              {t:'Scalp Mesotherapy',d:'Microinjections of growth factors, vitamins and DHT-blockers directly to the scalp.'},
              {t:'LLLT Laser Therapy',d:'Low-level laser light to reactivate follicles and slow progressive hair loss.'},
              {t:'Trichology Assessment',d:'Full medical analysis of hair and scalp health to map your personalised treatment plan.'},
              {t:'Scalp Micropigmentation',d:'Medical-grade pigment creates the appearance of density — immediate, long-lasting results.'},
            ].map((t,i)=>(
              <div key={i} className="p-8 border border-[#F5EDE0]/8 hover:border-[#C48040]/30 group transition-colors">
                <div className="w-6 h-px bg-[#C48040] mb-6 group-hover:w-12 transition-all duration-500"/>
                <h3 className="revive-serif text-xl text-[#F5EDE0] mb-3">{t.t}</h3>
                <p className="text-[#F5EDE0]/40 text-sm leading-relaxed font-light">{t.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-8 bg-[#C48040]">
        <p className="revive-serif italic text-4xl text-[#1A1208] text-center max-w-3xl mx-auto leading-relaxed">
          "Hair loss is medical. It deserves a medical solution — not a supplement."
        </p>
      </section>

      <footer className="py-10 px-8 bg-[#100C06] text-center text-[#F5EDE0]/20 text-xs tracking-widest uppercase">
        © {new Date().getFullYear()} REVIVE Hair Sciences · GMC Registered Practitioners
      </footer>
    </div>
  );
}
