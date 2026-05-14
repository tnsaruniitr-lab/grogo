import React, { useEffect, useRef } from 'react';
import { Leaf, Flame, Wind, Droplets } from 'lucide-react';

// TĒRA — Dark earthy wellness. Canvas: slow breathing orb (a person meditating).
// Evokes: breathwork, grounding, presence, the living body in stillness.
export function WellnessV2() {
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

    // Breathing cycle: 4s inhale, 1s hold, 4s exhale, 1s hold = 10s cycle
    const breathe = (t: number) => {
      const cycle = (t % 10) / 10;
      if (cycle < 0.4) return cycle / 0.4; // inhale
      if (cycle < 0.5) return 1;           // hold
      if (cycle < 0.9) return 1 - (cycle - 0.5) / 0.4; // exhale
      return 0;                            // hold
    };

    const animate = () => {
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      const cx = w / 2, cy = h * 0.48;
      const baseR = Math.min(w, h) * 0.22;
      const b = breathe(t);
      const curR = baseR * (0.82 + b * 0.28);

      // Deep earth background
      ctx.fillStyle = '#1C1410';
      ctx.fillRect(0, 0, w, h);

      // Outer ambient earth glow (always present, pulses gently)
      const outerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.7);
      outerGlow.addColorStop(0,   `rgba(80, 45, 20, ${0.30 + b * 0.15})`);
      outerGlow.addColorStop(0.4, `rgba(50, 30, 12, 0.20)`);
      outerGlow.addColorStop(1,   'rgba(28, 20, 16, 0)');
      ctx.fillStyle = outerGlow;
      ctx.fillRect(0, 0, w, h);

      // Concentric breathing rings — 4 outer rings
      const ringColors = ['#7A9E7A', '#C4875A', '#8B6A40', '#4A7A4A'];
      for (let i = 3; i >= 0; i--) {
        const ringR = curR * (1.6 + i * 0.5);
        const ringAlpha = (0.07 + b * 0.04) * (1 - i * 0.15);
        const grd = ctx.createRadialGradient(cx, cy, ringR * 0.85, cx, cy, ringR);
        grd.addColorStop(0, `${ringColors[i]}${hexAlpha(ringAlpha * 2)}`);
        grd.addColorStop(0.5, `${ringColors[i]}${hexAlpha(ringAlpha)}`);
        grd.addColorStop(1, `${ringColors[i]}00`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
        ctx.fill();
      }

      // Sage inner mist
      const sageMist = ctx.createRadialGradient(cx, cy, 0, cx, cy, curR * 1.2);
      sageMist.addColorStop(0, `rgba(90, 140, 90, ${0.18 + b * 0.12})`);
      sageMist.addColorStop(0.6, `rgba(70, 110, 70, ${0.08 + b * 0.06})`);
      sageMist.addColorStop(1, 'rgba(90, 140, 90, 0)');
      ctx.fillStyle = sageMist;
      ctx.beginPath();
      ctx.arc(cx, cy, curR * 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Core orb — the "breath body" (terracotta center)
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, curR);
      core.addColorStop(0,   `rgba(220, 140, 80, ${0.55 + b * 0.25})`);
      core.addColorStop(0.35, `rgba(196, 135, 90, ${0.35 + b * 0.15})`);
      core.addColorStop(0.7,  `rgba(140, 80, 40, ${0.15 + b * 0.08})`);
      core.addColorStop(1,    'rgba(100, 55, 20, 0)');
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, curR, 0, Math.PI * 2);
      ctx.fill();

      // Bright center spark (the life force point)
      const spark = ctx.createRadialGradient(cx, cy, 0, cx, cy, curR * 0.15);
      spark.addColorStop(0, `rgba(255, 230, 180, ${0.65 + b * 0.25})`);
      spark.addColorStop(1, 'rgba(255, 200, 120, 0)');
      ctx.fillStyle = spark;
      ctx.beginPath();
      ctx.arc(cx, cy, curR * 0.15, 0, Math.PI * 2);
      ctx.fill();

      // Floating earth particles
      const numPart = 30;
      for (let i = 0; i < numPart; i++) {
        const angle = (i / numPart) * Math.PI * 2 + t * 0.04;
        const dist = curR * (1.3 + 0.8 * Math.sin(t * 0.3 + i * 0.7));
        const px = cx + Math.cos(angle) * dist;
        const py = cy + Math.sin(angle) * dist * 0.6;
        const pr = 1.5 + Math.sin(t * 0.5 + i) * 1;
        const pa = 0.15 + 0.1 * Math.sin(t * 0.4 + i * 1.3);
        ctx.fillStyle = i % 3 === 0 ? `rgba(122, 158, 122, ${pa})` : `rgba(196, 135, 90, ${pa})`;
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fill();
      }

      // Very subtle horizon vignette
      const vignette = ctx.createLinearGradient(0, 0, 0, h);
      vignette.addColorStop(0, 'rgba(28,20,16,0.4)');
      vignette.addColorStop(0.35, 'rgba(28,20,16,0)');
      vignette.addColorStop(0.65, 'rgba(28,20,16,0)');
      vignette.addColorStop(1, 'rgba(28,20,16,0.5)');
      ctx.fillStyle = vignette;
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
    <div className="min-h-screen bg-[#1C1410] text-[#F0E8DE] overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@300;400;500&display=swap');
        .tera-serif { font-family: 'EB Garamond', serif; }
        @keyframes tera-up { from { opacity:0;transform:translateY(24px); } to { opacity:1;transform:translateY(0); } }
        .tera-a1 { animation: tera-up 1s 0.1s ease forwards; opacity: 0; }
        .tera-a2 { animation: tera-up 1s 0.3s ease forwards; opacity: 0; }
        .tera-a3 { animation: tera-up 1s 0.5s ease forwards; opacity: 0; }
        .tera-a4 { animation: tera-up 1s 0.7s ease forwards; opacity: 0; }
      `}} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between">
        <div className="tera-serif text-xl tracking-[0.15em] text-[#F0E8DE]">TĒRA</div>
        <div className="hidden md:flex items-center gap-8 text-sm tracking-wider text-[#F0E8DE]/50 font-light uppercase">
          <a href="#" className="hover:text-[#C4875A] transition-colors">Studio</a>
          <a href="#" className="hover:text-[#C4875A] transition-colors">Practices</a>
          <a href="#" className="hover:text-[#C4875A] transition-colors">Retreats</a>
          <a href="#" className="hover:text-[#C4875A] transition-colors">Community</a>
        </div>
        <button className="border border-[#C4875A]/50 text-[#C4875A] px-5 py-2 text-xs tracking-[0.2em] uppercase hover:bg-[#C4875A]/10 transition-colors">
          Begin Today
        </button>
      </nav>

      {/* Hero — canvas dominant, text centred beneath orb */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <canvas ref={bgCanvasRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }} />

        <div className="relative z-10 flex flex-col items-center text-center px-6 pt-20">
          <p className="text-[#C4875A] text-xs tracking-[0.4em] uppercase mb-10 tera-a1">
            Earth · Breath · Body
          </p>
          <h1 className="tera-serif text-6xl md:text-[84px] lg:text-[100px] leading-[1.0] text-[#F0E8DE] mb-6 tera-a2">
            Come<br />
            <em>Home</em><br />
            to Yourself
          </h1>
          <p className="text-[#F0E8DE]/50 text-base max-w-sm leading-relaxed font-light tera-a3 mb-12">
            A sanctuary of movement, breath and ancient practice. Reconnect with the living intelligence of your body.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 tera-a4">
            <button className="bg-[#C4875A] text-[#1C1410] px-8 py-4 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#D49A6A] transition-colors">
              Explore Practices
            </button>
            <button className="border border-[#F0E8DE]/25 text-[#F0E8DE]/75 px-8 py-4 text-xs tracking-[0.2em] uppercase font-light hover:border-[#F0E8DE]/50 transition-colors">
              Book Retreat
            </button>
          </div>

          {/* Breathing instruction — subtle guide below CTA */}
          <p className="text-[#F0E8DE]/25 text-xs tracking-widest uppercase mt-10 tera-a4">
            ↑ watch the orb breathe
          </p>
        </div>
      </section>

      {/* Practice cards */}
      <section className="bg-[#120E0A] py-24 px-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#C4875A] text-xs tracking-[0.3em] uppercase mb-12">Our Pillars</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Leaf, name: 'Yoga', sub: 'Yin · Vinyasa · Restorative' },
              { icon: Wind, name: 'Breathwork', sub: 'Pranayama · Wim Hof · Rebirthing' },
              { icon: Flame, name: 'Meditation', sub: 'Vipassana · Nidra · Transcendental' },
              { icon: Droplets, name: 'Rituals', sub: 'Cacao · Sound · Cold Immersion' },
            ].map((p, i) => (
              <div key={i} className="bg-[#1C1410] p-8 border border-[#F0E8DE]/6 hover:border-[#C4875A]/30 transition-colors group">
                <p.icon strokeWidth={1} className="w-8 h-8 text-[#C4875A] mb-6" />
                <h3 className="tera-serif text-2xl text-[#F0E8DE] mb-1">{p.name}</h3>
                <p className="text-[#F0E8DE]/35 text-xs tracking-wide">{p.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Retreat feature */}
      <section className="py-24 px-8 bg-[#1C1410] border-t border-[#F0E8DE]/6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-end gap-12">
          <div className="flex-1">
            <p className="text-[#C4875A] text-xs tracking-[0.3em] uppercase mb-4">Next Gathering</p>
            <h2 className="tera-serif text-4xl md:text-5xl text-[#F0E8DE] mb-4 leading-tight">
              Oaxaca<br />Deep Silence Retreat
            </h2>
            <p className="text-[#F0E8DE]/45 font-light text-sm leading-relaxed max-w-md">
              Seven days of silence, earth medicine ceremonies, and guided breathwork in the mountains of southern Mexico. Ten spaces only.
            </p>
          </div>
          <div className="flex-none">
            <p className="text-[#F0E8DE]/30 text-xs uppercase tracking-widest mb-2">March 2025 · 7 Nights</p>
            <button className="flex items-center gap-3 bg-[#C4875A] text-[#1C1410] px-8 py-4 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#D49A6A] transition-colors">
              Reserve Your Place
            </button>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-20 px-8 bg-[#C4875A]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="tera-serif italic text-4xl text-[#1C1410] leading-relaxed mb-6">
            "The breath is the bridge between body and mind."
          </p>
          <span className="text-[#1C1410]/60 text-xs tracking-widest uppercase">— TĒRA Philosophy</span>
        </div>
      </section>

      <footer className="py-10 px-8 bg-[#120E0A] text-center text-[#F0E8DE]/25 text-xs tracking-widest uppercase">
        © {new Date().getFullYear()} TĒRA Wellness · London · Lisbon · Oaxaca
      </footer>
    </div>
  );
}
