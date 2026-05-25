import React, { useEffect, useRef } from 'react';
import { ArrowRight, Leaf, Star } from 'lucide-react';

// GROVE — Premium farm-to-door grocery. Canvas: living field at golden hour.
// Rich forest-green base with warm harvest gold bloom + floating seed particles.
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
      const w = canvas.offsetWidth || 1280;
      const h = canvas.offsetHeight || 800;
      canvas.width = w;
      canvas.height = h;
    };

    // 90 particles — fixed normalized positions, drift upward each frame
    const SEED_COUNT = 90;
    const px = Array.from({ length: SEED_COUNT }, (_, i) => (i * 137.508 * 1.618) % 1);
    const py = Array.from({ length: SEED_COUNT }, (_, i) => (i * 97.312 + 0.3) % 1);
    const pr = Array.from({ length: SEED_COUNT }, (_, i) => 1.2 + (i % 5) * 0.6);
    const pspeed = Array.from({ length: SEED_COUNT }, (_, i) => 0.00009 + (i % 7) * 0.00002);
    const pphase = Array.from({ length: SEED_COUNT }, (_, i) => i * 0.71);
    const palpha = Array.from({ length: SEED_COUNT }, (_, i) => 0.35 + (i % 5) * 0.12);
    const pwarm  = Array.from({ length: SEED_COUNT }, (_, i) => i % 3 === 0);

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) { t += 0.016; animId = requestAnimationFrame(animate); return; }

      // === Deep forest-green base ===
      ctx.fillStyle = '#0A1A08';
      ctx.fillRect(0, 0, w, h);

      // === Rich earth ambient — warm dark-green gradient from below ===
      const earth = ctx.createRadialGradient(w * 0.5, h * 1.05, 0, w * 0.5, h * 1.05, w * 0.9);
      earth.addColorStop(0,   'rgba(20, 60, 12, 0.85)');
      earth.addColorStop(0.5, 'rgba(12, 35, 8, 0.5)');
      earth.addColorStop(1,   'rgba(10, 26, 8, 0)');
      ctx.fillStyle = earth;
      ctx.fillRect(0, 0, w, h);

      // === Harvest sun bloom (upper-center) — strong, slow 12s breath ===
      const breathe = 0.80 + 0.20 * Math.sin(t * 0.52);
      const sx = w * 0.5, sy = h * 0.22;
      const sr = Math.min(w, h) * 0.60 * breathe;
      const sun = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
      sun.addColorStop(0,    `rgba(255, 210, 60,  ${0.65 * breathe})`);
      sun.addColorStop(0.15, `rgba(245, 175, 30,  ${0.45 * breathe})`);
      sun.addColorStop(0.35, `rgba(200, 130, 15,  ${0.25 * breathe})`);
      sun.addColorStop(0.6,  `rgba(130,  90,  8,  ${0.10})`);
      sun.addColorStop(1,    'rgba(10, 26, 8, 0)');
      ctx.fillStyle = sun;
      ctx.fillRect(0, 0, w, h);

      // === Secondary green-life bloom (lower-left) ===
      const lx = w * 0.12, ly = h * 0.75;
      const lr = Math.min(w, h) * 0.42;
      const life = ctx.createRadialGradient(lx, ly, 0, lx, ly, lr);
      life.addColorStop(0,   'rgba(34, 197, 94, 0.40)');
      life.addColorStop(0.4, 'rgba(22, 163, 74, 0.18)');
      life.addColorStop(1,   'rgba(10, 26, 8, 0)');
      ctx.fillStyle = life;
      ctx.fillRect(0, 0, w, h);

      // === Right-side cooler green bloom ===
      const rx = w * 0.88, ry = h * 0.55;
      const rr = Math.min(w, h) * 0.32;
      const right = ctx.createRadialGradient(rx, ry, 0, rx, ry, rr);
      right.addColorStop(0,   'rgba(16, 140, 60, 0.28)');
      right.addColorStop(0.5, 'rgba(10, 90, 40, 0.12)');
      right.addColorStop(1,   'rgba(10, 26, 8, 0)');
      ctx.fillStyle = right;
      ctx.fillRect(0, 0, w, h);

      // === Floating particles ===
      for (let i = 0; i < SEED_COUNT; i++) {
        py[i] -= pspeed[i];
        if (py[i] < -0.02) py[i] = 1.02;

        const cx2 = (px[i] + Math.sin(t * pspeed[i] * 1800 + pphase[i]) * 0.022) * w;
        const cy2 = py[i] * h;
        const heightBoost = 1 - py[i];
        const a = palpha[i] * (0.45 + 0.55 * heightBoost);

        ctx.fillStyle = pwarm[i]
          ? `rgba(255, 210, 80, ${a})`
          : `rgba(140, 240, 160, ${a})`;
        ctx.beginPath();
        ctx.arc(cx2, cy2, pr[i], 0, Math.PI * 2);
        ctx.fill();

        // Glow on larger particles
        if (pr[i] > 2.0) {
          const g = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, pr[i] * 5);
          g.addColorStop(0, pwarm[i] ? `rgba(255,200,60,${a * 0.4})` : `rgba(140,240,160,${a * 0.35})`);
          g.addColorStop(1, 'rgba(10,26,8,0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(cx2, cy2, pr[i] * 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // === Horizon shimmer ===
      const shimmerA = 0.07 + 0.05 * Math.sin(t * 0.9);
      const shimmer = ctx.createLinearGradient(0, h * 0.58, 0, h * 0.68);
      shimmer.addColorStop(0,   'rgba(255, 220, 100, 0)');
      shimmer.addColorStop(0.5, `rgba(255, 220, 100, ${shimmerA})`);
      shimmer.addColorStop(1,   'rgba(255, 220, 100, 0)');
      ctx.fillStyle = shimmer;
      ctx.fillRect(0, h * 0.58, w, h * 0.10);

      // === Bottom vignette for text readability ===
      const vign = ctx.createLinearGradient(0, h * 0.45, 0, h);
      vign.addColorStop(0, 'rgba(10,26,8,0)');
      vign.addColorStop(1, 'rgba(10,26,8,0.78)');
      ctx.fillStyle = vign;
      ctx.fillRect(0, 0, w, h);

      t += 0.016;
      animId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    // Small delay ensures canvas has painted dimensions in iframe
    const startId = setTimeout(() => { resize(); animate(); }, 60);

    return () => {
      clearTimeout(startId);
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0A1A08', color: '#F2EFE7', overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500;1,700&family=Inter:wght@300;400;500;600&display=swap');
        .grove-serif { font-family: 'Playfair Display', serif; }
        @keyframes grove-up { from { opacity:0; transform: translateY(22px); } to { opacity:1; transform: translateY(0); } }
        .g-a1 { animation: grove-up 0.9s 0.10s ease forwards; opacity:0; }
        .g-a2 { animation: grove-up 0.9s 0.28s ease forwards; opacity:0; }
        .g-a3 { animation: grove-up 0.9s 0.46s ease forwards; opacity:0; }
        .g-a4 { animation: grove-up 0.9s 0.64s ease forwards; opacity:0; }
      `}} />

      {/* Nav */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:50, padding:'20px 48px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <Leaf size={16} color="#4ade80" />
          <span className="grove-serif" style={{ fontSize:20, fontWeight:600, letterSpacing:'0.04em', color:'#F2EFE7' }}>GROVE</span>
        </div>
        <div style={{ display:'flex', gap:32, fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(242,239,231,0.4)', fontWeight:400 }}>
          <a href="#" style={{ textDecoration:'none', color:'inherit' }}>Shop</a>
          <a href="#" style={{ textDecoration:'none', color:'inherit' }}>Sourcing</a>
          <a href="#" style={{ textDecoration:'none', color:'inherit' }}>Boxes</a>
          <a href="#" style={{ textDecoration:'none', color:'inherit' }}>About</a>
        </div>
        <button style={{ border:'1px solid rgba(74,222,128,0.45)', color:'#4ade80', padding:'10px 22px', fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', fontWeight:500, borderRadius:999, background:'transparent', cursor:'pointer' }}>
          Get Your Box
        </button>
      </nav>

      {/* Hero */}
      <section style={{ position:'relative', minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
        <canvas ref={bgCanvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', zIndex:0, display:'block' }} />

        <div className="g-a1" style={{ position:'relative', zIndex:10, display:'flex', alignItems:'center', gap:10, marginBottom:32 }}>
          <div style={{ width:20, height:1, background:'rgba(74,222,128,0.6)' }} />
          <span style={{ color:'#4ade80', fontSize:11, letterSpacing:'0.35em', textTransform:'uppercase', fontWeight:500 }}>Farm-to-Door · Weekly Harvest</span>
          <div style={{ width:20, height:1, background:'rgba(74,222,128,0.6)' }} />
        </div>

        <div style={{ position:'relative', zIndex:10, display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', padding:'0 32px', maxWidth:900 }}>
          <h1 className="grove-serif g-a2" style={{ fontSize:'clamp(44px,7vw,90px)', fontWeight:700, lineHeight:1.02, letterSpacing:'-2px', color:'#F2EFE7', margin:'0 0 28px' }}>
            The Freshest Produce<br />
            <em style={{ color:'#F5C842', fontStyle:'italic' }}>Straight from the Field</em>
          </h1>

          <p className="g-a3" style={{ fontSize:19, lineHeight:1.65, color:'rgba(242,239,231,0.62)', maxWidth:520, marginBottom:44, fontWeight:400 }}>
            Seasonal boxes curated from regenerative farms — harvested Monday, at your door Thursday. No cold storage. No compromise.
          </p>

          <div className="g-a4" style={{ display:'flex', gap:14, flexWrap:'wrap', justifyContent:'center', marginBottom:56 }}>
            <button style={{ display:'inline-flex', alignItems:'center', gap:8, background:'#22c55e', color:'#0A1A08', padding:'15px 36px', borderRadius:999, fontWeight:700, fontSize:15, border:'none', cursor:'pointer' }}>
              Build Your Box <ArrowRight size={17} />
            </button>
            <button style={{ display:'inline-flex', alignItems:'center', gap:8, color:'rgba(242,239,231,0.55)', padding:'15px 28px', borderRadius:999, fontWeight:400, fontSize:15, border:'1px solid rgba(242,239,231,0.14)', background:'transparent', cursor:'pointer' }}>
              See This Week's Harvest
            </button>
          </div>
        </div>

        {/* Social proof strip */}
        <div style={{ position:'absolute', bottom:36, left:0, right:0, zIndex:10, display:'flex', justifyContent:'center' }}>
          <div style={{ background:'rgba(255,255,255,0.06)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.10)', padding:'12px 24px', display:'flex', alignItems:'center', gap:16, borderRadius:999 }}>
            <div style={{ display:'flex', gap:2 }}>
              {[1,2,3,4,5].map(i => <Star key={i} size={13} fill="#F5C842" color="#F5C842" />)}
            </div>
            <span style={{ color:'rgba(242,239,231,0.58)', fontSize:12, fontWeight:300 }}>4.9 · 12,000+ households weekly</span>
            <div style={{ width:1, height:16, background:'rgba(255,255,255,0.15)' }} />
            <span style={{ color:'#4ade80', fontSize:12, fontWeight:500 }}>Free delivery on first box</span>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ padding:'56px 32px', background:'#07120A', borderTop:'1px solid rgba(255,255,255,0.06)', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth:900, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:32, textAlign:'center' }}>
          {[
            { num:'48h',  sub:'Farm to door'       },
            { num:'60+',  sub:'Partner farms'      },
            { num:'0',    sub:'Cold storage days'  },
            { num:'100%', sub:'Seasonal produce'   },
          ].map((s, i) => (
            <div key={i}>
              <div className="grove-serif" style={{ fontSize:40, color:'#F5C842', marginBottom:4 }}>{s.num}</div>
              <div style={{ color:'rgba(242,239,231,0.35)', fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Box tiers */}
      <section style={{ padding:'80px 32px', background:'#0A1A08' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <p style={{ color:'#4ade80', fontSize:11, letterSpacing:'0.3em', textTransform:'uppercase', marginBottom:12 }}>Choose Your Harvest</p>
          <h2 className="grove-serif" style={{ fontSize:38, color:'#F2EFE7', marginBottom:48 }}>Weekly Boxes</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
            {[
              { title:'The Essentials',      price:'£26', desc:'8 seasonal veg + 4 fruits. Perfect for 2 people.',                              tag:'For couples',     hi:false },
              { title:'The Family Box',      price:'£44', desc:'15 varieties, sourced within 80 miles of your door.',                           tag:'Most popular',    hi:true  },
              { title:"The Chef's Pick",     price:'£62', desc:'Heirloom varieties, edible flowers + microgreens.',                             tag:"Chef's favourite", hi:false },
            ].map((box, i) => (
              <div key={i} style={{ padding:32, border:`1px solid ${box.hi ? 'rgba(34,197,94,0.45)' : 'rgba(255,255,255,0.08)'}`, borderRadius:16, background: box.hi ? '#0D2210' : '#07120A', position:'relative' }}>
                {box.hi && <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', background:'#22c55e', color:'#0A1A08', fontSize:9, fontWeight:800, letterSpacing:'0.1em', textTransform:'uppercase', padding:'4px 14px', borderRadius:999 }}>Most Popular</div>}
                <p style={{ color:'rgba(74,222,128,0.65)', fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:14 }}>{box.tag}</p>
                <h3 className="grove-serif" style={{ fontSize:22, color:'#F2EFE7', marginBottom:6 }}>{box.title}</h3>
                <div style={{ fontSize:32, color:'#F5C842', fontWeight:300, marginBottom:18 }}>{box.price}<span style={{ fontSize:13, color:'rgba(242,239,231,0.3)', fontWeight:300 }}>/week</span></div>
                <p style={{ color:'rgba(242,239,231,0.42)', fontSize:14, lineHeight:1.6, marginBottom:24 }}>{box.desc}</p>
                <button style={{ width:'100%', padding:'12px 0', fontSize:13, fontWeight:500, borderRadius:10, cursor:'pointer', background: box.hi ? '#22c55e' : 'transparent', color: box.hi ? '#0A1A08' : 'rgba(242,239,231,0.55)', border: box.hi ? 'none' : '1px solid rgba(255,255,255,0.12)' }}>
                  Choose This Box
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'72px 32px', background:'linear-gradient(135deg,#0D2A0D,#1A4A1A)', borderTop:'1px solid rgba(34,197,94,0.15)' }}>
        <div style={{ maxWidth:640, margin:'0 auto', textAlign:'center' }}>
          <p style={{ color:'#4ade80', fontSize:11, letterSpacing:'0.3em', textTransform:'uppercase', marginBottom:20 }}>Zero risk</p>
          <h2 className="grove-serif" style={{ fontSize:40, color:'#F2EFE7', marginBottom:20 }}>Your First Box Ships Free</h2>
          <p style={{ color:'rgba(242,239,231,0.55)', fontSize:16, fontWeight:300, lineHeight:1.7, marginBottom:36 }}>Pause or cancel any time. No contract — just the best produce you've ever tasted.</p>
          <button style={{ display:'inline-flex', alignItems:'center', gap:10, background:'#22c55e', color:'#0A1A08', padding:'16px 40px', borderRadius:999, fontWeight:700, fontSize:15, border:'none', cursor:'pointer' }}>
            Start Your Free Box <ArrowRight size={17} />
          </button>
        </div>
      </section>

      <footer style={{ padding:'36px 32px', background:'#040A04', textAlign:'center', color:'rgba(242,239,231,0.18)', fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase' }}>
        © {new Date().getFullYear()} GROVE · Regenerative Farming Network
      </footer>
    </div>
  );
}
