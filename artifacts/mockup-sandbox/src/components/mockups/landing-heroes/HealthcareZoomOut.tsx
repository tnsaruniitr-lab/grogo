import React from 'react';
import { ArrowRight } from 'lucide-react';

// GrowthMonk — AI-generated healthcare zoom-out video hero
// Single full-bleed video: slow pull-back from caregiver hands → care room
// Dark green/navy palette with warm amber undertone matching the footage

export function HealthcareZoomOut() {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      backgroundColor: '#030712',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      boxSizing: 'border-box',
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

        @keyframes hzo-rise  { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
        @keyframes hzo-glow  { 0%,100% { opacity:0.55; } 50% { opacity:1; } }
        @keyframes hzo-badge { from { opacity:0; transform:scale(0.92); } to { opacity:1; transform:scale(1); } }

        .hzo-i1 { animation: hzo-rise 0.95s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
        .hzo-i2 { animation: hzo-rise 0.95s cubic-bezier(0.16,1,0.3,1) 0.30s both; }
        .hzo-i3 { animation: hzo-rise 0.95s cubic-bezier(0.16,1,0.3,1) 0.45s both; }
        .hzo-i4 { animation: hzo-rise 0.95s cubic-bezier(0.16,1,0.3,1) 0.60s both; }
        .hzo-glow { animation: hzo-glow 2.5s ease-in-out infinite; }
        .hzo-badge { animation: hzo-badge 1s cubic-bezier(0.16,1,0.3,1) 0.8s both; }
      `}} />

      {/* Full-bleed video */}
      <video
        autoPlay muted loop playsInline
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      >
        <source src="/__mockup/videos/healthcare-caring-zoom-out.mp4" type="video/mp4" />
      </video>

      {/* Overlay — dark with warm undertone to complement the amber footage */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(3,7,18,0.82) 0%, rgba(8,18,10,0.45) 55%, rgba(3,7,18,0.80) 100%)' }} />

      {/* Warm amber bottom vignette — picks up the footage colour */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to top, rgba(3,7,18,0.75) 0%, transparent 100%)' }} />

      {/* Green ambient glow */}
      <div className="hzo-glow" style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '450px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(34,197,94,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

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
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 32px', maxWidth: '1040px', width: '100%' }}>

        {/* Eyebrow badge */}
        <div className="hzo-badge" style={{ marginBottom: '24px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.28)', color: '#4ade80', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '6px 16px', borderRadius: '100px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
            AI-Powered Care Automation
          </span>
        </div>

        {/* Headline */}
        <div className="hzo-i2" style={{ marginBottom: '26px' }}>
          <div style={{ fontSize: 'clamp(36px,7vw,96px)', fontWeight: 900, lineHeight: 1.03, letterSpacing: '-3px', color: 'white' }}>
            The AI Growth Engine
          </div>
          <div style={{ fontSize: 'clamp(36px,7vw,96px)', fontWeight: 900, lineHeight: 1.03, letterSpacing: '-3px' }}>
            <span style={{ color: 'white' }}>for </span>
            <span style={{ background: 'linear-gradient(90deg, #22c55e, #4ade80)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Healthcare</span>
          </div>
        </div>

        {/* Subtext */}
        <p className="hzo-i3" style={{ fontSize: '18px', lineHeight: 1.7, color: 'rgba(255,255,255,0.68)', maxWidth: '560px', marginBottom: '40px', fontWeight: 500 }}>
          Capture every enquiry, qualify leads automatically, and turn more conversations into booked consultations — 24/7 across WhatsApp, Instagram and web.
        </p>

        {/* CTAs */}
        <div className="hzo-i4" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#22c55e', color: '#030712', padding: '15px 34px', borderRadius: '100px', fontWeight: 800, fontSize: '16px', textDecoration: 'none', letterSpacing: '-0.2px', boxShadow: '0 0 48px rgba(34,197,94,0.32)' }}>
            Book a Free Demo <ArrowRight size={18} />
          </a>
          <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.60)', padding: '15px 28px', borderRadius: '100px', fontWeight: 600, fontSize: '16px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.14)' }}>
            See How It Works
          </a>
        </div>
      </div>
    </div>
  );
}
