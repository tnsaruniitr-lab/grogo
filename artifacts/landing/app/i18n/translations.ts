export type Lang = "en" | "tr" | "ar";

export interface Translations {
  dir: "ltr" | "rtl";
  lang: Lang;
  nav: { features: string; howItWorks: string; industries: string; faq: string; bookDemo: string };
  hero: { words: string[]; headline1: string; headline2: string; sub: string; ctaPrimary: string; ctaSecondary: string };
  trust: { eyebrow: string; heading: string; stats: { value: string; label: string }[] };
  ps: {
    eyebrowProblem: string; eyebrowFix: string; heading: string; sub: string;
    oldTitle: string; oldSub: string; newTitle: string; newSub: string;
    problems: string[]; solutions: string[];
  };
  features: {
    eyebrow: string; heading: string; sub: string;
    list: { tag: string; title: string; bullets: string[] }[];
  };
  video: { eyebrow: string; heading: string; sub: string; slideTitle: string; slideDesc: string };
  how: { eyebrow: string; heading: string; sub: string; steps: { title: string; description: string; detail: string }[] };
  testimonials: { eyebrow: string; heading: string };
  industries: { eyebrow: string; heading: string; sub: string; list: { name: string; icon: string; desc: string }[] };
  faq: { eyebrow: string; heading: string; sub: string; items: { q: string; a: string }[] };
  cta: { eyebrow: string; heading: string; sub: string; button: string; badges: string[] };
  footer: { features: string; howItWorks: string; industries: string; faq: string; contact: string };
}

const en: Translations = {
  dir: "ltr", lang: "en",
  nav: { features: "Features", howItWorks: "How It Works", industries: "Industries", faq: "FAQ", bookDemo: "Book a Demo →" },
  hero: {
    words: ["Healthcare", "Clinics", "Medspas", "Wellness Centres"],
    headline1: "The AI Growth Engine",
    headline2: "for",
    sub: "Get discovered in AI search, capture every WhatsApp, website and social media lead, qualify leads automatically, and turn more enquiries into booked consultations.",
    ctaPrimary: "Book a Free Demo",
    ctaSecondary: "See How It Works",
  },
  trust: {
    eyebrow: "What GrowthMonk delivers",
    heading: "Results healthcare businesses can measure",
    stats: [
      { value: "2-4×",   label: "More AI search appearances (based on early client results)" },
      { value: "3×",     label: "More leads captured across all channels" },
      { value: "80%",    label: "Of routine enquiries handled automatically" },
      { value: "15–20%", label: "Increase in consultation bookings reported by clients" },
    ],
  },
  ps: {
    eyebrowProblem: "The Problem", eyebrowFix: "The Fix",
    heading: "Stop losing customers to businesses that move faster",
    sub: "Healthcare businesses that rely on manual processes are losing customers to AI-enabled competitors. GrowthMonk closes that gap.",
    oldTitle: "✗  The Old Way", oldSub: "Slow, manual, leaky funnel",
    newTitle: "✓  The GrowthMonk Way", newSub: "Automated, instant, always-on",
    problems: [
      "Invisible in AI search (ChatGPT, Perplexity, AI Overviews)",
      "Leads from WhatsApp & Instagram go unanswered for hours",
      "Staff spend hours qualifying the same basic enquiries",
      "Language barriers losing you multilingual customers",
      "Leads captured but never followed up on consistently",
    ],
    solutions: [
      "Optimised for AI search engines - customers find you first",
      "AI responds to every message in under 2 minutes, 24/7",
      "AI qualifies, filters, and routes leads automatically",
      "Conversations in English, Turkish, Arabic and more",
      "AI books appointments and callbacks without human input",
    ],
  },
  features: {
    eyebrow: "Platform Features",
    heading: "Everything you need to grow faster",
    sub: "GrowthMonk combines AI search visibility, lead capture, qualification, and booking into one connected platform built for healthcare.",
    list: [
      {
        tag: "AI Search Discovery",
        title: "Get found before your competitors - in AI search",
        bullets: [
          "Generate a fully AEO, SEO & GEO-optimised website in hours - or audit yours to close the gap",
          "Analyse what top competitors are doing to rank in ChatGPT, Perplexity and Google AI Overviews",
          "Identify authority sources and let our agent earn you citations automatically",
          "Humanised blog content that AI engines can cite, quote and extract - built on official frameworks from Google, Perplexity and Schema.org",
        ],
      },
      {
        tag: "WhatsApp & Social Capture",
        title: "Capture every lead the moment they message",
        bullets: [
          "AI responds to every WhatsApp, Instagram DM and Facebook message in under 90 seconds - 24/7",
          "No enquiry falls through the cracks - every channel captured in one connected inbox",
          "Handles high volume without adding headcount - scales instantly at zero marginal cost",
          "Smart handoff to your team when a human touch is needed",
        ],
      },
      {
        tag: "Custom-Trained AI Bot",
        title: "Built for healthcare - not a generic chatbot",
        bullets: [
          "Trained on your services, FAQs, intake flows, pricing, availability, tone of voice, and escalation rules — not generic protocols",
          "Teach it your exact services, FAQs, pricing, and intake questions through WhatsApp - no technical skills needed",
          "Handles enquiries with a careful, professional tone and escalates sensitive or clinical questions to your team immediately",
          "Continuously improves as you add knowledge - every update reflects instantly across all customer conversations",
          "Responds in the customer's own language throughout the full conversation - English, Turkish, Arabic and more",
        ],
      },
      {
        tag: "Automated Qualification",
        title: "Your team only talks to serious prospects",
        bullets: [
          "AI asks approved intake and qualification questions based on your business rules",
          "Scores commercial readiness and routes enquiries to the right person based on your rules",
          "Routes warm enquiries straight to your team and filters out low-intent contacts",
          "Staff only handle ready-to-book prospects - focus on converting, not filtering",
        ],
      },
      {
        tag: "Instant Booking",
        title: "Your calendar fills while you deliver care",
        bullets: [
          "Converts qualified leads into booked consultations automatically - no back-and-forth",
          "Schedules callbacks for customers who need more time before committing",
          "Syncs with your calendar in real time - zero double-booking, zero manual entry",
          "Works around the clock so you wake up to a full diary every morning",
        ],
      },
      {
        tag: "Live Analytics Dashboard",
        title: "Complete visibility - zero manual tracking",
        bullets: [
          "Track every lead, conversation and conversion in real time - all in one place",
          "See source, language, AI-detected intent and status at a glance",
          "Nothing is logged manually - every data point is captured automatically",
          "Spot drop-off points and optimise your funnel with live, actionable data",
        ],
      },
    ],
  },
  video: {
    eyebrow: "See It In Action",
    heading: "Watch GrowthMonk work",
    sub: "A live walkthrough of how GrowthMonk captures leads, qualifies them in seconds, and books appointments automatically.",
    slideTitle: "GrowthMonk in Action",
    slideDesc: "See how the AI bot captures, qualifies, and books leads automatically — start to finish.",
  },
  how: {
    eyebrow: "How It Works",
    heading: "Up and running in 24 hours",
    sub: "Four steps from sign-up to a fully automated, AI-visible lead pipeline for your healthcare business.",
    steps: [
      { title: "Audit your AI search presence and outpace competitors", description: "We scan how your practice appears across ChatGPT, Perplexity, and Google AI Overviews - then benchmark it against your top competitors. You get a clear picture of the gap, quick wins to close it fast, and a strategic roadmap to rank above competitors in AI search.", detail: "AI search audit · Competitor analysis · Strategic roadmap" },
      { title: "Connect your channels", description: "Link your WhatsApp Business number, Instagram, and other social media channels to GrowthMonk in minutes. No technical skills needed - we handle the integration.", detail: "WhatsApp · Instagram · Facebook · Website chat" },
      { title: "AI captures and qualifies every lead", description: "The moment a prospective customer sends a message, our AI responds instantly - in their language. It asks the right questions, understands their need, and qualifies their intent automatically.", detail: "24/7 response · Multilingual · Zero staff time" },
      { title: "You receive booked appointments", description: "Qualified customers are booked into your calendar or scheduled for a callback automatically. You open your dashboard to a list of warm, qualified leads ready to convert.", detail: "Auto-booking · Callback scheduling · Live dashboard" },
    ],
  },
  testimonials: { eyebrow: "Customer Stories", heading: "Trusted by healthcare businesses" },
  industries: {
    eyebrow: "Industries",
    heading: "Built for every healthcare vertical",
    sub: "Whether you run a boutique medspa or a multi-location clinic, GrowthMonk adapts to your specialty and customer demographics.",
    list: [
      { name: "Medical Clinics",        icon: "🏥", desc: "GP practices, specialist clinics, and private hospitals" },
      { name: "Dental Practices",       icon: "🦷", desc: "General dentistry, orthodontics, and implant centres" },
      { name: "MedSpas & Aesthetics",   icon: "✨", desc: "Aesthetic clinics, laser centres, and skin practices" },
      { name: "Physiotherapy",          icon: "🤸", desc: "Physio, sports rehab, and movement clinics" },
      { name: "Mental Health",          icon: "🧠", desc: "Therapy, counselling, and psychiatry practices" },
      { name: "Care Services",          icon: "❤️", desc: "Home nursing, elderly care, and care agencies" },
      { name: "Nutrition & Wellness",   icon: "🥗", desc: "Nutritionists, dietitians, and wellness coaches" },
      { name: "Fertility & IVF",        icon: "👶", desc: "Fertility clinics and reproductive health centres" },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    heading: "Common questions",
    sub: "Everything you need to know about GrowthMonk and AI-powered growth for healthcare.",
    items: [
      { q: "What is GrowthMonk?", a: "GrowthMonk is a business communication and lead management platform for healthcare, wellness, medspa, and service businesses. It helps businesses capture inbound enquiries from WhatsApp, Instagram, Facebook and websites, qualify them using business-approved questions, route them to staff, and support appointment booking. GrowthMonk does not provide medical advice, diagnosis, treatment recommendations, prescriptions, emergency support, or clinical decision-making." },
      { q: "How does GrowthMonk capture leads from WhatsApp?", a: "GrowthMonk connects to your WhatsApp Business number via the official Meta WhatsApp Business API. When a customer messages you, the AI bot responds instantly, captures their details, qualifies their needs, and either books an appointment or schedules a callback — automatically, 24 hours a day." },
      { q: "Does GrowthMonk support multiple languages?", a: "Yes. GrowthMonk detects the customer's language automatically and continues in that language for the entire conversation. Currently supported: English, Turkish, and Arabic, with more languages being added." },
      { q: "What is Answer Engine Optimization (AEO) for healthcare?", a: "AEO is the practice of structuring your content so AI search engines (ChatGPT, Perplexity, Google AI Overviews) cite your practice when customers ask health questions. GrowthMonk builds your AEO foundation — structured data, semantic content, and Q&A pages — so you appear in AI answers before your competitors." },
      { q: "How long does setup take?", a: "Most healthcare businesses are fully set up and live within 24 hours of onboarding. Our team handles the channel integrations, AI configuration, and knowledge base setup. You just review and approve." },
      { q: "Is customer data safe and GDPR-compliant?", a: "Yes. GrowthMonk is built with data privacy by design. All customer conversations are encrypted, data is processed within compliant infrastructure, and you retain full control over what is stored and for how long." },
    ],
  },
  cta: {
    eyebrow: "Start growing today",
    heading: "Ready to grow your practice with AI?",
    sub: "Book a free 30-minute demo. We'll show you exactly how GrowthMonk would work for your practice - live, no slides, no sales pitch.",
    button: "Book Your Free Demo",
    badges: ["No credit card", "24-hour setup", "Cancel anytime", "GDPR compliant"],
  },
  footer: { features: "Features", howItWorks: "How It Works", industries: "Industries", faq: "FAQ", contact: "Contact" },
};

const tr: Translations = {
  dir: "ltr", lang: "tr",
  nav: { features: "Özellikler", howItWorks: "Nasıl Çalışır", industries: "Sektörler", faq: "SSS", bookDemo: "Demo Al →" },
  hero: {
    words: ["Sağlık İşletmeleri", "Klinikler", "Medspalar", "Wellness Merkezleri"],
    headline1: "Yapay Zeka Büyüme Motoru",
    headline2: "için",
    sub: "Yapay zeka aramalarında öne çıkın, WhatsApp, web sitesi ve sosyal medya leadlerini yakalayın, otomatik olarak nitelendirin ve daha fazla talepten randevu oluşturun.",
    ctaPrimary: "Ücretsiz Demo Al",
    ctaSecondary: "Nasıl Çalışır",
  },
  trust: {
    eyebrow: "GrowthMonk'un sunduğu",
    heading: "Sağlık işletmeleri için ölçülebilir sonuçlar",
    stats: [
      { value: "2-4×",   label: "İşletmeniz için daha fazla yapay zeka arama görünümü" },
      { value: "3×",     label: "Daha fazla keşfedilen ve yakalanan lead" },
      { value: "80%",    label: "Leadler yapay zeka tarafından otomatik nitelendiriliyor" },
      { value: "15–20%", label: "Kliniğiniz için daha fazla randevu" },
    ],
  },
  ps: {
    eyebrowProblem: "Sorun", eyebrowFix: "Çözüm",
    heading: "Daha hızlı hareket eden rakiplere müşteri kaybetmeyi bırakın",
    sub: "Manuel süreçlere dayanan sağlık işletmeleri, yapay zeka destekli rakiplerine müşteri kaptırıyor. GrowthMonk bu açığı kapatır.",
    oldTitle: "✗  Eski Yöntem", oldSub: "Yavaş, manuel, sızdıran süreç",
    newTitle: "✓  GrowthMonk Yöntemi", newSub: "Otomatik, anlık, her zaman çalışır",
    problems: [
      "Yapay zeka aramalarında görünmez (ChatGPT, Perplexity, AI Overviews)",
      "WhatsApp ve Instagram'dan gelen leadler saatlerce yanıtsız kalıyor",
      "Personel, aynı temel soruları nitelendirmek için saatler harcıyor",
      "Dil engelleri çok dilli müşterilere mal oluyor",
      "Leadler yakalanıyor ama tutarlı biçimde takip edilmiyor",
    ],
    solutions: [
      "Yapay zeka arama motorları için optimize edilmiş – müşteriler sizi ilk bulur",
      "Yapay zeka her mesaja 2 dakika içinde yanıt verir, 7/24",
      "Yapay zeka leadleri otomatik olarak niteler, filtreler ve yönlendirir",
      "Türkçe, İngilizce, Arapça ve daha fazlasında konuşmalar",
      "Yapay zeka insan müdahalesi olmadan randevu ve geri arama oluşturur",
    ],
  },
  features: {
    eyebrow: "Platform Özellikleri",
    heading: "Daha hızlı büyümeniz için ihtiyacınız olan her şey",
    sub: "GrowthMonk, yapay zeka arama görünürlüğünü, lead yakalamayı, nitelendirmeyi ve rezervasyonu sağlık sektörü için tek bir bağlı platformda birleştirir.",
    list: [
      {
        tag: "Yapay Zeka Arama Keşfi",
        title: "Rakiplerinizden önce bulunun – yapay zeka aramalarında",
        bullets: [
          "Saatler içinde tam AEO, SEO ve GEO optimize edilmiş bir web sitesi oluşturun veya mevcutunuzu denetleyin",
          "ChatGPT, Perplexity ve Google AI Overviews'ta üst sıralarda yer almak için rakiplerinizin ne yaptığını analiz edin",
          "Otorite kaynaklarını tespit edin ve temsilcimizin sizin için atıflar kazanmasına izin verin",
          "KI arama motorlarının alıntılayabileceği, insan dokunuşlu blog içerikleri – Google, Perplexity ve Schema.org'un resmi çerçevelerine dayalı",
        ],
      },
      {
        tag: "WhatsApp ve Sosyal Medya Yakalama",
        title: "Her leadi mesaj attığı anda yakalayın",
        bullets: [
          "Yapay zeka her WhatsApp, Instagram DM ve Facebook mesajına 90 saniye içinde yanıt verir – 7/24",
          "Hiçbir talep gözden kaçmaz – tüm kanallar tek bağlı gelen kutusunda",
          "Ekip büyütmeden yüksek hacimli sorguları yönetir – anında ölçeklenir",
          "İnsan dokunuşu gerektiğinde ekibinize akıllı devir",
        ],
      },
      {
        tag: "Özel Eğitimli Yapay Zeka Botu",
        title: "Sağlık sektörü için üretildi – genel bir chatbot değil",
        bullets: [
          "Hizmetlerinize, SSS'lerinize, fiyatlarınıza, müsaitlik durumuna ve eskalasyon kurallarınıza göre eğitildi — genel protokollere değil",
          "Hizmetlerinizi, SSS'lerinizi ve fiyatlarınızı WhatsApp üzerinden öğretin – teknik bilgi gerekmez",
          "Hassas müşteri taleplerini gereken özenle karşılar, gerektiğinde ekibinize aktarır",
          "Bilginiz arttıkça sürekli gelişir – her güncelleme anında yansır",
          "Müşterinin kendi dilinde yanıt verir – Türkçe, İngilizce, Arapça ve daha fazlası",
        ],
      },
      {
        tag: "Otomatik Nitelendirme",
        title: "Ekibiniz yalnızca ciddi adaylarla görüşür",
        bullets: [
          "Yapay zeka her müşterinin ihtiyacını ve niyetini anlamak için doğru soruları sorar",
          "Her leadi otomatik olarak puanlar ve niteler – manuel inceleme gerekmez",
          "Sıcak leadleri doğrudan ekibinize yönlendirir, zaman kayıplarını filtreler",
          "Personel yalnızca rezervasyona hazır adaylarla ilgilenir – dönüşüme odaklanın",
        ],
      },
      {
        tag: "Anında Rezervasyon",
        title: "Siz bakım sunarken takviminiz dolar",
        bullets: [
          "Nitelendirilen leadleri otomatik olarak randevuya dönüştürür – gidip gelmeden",
          "Daha fazla zamana ihtiyaç duyan müşteriler için geri arama planlar",
          "Takviminizle gerçek zamanlı senkronize olur – çift rezervasyon, manuel giriş yok",
          "Gece gündüz çalışır – sabah dolu bir takvimiyle uyanırsınız",
        ],
      },
      {
        tag: "Canlı Analitik Paneli",
        title: "Tam görünürlük – manuel takip yok",
        bullets: [
          "Her leadi, konuşmayı ve dönüşümü gerçek zamanlı olarak takip edin – tek bir yerde",
          "Kaynak, dil, yapay zeka tarafından algılanan niyet ve durumu bir bakışta görün",
          "Hiçbir şey manuel olarak kaydedilmez – her veri noktası otomatik olarak yakalanır",
          "Dönüşüm noktalarını tespit edin ve canlı verilerle satış hunisini optimize edin",
        ],
      },
    ],
  },
  video: {
    eyebrow: "Aksiyonda Görün",
    heading: "GrowthMonk'u çalışırken izleyin",
    sub: "GrowthMonk'un leadleri nasıl yakaladığını, saniyeler içinde nitelendirdiğini ve otomatik olarak randevu oluşturduğunu gösteren canlı bir inceleme.",
    slideTitle: "GrowthMonk Aksiyonda",
    slideDesc: "Yapay zeka botunun leadleri baştan sona nasıl yakaladığını, nitelendirdiğini ve otomatik randevuya dönüştürdüğünü görün.",
  },
  how: {
    eyebrow: "Nasıl Çalışır",
    heading: "24 saatte çalışır hale gelir",
    sub: "Kayıttan tamamen otomatik, yapay zeka görünürlüklü bir lead sürecine kadar dört adım.",
    steps: [
      { title: "Yapay zeka arama varlığınızı denetleyin ve rakipleri geride bırakın", description: "Pratiğinizin ChatGPT, Perplexity ve Google AI Overviews'ta nasıl göründüğünü tarar ve en iyi rakiplerinizle karşılaştırırız. Açığın net bir resmini ve stratejik bir yol haritasını elde edersiniz.", detail: "Yapay zeka araması denetimi · Rakip analizi · Stratejik yol haritası" },
      { title: "Kanallarınızı bağlayın", description: "WhatsApp Business numaranızı, Instagram'ı ve diğer sosyal medya kanallarınızı dakikalar içinde GrowthMonk'a bağlayın. Teknik bilgi gerekmez – entegrasyonu biz hallederiz.", detail: "WhatsApp · Instagram · Facebook · Web sitesi sohbeti" },
      { title: "Yapay zeka her leadi yakalar ve niteler", description: "Potansiyel bir müşteri mesaj attığı anda yapay zekamız anında yanıt verir – kendi dilinde. Doğru soruları sorar ve ihtiyacını otomatik olarak niteler.", detail: "7/24 yanıt · Çok dilli · Sıfır personel zamanı" },
      { title: "Randevularınızı alın", description: "Nitelendirilen müşteriler otomatik olarak takviminize eklenir veya geri arama için planlanır. Panonuzu açtığınızda dönüşüme hazır ılık leadlerin listesini görürsünüz.", detail: "Otomatik rezervasyon · Geri arama planlaması · Canlı panel" },
    ],
  },
  testimonials: { eyebrow: "Müşteri Hikayeleri", heading: "Sağlık işletmeleri tarafından güvenilir" },
  industries: {
    eyebrow: "Sektörler",
    heading: "Her sağlık sektörü için üretildi",
    sub: "Butik bir medspa veya çok şubeli bir klinik yönetiyor olun, GrowthMonk uzmanlığınıza ve müşteri demografinize uyum sağlar.",
    list: [
      { name: "Tıp Klinikleri",       icon: "🏥", desc: "Aile hekimliği, uzmanlık klinikleri ve özel hastaneler" },
      { name: "Diş Klinikleri",       icon: "🦷", desc: "Genel diş hekimliği, ortodonti ve implant merkezleri" },
      { name: "Medspalar & Estetik",  icon: "✨", desc: "Estetik klinikler, lazer merkezleri ve cilt uygulamaları" },
      { name: "Fizyoterapi",          icon: "🤸", desc: "Fizyo, spor rehabilitasyonu ve hareket klinikleri" },
      { name: "Ruh Sağlığı",          icon: "🧠", desc: "Terapi, psikolojik danışmanlık ve psikiyatri" },
      { name: "Bakım Hizmetleri",     icon: "❤️", desc: "Evde bakım, yaşlı bakımı ve bakım ajansları" },
      { name: "Beslenme & Wellness",  icon: "🥗", desc: "Diyetisyenler, beslenme uzmanları ve wellness koçları" },
      { name: "Üreme Sağlığı & IVF", icon: "👶", desc: "Fertilite klinikleri ve üreme sağlığı merkezleri" },
    ],
  },
  faq: {
    eyebrow: "SSS",
    heading: "Sık Sorulan Sorular",
    sub: "GrowthMonk ve sağlık sektörü için yapay zeka destekli büyüme hakkında bilmeniz gereken her şey.",
    items: [
      { q: "GrowthMonk nedir?", a: "GrowthMonk, sağlık ve wellness işletmeleri için bir yapay zeka büyüme motorudur. Kliniklerin, medispaların, diş kliniklerinin ve bakım sağlayıcıların ChatGPT ve Perplexity gibi yapay zeka arama motorlarında keşfedilmesine, WhatsApp ve sosyal medyadan lead elde etmesine ve otomatik olarak randevuya dönüştürmesine yardımcı olur." },
      { q: "GrowthMonk WhatsApp'tan nasıl lead yakalar?", a: "GrowthMonk, resmi Meta WhatsApp Business API aracılığıyla WhatsApp Business numaranıza bağlanır. Bir müşteri mesaj attığında yapay zeka botu anında yanıt verir, bilgileri alır, ihtiyacını niteler ve otomatik olarak randevu oluşturur ya da geri arama planlar – günün 24 saati." },
      { q: "GrowthMonk birden fazla dili destekliyor mu?", a: "Evet. GrowthMonk müşterinin dilini otomatik olarak algılar ve tüm konuşmayı o dilde sürdürür. Şu anda desteklenen diller: Türkçe, İngilizce ve Arapça; daha fazlası ekleniyor." },
      { q: "Sağlık sektöründe Answer Engine Optimization (AEO) nedir?", a: "AEO, içeriklerinizi yapay zeka arama motorlarının (ChatGPT, Perplexity, Google AI Overviews) müşteriler sağlık soruları sorduğunda pratiğinizi alıntılaması için yapılandırma pratiğidir. GrowthMonk yapılandırılmış veri, semantik içerik ve SSS sayfaları ile AEO temelini oluşturur." },
      { q: "Kurulum ne kadar sürer?", a: "Çoğu sağlık işletmesi, kurulum sürecinden sonra 24 saat içinde tam olarak kurulur ve yayına girer. Ekibimiz kanal entegrasyonlarını, yapay zeka yapılandırmasını ve bilgi tabanı kurulumunu üstlenir. Siz yalnızca inceleyip onaylarsınız." },
      { q: "Müşteri verileri güvenli ve GDPR uyumlu mu?", a: "Evet. GrowthMonk, veri gizliliği gözetilerek sıfırdan oluşturulmuştur. Tüm müşteri görüşmeleri şifrelenir, veriler uyumlu altyapıda işlenir ve nelerin ne kadar süre saklandığı konusunda tam kontrole sahipsiniz." },
    ],
  },
  cta: {
    eyebrow: "Bugün büyümeye başlayın",
    heading: "Pratiğinizi yapay zekayla büyütmeye hazır mısınız?",
    sub: "Ücretsiz 30 dakikalık demo rezervasyonu yapın. GrowthMonk'un pratiğiniz için nasıl çalışacağını tam olarak göstereceğiz – canlı, slayt yok, satış konuşması yok.",
    button: "Ücretsiz Demonuzu Alın",
    badges: ["Kredi kartı yok", "24 saatlik kurulum", "İstediğinizde iptal", "GDPR uyumlu"],
  },
  footer: { features: "Özellikler", howItWorks: "Nasıl Çalışır", industries: "Sektörler", faq: "SSS", contact: "İletişim" },
};

const ar: Translations = {
  dir: "rtl", lang: "ar",
  nav: { features: "المميزات", howItWorks: "كيف يعمل", industries: "القطاعات", faq: "الأسئلة الشائعة", bookDemo: "← احجز عرضًا" },
  hero: {
    words: ["الرعاية الصحية", "العيادات", "مراكز التجميل", "مراكز العافية"],
    headline1: "محرك النمو بالذكاء الاصطناعي",
    headline2: "لـ",
    sub: "اكتشف عملك في محركات البحث المدعومة بالذكاء الاصطناعي، التقط كل عميل من واتساب والموقع الإلكتروني ووسائل التواصل الاجتماعي، أهّل العملاء تلقائيًا، وحوّل الاستفسارات إلى مواعيد مؤكدة.",
    ctaPrimary: "احجز عرضًا تجريبيًا مجانيًا",
    ctaSecondary: "شاهد كيف يعمل",
  },
  trust: {
    eyebrow: "ما تقدمه GrowthMonk",
    heading: "نتائج قابلة للقياس للمنشآت الصحية",
    stats: [
      { value: "2-4×",   label: "المزيد من الظهور في نتائج البحث الذكي لعملك" },
      { value: "3×",     label: "المزيد من العملاء المكتشفين والمستقطبين" },
      { value: "80%",    label: "من العملاء يُؤهَّلون تلقائيًا بالذكاء الاصطناعي" },
      { value: "15–20%", label: "المزيد من المواعيد المحجوزة لعيادتك" },
    ],
  },
  ps: {
    eyebrowProblem: "المشكلة", eyebrowFix: "الحل",
    heading: "توقف عن خسارة العملاء لصالح المنافسين الأسرع",
    sub: "المنشآت الصحية التي تعتمد على العمليات اليدوية تخسر عملاءها لصالح المنافسين المدعومين بالذكاء الاصطناعي. GrowthMonk يسد هذه الفجوة.",
    oldTitle: "✗  الطريقة القديمة", oldSub: "بطيء، يدوي، مسار مبيعات هش",
    newTitle: "✓  طريقة GrowthMonk", newSub: "آلي، فوري، دائم التشغيل",
    problems: [
      "غائب في نتائج البحث الذكي (ChatGPT، Perplexity، AI Overviews)",
      "رسائل واتساب وإنستغرام تبقى دون رد لساعات",
      "الموظفون يقضون ساعات في تأهيل نفس الاستفسارات",
      "حواجز اللغة تكلّفك عملاء من خلفيات متعددة",
      "العملاء يُسجَّلون دون متابعة منتظمة",
    ],
    solutions: [
      "محسّن لمحركات البحث الذكي – العملاء يجدونك أولًا",
      "الذكاء الاصطناعي يرد على كل رسالة خلال دقيقتين، 24/7",
      "الذكاء الاصطناعي يؤهل ويصفي ويوجه العملاء تلقائيًا",
      "محادثات بالعربية والإنجليزية والتركية والمزيد",
      "الذكاء الاصطناعي يحجز المواعيد دون تدخل بشري",
    ],
  },
  features: {
    eyebrow: "ميزات المنصة",
    heading: "كل ما تحتاجه للنمو بشكل أسرع",
    sub: "يجمع GrowthMonk ظهور البحث الذكي والتقاط العملاء والتأهيل والحجز في منصة واحدة متكاملة مصممة للرعاية الصحية.",
    list: [
      {
        tag: "اكتشاف البحث الذكي",
        title: "كن الأول في نتائج البحث الذكي قبل منافسيك",
        bullets: [
          "أنشئ موقعًا محسّنًا بالكامل لـ AEO وSEO وGEO في ساعات، أو افحص موقعك الحالي",
          "حلل ما يفعله المنافسون الأوائل للظهور في ChatGPT وPerplexity ونتائج Google الذكية",
          "حدد مصادر الثقة ودع وكيلنا يكسب لك استشهادات تلقائيًا",
          "محتوى مدوّنة إنساني تستطيع محركات البحث الذكية الاستشهاد به – مبني على أطر Google وPerplexity وSchema.org",
        ],
      },
      {
        tag: "الاستحواذ عبر واتساب والتواصل الاجتماعي",
        title: "التقط كل عميل لحظة تواصله",
        bullets: [
          "الذكاء الاصطناعي يرد على كل رسالة واتساب ودايركت إنستغرام وفيسبوك خلال 90 ثانية، 24/7",
          "لا يضيع أي استفسار – كل القنوات في صندوق وارد موحد",
          "يعالج الحجم الكبير دون توظيف إضافي – يتوسع فوريًا بتكلفة صفرية",
          "تسليم ذكي لفريقك عند الحاجة إلى اللمسة البشرية",
        ],
      },
      {
        tag: "بوت ذكاء اصطناعي مدرَّب خصيصًا",
        title: "مصمم للرعاية الصحية، ليس روبوتًا اعتياديًا",
        bullets: [
          "مدرَّب على خدماتك وأسئلتك الشائعة وأسعارك ومواعيد توافرك وقواعد التصعيد — لا على بروتوكولات عامة",
          "علّمه خدماتك وأسعارك وأسئلتك عبر واتساب دون أي خبرة تقنية",
          "يتعامل مع الاستفسارات الحساسة بالرعاية اللازمة ويحيلها للفريق عند الحاجة",
          "يتحسن باستمرار مع كل معلومة تضيفها – كل تحديث ينعكس فورًا",
          "يرد بلغة العميل – العربية والإنجليزية والتركية والمزيد",
        ],
      },
      {
        tag: "التأهيل التلقائي",
        title: "فريقك يتحدث فقط مع العملاء الجادين",
        bullets: [
          "الذكاء الاصطناعي يطرح الأسئلة الصحيحة لفهم احتياجات كل عميل ونواياه",
          "يسجّل ويؤهّل كل عميل تلقائيًا – دون مراجعة يدوية",
          "يوجّه العملاء الساخنين مباشرة لفريقك ويصفي غير الجادين",
          "موظفوك يركزون فقط على من هم جاهزون للحجز",
        ],
      },
      {
        tag: "الحجز الفوري",
        title: "يمتلئ تقويمك بالمواعيد وأنت تركز على عملائك",
        bullets: [
          "يحوّل العملاء المؤهلين تلقائيًا إلى مواعيد محجوزة دون أي جهد",
          "يجدول مكالمات استرداد للعملاء الذين يحتاجون مزيدًا من الوقت",
          "يتزامن مع تقويمك في الوقت الفعلي – لا ازدواجية، لا إدخال يدوي",
          "يعمل على مدار الساعة – تستيقظ على تقويم ممتلئ",
        ],
      },
      {
        tag: "لوحة تحليلات مباشرة",
        title: "رؤية كاملة دون تتبع يدوي",
        bullets: [
          "تابع كل عميل ومحادثة وتحويل في الوقت الفعلي – كل شيء في مكان واحد",
          "شاهد المصدر واللغة والنية التي رصدها الذكاء الاصطناعي والحالة بلمحة واحدة",
          "لا شيء يُسجَّل يدويًا – كل نقطة بيانات تُرصَد تلقائيًا",
          "حدد نقاط التسرب وحسّن مسار المبيعات ببيانات حية قابلة للتنفيذ",
        ],
      },
    ],
  },
  video: {
    eyebrow: "شاهده يعمل",
    heading: "شاهد GrowthMonk يعمل",
    sub: "جولة مباشرة توضح كيف يلتقط GrowthMonk العملاء ويؤهّلهم في ثوانٍ ويحجز المواعيد تلقائيًا.",
    slideTitle: "GrowthMonk في العمل",
    slideDesc: "شاهد كيف يلتقط البوت العملاء ويؤهّلهم ويحجز المواعيد تلقائيًا من البداية إلى النهاية.",
  },
  how: {
    eyebrow: "كيف يعمل",
    heading: "جاهز للعمل في 24 ساعة",
    sub: "أربع خطوات من التسجيل إلى خط سير عملاء آلي بالكامل ومرئي في الذكاء الاصطناعي.",
    steps: [
      { title: "افحص حضورك في البحث الذكي وتفوّق على منافسيك", description: "نفحص كيف تظهر عيادتك في ChatGPT وPerplexity ونتائج Google الذكية، ونقارنها بأبرز منافسيك. ستحصل على صورة واضحة للفجوة وخارطة طريق استراتيجية للتفوق.", detail: "فحص بحث ذكي · تحليل المنافسين · خارطة طريق استراتيجية" },
      { title: "ربط قنواتك", description: "اربط رقم WhatsApp Business وInstagram وبقية قنوات التواصل الاجتماعي بـ GrowthMonk في دقائق. لا خبرة تقنية مطلوبة – نحن نتولى التكامل.", detail: "واتساب · إنستغرام · فيسبوك · دردشة الموقع" },
      { title: "الذكاء الاصطناعي يلتقط ويؤهّل كل عميل", description: "فور إرسال عميل محتمل رسالة، يرد ذكاؤنا الاصطناعي فورًا – بلغته. يطرح الأسئلة الصحيحة ويؤهّل النية تلقائيًا.", detail: "رد 24/7 · متعدد اللغات · صفر وقت موظفين" },
      { title: "تستقبل مواعيد محجوزة", description: "يُدرج العملاء المؤهلون تلقائيًا في تقويمك أو يُجدوَل لهم موعد استرداد. افتح لوحتك لتجد قائمة بعملاء دافئين جاهزين للتحويل.", detail: "حجز تلقائي · جدولة المكالمات · لوحة مباشرة" },
    ],
  },
  testimonials: { eyebrow: "قصص العملاء", heading: "موثوق به من منشآت الرعاية الصحية" },
  industries: {
    eyebrow: "القطاعات",
    heading: "مصمم لكل تخصص في الرعاية الصحية",
    sub: "سواء أدرت مركز تجميل صغيرًا أو عيادة متعددة المواقع، يتكيف GrowthMonk مع تخصصك وشريحة عملائك.",
    list: [
      { name: "العيادات الطبية",        icon: "🏥", desc: "عيادات عامة وتخصصية ومستشفيات خاصة" },
      { name: "عيادات الأسنان",         icon: "🦷", desc: "طب الأسنان العام والتقويم وزراعة الأسنان" },
      { name: "مراكز التجميل والجماليات", icon: "✨", desc: "عيادات تجميل ومراكز ليزر وعناية بالبشرة" },
      { name: "العلاج الطبيعي",         icon: "🤸", desc: "علاج طبيعي وإعادة تأهيل رياضي وعيادات حركة" },
      { name: "الصحة النفسية",          icon: "🧠", desc: "علاج نفسي وإرشاد وطب نفسي" },
      { name: "خدمات الرعاية",          icon: "❤️", desc: "تمريض منزلي ورعاية كبار السن ووكالات الرعاية" },
      { name: "التغذية والعافية",        icon: "🥗", desc: "أخصائيو تغذية وكوتشي عافية ومراكز صحية" },
      { name: "الخصوبة وأطفال الأنابيب", icon: "👶", desc: "عيادات الخصوبة ومراكز الصحة الإنجابية" },
    ],
  },
  faq: {
    eyebrow: "الأسئلة الشائعة",
    heading: "الأسئلة الشائعة",
    sub: "كل ما تحتاج معرفته عن GrowthMonk والنمو المدعوم بالذكاء الاصطناعي في قطاع الرعاية الصحية.",
    items: [
      { q: "ما هو GrowthMonk؟", a: "GrowthMonk هو محرك نمو مدعوم بالذكاء الاصطناعي للمنشآت الصحية ومراكز العافية. يساعد العيادات ومراكز التجميل وعيادات الأسنان ومزودي الرعاية على الظهور في محركات البحث الذكية كـ ChatGPT وPerplexity، والتقاط عملاء محتملين من واتساب ووسائل التواصل، وتحويلهم تلقائيًا إلى مواعيد محجوزة." },
      { q: "كيف يلتقط GrowthMonk العملاء من واتساب؟", a: "يتصل GrowthMonk برقم WhatsApp Business الخاص بك عبر واجهة برمجة تطبيقات واتساب الرسمية من Meta. عند إرسال عميل رسالة، يرد البوت فورًا، يسجّل بياناته، يؤهّل احتياجاته، ويحجز موعدًا أو مكالمة استرداد تلقائيًا على مدار الساعة." },
      { q: "هل يدعم GrowthMonk لغات متعددة؟", a: "نعم. يكتشف GrowthMonk لغة العميل تلقائيًا ويواصل المحادثة كاملة بتلك اللغة. اللغات المدعومة حاليًا: العربية والإنجليزية والتركية، مع إضافة لغات أخرى قريبًا." },
      { q: "ما هو تحسين محركات الإجابة (AEO) في قطاع الرعاية الصحية؟", a: "AEO هو هيكلة محتواك لكي تستشهد به محركات البحث الذكية (ChatGPT وPerplexity ونتائج Google) عند سؤال العملاء عن الرعاية الصحية. يبني GrowthMonk أساس AEO الخاص بك – بيانات منظمة، محتوى دلالي، وصفحات أسئلة وأجوبة – لتظهر في إجابات الذكاء الاصطناعي قبل منافسيك." },
      { q: "كم يستغرق الإعداد؟", a: "تكون معظم المنشآت الصحية جاهزة وتعمل بالكامل خلال 24 ساعة من بدء الانضمام. يتولى فريقنا تكاملات القنوات وإعداد الذكاء الاصطناعي وقاعدة المعرفة. أنت فقط تراجع وتوافق." },
      { q: "هل بيانات العملاء آمنة ومتوافقة مع GDPR؟", a: "نعم. بُني GrowthMonk بخصوصية البيانات كأولوية. جميع محادثات العملاء مشفرة، تُعالَج البيانات ضمن بنية تحتية متوافقة، وتحتفظ بالسيطرة الكاملة على ما يُخزَّن ومدته." },
    ],
  },
  cta: {
    eyebrow: "ابدأ النمو اليوم",
    heading: "هل أنت مستعد لتنمية عيادتك بالذكاء الاصطناعي؟",
    sub: "احجز عرضًا تجريبيًا مجانيًا لمدة 30 دقيقة. سنريك بالضبط كيف يعمل GrowthMonk لعيادتك – مباشر، بلا شرائح، بلا عروض مبيعات.",
    button: "احجز عرضك التجريبي المجاني",
    badges: ["بدون بطاقة ائتمان", "إعداد في 24 ساعة", "إلغاء في أي وقت", "متوافق مع GDPR"],
  },
  footer: { features: "المميزات", howItWorks: "كيف يعمل", industries: "القطاعات", faq: "الأسئلة الشائعة", contact: "تواصل معنا" },
};

export const translations: Record<Lang, Translations> = { en, tr, ar };
