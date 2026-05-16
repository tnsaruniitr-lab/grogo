import React, { useEffect, useState } from "react";
import { ArrowRight, MessageSquare, Search, Zap, CheckCircle2, Globe, Clock, BarChart3, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const editorialStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500&display=swap');

  .font-editorial {
    font-family: 'Cormorant Garamond', serif;
  }
  .font-sans-clean {
    font-family: 'Inter', sans-serif;
  }

  .theme-emerald {
    background-color: #041f17;
    color: #ecfdf5;
  }

  .hairline-rule {
    height: 1px;
    background-color: rgba(236, 253, 245, 0.15);
  }

  .animate-fade-up {
    animation: fadeUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    opacity: 0;
    transform: translateY(20px);
  }

  .delay-100 { animation-delay: 100ms; }
  .delay-200 { animation-delay: 200ms; }
  .delay-300 { animation-delay: 300ms; }
  .delay-500 { animation-delay: 500ms; }
  
  @keyframes fadeUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .img-mask {
    mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
  }
`;

export function Editorial() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="theme-emerald min-h-screen font-sans-clean font-light antialiased selection:bg-emerald-800 selection:text-white overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: editorialStyles }} />

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#041f17]/90 backdrop-blur-md py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="font-editorial text-2xl tracking-wide font-medium">GrowthMonk</div>
          <a href="mailto:hello@answermonk.ai">
            <Button variant="outline" className="rounded-full border-emerald-50/20 text-emerald-50 hover:bg-emerald-50 hover:text-[#041f17] transition-colors duration-300 px-6 font-sans-clean">
              Book a Demo
            </Button>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-block animate-fade-up border border-emerald-50/20 rounded-full px-4 py-1.5 text-xs tracking-widest uppercase mb-10 text-emerald-100/70">
          The Healthcare AI Growth Engine
        </div>
        
        <h1 className="font-editorial text-5xl md:text-7xl lg:text-8xl leading-[1.1] tracking-tight max-w-4xl mx-auto animate-fade-up delay-100">
          Quietly convert <br/>
          <span className="italic font-light text-emerald-400">every</span> patient inquiry.
        </h1>
        
        <p className="mt-8 text-lg md:text-xl text-emerald-100/60 max-w-2xl mx-auto animate-fade-up delay-200 font-light leading-relaxed">
          Be discovered in AI search. Qualify leads across WhatsApp and Instagram. Book appointments automatically. 
          A sophisticated system for clinics that refuse to let patients slip through the cracks.
        </p>
        
        <div className="mt-12 animate-fade-up delay-300">
          <a href="mailto:hello@answermonk.ai">
            <Button className="rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-colors duration-300 px-8 py-6 text-lg font-sans-clean group">
              Book a Free Demo 
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </a>
        </div>
      </section>

      {/* Hero Image */}
      <section className="px-6 md:px-12 max-w-[90rem] mx-auto animate-fade-up delay-500 mb-32">
        <div className="aspect-[16/7] md:aspect-[16/6] relative overflow-hidden rounded-2xl md:rounded-[2rem] bg-[#02140f]">
          <img 
            src="/__mockup/images/growthmonk/hero-editorial.png" 
            alt="Abstract clinical botanical" 
            className="w-full h-full object-cover opacity-70 mix-blend-luminosity hover:mix-blend-normal transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#041f17] via-transparent to-transparent opacity-80" />
        </div>
      </section>

      {/* Quote / Thesis */}
      <section className="py-24 px-6 md:px-12 max-w-4xl mx-auto text-center">
        <div className="hairline-rule w-12 mx-auto mb-16" />
        <h2 className="font-editorial text-3xl md:text-5xl leading-tight text-emerald-50/90 italic font-light">
          "Eighty percent of prospective patients choose the practice that responds first. In an era of instant gratification, waiting until morning is no longer an option."
        </h2>
        <div className="hairline-rule w-12 mx-auto mt-16" />
      </section>

      {/* Feature 1: AI Search */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          <div className="order-2 md:order-1">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#02140f]">
              <img 
                src="/__mockup/images/growthmonk/ai-search-editorial.png" 
                alt="AI Search Visibility" 
                className="w-full h-full object-cover opacity-80"
              />
            </div>
          </div>
          <div className="order-1 md:order-2 space-y-8">
            <span className="text-emerald-500 font-sans-clean tracking-widest uppercase text-xs">01 / Visibility</span>
            <h3 className="font-editorial text-4xl md:text-5xl leading-tight">Dominate the new search paradigm.</h3>
            <p className="text-emerald-100/60 text-lg font-light leading-relaxed">
              Patients are bypassing traditional search for ChatGPT, Perplexity, and Google AI Overviews. 
              Our AEO (Answer Engine Optimization) architecture makes your practice 3x more discoverable where decisions are actually being made.
            </p>
            <ul className="space-y-4 pt-4">
              {['Optimized for LLM context windows', 'Structured medical data markup', 'Real-time practice information sync'].map((item, i) => (
                <li key={i} className="flex items-start text-emerald-50/80">
                  <div className="mt-1.5 mr-4 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="font-light">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Feature 2: Omni-channel */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          <div className="space-y-8">
            <span className="text-emerald-500 font-sans-clean tracking-widest uppercase text-xs">02 / Acquisition</span>
            <h3 className="font-editorial text-4xl md:text-5xl leading-tight">Capture intent everywhere.</h3>
            <p className="text-emerald-100/60 text-lg font-light leading-relaxed">
              Whether a prospect discovers you via an Instagram Reel, a Facebook Ad, or a direct WhatsApp message, GrowthMonk intercepts the inquiry instantly. No more manual inbox monitoring or lost weekend leads.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-6">
              {[
                { icon: MessageSquare, title: 'WhatsApp', desc: 'Direct business integration' },
                { icon: Globe, title: 'Instagram', desc: 'DM & comment capture' }
              ].map((item, i) => (
                <div key={i} className="border border-emerald-50/10 p-6 rounded-xl bg-emerald-50/5">
                  <item.icon className="w-6 h-6 text-emerald-400 mb-4" strokeWidth={1.5} />
                  <h4 className="text-emerald-50 font-medium mb-1">{item.title}</h4>
                  <p className="text-emerald-100/50 text-sm font-light">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="aspect-[3/4] md:aspect-square rounded-2xl overflow-hidden bg-[#02140f] md:ml-12">
            <img 
              src="/__mockup/images/growthmonk/qualification-editorial.png" 
              alt="Qualification" 
              className="w-full h-full object-cover opacity-80"
            />
          </div>
        </div>
      </section>

      {/* Feature 3: Qualification */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="hairline-rule w-full mb-24" />
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-1">
            <span className="text-emerald-500 font-sans-clean tracking-widest uppercase text-xs">03 / Conversion</span>
            <h3 className="font-editorial text-3xl md:text-4xl leading-tight mt-8 mb-6">Autonomous Qualification</h3>
            <p className="text-emerald-100/60 font-light leading-relaxed">
              Our multilingual AI engages prospects in English, German, Turkish, or Arabic. It qualifies intent, answers procedural questions, and drives towards a booking—24 hours a day, 7 days a week.
            </p>
          </div>
          <div className="md:col-span-2 grid sm:grid-cols-2 gap-8">
            {[
              { title: 'Sub-2 Minute Response', desc: 'Zero wait time. Capitalize on peak emotional intent instantly.' },
              { title: '80% Auto-Qualification', desc: 'Filter tire-kickers. Only deliver high-intent, ready-to-book patients to your staff.' },
              { title: 'Direct Booking', desc: 'Seamlessly schedules consultations directly into your practice management software.' },
              { title: 'Live Analytics', desc: 'Monitor conversation flow, conversion rates, and ROI in real-time.' }
            ].map((feature, i) => (
              <div key={i} className="border-l border-emerald-50/20 pl-6">
                <h4 className="text-xl font-editorial text-emerald-50 mb-3">{feature.title}</h4>
                <p className="text-emerald-100/50 text-sm font-light leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="hairline-rule w-full mt-24" />
      </section>

      {/* Industries */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto text-center">
        <h3 className="font-editorial text-3xl md:text-4xl mb-12">Engineered for specialized care.</h3>
        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {['Medical Clinics', 'Dental Practices', 'MedSpas & Aesthetics', 'Physiotherapy', 'Mental Health', 'Care Services', 'Nutrition', 'Fertility Clinics'].map((industry, i) => (
            <span key={i} className="px-6 py-3 rounded-full border border-emerald-50/10 text-emerald-50/80 font-light text-sm">
              {industry}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-950/30" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="font-editorial text-5xl md:text-7xl leading-tight mb-8">
            Deploy your growth engine <br/>
            <span className="italic font-light text-emerald-400">in under 24 hours.</span>
          </h2>
          <p className="text-emerald-100/60 text-lg mb-12 font-light">
            Stop losing patients to slower response times. Transform your acquisition pipeline today.
          </p>
          <a href="mailto:hello@answermonk.ai">
            <Button className="rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-colors duration-300 px-10 py-7 text-lg font-sans-clean group">
              Book a Free Demo 
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 md:px-12 border-t border-emerald-50/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-editorial text-xl">GrowthMonk</div>
          <div className="text-emerald-100/40 text-sm font-light">
            © {new Date().getFullYear()} GrowthMonk AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Editorial;
