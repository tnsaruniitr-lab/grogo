import React, { useEffect, useRef } from 'react';
import './_wellness.css';
import { ArrowRight, Wind, Music, Sparkles, Sprout } from 'lucide-react';

export function Wellness() {
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);

  // Flowing mist / water-caustic canvas animation
  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;
    let t = 0;

    interface MistBlob { x: number; y: number; r: number; vx: number; vy: number; alpha: number; alphaDelta: number; color: string; }
    let blobs: MistBlob[] = [];
    const palette = ['#1a4a35', '#2d6e6e', '#3a7a5a', '#0d3d2e', '#4a8f6e', '#1f5c5c'];

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };

    const initBlobs = () => {
      blobs = [];
      const w = canvas.offsetWidth, h = canvas.offsetHeight;
      // Large drifting mist masses
      for (let i = 0; i < 12; i++) {
        blobs.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 380 + 150,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.08,
          alpha: Math.random() * 0.28 + 0.08,
          alphaDelta: (Math.random() - 0.5) * 0.0006,
          color: palette[Math.floor(Math.random() * palette.length)],
        });
      }
      // Smaller shimmer spots for caustic water feel
      for (let i = 0; i < 20; i++) {
        blobs.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 80 + 20,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.2,
          alpha: Math.random() * 0.15 + 0.03,
          alphaDelta: (Math.random() - 0.5) * 0.002,
          color: palette[Math.floor(Math.random() * palette.length)],
        });
      }
    };

    const hexAlpha = (a: number) => Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, '0');

    const animate = () => {
      const w = canvas.offsetWidth, h = canvas.offsetHeight;

      // Deep forest base
      ctx.fillStyle = '#0d1f1a';
      ctx.fillRect(0, 0, w, h);

      // Subtle horizontal banding — like shafts of light through forest
      const bandGrd = ctx.createLinearGradient(0, 0, 0, h);
      bandGrd.addColorStop(0,    'rgba(30,80,55,0.0)');
      bandGrd.addColorStop(0.25, `rgba(30,80,55,${0.06 + 0.04 * Math.sin(t * 0.5)})`);
      bandGrd.addColorStop(0.5,  'rgba(20,60,45,0.03)');
      bandGrd.addColorStop(0.75, `rgba(45,110,110,${0.04 + 0.03 * Math.sin(t * 0.3 + 1)})`);
      bandGrd.addColorStop(1,    'rgba(13,31,26,0.0)');
      ctx.fillStyle = bandGrd;
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = 'screen';

      for (const b of blobs) {
        const grd = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        grd.addColorStop(0,   `${b.color}${hexAlpha(b.alpha)}`);
        grd.addColorStop(0.5, `${b.color}${hexAlpha(b.alpha * 0.35)}`);
        grd.addColorStop(1,   `${b.color}00`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();

        b.x += b.vx;
        b.y += b.vy;
        b.alpha += b.alphaDelta;
        if (b.alpha > 0.36) b.alphaDelta = -Math.abs(b.alphaDelta);
        if (b.alpha < 0.02) b.alphaDelta = Math.abs(b.alphaDelta);
        if (b.x < -b.r) b.x = w + b.r;
        if (b.x > w + b.r) b.x = -b.r;
        if (b.y < -b.r) b.y = h + b.r;
        if (b.y > h + b.r) b.y = -b.r;
      }

      ctx.globalCompositeOperation = 'source-over';
      t += 0.016;
      animId = requestAnimationFrame(animate);
    };

    resize();
    initBlobs();
    animate();
    const onResize = () => { resize(); initBlobs(); };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <div className="wellness-theme min-h-screen relative w-full selection:bg-[#2d6e6e] selection:text-[#f0ede6]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-[#e8efe8]/90 backdrop-blur-md text-[#0d1f1a]">
        <div className="text-xl tracking-[0.2em] font-light wellness-heading">SŌMA WELLNESS</div>
        <div className="hidden md:flex items-center gap-8 text-sm tracking-widest uppercase font-light">
          <a href="#" className="hover:text-[#2d6e6e] transition-colors">Practices</a>
          <a href="#" className="hover:text-[#2d6e6e] transition-colors">Retreats</a>
          <a href="#" className="hover:text-[#2d6e6e] transition-colors">About</a>
          <a href="#" className="hover:text-[#2d6e6e] transition-colors">Membership</a>
        </div>
        <button className="bg-[#2d6e6e] text-[#f0ede6] px-6 py-2.5 rounded-full text-sm tracking-wider uppercase font-light hover:bg-[#1f4d4d] transition-colors">
          Book a Session
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
        {/* Flowing mist / water-caustic canvas */}
        <canvas
          ref={bgCanvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 0 }}
        />
        {/* Forest-floor vignette overlay */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(13,31,26,0.0) 20%, rgba(13,31,26,0.72) 100%)',
          zIndex: 1
        }} />

        {/* Animated morphing blobs above canvas for extra organic depth */}
        <div className="blob-1" style={{ zIndex: 2 }} />
        <div className="blob-2" style={{ zIndex: 2 }} />

        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto hero-text-anim">
          <h1 className="wellness-heading-italic text-6xl md:text-[80px] leading-tight mb-6 text-[#f0ede6] hero-title-pulse">
            Find Your Still
          </h1>
          <p className="text-lg md:text-xl font-light text-[#8fa88f] mb-12 max-w-lg tracking-wide">
            Guided practices for mind, body and breath.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <button className="bg-[#2d6e6e] text-[#f0ede6] px-8 py-4 rounded-full text-sm tracking-wider uppercase font-light hover:bg-[#1f4d4d] transition-all transform hover:-translate-y-1">
              Explore Practices
            </button>
            <button className="border border-[#6b8f6b] text-[#f0ede6] px-8 py-4 rounded-full text-sm tracking-wider uppercase font-light hover:bg-[#6b8f6b]/10 transition-all transform hover:-translate-y-1">
              View Retreats
            </button>
          </div>
        </div>
      </section>

      {/* Practice Pillars */}
      <section className="py-24 px-6 relative z-10 bg-[#0d1f1a]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Sprout, title: "Yoga", desc: "Movement as meditation." },
            { icon: Sparkles, title: "Meditation", desc: "Cultivate inner silence." },
            { icon: Music, title: "Sound Healing", desc: "Vibrational restoration." },
            { icon: Wind, title: "Breathwork", desc: "Conscious respiration." }
          ].map((pillar, i) => (
            <div key={i} className="bg-[#e8efe8] p-10 rounded-2xl flex flex-col items-center text-center text-[#0d1f1a] hover:bg-[#f0ede6] transition-colors cursor-pointer group">
              <div className="w-16 h-16 rounded-full bg-[#6b8f6b]/20 flex items-center justify-center mb-6 text-[#2d6e6e] group-hover:scale-110 transition-transform duration-500">
                <pillar.icon strokeWidth={1} size={32} />
              </div>
              <h3 className="wellness-heading text-2xl mb-3">{pillar.title}</h3>
              <p className="font-light text-[#0d1f1a]/70 text-sm">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-32 px-6 bg-[#152920] relative text-center flex flex-col items-center justify-center">
        <div className="max-w-4xl mx-auto">
          <p className="wellness-heading-italic text-4xl md:text-5xl text-[#6b8f6b] leading-relaxed mb-8">
            "The body is not a machine. It is a garden."
          </p>
          <div className="text-[#8fa88f] tracking-[0.2em] uppercase text-xs">— SŌMA Philosophy</div>
        </div>
      </section>

      {/* Retreat Highlight */}
      <section className="py-24 px-6 bg-[#0d1f1a]">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl overflow-hidden relative min-h-[500px] flex items-end p-8 md:p-16 group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#2d6e6e] to-[#152920] transition-transform duration-1000 group-hover:scale-105" />
            <div className="relative z-10 w-full flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <div className="text-[#c4875a] tracking-widest uppercase text-xs mb-4">Upcoming Retreat</div>
                <h2 className="wellness-heading text-4xl md:text-5xl text-[#f0ede6] mb-4">Bali Silent Retreat</h2>
                <div className="flex items-center gap-4 text-[#8fa88f] font-light text-sm">
                  <span>March 2025</span>
                  <span className="w-1 h-1 rounded-full bg-[#6b8f6b]"></span>
                  <span>7 Nights</span>
                </div>
              </div>
              <button className="flex items-center gap-3 bg-[#f0ede6] text-[#0d1f1a] px-8 py-4 rounded-full text-sm tracking-wider uppercase font-medium hover:bg-white transition-colors shrink-0 w-fit">
                Join the Waitlist <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / CTA */}
      <footer className="bg-[#c4875a] py-24 px-6 text-[#f0ede6] text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="wellness-heading-italic text-5xl mb-6">Begin Your Practice Today</h2>
          <p className="font-light text-[#f0ede6]/80 mb-10">
            Join our community to receive gentle guidance, retreat announcements, and weekly contemplations.
          </p>
          <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-transparent border-b border-[#f0ede6]/30 px-4 py-3 text-[#f0ede6] placeholder:text-[#f0ede6]/50 focus:outline-none focus:border-[#f0ede6] transition-colors font-light"
            />
            <button className="bg-[#0d1f1a] text-[#f0ede6] px-8 py-4 rounded-full text-sm tracking-wider uppercase font-light hover:bg-[#152920] transition-colors">
              Subscribe
            </button>
          </form>
          <div className="mt-24 pt-8 border-t border-[#f0ede6]/20 flex flex-col md:flex-row items-center justify-between gap-6 text-xs tracking-widest uppercase font-light text-[#f0ede6]/60">
            <div>© 2025 SŌMA WELLNESS</div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-[#f0ede6] transition-colors">Instagram</a>
              <a href="#" className="hover:text-[#f0ede6] transition-colors">Spotify</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
