import React, { useEffect, useState } from 'react';
import { Star, ChevronRight, Menu } from 'lucide-react';
import './_group.css';

export function MedSpa() {
  const [particles, setParticles] = useState<{ id: number; left: string; size: string; duration: string; delay: string }[]>([]);

  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 4 + 1}px`,
      duration: `${Math.random() * 10 + 10}s`,
      delay: `${Math.random() * 5}s`,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f5f0e8] overflow-hidden selection:bg-[#c9a84c] selection:text-[#0a0a0f]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Nunito+Sans:wght@300;400;500&display=swap');
        .font-serif { font-family: 'Cormorant Garamond', serif; }
      `}} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between border-b border-[#c9a84c]/10 bg-[#0a0a0f]/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border border-[#c9a84c] flex items-center justify-center font-serif text-xl text-[#c9a84c]">
            E
          </div>
          <span className="font-serif text-xl tracking-widest text-[#f5f0e8]">ELEGANZE</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm tracking-wide text-[#a09080]">
          <a href="#" className="hover:text-[#c9a84c] transition-colors">Treatments</a>
          <a href="#" className="hover:text-[#c9a84c] transition-colors">About</a>
          <a href="#" className="hover:text-[#c9a84c] transition-colors">Testimonials</a>
          <a href="#" className="hover:text-[#c9a84c] transition-colors">Contact</a>
        </div>

        <div className="flex items-center gap-4">
          <button className="hidden md:block px-6 py-2 rounded-none text-sm tracking-wider uppercase btn-gold font-medium">
            Book Consultation
          </button>
          <button className="md:hidden text-[#c9a84c]">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
        {/* Animated Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full mix-blend-screen filter blur-[100px] opacity-30" 
             style={{ 
               background: 'radial-gradient(circle, #c9a84c 0%, transparent 70%)',
               animation: 'slow-rotate 25s linear infinite'
             }} 
        />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full mix-blend-screen filter blur-[80px] opacity-20" 
             style={{ 
               background: 'radial-gradient(circle, #e8d5a3 0%, transparent 70%)',
               animation: 'slow-rotate 20s linear infinite reverse'
             }} 
        />

        {/* Particles */}
        <div className="absolute inset-0 z-0">
          {particles.map(p => (
            <div 
              key={p.id}
              className="particle"
              style={{
                left: p.left,
                width: p.size,
                height: p.size,
                animationDuration: p.duration,
                animationDelay: p.delay
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
          <span className="text-[#c9a84c] uppercase tracking-[0.3em] text-xs font-semibold mb-6 animate-fade-in-up opacity-0">
            London · Dubai · Paris
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-[100px] leading-[1.1] mb-8 text-transparent bg-clip-text bg-gradient-to-b from-[#f5f0e8] to-[#a09080] animate-fade-in-up delay-100 opacity-0">
            Redefine Your <br className="hidden md:block"/>Natural Beauty
          </h1>
          <p className="text-[#a09080] text-lg md:text-xl max-w-2xl mb-12 font-light animate-fade-in-up delay-200 opacity-0">
            Precision aesthetics. Bespoke treatments. Extraordinary results. Experience the pinnacle of regenerative medicine.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto animate-fade-in-up delay-300 opacity-0">
            <button className="px-8 py-4 rounded-none text-sm tracking-wider uppercase btn-gold font-medium w-full sm:w-auto">
              Book Your Consultation
            </button>
            <button className="px-8 py-4 rounded-none text-sm tracking-wider uppercase border border-[#c9a84c]/50 text-[#f5f0e8] hover:bg-[#c9a84c]/10 transition-colors w-full sm:w-auto">
              Explore Treatments
            </button>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="relative z-20 py-8 border-y border-[#c9a84c]/10 bg-[#0a0a0f]/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              "CQC Registered",
              "500+ 5-Star Reviews",
              "Award-Winning Clinic",
              "Doctor-Led Treatments"
            ].map((text, i) => (
              <div key={i} className="flex flex-col items-center justify-center">
                <span className="text-[#c9a84c] text-xs uppercase tracking-widest">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-[#f5f0e8]">Our Expertise</h2>
            <div className="w-12 h-px bg-[#c9a84c] mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Facial Rejuvenation",
                desc: "Subtle enhancements designed to restore volume, smooth lines, and perfect symmetry.",
              },
              {
                title: "Body Contouring",
                desc: "Advanced non-surgical technologies to sculpt and refine your natural silhouette.",
              },
              {
                title: "Skin Treatments",
                desc: "Medical-grade therapies to address pigmentation, texture, and cellular renewal.",
              }
            ].map((service, i) => (
              <div key={i} className="glass-card p-10 flex flex-col items-start text-left group">
                <div className="w-12 h-12 rounded-full border border-[#c9a84c]/30 flex items-center justify-center mb-8">
                  <div className="w-2 h-2 rounded-full bg-[#c9a84c]"></div>
                </div>
                <h3 className="font-serif text-2xl mb-4 text-[#e8d5a3]">{service.title}</h3>
                <p className="text-[#a09080] font-light leading-relaxed mb-8 flex-grow">
                  {service.desc}
                </p>
                <a href="#" className="inline-flex items-center gap-2 text-[#c9a84c] text-sm uppercase tracking-widest font-medium group-hover:gap-4 transition-all">
                  Learn More <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-32 bg-gradient-to-b from-transparent to-[#c9a84c]/5 relative z-10 border-t border-[#c9a84c]/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-center gap-1 mb-8">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-[#c9a84c] text-[#c9a84c]" />)}
          </div>
          <blockquote className="font-serif text-3xl md:text-4xl leading-relaxed text-[#f5f0e8] mb-12">
            "An unparalleled experience. The attention to detail and level of care is exceptional. They don't just perform treatments; they curate elegance."
          </blockquote>
          <cite className="not-italic block">
            <span className="text-[#e8d5a3] tracking-widest uppercase text-sm font-semibold block mb-1">Eleanor V.</span>
            <span className="text-[#a09080] text-sm font-light">Mayfair, London</span>
          </cite>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-32 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[#c9a84c]/5 border-y border-[#c9a84c]/20"></div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-4xl md:text-6xl mb-8 text-[#f5f0e8]">Begin Your Transformation</h2>
          <p className="text-[#a09080] text-lg mb-12 font-light">
            Schedule a private consultation to discuss your aesthetic goals.
          </p>
          <button className="px-10 py-5 rounded-none text-sm tracking-wider uppercase btn-gold font-bold">
            Book Your Consultation
          </button>
        </div>
      </section>
      
      {/* Footer minimal */}
      <footer className="py-10 text-center border-t border-[#c9a84c]/10">
        <p className="text-[#a09080] text-sm">&copy; {new Date().getFullYear()} Eleganze Aesthetics. All rights reserved.</p>
      </footer>
    </div>
  );
}
