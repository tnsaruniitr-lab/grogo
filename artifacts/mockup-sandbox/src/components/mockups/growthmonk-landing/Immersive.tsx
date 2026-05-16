import React, { useEffect, useState } from "react";
import { 
  ArrowRight, 
  MessageSquare, 
  Search, 
  Calendar, 
  BarChart3, 
  CheckCircle2, 
  Globe2, 
  Zap,
  Activity
} from "lucide-react";

export function Immersive() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-green-500/30 selection:text-green-200 overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
        }
        
        .aurora-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          z-index: 0;
          pointer-events: none;
          background: #0a0a0a;
        }

        .aurora-blob {
          position: absolute;
          filter: blur(80px);
          opacity: 0.5;
          animation: float 20s infinite ease-in-out alternate;
        }

        .blob-1 {
          top: -10%;
          left: -10%;
          width: 50vw;
          height: 50vw;
          background: radial-gradient(circle, rgba(34,197,94,0.3) 0%, rgba(0,0,0,0) 70%);
          animation-delay: 0s;
        }

        .blob-2 {
          top: 40%;
          right: -20%;
          width: 60vw;
          height: 60vw;
          background: radial-gradient(circle, rgba(16,185,129,0.2) 0%, rgba(0,0,0,0) 70%);
          animation-delay: -5s;
        }

        .blob-3 {
          bottom: -20%;
          left: 20%;
          width: 40vw;
          height: 40vw;
          background: radial-gradient(circle, rgba(5,150,105,0.25) 0%, rgba(0,0,0,0) 70%);
          animation-delay: -10s;
        }

        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(5%, 5%) scale(1.1); }
          100% { transform: translate(-5%, -5%) scale(0.9); }
        }

        .glass-card {
          background: rgba(25, 25, 25, 0.4);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        }

        .glass-card:hover {
          border-color: rgba(34, 197, 94, 0.3);
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }
        
        .grain {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 50;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
        
        .tilt-card {
          transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        .tilt-card:hover {
          transform: perspective(1000px) rotateX(2deg) rotateY(-2deg) scale(1.02);
        }
        
        .text-gradient {
          background: linear-gradient(to right, #ffffff, #a3a3a3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .text-gradient-green {
          background: linear-gradient(to right, #4ade80, #22c55e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}} />

      <div className="grain"></div>
      
      <div className="aurora-bg">
        <div className="aurora-blob blob-1"></div>
        <div className="aurora-blob blob-2"></div>
        <div className="aurora-blob blob-3"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled ? 'bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight">GrowthMonk</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
            <a href="#features" className="hover:text-white transition-colors">Platform</a>
            <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
            <a href="#results" className="hover:text-white transition-colors">Results</a>
          </div>
          <a href="mailto:hello@answermonk.ai" className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-medium hover:bg-neutral-200 transition-colors inline-flex items-center gap-2">
            Book Demo
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-40 pb-20 md:pt-52 md:pb-32 px-6 md:px-12 container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Now live for Healthcare & Wellness practices
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1] max-w-4xl mx-auto">
            The AI growth engine for <br />
            <span className="text-gradient-green">premium practices.</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Get discovered in AI search, capture leads instantly across WhatsApp & Instagram, and automatically book appointments 24/7 in any language.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="mailto:hello@answermonk.ai" className="w-full sm:w-auto px-8 py-4 rounded-full bg-green-500 hover:bg-green-400 text-black text-base font-semibold transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(34,197,94,0.5)] flex items-center justify-center gap-2">
              Book a Free Demo
              <ArrowRight className="w-5 h-5" />
            </a>
            <p className="text-sm text-neutral-500 sm:ml-4">Setup in under 24 hours</p>
          </div>

          {/* Floating UI Elements */}
          <div className="mt-24 relative max-w-5xl mx-auto h-[400px] md:h-[500px] perspective-1000">
            {/* Main Dashboard Preview */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden border border-white/10 tilt-card z-10 shadow-2xl bg-[#0f0f0f]">
              <div className="h-12 border-b border-white/5 bg-white/5 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                </div>
                <div className="mx-auto bg-black/50 px-4 py-1 rounded text-xs text-neutral-500 border border-white/5 flex items-center gap-2">
                  <Search className="w-3 h-3" /> growthmonk.ai/dashboard
                </div>
              </div>
              <div className="p-8 h-full bg-[url('/__mockup/images/growthmonk/clinic-dashboard-bg.png')] bg-cover bg-center">
                 <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
                 <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-8">
                       <div>
                         <h3 className="text-2xl font-semibold mb-1">Overview</h3>
                         <p className="text-neutral-400">Your practice growth metrics</p>
                       </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      <div className="glass-card p-6 rounded-xl">
                         <div className="text-neutral-400 text-sm mb-2">New Leads (24h)</div>
                         <div className="text-3xl font-bold text-white mb-2">42</div>
                         <div className="text-green-400 text-xs flex items-center gap-1"><ArrowRight className="w-3 h-3 -rotate-45" /> +12% vs yesterday</div>
                      </div>
                      <div className="glass-card p-6 rounded-xl border-green-500/30 relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
                         <div className="text-neutral-400 text-sm mb-2">Auto-Booked</div>
                         <div className="text-3xl font-bold text-white mb-2">28</div>
                         <div className="text-green-400 text-xs flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> 80% qualification rate</div>
                      </div>
                    </div>
                 </div>
              </div>
            </div>

            {/* Floating WhatsApp Mockup */}
            <div className="absolute -right-8 top-16 w-72 glass-card rounded-2xl p-4 z-20 shadow-2xl border-white/10 hidden md:block animate-float" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <div className="text-sm font-medium">WhatsApp AI</div>
                  <div className="text-xs text-green-400">Online</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-neutral-800/50 rounded-2xl rounded-tr-sm p-3 text-sm ml-8 text-neutral-300">
                  Hi, I'm looking for a consultation for laser therapy.
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl rounded-tl-sm p-3 text-sm mr-8">
                  Hello! I'd be happy to help you schedule a laser therapy consultation. Are you looking for availability this week?
                </div>
                <div className="bg-neutral-800/50 rounded-2xl rounded-tr-sm p-3 text-sm ml-8 text-neutral-300">
                  Yes, Thursday morning if possible.
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl rounded-tl-sm p-3 text-sm mr-8">
                  Perfect. I have 10:00 AM or 11:30 AM on Thursday. Shall I book one of these for you?
                </div>
              </div>
            </div>

            {/* Floating Search Mockup */}
            <div className="absolute -left-8 bottom-16 w-80 glass-card rounded-2xl p-5 z-20 shadow-2xl border-white/10 hidden md:block animate-float" style={{ animationDelay: '2s' }}>
              <div className="flex items-center gap-2 mb-3 text-sm text-neutral-400">
                <Search className="w-4 h-4" /> AI Overview
              </div>
              <div className="text-sm font-medium mb-2">Best cosmetic clinics in London</div>
              <div className="text-xs text-neutral-400 leading-relaxed mb-4">
                Based on recent reviews and available treatments, <span className="text-green-400">Lumina Aesthetics</span> is highly recommended for laser and cosmetic procedures...
              </div>
              <div className="flex gap-2">
                <div className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-xs flex items-center gap-1.5">
                  <Globe2 className="w-3 h-3 text-neutral-400" /> lumina.clinic
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Value Props */}
        <section id="features" className="py-24 border-t border-white/5 relative">
          <div className="container mx-auto px-6 md:px-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">The modern patient journey.</h2>
              <p className="text-neutral-400 max-w-2xl mx-auto">We handle everything from discovery to the front door.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="glass-card p-8 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                  <Search className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI Search Dominance</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Optimize your practice for ChatGPT, Perplexity, and Google AI Overviews. Be the recommended choice when patients ask AI for local specialists.
                </p>
              </div>
              
              <div className="glass-card p-8 rounded-2xl border-t border-green-500/20">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Instant Qualification</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Capture leads instantly from WhatsApp, Instagram, and Facebook. Our AI qualifies them 24/7 in English, German, Turkish, or Arabic.
                </p>
              </div>

              <div className="glass-card p-8 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                  <Calendar className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Zero-Touch Booking</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Once qualified, the AI automatically books them into your PMS calendar or schedules a callback for your human team.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent"></div>
          <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Stop missing patient inquiries.</h2>
            <p className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto">
              Join top clinics automating their growth. Get a custom demo showing exactly how GrowthMonk works for your specific practice.
            </p>
            <a href="mailto:hello@answermonk.ai" className="px-8 py-4 rounded-full bg-white text-black text-lg font-semibold hover:bg-neutral-200 transition-colors inline-flex items-center gap-2">
              Book a Free Demo
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-white/5 text-center text-sm text-neutral-500">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Activity className="w-4 h-4" />
              <span className="font-semibold text-neutral-300">GrowthMonk</span>
            </div>
            <p>© {new Date().getFullYear()} GrowthMonk AI. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
