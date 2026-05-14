export type DemoLang = "de" | "tr" | "en";

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
  defaultTagline: "Qualifizieren Sie Leads automatisch, buchen Sie Rückrufe und antworten Sie in Deutsch und Türkisch — rund um die Uhr.",
  defaultSubtitle: "Qualifizieren Sie Leads automatisch, buchen Sie Rückrufe und antworten Sie in Deutsch und Türkisch — rund um die Uhr.",
  ctaPrimary: "Live-Demo ansehen",
  ctaSecondary: "Beratungsgespräch",
  features: ["Automatische Lead-Qualifizierung", "Deutsch & Türkisch", "Rückruf-Buchung"],
  howTitle: (n) => `Wie der Bot für ${n} arbeitet`,
  howSubtitle: "Eingehende WhatsApp-Nachrichten werden automatisch qualifiziert — auf Deutsch und Türkisch — ohne dass Ihr Team eingreifen muss.",
  steps: [
    { title: "Nachricht empfangen", desc: "Jemand schreibt auf WhatsApp an Ihre Pflegedienstnummer." },
    { title: "KI qualifiziert", desc: "Sprache erkannt, Bedarf erfasst, passende Antwort auf Basis Ihres Wissens generiert." },
    { title: "Termin gebucht", desc: "Rückruf automatisch eingeplant — Ihr Team findet den Lead fertig qualifiziert im Dashboard." },
  ],
  ctaTitle: (n) => `Bereit für ${n}?`,
  ctaSubtitle: "Wir richten den Bot in 24 Stunden ein — inklusive Ihrem Wissen, Ihrer Sprache, Ihrem Branding.",
  ctaButton: "Jetzt Demo anfragen",
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
  defaultTagline: "Müşteri adaylarını otomatik olarak niteleyin, geri aramaları planlayın ve Türkçe ile Almanca 7/24 yanıt verin.",
  defaultSubtitle: "Müşteri adaylarını otomatik olarak niteleyin, geri aramaları planlayın ve Türkçe ile Almanca 7/24 yanıt verin.",
  ctaPrimary: "Canlı Demo İzle",
  ctaSecondary: "Danışmanlık Görüşmesi",
  features: ["Otomatik Müşteri Nitelendirme", "Türkçe & Almanca", "Geri Arama Planlama"],
  howTitle: (n) => `${n} için Bot Nasıl Çalışır`,
  howSubtitle: "Gelen WhatsApp mesajları otomatik olarak nitelendirilir — Türkçe ve Almanca — ekibinizin müdahalesine gerek kalmadan.",
  steps: [
    { title: "Mesaj Alındı", desc: "Biri bakım hattınıza WhatsApp üzerinden yazıyor." },
    { title: "YZ Niteler", desc: "Dil algılandı, ihtiyaç belirlendi, bilgi tabanınıza dayalı yanıt oluşturuldu." },
    { title: "Randevu Oluşturuldu", desc: "Geri arama otomatik planlandı — ekibiniz müşteriyi gösterge panelinde hazır bulur." },
  ],
  ctaTitle: (n) => `${n} için Hazır mısınız?`,
  ctaSubtitle: "Botu 24 saat içinde kuruyoruz — bilginiz, diliniz ve markanızla birlikte.",
  ctaButton: "Demo Talep Et",
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
  defaultTagline: "Automatically qualify leads, book callbacks, and respond in German and Turkish — around the clock.",
  defaultSubtitle: "Automatically qualify leads, book callbacks, and respond in German and Turkish — around the clock.",
  ctaPrimary: "Watch Live Demo",
  ctaSecondary: "Book Consultation",
  features: ["Automatic Lead Qualification", "German & Turkish", "Callback Booking"],
  howTitle: (n) => `How the Bot Works for ${n}`,
  howSubtitle: "Incoming WhatsApp messages are automatically qualified — in German and Turkish — without your team lifting a finger.",
  steps: [
    { title: "Message Received", desc: "Someone messages your care service number on WhatsApp." },
    { title: "AI Qualifies", desc: "Language detected, needs captured, response generated from your knowledge base." },
    { title: "Appointment Booked", desc: "Callback automatically scheduled — your team finds the lead fully qualified in the dashboard." },
  ],
  ctaTitle: (n) => `Ready for ${n}?`,
  ctaSubtitle: "We set up the bot in 24 hours — with your knowledge, your language, your branding.",
  ctaButton: "Request Demo",
  botMessages: [
    { from: "bot", text: "Hello! I'm your AI assistant. How can I help you today?" },
    { from: "user", text: "I'm looking for care for my father — he needs help with daily activities." },
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

const translations: Record<DemoLang, DemoT> = { de, tr, en };

export function getDemoT(lang?: string | null): DemoT {
  const key = (lang ?? "de") as DemoLang;
  return translations[key] ?? de;
}

export const LANG_OPTIONS: Array<{ value: DemoLang; label: string; flag: string }> = [
  { value: "de", label: "German", flag: "🇩🇪" },
  { value: "tr", label: "Turkish", flag: "🇹🇷" },
  { value: "en", label: "English", flag: "🇬🇧" },
];
