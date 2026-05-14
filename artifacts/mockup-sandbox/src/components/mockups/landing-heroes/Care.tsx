import React from 'react';
import { Heart, Home, HeartHandshake, Brain, Clock, ShieldCheck, Phone, ChevronRight } from 'lucide-react';
import './_care.css';

export function Care() {
  return (
    <div className="min-h-screen font-['Inter',sans-serif] text-[#2c2416] bg-[#faf7f2] overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500&display=swap');
      `}} />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#faf7f2]/90 backdrop-blur-md border-b border-[#ede8e0] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#2c2416]">
          <HeartHandshake className="w-6 h-6 text-[#e8a84c]" />
          <span className="font-['Lora',serif] font-semibold text-xl tracking-tight">KindredCare</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#2c2416]/80">
          <a href="#services" className="hover:text-[#e8a84c] transition-colors">Services</a>
          <a href="#how-it-works" className="hover:text-[#e8a84c] transition-colors">How It Works</a>
          <a href="#carers" className="hover:text-[#e8a84c] transition-colors">Our Carers</a>
          <a href="#contact" className="hover:text-[#e8a84c] transition-colors">Contact</a>
        </div>
        <button className="bg-[#e8a84c] hover:bg-[#c4882a] text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all care-btn-glow shadow-sm">
          Get Care Assessment
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 care-hero-container">
        <div className="care-orb-1" />
        <div className="care-orb-2" />
        
        <div className="container mx-auto px-6 relative z-10 max-w-6xl flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 max-w-2xl">
            <h1 className="font-['Lora',serif] text-5xl md:text-[72px] leading-[1.1] font-semibold text-[#2c2416] mb-6 care-fade-in">
              Expert Care, <br/><span className="text-[#c4882a] italic font-normal">Right at Home</span>
            </h1>
            <p className="text-[#8a7a6a] text-lg md:text-xl leading-relaxed mb-10 max-w-lg care-fade-in-delay-1">
              Compassionate, professional carers matched to your family's needs. Because home is where the heart is.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 care-fade-in-delay-2">
              <button className="bg-[#e8a84c] hover:bg-[#c4882a] text-white px-8 py-4 rounded-full font-medium transition-all shadow-sm flex items-center justify-center gap-2 group care-btn-glow">
                Book a Free Assessment
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-transparent border border-[#c4882a] text-[#c4882a] hover:bg-[#c4882a]/5 px-8 py-4 rounded-full font-medium transition-colors flex items-center justify-center">
                Meet Our Carers
              </button>
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-md md:max-w-none care-fade-in-delay-1">
            <div className="aspect-[4/5] rounded-[2rem] bg-gradient-to-br from-[#e8a84c]/20 to-[#7aab7a]/20 border border-white/50 shadow-lg relative overflow-hidden flex items-center justify-center group">
              <div className="absolute inset-0 bg-white/20 backdrop-blur-sm group-hover:backdrop-blur-0 transition-all duration-700"></div>
              <div className="relative z-10 w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center text-[#e8a84c]">
                <Heart className="w-10 h-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="bg-white border-y border-[#ede8e0] py-12">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-[#ede8e0]">
            <div className="text-center px-4">
              <div className="font-['Lora',serif] text-3xl font-semibold text-[#e8a84c] mb-1">2,000+</div>
              <div className="text-sm text-[#8a7a6a]">Families Cared For</div>
            </div>
            <div className="text-center px-4">
              <div className="font-['Lora',serif] text-3xl font-semibold text-[#e8a84c] mb-1">98%</div>
              <div className="text-sm text-[#8a7a6a]">Satisfaction Rate</div>
            </div>
            <div className="text-center px-4">
              <div className="font-['Lora',serif] text-3xl font-semibold text-[#e8a84c] mb-1">4.9/5</div>
              <div className="text-sm text-[#8a7a6a]">Average Rating</div>
            </div>
            <div className="text-center px-4">
              <div className="flex justify-center mb-2 text-[#7aab7a]">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="text-sm text-[#8a7a6a]">DBS Checked Carers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-[#faf7f2]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-['Lora',serif] text-3xl md:text-4xl font-semibold text-[#2c2416] mb-4">Care Tailored to You</h2>
            <p className="text-[#8a7a6a] max-w-2xl mx-auto">We understand that every family's situation is unique. Our flexible care services adapt to your specific requirements.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Live-In Care", desc: "Round-the-clock support and companionship in the comfort of home.", icon: Home },
              { title: "Dementia Care", desc: "Specialist support focusing on memory, routine and safety.", icon: Brain },
              { title: "Companionship", desc: "Friendly visits, help with hobbies, and community engagement.", icon: Heart },
              { title: "Nursing Care", desc: "Clinical support for complex medical needs from qualified nurses.", icon: HeartHandshake }
            ].map((service, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-[#ede8e0] hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 bg-[#faf7f2] rounded-xl flex items-center justify-center text-[#c4882a] mb-6 group-hover:scale-110 transition-transform">
                  <service.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                <p className="text-[#8a7a6a] text-sm leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-white border-t border-[#ede8e0]">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="font-['Lora',serif] text-3xl md:text-4xl font-semibold text-center mb-16">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-[#ede8e0] z-0"></div>
            {[
              { num: "1", title: "Free Assessment", desc: "We'll discuss your needs and preferences with no obligation." },
              { num: "2", title: "Meet Your Carer", desc: "We carefully match you with a carer who suits your lifestyle." },
              { num: "3", title: "Care Begins", desc: "Your personalised care plan starts, with ongoing support." }
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-[#faf7f2] border-4 border-white rounded-full flex items-center justify-center text-[#e8a84c] font-['Lora',serif] text-3xl font-semibold shadow-sm mb-6">
                  {step.num}
                </div>
                <h3 className="font-semibold text-xl mb-3">{step.title}</h3>
                <p className="text-[#8a7a6a]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Carers Section */}
      <section id="carers" className="py-24 bg-[#faf7f2] border-t border-[#ede8e0]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-lg">
              <h2 className="font-['Lora',serif] text-3xl md:text-4xl font-semibold text-[#2c2416] mb-4">Meet Our Carers</h2>
              <p className="text-[#8a7a6a]">Our team is thoroughly vetted, highly trained, and deeply passionate about delivering dignified care.</p>
            </div>
            <button className="text-[#c4882a] font-medium hover:text-[#2c2416] transition-colors flex items-center gap-1">
              View all carers <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { initials: "SJ", name: "Sarah Jenkins", role: "Senior Care Specialist", exp: "8 years experience", color: "bg-[#7aab7a]/20 text-[#7aab7a]" },
              { initials: "MT", name: "Michael Thompson", role: "Dementia Care Expert", exp: "12 years experience", color: "bg-[#e8a84c]/20 text-[#c4882a]" },
              { initials: "EW", name: "Emma Wilson", role: "Registered Nurse", exp: "5 years experience", color: "bg-[#8a7a6a]/20 text-[#8a7a6a]" }
            ].map((carer, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-[#ede8e0] flex items-center gap-5 hover:shadow-md transition-shadow">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center font-semibold text-xl ${carer.color}`}>
                  {carer.initials}
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{carer.name}</h4>
                  <div className="text-sm text-[#8a7a6a] mb-1">{carer.role}</div>
                  <div className="text-xs font-medium text-[#c4882a]">{carer.exp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#e8a84c] to-[#c4882a]"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="font-['Lora',serif] text-3xl md:text-5xl font-semibold text-white mb-6">Ready to Find the Right Carer?</h2>
          <p className="text-white/90 text-lg mb-10 max-w-xl mx-auto">Contact our friendly team today to discuss your family's needs and arrange a free home assessment.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-[#c4882a] px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
              Get Care Assessment
            </button>
            <button className="bg-transparent border border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full font-medium transition-colors flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" /> 0800 123 4567
            </button>
          </div>
        </div>
      </section>
      
      {/* Footer minimal */}
      <footer className="bg-[#2c2416] text-[#8a7a6a] py-12 text-sm text-center">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-2 mb-6 text-white/50">
            <HeartHandshake className="w-5 h-5" />
            <span className="font-['Lora',serif] font-semibold text-lg tracking-tight">KindredCare</span>
          </div>
          <p>© {new Date().getFullYear()} KindredCare Services. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
