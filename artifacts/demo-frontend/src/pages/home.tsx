import { Nav } from "@/components/layout/nav";
import { WhatsappButton } from "@/components/ui/whatsapp-button";
import { motion } from "framer-motion";
import patternImg from "@/assets/pattern.png";
import heroImg from "@/assets/hero-person.png";
import careImg from "@/assets/care.png";
import { ArrowRight, CheckCircle2, Heart, Users, Home, PhoneCall, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useGetClientBranding } from "@workspace/api-client-react";

export default function HomePage() {
  const { data: branding } = useGetClientBranding("dosteli");

  return (
    <div className="min-h-screen bg-background">
      <Nav logoUrl={branding?.logoUrl} demoLanguage={branding?.demoLanguage} />
      
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-primary pt-12 lg:pt-0 lg:h-[calc(100vh-80px)] flex items-center">
        {/* Pattern Background */}
        <div 
          className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-multiply"
          style={{ 
            backgroundImage: `url(${patternImg})`,
            backgroundSize: '400px'
          }}
        />
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 h-full">
          <div className="flex flex-col lg:flex-row items-center justify-between h-full gap-12">
            
            {/* Left Content */}
            <motion.div 
              className="flex-1 text-primary-foreground max-w-2xl py-12 lg:py-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white drop-shadow-sm">
                Kulturspezifisch<br/>pflegen.
              </h1>
              <p className="text-xl md:text-2xl font-medium mb-10 text-white/90 max-w-lg">
                Vertraute Pflege für Ihre Familie in einer Umgebung, die Sprache, Kultur und Religion respektiert.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg h-14 px-8 rounded-full shadow-lg" data-testid="button-consultation">
                  Beratung anfordern
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 text-lg h-14 px-8 rounded-full" data-testid="button-learn-more">
                  Mehr erfahren
                </Button>
              </div>

              <div className="mt-16 flex items-center gap-4 bg-black/10 p-4 rounded-2xl backdrop-blur-sm max-w-md border border-white/20">
                <div className="flex -space-x-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-primary bg-secondary flex items-center justify-center text-secondary-foreground font-bold overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=dosteli${i}&backgroundColor=123012`} alt="Team member" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-bold text-lg text-white">Unser Team</p>
                  <p className="text-sm text-white/80">Türkisch & Arabisch sprechend</p>
                </div>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div 
              className="flex-1 relative h-full w-full flex items-end justify-center lg:justify-end"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative w-full max-w-lg h-[500px] lg:h-[90%] mt-auto flex items-end">
                <img 
                  src={heroImg} 
                  alt="Pflegekraft von Dosteli" 
                  className="w-full h-full object-contain object-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-10"
                />
                
                {/* Floating Label */}
                <div className="absolute bottom-12 -left-6 lg:left-0 bg-white text-secondary p-4 rounded-2xl shadow-xl z-20 animate-in fade-in zoom-in slide-in-from-bottom-4 duration-700 delay-500">
                  <p className="font-bold text-lg">Fatma Y.</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Pflegedienstleitung
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="leistungen" className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-secondary mb-6">Unsere Leistungen</h2>
            <p className="text-lg text-muted-foreground">Wir bieten umfassende, kultursensible Pflegedienstleistungen für ein würdevolles Leben im Alter.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ServiceCard 
              icon={<Home className="w-10 h-10 text-primary" />}
              title="Demenzpflege WG"
              description="Eine familiäre Wohngemeinschaft für demenzerkrankte Menschen mit 24/7 Betreuung durch muttersprachliches Personal."
            />
            <ServiceCard 
              icon={<Heart className="w-10 h-10 text-primary" />}
              title="Häusliche Pflege"
              description="Medizinische und pflegerische Versorgung in den eigenen vier Wänden. Vertraut, sicher und respektvoll."
            />
            <ServiceCard 
              icon={<Users className="w-10 h-10 text-primary" />}
              title="24h Betreuung"
              description="Rund-um-die-Uhr Betreuung für maximale Sicherheit und Geborgenheit im eigenen Zuhause."
            />
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section id="demenz-wg" className="py-24 bg-muted overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-primary/20 transform -rotate-6 rounded-3xl"></div>
              <img src={careImg} alt="Kultursensible Pflege" className="relative rounded-3xl shadow-xl w-full object-cover aspect-square md:aspect-[4/3]" />
            </div>
            <div className="flex-1">
              <h2 className="text-4xl font-bold text-secondary mb-6 tracking-tight">Geborgenheit durch kulturelle Nähe</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Für Menschen mit Demenz ist die Muttersprache und eine vertraute kulturelle Umgebung essenziell. In unserer Demenz-WG in Berlin schaffen wir ein Zuhause, das genau das bietet.
              </p>
              <ul className="space-y-4 mb-8">
                {["Muttersprachliches Pflegepersonal (TR/AR)", "Kulturspezifische Mahlzeiten (Helal)", "Berücksichtigung religiöser Feiertage", "Familienfreundliche Besuchszeiten"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-secondary font-medium text-lg">
                    <CheckCircle2 className="text-primary w-6 h-6 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button className="rounded-full h-14 px-8 text-lg group bg-secondary hover:bg-secondary/90 text-white" data-testid="button-wg-request">
                WG Plätze anfragen
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Über uns Section */}
      <section id="uber-uns" className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-secondary mb-6">Über Dosteli</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Dosteli ist ein familiengeführter Pflegedienst mit Sitz in Berlin. Wir wurden gegründet, um die Versorgungslücke für türkisch- und arabischsprachige Familien in Deutschland zu schließen. Unser Team aus über 30 mehrsprachigen Fachkräften begleitet täglich mehr als 150 Pflegebedürftige.
          </p>
          <div className="flex justify-center gap-12 mt-10">
            {[["150+", "Pflegebedürftige"], ["30+", "Fachkräfte"], ["10+", "Jahre Erfahrung"]].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="text-4xl font-extrabold text-primary">{num}</div>
                <div className="text-sm font-medium text-muted-foreground mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section id="jobs" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-secondary mb-6">Karriere bei Dosteli</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Wir suchen engagierte Pflegefachkräfte mit Herz und kulturellem Verständnis. Türkisch- oder Arabischkenntnisse sind von Vorteil — aber nicht Voraussetzung.
          </p>
          <Button size="lg" className="rounded-full h-14 px-8 text-lg bg-secondary hover:bg-secondary/90 text-white" data-testid="button-jobs">
            Jetzt bewerben
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-3xl font-extrabold tracking-tight text-white">DOSTELI</span>
                <Moon className="h-6 w-6 fill-destructive text-destructive" aria-hidden="true" />
              </div>
              <p className="text-secondary-foreground/70 max-w-sm mb-6 text-lg">
                Kulturspezifischer Pflegedienst in Berlin. Wir pflegen mit Respekt, Würde und kulturellem Verständnis.
              </p>
              <div className="flex items-center gap-2 text-primary font-bold text-xl">
                <PhoneCall className="w-6 h-6" />
                <span>030 / 123 456 78</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4 text-white">Navigation</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-secondary-foreground/70 hover:text-white transition-colors">Startseite</a></li>
                <li><a href="#leistungen" className="text-secondary-foreground/70 hover:text-white transition-colors">Leistungen</a></li>
                <li><a href="#demenz-wg" className="text-secondary-foreground/70 hover:text-white transition-colors">Demenz WG</a></li>
                <li><a href="#" className="text-secondary-foreground/70 hover:text-white transition-colors">Karriere</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4 text-white">Demo Links</h4>
              <ul className="space-y-3">
                <li><Link href="/dashboard" className="text-primary hover:text-primary/80 font-semibold flex items-center gap-1" data-testid="link-footer-dashboard">Live-Dashboard <ArrowRight className="w-4 h-4" /></Link></li>
                <li><Link href="/mockups" className="text-primary hover:text-primary/80 font-semibold flex items-center gap-1" data-testid="link-footer-mockups">Anzeigen-Mockups <ArrowRight className="w-4 h-4" /></Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-white/10 text-center text-secondary-foreground/50 text-sm font-medium">
            © {new Date().getFullYear()} Dosteli Pflegedienst GmbH. System Demo.
          </div>
        </div>
      </footer>

      <WhatsappButton />
    </div>
  );
}

function ServiceCard({ title, description, icon }: { title: string, description: string, icon: React.ReactNode }) {
  return (
    <div className="bg-card border rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 duration-300 group">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
        <div className="text-primary group-hover:text-white transition-colors">
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-secondary mb-4">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-lg">{description}</p>
    </div>
  );
}
