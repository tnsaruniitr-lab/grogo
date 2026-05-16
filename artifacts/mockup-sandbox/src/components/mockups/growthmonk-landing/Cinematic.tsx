import React, { useEffect, useRef, useState } from "react";
import { 
  Bot, 
  Search, 
  MessageCircle, 
  CalendarCheck, 
  BarChart3, 
  Globe2, 
  ArrowRight,
  Sparkles,
  Activity,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Stethoscope,
  HeartPulse
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Simple hook for intersection observer animations
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

const Reveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => {
  const { ref, isVisible } = useScrollReveal();
  
  return (
    <div 
      ref={ref}
      className={`transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export function Cinematic() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 selection:bg-green-500/30 selection:text-green-200 overflow-x-hidden font-sans">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        
        .font-jakarta {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        
        .text-glow {
          text-shadow: 0 0 40px rgba(34, 197, 94, 0.4);
        }
        
        .box-glow {
          box-shadow: 0 0 60px -15px rgba(34, 197, 94, 0.15);
        }

        .gradient-text {
          background: linear-gradient(to right, #ffffff, #86efac);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .hero-overlay {
          background: radial-gradient(circle at center, rgba(10,10,10,0.4) 0%, #0a0a0a 100%);
        }
      `}} />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden font-jakarta">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover opacity-40 scale-105"
            src="https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4"
          />
          <div className="absolute inset-0 bg-neutral-950/70 hero-overlay" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-950/50 to-neutral-950" />
        </div>

        {/* Navbar */}
        <nav className="absolute top-0 w-full z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto left-0 right-0">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-green-500" />
            <span className="text-xl font-bold tracking-tight text-white">GrowthMonk</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300">
            <a href="#features" className="hover:text-green-400 transition-colors">Features</a>
            <a href="#industries" className="hover:text-green-400 transition-colors">Industries</a>
            <a href="#analytics" className="hover:text-green-400 transition-colors">Analytics</a>
          </div>
          <Button 
            className="bg-green-500 hover:bg-green-600 text-neutral-950 font-semibold rounded-full px-6"
            onClick={() => window.location.href = 'mailto:hello@answermonk.ai'}
          >
            Book Demo
          </Button>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center mt-20">
          <Reveal>
            <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/10 mb-8 px-4 py-1.5 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              The AI Growth Engine for Modern Practices
            </Badge>
          </Reveal>
          
          <Reveal delay={150}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 text-white leading-[1.1]">
              Capture Every Lead. <br className="hidden md:block" />
              <span className="gradient-text text-glow">Miss Zero Patients.</span>
            </h1>
          </Reveal>

          <Reveal delay={300}>
            <p className="text-lg md:text-2xl text-neutral-400 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
              Automate discovery in AI search, qualify leads instantly across WhatsApp & Instagram, 
              and fill your calendar 24/7 in over 40 languages.
            </p>
          </Reveal>

          <Reveal delay={450}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-green-500 hover:bg-green-600 text-neutral-950 font-bold h-14 px-8 text-lg rounded-full w-full sm:w-auto transition-transform hover:scale-105"
                onClick={() => window.location.href = 'mailto:hello@answermonk.ai'}
              >
                Book a Free Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-neutral-700 text-white hover:bg-neutral-800 h-14 px-8 text-lg rounded-full w-full sm:w-auto"
              >
                See How It Works
              </Button>
            </div>
          </Reveal>

          <Reveal delay={600}>
            <div className="mt-16 flex items-center justify-center gap-8 text-sm text-neutral-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Live in 24 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>80% auto-qualification</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>No coding required</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Feature 1: AI Search Discoverability */}
      <section id="features" className="py-32 relative font-jakarta border-t border-neutral-900">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-green-900/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Reveal>
                <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6">
                  <Search className="w-6 h-6 text-green-400" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                  Dominate the new <br />era of <span className="text-green-400">AI Search</span>.
                </h2>
                <p className="text-xl text-neutral-400 mb-8 leading-relaxed font-light">
                  Patients aren't just Googling anymore—they're asking ChatGPT, Perplexity, and Google AI Overviews. 
                  Our Answer Engine Optimization (AEO) makes your clinic up to 3x more discoverable by AI models.
                </p>
                <ul className="space-y-4">
                  {[
                    "Optimized knowledge graphs for your treatments",
                    "Direct integration with AI crawler systems",
                    "Outrank competitors in conversational search"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 bg-green-500/20 p-1 rounded-full">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      </div>
                      <span className="text-neutral-300 text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
            <Reveal delay={200}>
              <div className="relative rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900 aspect-square box-glow">
                <img 
                  src="/__mockup/images/growthmonk/ai-network.png" 
                  alt="AI Search Network" 
                  className="w-full h-full object-cover opacity-80 mix-blend-screen"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
                
                {/* Overlay UI element */}
                <div className="absolute bottom-8 left-8 right-8 bg-neutral-950/80 backdrop-blur-md border border-neutral-800 p-6 rounded-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center border border-neutral-800">
                      <Bot className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">ChatGPT Search</p>
                      <p className="text-xs text-green-400">Recommended Clinic</p>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-300">
                    "Based on your symptoms and location, I recommend Excellage Clinic. They specialize in this exact treatment and have immediate availability tomorrow."
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Feature 2: Multilingual Omnichannel */}
      <section className="py-32 relative font-jakarta bg-neutral-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal delay={200} className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent" />
                    <MessageCircle className="w-8 h-8 text-neutral-400 mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">WhatsApp</h3>
                    <p className="text-sm text-neutral-400">Instant responses to inbound DMs.</p>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent" />
                    <Globe2 className="w-8 h-8 text-neutral-400 mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">40+ Languages</h3>
                    <p className="text-sm text-neutral-400">English, German, Turkish, Arabic & more.</p>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent" />
                    <Clock className="w-8 h-8 text-neutral-400 mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">24/7 Active</h3>
                    <p className="text-sm text-neutral-400">Never miss a lead outside business hours.</p>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-3xl relative overflow-hidden box-glow">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent" />
                    <h3 className="text-4xl font-bold text-green-400 mb-2">&lt;2m</h3>
                    <p className="text-sm text-green-200">Average response time for all inquiries.</p>
                  </div>
                </div>
              </div>
            </Reveal>
            <div className="order-1 lg:order-2">
              <Reveal>
                <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6">
                  <Globe2 className="w-6 h-6 text-green-400" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                  Speak their language. <br />On their <span className="text-green-400">favorite apps</span>.
                </h2>
                <p className="text-xl text-neutral-400 mb-8 leading-relaxed font-light">
                  Turn your Instagram and Facebook ads into actual bookings. Our AI captures leads natively where they scroll, instantly initiating a conversation on WhatsApp.
                </p>
                <Button variant="outline" className="border-neutral-700 text-white rounded-full px-6 h-12">
                  View Integrations
                </Button>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 3: Qualification & Booking */}
      <section className="py-32 relative font-jakarta">
        <div className="max-w-7xl mx-auto px-6 text-center mb-20">
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight max-w-4xl mx-auto">
              We qualify the tire-kickers. <br />You treat the <span className="text-green-400">patients</span>.
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto font-light">
              Stop wasting hours manually responding to price shoppers. GrowthMonk autonomously qualifies leads based on your specific medical criteria and automatically books them.
            </p>
          </Reveal>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <MessageCircle className="w-6 h-6 text-green-400" />,
                title: "Smart Qualification",
                desc: "AI asks the right pre-screening questions before allowing a booking, ensuring medical fit and intent."
              },
              {
                icon: <CalendarCheck className="w-6 h-6 text-green-400" />,
                title: "Auto-Booking",
                desc: "Direct integration with your scheduling software. The AI finds slots and books appointments seamlessly."
              },
              {
                icon: <Stethoscope className="w-6 h-6 text-green-400" />,
                title: "Callback Scheduling",
                desc: "For complex cases, the AI seamlessly transitions the chat to schedule a human triage call."
              }
            ].map((feature, i) => (
              <Reveal key={i} delay={i * 150}>
                <div className="bg-neutral-900/50 border border-neutral-800/50 p-8 rounded-3xl hover:bg-neutral-900 transition-colors h-full">
                  <div className="w-12 h-12 bg-neutral-950 rounded-xl flex items-center justify-center mb-6 border border-neutral-800">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">{feature.title}</h3>
                  <p className="text-neutral-400 leading-relaxed">{feature.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Feature 4: Analytics Dashboard */}
      <section id="analytics" className="py-32 relative font-jakarta bg-neutral-900/30 border-y border-neutral-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Reveal>
                <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6">
                  <BarChart3 className="w-6 h-6 text-green-400" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                  Visibility into <br />every <span className="text-green-400">conversation</span>.
                </h2>
                <p className="text-xl text-neutral-400 mb-8 leading-relaxed font-light">
                  A beautiful, live analytics dashboard that gives you x-ray vision into your patient acquisition funnel. See who's chatting, what they're asking, and your true conversion rates.
                </p>
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-3xl font-bold text-white mb-1">80%</p>
                    <p className="text-sm text-neutral-500">Auto-qualified</p>
                  </div>
                  <div className="w-px h-12 bg-neutral-800" />
                  <div>
                    <p className="text-3xl font-bold text-white mb-1">3x</p>
                    <p className="text-sm text-neutral-500">More bookings</p>
                  </div>
                </div>
              </Reveal>
            </div>
            <Reveal delay={200}>
              <div className="relative rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl box-glow">
                <img 
                  src="/__mockup/images/growthmonk/dashboard-glow.png" 
                  alt="Analytics Dashboard" 
                  className="w-full h-auto"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section id="industries" className="py-32 relative font-jakarta">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <Reveal>
            <Badge variant="outline" className="border-neutral-800 text-neutral-300 bg-neutral-900 mb-6 px-4 py-1.5">
              Built for Healthcare & Wellness
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Specialized for your practice.
            </h2>
          </Reveal>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <Reveal delay={150}>
            <div className="relative rounded-[2.5rem] overflow-hidden bg-neutral-900 border border-neutral-800 group">
              <div className="absolute inset-0">
                <img 
                  src="/__mockup/images/growthmonk/premium-clinic.png" 
                  alt="Premium Clinic" 
                  className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-700 mix-blend-luminosity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
              </div>
              
              <div className="relative z-10 p-12 md:p-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {[
                    "Medical Clinics", "Medspas & Aesthetics", "Dental Practices", "Physiotherapy",
                    "Mental Health", "Care Services", "Nutrition & Weight", "Fertility Clinics"
                  ].map((industry, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <HeartPulse className="w-5 h-5 text-green-500 opacity-70" />
                      <span className="text-neutral-200 font-medium">{industry}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative font-jakarta overflow-hidden">
        <div className="absolute inset-0 bg-green-500/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[500px] bg-green-500/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <Reveal>
            <ShieldCheck className="w-16 h-16 text-green-400 mx-auto mb-8" />
            <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-white">
              Ready to grow your practice?
            </h2>
            <p className="text-xl text-neutral-400 mb-12 font-light max-w-2xl mx-auto">
              Join top-tier clinics automating their lead capture and qualification. Setup takes less than 24 hours.
            </p>
            <Button 
              size="lg" 
              className="bg-green-500 hover:bg-green-600 text-neutral-950 font-bold h-16 px-10 text-xl rounded-full transition-transform hover:scale-105 box-glow"
              onClick={() => window.location.href = 'mailto:hello@answermonk.ai'}
            >
              Book a Free Demo
            </Button>
            <p className="mt-8 text-neutral-500 text-sm">
              No credit card required • Custom onboarding included
            </p>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-12 font-jakarta">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-500" />
            <span className="text-lg font-bold text-white tracking-tight">GrowthMonk</span>
          </div>
          <div className="text-neutral-500 text-sm">
            © {new Date().getFullYear()} AnswerMonk AI. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-neutral-500">
            <a href="#" className="hover:text-green-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-green-400 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
