import React, { useEffect, useRef } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

// AURIC — Light editorial medspa. Canvas: cascading serum/oil drops (amber on cream).
// Evokes: skincare ritual, precision treatment, golden touch.
export function MedSpaV2() {
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;
    let t = 0;

    interface Drop { x: number; y: number; r: number; vy: number; alpha: number; alphaD: number; color: string; }
    let drops: Drop[] = [];
    const palette = ['#C4882A', '#E8B060', '#F5D8A0', '#A87020', '#D4A060', '#C09040'];

    const hexAlpha = (a: number) => Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, '0');

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };

    const init = () => {
      drops = [];
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      for (let i = 0; i < 40; i++) {
        drops.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 80 + 18,
          vy: Math.random() * 0.25 + 0.06,
          alpha: Math.random() * 0.14 + 0.04,
          alphaD: (Math.random() - 0.5) * 0.0005,
          color: palette[Math.floor(Math.random() * palette.length)],
        });
      }
    };

    const animate = () => {
      const w = canvas.offsetWidth, h = canvas.offsetHeight;

      // Cream base
      ctx.fillStyle = '#FAFAF8';
      ctx.fillRect(0, 0, w, h);

      // Warm radial bloom center-right (the "skin" zone)
      const bloom = ctx.createRadialGradient(w * 0.65, h * 0.45, 0, w * 0.65, h * 0.45, w * 0.5);
      bloom.addColorStop(0, `rgba(248, 235, 200, ${0.35 + 0.08 * Math.sin(t * 0.4)})`);
      bloom.addColorStop(0.5, 'rgba(250, 242, 225, 0.15)');
      bloom.addColorStop(1, 'rgba(250, 250, 248, 0)');
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, w, h);

      // Drops (serum falling)
      for (const d of drops) {
        const grd = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r);
        grd.addColorStop(0,   `${d.color}${hexAlpha(d.alpha)}`);
        grd.addColorStop(0.45, `${d.color}${hexAlpha(d.alpha * 0.35)}`);
        grd.addColorStop(1,   `${d.color}00`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();

        d.y += d.vy;
        d.alpha += d.alphaD;
        if (d.alpha > 0.18) d.alphaD = -Math.abs(d.alphaD);
        if (d.alpha < 0.03) d.alphaD = Math.abs(d.alphaD);
        if (d.y > h + d.r) { d.y = -d.r; d.x = Math.random() * w; }
      }

      // Fine gold shimmer line across the midpoint (like a light refraction)
      ctx.globalAlpha = 0.04 + 0.02 * Math.sin(t * 0.6);
      ctx.fillStyle = '#C4882A';
      ctx.fillRect(0, h * 0.48, w, 1.5);
      ctx.globalAlpha = 1;

      t += 0.016;
      animId = requestAnimationFrame(animate);
    };

    resize();
    init();
    animate();
    const onResize = () => { resize(); init(); };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1A1A18] overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@300;400;500&display=swap');
        .auric-serif { font-family: 'Playfair Display', serif; }
        @keyframes auric-fade { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .auric-anim { animation: auric-fade 0.9s ease forwards; opacity: 0; }
        .auric-anim-2 { animation: auric-fade 0.9s 0.2s ease forwards; opacity: 0; }
        .auric-anim-3 { animation: auric-fade 0.9s 0.4s ease forwards; opacity: 0; }
        .auric-pill { border: 1px solid rgba(196,136,42,0.4); }
        .auric-pill:hover { background: rgba(196,136,42,0.06); }
      `}} />

      {/* Navigation — transparent on cream */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between bg-[#FAFAF8]/80 backdrop-blur-sm border-b border-[#1A1A18]/5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#C4882A]" />
          <span className="auric-serif text-lg font-bold tracking-tight">AURIC</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-[#1A1A18]/60 font-light tracking-wide">
          <a href="#" className="hover:text-[#C4882A] transition-colors">Treatments</a>
          <a href="#" className="hover:text-[#C4882A] transition-colors">Science</a>
          <a href="#" className="hover:text-[#C4882A] transition-colors">Results</a>
          <a href="#" className="hover:text-[#C4882A] transition-colors">Journal</a>
        </div>
        <button className="bg-[#1A1A18] text-[#FAFAF8] px-5 py-2.5 text-sm tracking-wider font-light">
          Book Now
        </button>
      </nav>

      {/* Hero — split editorial */}
      <section className="relative min-h-screen flex overflow-hidden">
        {/* Full-bleed canvas — subtle, behind everything */}
        <canvas ref={bgCanvasRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }} />

        {/* Left text column */}
        <div className="relative z-10 flex-1 flex flex-col justify-center pl-8 md:pl-16 pr-8 pt-24 pb-16 max-w-xl">
          <div className="auric-anim">
            <span className="inline-flex items-center gap-2 text-[#C4882A] text-xs tracking-[0.25em] uppercase font-medium mb-8">
              <Sparkles className="w-3 h-3" /> Medical Aesthetics · Est. 2018
            </span>
          </div>
          <h1 className="auric-serif text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-[#1A1A18] mb-8 auric-anim-2">
            Science<br />
            <span className="italic text-[#C4882A]">Meets</span><br />
            Beauty
          </h1>
          <p className="text-[#1A1A18]/55 text-base md:text-lg leading-relaxed mb-10 max-w-sm font-light auric-anim-3">
            Advanced aesthetic treatments tailored to your unique biology. Visible results. Zero compromise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 auric-anim-3">
            <button className="bg-[#C4882A] text-white px-7 py-3.5 text-sm tracking-wider font-medium flex items-center gap-2 group hover:bg-[#A87020] transition-colors">
              Schedule Consultation <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="auric-pill px-7 py-3.5 text-sm tracking-wider text-[#1A1A18] font-light transition-colors">
              View Treatments
            </button>
          </div>
        </div>

        {/* Right side — decorative stats column */}
        <div className="relative z-10 hidden lg:flex flex-col justify-center gap-8 pr-16 pl-8 pt-24">
          {[
            { num: '12K+', label: 'Treatments delivered' },
            { num: '98%', label: 'Client satisfaction' },
            { num: '15+', label: 'Years combined expertise' },
          ].map((stat, i) => (
            <div key={i} className="text-right" style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="auric-serif text-4xl font-bold text-[#C4882A]">{stat.num}</div>
              <div className="text-[#1A1A18]/50 text-xs tracking-wider uppercase mt-1">{stat.label}</div>
            </div>
          ))}
          {/* Vertical rule */}
          <div className="absolute left-0 top-1/4 bottom-1/4 w-px bg-[#C4882A]/20" />
        </div>

        {/* Bottom scrolling marquee */}
        <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-[#1A1A18]/8 py-3 bg-[#FAFAF8]/60 backdrop-blur-sm overflow-hidden">
          <div className="flex gap-12 text-xs text-[#1A1A18]/40 tracking-[0.2em] uppercase whitespace-nowrap" style={{ animation: 'scroll 30s linear infinite' }}>
            {Array(4).fill(['Botox · Filler · Laser · Microneedling · PRP · Morpheus8 · Hydrafacial']).map((t, i) => (
              <span key={i}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-[#1A1A18] py-10 px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {['CQC Registered', 'GMC Certified Doctors', 'Award Winner 2024', '500+ 5★ Reviews'].map((t, i) => (
            <div key={i} className="text-[#FAFAF8]/60 text-xs tracking-widest uppercase">{t}</div>
          ))}
        </div>
      </section>

      {/* Treatments */}
      <section className="py-24 px-8 bg-[#FAFAF8]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <p className="text-[#C4882A] text-xs tracking-[0.25em] uppercase mb-3">Our Services</p>
            <h2 className="auric-serif text-4xl md:text-5xl text-[#1A1A18]">Precision Treatments</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-[#1A1A18]/10">
            {[
              { title: 'Anti-Ageing', desc: 'Botox, filler, thread lifts and biostimulators — placed with surgical precision.' },
              { title: 'Skin Science', desc: 'Medical-grade peels, lasers and energy devices for transformative skin renewal.' },
              { title: 'Body Sculpt', desc: 'Non-invasive fat reduction and muscle toning with clinically-proven technology.' },
            ].map((item, i) => (
              <div key={i} className="bg-[#FAFAF8] p-10 group hover:bg-[#F5F0E8] transition-colors">
                <div className="w-8 h-px bg-[#C4882A] mb-8 group-hover:w-16 transition-all duration-500" />
                <h3 className="auric-serif text-2xl text-[#1A1A18] mb-3">{item.title}</h3>
                <p className="text-[#1A1A18]/55 text-sm leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-20 px-8 bg-[#C4882A]">
        <div className="max-w-3xl mx-auto text-center text-white">
          <p className="auric-serif italic text-3xl md:text-4xl leading-relaxed mb-6">
            "The most natural-looking results I've ever had. AURIC genuinely changed how I feel about myself."
          </p>
          <span className="text-white/70 text-xs tracking-widest uppercase">— Priya K., Knightsbridge</span>
        </div>
      </section>

      <footer className="py-10 px-8 bg-[#1A1A18] text-center text-[#FAFAF8]/40 text-xs tracking-widest uppercase">
        © {new Date().getFullYear()} AURIC Medical Aesthetics — London · Dubai
      </footer>
    </div>
  );
}
