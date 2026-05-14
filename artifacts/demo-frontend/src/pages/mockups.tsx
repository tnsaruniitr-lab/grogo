import { Nav } from "@/components/layout/nav";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, MoreVertical, Phone, Video, Heart } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import patternImg from "@/assets/pattern.png";
import careImg from "@/assets/care.png";

export default function MockupsPage() {
  return (
    <div className="min-h-screen bg-muted/50 flex flex-col">
      <Nav />
      
      <div className="flex-1 py-16">
        <div className="container mx-auto px-4 md:px-8">
          
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-secondary mb-6 tracking-tight">Ad & Product Mockups</h1>
            <p className="text-xl text-muted-foreground font-medium">Visual showcases for the pitch deck and client presentations. Ready for your slides.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 items-start max-w-7xl mx-auto">
            
            {/* Phone Mockup */}
            <div className="flex flex-col items-center gap-6">
              <div className="bg-white px-6 py-2 rounded-full shadow-sm border font-bold text-secondary text-sm tracking-wide uppercase">WhatsApp Bot Demo</div>
              
              <div className="w-[320px] h-[650px] bg-black rounded-[3rem] border-[12px] border-slate-900 shadow-2xl relative overflow-hidden flex flex-col transform hover:-translate-y-2 transition-transform duration-500">
                {/* Notch */}
                <div className="absolute top-0 inset-x-0 h-6 bg-black z-20 flex justify-center rounded-b-2xl w-36 mx-auto"></div>
                
                {/* WA Header */}
                <div className="bg-[#075E54] text-white pt-12 pb-3 px-4 flex items-center gap-3 z-10 shadow-md relative">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#075E54] font-bold overflow-hidden border-2 border-white/20">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=dosteli&backgroundColor=ffffff`} className="w-full" alt="Bot Avatar" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-base leading-tight">Dosteli Pflege</h4>
                    <p className="text-[11px] text-white/80 font-medium">Business Account</p>
                  </div>
                  <Video className="w-5 h-5 opacity-80" />
                  <Phone className="w-5 h-5 ml-1 opacity-80" />
                  <MoreVertical className="w-5 h-5 ml-1 opacity-80" />
                </div>

                {/* Chat Area */}
                <div className="flex-1 bg-[#ECE5DD] relative overflow-y-auto p-4 flex flex-col gap-3 no-scrollbar" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: 'cover', backgroundBlendMode: 'overlay', backgroundColor: 'rgba(236, 229, 221, 0.95)' }}>
                  
                  <div className="bg-[#E1F5FE] text-[#128C7E] text-[10px] uppercase tracking-wider font-extrabold mx-auto px-4 py-1.5 rounded-lg mb-3 shadow-sm border border-blue-100">
                    Today
                  </div>

                  <Tabs defaultValue="de" className="w-full">
                    <div className="flex justify-center mb-6 sticky top-0 z-10">
                      <TabsList className="bg-white/90 backdrop-blur-md shadow-sm h-10 border border-slate-200 rounded-full p-1">
                        <TabsTrigger value="de" className="text-xs font-bold px-4 rounded-full">Deutsch</TabsTrigger>
                        <TabsTrigger value="tr" className="text-xs font-bold px-4 rounded-full">Türkçe</TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <TabsContent value="de" className="flex flex-col gap-3 mt-0">
                      <OutboundMsg text="Hallo, ich suche Pflege für meine Mutter in Berlin." time="10:42" />
                      <InboundMsg text="Hallo! Ich helfe Ihnen gerne. Welche Art von Pflege suchen Sie — häusliche Pflege oder eine Demenzpflege-WG?" time="10:42" />
                      <OutboundMsg text="Sie hat Demenz. Wir suchen eine Demenz-WG in Berlin." time="10:44" />
                      <InboundMsg text="Verstanden. Unsere Demenz-WG in Berlin bietet eine kulturell vertraute Umgebung und türkischsprachiges Personal. Soll ich Ihnen einen Rückruf von unserem Team einrichten?" time="10:44" />
                      <OutboundMsg text="Ja, bitte. Morgen früh wäre gut." time="10:45" />
                      <InboundMsg text="Perfekt! Ich habe einen Rückruf für morgen früh eingerichtet. Unser Team wird Sie kontaktieren. ✓" time="10:45" />
                    </TabsContent>

                    <TabsContent value="tr" className="flex flex-col gap-3 mt-0">
                      <OutboundMsg text="Merhaba, annem için bakım arıyorum." time="11:15" />
                      <InboundMsg text="Merhaba! Size yardımcı olmaktan memnuniyet duyarım. Hangi tür bakımı arıyorsunuz — evde bakım mı yoksa demans hastaları için özel bakım evimiz mi?" time="11:15" />
                      <OutboundMsg text="Demans hastası. Berlin'de bir demans bakım evi arıyoruz." time="11:17" />
                      <InboundMsg text="Anlıyorum. Berlin'deki demans bakım evimiz kültürel olarak tanıdık bir ortam ve Türkçe konuşan personel sunmaktadır. Ekibimizin sizi araması için bir randevu ayarlayayım mı?" time="11:17" />
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Input Area */}
                <div className="bg-[#f0f0f0] p-2.5 flex items-center gap-2">
                  <div className="flex-1 bg-white rounded-full h-11 px-5 flex items-center text-slate-400 text-sm font-medium border border-slate-200 shadow-inner">
                    Nachricht...
                  </div>
                  <div className="w-11 h-11 bg-[#00897B] rounded-full flex items-center justify-center text-white shadow-md">
                    <MessageCircle className="w-5 h-5 fill-current" />
                  </div>
                </div>
              </div>
            </div>

            {/* IG Story */}
            <div className="flex flex-col items-center gap-6">
              <div className="bg-white px-6 py-2 rounded-full shadow-sm border font-bold text-secondary text-sm tracking-wide uppercase">Instagram Story Ad</div>
              
              <div className="w-[320px] h-[568px] rounded-[2rem] shadow-2xl overflow-hidden relative bg-primary flex flex-col group border-[6px] border-white transform hover:-translate-y-2 transition-transform duration-500">
                {/* Pattern */}
                <div 
                  className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply"
                  style={{ backgroundImage: `url(${patternImg})`, backgroundSize: '200px' }}
                />
                
                {/* Story Chrome */}
                <div className="absolute top-0 inset-x-0 p-5 z-20 bg-gradient-to-b from-black/60 via-black/30 to-transparent">
                  <div className="flex gap-1.5 mb-3">
                    <div className="h-0.5 flex-1 bg-white/40 rounded-full overflow-hidden">
                      <div className="h-full bg-white w-1/3 rounded-full"></div>
                    </div>
                    <div className="h-0.5 flex-1 bg-white/40 rounded-full"></div>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-sm">
                       <span className="text-secondary font-extrabold text-[11px] tracking-tight">DOSTELI</span>
                    </div>
                    <span className="font-bold text-sm text-white drop-shadow-md">dosteli.pflege</span>
                  </div>
                </div>

                <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 text-center mt-10">
                  <div className="bg-white p-5 rounded-full mb-8 shadow-xl rotate-3 group-hover:rotate-6 group-hover:scale-110 transition-all duration-300">
                     <Heart className="w-14 h-14 text-destructive fill-destructive" />
                  </div>
                  
                  <h2 className="text-3xl font-extrabold text-white leading-[1.1] mb-5 drop-shadow-md">
                    Kulturell vertraute Pflege für Ihre Familie
                  </h2>
                  <p className="text-white font-medium text-lg mb-8 drop-shadow-sm opacity-90">
                    Jetzt kostenlos per WhatsApp beraten lassen
                  </p>
                </div>

                <div className="absolute bottom-8 inset-x-5 z-20">
                  <div className="bg-white text-secondary font-extrabold text-lg text-center py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 hover:scale-105 transition-transform cursor-pointer border border-white/50 backdrop-blur-sm">
                    Jetzt anfragen <ArrowRight className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>

            {/* WA Ad */}
            <div className="flex flex-col items-center gap-6">
              <div className="bg-white px-6 py-2 rounded-full shadow-sm border font-bold text-secondary text-sm tracking-wide uppercase">Meta Click-to-WhatsApp</div>
              
              <Card className="w-[320px] overflow-hidden shadow-2xl border-0 bg-white rounded-2xl transform hover:-translate-y-2 transition-transform duration-500">
                <div className="h-52 relative overflow-hidden bg-primary/20">
                  <img src={careImg} className="w-full h-full object-cover object-center mix-blend-multiply" alt="Pflege" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#123012]/80 via-[#123012]/30 to-transparent flex flex-col justify-end p-5">
                     <span className="text-white font-extrabold text-2xl leading-tight drop-shadow-md">Pflege für Ihre Familie</span>
                  </div>
                </div>
                <CardContent className="p-5 bg-white">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Dosteli Pflegedienst</p>
                      <h4 className="font-bold text-secondary text-base leading-snug">Lassen Sie sich jetzt kostenlos und unverbindlich beraten.</h4>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white border-0 shadow-md font-bold h-12 text-base rounded-xl transition-colors">
                    <FaWhatsapp className="w-6 h-6 mr-2" />
                    Nachricht senden
                  </Button>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function InboundMsg({ text, time }: { text: string, time: string }) {
  return (
    <div className="self-start max-w-[85%]">
      <div className="bg-white rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm shadow-sm text-slate-800 font-medium leading-snug relative border border-slate-100">
        {text}
      </div>
      <span className="text-[10px] text-slate-500 mt-1 ml-1 font-bold">{time}</span>
    </div>
  );
}

function OutboundMsg({ text, time }: { text: string, time: string }) {
  return (
    <div className="self-end max-w-[85%]">
      <div className="bg-[#dcf8c6] rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-sm shadow-sm text-slate-900 font-medium leading-snug relative">
        {text}
      </div>
      <span className="text-[10px] text-slate-500 mt-1 mr-1 block text-right font-bold">{time}</span>
    </div>
  );
}
