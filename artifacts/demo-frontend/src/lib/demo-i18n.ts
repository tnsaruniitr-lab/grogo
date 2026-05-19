export type DemoLang = "de" | "tr" | "en" | "ar";

export interface DemoT {
  nav: { overview: string; dashboard: string; back: string };
  notFound: { title: string; desc: string; back: string };
  badge: string;
  botStatus: string;
  defaultTagline: string;
  defaultSubtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  features: string[];
  // hero team badge
  teamLabel: string;
  teamSub: string;
  // services section
  servicesTitle: string;
  servicesSubtitle: string;
  services: Array<{ title: string; desc: string }>;
  // info/image section
  infoTitle: string;
  infoBody: string;
  infoPoints: string[];
  infoButton: string;
  // about / stats section
  aboutTitle: (name: string) => string;
  aboutBody: string;
  aboutStats: Array<[string, string]>;
  // footer nav
  navServices: string;
  navWebsite: string;
  // how it works
  howTitle: (name: string) => string;
  howSubtitle: string;
  steps: Array<{ title: string; desc: string }>;
  ctaTitle: (name: string) => string;
  ctaSubtitle: string;
  ctaButton: string;
  botMessages: Array<{ from: "bot" | "user"; text: string }>;
  // dashboard
  liveUpdate: string;
  stats: { totalLeads: string; newLeads: string; callbacks: string; bookedToday: string };
  table: {
    contact: string; language: string; status: string; source: string;
    lastActivity: string; details: string; never: string;
  };
  noLeads: { title: string; desc: string };
  leads: string;
  detail: {
    phone: string; status: string; callbackPlanned: string; flexible: string;
    outcome: string; aiSummary: string; noMessages: string; unknownLead: string;
    unknownContact: string;
  };
  statusLabels: Record<string, string>;
  selectStatus: Record<string, string>;
}

const de: DemoT = {
  nav: { overview: "Übersicht", dashboard: "Dashboard", back: "Admin" },
  notFound: { title: "Demo nicht gefunden", desc: "Dieser Demo-Link ist ungültig oder wurde gelöscht.", back: "Zurück" },
  badge: "KI-gestützte Pflege-Kommunikation",
  botStatus: "KI-Assistent · Online",
  defaultTagline: "Rund um die Uhr für Sie erreichbar, Fragen beantwortet, Termine gebucht.",
  defaultSubtitle: "Rund um die Uhr für Sie erreichbar, Fragen beantwortet, Termine gebucht.",
  ctaPrimary: "Beratung anfordern",
  ctaSecondary: "Mehr erfahren",
  features: ["24/7 erreichbar", "Sofortige Antworten", "Einfache Terminbuchung"],
  teamLabel: "Unser Team",
  teamSub: "Qualifiziert & einfühlsam",
  servicesTitle: "Unsere Leistungen",
  servicesSubtitle: "Professionelle, einfühlsame Pflegeleistungen für ein selbstbestimmtes und würdevolles Leben zu Hause.",
  services: [
    { title: "Häusliche Pflege", desc: "Medizinische und pflegerische Versorgung in den eigenen vier Wänden. Vertraut, sicher und respektvoll." },
    { title: "24h Betreuung", desc: "Rund-um-die-Uhr Betreuung für maximale Sicherheit und Geborgenheit im eigenen Zuhause." },
    { title: "Demenzpflege WG", desc: "Eine familiäre Wohngemeinschaft für demenzerkrankte Menschen mit 24/7 Betreuung durch muttersprachliches Personal." },
  ],
  infoTitle: "Geborgenheit durch kulturelle Nähe",
  infoBody: "Für Menschen mit Demenz ist die Muttersprache und eine vertraute kulturelle Umgebung essenziell. Wir schaffen ein Zuhause, das genau das bietet.",
  infoPoints: ["Qualifizierte, geprüfte Pflegekräfte", "Flexible Pflegepläne", "Regelmäßige Updates für Angehörige", "Familienfreundliche Besuchszeiten"],
  infoButton: "Plätze anfragen",
  aboutTitle: (n) => `Über ${n}`,
  aboutBody: "Unser Team aus erfahrenen Fachleuten steht für außergewöhnliche Ergebnisse, individuelle Betreuung und den Einsatz modernster Methoden, für Ihr Wohlbefinden und Ihre Zufriedenheit.",
  aboutStats: [["500+", "Zufriedene Kunden"], ["10+", "Jahre Erfahrung"], ["4.9 ★", "Bewertung"]],
  navServices: "Leistungen",
  navWebsite: "Zur Website",
  howTitle: (n) => `${n}: rund um die Uhr erreichbar`,
  howSubtitle: "Schreiben Sie uns jederzeit auf WhatsApp und erhalten Sie in Sekunden eine Antwort. Fragen beantwortet, Termine gebucht.",
  steps: [
    { title: "Nachricht empfangen", desc: "Jemand schreibt auf WhatsApp an Ihre Pflegedienstnummer." },
    { title: "KI qualifiziert", desc: "Sprache erkannt, Bedarf erfasst, passende Antwort auf Basis Ihres Wissens generiert." },
    { title: "Termin gebucht", desc: "Rückruf automatisch eingeplant, Ihr Team findet den Lead fertig qualifiziert im Dashboard." },
  ],
  ctaTitle: (n) => `Termin bei ${n} buchen`,
  ctaSubtitle: "Unser Team antwortet innerhalb von Sekunden, Tag und Nacht. Schreiben Sie uns einfach auf WhatsApp.",
  ctaButton: "Beratung anfragen",
  botMessages: [
    { from: "bot", text: "Hallo! Ich bin der KI-Assistent. Wie kann ich Ihnen heute helfen?" },
    { from: "user", text: "Ich suche Pflege für meinen Vater, er braucht Hilfe beim Alltag." },
    { from: "bot", text: "Gerne helfe ich Ihnen dabei. Wie alt ist Ihr Vater und in welcher Stadt wohnt er?" },
    { from: "user", text: "Er ist 78 Jahre alt, wohnt in München." },
    { from: "bot", text: "Wunderbar! Ich kann gerne einen kostenlosen Beratungstermin für Sie vereinbaren. Wann passt es Ihnen?" },
  ],
  liveUpdate: "Live-Aktualisierung alle 10 Sek.",
  stats: { totalLeads: "Gesamt-Leads", newLeads: "Neu", callbacks: "Rückrufe", bookedToday: "Heute gebucht" },
  table: { contact: "Kontakt", language: "Sprache", status: "Status", source: "Quelle", lastActivity: "Letzte Aktivität", details: "Details", never: "Nie" },
  noLeads: { title: "Noch keine Leads vorhanden", desc: "Sobald der Bot aktiviert ist und WhatsApp-Nachrichten eingehen, erscheinen die Leads hier." },
  leads: "Aktuelle Leads",
  detail: {
    phone: "Telefon", status: "Status", callbackPlanned: "Rückruf geplant", flexible: "Zeitpunkt flexibel",
    outcome: "Ergebnis", aiSummary: "KI-Zusammenfassung", noMessages: "Noch keine Nachrichten",
    unknownLead: "Unbekannter Lead", unknownContact: "Unbekannt",
  },
  statusLabels: { new: "Neu", qualified: "Qualifiziert", callback_booked: "Rückruf", escalated: "Eskaliert", needs_human: "Beratung", converted: "Gewonnen", archived: "Archiviert" },
  selectStatus: { new: "Neu", qualified: "Qualifiziert", callback_booked: "Rückruf gebucht", escalated: "Eskaliert", needs_human: "Braucht Beratung", converted: "Gewonnen", archived: "Archiviert" },
};

const tr: DemoT = {
  nav: { overview: "Genel Bakış", dashboard: "Gösterge Paneli", back: "Yönetici" },
  notFound: { title: "Demo bulunamadı", desc: "Bu demo bağlantısı geçersiz veya silindi.", back: "Geri" },
  badge: "YZ Destekli Bakım İletişimi",
  botStatus: "YZ Asistanı · Çevrimiçi",
  defaultTagline: "7/24 hizmetinizdeyiz, sorularınız yanıtlanır, randevunuz alınır.",
  defaultSubtitle: "7/24 hizmetinizdeyiz, sorularınız yanıtlanır, randevunuz alınır.",
  ctaPrimary: "Danışmanlık İste",
  ctaSecondary: "Daha Fazla Bilgi",
  features: ["7/24 erişilebilir", "Anında yanıtlar", "Kolay randevu"],
  teamLabel: "Ekibimiz",
  teamSub: "Nitelikli & şefkatli",
  servicesTitle: "Hizmetlerimiz",
  servicesSubtitle: "Evde bağımsızlığı ve onurlu bir yaşamı destekleyen profesyonel, şefkatli bakım hizmetleri.",
  services: [
    { title: "Evde Bakım", desc: "Kendi evinde tıbbi ve bakım hizmetleri. Güvenilir, emniyetli ve saygılı." },
    { title: "24 Saat Bakım", desc: "Evde maksimum güvenlik ve huzur için günün her saati bakım." },
    { title: "Demans Bakım Evi", desc: "Anadil konuşan personel tarafından 7/24 bakım sağlanan aile sıcaklığında bir yaşam ortamı." },
  ],
  infoTitle: "Kültürel Yakınlıkla Güven",
  infoBody: "Demans hastaları için anadil ve tanıdık kültürel ortam çok önemlidir. Tam da bunu sunan bir yuva yaratıyoruz.",
  infoPoints: ["Nitelikli, denetlenmiş bakıcılar", "Esnek bakım programları", "Ailelere düzenli güncelleme", "Aile dostu ziyaret saatleri"],
  infoButton: "Yer Sorgula",
  aboutTitle: (n) => `${n} Hakkında`,
  aboutBody: "Deneyimli uzmanlardan oluşan ekibimiz; olağanüstü sonuçlar, kişisel ilgi ve en güncel yöntemler sunmaya kendini adamıştır, konforunuz ve memnuniyetiniz için.",
  aboutStats: [["500+", "Memnun Müşteri"], ["10+", "Yıl Deneyim"], ["4.9 ★", "Puan"]],
  navServices: "Hizmetler",
  navWebsite: "Web Sitesi",
  howTitle: (n) => `${n}: 7/24 Ulaşılabilir`,
  howSubtitle: "Bize istediğiniz zaman WhatsApp'tan yazın ve saniyeler içinde yanıt alın. Sorularınız yanıtlanır, randevunuz alınır.",
  steps: [
    { title: "Mesaj Alındı", desc: "Biri bakım hattınıza WhatsApp üzerinden yazıyor." },
    { title: "YZ Niteler", desc: "Dil algılandı, ihtiyaç belirlendi, bilgi tabanınıza dayalı yanıt oluşturuldu." },
    { title: "Randevu Oluşturuldu", desc: "Geri arama otomatik planlandı, ekibiniz müşteriyi gösterge panelinde hazır bulur." },
  ],
  ctaTitle: (n) => `${n}'de Randevunuzu Alın`,
  ctaSubtitle: "Ekibimiz gece veya gündüz saniyeler içinde yanıt verir. Bize WhatsApp'tan yazmanız yeterli.",
  ctaButton: "Danışma Randevusu Al",
  botMessages: [
    { from: "bot", text: "Merhaba! Ben YZ asistanınım. Bugün size nasıl yardımcı olabilirim?" },
    { from: "user", text: "Babam için bakım arıyorum, günlük işlerde yardıma ihtiyacı var." },
    { from: "bot", text: "Memnuniyetle yardımcı olurum. Babanız kaç yaşında ve hangi şehirde yaşıyor?" },
    { from: "user", text: "78 yaşında, Münih'te yaşıyor." },
    { from: "bot", text: "Harika! Ücretsiz bir danışma randevusu ayarlayabilirim. Size ne zaman uygun?" },
  ],
  liveUpdate: "Her 10 saniyede canlı güncelleme",
  stats: { totalLeads: "Toplam Kayıtlar", newLeads: "Yeni", callbacks: "Geri Aramalar", bookedToday: "Bugün Alınan" },
  table: { contact: "Kişi", language: "Dil", status: "Durum", source: "Kaynak", lastActivity: "Son Aktivite", details: "Detaylar", never: "Hiçbir zaman" },
  noLeads: { title: "Henüz kayıt yok", desc: "Bot etkinleştirilip WhatsApp mesajları gelmeye başladığında kayıtlar burada görünecek." },
  leads: "Güncel Kayıtlar",
  detail: {
    phone: "Telefon", status: "Durum", callbackPlanned: "Geri Arama Planlandı", flexible: "Zaman esnek",
    outcome: "Sonuç", aiSummary: "YZ Özeti", noMessages: "Henüz mesaj yok",
    unknownLead: "Bilinmeyen Kayıt", unknownContact: "Bilinmiyor",
  },
  statusLabels: { new: "Yeni", qualified: "Nitelikli", callback_booked: "Geri Arama", escalated: "Yükseltildi", needs_human: "Danışmanlık", converted: "Kazanıldı", archived: "Arşivlendi" },
  selectStatus: { new: "Yeni", qualified: "Nitelikli", callback_booked: "Geri Arama Planlandı", escalated: "Yükseltildi", needs_human: "Danışmanlık Gerekli", converted: "Kazanıldı", archived: "Arşivlendi" },
};

const en: DemoT = {
  nav: { overview: "Overview", dashboard: "Dashboard", back: "Admin" },
  notFound: { title: "Demo not found", desc: "This demo link is invalid or has been deleted.", back: "Go back" },
  badge: "AI-Powered Care Communication",
  botStatus: "AI Assistant · Online",
  defaultTagline: "Available around the clock, questions answered, consultations booked.",
  defaultSubtitle: "Available around the clock, questions answered, consultations booked.",
  ctaPrimary: "Request Consultation",
  ctaSecondary: "Learn More",
  features: ["24/7 availability", "Instant responses", "Easy appointment booking"],
  teamLabel: "Our Team",
  teamSub: "Qualified & compassionate",
  servicesTitle: "Our Services",
  servicesSubtitle: "Professional, compassionate care services that support independence and dignity at home.",
  services: [
    { title: "Home Care", desc: "Medical and nursing care in your own home. Familiar, safe and respectful." },
    { title: "24h Care", desc: "Around-the-clock care for maximum safety and comfort at home." },
    { title: "Dementia Care Home", desc: "A family-style shared home for people with dementia, staffed 24/7 by native speakers." },
  ],
  infoTitle: "Security Through Cultural Closeness",
  infoBody: "For people with dementia, their native language and a familiar cultural environment are essential. We create a home that offers exactly that.",
  infoPoints: ["Qualified, vetted carers", "Flexible care schedules", "Regular family progress updates", "Family-friendly visiting hours"],
  infoButton: "Enquire About Availability",
  aboutTitle: (n) => `About ${n}`,
  aboutBody: "Our team of experienced professionals is committed to exceptional results, personalised care and the latest techniques, for your comfort and complete satisfaction.",
  aboutStats: [["500+", "Happy Clients"], ["10+", "Years Experience"], ["4.9 ★", "Rating"]],
  navServices: "Services",
  navWebsite: "Visit Website",
  howTitle: (n) => `${n}: Available Around the Clock`,
  howSubtitle: "Message us anytime on WhatsApp and get a reply in seconds. Questions answered, consultations booked.",
  steps: [
    { title: "Message Received", desc: "Someone messages your care service number on WhatsApp." },
    { title: "AI Qualifies", desc: "Language detected, needs captured, response generated from your knowledge base." },
    { title: "Appointment Booked", desc: "Callback automatically scheduled, your team finds the lead fully qualified in the dashboard." },
  ],
  ctaTitle: (n) => `Book Your Consultation at ${n}`,
  ctaSubtitle: "Our team responds within seconds, day or night. Simply message us on WhatsApp to get started.",
  ctaButton: "Book a Consultation",
  botMessages: [
    { from: "bot", text: "Hello! I'm your AI assistant. How can I help you today?" },
    { from: "user", text: "I'm looking for care for my father, he needs help with daily activities." },
    { from: "bot", text: "I'd be happy to help. How old is your father and which city does he live in?" },
    { from: "user", text: "He's 78 years old and lives in Munich." },
    { from: "bot", text: "Great! I can arrange a free consultation for you. When would be a good time?" },
  ],
  liveUpdate: "Live updates every 10 seconds",
  stats: { totalLeads: "Total Leads", newLeads: "New", callbacks: "Callbacks", bookedToday: "Booked Today" },
  table: { contact: "Contact", language: "Language", status: "Status", source: "Source", lastActivity: "Last Activity", details: "Details", never: "Never" },
  noLeads: { title: "No leads yet", desc: "Once the bot is active and WhatsApp messages start coming in, leads will appear here." },
  leads: "Recent Leads",
  detail: {
    phone: "Phone", status: "Status", callbackPlanned: "Callback Scheduled", flexible: "Time flexible",
    outcome: "Outcome", aiSummary: "AI Summary", noMessages: "No messages yet",
    unknownLead: "Unknown Lead", unknownContact: "Unknown",
  },
  statusLabels: { new: "New", qualified: "Qualified", callback_booked: "Callback", escalated: "Escalated", needs_human: "Needs Agent", converted: "Won", archived: "Archived" },
  selectStatus: { new: "New", qualified: "Qualified", callback_booked: "Callback booked", escalated: "Escalated", needs_human: "Needs agent", converted: "Won", archived: "Archived" },
};

const ar: DemoT = {
  nav: { overview: "نظرة عامة", dashboard: "لوحة البيانات", back: "الإدارة" },
  notFound: { title: "العرض التجريبي غير موجود", desc: "هذا الرابط التجريبي غير صالح أو تم حذفه.", back: "رجوع" },
  badge: "التواصل في الرعاية بالذكاء الاصطناعي",
  botStatus: "المساعد الذكي · متصل",
  defaultTagline: "متاحون على مدار الساعة، نجيب على أسئلتكم ونحجز المواعيد.",
  defaultSubtitle: "متاحون على مدار الساعة، نجيب على أسئلتكم ونحجز المواعيد.",
  ctaPrimary: "طلب استشارة",
  ctaSecondary: "معرفة المزيد",
  features: ["متاح 24/7", "ردود فورية", "حجز مواعيد سهل"],
  teamLabel: "فريقنا",
  teamSub: "مؤهلون وعطوفون",
  servicesTitle: "خدماتنا",
  servicesSubtitle: "خدمات رعاية احترافية وعطوفة تدعم الاستقلالية والكرامة في المنزل.",
  services: [
    { title: "الرعاية المنزلية", desc: "رعاية طبية وتمريضية في منزلك. مألوفة وآمنة ومحترمة." },
    { title: "رعاية 24 ساعة", desc: "رعاية على مدار الساعة لضمان أقصى درجات الأمان والراحة في المنزل." },
    { title: "بيت رعاية الخرف", desc: "بيئة منزلية دافئة لمرضى الخرف مع طاقم عمل ناطق بالعربية على مدار الساعة." },
  ],
  infoTitle: "الأمان من خلال القرب الثقافي",
  infoBody: "للأشخاص المصابين بالخرف، اللغة الأم والبيئة الثقافية المألوفة أمران ضروريان. نحن نخلق منزلاً يوفر ذلك بالضبط.",
  infoPoints: ["مقدمو رعاية مؤهلون وموثوقون", "جداول رعاية مرنة", "تحديثات منتظمة للأسرة", "ساعات زيارة مناسبة للأسرة"],
  infoButton: "الاستفسار عن التوفر",
  aboutTitle: (n) => `عن ${n}`,
  aboutBody: "فريقنا من المحترفين ذوي الخبرة ملتزم بتقديم نتائج استثنائية ورعاية مخصصة وأحدث التقنيات لراحتكم ورضاكم التام.",
  aboutStats: [["500+", "عميل سعيد"], ["10+", "سنوات خبرة"], ["4.9 ★", "تقييم"]],
  navServices: "الخدمات",
  navWebsite: "زيارة الموقع",
  howTitle: (n) => `${n}: متاح على مدار الساعة`,
  howSubtitle: "راسلنا في أي وقت على واتساب واحصل على رد في ثوانٍ. أسئلة تُجاب، مواعيد تُحجز.",
  steps: [
    { title: "استلام الرسالة", desc: "يرسل شخص ما رسالة إلى خط الرعاية الخاص بك على واتساب." },
    { title: "الذكاء الاصطناعي يؤهل", desc: "تم اكتشاف اللغة، وتحديد الاحتياجات، وإنشاء رد من قاعدة معرفتك." },
    { title: "حجز الموعد", desc: "تم جدولة المعاودة تلقائياً، ويجد فريقك العميل المحتمل مؤهلاً بالكامل في لوحة البيانات." },
  ],
  ctaTitle: (n) => `احجز استشارتك في ${n}`,
  ctaSubtitle: "يستجيب فريقنا في ثوانٍ، نهاراً أو ليلاً. فقط راسلنا على واتساب للبدء.",
  ctaButton: "احجز استشارة",
  botMessages: [
    { from: "bot", text: "مرحباً! أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟" },
    { from: "user", text: "أبحث عن رعاية لوالدي، يحتاج مساعدة في أنشطته اليومية." },
    { from: "bot", text: "يسعدني مساعدتك. كم عمر والدك وفي أي مدينة يقيم؟" },
    { from: "user", text: "عمره 78 عاماً ويقيم في دبي." },
    { from: "bot", text: "رائع! يمكنني ترتيب استشارة مجانية لك. متى يناسبك الوقت؟" },
  ],
  liveUpdate: "تحديثات مباشرة كل 10 ثوانٍ",
  stats: { totalLeads: "إجمالي العملاء", newLeads: "جديد", callbacks: "معاودة الاتصال", bookedToday: "محجوز اليوم" },
  table: { contact: "جهة الاتصال", language: "اللغة", status: "الحالة", source: "المصدر", lastActivity: "آخر نشاط", details: "التفاصيل", never: "أبداً" },
  noLeads: { title: "لا يوجد عملاء بعد", desc: "بمجرد تفعيل الروبوت وبدء وصول رسائل واتساب، ستظهر العملاء هنا." },
  leads: "العملاء الأخيرون",
  detail: {
    phone: "الهاتف", status: "الحالة", callbackPlanned: "المعاودة مجدولة", flexible: "الوقت مرن",
    outcome: "النتيجة", aiSummary: "ملخص الذكاء الاصطناعي", noMessages: "لا توجد رسائل بعد",
    unknownLead: "عميل مجهول", unknownContact: "مجهول",
  },
  statusLabels: { new: "جديد", qualified: "مؤهل", callback_booked: "معاودة اتصال", escalated: "تصعيد", needs_human: "يحتاج وكيل", converted: "فاز", archived: "مؤرشف" },
  selectStatus: { new: "جديد", qualified: "مؤهل", callback_booked: "معاودة اتصال محجوزة", escalated: "تصعيد", needs_human: "يحتاج وكيل", converted: "فاز", archived: "مؤرشف" },
};

const translations: Record<DemoLang, DemoT> = { de, tr, en, ar };

export function getDemoT(lang?: string | null): DemoT {
  const key = (lang ?? "de") as DemoLang;
  return translations[key] ?? de;
}

export const LANG_OPTIONS: Array<{ value: DemoLang; label: string; flag: string }> = [
  { value: "de", label: "German", flag: "🇩🇪" },
  { value: "tr", label: "Turkish", flag: "🇹🇷" },
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "ar", label: "Arabic", flag: "🇸🇦" },
];
