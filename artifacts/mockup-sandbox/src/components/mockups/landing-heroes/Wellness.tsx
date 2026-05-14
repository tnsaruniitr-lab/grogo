import React from 'react';
import './_wellness.css';
import { ArrowRight, Wind, Music, Sparkles, Sprout } from 'lucide-react';

export function Wellness() {
  return (
    <div className="wellness-theme min-h-screen relative w-full selection:bg-[#2d6e6e] selection:text-[#f0ede6]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-[#e8efe8]/90 backdrop-blur-md text-[#0d1f1a]">
        <div className="text-xl tracking-[0.2em] font-light wellness-heading">
          SŌMA WELLNESS
        </div>
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
        {/* Animated Background Blobs */}
        <div className="blob-1" />
        <div className="blob-2" />
        
        {/* Grain Overlay for Texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />

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
          <div className="text-[#8fa88f] tracking-[0.2em] uppercase text-xs">
            — SŌMA Philosophy
          </div>
        </div>
      </section>

      {/* Retreat Highlight */}
      <section className="py-24 px-6 bg-[#0d1f1a]">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl overflow-hidden relative min-h-[500px] flex items-end p-8 md:p-16 group">
            {/* Gradient background serving as image placeholder */}
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
