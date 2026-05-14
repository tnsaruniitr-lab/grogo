import React, { useEffect, useRef } from 'react';
import { Phone, Star, ArrowRight } from 'lucide-react';

// SOLACE — Premium midnight-blue care brand. Canvas: two warm lights slowly converging.
// Evokes: two people coming together — the carer and the cared-for. Human connection.
export function CareV2() {
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;
    let t = 0;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };

    const hexAlpha = (a: number) => Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, '0');

    const animate = () => {
      const w = canvas.offsetWidth, h = canvas.offsetHeight;

      // Midnight navy base
      ctx.fillStyle = '#091524';
      ctx.fillRect(0, 0, w, h);

      // Subtle deep navy ambient gradient
      const ambient = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, w * 0.8);
      ambient.addColorStop(0, 'rgba(15, 35, 65, 0.6)');
      ambient.addColorStop(1, 'rgba(9, 21, 36, 0)');
      ctx.fillStyle = ambient;
      ctx.fillRect(0, 0, w, h);

      // === Two converging lights — the carer and the cared-for ===
      // Cycle: they drift apart, then slowly come together, pause together, then drift again
      // 16s total cycle
      const cycle = (t % 16) / 16;
      let separation: number;
      if (cycle < 0.5) {
        // Moving together (ease in-out)
        const p = cycle / 0.5;
        separation = 1 - (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
      } else if (cycle < 0.65) {
        // Dwelling together
        separation = 0;
      } else {
        // Drifting apart (ease out)
        const p = (cycle - 0.65) / 0.35;
        separation = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      }

      const cx = w / 2, cy = h * 0.46;
      const maxDist = Math.min(w, h) * 0.22;
      const dist = maxDist * separation;

      // The carer — warm gold, slightly larger (experienced, grounding)
      const x1 = cx - dist, y1 = cy + dist * 0.1;
      const r1 = Math.min(w, h) * 0.18;

      const carer = ctx.createRadialGradient(x1, y1, 0, x1, y1, r1);
      carer.addColorStop(0,   `rgba(232, 168, 76, ${0.55 + (1 - separation) * 0.2})`);
      carer.addColorStop(0.4, `rgba(196, 136, 42, ${0.28 + (1 - separation) * 0.1})`);
      carer.addColorStop(0.75, `rgba(150, 95, 20, ${0.10})`);
      carer.addColorStop(1,   'rgba(100, 60, 10, 0)');
      ctx.fillStyle = carer;
      ctx.beginPath();
      ctx.arc(x1, y1, r1, 0, Math.PI * 2);
      ctx.fill();

      // The person receiving care — soft blue-white, gentle (like reflected moonlight)
      const x2 = cx + dist, y2 = cy - dist * 0.05;
      const r2 = Math.min(w, h) * 0.15;

      const patient = ctx.createRadialGradient(x2, y2, 0, x2, y2, r2);
      patient.addColorStop(0,   `rgba(195, 218, 245, ${0.50 + (1 - separation) * 0.2})`);
      patient.addColorStop(0.4, `rgba(140, 180, 230, ${0.22 + (1 - separation) * 0.08})`);
      patient.addColorStop(0.75, `rgba(100, 145, 200, 0.08)`);
      patient.addColorStop(1,   'rgba(70, 110, 170, 0)');
      ctx.fillStyle = patient;
      ctx.beginPath();
      ctx.arc(x2, y2, r2, 0, Math.PI * 2);
      ctx.fill();

      // Shared warmth bloom — only visible when they are close
      if (separation < 0.6) {
        const meetX = (x1 + x2) / 2, meetY = (y1 + y2) / 2;
        const meetR = Math.min(w, h) * 0.25 * (1 - separation * 1.5);
        const meetAlpha = (1 - separation / 0.6) * 0.35;
        const meet = ctx.createRadialGradient(meetX, meetY, 0, meetX, meetY, meetR);
        meet.addColorStop(0, `rgba(255, 215, 140, ${meetAlpha})`);
        meet.addColorStop(0.4, `rgba(220, 175, 90, ${meetAlpha * 0.4})`);
        meet.addColorStop(1, 'rgba(180, 130, 50, 0)');
        ctx.fillStyle = meet;
        ctx.beginPath();
        ctx.arc(meetX, meetY, meetR, 0, Math.PI * 2);
        ctx.fill();
      }

      // Soft star field — quiet, peaceful background
      for (let i = 0; i < 60; i++) {
        const sx = ((i * 137.508 + w * 0.1) % w);
        const sy = ((i * 97.312 + h * 0.05) % h);
        const sPulse = 0.3 + 0.25 * Math.sin(t * 0.6 + i * 1.3);
        ctx.fillStyle = `rgba(200, 215, 240, ${sPulse * 0.3})`;
        ctx.beginPath();
        ctx.arc(sx, sy, 0.8 + (i % 3) * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Bottom vignette for text readability
      const vign = ctx.createLinearGradient(0, h * 0.55, 0, h);
      vign.addColorStop(0, 'rgba(9,21,36,0)');
      vign.addColorStop(1, 'rgba(9,21,36,0.75)');
      ctx.fillStyle = vign;
      ctx.fillRect(0, 0, w, h);

      t += 0.016;
      animId = requestAnimationFrame(animate);
    };

    resize();
    animate();
    const onResize = () => resize();
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <div className="min-h-screen bg-[#091524] text-[#E8EBF0] overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,600;1,400;1,600&family=Inter:wght@300;400;500&display=swap');
        .solace-serif { font-family: 'Cormorant', serif; }
        @keyframes sol-up { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
        .sol-a1 { animation: sol-up 0.9s 0.1s ease forwards; opacity:0; }
        .sol-a2 { animation: sol-up 0.9s 0.25s ease forwards; opacity:0; }
        .sol-a3 { animation: sol-up 0.9s 0.4s ease forwards; opacity:0; }
        .sol-a4 { animation: sol-up 0.9s 0.55s ease forwards; opacity:0; }
      `}} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-[#E8A84C]" />
          <span className="solace-serif text-xl font-semibold text-[#E8EBF0] tracking-wide">SOLACE</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-xs tracking-widest uppercase text-[#E8EBF0]/50 font-light">
          <a href="#" className="hover:text-[#E8A84C] transition-colors">Services</a>
          <a href="#" className="hover:text-[#E8A84C] transition-colors">Carers</a>
          <a href="#" className="hover:text-[#E8A84C] transition-colors">Families</a>
          <a href="#" className="hover:text-[#E8A84C] transition-colors">Contact</a>
        </div>
        <button className="bg-[#E8A84C] text-[#091524] px-5 py-2.5 text-xs tracking-widest uppercase font-medium hover:bg-[#F5C060] transition-colors">
          Free Assessment
        </button>
      </nav>

      {/* Hero — full-bleed canvas, text centred */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <canvas ref={bgCanvasRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }} />

        {/* "Watch" instruction — subtle, atmospheric */}
        <p className="absolute top-28 left-0 right-0 text-center text-[#E8EBF0]/18 text-xs tracking-[0.3em] uppercase z-10">
          two lights, one moment
        </p>

        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl">
          <p className="text-[#E8A84C] text-xs tracking-[0.35em] uppercase mb-8 sol-a1">
            Premium Home Care · Since 2015
          </p>
          <h1 className="solace-serif text-6xl md:text-7xl lg:text-[88px] leading-[1.0] text-[#E8EBF0] mb-8 sol-a2">
            Care That Feels<br />
            <em className="text-[#E8A84C]">Like Family</em>
          </h1>
          <p className="text-[#E8EBF0]/55 text-lg font-light leading-relaxed max-w-lg mb-12 sol-a3">
            Compassionate carers, carefully matched. We support your loved ones to live with dignity, comfort and joy — in the home they love.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 sol-a4">
            <button className="bg-[#E8A84C] text-[#091524] px-8 py-4 text-sm font-semibold hover:bg-[#F5C060] transition-colors flex items-center gap-2 group">
              Book Free Assessment <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border border-[#E8EBF0]/20 text-[#E8EBF0]/70 px-8 py-4 text-sm font-light hover:border-[#E8EBF0]/40 transition-colors flex items-center gap-2">
              <Phone className="w-4 h-4" /> 0800 123 4567
            </button>
          </div>
        </div>

        {/* Review strip at bottom */}
        <div className="absolute bottom-10 left-0 right-0 z-10 flex justify-center">
          <div className="bg-white/6 backdrop-blur-sm border border-white/10 px-6 py-3 flex items-center gap-4 rounded-full">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-[#E8A84C] text-[#E8A84C]" />)}
            </div>
            <span className="text-[#E8EBF0]/70 text-xs font-light">4.9 · 1,200+ families served</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-8 bg-[#0C1E35] border-y border-white/6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: '10+', sub: 'Years in care' },
            { num: '3,500+', sub: 'Families helped' },
            { num: '98%', sub: 'Satisfaction rate' },
            { num: '24/7', sub: 'Support line' },
          ].map((s, i) => (
            <div key={i}>
              <div className="solace-serif text-4xl text-[#E8A84C] mb-1">{s.num}</div>
              <div className="text-[#E8EBF0]/40 text-xs tracking-widest uppercase">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-24 px-8 bg-[#091524]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <p className="text-[#E8A84C] text-xs tracking-[0.3em] uppercase mb-3">How We Help</p>
            <h2 className="solace-serif text-4xl text-[#E8EBF0]">Our Care Services</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: 'Live-In Care', desc: 'Round-the-clock compassionate support from a dedicated live-in carer.' },
              { title: 'Dementia Support', desc: 'Specialist care designed around memory loss — with dignity at the centre.' },
              { title: 'Palliative Care', desc: 'Gentle end-of-life support, focusing on comfort and quality of time.' },
              { title: 'Respite Care', desc: 'Short-term cover to give family members a well-earned break.' },
              { title: 'Companionship', desc: 'Regular friendly visits for connection, outings, and shared activities.' },
              { title: 'Nursing Care', desc: 'Qualified nurses for clinical needs — catheter care, wound care and more.' },
            ].map((s, i) => (
              <div key={i} className="p-8 border border-white/8 hover:border-[#E8A84C]/30 group transition-colors">
                <div className="w-6 h-px bg-[#E8A84C] mb-6 group-hover:w-12 transition-all duration-500" />
                <h3 className="solace-serif text-xl text-[#E8EBF0] mb-3">{s.title}</h3>
                <p className="text-[#E8EBF0]/40 text-sm leading-relaxed font-light">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-8 bg-gradient-to-r from-[#E8A84C] to-[#D4922A]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="solace-serif text-4xl md:text-5xl text-[#091524] mb-6">Start Your Care Journey Today</h2>
          <p className="text-[#091524]/70 text-base mb-10 font-light">Our team is available 7 days a week to guide you through the process — with no pressure and no obligation.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-[#091524] text-[#E8EBF0] px-8 py-4 font-semibold text-sm hover:bg-[#0C1E35] transition-colors">
              Request Free Assessment
            </button>
            <button className="bg-transparent border border-[#091524]/30 text-[#091524] px-8 py-4 text-sm font-light hover:bg-[#091524]/5 transition-colors">
              Speak to Our Team
            </button>
          </div>
        </div>
      </section>

      <footer className="py-10 px-8 bg-[#060F1A] text-center text-[#E8EBF0]/20 text-xs tracking-widest uppercase">
        © {new Date().getFullYear()} SOLACE Care Services — Regulated by the CQC
      </footer>
    </div>
  );
}
