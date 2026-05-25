import React, { useEffect, useRef } from 'react';
import { ArrowRight, Leaf, Star } from 'lucide-react';

// GROVE — Premium farm-to-door grocery. Canvas: living field at golden hour.
// Warm harvest sun bloom, floating seed particles, rolling ground mist.
export function GroceryD2CV3() {
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    // Seeded deterministic positions so particles don't jump on resize
    const SEED_COUNT = 90;
    type Particle = { x: number; y: number; r: number; speed: number; phase: number; sway: number; alpha: number; warm: boolean };
    const particles: Particle[] = Array.from({ length: SEED_COUNT }, (_, i) => ({
      x: (i * 137.508 * 1.618) % 1,   // normalised 0-1
      y: (i * 97.312 + 0.3) % 1,
      r: 1.0 + (i % 5) * 0.55,
      speed: 0.00008 + (i % 7) * 0.000018,
      phase: i * 0.71,
      sway: 0.00012 + (i % 4) * 0.00006,
      alpha: 0.15 + (i % 5) * 0.07,
      warm: i % 3 === 0,               // 1 in 3 particles are warm gold, rest are green
    }));

    const animate = () => {
      const w = canvas.offsetWidth, h = canvas.offsetHeight;

      // === Base: deep forest-night green ===
      ctx.fillStyle = '#050C05';
      ctx.fillRect(0, 0, w, h);

      // === Subtle earth-toned ambient ===
      const earth = ctx.createRadialGradient(w * 0.5, h * 1.1, 0, w * 0.5, h * 1.1, w * 1.1);
      earth.addColorStop(0, 'rgba(30, 55, 18, 0.55)');
      earth.addColorStop(1, 'rgba(5, 12, 5, 0)');
      ctx.fillStyle = earth;
      ctx.fillRect(0, 0, w, h);

      // === Harvest sun bloom (upper-center) — slow 12s breath ===
      const breathe = 0.82 + 0.18 * Math.sin(t * 0.52);
      const sunX = w * 0.5, sunY = h * 0.28;
      const sunR = Math.min(w, h) * 0.52 * breathe;

      const sun = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR);
      sun.addColorStop(0,    `rgba(255, 200, 60, ${0.22 * breathe})`);
      sun.addColorStop(0.18, `rgba(240, 165, 30, ${0.14 * breathe})`);
      sun.addColorStop(0.4,  `rgba(180, 120, 15, ${0.08 * breathe})`);
      sun.addColorStop(0.7,  `rgba(100, 80, 10, ${0.04})`);
      sun.addColorStop(1,    'rgba(5, 12, 5, 0)');
      ctx.fillStyle = sun;
      ctx.fillRect(0, 0, w, h);

      // === Secondary green life bloom (lower-left, complementary) ===
      const lifeR = Math.min(w, h) * 0.38;
      const life = ctx.createRadialGradient(w * 0.15, h * 0.72, 0, w * 0.15, h * 0.72, lifeR);
      life.addColorStop(0,    'rgba(34, 197, 94, 0.14)');
      life.addColorStop(0.45, 'rgba(22, 163, 74, 0.07)');
      life.addColorStop(1,    'rgba(5, 12, 5, 0)');
      ctx.fillStyle = life;
      ctx.fillRect(0, 0, w, h);

      // === Floating seed / pollen particles ===
      for (const p of particles) {
        // Advance y upward (wraps top → bottom)
        p.y -= p.speed;
        if (p.y < -0.02) p.y = 1.02;

        const px = (p.x + Math.sin(t * p.sway * 30 + p.phase) * 0.018) * w;
        const py = p.y * h;

        // Height-based brightness: particles near top catch sun more
        const heightBoost = 1 - p.y;
        const a = p.alpha * (0.5 + 0.5 * heightBoost);

        if (p.warm) {
          // Warm gold seed
          ctx.fillStyle = `rgba(255, 200, 80, ${a})`;
        } else {
          // Fresh green pollen
          ctx.fillStyle = `rgba(134, 239, 172, ${a})`;
        }
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fill();

        // Tiny glow around larger particles
        if (p.r > 1.8) {
          const glow = ctx.createRadialGradient(px, py, 0, px, py, p.r * 4);
          const glowColor = p.warm ? `rgba(255,190,60,${a * 0.35})` : `rgba(134,239,172,${a * 0.3})`;
          glow.addColorStop(0, glowColor);
          glow.addColorStop(1, 'rgba(5,12,5,0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(px, py, p.r * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // === Ground mist — rolling fog at the lower 35% ===
      const mistY = h * 0.65;
      const mistPulse = 0.6 + 0.4 * Math.sin(t * 0.28);
      const mist = ctx.createLinearGradient(0, mistY, 0, h);
      mist.addColorStop(0, 'rgba(5, 12, 5, 0)');
      mist.addColorStop(0.3, `rgba(14, 30, 12, ${0.22 * mistPulse})`);
      mist.addColorStop(0.7, `rgba(8, 20, 8, ${0.38 * mistPulse})`);
      mist.addColorStop(1,   'rgba(5, 12, 5, 0.7)');
      ctx.fillStyle = mist;
      ctx.fillRect(0, 0, w, h);

      // === Horizon shimmer line ===
      const shimmerAlpha = 0.04 + 0.03 * Math.sin(t * 0.9);
      const shimmer = ctx.createLinearGradient(0, h * 0.60, 0, h * 0.68);
      shimmer.addColorStop(0, 'rgba(255, 210, 100, 0)');
      shimmer.addColorStop(0.5, `rgba(255, 210, 100, ${shimmerAlpha})`);
      shimmer.addColorStop(1, 'rgba(255, 210, 100, 0)');
      ctx.fillStyle = shimmer;
      ctx.fillRect(0, h * 0.60, w, h * 0.08);

      // === Bottom vignette for text readability ===
      const vign = ctx.createLinearGradient(0, h * 0.5, 0, h);
      vign.addColorStop(0, 'rgba(5,12,5,0)');
      vign.addColorStop(1, 'rgba(5,12,5,0.72)');
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
    <div className="min-h-screen bg-[#050C05] text-[#F2EFE7] overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500;1,700&family=Inter:wght@300;400;500;600&display=swap');
        .grove-serif { font-family: 'Playfair Display', serif; }
        @keyframes grove-up { from { opacity:0; transform: translateY(22px); } to { opacity:1; transform: translateY(0); } }
        .g-a1 { animation: grove-up 0.9s 0.1s ease forwards; opacity:0; }
        .g-a2 { animation: grove-up 0.9s 0.28s ease forwards; opacity:0; }
        .g-a3 { animation: grove-up 0.9s 0.46s ease forwards; opacity:0; }
        .g-a4 { animation: grove-up 0.9s 0.64s ease forwards; opacity:0; }
        .grove-btn-primary { transition: background 0.2s, transform 0.15s; }
        .grove-btn-primary:hover { background: #4ade80 !important; transform: translateY(-1px); }
      `}} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Leaf className="w-4 h-4 text-[#4ade80]" />
          <span className="grove-serif text-xl font-semibold tracking-wide text-[#F2EFE7]">GROVE</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-xs tracking-widest uppercase text-[#F2EFE7]/45 font-light">
          <a href="#" className="hover:text-[#4ade80] transition-colors">Shop</a>
          <a href="#" className="hover:text-[#4ade80] transition-colors">Sourcing</a>
          <a href="#" className="hover:text-[#4ade80] transition-colors">Boxes</a>
          <a href="#" className="hover:text-[#4ade80] transition-colors">About</a>
        </div>
        <button className="border border-[#4ade80]/40 text-[#4ade80] px-5 py-2.5 text-xs tracking-widest uppercase font-medium hover:bg-[#4ade80]/10 transition-colors rounded-full">
          Get Your Box
        </button>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <canvas ref={bgCanvasRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }} />

        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-8 g-a1">
            <div className="w-5 h-px bg-[#4ade80]/60" />
            <span className="text-[#4ade80] text-xs tracking-[0.35em] uppercase font-medium">Farm-to-Door · Weekly Harvest</span>
            <div className="w-5 h-px bg-[#4ade80]/60" />
          </div>

          {/* Headline */}
          <h1 className="grove-serif text-6xl md:text-7xl lg:text-[90px] leading-[1.0] text-[#F2EFE7] mb-8 g-a2">
            The Freshest Produce<br />
            <em className="text-[#F5C842]">Straight from the Field</em>
          </h1>

          {/* Sub */}
          <p className="text-[#F2EFE7]/55 text-lg font-light leading-relaxed max-w-lg mb-12 g-a3">
            Seasonal boxes curated from regenerative farms — harvested Monday, at your door Thursday. No cold storage. No compromise.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 g-a4">
            <button
              className="grove-btn-primary bg-[#22c55e] text-[#050C05] px-9 py-4 text-sm font-semibold rounded-full flex items-center gap-2.5"
            >
              Build Your Box <ArrowRight className="w-4 h-4" />
            </button>
            <button className="border border-[#F2EFE7]/15 text-[#F2EFE7]/60 px-8 py-4 text-sm font-light rounded-full hover:border-[#F2EFE7]/30 transition-colors">
              See This Week's Harvest
            </button>
          </div>
        </div>

        {/* Social proof strip */}
        <div className="absolute bottom-10 left-0 right-0 z-10 flex justify-center">
          <div className="bg-white/5 backdrop-blur-sm border border-white/8 px-6 py-3 flex items-center gap-4 rounded-full">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-[#F5C842] text-[#F5C842]" />)}
            </div>
            <span className="text-[#F2EFE7]/60 text-xs font-light">4.9 · 12,000+ households weekly</span>
            <div className="w-px h-4 bg-white/15" />
            <span className="text-[#4ade80] text-xs font-medium">Free delivery on first box</span>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-14 px-8 bg-[#070F07] border-y border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: '48h', sub: 'Farm to door' },
            { num: '60+', sub: 'Partner farms' },
            { num: '0', sub: 'Cold storage days' },
            { num: '100%', sub: 'Seasonal produce' },
          ].map((s, i) => (
            <div key={i}>
              <div className="grove-serif text-4xl text-[#F5C842] mb-1">{s.num}</div>
              <div className="text-[#F2EFE7]/35 text-xs tracking-widest uppercase">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Box tiers */}
      <section className="py-24 px-8 bg-[#050C05]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <p className="text-[#4ade80] text-xs tracking-[0.3em] uppercase mb-3">Choose Your Harvest</p>
            <h2 className="grove-serif text-4xl text-[#F2EFE7]">Weekly Boxes</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { title: 'The Essentials',   price: '£26', desc: 'A curated mix of 8 seasonal vegetables and 4 fruits — enough for 2 people for the week.',    tag: 'Best for couples' },
              { title: 'The Family Box',   price: '£44', desc: '15 varieties of seasonal produce, sourced from within 80 miles of your doorstep.',           tag: 'Most popular', highlight: true },
              { title: 'The Chef\'s Selection', price: '£62', desc: 'Rare heirloom varieties, edible flowers, and microgreens chosen by our farm partners.', tag: 'Chef favourite' },
            ].map((box, i) => (
              <div key={i} className={`p-8 border rounded-xl transition-colors relative ${
                box.highlight
                  ? 'border-[#22c55e]/40 bg-[#0A1A0A]'
                  : 'border-white/6 bg-[#070F07] hover:border-[#22c55e]/20'
              }`}>
                {box.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#22c55e] text-[#050C05] text-[10px] font-bold tracking-widest uppercase px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <p className="text-[#4ade80]/70 text-[10px] tracking-widest uppercase mb-4">{box.tag}</p>
                <h3 className="grove-serif text-2xl text-[#F2EFE7] mb-1">{box.title}</h3>
                <div className="text-[#F5C842] text-3xl font-light mb-5">{box.price}<span className="text-sm text-[#F2EFE7]/30 font-light">/week</span></div>
                <p className="text-[#F2EFE7]/40 text-sm leading-relaxed mb-7">{box.desc}</p>
                <button className={`w-full py-3 text-sm font-medium rounded-lg transition-colors ${
                  box.highlight
                    ? 'bg-[#22c55e] text-[#050C05] hover:bg-[#4ade80]'
                    : 'border border-white/10 text-[#F2EFE7]/60 hover:border-[#22c55e]/40 hover:text-[#4ade80]'
                }`}>
                  Choose This Box
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-20 px-8 bg-gradient-to-r from-[#0D2A0D] to-[#1A4A1A] border-t border-[#22c55e]/15">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#4ade80] text-xs tracking-[0.3em] uppercase mb-5">Zero risk</p>
          <h2 className="grove-serif text-4xl md:text-5xl text-[#F2EFE7] mb-6">Your First Box Ships Free</h2>
          <p className="text-[#F2EFE7]/55 text-base mb-10 font-light">Pause or cancel any time. No contract, no commitment — just the best produce you've ever tasted.</p>
          <button className="bg-[#22c55e] text-[#050C05] px-10 py-4 font-semibold text-sm rounded-full hover:bg-[#4ade80] transition-colors inline-flex items-center gap-2.5">
            Start Your Free Box <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <footer className="py-10 px-8 bg-[#030803] text-center text-[#F2EFE7]/18 text-xs tracking-widest uppercase">
        © {new Date().getFullYear()} GROVE · Regenerative Farming Network
      </footer>
    </div>
  );
}
