import React from 'react';
import { ArrowRight, Heart } from 'lucide-react';

// SOLARA — Premium fertility & IVF clinic. AI video: hopeful couple, warm sanctuary.
export function FertilityV3() {
  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#2A1F14] overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,600;1,400;1,600&family=Inter:wght@300;400;500&display=swap');
        .solara-serif { font-family: 'Cormorant', serif; }
        @keyframes sl-up { from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)} }
        .sl-1{animation:sl-up 1s 0.1s ease forwards;opacity:0}
        .sl-2{animation:sl-up 1s 0.3s ease forwards;opacity:0}
        .sl-3{animation:sl-up 1s 0.5s ease forwards;opacity:0}
        .sl-4{animation:sl-up 1s 0.7s ease forwards;opacity:0}
      `}} />

      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between bg-[#F5F0E8]/90 backdrop-blur-sm border-b border-[#2A1F14]/8">
        <div className="flex items-center gap-2">
          <Heart strokeWidth={1.5} className="w-4 h-4 text-[#8A6A4A]" fill="none"/>
          <span className="solara-serif text-xl font-semibold text-[#2A1F14] tracking-wide">SOLARA</span>
          <span className="text-[#2A1F14]/30 text-xs tracking-widest ml-1">FERTILITY</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm text-[#2A1F14]/45 font-light">
          <a href="#" className="hover:text-[#8A6A4A] transition-colors">Treatments</a>
          <a href="#" className="hover:text-[#8A6A4A] transition-colors">Our Doctors</a>
          <a href="#" className="hover:text-[#8A6A4A] transition-colors">Success Rates</a>
          <a href="#" className="hover:text-[#8A6A4A] transition-colors">Funding</a>
        </div>
        <button className="bg-[#8A6A4A] text-white px-5 py-2.5 text-sm font-medium hover:bg-[#9A7A5A] transition-colors">Book Consultation</button>
      </nav>

      <section className="relative min-h-screen flex items-center overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" style={{filter:'brightness(0.48) saturate(1.05)'}}>
          <source src="/__mockup/videos/fertility-ivf.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1208]/88 via-[#2A1E10]/52 to-[#1A1208]/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1208]/60 via-transparent to-[#1A1208]/25" />

        <div className="relative z-10 max-w-xl px-8 md:px-16 pt-24 pb-16">
          <div className="flex items-center gap-3 mb-8 sl-1">
            <div className="w-8 h-px bg-[#C4A880]"/>
            <span className="text-[#C4A880] text-xs tracking-[0.3em] uppercase">IVF · IUI · Egg Freezing · Donor</span>
          </div>
          <h1 className="solara-serif text-5xl md:text-6xl lg:text-[76px] leading-[1.02] text-white mb-8 sl-2">
            Your Path<br />to <em className="text-[#C4A880]">Parenthood</em><br />Begins Here
          </h1>
          <p className="text-white/55 text-lg font-light leading-relaxed max-w-md mb-12 sl-3">
            Compassionate, expert-led fertility care. We treat each journey as deeply personal — combining the latest science with genuine human warmth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sl-4">
            <button className="bg-[#8A6A4A] text-white px-8 py-4 text-sm tracking-wider font-medium flex items-center gap-2 group hover:bg-[#9A7A5A] transition-colors">
              Begin Your Journey <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border border-white/20 text-white/65 px-8 py-4 text-sm tracking-wider font-light hover:border-white/40 transition-colors">Our Success Rates</button>
          </div>
        </div>
      </section>

      <section className="bg-[#8A6A4A] py-10 px-8">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[['68%','Live birth rate (under 35)'],['15,000+','Babies born'],['25 yrs','Clinical experience']].map(([n,l],i)=>(
            <div key={i}>
              <div className="solara-serif text-4xl text-white">{n}</div>
              <div className="text-white/60 text-xs tracking-widest uppercase mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-8 bg-[#F5F0E8]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <p className="text-[#8A6A4A] text-xs tracking-[0.3em] uppercase mb-3">Our Treatments</p>
            <h2 className="solara-serif text-4xl text-[#2A1F14]">Every Path is <em>Different</em></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {t:'IVF',d:'In vitro fertilisation — our most established treatment. Eggs retrieved, fertilised in our lab, embryo transferred to the womb.'},
              {t:'IUI',d:'Intrauterine insemination — a gentler first-line treatment, placing sperm directly into the uterus at ovulation.'},
              {t:'Egg Freezing',d:'Preserve your fertility on your terms. Social or medical — we guide you through the timing and process.'},
              {t:'Donor Egg IVF',d:'For those needing donor eggs — our carefully screened donor programme with exceptional success rates.'},
              {t:'Embryo Freezing',d:'Freeze surplus embryos from your IVF cycle for future use — protecting your investment and your options.'},
              {t:'Fertility MOT',d:'Comprehensive fertility health check — AMH, antral follicle count, semen analysis and full hormone panel.'},
            ].map((t,i)=>(
              <div key={i} className="p-8 border border-[#2A1F14]/8 hover:border-[#8A6A4A]/30 group transition-colors bg-white/40">
                <div className="w-6 h-px bg-[#8A6A4A] mb-6 group-hover:w-12 transition-all duration-500"/>
                <h3 className="solara-serif text-xl text-[#2A1F14] mb-3">{t.t}</h3>
                <p className="text-[#2A1F14]/50 text-sm leading-relaxed font-light">{t.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-8 bg-[#2A1F14]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="solara-serif italic text-4xl text-white leading-relaxed mb-4">"We never forget that behind every treatment plan is a deeply human hope."</p>
          <span className="text-white/35 text-xs tracking-widest uppercase">— Dr. Priya M., Consultant Reproductive Endocrinologist</span>
        </div>
      </section>

      <section className="py-20 px-8 bg-[#8A6A4A]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="solara-serif text-4xl md:text-5xl text-white mb-4">Take the first step today</h2>
          <p className="text-white/65 mb-10 font-light">A gentle conversation with one of our specialists — no pressure, just clarity about what's possible for you.</p>
          <button className="bg-white text-[#2A1F14] px-10 py-4 font-medium hover:bg-[#F5F0E8] transition-colors">Book a Consultation</button>
        </div>
      </section>

      <footer className="py-10 px-8 bg-[#1A1208] text-center text-white/20 text-xs tracking-widest uppercase">
        © {new Date().getFullYear()} SOLARA Fertility · HFEA Licensed · London
      </footer>
    </div>
  );
}
