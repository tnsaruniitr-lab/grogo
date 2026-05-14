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
