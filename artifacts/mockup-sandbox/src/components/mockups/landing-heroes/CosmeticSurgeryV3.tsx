import React from 'react';
import { ArrowRight } from 'lucide-react';

// FORMA — Premium cosmetic surgery. AI video: luxury consultation, confidence reveal.
export function CosmeticSurgeryV3() {
  return (
    <div className="min-h-screen bg-[#1A0F0A] text-[#F5EDE8] overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500&display=swap');
        .forma-serif { font-family: 'Playfair Display', serif; }
        @keyframes fo-up { from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)} }
        .fo-1{animation:fo-up 0.9s 0.1s ease forwards;opacity:0}
        .fo-2{animation:fo-up 0.9s 0.3s ease forwards;opacity:0}
        .fo-3{animation:fo-up 0.9s 0.5s ease forwards;opacity:0}
        .fo-4{animation:fo-up 0.9s 0.65s ease forwards;opacity:0}
      `}} />

      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between">
        <div className="forma-serif text-xl font-bold tracking-[0.1em] text-[#F5EDE8]">FORMA<span className="text-[#C4826A] font-normal">.</span></div>
        <div className="hidden md:flex gap-8 text-xs tracking-widest uppercase text-[#F5EDE8]/40 font-light">
          <a href="#" className="hover:text-[#C4826A] transition-colors">Procedures</a>
          <a href="#" className="hover:text-[#C4826A] transition-colors">Our Surgeons</a>
          <a href="#" className="hover:text-[#C4826A] transition-colors">Gallery</a>
          <a href="#" className="hover:text-[#C4826A] transition-colors">Finance</a>
        </div>
        <button className="border border-[#C4826A]/50 text-[#C4826A] px-5 py-2.5 text-xs tracking-[0.2em] uppercase hover:bg-[#C4826A]/10 transition-colors">Free Consultation</button>
      </nav>

      <section className="relative min-h-screen flex items-center overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" style={{filter:'brightness(0.45) saturate(1.1)'}}>
          <source src="/__mockup/videos/cosmetic-surgery.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A0F0A]/92 via-[#2A1810]/58 to-[#1A0F0A]/18" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F0A]/65 via-transparent to-[#1A0F0A]/28" />

        <div className="relative z-10 max-w-xl px-8 md:px-16 pt-24 pb-16">
          <div className="flex items-center gap-3 mb-8 fo-1">
            <div className="w-8 h-px bg-[#C4826A]"/>
            <span className="text-[#C4826A] text-xs tracking-[0.3em] uppercase">Cosmetic Surgery · London</span>
          </div>
          <h1 className="forma-serif text-5xl md:text-6xl lg:text-[76px] leading-[1.02] text-[#F5EDE8] mb-8 fo-2">
            Become the<br /><em className="text-[#C4826A]">Best</em><br />Version of You
          </h1>
          <p className="text-[#F5EDE8]/55 text-lg font-light leading-relaxed max-w-md mb-12 fo-3">
            Board-certified cosmetic surgeons. Rhinoplasty, breast surgery, body contouring and facial rejuvenation — all performed in our accredited private clinic.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 fo-4">
            <button className="bg-[#C4826A] text-white px-8 py-4 text-sm tracking-widest uppercase font-medium flex items-center gap-2 group hover:bg-[#D4927A] transition-colors">
              Book Consultation <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border border-[#F5EDE8]/20 text-[#F5EDE8]/65 px-8 py-4 text-sm tracking-widest uppercase font-light hover:border-[#F5EDE8]/40 transition-colors">View Results Gallery</button>
          </div>
        </div>

        <div className="absolute bottom-10 left-0 right-0 z-10 flex justify-center gap-8">
          {[['GMC Registered','Surgeons'],['CQC Accredited','Clinic'],['0% Finance','Available']].map(([n,l],i)=>(
            <div key={i} className="text-center bg-white/6 backdrop-blur-sm border border-white/10 px-6 py-3">
              <div className="text-[#C4826A] text-xs tracking-widest uppercase font-medium">{n}</div>
              <div className="text-[#F5EDE8]/40 text-xs tracking-wide mt-0.5">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#C4826A] py-4 overflow-hidden">
        <div className="flex gap-16 text-[#1A0F0A]/70 text-xs tracking-[0.25em] uppercase font-medium whitespace-nowrap" style={{animation:'scroll 30s linear infinite'}}>
          {Array(5).fill('Rhinoplasty · Breast Augmentation · Liposuction · Facelift · Blepharoplasty · Body Contouring · Tummy Tuck').map((t,i)=><span key={i}>{t}</span>)}
        </div>
      </section>

      <section className="py-24 px-8 bg-[#1A0F0A]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <p className="text-[#C4826A] text-xs tracking-[0.3em] uppercase mb-3">Our Procedures</p>
            <h2 className="forma-serif text-4xl text-[#F5EDE8]">Crafted for <em>You</em></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {t:'Rhinoplasty',s:'From £6,500',d:'Surgical refinement of the nose for improved harmony, proportion and breathing.'},
              {t:'Breast Surgery',s:'From £5,500',d:'Augmentation, reduction or uplift — tailored to your anatomy and desired outcome.'},
              {t:'Facelift & Neck Lift',s:'From £8,500',d:'Natural-looking rejuvenation that restores facial contours without the "operated" look.'},
              {t:'Body Contouring',s:'From £4,500',d:'Liposuction, tummy tuck and arm lift — reshape and refine with precision.'},
              {t:'Eyelid Surgery',s:'From £3,200',d:'Remove excess skin and fat around the eyes for a fresher, more alert appearance.'},
              {t:'Brow & Temple Lift',s:'From £4,000',d:'Restore youthful arch and openness to the upper face with minimal downtime.'},
            ].map((t,i)=>(
              <div key={i} className="p-8 border border-[#F5EDE8]/8 hover:border-[#C4826A]/30 group transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="forma-serif text-xl text-[#F5EDE8]">{t.t}</h3>
                  <span className="text-[#C4826A] text-xs tracking-wide">{t.s}</span>
                </div>
                <p className="text-[#F5EDE8]/40 text-sm leading-relaxed font-light">{t.d}</p>
                <div className="mt-6 w-6 h-px bg-[#C4826A] group-hover:w-12 transition-all duration-500"/>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-8 bg-[#C4826A]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="forma-serif text-4xl md:text-5xl text-[#1A0F0A] mb-6">Your journey starts with a conversation</h2>
          <p className="text-[#1A0F0A]/60 mb-10 font-light">A private consultation with your surgeon — no pressure, no obligation. Just an honest conversation about what's possible.</p>
          <button className="bg-[#1A0F0A] text-[#F5EDE8] px-10 py-4 font-medium hover:bg-[#2A1810] transition-colors">Book Your Consultation</button>
        </div>
      </section>

      <footer className="py-10 px-8 bg-[#100A06] text-center text-[#F5EDE8]/20 text-xs tracking-widest uppercase">
        © {new Date().getFullYear()} FORMA Cosmetic Surgery · GMC Registered · CQC Accredited · London
      </footer>
    </div>
  );
}
