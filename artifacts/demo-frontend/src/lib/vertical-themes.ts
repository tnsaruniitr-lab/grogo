export type ThemeLang = "de" | "en" | "tr";

export interface BotMessage {
  from: "bot" | "user";
  text: string;
}

export interface HowStep {
  title: string;
  desc: string;
}

export interface VerticalTheme {
  key: string;
  howTitle: Record<ThemeLang, (name: string) => string>;
  howSubtitle: Record<ThemeLang, string>;
  ctaTitle: Record<ThemeLang, (name: string) => string>;
  ctaSubtitle: Record<ThemeLang, string>;
  ctaButton: Record<ThemeLang, string>;
  botMessages: Record<ThemeLang, BotMessage[]>;
  steps: Record<ThemeLang, HowStep[]>;
  industryKeys: string[];
}

const VERTICAL_THEMES: Record<string, VerticalTheme> = {
  "real-estate": {
    key: "real-estate",
    howTitle: {
      en: (name) => `${name}, Available 24/7 for Property Enquiries`,
      de: (name) => `${name}, Rund um die Uhr für Ihre Immobilienanfragen`,
      tr: (name) => `${name}, Gayrimenkul Sorularınız için 7/24 Hizmetinizdeyiz`,
    },
    howSubtitle: {
      en: "Message us on WhatsApp with your requirements and get matched to available properties instantly.",
      de: "Senden Sie uns Ihre Anforderungen per WhatsApp und wir vermitteln Ihnen passende Immobilien sofort.",
      tr: "WhatsApp'tan gereksinimlerinizi gönderin, uygun mülkleri anında eşleştirelim.",
    },
    ctaTitle: {
      en: (name) => `Ready to find your next property with ${name}?`,
      de: (name) => `Bereit, Ihre nächste Immobilie mit ${name} zu finden?`,
      tr: (name) => `${name} ile bir sonraki mülkünüzü bulmaya hazır mısınız?`,
    },
    ctaSubtitle: {
      en: "Message us now and a qualified agent will be in touch within minutes.",
      de: "Schreiben Sie uns jetzt, ein erfahrener Makler meldet sich innerhalb von Minuten.",
      tr: "Şimdi yazın, nitelikli bir danışman dakikalar içinde sizinle iletişime geçsin.",
    },
    ctaButton: {
      en: "Schedule a Showing",
      de: "Besichtigung buchen",
      tr: "Gezi Planla",
    },
    botMessages: {
      en: [
        { from: "bot", text: "Hi! I'm the AI assistant. Are you looking to buy, rent, or sell a property?" },
        { from: "user", text: "I'm looking to rent, 2-bedroom apartment, ideally central" },
        { from: "bot", text: "Perfect. What's your monthly budget? I'll match you with available listings and get an agent to follow up." },
      ],
      de: [
        { from: "bot", text: "Hallo! Ich bin der KI-Assistent. Suchen Sie zum Kaufen, Mieten oder möchten Sie verkaufen?" },
        { from: "user", text: "Ich suche eine 2-Zimmer-Wohnung zur Miete, möglichst zentral" },
        { from: "bot", text: "Kein Problem. Wie hoch ist Ihr monatliches Budget? Ich vermittle Ihnen passende Angebote und lasse Sie kontaktieren." },
      ],
      tr: [
        { from: "bot", text: "Merhaba! Ben yapay zeka asistanım. Satın almak, kiralamak veya satmak mı istiyorsunuz?" },
        { from: "user", text: "2+1 kiralık daire arıyorum, tercihen merkezi bir konumda" },
        { from: "bot", text: "Harika. Aylık bütçeniz ne kadar? Size uygun ilanları eşleştirelim ve bir danışman sizinle iletişime geçsin." },
      ],
    },
    steps: {
      en: [
        { title: "Enquiry Captured", desc: "A prospect messages your WhatsApp with their property requirements." },
        { title: "AI Qualifies", desc: "Location, budget, timeline, and property type captured instantly, no form needed." },
        { title: "Showing Booked", desc: "Agent notified with a full brief. Viewing scheduled in seconds." },
      ],
      de: [
        { title: "Anfrage eingegangen", desc: "Ein Interessent schreibt Ihnen auf WhatsApp mit seinen Immobilienwünschen." },
        { title: "KI qualifiziert", desc: "Lage, Budget, Zeitrahmen und Objekttyp werden sofort erfasst, kein Formular nötig." },
        { title: "Besichtigung gebucht", desc: "Makler erhält ein vollständiges Briefing. Termin in Sekunden vereinbart." },
      ],
      tr: [
        { title: "Talep Alındı", desc: "Potansiyel müşteri WhatsApp'ınıza gayrimenkul gereksinimlerini yazıyor." },
        { title: "Yapay Zeka Nitelendiriyor", desc: "Konum, bütçe, zaman çizelgesi ve mülk tipi anında yakalanıyor, form gerekmiyor." },
        { title: "Gezi Rezervasyonu", desc: "Danışman tam bir brifingle bilgilendiriliyor. Randevu saniyeler içinde ayarlanıyor." },
      ],
    },
    industryKeys: ["real-estate", "residential", "commercial", "leasing", "property-management"],
  },

  agencies: {
    key: "agencies",
    howTitle: {
      en: (name) => `How ${name} uses AI to close more clients`,
      de: (name) => `Wie ${name} mit KI mehr Kunden gewinnt`,
      tr: (name) => `${name} daha fazla müşteri kazanmak için yapay zekayı nasıl kullanır`,
    },
    howSubtitle: {
      en: "Capture every inbound lead on WhatsApp, qualify them automatically, and book strategy calls, without lifting a finger.",
      de: "Erfassen Sie jeden eingehenden Lead auf WhatsApp, qualifizieren Sie ihn automatisch und buchen Sie Strategiegespräche, ohne Aufwand.",
      tr: "WhatsApp'taki her gelen talebi yakalayın, otomatik olarak nitelendirin ve strateji görüşmeleri rezervasyonu yapın, hiç efor harcamadan.",
    },
    ctaTitle: {
      en: (name) => `See how ${name} turns DMs into booked calls`,
      de: (name) => `Sehen Sie, wie ${name} Nachrichten in gebuchte Termine verwandelt`,
      tr: (name) => `${name}'nin mesajları rezervasyonlu görüşmelere nasıl dönüştürdüğünü görün`,
    },
    ctaSubtitle: {
      en: "White-label AI lead follow-up, deployed for your clients in days, not months.",
      de: "White-Label-KI-Lead-Follow-up, in Tagen, nicht Monaten, für Ihre Kunden bereitgestellt.",
      tr: "Beyaz etiketli yapay zeka lead takibi, müşterilerinize aylar değil günler içinde kurulabilir.",
    },
    ctaButton: {
      en: "Book a Strategy Call",
      de: "Strategiegespräch buchen",
      tr: "Strateji Görüşmesi Al",
    },
    botMessages: {
      en: [
        { from: "bot", text: "Hi! What kind of business are you looking to grow, and what's your biggest marketing challenge right now?" },
        { from: "user", text: "E-commerce store, mainly struggling with lead follow-up speed" },
        { from: "bot", text: "That's exactly what we fix. I can book you a free strategy call, what day works best for you?" },
      ],
      de: [
        { from: "bot", text: "Hallo! Was für ein Unternehmen möchten Sie ausbauen und was ist Ihre größte Marketing-Herausforderung?" },
        { from: "user", text: "Online-Shop, hauptsächlich Probleme mit der schnellen Lead-Nachverfolgung" },
        { from: "bot", text: "Genau das lösen wir. Ich kann Ihnen ein kostenloses Strategiegespräch buchen, welcher Tag passt Ihnen?" },
      ],
      tr: [
        { from: "bot", text: "Merhaba! Ne tür bir işletmeyi büyütmek istiyorsunuz ve en büyük pazarlama zorluğunuz nedir?" },
        { from: "user", text: "E-ticaret mağazası, özellikle lead takip hızında sorun yaşıyorum" },
        { from: "bot", text: "Tam olarak bunu çözüyoruz. Size ücretsiz bir strateji görüşmesi ayarlayabilirim, hangi gün uygundur?" },
      ],
    },
    steps: {
      en: [
        { title: "Lead Captured", desc: "A business owner messages your WhatsApp describing their marketing challenge." },
        { title: "AI Qualifies", desc: "Business type, goals, current spend, and urgency assessed instantly." },
        { title: "Strategy Call Booked", desc: "Client handed to your team fully briefed, no cold outreach needed." },
      ],
      de: [
        { title: "Lead erfasst", desc: "Ein Unternehmer schreibt auf WhatsApp über seine Marketing-Herausforderung." },
        { title: "KI qualifiziert", desc: "Unternehmenstyp, Ziele, Budget und Dringlichkeit werden sofort bewertet." },
        { title: "Strategiegespräch gebucht", desc: "Kunde mit vollständigem Briefing an Ihr Team übergeben, kein Cold Outreach nötig." },
      ],
      tr: [
        { title: "Lead Yakalandı", desc: "Bir işletme sahibi pazarlama sorununuzu WhatsApp'tan bildiriyor." },
        { title: "Yapay Zeka Nitelendiriyor", desc: "İşletme türü, hedefler, mevcut harcama ve aciliyet anında değerlendiriliyor." },
        { title: "Strateji Görüşmesi Rezervasyonu", desc: "Müşteri tam bir brifingle ekibinize teslim ediliyor, soğuk satış yok." },
      ],
    },
    industryKeys: ["agencies", "digital-marketing", "seo", "social-media", "creative-agency", "pr"],
  },

  coaches: {
    key: "coaches",
    howTitle: {
      en: (name) => `How ${name} converts DMs into booked discovery calls`,
      de: (name) => `Wie ${name} Nachrichten in gebuchte Kennenlern-Calls verwandelt`,
      tr: (name) => `${name} mesajları rezervasyonlu keşif görüşmelerine nasıl dönüştürüyor`,
    },
    howSubtitle: {
      en: "Your AI assistant pre-qualifies every enquiry and books only serious, ready-to-invest prospects into your calendar.",
      de: "Ihr KI-Assistent qualifiziert jede Anfrage vor und bucht nur ernsthafte, investitionsbereite Interessenten in Ihren Kalender.",
      tr: "Yapay zeka asistanınız her sorguyu önceden nitelendiriyor ve yalnızca ciddi, yatırıma hazır potansiyel müşterileri takviminize rezerve ediyor.",
    },
    ctaTitle: {
      en: (name) => `Stop losing high-ticket leads to slow follow-up, let ${name} do it for you`,
      de: (name) => `Hören Sie auf, hochwertige Leads durch langsame Nachverfolgung zu verlieren, ${name} erledigt das für Sie`,
      tr: (name) => `Yavaş takip yüzünden premium müşteri adaylarını kaybetmeyin, ${name} bunu sizin için yapsın`,
    },
    ctaSubtitle: {
      en: "Respond to every enquiry in seconds, qualify automatically, and fill your calendar with ready buyers.",
      de: "Antworten Sie auf jede Anfrage in Sekunden, qualifizieren Sie automatisch und füllen Sie Ihren Kalender mit kaufbereiten Interessenten.",
      tr: "Her soruya saniyeler içinde yanıt verin, otomatik olarak nitelendirin ve takviminizi hazır alıcılarla doldurun.",
    },
    ctaButton: {
      en: "Book a Discovery Call",
      de: "Kennenlerngespräch buchen",
      tr: "Keşif Görüşmesi Al",
    },
    botMessages: {
      en: [
        { from: "bot", text: "Hi! I'm here to help. What's your biggest challenge right now, the one keeping you up at night?" },
        { from: "user", text: "I can't scale past 1-on-1 clients. I want to build a group programme but don't know how to start." },
        { from: "bot", text: "That's a great problem to have! I'd love to book you a free discovery call with our team. When works for you?" },
      ],
      de: [
        { from: "bot", text: "Hallo! Was ist Ihre größte Herausforderung gerade, die, die Sie nachts wachhält?" },
        { from: "user", text: "Ich komme über 1:1-Klienten nicht hinaus. Ich möchte ein Gruppprogramm aufbauen, weiß aber nicht wie." },
        { from: "bot", text: "Das ist ein tolles Problem! Ich würde gerne ein kostenloses Kennenlerngespräch für Sie buchen. Wann passt es?" },
      ],
      tr: [
        { from: "bot", text: "Merhaba! Şu an en büyük zorluğunuz nedir, sizi geceleri uyutan şey?" },
        { from: "user", text: "Bire bir müşterilerden ölçeklenemiyorum. Bir grup programı oluşturmak istiyorum ama nasıl başlayacağımı bilmiyorum." },
        { from: "bot", text: "Bu harika bir sorun! Ekibimizle ücretsiz bir keşif görüşmesi ayarlayayım. Sizin için ne zaman uygun?" },
      ],
    },
    steps: {
      en: [
        { title: "DM or Form Received", desc: "A prospect reaches out via WhatsApp describing their goal or challenge." },
        { title: "AI Pre-Qualifies", desc: "Goals, timeline, investment capacity, and programme fit assessed, all before the call." },
        { title: "Discovery Call Booked", desc: "Prospect handed to your sales team ready to enrol. No wasted calls." },
      ],
      de: [
        { title: "Nachricht empfangen", desc: "Ein Interessent wendet sich über WhatsApp mit seinem Ziel oder seiner Herausforderung." },
        { title: "KI qualifiziert vor", desc: "Ziele, Zeitrahmen, Investitionsbereitschaft und Programmeignung bewertet, alles vor dem Call." },
        { title: "Kennenlerngespräch gebucht", desc: "Interessent bereit zum Kauf an Ihr Vertriebsteam übergeben. Keine vergeudeten Calls." },
      ],
      tr: [
        { title: "Mesaj veya Form Alındı", desc: "Bir potansiyel müşteri hedefini veya zorluğunu WhatsApp'tan bildiriyor." },
        { title: "Yapay Zeka Önceden Nitelendiriyor", desc: "Hedefler, zaman çizelgesi, yatırım kapasitesi ve program uyumu görüşmeden önce değerlendiriliyor." },
        { title: "Keşif Görüşmesi Rezervasyonu", desc: "Potansiyel müşteri kayıt olmaya hazır şekilde satış ekibinize teslim ediliyor." },
      ],
    },
    industryKeys: ["coaching", "consulting", "online-courses", "mentoring", "advisor"],
  },

  "home-services": {
    key: "home-services",
    howTitle: {
      en: (name) => `How ${name} captures and books every job lead instantly`,
      de: (name) => `Wie ${name} jeden Auftragsinteressenten sofort erfasst und bucht`,
      tr: (name) => `${name} her iş talebini anında nasıl yakalıyor ve rezerve ediyor`,
    },
    howSubtitle: {
      en: "Never miss a job enquiry again. Every WhatsApp message is answered instantly, qualified, and booked, even at 11 PM.",
      de: "Verpassen Sie nie mehr eine Auftragsanfrage. Jede WhatsApp-Nachricht wird sofort beantwortet, qualifiziert und gebucht, auch um 23 Uhr.",
      tr: "Artık hiçbir iş talebini kaçırmayın. Her WhatsApp mesajı anında yanıtlanıyor, nitelendiriliyor ve rezerve ediliyor, gece 23:00'te bile.",
    },
    ctaTitle: {
      en: (name) => `Start filling your schedule with qualified jobs from ${name}`,
      de: (name) => `Beginnen Sie, Ihren Terminplan mit qualifizierten Aufträgen von ${name} zu füllen`,
      tr: (name) => `${name}'den nitelikli işlerle programınızı doldurmaya başlayın`,
    },
    ctaSubtitle: {
      en: "Your AI assistant works 24/7, capturing, qualifying, and booking high-value job leads while you focus on the work.",
      de: "Ihr KI-Assistent arbeitet rund um die Uhr, er erfasst, qualifiziert und bucht hochwertige Aufträge, während Sie arbeiten.",
      tr: "Yapay zeka asistanınız 7/24 çalışıyor, siz işe odaklanırken yüksek değerli iş taleplerini yakalıyor, nitelendiriyor ve rezerve ediyor.",
    },
    ctaButton: {
      en: "Get a Free Quote",
      de: "Kostenloses Angebot",
      tr: "Ücretsiz Teklif Al",
    },
    botMessages: {
      en: [
        { from: "bot", text: "Hi! Thanks for reaching out. What service do you need help with today?" },
        { from: "user", text: "My roof took some damage in the storm last week, need an inspection" },
        { from: "bot", text: "Got it. Is this a residential or commercial property? I can book a free inspection this week." },
      ],
      de: [
        { from: "bot", text: "Hallo! Danke für Ihre Nachricht. Welchen Service benötigen Sie heute?" },
        { from: "user", text: "Mein Dach hat beim letzten Sturm Schäden genommen, ich brauche eine Inspektion" },
        { from: "bot", text: "Verstanden. Ist es ein Wohn- oder Gewerbeobjekt? Ich kann diese Woche eine kostenlose Inspektion buchen." },
      ],
      tr: [
        { from: "bot", text: "Merhaba! Ulaştığınız için teşekkürler. Bugün hangi hizmet konusunda yardıma ihtiyacınız var?" },
        { from: "user", text: "Geçen haftaki fırtınada çatım hasar gördü, bir inceleme gerekiyor" },
        { from: "bot", text: "Anladım. Konut mu yoksa ticari mülk mü? Bu hafta ücretsiz bir inceleme ayarlayabilirim." },
      ],
    },
    steps: {
      en: [
        { title: "Job Enquiry Received", desc: "A homeowner messages your WhatsApp describing their problem or need." },
        { title: "AI Qualifies", desc: "Service type, property details, urgency, and location captured instantly." },
        { title: "Assessment Booked", desc: "Your crew gets a fully briefed job lead with contact details, ready to go." },
      ],
      de: [
        { title: "Auftragsanfrage eingegangen", desc: "Ein Hausbesitzer schreibt auf WhatsApp über sein Problem oder seinen Bedarf." },
        { title: "KI qualifiziert", desc: "Leistungsart, Objektdetails, Dringlichkeit und Standort werden sofort erfasst." },
        { title: "Einsatz gebucht", desc: "Ihr Team erhält einen vollständig aufbereiteten Auftrag mit Kontaktdaten, bereit zum Start." },
      ],
      tr: [
        { title: "İş Talebi Alındı", desc: "Bir ev sahibi sorununu veya ihtiyacını WhatsApp'tan bildiriyor." },
        { title: "Yapay Zeka Nitelendiriyor", desc: "Hizmet türü, mülk ayrıntıları, aciliyet ve konum anında yakalanıyor." },
        { title: "Değerlendirme Rezervasyonu", desc: "Ekibiniz iletişim bilgileriyle birlikte tam brifingle hazır bir iş talebi alıyor." },
      ],
    },
    industryKeys: ["roofing", "hvac", "solar", "remodeling", "pest-control", "landscaping", "plumbing", "electrical", "home-services"],
  },

  "professional-services": {
    key: "professional-services",
    howTitle: {
      en: (name) => `How ${name} handles every enquiry before the first call`,
      de: (name) => `Wie ${name} jede Anfrage vor dem ersten Gespräch bearbeitet`,
      tr: (name) => `${name} her soruyu ilk görüşmeden önce nasıl işliyor`,
    },
    howSubtitle: {
      en: "Automate intake, qualify matters instantly, and book consultations, so your advisors focus only on billable work.",
      de: "Automatisieren Sie die Erstaufnahme, qualifizieren Sie Anliegen sofort und buchen Sie Beratungen, damit Ihre Experten sich nur auf abrechenbare Arbeit konzentrieren.",
      tr: "Alımı otomatikleştirin, konuları anında nitelendirin ve danışmanlıkları rezerve edin, böylece danışmanlarınız yalnızca faturalanabilir işlere odaklanabilir.",
    },
    ctaTitle: {
      en: (name) => `Let ${name}'s AI handle your enquiry intake 24/7`,
      de: (name) => `Lassen Sie ${name}'s KI Ihre Anfrageaufnahme rund um die Uhr erledigen`,
      tr: (name) => `${name}'nin yapay zekasının sorgu alımınızı 7/24 yönetmesine izin verin`,
    },
    ctaSubtitle: {
      en: "Every prospective client gets a response in seconds. Every matter is qualified before it reaches your desk.",
      de: "Jeder potenzielle Mandant erhält eine Antwort in Sekunden. Jedes Anliegen wird qualifiziert, bevor es auf Ihrem Schreibtisch landet.",
      tr: "Her potansiyel müşteri saniyeler içinde yanıt alıyor. Her konu masanıza gelmeden önce nitelendiriliyor.",
    },
    ctaButton: {
      en: "Schedule a Consultation",
      de: "Beratungstermin buchen",
      tr: "Danışma Randevusu Al",
    },
    botMessages: {
      en: [
        { from: "bot", text: "Hello! I can help connect you with the right advisor. What type of matter can we assist with today?" },
        { from: "user", text: "I need help with a work visa for a senior hire we're bringing in from abroad" },
        { from: "bot", text: "Understood, I'll book you a consultation with our immigration specialist. When are you available this week?" },
      ],
      de: [
        { from: "bot", text: "Hallo! Ich verbinde Sie gerne mit dem richtigen Berater. Wobei können wir Ihnen heute helfen?" },
        { from: "user", text: "Ich brauche Hilfe bei einem Arbeitsvisum für eine Führungskraft, die wir aus dem Ausland holen" },
        { from: "bot", text: "Verstanden, ich buche Ihnen einen Termin bei unserem Einwanderungsexperten. Wann passen Sie diese Woche?" },
      ],
      tr: [
        { from: "bot", text: "Merhaba! Sizi doğru danışmanla buluşturmaya yardımcı olabilirim. Bugün hangi konuda yardımcı olabiliriz?" },
        { from: "user", text: "Yurt dışından işe aldığımız kıdemli bir çalışan için çalışma vizesi konusunda yardıma ihtiyacım var" },
        { from: "bot", text: "Anladım, sizi göçmenlik uzmanımızla bir görüşme için rezerve edeyim. Bu hafta ne zaman müsaitsiniz?" },
      ],
    },
    steps: {
      en: [
        { title: "Enquiry Received", desc: "A prospective client messages your WhatsApp describing their legal, financial, or compliance matter." },
        { title: "AI Qualifies", desc: "Matter type, urgency, jurisdiction, and complexity assessed, all before it reaches your team." },
        { title: "Consultation Booked", desc: "Advisor receives a full case brief before the first call. No time wasted on cold intakes." },
      ],
      de: [
        { title: "Anfrage eingegangen", desc: "Ein potenzieller Mandant schreibt auf WhatsApp über sein rechtliches, finanzielles oder Compliance-Anliegen." },
        { title: "KI qualifiziert", desc: "Anliegen, Dringlichkeit, Zuständigkeit und Komplexität werden bewertet, bevor Ihr Team involviert wird." },
        { title: "Beratung gebucht", desc: "Berater erhält ein vollständiges Fallbriefing vor dem ersten Gespräch. Keine verschwendete Zeit für kalte Aufnahmen." },
      ],
      tr: [
        { title: "Sorgu Alındı", desc: "Potansiyel müşteri hukuki, mali veya uyumluluk konusunu WhatsApp'tan bildiriyor." },
        { title: "Yapay Zeka Nitelendiriyor", desc: "Konu türü, aciliyet, yargı yetkisi ve karmaşıklık ekibinize ulaşmadan önce değerlendiriliyor." },
        { title: "Danışma Rezervasyonu", desc: "Danışman ilk görüşmeden önce tam bir dava brifingini alıyor. Soğuk alım için zaman harcanmıyor." },
      ],
    },
    industryKeys: ["legal", "immigration", "accounting", "financial", "tax", "compliance", "professional-services"],
  },
};

export function getVerticalTheme(vertical: string | null | undefined): VerticalTheme | null {
  if (!vertical || vertical === "healthcare") return null;
  return VERTICAL_THEMES[vertical] ?? null;
}

export function getAllVerticals(): string[] {
  return ["healthcare", ...Object.keys(VERTICAL_THEMES)];
}
