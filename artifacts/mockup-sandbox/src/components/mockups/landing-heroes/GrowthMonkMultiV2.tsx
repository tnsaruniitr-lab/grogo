import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

// GrowthMonk Multi-Video Hero V2
// Cycles: care-compassion → wellness-meditation → medspa-treatment → dental-smile → physio-rehab
// Words cycle via React state (no CSS overlap): Healthcare → Clinics → Medspas → Wellness Centres

const WORDS = ['Healthcare', 'Clinics', 'Medspas', 'Wellness Centres'];
const HOLD_MS = 6000;
const FADE_MS = 450;

export function GrowthMonkMultiV2() {
  const [wordIdx, setWordIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      // fade out
      setVisible(false);
      timerRef.current = setTimeout(() => {
        // swap word, then fade back in
        setWordIdx(i => (i + 1) % WORDS.length);
        setVisible(true);
      }, FADE_MS);
    }, HOLD_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [wordIdx]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: '#030712', fontFamily: "'Plus Jakarta Sans', sans-serif", boxSizing: 'border-box' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

        @keyframes gmv2cfl1 { 0%{opacity:1} 17.5%{opacity:1} 20%{opacity:0} 97.5%{opacity:0} 100%{opacity:1} }
        @keyframes gmv2cfl2 { 0%{opacity:0} 17.5%{opacity:0} 20%{opacity:1} 37.5%{opacity:1} 40%{opacity:0} 100%{opacity:0} }
        @keyframes gmv2cfl3 { 0%{opacity:0} 37.5%{opacity:0} 40%{opacity:1} 57.5%{opacity:1} 60%{opacity:0} 100%{opacity:0} }
        @keyframes gmv2cfl4 { 0%{opacity:0} 57.5%{opacity:0} 60%{opacity:1} 77.5%{opacity:1} 80%{opacity:0} 100%{opacity:0} }
        @keyframes gmv2cfl5 { 0%{opacity:0} 77.5%{opacity:0} 80%{opacity:1} 97.5%{opacity:1} 100%{opacity:0} }

        @keyframes gmv2rise { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes gmv2glow { 0%,100%{opacity:0.65} 50%{opacity:1} }

        .gmv2-v1 { animation: gmv2cfl1 40s ease-in-out infinite; }
        .gmv2-v2 { animation: gmv2cfl2 40s ease-in-out infinite; }
        .gmv2-v3 { animation: gmv2cfl3 40s ease-in-out infinite; }
        .gmv2-v4 { animation: gmv2cfl4 40s ease-in-out infinite; }
        .gmv2-v5 { animation: gmv2cfl5 40s ease-in-out infinite; }
        .gmv2-i1 { animation: gmv2rise 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
        .gmv2-i2 { animation: gmv2rise 0.9s cubic-bezier(0.16,1,0.3,1) 0.25s both; }
        .gmv2-i3 { animation: gmv2rise 0.9s cubic-bezier(0.16,1,0.3,1) 0.4s both; }
        .gmv2-i4 { animation: gmv2rise 0.9s cubic-bezier(0.16,1,0.3,1) 0.55s both; }
        .gmv2-glow { animation: gmv2glow 2s ease-in-out infinite; }
      `}} />

      {/* Videos — 5 crossfading */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <video autoPlay muted loop playsInline className="gmv2-v1"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}>
          <source src="/__mockup/videos/care-compassion.mp4" type="video/mp4" />
        </video>
        <video autoPlay muted loop playsInline className="gmv2-v2"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0 }}>
          <source src="/__mockup/videos/wellness-meditation.mp4" type="video/mp4" />
        </video>
        <video autoPlay muted loop playsInline className="gmv2-v3"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0 }}>
          <source src="/__mockup/videos/medspa-treatment.mp4" type="video/mp4" />
        </video>
        <video autoPlay muted loop playsInline className="gmv2-v4"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0 }}>
          <source src="/__mockup/videos/dental-smile.mp4" type="video/mp4" />
        </video>
        <video autoPlay muted loop playsInline className="gmv2-v5"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0 }}>
          <source src="/__mockup/videos/physio-rehab.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Overlay */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(160deg, rgba(3,7,18,0.78) 0%, rgba(5,25,12,0.40) 50%, rgba(3,7,18,0.75) 100%)' }} />

      {/* Green ambient glow */}
      <div className="gmv2-glow" style={{ position: 'absolute', top: '35%', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '400px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(34,197,94,0.20) 0%, transparent 70%)', zIndex: 1, pointerEvents: 'none' }} />

      {/* Nav */}
      <nav style={{ position: 'absolute', top: 0, width: '100%', padding: '22px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 20, boxSizing: 'border-box' }}>
        <a href="#" style={{ fontWeight: 800, fontSize: '20px', letterSpacing: '-0.4px', textDecoration: 'none' }}>
          <span style={{ color: '#22c55e' }}>Growth</span><span style={{ color: 'white' }}>Monk</span>
        </a>
        <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          {['Features', 'How It Works', 'Industries', 'FAQ'].map(label => (
            <a key={label} href="#" style={{ color: 'rgba(255,255,255,0.60)', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>{label}</a>
          ))}
          <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#22c55e', color: '#030712', padding: '10px 22px', borderRadius: '100px', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>
            Book a Demo <ArrowRight size={14} />
          </a>
        </div>
      </nav>

      {/* Hero content */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 32px', maxWidth: '1100px', width: '100%' }}>

        {/* Headline */}
        <div className="gmv2-i2" style={{ marginBottom: '28px' }}>
          <div style={{ fontSize: 'clamp(38px,7.5vw,100px)', fontWeight: 900, lineHeight: 1.02, letterSpacing: '-3.5px', color: 'white', marginBottom: '0.04em' }}>
            The AI Growth Engine
          </div>
          <div style={{ fontSize: 'clamp(38px,7.5vw,100px)', fontWeight: 900, lineHeight: 1.02, letterSpacing: '-3.5px', display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '0.22em' }}>
            <span style={{ color: 'white' }}>for</span>
            {/* Rotating word — single word, fade via React state, no overlapping */}
            <span
              style={{
                background: 'linear-gradient(90deg, #22c55e, #4ade80)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                opacity: visible ? 1 : 0,
                transition: `opacity ${FADE_MS}ms ease`,
                whiteSpace: 'nowrap',
                display: 'inline-block',
              }}
            >
              {WORDS[wordIdx]}
            </span>
          </div>
        </div>

        {/* Subtext */}
        <p className="gmv2-i3" style={{ fontSize: '19px', lineHeight: 1.65, color: 'rgba(255,255,255,0.70)', maxWidth: '580px', marginBottom: '40px', fontWeight: 500 }}>
          Get discovered in AI search, capture every WhatsApp, website and social media lead, qualify leads automatically, and turn more enquiries into booked consultations - 24/7.
        </p>

        {/* CTAs */}
        <div className="gmv2-i4" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#22c55e', color: '#030712', padding: '15px 34px', borderRadius: '100px', fontWeight: 800, fontSize: '16px', textDecoration: 'none', letterSpacing: '-0.2px', boxShadow: '0 0 40px rgba(34,197,94,0.3)' }}>
            Book a Free Demo <ArrowRight size={18} />
          </a>
          <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.60)', padding: '15px 28px', borderRadius: '100px', fontWeight: 600, fontSize: '16px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)' }}>
            See How It Works
          </a>
        </div>
      </div>
    </div>
  );
}
