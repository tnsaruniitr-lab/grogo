import React from 'react';
import { Menu, ChevronRight, Heart, Activity, Shield, Quote } from 'lucide-react';

export function HomecareEditorial() {
  return (
    <div className="bg-[#0D0D0D] text-[#AAAAAA] font-sans antialiased selection:bg-[#C9A84C] selection:text-[#0D0D0D] min-h-screen">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Inter:wght@300;400&display=swap');
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
      `}} />

      {/* Nav */}
      <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 md:px-12 bg-transparent">
         <div className="font-serif italic text-2xl text-[#C9A84C]">LUMINA Care</div>
         <button className="text-white hover:text-[#C9A84C] transition-colors">
            <Menu className="w-8 h-8" strokeWidth={1} />
         </button>
      </nav>

      {/* Hero */}
      <section className="relative w-full h-[100dvh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1600" alt="Luxury Homecare" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-[#0D0D0D]/70 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0D0D0D]"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto mt-20">
          <div className="w-16 h-[1px] bg-[#C9A84C] mb-8"></div>
          <h1 className="font-serif text-white text-6xl md:text-[96px] lg:text-[110px] leading-[1.05] font-light tracking-tight mb-8">
            The Finest Home Care,<br />Delivered With Grace
          </h1>
          <div className="w-16 h-[1px] bg-[#C9A84C] mb-8"></div>
          <p className="text-[#E8D5A3] font-sans font-light text-sm md:text-lg tracking-[0.2em] uppercase mb-12">
            Exceptional care for extraordinary lives
          </p>
          <button className="border border-[#C9A84C] text-[#C9A84C] px-10 py-4 uppercase tracking-[0.2em] text-sm hover:bg-[#C9A84C] hover:text-[#0D0D0D] transition-all duration-500">
            Begin Your Journey
          </button>
        </div>
      </section>

      {/* Intro section */}
      <section className="bg-[#111111] py-32 px-6 flex flex-col items-center text-center">
        <div className="max-w-3xl mx-auto">
          <div className="text-[#C9A84C] text-xs font-semibold tracking-[0.3em] uppercase mb-10">Our Philosophy</div>
          <p className="font-serif text-3xl md:text-5xl text-white font-light leading-snug">
            "We believe that true luxury is found in the meticulous attention to detail, preserving dignity and elevating the standard of care in the sanctity of your home."
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="bg-[#0D0D0D] py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
          {/* Card 1 */}
          <div className="group border-t border-[#C9A84C]/30 pt-10 hover:border-[#C9A84C] transition-colors duration-700">
            <Heart className="w-10 h-10 text-[#C9A84C] mb-8" strokeWidth={1} />
            <h3 className="font-serif text-3xl md:text-4xl text-white mb-6">Concierge Nursing</h3>
            <p className="font-sans font-light leading-relaxed mb-8 text-[#AAAAAA] text-sm md:text-base">
              Around-the-clock bespoke clinical care, tailored meticulously to your medical needs and personal preferences by elite practitioners.
            </p>
            <a href="#" className="inline-flex items-center text-[#C9A84C] text-sm uppercase tracking-widest hover:text-white transition-colors duration-300">
              Learn More <ChevronRight className="w-4 h-4 ml-2" />
            </a>
          </div>
          {/* Card 2 */}
          <div className="group border-t border-[#C9A84C]/30 pt-10 hover:border-[#C9A84C] transition-colors duration-700">
            <Activity className="w-10 h-10 text-[#C9A84C] mb-8" strokeWidth={1} />
            <h3 className="font-serif text-3xl md:text-4xl text-white mb-6">Rehabilitation at Home</h3>
            <p className="font-sans font-light leading-relaxed mb-8 text-[#AAAAAA] text-sm md:text-base">
              Accelerate your recovery within the comfort of your residence, guided by our premier physical and occupational therapy specialists.
            </p>
            <a href="#" className="inline-flex items-center text-[#C9A84C] text-sm uppercase tracking-widest hover:text-white transition-colors duration-300">
              Learn More <ChevronRight className="w-4 h-4 ml-2" />
            </a>
          </div>
          {/* Card 3 */}
          <div className="group border-t border-[#C9A84C]/30 pt-10 hover:border-[#C9A84C] transition-colors duration-700">
            <Shield className="w-10 h-10 text-[#C9A84C] mb-8" strokeWidth={1} />
            <h3 className="font-serif text-3xl md:text-4xl text-white mb-6">Palliative & End-of-Life</h3>
            <p className="font-sans font-light leading-relaxed mb-8 text-[#AAAAAA] text-sm md:text-base">
              Compassionate, dignified care focusing on comfort, pain management, and holistic support for both patient and family.
            </p>
            <a href="#" className="inline-flex items-center text-[#C9A84C] text-sm uppercase tracking-widest hover:text-white transition-colors duration-300">
              Learn More <ChevronRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Full-width image section */}
      <section className="relative w-full h-[400px] md:h-[600px] flex items-center justify-center">
        <img src="https://images.unsplash.com/photo-1609220136736-443140cfeaa3?w=1600" alt="Care Environment" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-[#0D0D0D]/60 mix-blend-multiply"></div>
        <h2 className="relative z-10 font-serif text-4xl md:text-7xl text-white font-light text-center px-4">
          Care That Honors Dignity
        </h2>
      </section>

      {/* Why LUMINA */}
      <section className="bg-[#111111] py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">
          <div className="w-full md:w-1/2">
            <div className="relative aspect-[3/4] overflow-hidden">
              <img src="/__mockup/images/lumina-care-editorial.png" alt="The Lumina Difference" className="w-full h-full object-cover" />
              <div className="absolute inset-0 ring-1 ring-inset ring-[#C9A84C]/20"></div>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="text-[#C9A84C] text-xs font-semibold tracking-[0.3em] uppercase mb-6">The Lumina Difference</div>
            <h2 className="font-serif text-4xl md:text-6xl text-white font-light mb-16 leading-tight">
              A standard of care<br />without compromise.
            </h2>
            <ul className="space-y-12">
              <li className="flex items-start">
                <div className="w-8 h-[1px] bg-[#C9A84C] mt-4 mr-8 flex-shrink-0"></div>
                <div>
                  <h4 className="font-serif text-2xl md:text-3xl text-[#E8D5A3] mb-3">Exclusive Practitioner Network</h4>
                  <p className="font-sans font-light text-[#AAAAAA] leading-relaxed">We select only the top 1% of private-duty nurses and caregivers, ensuring unparalleled expertise and discretion.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-8 h-[1px] bg-[#C9A84C] mt-4 mr-8 flex-shrink-0"></div>
                <div>
                  <h4 className="font-serif text-2xl md:text-3xl text-[#E8D5A3] mb-3">Bespoke Care Architecture</h4>
                  <p className="font-sans font-light text-[#AAAAAA] leading-relaxed">No two clients are alike. We design intricate care protocols that seamlessly integrate with your lifestyle.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-8 h-[1px] bg-[#C9A84C] mt-4 mr-8 flex-shrink-0"></div>
                <div>
                  <h4 className="font-serif text-2xl md:text-3xl text-[#E8D5A3] mb-3">Unwavering Privacy</h4>
                  <p className="font-sans font-light text-[#AAAAAA] leading-relaxed">Confidentiality is paramount. Our protocols are trusted by high-profile families and executives globally.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#0D0D0D] py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="flex flex-col text-center">
            <Quote className="w-8 h-8 text-[#C9A84C] mx-auto mb-8 opacity-40" strokeWidth={1} />
            <p className="font-serif italic text-2xl text-white font-light leading-relaxed mb-10 flex-grow">
              "Lumina transformed a profoundly difficult time into a period of profound peace. Their nurses are true artisans of care."
            </p>
            <div className="text-[#C9A84C] text-xs tracking-[0.2em] uppercase font-semibold">— The Harrison Family</div>
          </div>
          <div className="flex flex-col text-center">
            <Quote className="w-8 h-8 text-[#C9A84C] mx-auto mb-8 opacity-40" strokeWidth={1} />
            <p className="font-serif italic text-2xl text-white font-light leading-relaxed mb-10 flex-grow">
              "The level of discretion, clinical excellence, and sheer grace exhibited by our Lumina team was simply unmatched."
            </p>
            <div className="text-[#C9A84C] text-xs tracking-[0.2em] uppercase font-semibold">— Eleanor V.</div>
          </div>
          <div className="flex flex-col text-center">
            <Quote className="w-8 h-8 text-[#C9A84C] mx-auto mb-8 opacity-40" strokeWidth={1} />
            <p className="font-serif italic text-2xl text-white font-light leading-relaxed mb-10 flex-grow">
              "It is rare to find a service that delivers so perfectly on the promise of luxury and medical rigor combined."
            </p>
            <div className="text-[#C9A84C] text-xs tracking-[0.2em] uppercase font-semibold">— Dr. James Sterling</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#C9A84C] py-32 px-6 text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <h2 className="font-serif text-5xl md:text-7xl text-[#0D0D0D] font-light mb-8">
            Reserve Your Consultation
          </h2>
          <p className="font-sans text-[#0D0D0D]/80 font-light text-lg mb-12 max-w-xl">
            Begin the conversation about your family's unique needs with our clinical directors.
          </p>
          <button className="bg-[#0D0D0D] text-[#C9A84C] px-12 py-5 uppercase tracking-[0.2em] text-sm hover:bg-black transition-colors duration-500">
            Contact Lumina
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D0D0D] py-16 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="font-serif italic text-2xl text-[#C9A84C]">LUMINA Care</div>
          <div className="flex gap-8 text-xs tracking-widest uppercase text-[#AAAAAA]">
            <a href="#" className="hover:text-white transition-colors">Services</a>
            <a href="#" className="hover:text-white transition-colors">Philosophy</a>
            <a href="#" className="hover:text-white transition-colors">Journal</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
          </div>
          <div className="text-[#AAAAAA]/40 text-sm font-light">
            © {new Date().getFullYear()} Lumina Care. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
