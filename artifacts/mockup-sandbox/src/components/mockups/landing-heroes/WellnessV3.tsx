import React from 'react';
import { Leaf, ArrowRight } from 'lucide-react';

// TĒRA — Video background version. AI-generated forest meditation footage.
// Full-bleed video with deep green/earth overlay. Immersive, grounding.
export function WellnessV3() {
  return (
    <div className="min-h-screen bg-[#0D1209] text-[#EBE5DA] overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@300;400;500&display=swap');
        .tera3-serif { font-family: 'EB Garamond', serif; }
        @keyframes t3fade { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .t3-1 { animation: t3fade 1.1s 0.1s ease forwards; opacity:0; }
        .t3-2 { animation: t3fade 1.1s 0.3s ease forwards; opacity:0; }
        .t3-3 { animation: t3fade 1.1s 0.5s ease forwards; opacity:0; }
        .t3-4 { animation: t3fade 1.1s 0.7s ease forwards; opacity:0; }
      `}} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#EBE5DA]">
          <Leaf strokeWidth={1.5} className="w-5 h-5 text-[#8BAF6A]" />
          <span className="tera3-serif text-xl tracking-[0.12em]">TĒRA</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm tracking-widest text-[#EBE5DA]/50 font-light uppercase">
          <a href="#" className="hover:text-[#8BAF6A] transition-colors">Studio</a>
          <a href="#" className="hover:text-[#8BAF6A] transition-colors">Practices</a>
          <a href="#" className="hover:text-[#8BAF6A] transition-colors">Retreats</a>
          <a href="#" className="hover:text-[#8BAF6A] transition-colors">Community</a>
        </div>
        <button className="border border-[#8BAF6A]/50 text-[#8BAF6A] px-5 py-2 text-xs tracking-[0.2em] uppercase hover:bg-[#8BAF6A]/10 transition-colors">
          Begin Today
        </button>
      </nav>

      {/* Hero — full-bleed video, text at bottom */}
      <section className="relative h-screen flex flex-col justify-end overflow-hidden">
        {/* AI-generated video */}
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.5) saturate(1.1)' }}
        >
          <source src="/__mockup/videos/wellness-meditation.mp4" type="video/mp4" />
        </video>

        {/* Layered overlays — deep green tones from nature scene */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1209]/90 via-[#0D1209]/30 to-[#0D1209]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1209]/60 to-transparent" />

        {/* Hero text — bottom left */}
        <div className="relative z-10 px-8 md:px-16 pb-20">
          <p className="text-[#8BAF6A] text-xs tracking-[0.4em] uppercase mb-6 t3-1">
            Earth · Breath · Stillness
          </p>
          <h1 className="tera3-serif text-6xl md:text-[78px] lg:text-[90px] leading-[1.0] text-[#EBE5DA] mb-8 t3-2">
            Return to<br />
            <em>Stillness</em>
          </h1>
          <p className="text-[#EBE5DA]/55 text-lg font-light leading-relaxed max-w-lg mb-10 t3-3">
            A living sanctuary for movement, breathwork and ancient practice. Your body already knows the way home.
          </p>
          <div className="flex gap-5 t3-4">
            <button className="bg-[#8BAF6A] text-[#0D1209] px-8 py-4 text-xs tracking-[0.2em] uppercase font-medium flex items-center gap-2 group hover:bg-[#A2C47E] transition-colors">
              Explore Practices <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border border-[#EBE5DA]/20 text-[#EBE5DA]/70 px-8 py-4 text-xs tracking-[0.2em] uppercase font-light hover:border-[#EBE5DA]/40 transition-colors">
              Book Retreat
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute right-8 bottom-16 z-10 flex flex-col items-center gap-2 text-[#EBE5DA]/30">
          <div className="h-12 w-px bg-[#EBE5DA]/20" />
          <span className="text-[10px] tracking-widest uppercase writing-mode-vertical" style={{ writingMode: 'vertical-rl' }}>Scroll</span>
        </div>
      </section>

      {/* Offering cards */}
      <section className="py-24 px-8 bg-[#0D1209]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <p className="text-[#8BAF6A] text-xs tracking-[0.3em] uppercase mb-3">Our Practices</p>
            <h2 className="tera3-serif text-4xl text-[#EBE5DA]">Ancient wisdom,<br /><em>modern life</em></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Yoga', styles: 'Yin · Vinyasa · Restorative · Ashtanga', desc: 'From energising flow to deep surrender — practices for every body and every season.' },
              { name: 'Breathwork', styles: 'Pranayama · Wim Hof · Holotropic', desc: 'The breath is the most powerful tool you already own. We teach you to use it.' },
              { name: 'Meditation', styles: 'Vipassana · Yoga Nidra · TM', desc: 'Silence is not the absence of sound — it is the presence of yourself.' },
              { name: 'Cacao Ceremony', styles: 'Ancestral · Plant Medicine', desc: 'Heart-opening circles rooted in Mesoamerican tradition.' },
              { name: 'Sound Bath', styles: 'Crystal · Tibetan · Gong', desc: 'Frequencies that dissolve tension and invite effortless stillness.' },
              { name: 'Cold Immersion', styles: 'Ice Bath · Wild Swimming', desc: 'Cultivate resilience, clarity and aliveness through nature\'s oldest medicine.' },
            ].map((p, i) => (
              <div key={i} className="border border-[#EBE5DA]/8 p-8 hover:border-[#8BAF6A]/30 group transition-colors">
                <h3 className="tera3-serif text-2xl text-[#EBE5DA] mb-1">{p.name}</h3>
                <p className="text-[#8BAF6A] text-xs tracking-wide mb-4">{p.styles}</p>
                <p className="text-[#EBE5DA]/40 text-sm leading-relaxed font-light">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Retreat feature */}
      <section className="py-0 bg-[#152010] border-y border-[#EBE5DA]/6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row">
          <div className="flex-1 p-16">
            <p className="text-[#8BAF6A] text-xs tracking-[0.3em] uppercase mb-6">Next Gathering</p>
            <h2 className="tera3-serif text-4xl md:text-5xl text-[#EBE5DA] mb-6 leading-tight">
              Oaxaca<br />
              <em>Deep Silence Retreat</em>
            </h2>
            <p className="text-[#EBE5DA]/45 font-light text-sm leading-relaxed max-w-md mb-8">
              Seven days of ceremonial silence, plant medicine, guided breathwork and yoga in the mountains of southern Mexico. Ten spaces only.
            </p>
            <button className="bg-[#8BAF6A] text-[#0D1209] px-8 py-4 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#A2C47E] transition-colors">
              Reserve Your Space
            </button>
          </div>
          <div className="flex-none w-px bg-[#EBE5DA]/6 hidden md:block" />
          <div className="flex-none p-16 flex flex-col justify-center gap-8 hidden md:flex">
            {[['7', 'Nights'], ['10', 'Spaces only'], ['3', 'Daily practices'], ['Mar', '2025']].map(([n, l], i) => (
              <div key={i} className="text-center">
                <div className="tera3-serif text-4xl text-[#8BAF6A]">{n}</div>
                <div className="text-[#EBE5DA]/35 text-xs tracking-widest uppercase mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-20 px-8 bg-[#8BAF6A]">
        <p className="tera3-serif italic text-4xl text-[#0D1209] text-center max-w-3xl mx-auto leading-relaxed">
          "You cannot buy stillness. You can only return to it."
        </p>
      </section>

      <footer className="py-10 px-8 bg-[#080D06] text-center text-[#EBE5DA]/20 text-xs tracking-widest uppercase">
        © {new Date().getFullYear()} TĒRA Wellness · London · Lisbon · Oaxaca
      </footer>
    </div>
  );
}
