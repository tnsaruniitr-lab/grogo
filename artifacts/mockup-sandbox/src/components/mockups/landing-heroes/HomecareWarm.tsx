import React from "react";
import { 
  Heart, 
  Shield, 
  Clock, 
  Phone, 
  Stethoscope, 
  Activity, 
  Pill, 
  Users, 
  HandHeart, 
  CheckCircle, 
  Star, 
  Instagram, 
  Facebook, 
  Twitter, 
  MapPin, 
  Mail,
  Menu
} from "lucide-react";

export function HomecareWarm() {
  return (
    <div className="font-sans text-stone-800 bg-[#FAF7F2] min-h-screen selection:bg-[#7A9E7E] selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
      `}</style>

      {/* Nav */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="w-8 h-8 text-white fill-current" />
          <span className="font-serif text-2xl font-bold text-white tracking-wide">SOLACE</span>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-8 text-white/90 font-medium">
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#about" className="hover:text-white transition-colors">About Us</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>
          <button className="bg-[#7A9E7E] hover:bg-[#688a6b] text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-sm">
            Book Callback
          </button>
        </div>

        {/* Mobile Nav Toggle */}
        <button className="md:hidden text-white">
          <Menu className="w-8 h-8" />
        </button>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1576765608622-067973a79f53?w=1600" 
            alt="Nurse caring for elderly patient" 
            className="w-full h-full object-cover object-top"
            crossOrigin="anonymous"
          />
          <div className="absolute inset-0 bg-stone-900/35"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 md:px-12 pt-20">
          <div className="max-w-3xl">
            <h1 className="font-serif text-5xl md:text-7xl lg:text-[88px] leading-[1.05] text-white mb-6 font-bold">
              Care That Feels Like Home
            </h1>
            <p className="text-xl md:text-2xl text-white/95 mb-10 max-w-2xl leading-relaxed font-light">
              Professional home nursing and support services, tailored to your loved one.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-[#7A9E7E] hover:bg-[#688a6b] text-white px-8 py-4 rounded-full text-lg font-medium transition-all shadow-lg flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" />
                Book a Free Callback
              </button>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-full text-lg font-medium transition-all flex items-center justify-center">
                Explore Services
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="bg-white border-b border-stone-100 py-6">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-stone-100">
            <div className="flex flex-col items-center justify-center px-4">
              <div className="flex text-[#C4714F] mb-2">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <span className="text-sm font-medium text-stone-600">4.9/5 Average Rating</span>
            </div>
            <div className="flex flex-col items-center justify-center px-4">
              <span className="text-2xl font-serif font-bold text-[#7A9E7E] mb-1">500+</span>
              <span className="text-sm font-medium text-stone-600">Families Served</span>
            </div>
            <div className="flex flex-col items-center justify-center px-4">
              <span className="text-2xl font-serif font-bold text-[#7A9E7E] mb-1">7 Days</span>
              <span className="text-sm font-medium text-stone-600">Available Weekly</span>
            </div>
            <div className="flex flex-col items-center justify-center px-4">
              <Shield className="w-7 h-7 text-[#7A9E7E] mb-2" />
              <span className="text-sm font-medium text-stone-600">Fully Insured & Vetted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Services */}
      <section id="services" className="py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#C4714F] font-semibold tracking-wider uppercase text-sm mb-3 block">How We Help</span>
            <h2 className="font-serif text-4xl md:text-5xl text-stone-800 mb-6 font-bold">Our Services</h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              We provide comprehensive, personalized care plans designed to maintain independence and enhance quality of life at home.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Stethoscope />, title: "Home Nursing Care", desc: "Professional medical care, wound dressing, and health monitoring by registered nurses." },
              { icon: <HandHeart />, title: "Personal Care & Hygiene", desc: "Dignified assistance with bathing, dressing, grooming, and daily personal routines." },
              { icon: <Pill />, title: "Medication Management", desc: "Timely administration, organization, and coordination of daily medications." },
              { icon: <Users />, title: "Companionship", desc: "Meaningful social interaction, engaging activities, and emotional support." },
              { icon: <Activity />, title: "Physiotherapy at Home", desc: "Rehabilitation exercises and mobility support in the comfort of home." },
              { icon: <Clock />, title: "Respite Care", desc: "Temporary relief for family caregivers, ensuring continuous, quality support." }
            ].map((service, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-stone-100 group">
                <div className="w-14 h-14 bg-[#FAF7F2] rounded-2xl flex items-center justify-center text-[#7A9E7E] mb-6 group-hover:bg-[#7A9E7E] group-hover:text-white transition-colors duration-300">
                  {React.cloneElement(service.icon, { className: "w-7 h-7" })}
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-3">{service.title}</h3>
                <p className="text-stone-600 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="about" className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6 md:px-12">
          {/* Top Row */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <div className="relative">
              <div className="aspect-[4/3] rounded-[2rem] overflow-hidden relative z-10">
                <img 
                  src="/__mockup/images/homecare-scene-1.png" 
                  alt="Warm homecare scene" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-[#FAF7F2] rounded-full z-0"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#e8f0e9] rounded-full z-0"></div>
            </div>
            
            <div>
              <span className="text-[#C4714F] font-semibold tracking-wider uppercase text-sm mb-3 block">Why Choose Solace</span>
              <h2 className="font-serif text-4xl md:text-5xl text-stone-800 mb-8 font-bold leading-tight">
                Compassionate,<br />Professional Care
              </h2>
              <div className="space-y-6">
                {[
                  "Rigorous vetting and continuous training for all caregivers.",
                  "Personalized care plans tailored to specific family needs.",
                  "24/7 dedicated support team available for emergencies."
                ].map((point, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <CheckCircle className="w-6 h-6 text-[#7A9E7E] shrink-0 mt-1" />
                    <p className="text-lg text-stone-600">{point}</p>
                  </div>
                ))}
              </div>
              <button className="mt-10 bg-transparent border-2 border-[#7A9E7E] text-[#7A9E7E] hover:bg-[#7A9E7E] hover:text-white px-8 py-3.5 rounded-full font-medium transition-colors">
                Learn About Our Process
              </button>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="font-serif text-4xl md:text-5xl text-stone-800 mb-6 font-bold leading-tight">
                Peace of Mind for Your Entire Family
              </h2>
              <p className="text-lg text-stone-600 leading-relaxed mb-8">
                We understand that bringing someone into your home requires absolute trust. That's why we don't just assign caregivers—we meticulously match personalities, skills, and experiences to ensure a harmonious and comfortable relationship.
              </p>
              <div className="bg-[#FAF7F2] p-8 rounded-2xl border border-[#e8f0e9]">
                <p className="font-serif text-xl italic text-stone-700 mb-4">
                  "The peace of mind knowing my mother is not just safe, but genuinely happy with her care team, is invaluable."
                </p>
                <p className="font-medium text-stone-900">— Sarah J., Client's Daughter</p>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative">
              <div className="aspect-[4/3] rounded-[2rem] overflow-hidden relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1609220136736-443140cfeaa3?w=800" 
                  alt="Nurse holding patient's hand" 
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-[#F5EBE7] rounded-full z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 md:py-32 bg-[#F4EFE6]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-stone-800 mb-6 font-bold">Stories of Care</h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              Hear from the families who have welcomed us into their homes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { quote: "Solace provided incredible support during my father's recovery. The nurses were not only skilled but showed genuine warmth and patience every single day.", name: "Eleanor Vance", loc: "Portland, OR" },
              { quote: "Finding a reliable caregiver felt overwhelming until we met the team at Solace. They matched us with someone who felt like family from day one.", name: "Michael Chang", loc: "Seattle, WA" },
              { quote: "The level of communication and care has been exceptional. I never have to worry when I'm at work because I know my mother is in the best hands.", name: "David & Maria R.", loc: "Bellevue, WA" }
            ].map((test, i) => (
              <div key={i} className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm relative">
                <div className="text-[#C4714F] mb-6">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.017 21L16.41 14.596L16.402 14.58C17.653 14.12 18.665 13.238 19.294 12.062C19.923 10.885 20.134 9.489 19.897 8.118C19.659 6.746 18.989 5.485 17.994 4.55C16.999 3.615 15.736 3.064 14.414 3.001C13.092 2.939 11.782 3.371 10.697 4.226C9.612 5.08 8.814 6.309 8.435 7.712C8.056 9.115 8.116 10.607 8.604 11.968C9.091 13.33 10.021 14.512 11.238 15.29L14.017 21ZM5.526 21L7.919 14.596L7.911 14.58C9.162 14.12 10.174 13.238 10.803 12.062C11.432 10.885 11.643 9.489 11.406 8.118C11.168 6.746 10.498 5.485 9.503 4.55C8.508 3.615 7.245 3.064 5.923 3.001C4.601 2.939 3.291 3.371 2.206 4.226C1.121 5.08 0.323 6.309 -0.056 7.712C-0.435 9.115 -0.375 10.607 0.113 11.968C0.602 13.33 1.532 14.512 2.749 15.29L5.526 21Z" fillOpacity="0.2"/>
                  </svg>
                </div>
                <p className="text-lg text-stone-700 leading-relaxed mb-8 font-serif italic">"{test.quote}"</p>
                <div>
                  <p className="font-bold text-stone-900">{test.name}</p>
                  <p className="text-sm text-stone-500">{test.loc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Callback CTA */}
      <section className="py-24 bg-[#7A9E7E] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-6 font-bold">Ready to Get Started?</h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed font-light">
              Speak with our care coordinators today. We'll help assess your needs and design a personalized care plan for your loved one.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-white text-[#C4714F] hover:bg-stone-50 px-8 py-4 rounded-full text-lg font-bold transition-all shadow-lg">
                Book Your Free Callback
              </button>
              <button className="bg-transparent border border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full text-lg font-medium transition-all">
                Call (800) 555-0199
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2D2D2D] text-white py-16 md:py-24 border-t border-stone-800">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
            
            {/* Brand */}
            <div className="lg:pr-8">
              <div className="flex items-center gap-2 mb-6">
                <Heart className="w-6 h-6 text-[#7A9E7E] fill-current" />
                <span className="font-serif text-2xl font-bold tracking-wide">SOLACE</span>
              </div>
              <p className="text-stone-400 leading-relaxed mb-6">
                Providing compassionate, professional homecare services that treat every client like family.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:bg-[#7A9E7E] hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:bg-[#7A9E7E] hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:bg-[#7A9E7E] hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-6 font-serif">Quick Links</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-stone-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-stone-400 hover:text-white transition-colors">Our Services</a></li>
                <li><a href="#" className="text-stone-400 hover:text-white transition-colors">Caregiver Team</a></li>
                <li><a href="#" className="text-stone-400 hover:text-white transition-colors">Testimonials</a></li>
                <li><a href="#" className="text-stone-400 hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-bold mb-6 font-serif">Services</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-stone-400 hover:text-white transition-colors">Home Nursing Care</a></li>
                <li><a href="#" className="text-stone-400 hover:text-white transition-colors">Personal Care</a></li>
                <li><a href="#" className="text-stone-400 hover:text-white transition-colors">Medication Management</a></li>
                <li><a href="#" className="text-stone-400 hover:text-white transition-colors">Companionship</a></li>
                <li><a href="#" className="text-stone-400 hover:text-white transition-colors">Respite Care</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-bold mb-6 font-serif">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#7A9E7E] shrink-0 mt-1" />
                  <span className="text-stone-400">1234 Healing Way, Suite 100<br />Portland, OR 97205</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#7A9E7E] shrink-0" />
                  <span className="text-stone-400">(800) 555-0199</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#7A9E7E] shrink-0" />
                  <span className="text-stone-400">hello@solacecare.com</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-stone-500 text-sm">© {new Date().getFullYear()} Solace Homecare. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-stone-500">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}