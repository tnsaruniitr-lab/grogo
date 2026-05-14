import React from 'react';
import { ArrowRight, TrendingDown } from 'lucide-react';

// VIVA — GLP-1 / weight management clinic. AI video: vibrant confident woman, vitality.
export function WeightManagementV3() {
  return (
    <div className="min-h-screen bg-[#0A1A12] text-[#EDF5EE] overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');
        .viva-serif { font-family: 'DM Serif Display', serif; }
        @keyframes vi-up { from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)} }
        .vi-1{animation:vi-up 0.85s 0.1s ease forwards;opacity:0}
        .vi-2{animation:vi-up 0.85s 0.25s ease forwards;opacity:0}
        .vi-3{animation:vi-up 0.85s 0.4s ease forwards;opacity:0}
        .vi-4{animation:vi-up 0.85s 0.55s ease forwards;opacity:0}
      `}} />

      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingDown strokeWidth={2} className="w-5 h-5 text-[#4CAF72]"/>
          <span className="viva-serif text-xl text-[#EDF5EE]">VIVA</span>
          <span className="text-[#EDF5EE]/30 text-xs tracking-widest ml-1">WEIGHT CLINIC</span>
        </div>
        <div className="hidden md:flex gap-8 text-xs tracking-widest uppercase text-[#EDF5EE]/40 font-light">
          <a href="#" className="hover:text-[#4CAF72] transition-colors">Programmes</a>
          <a href="#" className="hover:text-[#4CAF72] transition-colors">GLP-1 Therapy</a>
          <a href="#" className="hover:text-[#4CAF72] transition-colors">Our Doctors</a>
          <a href="#" className="hover:text-[#4CAF72] transition-colors">Results</a>
        </div>
        <button className="bg-[#4CAF72] text-[#0A1A12] px-5 py-2.5 text-xs tracking-widest uppercase font-semibold hover:bg-[#5CC082] transition-colors">Start Programme</button>
      </nav>

      <section className="relative min-h-screen flex items-center overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" style={{filter:'brightness(0.45) saturate(1.1)'}}>
          <source src="/__mockup/videos/weight-management.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1A12]/92 via-[#0D2018]/55 to-[#0A1A12]/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A12]/65 via-transparent to-[#0A1A12]/28" />

        <div className="relative z-10 max-w-xl px-8 md:px-16 pt-24 pb-16">
          <p className="text-[#4CAF72] text-xs tracking-[0.35em] uppercase mb-8 vi-1">Medically-Supervised · GLP-1 · Ozempic · Wegovy</p>
          <h1 className="viva-serif text-5xl md:text-6xl lg:text-[78px] leading-[1.02] text-[#EDF5EE] mb-8 vi-2">
            Your<br /><em className="text-[#4CAF72]">Healthiest</em><br />Self Awaits
          </h1>
          <p className="text-[#EDF5EE]/55 text-lg font-light leading-relaxed max-w-md mb-12 vi-3">
            Medically-supervised GLP-1 programmes with Semaglutide (Ozempic/Wegovy) and Tirzepatide. Personalised plans, ongoing doctor support, proven results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 vi-4">
            <button className="bg-[#4CAF72] text-[#0A1A12] px-8 py-4 text-sm tracking-widest uppercase font-semibold flex items-center gap-2 group hover:bg-[#5CC082] transition-colors">
              Start My Programme <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border border-[#EDF5EE]/20 text-[#EDF5EE]/65 px-8 py-4 text-sm tracking-widest uppercase font-light hover:border-[#EDF5EE]/40 transition-colors">See Real Results</button>
          </div>
        </div>

        <div className="absolute bottom-10 left-0 right-0 z-10 flex justify-center">
          <div className="flex gap-8 bg-white/6 backdrop-blur-sm border border-white/10 px-10 py-4">
            {[['15–20%','Average weight loss'],['12 wks','To see results'],['GMC','Doctors only']].map(([n,l],i)=>(
              <div key={i} className="text-center">
                <div className="viva-serif text-2xl text-[#4CAF72]">{n}</div>
                <div className="text-white/40 text-xs tracking-wide mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#4CAF72] py-4 overflow-hidden">
        <div className="flex gap-16 text-[#0A1A12]/70 text-xs tracking-[0.25em] uppercase font-medium whitespace-nowrap" style={{animation:'scroll 30s linear infinite'}}>
          {Array(5).fill('Semaglutide · Tirzepatide · Ozempic · Wegovy · Mounjaro · Doctor-Supervised · Monthly Check-ins · Blood Work Included').map((t,i)=><span key={i}>{t}</span>)}
        </div>
      </section>

      <section className="py-24 px-8 bg-[#0A1A12]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <p className="text-[#4CAF72] text-xs tracking-[0.3em] uppercase mb-3">Our Programmes</p>
            <h2 className="viva-serif text-4xl text-[#EDF5EE]">Medically-Led <em>Transformation</em></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {t:'GLP-1 Starter',p:'£199/mo',d:'Semaglutide (Ozempic generic) with monthly doctor check-ins, blood tests and dietitian support.'},
              {t:'Wegovy Programme',p:'£349/mo',d:'Brand-name Semaglutide at therapeutic doses — the programme used in major clinical trials.'},
              {t:'Mounjaro Premium',p:'£399/mo',d:'Tirzepatide — the most effective GLP-1/GIP dual agonist currently available.'},
              {t:'Metabolic Reset',p:'£249/mo',d:'GLP-1 combined with a structured nutrition plan, exercise protocol and weekly coaching.'},
              {t:'Maintenance Plan',p:'£99/mo',d:'For those who've reached their goal — stable maintenance doses with quarterly check-ins.'},
              {t:'Bariatric Prep',p:'Bespoke',d:'Pre-surgical weight optimisation programme in partnership with our bariatric surgery partners.'},
            ].map((t,i)=>(
              <div key={i} className="p-8 border border-[#EDF5EE]/8 hover:border-[#4CAF72]/30 group transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="viva-serif text-xl text-[#EDF5EE]">{t.t}</h3>
                  <span className="text-[#4CAF72] text-xs tracking-wide font-medium">{t.p}</span>
                </div>
                <p className="text-[#EDF5EE]/40 text-sm leading-relaxed font-light">{t.d}</p>
                <div className="mt-6 w-6 h-px bg-[#4CAF72] group-hover:w-12 transition-all duration-500"/>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-8 bg-[#4CAF72]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="viva-serif text-4xl md:text-5xl text-[#0A1A12] mb-4">Ready to change the way you feel?</h2>
          <p className="text-[#0A1A12]/60 mb-10 font-light">Complete a short health questionnaire. A doctor reviews it within 24 hours. Your medication arrives within 72 hours.</p>
          <button className="bg-[#0A1A12] text-[#EDF5EE] px-10 py-4 font-semibold hover:bg-[#0D2018] transition-colors">Start My Programme</button>
        </div>
      </section>

      <footer className="py-10 px-8 bg-[#060E0A] text-center text-[#EDF5EE]/20 text-xs tracking-widest uppercase">
        © {new Date().getFullYear()} VIVA Weight Clinic · GMC Registered Doctors · CQC Registered · UK Pharmacy Dispensed
      </footer>
    </div>
  );
}
