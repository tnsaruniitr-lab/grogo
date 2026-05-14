/**
 * Industry theme system.
 *
 * Primary verticals (exceptional treatment): aesthetics, medical, dental, wellness
 * Secondary verticals (clean professional):  care, and everything else
 *
 * Each theme drives: service icons, trust badges, bot conversation, how-it-works
 * steps, about stats, and the visual card style used in the services section.
 */

export type CardStyle = "premium" | "standard";

export interface IndustryTheme {
  /** Lucide icon names for the three service cards */
  serviceIconNames: [string, string, string];
  /** Trust badge labels shown below the hero (primary verticals only) */
  trustBadges: string[];
  /** Visual style for service cards */
  cardStyle: CardStyle;
  /** Bot chat demo — shown in the floating card in the hero */
  botMessages: {
    de: Array<{ from: "bot" | "user"; text: string }>;
    en: Array<{ from: "bot" | "user"; text: string }>;
    tr: Array<{ from: "bot" | "user"; text: string }>;
  };
  /** How-it-works steps */
  steps: {
    de: Array<{ title: string; desc: string }>;
    en: Array<{ title: string; desc: string }>;
    tr: Array<{ from?: never; title: string; desc: string }>;
  };
  /** About section stats — [value, label] in whichever language fits */
  stats: {
    de: Array<[string, string]>;
    en: Array<[string, string]>;
    tr: Array<[string, string]>;
  };
  /** Services section subtitle */
  servicesSubtitle: { de: string; en: string; tr: string };
  /** Info section title */
  infoTitle: { de: string; en: string; tr: string };
  /** Bot persona label shown in the chat card header */
  botPersonaLabel: { de: string; en: string; tr: string };
}

// ─────────────────────────────────────────────────────────
// Primary verticals — full premium treatment
// ─────────────────────────────────────────────────────────

const aestheticsTheme: IndustryTheme = {
  serviceIconNames: ["Sparkles", "Gem", "Star"],
  trustBadges: ["Certified Practitioners", "Personalised Treatments", "Discreet & Confidential", "Instant 24/7 Response"],
  cardStyle: "premium",
  botMessages: {
    de: [
      { from: "bot", text: "Hallo! Wie kann ich Ihnen helfen?" },
      { from: "user", text: "Ich interessiere mich für eine Botox-Behandlung." },
      { from: "bot", text: "Sehr gerne! Ich kann direkt einen kostenlosen Beratungstermin für Sie buchen — wann passt es Ihnen?" },
    ],
    en: [
      { from: "bot", text: "Hi! How can I help you today?" },
      { from: "user", text: "I'm interested in a Botox consultation." },
      { from: "bot", text: "Of course! I can book a free consultation for you right away. When works best?" },
    ],
    tr: [
      { from: "bot", text: "Merhaba! Size nasıl yardımcı olabilirim?" },
      { from: "user", text: "Botoks tedavisi hakkında bilgi almak istiyorum." },
      { from: "bot", text: "Tabii ki! Ücretsiz bir danışma randevusu ayarlayabilirim. Ne zaman uygun?" },
    ],
  },
  steps: {
    de: [
      { title: "Anfrage per WhatsApp", desc: "Ein Interessent schreibt über die gewünschte Behandlung — zu jeder Tages- und Nachtzeit." },
      { title: "KI informiert & qualifiziert", desc: "Behandlungswunsch erfasst, Fragen aus Ihrem Wissen beantwortet, Beratung angeboten." },
      { title: "Beratungstermin bestätigt", desc: "Termin automatisch eingeplant — Ihr Team findet den Neukunden fertig qualifiziert im Dashboard." },
    ],
    en: [
      { title: "WhatsApp Enquiry", desc: "A prospect messages about a treatment — at any time of day." },
      { title: "AI Informs & Qualifies", desc: "Treatment interest captured, questions answered from your knowledge base, consultation offered." },
      { title: "Consultation Confirmed", desc: "Appointment auto-scheduled — your team finds the new client fully qualified in the dashboard." },
    ],
    tr: [
      { title: "WhatsApp Talebi", desc: "Bir aday istediği tedavi hakkında mesaj atar — günün her saatinde." },
      { title: "YZ Bilgilendirir & Niteler", desc: "Tedavi isteği not alınır, sorular yanıtlanır, randevu önerilir." },
      { title: "Randevu Onaylandı", desc: "Termin otomatik oluşturulur — ekibiniz müşteriyi panelde hazır bulur." },
    ],
  },
  stats: {
    de: [["500+", "Behandlungen"], ["5 ★", "Bewertung"], ["< 2 Min", "Antwortzeit"]],
    en: [["500+", "Treatments"], ["5 ★", "Rating"], ["< 2 Min", "Response time"]],
    tr: [["500+", "Tedavi"], ["5 ★", "Puan"], ["< 2 Dak", "Yanıt süresi"]],
  },
  servicesSubtitle: {
    de: "Modernste ästhetische Behandlungen — individuell abgestimmt, diskret und professionell durchgeführt.",
    en: "Advanced aesthetic treatments — individually tailored, discreet and professionally delivered.",
    tr: "Gelişmiş estetik tedaviler — bireysel olarak uyarlanmış, gizli ve profesyonel şekilde sunulur.",
  },
  infoTitle: {
    de: "Ästhetik trifft Kompetenz",
    en: "Aesthetics Meets Expertise",
    tr: "Estetik ve Uzmanlık Buluşuyor",
  },
  botPersonaLabel: {
    de: "Behandlungsberatung · Online",
    en: "Treatment Advisor · Online",
    tr: "Tedavi Danışmanı · Çevrimiçi",
  },
};

const medicalTheme: IndustryTheme = {
  serviceIconNames: ["Stethoscope", "Activity", "Heart"],
  trustBadges: ["Licensed Medical Practice", "Registered Practitioners", "GDPR Compliant", "24/7 Patient Support"],
  cardStyle: "premium",
  botMessages: {
    de: [
      { from: "bot", text: "Hallo! Wie kann ich Ihnen helfen?" },
      { from: "user", text: "Ich würde gerne einen Arzttermin vereinbaren." },
      { from: "bot", text: "Natürlich. Handelt es sich um eine Erst- oder Folgevorstellung? Ich finde direkt einen passenden Termin." },
    ],
    en: [
      { from: "bot", text: "Hello! How can I help you today?" },
      { from: "user", text: "I'd like to book an appointment with a doctor." },
      { from: "bot", text: "Of course. Is this a new or follow-up appointment? I'll find the right slot for you right away." },
    ],
    tr: [
      { from: "bot", text: "Merhaba! Size nasıl yardımcı olabilirim?" },
      { from: "user", text: "Doktor randevusu almak istiyorum." },
      { from: "bot", text: "Tabii ki. İlk muayene mi yoksa kontrol mü? Hemen uygun bir randevu buluyorum." },
    ],
  },
  steps: {
    de: [
      { title: "Patient schreibt an", desc: "Patient oder Angehörige senden eine WhatsApp-Nachricht an Ihre Praxis." },
      { title: "KI beantwortet & qualifiziert", desc: "Beschwerden erfasst, Fragen aus Ihrer Wissensbasis beantwortet, Termin angeboten." },
      { title: "Termin bestätigt", desc: "Termin automatisch vergeben — Ihr Team sieht alle Daten fertig aufbereitet im Dashboard." },
    ],
    en: [
      { title: "Patient Reaches Out", desc: "Patient or family member sends a WhatsApp message to your practice." },
      { title: "AI Answers & Qualifies", desc: "Symptoms noted, questions answered from your knowledge base, appointment offered." },
      { title: "Appointment Confirmed", desc: "Automatically scheduled — your team sees all details ready in the dashboard." },
    ],
    tr: [
      { title: "Hasta Mesaj Atar", desc: "Hasta veya yakını muayehaneye WhatsApp mesajı gönderir." },
      { title: "YZ Yanıtlar & Niteler", desc: "Şikayetler kaydedilir, sorular yanıtlanır, randevu önerilir." },
      { title: "Randevu Onaylandı", desc: "Otomatik olarak planlanır — ekibiniz tüm verileri panelde hazır görür." },
    ],
  },
  stats: {
    de: [["1000+", "Patienten"], ["4.9 ★", "Bewertung"], ["30 Min", "Ø Antwortzeit"]],
    en: [["1000+", "Patients"], ["4.9 ★", "Rating"], ["30 Min", "Avg. response time"]],
    tr: [["1000+", "Hasta"], ["4.9 ★", "Puan"], ["30 Dak", "Ort. yanıt süresi"]],
  },
  servicesSubtitle: {
    de: "Umfassende medizinische Versorgung — kompetent, vertrauensvoll und patientenorientiert.",
    en: "Comprehensive medical care — competent, trustworthy and patient-centred.",
    tr: "Kapsamlı tıbbi bakım — yetkin, güvenilir ve hasta odaklı.",
  },
  infoTitle: {
    de: "Medizin, der Sie vertrauen können",
    en: "Medicine You Can Trust",
    tr: "Güvenebileceğiniz Tıp",
  },
  botPersonaLabel: {
    de: "Praxis-Assistent · Online",
    en: "Practice Assistant · Online",
    tr: "Klinik Asistanı · Çevrimiçi",
  },
};

const dentalTheme: IndustryTheme = {
  serviceIconNames: ["Smile", "Shield", "Sparkles"],
  trustBadges: ["GDC Registered", "Cosmetic & General Dentistry", "Emergency Appointments", "Gentle Patient Care"],
  cardStyle: "premium",
  botMessages: {
    de: [
      { from: "bot", text: "Hallo! Wie kann ich Ihnen helfen?" },
      { from: "user", text: "Ich möchte einen Termin für eine Zahnreinigung buchen." },
      { from: "bot", text: "Sehr gerne! Sind Sie Neu- oder Bestandspatient? Ich finde direkt einen freien Termin für Sie." },
    ],
    en: [
      { from: "bot", text: "Hello! How can I help you today?" },
      { from: "user", text: "I'd like to book a hygiene appointment." },
      { from: "bot", text: "Great! Are you a new or existing patient? I can find an available slot for you right away." },
    ],
    tr: [
      { from: "bot", text: "Merhaba! Size nasıl yardımcı olabilirim?" },
      { from: "user", text: "Diş temizliği için randevu almak istiyorum." },
      { from: "bot", text: "Tabii ki! Yeni mi yoksa mevcut bir hasta mısınız? Hemen uygun bir slot buluyorum." },
    ],
  },
  steps: {
    de: [
      { title: "Nachricht per WhatsApp", desc: "Patient fragt nach einem Termin oder einer Behandlung — rund um die Uhr." },
      { title: "KI informiert & bucht", desc: "Behandlungswunsch erfasst, Fragen beantwortet, Termin direkt angeboten." },
      { title: "Termin bestätigt", desc: "Automatisch eingetragen — Ihr Team sieht alle Details fertig aufbereitet." },
    ],
    en: [
      { title: "WhatsApp Message", desc: "Patient enquires about an appointment or treatment — around the clock." },
      { title: "AI Informs & Books", desc: "Treatment interest captured, questions answered, appointment slot offered." },
      { title: "Appointment Confirmed", desc: "Auto-scheduled — your team sees all the details ready in the dashboard." },
    ],
    tr: [
      { title: "WhatsApp Mesajı", desc: "Hasta randevu veya tedavi hakkında mesaj atar — günün her saatinde." },
      { title: "YZ Bilgilendirir & Rezerve Eder", desc: "Tedavi isteği alınır, sorular yanıtlanır, randevu önerilir." },
      { title: "Randevu Onaylandı", desc: "Otomatik planlanır — ekibiniz tüm ayrıntıları hazır görür." },
    ],
  },
  stats: {
    de: [["800+", "Patienten"], ["5 ★", "Bewertung"], ["24h", "Terminbuchung"]],
    en: [["800+", "Patients"], ["5 ★", "Rating"], ["24h", "Appointment booking"]],
    tr: [["800+", "Hasta"], ["5 ★", "Puan"], ["24 Saat", "Randevu rezervasyonu"]],
  },
  servicesSubtitle: {
    de: "Moderne Zahnheilkunde für ein strahlendes Lächeln — sanft, sicher und auf höchstem Niveau.",
    en: "Modern dentistry for a radiant smile — gentle, safe and at the highest standard.",
    tr: "Parlak bir gülümseme için modern diş hekimliği — nazik, güvenli ve en yüksek standartta.",
  },
  infoTitle: {
    de: "Ihr Lächeln in besten Händen",
    en: "Your Smile in Expert Hands",
    tr: "Gülüşünüz Uzman Ellerde",
  },
  botPersonaLabel: {
    de: "Praxis-Assistent · Online",
    en: "Practice Assistant · Online",
    tr: "Klinik Asistanı · Çevrimiçi",
  },
};

const wellnessTheme: IndustryTheme = {
  serviceIconNames: ["Leaf", "Heart", "Wind"],
  trustBadges: ["Certified Therapists", "Holistic Approach", "Personalised Programmes", "Science-Backed Methods"],
  cardStyle: "premium",
  botMessages: {
    de: [
      { from: "bot", text: "Hallo! Wie kann ich Ihnen helfen?" },
      { from: "user", text: "Ich interessiere mich für ein Wellness-Programm." },
      { from: "bot", text: "Wunderbar! Ich kann gerne herausfinden, welches Programm am besten zu Ihnen passt. Was sind Ihre Ziele?" },
    ],
    en: [
      { from: "bot", text: "Hello! How can I help you today?" },
      { from: "user", text: "I'm interested in a wellness programme." },
      { from: "bot", text: "Wonderful! I can help find the right programme for you. What are your wellness goals?" },
    ],
    tr: [
      { from: "bot", text: "Merhaba! Size nasıl yardımcı olabilirim?" },
      { from: "user", text: "Bir wellness programına ilgi duyuyorum." },
      { from: "bot", text: "Harika! Size en uygun programı bulmama yardımcı olabilirim. Hedefleriniz neler?" },
    ],
  },
  steps: {
    de: [
      { title: "WhatsApp-Anfrage", desc: "Interessent schreibt über ein Programm oder eine Behandlung — wann immer es passt." },
      { title: "KI berät & qualifiziert", desc: "Ziele erfasst, passende Leistungen empfohlen, Erstgespräch angeboten." },
      { title: "Beratungstermin", desc: "Termin automatisch gebucht — Ihr Team kennt bereits die Bedürfnisse des Neukunden." },
    ],
    en: [
      { title: "WhatsApp Enquiry", desc: "Prospect messages about a programme or treatment — whenever it suits them." },
      { title: "AI Advises & Qualifies", desc: "Goals captured, suitable services recommended, consultation offered." },
      { title: "Consultation Booked", desc: "Auto-scheduled — your team already knows the new client's needs." },
    ],
    tr: [
      { title: "WhatsApp Talebi", desc: "Aday bir program veya tedavi hakkında mesaj atar — uygun olan zamanda." },
      { title: "YZ Danışır & Niteler", desc: "Hedefler kaydedilir, uygun hizmetler önerilir, danışma teklif edilir." },
      { title: "Danışma Randevusu", desc: "Otomatik planlanır — ekibiniz yeni müşterinin ihtiyaçlarını önceden bilir." },
    ],
  },
  stats: {
    de: [["2000+", "Sessions"], ["5 ★", "Bewertung"], ["1h", "Erstgespräch"]],
    en: [["2000+", "Sessions"], ["5 ★", "Rating"], ["1hr", "Initial consultation"]],
    tr: [["2000+", "Seans"], ["5 ★", "Puan"], ["1 Saat", "İlk görüşme"]],
  },
  servicesSubtitle: {
    de: "Ganzheitliche Wellness-Angebote für Körper und Geist — individuell, evidenzbasiert und nachhaltig.",
    en: "Holistic wellness services for body and mind — individualised, evidence-based and lasting.",
    tr: "Beden ve zihin için bütünsel wellness hizmetleri — bireysel, kanıta dayalı ve kalıcı.",
  },
  infoTitle: {
    de: "Ihr Weg zu mehr Wohlbefinden",
    en: "Your Path to Wellbeing",
    tr: "İyilik Halinize Giden Yol",
  },
  botPersonaLabel: {
    de: "Wellness-Beratung · Online",
    en: "Wellness Advisor · Online",
    tr: "Wellness Danışmanı · Çevrimiçi",
  },
};

// ─────────────────────────────────────────────────────────
// Secondary verticals — clean professional treatment
// ─────────────────────────────────────────────────────────

const careTheme: IndustryTheme = {
  serviceIconNames: ["Home", "Heart", "Users"],
  trustBadges: ["Qualified Carers", "24/7 Support", "Culturally Sensitive", "Insured & DBS Checked"],
  cardStyle: "standard",
  botMessages: {
    de: [
      { from: "bot", text: "Hallo! Ich bin der KI-Assistent. Wie kann ich Ihnen helfen?" },
      { from: "user", text: "Ich suche Pflege für meinen Vater, er braucht Hilfe beim Alltag." },
      { from: "bot", text: "Gerne helfe ich Ihnen. Wie alt ist Ihr Vater und in welcher Stadt wohnt er?" },
    ],
    en: [
      { from: "bot", text: "Hello! I'm your AI assistant. How can I help?" },
      { from: "user", text: "I'm looking for care for my father — he needs help with daily activities." },
      { from: "bot", text: "I'd be happy to help. How old is your father and which city does he live in?" },
    ],
    tr: [
      { from: "bot", text: "Merhaba! Ben YZ asistanınım. Nasıl yardımcı olabilirim?" },
      { from: "user", text: "Babam için bakım arıyorum, günlük işlerde yardıma ihtiyacı var." },
      { from: "bot", text: "Memnuniyetle yardımcı olurum. Babanız kaç yaşında ve hangi şehirde yaşıyor?" },
    ],
  },
  steps: {
    de: [
      { title: "Nachricht empfangen", desc: "Jemand schreibt auf WhatsApp an Ihre Pflegedienstnummer." },
      { title: "KI qualifiziert", desc: "Sprache erkannt, Bedarf erfasst, passende Antwort aus Ihrer Wissensbasis generiert." },
      { title: "Termin gebucht", desc: "Rückruf automatisch eingeplant — Ihr Team findet den Lead fertig qualifiziert im Dashboard." },
    ],
    en: [
      { title: "Message Received", desc: "Someone messages your care service on WhatsApp." },
      { title: "AI Qualifies", desc: "Language detected, care needs captured, reply generated from your knowledge base." },
      { title: "Appointment Booked", desc: "Callback auto-scheduled — your team finds the lead fully qualified in the dashboard." },
    ],
    tr: [
      { title: "Mesaj Alındı", desc: "Biri bakım hattınıza WhatsApp üzerinden yazıyor." },
      { title: "YZ Niteler", desc: "Dil algılandı, ihtiyaç belirlendi, bilgi tabanınıza dayalı yanıt oluşturuldu." },
      { title: "Randevu Oluşturuldu", desc: "Geri arama otomatik planlandı — ekibiniz müşteriyi gösterge panelinde hazır bulur." },
    ],
  },
  stats: {
    de: [["150+", "Pflegebedürftige"], ["30+", "Fachkräfte"], ["10+", "Jahre"]],
    en: [["150+", "People Cared For"], ["30+", "Specialists"], ["10+", "Years"]],
    tr: [["150+", "Bakım Alan"], ["30+", "Uzman"], ["10+", "Yıl"]],
  },
  servicesSubtitle: {
    de: "Umfassende, kultursensible Pflegedienstleistungen für ein würdevolles Leben im Alter.",
    en: "Comprehensive, culturally sensitive care services for a dignified life in old age.",
    tr: "Yaşlı bireylerin onurlu bir yaşam sürmesi için kapsamlı, kültüre duyarlı bakım hizmetleri.",
  },
  infoTitle: {
    de: "Geborgenheit durch kulturelle Nähe",
    en: "Security Through Cultural Closeness",
    tr: "Kültürel Yakınlıkla Güven",
  },
  botPersonaLabel: {
    de: "KI-Assistent · Online",
    en: "AI Assistant · Online",
    tr: "YZ Asistanı · Çevrimiçi",
  },
};

const defaultTheme: IndustryTheme = {
  serviceIconNames: ["Star", "Shield", "Users"],
  trustBadges: ["Professional Team", "Fast Response", "GDPR Compliant", "Fully Insured"],
  cardStyle: "standard",
  botMessages: {
    de: [
      { from: "bot", text: "Hallo! Wie kann ich Ihnen helfen?" },
      { from: "user", text: "Ich hätte gerne mehr Informationen zu Ihren Leistungen." },
      { from: "bot", text: "Gerne! Ich kann Ihnen direkt weiterhelfen oder einen Beratungstermin vereinbaren." },
    ],
    en: [
      { from: "bot", text: "Hello! How can I help you today?" },
      { from: "user", text: "I'd like more information about your services." },
      { from: "bot", text: "Of course! I can help right away or book a consultation for you." },
    ],
    tr: [
      { from: "bot", text: "Merhaba! Nasıl yardımcı olabilirim?" },
      { from: "user", text: "Hizmetleriniz hakkında bilgi almak istiyorum." },
      { from: "bot", text: "Tabii ki! Hemen yardımcı olabilir veya danışma randevusu ayarlayabilirim." },
    ],
  },
  steps: {
    de: [
      { title: "Nachricht empfangen", desc: "Jemand schreibt auf WhatsApp — rund um die Uhr." },
      { title: "KI antwortet & qualifiziert", desc: "Anfrage erfasst, Fragen beantwortet, nächster Schritt angeboten." },
      { title: "Termin gebucht", desc: "Rückruf automatisch eingeplant — bereit für Ihr Team im Dashboard." },
    ],
    en: [
      { title: "Message Received", desc: "Someone messages on WhatsApp — any time of day." },
      { title: "AI Responds & Qualifies", desc: "Enquiry captured, questions answered, next step offered." },
      { title: "Appointment Booked", desc: "Auto-scheduled — ready for your team in the dashboard." },
    ],
    tr: [
      { title: "Mesaj Alındı", desc: "Biri WhatsApp'tan mesaj atar — günün her saatinde." },
      { title: "YZ Yanıtlar & Niteler", desc: "Talep kaydedilir, sorular yanıtlanır, sonraki adım önerilir." },
      { title: "Randevu Oluşturuldu", desc: "Otomatik planlanır — ekibiniz için panelde hazır." },
    ],
  },
  stats: {
    de: [["500+", "Kunden"], ["5 ★", "Bewertung"], ["24/7", "Erreichbar"]],
    en: [["500+", "Clients"], ["5 ★", "Rating"], ["24/7", "Available"]],
    tr: [["500+", "Müşteri"], ["5 ★", "Puan"], ["24/7", "Erişilebilir"]],
  },
  servicesSubtitle: {
    de: "Professionelle Leistungen — zuverlässig, schnell und auf Ihre Bedürfnisse zugeschnitten.",
    en: "Professional services — reliable, fast and tailored to your needs.",
    tr: "Profesyonel hizmetler — güvenilir, hızlı ve ihtiyaçlarınıza göre uyarlanmış.",
  },
  infoTitle: {
    de: "Warum uns wählen",
    en: "Why Choose Us",
    tr: "Neden Bizi Seçmelisiniz",
  },
  botPersonaLabel: {
    de: "KI-Assistent · Online",
    en: "AI Assistant · Online",
    tr: "YZ Asistanı · Çevrimiçi",
  },
};

// ─────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────

export const PRIMARY_VERTICALS = new Set(["aesthetics", "medical", "dental", "wellness"]);

const THEME_MAP: Record<string, IndustryTheme> = {
  aesthetics: aestheticsTheme,
  medical: medicalTheme,
  dental: dentalTheme,
  wellness: wellnessTheme,
  care: careTheme,
};

export function getIndustryTheme(industry?: string | null): IndustryTheme {
  return THEME_MAP[industry ?? ""] ?? defaultTheme;
}

export type ThemeLang = "de" | "en" | "tr";

export function getLang(demoLanguage?: string | null): ThemeLang {
  const l = demoLanguage ?? "de";
  return (["de", "en", "tr"].includes(l) ? l : "de") as ThemeLang;
}
