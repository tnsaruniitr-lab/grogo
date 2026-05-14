import React from 'react';
import { ArrowRight, Activity } from 'lucide-react';

// KINĒSIS — Premium physiotherapy & sports rehab. AI video: expert hands-on treatment.
export function PhysioV3() {
  return (
    <div className="min-h-screen bg-[#0A1520] text-[#EBF0F0] overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500&display=swap');
        .kinesis-serif { font-family: 'DM Serif Display', serif; }
        @keyframes kn-up { from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)} }
        .kn-1{animation:kn-up 0.85s 0.1s ease forwards;opacity:0}
        .kn-2{animation:kn-up 0.85s 0.25s ease forwards;opacity:0}
        .kn-3{animation:kn-up 0.85s 0.4s ease forwards;opacity:0}
        .kn-4{animation:kn-up 0.85s 0.55s ease forwards;opacity:0}
      `}} />

      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between bg-gradient-to-b from-black/40 to-transparent">
        <div className="flex items-center gap-2">
          <Activity strokeWidth={1.5} className="w-5 h-5 text-[#3ABFBF]"/>
          <span className="kinesis-serif text-xl text-[#EBF0F0]">KINĒSIS</span>
        </div>
        <div className="hidden md:flex gap-8 text-xs tracking-widest uppercase text-[#EBF0F0]/45 font-light">
          <a href="#" className="hover:text-[#3ABFBF] transition-colors">Treatments</a>
          <a href="#" className="hover:text-[#3ABFBF] transition-colors">Sports Rehab</a>
          <a href="#" className="hover:text-[#3ABFBF] transition-colors">Our Team</a>
          <a href="#" className="hover:text-[#3ABFBF] transition-colors">Book</a>
        </div>
        <button className="bg-[#3ABFBF] text-[#0A1520] px-5 py-2.5 text-xs tracking-widest uppercase font-semibold hover:bg-[#50CFCF] transition-colors">Book Assessment</button>
      </nav>

      <section className="relative min-h-screen flex items-center overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" style={{filter:'brightness(0.45) saturate(1.05)'}}>
          <source src="/__mockup/videos/physio-rehab.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1520]/92 via-[#0D1E2E]/55 to-[#0A1520]/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1520]/65 via-transparent to-[#0A1520]/30" />

        <div className="relative z-10 max-w-xl px-8 md:px-16 pt-24 pb-16">
          <p className="text-[#3ABFBF] text-xs tracking-[0.35em] uppercase mb-8 kn-1">Physiotherapy · Sports Rehab · Pain Management</p>
          <h1 className="kinesis-serif text-5xl md:text-6xl lg:text-[78px] leading-[1.02] text-[#EBF0F0] mb-8 kn-2">
            Move<br /><em className="text-[#3ABFBF]">Without</em><br />Limits
          </h1>
          <p className="text-[#EBF0F0]/55 text-lg font-light leading-relaxed max-w-md mb-12 kn-3">
            Expert physiotherapists and sports rehab specialists. Whether you're recovering from injury, surgery or chronic pain — we get you back to full function.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 kn-4">
            <button className="bg-[#3ABFBF] text-[#0A1520] px-8 py-4 text-sm tracking-widest uppercase font-semibold flex items-center gap-2 group hover:bg-[#50CFCF] transition-colors">
              Book Assessment <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
            </button>
            <button className="border border-[#EBF0F0]/20 text-[#EBF0F0]/70 px-8 py-4 text-sm tracking-widest uppercase font-light hover:border-[#EBF0F0]/40 transition-colors">Our Specialisms</button>
          </div>
        </div>
      </section>

      <section className="bg-[#3ABFBF] py-10 px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[['5,000+','Patients treated'],['98%','Return to sport'],['Same day','Appointments'],['HSP Registered','Practitioners']].map(([n,l],i)=>(
            <div key={i}>
              <div className="kinesis-serif text-3xl text-[#0A1520]">{n}</div>
              <div className="text-[#0A1520]/60 text-xs tracking-widest uppercase mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-8 bg-[#0A1520]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <p className="text-[#3ABFBF] text-xs tracking-[0.3em] uppercase mb-3">Our Specialisms</p>
            <h2 className="kinesis-serif text-4xl text-[#EBF0F0]">Expert-Led Care</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {t:'Sports Injury Rehab',d:'From acute sprains to complex ligament repairs — structured recovery programmes that rebuild strength and confidence.'},
              {t:'Post-Surgical Rehab',d:'Following orthopaedic surgery, we restore full function through evidence-based progressive rehabilitation.'},
              {t:'Chronic Pain Management',d:'Persistent back, neck and joint pain treated with manual therapy, exercise and education.'},
              {t:'Shockwave Therapy',d:'Non-invasive treatment for tendinopathies, plantar fasciitis and calcific shoulder — faster recovery, no surgery.'},
              {t:'Sports Massage',d:'Deep tissue and sports massage for injury prevention, recovery and performance enhancement.'},
              {t:'Pilates Rehabilitation',d:'Clinical Pilates for core stability, postural correction and movement re-education.'},
            ].map((t,i)=>(
              <div key={i} className="p-8 border border-[#EBF0F0]/8 hover:border-[#3ABFBF]/30 group transition-colors">
                <div className="w-6 h-px bg-[#3ABFBF] mb-6 group-hover:w-12 transition-all duration-500"/>
                <h3 className="kinesis-serif text-xl text-[#EBF0F0] mb-3">{t.t}</h3>
                <p className="text-[#EBF0F0]/40 text-sm leading-relaxed font-light">{t.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-8 bg-[#3ABFBF]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="kinesis-serif text-4xl md:text-5xl text-[#0A1520] mb-6">Ready to move freely again?</h2>
          <p className="text-[#0A1520]/60 mb-10 font-light text-lg">Same-week appointments available. Most health insurance accepted.</p>
          <button className="bg-[#0A1520] text-white px-10 py-4 font-semibold hover:bg-[#0D1E2E] transition-colors">Book Your Initial Assessment</button>
        </div>
      </section>

      <footer className="py-10 px-8 bg-[#060D15] text-center text-[#EBF0F0]/20 text-xs tracking-widest uppercase">
        © {new Date().getFullYear()} KINĒSIS Physiotherapy · HCPC Registered · CSP Member
      </footer>
    </div>
  );
}
