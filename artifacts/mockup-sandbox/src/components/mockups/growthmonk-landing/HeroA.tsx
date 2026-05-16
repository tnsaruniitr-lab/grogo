import React from "react";
import { ChevronDown, Leaf, ArrowRight, Zap, Globe, MessageSquare } from "lucide-react";

export function HeroA() {
  return (
    <>
      <div 
        className="relative w-full h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-[#030712] font-jakarta"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes bounceSubtle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(5px); }
          }
          .animate-fade-up-1 { animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; opacity: 0; }
          .animate-fade-up-2 { animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards; opacity: 0; }
          .animate-fade-up-3 { animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards; opacity: 0; }
          .animate-fade-up-4 { animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.8s forwards; opacity: 0; }
          .animate-bounce-subtle { animation: bounceSubtle 2s infinite ease-in-out; }
          
          .text-glow {
            text-shadow: 0 2px 40px rgba(34, 197, 94, 0.25);
          }
        `}} />

        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#030712] to-[#081f10] z-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-70"
          >
            <source src="/__mockup/videos/forest-canopy-hero.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Radial Gradient Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none" 
             style={{ background: 'radial-gradient(circle at center, transparent 0%, rgba(3,7,18,0.85) 100%)' }} />

        {/* Top Nav / Logo */}
        <div className="absolute top-0 w-full p-8 flex justify-center z-20">
          <div className="flex items-center gap-2 text-white/90 font-extrabold text-2xl tracking-tight">
            <Leaf className="text-[#22C55E]" size={28} />
            GrowthMonk
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 mt-[-2rem]">
          {/* Eyebrow */}
          <div className="animate-fade-up-1 mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="text-[#22C55E] text-sm font-bold tracking-wider uppercase">AI-Powered · Healthcare & Wellness</span>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up-2 text-glow text-5xl md:text-7xl lg:text-[96px] leading-[1.05] font-black text-white tracking-tight mb-6 max-w-5xl">
            The AI Growth Engine <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">for Healthcare.</span>
          </h1>

          {/* Sub-headline */}
          <p className="animate-fade-up-3 text-lg md:text-xl text-white/80 max-w-[560px] leading-relaxed mb-10 font-medium">
            Get discovered in AI search. Capture leads on WhatsApp & Instagram. Qualify and book automatically — 24/7, in any language.
          </p>

          {/* CTA */}
          <div className="animate-fade-up-4 flex flex-col sm:flex-row gap-4 items-center">
            <a 
              href="mailto:hello@answermonk.ai" 
              className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#22C55E] text-black rounded-full font-bold text-lg md:text-xl transition-all duration-300 hover:scale-105 hover:brightness-110 hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10">Book a Free Demo</span>
              <ArrowRight size={24} className="relative z-10 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* Social Proof Strip */}
        <div className="absolute bottom-20 md:bottom-16 w-full px-6 flex justify-center z-10">
          <div className="animate-fade-up-4 flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-sm md:text-base text-white/60 font-semibold tracking-wide">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-[#22C55E]" />
              <span>80% leads qualified automatically</span>
            </div>
            <div className="hidden md:block w-[1px] h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              <MessageSquare size={18} className="text-[#22C55E]" />
              <span>&lt; 2 min response time</span>
            </div>
            <div className="hidden md:block w-[1px] h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              <Globe size={18} className="text-[#22C55E]" />
              <span>24-hr setup</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 flex flex-col items-center gap-2 z-10 animate-fade-up-4">
          <ChevronDown size={28} className="text-white/40 animate-bounce-subtle" />
        </div>
      </div>
    </>
  );
}
