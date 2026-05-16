import React from "react";
import { 
  Phone, 
  CheckCircle2, 
  ArrowRight, 
  Stethoscope, 
  Activity, 
  Bandage, 
  Pill, 
  HeartPulse, 
  Brain,
  Quote
} from "lucide-react";

export function HomecareClinical() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
        
        .font-serif {
          font-family: 'Cormorant Garamond', serif;
        }
        
        .text-prime {
          color: #1B4332;
        }
        
        .bg-prime {
          background-color: #1B4332;
        }
        
        .border-prime {
          border-color: #1B4332;
        }
      `}</style>

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2 text-prime">
          <div className="w-8 h-8 rounded-full bg-prime flex items-center justify-center text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </div>
          <span className="font-serif font-bold text-2xl tracking-wide">PrimeCare</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#" className="hover:text-prime transition-colors">Services</a>
          <a href="#" className="hover:text-prime transition-colors">How It Works</a>
          <a href="#" className="hover:text-prime transition-colors">About Us</a>
          <a href="#" className="hover:text-prime transition-colors">Testimonials</a>
        </div>
        <div className="flex items-center gap-2 text-prime font-semibold">
          <Phone size={18} />
          <span>(800) 123-4567</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col md:flex-row min-h-[600px] md:min-h-[70vh]">
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16 bg-white">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-[72px] leading-tight text-prime mb-6 font-semibold">
            Excellence in<br />Home Healthcare
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-md leading-relaxed">
            Professional, compassionate medical care delivered in the comfort and safety of your own home. Trust our certified clinical team for your family's needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-prime text-white px-8 py-4 rounded-sm font-medium hover:bg-opacity-90 transition-all flex items-center justify-center gap-2">
              Request Assessment
              <ArrowRight size={18} />
            </button>
            <button className="border-2 border-prime text-prime px-8 py-4 rounded-sm font-medium hover:bg-gray-50 transition-all">
              View Services
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/2 min-h-[400px] bg-gray-100 relative">
          <img 
            src="https://images.unsplash.com/photo-1584515933487-779824d29309?w=900" 
            alt="Professional homecare nurse" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-gray-100 bg-white py-12 px-8">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center text-center gap-8 divide-x-0 md:divide-x divide-gray-200">
          <div className="flex-1 min-w-[200px]">
            <div className="font-serif text-4xl text-prime font-bold mb-1">15+</div>
            <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Years Experience</div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="font-serif text-4xl text-prime font-bold mb-1">1,200+</div>
            <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Patients Served</div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="font-serif text-4xl text-prime font-bold mb-1">98%</div>
            <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Satisfaction</div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="font-serif text-4xl text-prime font-bold mb-1">24/7</div>
            <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Clinical Support</div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-prime font-bold mb-4">Comprehensive Clinical Care</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Tailored medical services designed to promote recovery, independence, and improved quality of life at home.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {[
              { icon: <Stethoscope />, title: "Skilled Nursing", desc: "Comprehensive care including vital sign monitoring, IV therapy, and disease management." },
              { icon: <Activity />, title: "Physical Therapy", desc: "Customized rehabilitation programs to improve mobility, strength, and balance safely." },
              { icon: <Bandage />, title: "Wound Care", desc: "Expert assessment and treatment of surgical wounds, pressure ulcers, and complex injuries." },
              { icon: <Pill />, title: "Medication Management", desc: "Precise administration, reconciliation, and education to ensure therapeutic success." },
              { icon: <HeartPulse />, title: "Post-Surgery Care", desc: "Dedicated transitional care to accelerate recovery and prevent hospital readmissions." },
              { icon: <Brain />, title: "Dementia Care", desc: "Specialized support focusing on safety, cognitive engagement, and family guidance." }
            ].map((service, idx) => (
              <div key={idx} className="flex gap-6 p-6 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <div className="text-prime bg-prime/5 p-4 rounded-full h-fit">
                  {service.icon}
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-prime font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 px-8 bg-[#F5F5F5]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-prime font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">A streamlined, professional approach to getting you or your loved one the exact care required.</p>
          </div>
          
          <div className="relative flex flex-col md:flex-row justify-between items-center gap-12 md:gap-4">
            {/* Connecting Line (desktop) */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-gray-300 z-0"></div>
            
            {[
              { num: "01", title: "Free Assessment", desc: "A registered nurse visits to evaluate clinical needs and home safety." },
              { num: "02", title: "Care Plan Created", desc: "We develop a customized, physician-approved protocol." },
              { num: "03", title: "Care Begins", desc: "Our matched clinical team initiates care with 24/7 oversight." }
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center w-full md:w-1/3">
                <div className="w-24 h-24 rounded-full bg-white border-4 border-[#F5F5F5] shadow-sm flex items-center justify-center font-serif text-3xl font-bold text-prime mb-6">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 max-w-[250px]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-24 px-8 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          <div className="w-full lg:w-1/2 relative">
            <div className="absolute inset-0 bg-prime transform translate-x-4 translate-y-4 rounded-sm"></div>
            <img 
              src="/__mockup/images/homecare-clinical-scene.png" 
              alt="PrimeCare quality standards" 
              className="relative z-10 w-full h-[500px] object-cover rounded-sm shadow-md"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1576765608622-067973a79f53?w=800";
              }}
            />
          </div>
          <div className="w-full lg:w-1/2">
            <h2 className="font-serif text-4xl md:text-5xl text-prime font-bold mb-8">Why Families Choose PrimeCare</h2>
            
            <div className="space-y-6 mb-10">
              {[
                "Strictly vetted, licensed, and bonded clinicians",
                "Direct physician collaboration on all care plans",
                "Evidence-based clinical protocols and pathways",
                "Transparent reporting and family portal access"
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <CheckCircle2 className="text-prime shrink-0 mt-1" size={20} />
                  <span className="text-lg text-gray-700">{item}</span>
                </div>
              ))}
            </div>
            
            <a href="#" className="inline-flex items-center gap-2 text-prime font-semibold hover:underline border-b border-prime pb-1">
              View our clinical certifications
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-8 bg-[#F5F5F5]">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-4xl text-center text-prime font-bold mb-16">Patient Outcomes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: "The level of professionalism was exceptional. The nursing staff not only provided excellent wound care but educated us thoroughly on the recovery process.",
                author: "Sarah J.",
                role: "Patient Daughter"
              },
              {
                text: "After my father's stroke, PrimeCare's physical therapy team was instrumental in helping him regain his mobility and confidence at home.",
                author: "Michael T.",
                role: "Family Caregiver"
              },
              {
                text: "I was hesitant about home care, but the daily monitoring and medication management completely removed the stress from my recovery.",
                author: "Eleanor W.",
                role: "Post-Surgery Patient"
              }
            ].map((quote, idx) => (
              <div key={idx} className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 relative">
                <Quote className="text-prime/10 absolute top-6 right-6" size={48} />
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#1B4332" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 italic mb-6 relative z-10 leading-relaxed">"{quote.text}"</p>
                <div>
                  <div className="font-bold text-gray-900">{quote.author}</div>
                  <div className="text-sm text-gray-500">{quote.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-8 bg-prime text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">Start with a Free Clinical Assessment</h2>
          <p className="text-prime-100 text-lg mb-10 opacity-90 max-w-xl mx-auto">
            Contact us today to schedule a comprehensive evaluation by a registered nurse, with no obligation.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button className="bg-white text-prime px-10 py-4 rounded-sm font-bold hover:bg-gray-100 transition-all text-lg w-full sm:w-auto">
              Request Assessment
            </button>
            <div className="text-white/80 font-medium px-4">or call (800) 123-4567</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111111] text-gray-400 py-12 px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-800 pb-12 mb-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 text-white mb-6">
              <div className="w-6 h-6 rounded-full bg-prime flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              </div>
              <span className="font-serif font-bold text-xl tracking-wide">PrimeCare</span>
            </div>
            <p className="text-sm">Setting the standard for clinical excellence in home healthcare.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Skilled Nursing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Physical Therapy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Wound Care</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Medication Management</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Certifications</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>123 Healthcare Blvd</li>
              <li>Suite 200</li>
              <li>Boston, MA 02110</li>
              <li className="mt-4 pt-4 border-t border-gray-800">
                <a href="tel:8001234567" className="text-white text-lg font-semibold">(800) 123-4567</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
          <p>© {new Date().getFullYear()} PrimeCare Clinical Services. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">HIPAA Compliance</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
