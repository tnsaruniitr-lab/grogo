/**
 * Industry theme system.
 *
 * HOW THE THEME IS DECIDED:
 *   1. After every crawl, GPT analyses the homepage text and classifies `industry`
 *      (aesthetics / medical / dental / wellness / care / legal / …)
 *   2. That value is stored on the client config and returned by /clients/:slug/branding
 *   3. demo.tsx calls getIndustryTheme(branding.industry) → full theme object
 *   4. PRIMARY_VERTICALS (aesthetics, medical, dental, wellness) get premium card style
 *      + trust bar. Everything else gets clean standard treatment.
 *
 * CONTENT PRIORITY (in demo.tsx):
 *   1. Real crawled content (content.services / content.about / …) — always preferred
 *   2. Theme fallbacks below (industry-specific, never Dosteli care copy)
 *   3. Nothing renders half-empty — a section either shows real data or a full fallback
 *
 * Primary verticals  — exceptional treatment: aesthetics, medical, dental, wellness
 * Secondary verticals — clean professional:   care, and everything else
 */

export type CardStyle = "premium" | "standard";

export interface IndustryTheme {
  trustBadgesI18n?: Record<string, string[]>;
  /** Per-language hero headline (overrides stored branding.heroHeadline in demo.tsx) */
  heroHeadlineI18n?: Record<string, string>;
  serviceIconNames: [string, string, string];
  trustBadges: string[];
  cardStyle: CardStyle;
  botMessages: {
    de: Array<{ from: "bot" | "user"; text: string }>;
    en: Array<{ from: "bot" | "user"; text: string }>;
    tr: Array<{ from: "bot" | "user"; text: string }>;
  };
  steps: {
    de: Array<{ title: string; desc: string }>;
    en: Array<{ title: string; desc: string }>;
    tr: Array<{ title: string; desc: string }>;
  };
  stats: {
    de: Array<[string, string]>;
    en: Array<[string, string]>;
    tr: Array<[string, string]>;
  };
  servicesSubtitle: { de: string; en: string; tr: string };
  infoTitle: { de: string; en: string; tr: string };
  /** Body paragraph shown in the info section when no crawl data is available */
  infoBody: { de: string; en: string; tr: string };
  /** Bullet points shown in the info section when no crawl data is available */
  infoPoints: { de: string[]; en: string[]; tr: string[] };
  /** CTA label on the info section button */
  infoButton: { de: string; en: string; tr: string };
  /** Three service cards shown when no crawl data is available */
  servicesFallback: {
    de: Array<{ title: string; desc: string }>;
    en: Array<{ title: string; desc: string }>;
    tr: Array<{ title: string; desc: string }>;
  };
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
  infoBody: {
    de: "Unsere Klinik vereint modernste Technologie mit individueller Beratung, um außergewöhnliche ästhetische Ergebnisse zu erzielen. Jede Behandlung wird auf Ihre persönlichen Ziele abgestimmt.",
    en: "Our clinic combines cutting-edge technology with personalised care to deliver exceptional aesthetic results. Every treatment is tailored to your unique goals.",
    tr: "Kliniğimiz, olağanüstü estetik sonuçlar sunmak için en son teknolojiyi bireysel bakımla bir araya getiriyor. Her tedavi, kişisel hedeflerinize göre özel olarak tasarlanır.",
  },
  infoPoints: {
    de: ["Zertifizierte Fachkräfte mit nachgewiesener Expertise", "Individuelle Behandlungspläne", "Modernste Geräte und Technologien", "Diskrete und professionelle Atmosphäre"],
    en: ["Certified practitioners with proven expertise", "Personalised treatment plans", "State-of-the-art technology", "Discreet, professional environment"],
    tr: ["Kanıtlanmış uzmanlığa sahip sertifikalı uzmanlar", "Kişiselleştirilmiş tedavi planları", "Son teknoloji ekipmanlar", "Gizli ve profesyonel ortam"],
  },
  infoButton: {
    de: "Beratung vereinbaren",
    en: "Book a Consultation",
    tr: "Randevu Al",
  },
  servicesFallback: {
    de: [
      { title: "Ästhetische Behandlungen", desc: "Modernste Eingriffe zur Verschönerung und Verjüngung — individuell auf Ihre Bedürfnisse abgestimmt." },
      { title: "Hautpflege & Therapien", desc: "Professionelle Hautbehandlungen für eine strahlende, gesunde Haut — mit klinisch geprüften Methoden." },
      { title: "Beratung & Nachsorge", desc: "Umfassende Beratung vor der Behandlung und professionelle Nachsorge für optimale Ergebnisse." },
    ],
    en: [
      { title: "Aesthetic Treatments", desc: "Advanced procedures for enhancement and rejuvenation — individually tailored to your needs." },
      { title: "Skin Care & Therapies", desc: "Professional skin treatments for radiant, healthy skin — using clinically proven methods." },
      { title: "Consultation & Aftercare", desc: "Comprehensive pre-treatment consultation and professional aftercare for optimal results." },
    ],
    tr: [
      { title: "Estetik Tedaviler", desc: "Güzellik ve gençleştirme için gelişmiş prosedürler — ihtiyaçlarınıza göre bireysel olarak tasarlanmış." },
      { title: "Cilt Bakımı ve Terapiler", desc: "Parlak, sağlıklı cilt için profesyonel cilt tedavileri — klinik olarak kanıtlanmış yöntemler kullanılarak." },
      { title: "Danışmanlık ve Sonrası Bakım", desc: "Tedavi öncesi kapsamlı danışmanlık ve optimum sonuçlar için profesyonel sonrası bakım." },
    ],
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
  infoBody: {
    de: "Unsere Praxis bietet umfassende, patientenzentrierte medizinische Versorgung. Von der Routinevorsorge bis zur Fachberatung — wir sind für Sie da.",
    en: "Our practice delivers comprehensive, patient-centred medical care. From routine check-ups to specialist consultations, we're here for you.",
    tr: "Muayenehanemiz kapsamlı, hasta odaklı tıbbi bakım sunar. Rutin kontrollerden uzman danışmanlığına kadar — sizin için buradayız.",
  },
  infoPoints: {
    de: ["Erfahrenes, qualifiziertes Ärzteteam", "Kurzfristige Terminvergabe", "Ganzheitliche Patientenbetreuung", "Digitale Patientenakte"],
    en: ["Experienced, qualified medical team", "Same-day appointments available", "Holistic patient care", "Digital health records"],
    tr: ["Deneyimli, nitelikli tıbbi ekip", "Aynı gün randevu imkânı", "Bütüncül hasta bakımı", "Dijital sağlık kayıtları"],
  },
  infoButton: {
    de: "Termin vereinbaren",
    en: "Book an Appointment",
    tr: "Randevu Al",
  },
  servicesFallback: {
    de: [
      { title: "Allgemeinmedizin", desc: "Umfassende hausärztliche Versorgung für die ganze Familie — von der Vorsorge bis zur Behandlung." },
      { title: "Fachberatung", desc: "Gezielte Fachkonsultationen und Überweisungen an Spezialisten Ihres Vertrauens." },
      { title: "Gesundheitsvorsorge", desc: "Präventive Untersuchungen und Impfungen für langfristige Gesundheit und Wohlbefinden." },
    ],
    en: [
      { title: "General Medicine", desc: "Comprehensive GP care for the whole family — from routine check-ups to treatment." },
      { title: "Specialist Referrals", desc: "Targeted specialist consultations and referrals to trusted experts." },
      { title: "Preventive Health", desc: "Preventive screenings and vaccinations for long-term health and wellbeing." },
    ],
    tr: [
      { title: "Genel Tıp", desc: "Tüm aile için kapsamlı pratisyen hekim hizmetleri — rutin kontrollerden tedaviye kadar." },
      { title: "Uzman Yönlendirme", desc: "Güvenilir uzmanlara hedefli danışmanlık ve yönlendirme." },
      { title: "Koruyucu Sağlık", desc: "Uzun vadeli sağlık ve iyilik hali için koruyucu taramalar ve aşılar." },
    ],
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
  infoBody: {
    de: "Wir bieten sanfte, hochwertige Zahnmedizin für die ganze Familie — von der professionellen Reinigung bis hin zu modernen ästhetischen Behandlungen.",
    en: "We offer gentle, high-quality dental care for the whole family — from routine hygiene to advanced cosmetic dentistry.",
    tr: "Tüm aile için nazik, yüksek kaliteli diş bakımı sunuyoruz — rutin hijyenden gelişmiş kozmetik diş hekimliğine kadar.",
  },
  infoPoints: {
    de: ["Sanfte, schmerzarme Behandlungen", "Digitale Röntgentechnologie", "Ästhetische & allgemeine Zahnheilkunde", "Flexible Terminzeiten"],
    en: ["Comfortable, pain-free treatments", "Digital X-ray technology", "Cosmetic & general dentistry", "Flexible appointment times"],
    tr: ["Konforlu, ağrısız tedaviler", "Dijital röntgen teknolojisi", "Kozmetik ve genel diş hekimliği", "Esnek randevu saatleri"],
  },
  infoButton: {
    de: "Termin buchen",
    en: "Book an Appointment",
    tr: "Randevu Al",
  },
  servicesFallback: {
    de: [
      { title: "Prophylaxe & Hygiene", desc: "Professionelle Zahnreinigung und individuelle Prophylaxeberatung für langfristig gesunde Zähne." },
      { title: "Ästhetische Zahnheilkunde", desc: "Bleaching, Veneers und Zahnersatz für ein strahlendes, natürliches Lächeln." },
      { title: "Implantate & Prothetik", desc: "Hochwertige Zahnimplantate und Prothesen für einen festen, natürlichen Biss." },
    ],
    en: [
      { title: "Hygiene & Prevention", desc: "Professional cleaning and individual hygiene advice for long-term dental health." },
      { title: "Cosmetic Dentistry", desc: "Whitening, veneers and restorations for a bright, natural-looking smile." },
      { title: "Implants & Prosthetics", desc: "High-quality dental implants and dentures for a firm, natural bite." },
    ],
    tr: [
      { title: "Hijyen ve Önleme", desc: "Uzun vadeli diş sağlığı için profesyonel temizlik ve bireysel hijyen tavsiyesi." },
      { title: "Kozmetik Diş Hekimliği", desc: "Parlak, doğal görünümlü bir gülümseme için beyazlatma, kaplama ve restorasyonlar." },
      { title: "İmplant ve Protez", desc: "Sağlam, doğal bir ısırış için yüksek kaliteli diş implantları ve takma dişler." },
    ],
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
  infoBody: {
    de: "Unsere ganzheitlichen Wellness-Programme sind auf Ihre persönlichen Ziele ausgerichtet — eine Verbindung aus evidenzbasierten Therapien und einem wirklich individuellen Ansatz.",
    en: "Our holistic wellness programmes are designed around your personal goals — blending evidence-based therapies with a truly personalised approach.",
    tr: "Bütünsel wellness programlarımız kişisel hedefleriniz etrafında tasarlanmıştır — kanıta dayalı terapileri gerçek anlamda kişiselleştirilmiş bir yaklaşımla harmanlar.",
  },
  infoPoints: {
    de: ["Zertifizierte Wellness-Therapeuten", "Individuelle Programme nach Maß", "Ganzheitlicher Ansatz für Körper & Geist", "Begleitende Beratung & Unterstützung"],
    en: ["Certified wellness therapists", "Personalised programmes tailored to you", "Mind & body holistic approach", "Ongoing support & guidance"],
    tr: ["Sertifikalı wellness terapistleri", "Size özel kişiselleştirilmiş programlar", "Beden ve zihin bütünsel yaklaşımı", "Sürekli destek ve rehberlik"],
  },
  infoButton: {
    de: "Erstgespräch buchen",
    en: "Book a Consultation",
    tr: "Danışma Randevusu Al",
  },
  servicesFallback: {
    de: [
      { title: "Wellness-Beratung", desc: "Individuelle Erstberatung zur Ermittlung Ihrer Ziele und Entwicklung eines maßgeschneiderten Wellness-Plans." },
      { title: "Therapeutische Behandlungen", desc: "Professionelle Therapien für Körper und Geist — aus einem breiten Spektrum evidenzbasierter Methoden." },
      { title: "Wellbeing-Programme", desc: "Strukturierte Programme für nachhaltige Verbesserung Ihres körperlichen und mentalen Wohlbefindens." },
    ],
    en: [
      { title: "Wellness Consultation", desc: "Individual initial consultation to identify your goals and develop a tailored wellness plan." },
      { title: "Therapeutic Treatments", desc: "Professional therapies for body and mind — from a wide range of evidence-based methods." },
      { title: "Wellbeing Programmes", desc: "Structured programmes for sustainable improvement of your physical and mental wellbeing." },
    ],
    tr: [
      { title: "Wellness Danışmanlığı", desc: "Hedeflerinizi belirlemek ve kişiye özel bir wellness planı geliştirmek için bireysel ilk görüşme." },
      { title: "Terapötik Tedaviler", desc: "Beden ve zihin için profesyonel terapiler — geniş bir kanıta dayalı yöntem yelpazesinden." },
      { title: "İyilik Hali Programları", desc: "Fiziksel ve zihinsel iyilik halinizin sürdürülebilir gelişimi için yapılandırılmış programlar." },
    ],
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
  heroHeadlineI18n: {
    de: "Kultursensible Pflege — zu Hause",
    en: "Culturally Sensitive Home Care",
    tr: "Kültüre Özgü Ev Bakımı",
  },
  serviceIconNames: ["Home", "Heart", "Users"],
  trustBadges: ["Qualified Carers", "24/7 Support", "Culturally Sensitive", "Fully Insured"],
  trustBadgesI18n: {
    de: ["Zugelassener Pflegedienst", "24/7 Erreichbarkeit", "Kultursensible Pflege", "Geprüfte Pflegekräfte"],
    tr: ["Onaylı Bakım Hizmeti", "7/24 Destek", "Kültürel Duyarlılık", "Denetlenmiş Personel"],
  },
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
  infoBody: {
    de: "Für Menschen mit Demenz ist die Muttersprache und eine vertraute kulturelle Umgebung essenziell. Wir schaffen ein Zuhause, das genau das bietet.",
    en: "For people with dementia, their native language and a familiar cultural environment are essential. We create a home that offers exactly that.",
    tr: "Demans hastaları için anadil ve tanıdık kültürel ortam çok önemlidir. Tam da bunu sunan bir yuva yaratıyoruz.",
  },
  infoPoints: {
    de: ["Muttersprachliches Pflegepersonal", "Kulturspezifische Mahlzeiten", "Berücksichtigung religiöser Feiertage", "Familienfreundliche Besuchszeiten"],
    en: ["Native-speaking care staff", "Culturally appropriate meals", "Religious holidays respected", "Family-friendly visiting hours"],
    tr: ["Anadil konuşan bakım personeli", "Kültüre özgü yemekler", "Dini bayramların dikkate alınması", "Aile dostu ziyaret saatleri"],
  },
  infoButton: {
    de: "Plätze anfragen",
    en: "Enquire About Availability",
    tr: "Yer Sorgula",
  },
  servicesFallback: {
    de: [
      { title: "Häusliche Pflege", desc: "Medizinische und pflegerische Versorgung in den eigenen vier Wänden. Vertraut, sicher und respektvoll." },
      { title: "24h Betreuung", desc: "Rund-um-die-Uhr Betreuung für maximale Sicherheit und Geborgenheit im eigenen Zuhause." },
      { title: "Demenzpflege WG", desc: "Eine familiäre Wohngemeinschaft für demenzerkrankte Menschen mit 24/7 Betreuung durch muttersprachliches Personal." },
    ],
    en: [
      { title: "Home Care", desc: "Medical and nursing care in your own home. Familiar, safe and respectful." },
      { title: "24h Care", desc: "Around-the-clock care for maximum safety and comfort at home." },
      { title: "Dementia Care Home", desc: "A family-style shared home for people with dementia, staffed 24/7 by native speakers." },
    ],
    tr: [
      { title: "Evde Bakım", desc: "Kendi evinde tıbbi ve bakım hizmetleri. Güvenilir, emniyetli ve saygılı." },
      { title: "24 Saat Bakım", desc: "Evde maksimum güvenlik ve huzur için günün her saati bakım." },
      { title: "Demans Bakım Evi", desc: "Anadil konuşan personel tarafından 7/24 bakım sağlanan aile sıcaklığında bir yaşam ortamı." },
    ],
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
  infoBody: {
    de: "Wir stehen für verlässliche, professionelle Leistungen — schnell, kompetent und auf Ihre Bedürfnisse zugeschnitten.",
    en: "We stand for reliable, professional services — fast, competent and tailored to your needs.",
    tr: "Güvenilir, profesyonel hizmetlerin yanında duruyoruz — hızlı, yetkin ve ihtiyaçlarınıza göre uyarlanmış.",
  },
  infoPoints: {
    de: ["Erfahrenes, professionelles Team", "Schnelle Reaktionszeiten", "DSGVO-konform & versichert", "Individuelle Beratung"],
    en: ["Experienced, professional team", "Fast response times", "GDPR compliant & insured", "Individual consultation"],
    tr: ["Deneyimli, profesyonel ekip", "Hızlı yanıt süreleri", "GDPR uyumlu ve sigortalı", "Bireysel danışmanlık"],
  },
  infoButton: {
    de: "Kontakt aufnehmen",
    en: "Get in Touch",
    tr: "İletişime Geç",
  },
  servicesFallback: {
    de: [
      { title: "Unsere Leistungen", desc: "Professionelle, auf Ihre Bedürfnisse zugeschnittene Dienstleistungen — zuverlässig und kompetent." },
      { title: "Beratung & Planung", desc: "Individuelle Beratung und maßgeschneiderte Lösungen für Ihre Anforderungen." },
      { title: "Support & Nachsorge", desc: "Umfassender Support und kontinuierliche Betreuung für nachhaltigen Erfolg." },
    ],
    en: [
      { title: "Our Services", desc: "Professional services tailored to your needs — reliable and competent." },
      { title: "Consultation & Planning", desc: "Individual consultation and tailored solutions for your requirements." },
      { title: "Support & Follow-up", desc: "Comprehensive support and continuous care for lasting success." },
    ],
    tr: [
      { title: "Hizmetlerimiz", desc: "İhtiyaçlarınıza göre uyarlanmış profesyonel hizmetler — güvenilir ve yetkin." },
      { title: "Danışmanlık ve Planlama", desc: "Gereksinimleriniz için bireysel danışmanlık ve özel çözümler." },
      { title: "Destek ve Takip", desc: "Kalıcı başarı için kapsamlı destek ve sürekli bakım." },
    ],
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

export const PRIMARY_VERTICALS = new Set(["aesthetics", "medical", "dental", "wellness", "hair", "iv-therapy", "physiotherapy", "cosmetic-surgery", "laser-eye", "fertility", "weight-management"]);

const THEME_MAP: Record<string, IndustryTheme> = {
  aesthetics: aestheticsTheme,
  medical: medicalTheme,
  dental: dentalTheme,
  wellness: wellnessTheme,
  care: careTheme,
  hair: aestheticsTheme,
  "iv-therapy": aestheticsTheme,
  physiotherapy: medicalTheme,
  "cosmetic-surgery": aestheticsTheme,
  "laser-eye": medicalTheme,
  fertility: careTheme,
  "weight-management": medicalTheme,
};

/** Maps industry key → video filename served from /videos/ */
export const INDUSTRY_VIDEO_MAP: Record<string, string> = {
  aesthetics: "/videos/medspa-treatment.mp4",
  wellness: "/videos/wellness-meditation.mp4",
  care: "/videos/care-compassion.mp4",
  dental: "/videos/dental-smile.mp4",
  hair: "/videos/hair-clinic.mp4",
  physiotherapy: "/videos/physio-rehab.mp4",
  "iv-therapy": "/videos/iv-therapy.mp4",
  "cosmetic-surgery": "/videos/cosmetic-surgery.mp4",
  "laser-eye": "/videos/laser-eye.mp4",
  fertility: "/videos/fertility-ivf.mp4",
  "weight-management": "/videos/weight-management.mp4",
};

export const INDUSTRY_OPTIONS: Array<{ value: string; label: string; emoji: string }> = [
  { value: "aesthetics",       label: "Medspa",        emoji: "✨" },
  { value: "dental",           label: "Dental",         emoji: "🦷" },
  { value: "wellness",         label: "Wellness",       emoji: "🌿" },
  { value: "physiotherapy",    label: "Physio",         emoji: "🏃" },
  { value: "hair",             label: "Hair Clinic",    emoji: "💆" },
  { value: "iv-therapy",       label: "IV Therapy",     emoji: "⚡" },
  { value: "cosmetic-surgery", label: "Surgery",        emoji: "⭐" },
  { value: "laser-eye",        label: "Laser Eye",      emoji: "👁" },
  { value: "fertility",        label: "Fertility",      emoji: "❤️" },
  { value: "weight-management",label: "Weight Mgmt",    emoji: "📉" },
  { value: "care",             label: "Home Care",      emoji: "🏠" },
  { value: "medical",          label: "Medical / GP",   emoji: "🩺" },
];

export function getIndustryTheme(industry?: string | null): IndustryTheme {
  return THEME_MAP[industry ?? ""] ?? defaultTheme;
}

// ─────────────────────────────────────────────────────────
// Schema.org types per industry (for JSON-LD structured data)
// ─────────────────────────────────────────────────────────

export const INDUSTRY_SCHEMA_TYPES: Record<string, string[]> = {
  aesthetics:          ["LocalBusiness", "HealthAndBeautyBusiness"],
  medical:             ["LocalBusiness", "MedicalBusiness"],
  dental:              ["LocalBusiness", "Dentist"],
  wellness:            ["LocalBusiness", "HealthClub"],
  care:                ["LocalBusiness", "HomeAndConstructionBusiness"],
  hair:                ["LocalBusiness", "HairSalon"],
  "iv-therapy":        ["LocalBusiness", "MedicalBusiness"],
  physiotherapy:       ["LocalBusiness", "MedicalBusiness"],
  "cosmetic-surgery":  ["LocalBusiness", "MedicalBusiness"],
  "laser-eye":         ["LocalBusiness", "Optician"],
  fertility:           ["LocalBusiness", "MedicalBusiness"],
  "weight-management": ["LocalBusiness", "MedicalBusiness"],
};

// ─────────────────────────────────────────────────────────
// Testimonials per industry (bilingual, realistic)
// ─────────────────────────────────────────────────────────

export interface Testimonial {
  name: string;
  location: string;
  rating: number;
  text: { de: string; en: string; tr: string };
}

const TESTIMONIAL_KEY_FALLBACK: Record<string, string> = {
  hair:                "aesthetics",
  "iv-therapy":        "aesthetics",
  "cosmetic-surgery":  "aesthetics",
  physiotherapy:       "medical",
  "laser-eye":         "medical",
  fertility:           "care",
  "weight-management": "medical",
};

const INDUSTRY_TESTIMONIALS: Record<string, Testimonial[]> = {
  aesthetics: [
    {
      name: "Sarah M.", location: "Berlin", rating: 5,
      text: {
        de: "Der Buchungsprozess war unglaublich einfach. Der Bot hat sofort geantwortet und mir in 2 Minuten einen Termin bestätigt.",
        en: "The booking process was incredibly smooth. The bot responded instantly and confirmed my appointment in under 2 minutes.",
        tr: "Rezervasyon süreci inanılmaz kolaydı. Bot anında yanıt verdi ve randevumu 2 dakika içinde onayladı.",
      },
    },
    {
      name: "Julia K.", location: "München", rating: 5,
      text: {
        de: "Endlich eine Klinik, die rund um die Uhr erreichbar ist. Meine Fragen wurden sofort und kompetent beantwortet.",
        en: "Finally a clinic reachable around the clock. My questions were answered immediately and professionally.",
        tr: "Sonunda 7/24 ulaşılabilen bir klinik. Sorularım hemen ve profesyonelce yanıtlandı.",
      },
    },
    {
      name: "Cem A.", location: "Hamburg", rating: 5,
      text: {
        de: "Ich habe um Mitternacht geschrieben und bekam sofort eine professionelle Antwort. Absolut beeindruckend.",
        en: "I messaged at midnight and got an instant professional reply. Absolutely impressive.",
        tr: "Gece yarısı mesaj yazdım ve anında profesyonel bir yanıt aldım. Kesinlikle etkileyici.",
      },
    },
  ],
  dental: [
    {
      name: "Thomas B.", location: "Frankfurt", rating: 5,
      text: {
        de: "Schnelle Terminbuchung, kein Warten in der Warteschleife. Der WhatsApp-Bot macht alles viel angenehmer.",
        en: "Fast appointment booking with no waiting on hold. The WhatsApp bot makes everything so much easier.",
        tr: "Hızlı randevu ve beklemeler yok. WhatsApp botu her şeyi çok kolaylaştırıyor.",
      },
    },
    {
      name: "Anna L.", location: "Köln", rating: 5,
      text: {
        de: "Ich hatte Angst vor dem Zahnarzt — der Bot hat mir alle Fragen ruhig und klar beantwortet.",
        en: "I was anxious about the dentist — the bot answered all my questions calmly and clearly.",
        tr: "Dişçiden korkuyordum — bot tüm sorularımı sakin ve net bir şekilde yanıtladı.",
      },
    },
    {
      name: "Mark S.", location: "Stuttgart", rating: 5,
      text: {
        de: "Meine gesamte Familie hat Termine gebucht, alles lief reibungslos. Klasse System.",
        en: "My whole family booked appointments, everything ran perfectly. Great system.",
        tr: "Tüm ailem randevu aldı, her şey sorunsuz çalıştı. Harika sistem.",
      },
    },
  ],
  medical: [
    {
      name: "Petra M.", location: "Berlin", rating: 5,
      text: {
        de: "Der Bot versteht mein Anliegen und leitet mich genau an die richtige Stelle weiter. Sehr beeindruckend.",
        en: "The bot understands my concern and directs me exactly where I need to go. Very impressive.",
        tr: "Bot endişemi anlıyor ve tam olarak doğru yere yönlendiriyor. Çok etkileyici.",
      },
    },
    {
      name: "Hans J.", location: "Düsseldorf", rating: 5,
      text: {
        de: "Kein Warten in der Warteschleife mehr. Der Bot hat meinen Rückruf direkt gebucht — perfekt.",
        en: "No more waiting on hold. The bot booked my callback directly — perfect.",
        tr: "Artık bekleme müziği yok. Bot geri aramasını doğrudan ayarladı — mükemmel.",
      },
    },
    {
      name: "Fatma Y.", location: "Berlin", rating: 5,
      text: {
        de: "Ich konnte auf Türkisch schreiben und bekam sofort eine Antwort. Das ist sehr wichtig für mich.",
        en: "I could write in Turkish and got an immediate response. That's very important to me.",
        tr: "Türkçe yazabildim ve hemen yanıt aldım. Bu benim için çok önemli.",
      },
    },
  ],
  wellness: [
    {
      name: "Lisa H.", location: "München", rating: 5,
      text: {
        de: "Der Bot hat mir genau erklärt, welches Programm zu meinen Zielen passt. Fühlt sich persönlich an.",
        en: "The bot explained exactly which programme suits my goals. It feels personal.",
        tr: "Bot, hedeflerime en uygun programı tam olarak açıkladı. Kişisel hissettiriyor.",
      },
    },
    {
      name: "Marco P.", location: "Wien", rating: 5,
      text: {
        de: "24/7 Erreichbarkeit ist für mich als Schichtarbeiter Gold wert. Termin gebucht, fertig.",
        en: "24/7 availability is golden for me as a shift worker. Appointment booked, done.",
        tr: "Vardiyalı çalışan biri olarak 7/24 ulaşılabilirlik altın değerinde. Randevu alındı, bitti.",
      },
    },
    {
      name: "Ayşe D.", location: "Berlin", rating: 5,
      text: {
        de: "Sehr einfühlsam und professionell. Ich habe mich sofort gut aufgehoben gefühlt.",
        en: "Very empathetic and professional. I felt looked after right away.",
        tr: "Çok anlayışlı ve profesyonel. Hemen kendimi iyi hissettim.",
      },
    },
  ],
  care: [
    {
      name: "Renate K.", location: "Berlin", rating: 5,
      text: {
        de: "In einer stressigen Situation hat der Bot ruhig alle Optionen erklärt. Das hat uns wirklich geholfen.",
        en: "In a stressful situation the bot calmly explained all options. It really helped us.",
        tr: "Stresli bir durumda bot sakin bir şekilde tüm seçenekleri açıkladı. Bu bize gerçekten yardımcı oldu.",
      },
    },
    {
      name: "Familie Müller", location: "Hamburg", rating: 5,
      text: {
        de: "Wir konnten auch auf Türkisch mit dem Bot kommunizieren. Das war für unsere Mutter sehr wichtig.",
        en: "We could also communicate with the bot in Turkish. That was very important for our mother.",
        tr: "Botla Türkçe de iletişim kurabildik. Bu annemiz için çok önemliydi.",
      },
    },
    {
      name: "Stefan R.", location: "München", rating: 5,
      text: {
        de: "Nachts um 2 Uhr hatte ich Fragen zur Pflege meines Vaters — und bekam sofort hilfreiche Antworten.",
        en: "At 2am I had questions about my father's care — and got helpful answers immediately.",
        tr: "Gece 2'de babamın bakımı hakkında sorularım vardı — ve hemen yararlı yanıtlar aldım.",
      },
    },
  ],
};

// ─────────────────────────────────────────────────────────
// FAQ fallbacks per industry (shown when no crawl data)
// ─────────────────────────────────────────────────────────

export interface FAQItem {
  q: { de: string; en: string; tr: string };
  a: { de: string; en: string; tr: string };
}

const FAQ_KEY_FALLBACK: Record<string, string> = {
  hair:                "aesthetics",
  "iv-therapy":        "aesthetics",
  "cosmetic-surgery":  "aesthetics",
  physiotherapy:       "medical",
  "laser-eye":         "medical",
  fertility:           "care",
  "weight-management": "medical",
};

const INDUSTRY_FAQ_FALLBACKS: Record<string, FAQItem[]> = {
  aesthetics: [
    { q: { de: "Wie buche ich einen Termin?", en: "How do I book an appointment?", tr: "Randevu nasıl alırım?" },
      a: { de: "Schreiben Sie uns auf WhatsApp — unser KI-Assistent antwortet sofort, rund um die Uhr.", en: "Simply message us on WhatsApp — our AI assistant responds instantly, 24/7.", tr: "Bize WhatsApp'tan yazın — yapay zeka asistanımız 7/24 anında yanıt verir." } },
    { q: { de: "Welche Behandlungen bieten Sie an?", en: "What treatments do you offer?", tr: "Hangi tedavileri sunuyorsunuz?" },
      a: { de: "Wir bieten Botox, Filler, Laserbehandlungen, Hautpflege und weitere ästhetische Behandlungen an.", en: "We offer Botox, fillers, laser treatments, skincare and further aesthetic treatments.", tr: "Botoks, dolgu, lazer tedavileri, cilt bakımı ve diğer estetik tedavileri sunuyoruz." } },
    { q: { de: "Ist eine Erstberatung kostenlos?", en: "Is an initial consultation free?", tr: "İlk danışma ücretsiz mi?" },
      a: { de: "Ja, wir bieten kostenlose Erstberatungen an. Unser WhatsApp-Bot bucht direkt einen Termin für Sie.", en: "Yes, we offer free initial consultations. Our WhatsApp bot books directly for you.", tr: "Evet, ücretsiz ilk danışma sunuyoruz. WhatsApp botumuz sizin için doğrudan randevu alır." } },
    { q: { de: "Wie lange dauert eine Behandlung?", en: "How long does a treatment take?", tr: "Tedavi ne kadar sürer?" },
      a: { de: "Die Behandlungsdauer variiert je nach Eingriff zwischen 30 Minuten und 2 Stunden.", en: "Treatment duration varies between 30 minutes and 2 hours depending on the procedure.", tr: "Tedavi süresi işleme göre 30 dakika ile 2 saat arasında değişir." } },
    { q: { de: "Sind Ihre Behandlungen sicher?", en: "Are your treatments safe?", tr: "Tedavileriniz güvenli mi?" },
      a: { de: "Alle Behandlungen werden von zertifizierten Fachärzten durchgeführt. Wir verwenden ausschließlich zugelassene Produkte.", en: "All treatments are performed by certified specialists using exclusively approved products.", tr: "Tüm tedaviler sertifikalı uzmanlar tarafından, yalnızca onaylı ürünler kullanılarak yapılır." } },
  ],
  dental: [
    { q: { de: "Bieten Sie ästhetische Zahnbehandlungen an?", en: "Do you offer cosmetic dental treatments?", tr: "Estetik diş tedavileri sunuyor musunuz?" },
      a: { de: "Ja, wir bieten Zahnaufhellung, Veneers, unsichtbare Zahnspangen und weitere kosmetische Behandlungen an.", en: "Yes, we offer teeth whitening, veneers, invisible braces and further cosmetic treatments.", tr: "Evet, diş beyazlatma, veneer, görünmez diş teli ve daha fazlasını sunuyoruz." } },
    { q: { de: "Wie buche ich einen Zahnarzttermin?", en: "How do I book a dental appointment?", tr: "Diş hekimi randevusu nasıl alırım?" },
      a: { de: "Schreiben Sie uns auf WhatsApp — unser Assistent bucht sofort einen passenden Termin.", en: "Message us on WhatsApp — our assistant books a suitable appointment instantly.", tr: "Bize WhatsApp'tan yazın — asistanımız size uygun randevuyu anında alır." } },
    { q: { de: "Behandeln Sie Angstpatienten?", en: "Do you treat anxious patients?", tr: "Korkan hastalara tedavi yapıyor musunuz?" },
      a: { de: "Ja, wir haben Erfahrung mit Angstpatienten und bieten ein ruhiges, einfühlsames Behandlungsumfeld.", en: "Yes, we have experience with anxious patients and offer a calm, empathetic environment.", tr: "Evet, korkan hastalarla deneyimimiz var ve sakin, anlayışlı bir ortam sunuyoruz." } },
    { q: { de: "Wie lange dauert eine Zahnaufhellung?", en: "How long does teeth whitening take?", tr: "Diş beyazlatma ne kadar sürer?" },
      a: { de: "Eine professionelle Zahnaufhellung dauert in der Regel 60–90 Minuten.", en: "Professional teeth whitening typically takes 60–90 minutes.", tr: "Profesyonel diş beyazlatma genellikle 60–90 dakika sürer." } },
    { q: { de: "Akzeptieren Sie Krankenkassen?", en: "Do you accept health insurance?", tr: "Sigorta kabul ediyor musunuz?" },
      a: { de: "Wir arbeiten mit den meisten gesetzlichen und privaten Krankenkassen zusammen.", en: "We work with most statutory and private health insurers.", tr: "Çoğu kamu ve özel sağlık sigortasıyla çalışıyoruz." } },
  ],
  medical: [
    { q: { de: "Kann ich eine Überweisung über WhatsApp anfordern?", en: "Can I request a referral via WhatsApp?", tr: "WhatsApp üzerinden sevk talep edebilir miyim?" },
      a: { de: "Ja, unser KI-Assistent koordiniert Überweisungen und bucht direkt Folgetermine.", en: "Yes, our AI assistant coordinates referrals and books follow-up appointments directly.", tr: "Evet, yapay zeka asistanımız sevkleri koordine eder ve takip randevularını doğrudan ayarlar." } },
    { q: { de: "Wie schnell erhalte ich einen Termin?", en: "How quickly can I get an appointment?", tr: "Ne kadar hızlı randevu alabilirim?" },
      a: { de: "Dringende Fälle werden bevorzugt behandelt. Schreiben Sie uns — wir antworten sofort.", en: "Urgent cases are prioritised. Message us on WhatsApp — we respond instantly.", tr: "Acil durumlar öncelikli olarak değerlendirilir. Yazın — anında yanıt veriyoruz." } },
    { q: { de: "Welche Sprachen sprechen Sie?", en: "Which languages do you speak?", tr: "Hangi dilleri konuşuyorsunuz?" },
      a: { de: "Unser Team und unser KI-Assistent kommunizieren auf Deutsch, Englisch und Türkisch.", en: "Our team and AI assistant communicate in German, English and Turkish.", tr: "Ekibimiz ve yapay zeka asistanımız Almanca, İngilizce ve Türkçe iletişim kurar." } },
    { q: { de: "Sind Hausbesuche möglich?", en: "Are home visits possible?", tr: "Ev ziyareti mümkün mü?" },
      a: { de: "In bestimmten Fällen bieten wir Hausbesuche an. Kontaktieren Sie uns für mehr Informationen.", en: "In certain cases we offer home visits. Contact us for more information.", tr: "Belirli durumlarda ev ziyareti sunuyoruz. Daha fazla bilgi için iletişime geçin." } },
    { q: { de: "Ist meine Anfrage vertraulich?", en: "Is my enquiry confidential?", tr: "Başvurum gizli mi?" },
      a: { de: "Ja, alle Anfragen werden streng vertraulich und DSGVO-konform behandelt.", en: "Yes, all enquiries are handled strictly confidentially and in compliance with GDPR.", tr: "Evet, tüm başvurular kesinlikle gizli ve GDPR uyumlu şekilde işlenir." } },
  ],
  wellness: [
    { q: { de: "Welche Wellnessprogramme bieten Sie an?", en: "What wellness programmes do you offer?", tr: "Hangi wellness programlarını sunuyorsunuz?" },
      a: { de: "Wir bieten Yoga, Meditation, Massage, Ernährungsberatung und individuelle Wellnesspakete an.", en: "We offer yoga, meditation, massage, nutrition counselling and individual wellness packages.", tr: "Yoga, meditasyon, masaj, beslenme danışmanlığı ve bireysel wellness paketleri sunuyoruz." } },
    { q: { de: "Wie buche ich einen Kurs?", en: "How do I book a class?", tr: "Nasıl ders alırım?" },
      a: { de: "Schreiben Sie uns auf WhatsApp — unser Assistent zeigt freie Plätze und bucht direkt.", en: "Message us on WhatsApp — our assistant shows availability and books directly.", tr: "Bize WhatsApp'tan yazın — asistanımız müsait yerleri gösterir ve doğrudan rezervasyon yapar." } },
    { q: { de: "Bieten Sie Einzelsitzungen oder Pakete an?", en: "Do you offer single sessions or packages?", tr: "Tek seans mı yoksa paket mi sunuyorsunuz?" },
      a: { de: "Wir bieten Einzelsitzungen sowie vergünstigte Monatspakete und Jahresabos an.", en: "We offer both single sessions and discounted monthly packages and annual subscriptions.", tr: "Hem tek seans hem de indirimli aylık paketler ve yıllık abonelikler sunuyoruz." } },
    { q: { de: "Kann ich mit einem Trainer sprechen, bevor ich buche?", en: "Can I speak to a trainer before booking?", tr: "Rezervasyon yapmadan önce bir eğitmenle konuşabilir miyim?" },
      a: { de: "Natürlich — unser WhatsApp-Bot verbindet Sie sofort mit einem unserer Berater.", en: "Of course — our WhatsApp bot connects you instantly with one of our advisors.", tr: "Tabii ki — WhatsApp botumuz sizi anında danışmanlarımızdan biriyle buluşturur." } },
    { q: { de: "Sind Ihre Kurse für Anfänger geeignet?", en: "Are your classes suitable for beginners?", tr: "Kurslarınız yeni başlayanlar için uygun mu?" },
      a: { de: "Ja, wir haben Kurse für alle Niveaus — von Einsteigern bis zu Fortgeschrittenen.", en: "Yes, we have classes for all levels — from beginners to advanced practitioners.", tr: "Evet, her seviye için kurslarımız var — başlangıçtan ileri seviyeye kadar." } },
  ],
  care: [
    { q: { de: "Welche Pflegeleistungen bieten Sie an?", en: "What care services do you offer?", tr: "Hangi bakım hizmetlerini sunuyorsunuz?" },
      a: { de: "Wir bieten ambulante Pflege, Betreuung zuhause, Demenzbegleitung und 24h-Pflege an.", en: "We offer outpatient care, home care, dementia support and 24h care.", tr: "Ayakta bakım, evde bakım, demans desteği ve 24 saat bakım sunuyoruz." } },
    { q: { de: "Wie schnell können Sie Pflege organisieren?", en: "How quickly can you organise care?", tr: "Bakımı ne kadar hızlı organize edebilirsiniz?" },
      a: { de: "In dringenden Fällen oft noch am selben Tag. Schreiben Sie uns auf WhatsApp.", en: "In urgent cases often the same day. Message us on WhatsApp and we will help immediately.", tr: "Acil durumlarda çoğu zaman aynı gün. WhatsApp'tan yazın, hemen yardım edelim." } },
    { q: { de: "Sprechen Ihre Pflegekräfte Türkisch?", en: "Do your carers speak Turkish?", tr: "Bakıcılarınız Türkçe konuşuyor mu?" },
      a: { de: "Ja, wir haben muttersprachliche türkischsprachige Pflegekräfte.", en: "Yes, we have Turkish-speaking native carers and communicate multilingually.", tr: "Evet, Türkçe konuşan anadil bakıcılarımız var ve çok dilli iletişim kuruyoruz." } },
    { q: { de: "Übernimmt die Pflegekasse die Kosten?", en: "Does long-term care insurance cover the costs?", tr: "Bakım sigortası maliyetleri karşılıyor mu?" },
      a: { de: "Viele unserer Leistungen werden von der Pflegekasse übernommen. Wir beraten Sie kostenlos.", en: "Many of our services are covered by long-term care insurance. We advise you free of charge.", tr: "Hizmetlerimizin büyük çoğunluğu bakım sigortası tarafından karşılanır. Ücretsiz danışmanlık sunuyoruz." } },
    { q: { de: "Wie funktioniert die Anmeldung?", en: "How does registration work?", tr: "Kayıt nasıl çalışır?" },
      a: { de: "Einfach auf WhatsApp schreiben — unser KI-Assistent führt Sie durch den gesamten Prozess.", en: "Simply message on WhatsApp — our AI assistant guides you through the entire process.", tr: "Sadece WhatsApp'tan yazın — yapay zeka asistanımız sizi tüm süreçte yönlendirir." } },
  ],
};

export function getFAQFallbacks(industry?: string | null): FAQItem[] {
  const key = industry ?? "";
  return (
    INDUSTRY_FAQ_FALLBACKS[key] ??
    INDUSTRY_FAQ_FALLBACKS[FAQ_KEY_FALLBACK[key] ?? ""] ??
    INDUSTRY_FAQ_FALLBACKS["aesthetics"]
  );
}

const CITY_POOLS: Record<ThemeLang, string[]> = {
  en: ["Dubai", "Abu Dhabi", "London", "Manchester", "Sydney", "Singapore", "Toronto", "New York", "Los Angeles", "Miami"],
  de: ["Berlin", "München", "Hamburg", "Frankfurt", "Köln", "Stuttgart", "Düsseldorf", "Leipzig", "Nürnberg", "Hannover"],
  tr: ["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Adana", "Gaziantep", "Konya", "Kayseri", "Mersin"],
};

function pickCities(primaryCity: string | null | undefined, lang: ThemeLang, count: number): string[] {
  const pool = CITY_POOLS[lang] ?? CITY_POOLS.de;
  const cities: string[] = [];
  if (primaryCity) cities.push(primaryCity);
  for (const c of pool) {
    if (cities.length >= count) break;
    if (c.toLowerCase() !== (primaryCity ?? "").toLowerCase()) cities.push(c);
  }
  while (cities.length < count) cities.push(pool[cities.length % pool.length]!);
  return cities;
}

export function getTestimonials(industry?: string | null, city?: string | null, lang?: ThemeLang): Testimonial[] {
  const key = industry ?? "";
  const raw = (
    INDUSTRY_TESTIMONIALS[key] ??
    INDUSTRY_TESTIMONIALS[TESTIMONIAL_KEY_FALLBACK[key] ?? ""] ??
    INDUSTRY_TESTIMONIALS["aesthetics"]
  )!;
  const resolvedLang: ThemeLang = lang ?? "de";
  const cities = pickCities(city, resolvedLang, raw.length);
  return raw.map((t, i) => ({ ...t, location: cities[i] ?? t.location }));
}

export type ThemeLang = "de" | "en" | "tr";

export function getLang(demoLanguage?: string | null): ThemeLang {
  const l = demoLanguage ?? "de";
  return (["de", "en", "tr"].includes(l) ? l : "de") as ThemeLang;
}
