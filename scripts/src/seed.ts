import { db } from "@workspace/db";
import { clientsTable, companyKnowledgeTable } from "@workspace/db";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Seeding database...");

  // Upsert Dosteli client
  const existing = await db
    .select({ id: clientsTable.id })
    .from(clientsTable)
    .where(eq(clientsTable.slug, "dosteli"))
    .limit(1);

  let clientId: number;

  if (existing.length > 0) {
    clientId = existing[0].id;
    console.log(`Client 'dosteli' already exists (id=${clientId}), skipping insert.`);
  } else {
    const inserted = await db
      .insert(clientsTable)
      .values({
        name: "Dosteli GmbH",
        slug: "dosteli",
        whatsappNumber: "+49000000000",
        twilioSender: "whatsapp:+14155238886", // Twilio sandbox sender
        languagePrimary: "de",
        languageSecondary: "tr",
        isActive: true,
        config: {
          callbackHours: "Mo–Fr 8:00–18:00 Uhr",
          callbackNumber: "+49000000000",
          maxBotTurnsPerHour: 10,
        },
      })
      .returning({ id: clientsTable.id });
    clientId = inserted[0].id;
    console.log(`Created client 'dosteli' (id=${clientId})`);
  }

  // Clear existing knowledge for clean re-seed
  await db
    .delete(companyKnowledgeTable)
    .where(eq(companyKnowledgeTable.clientId, clientId));

  const knowledge = [
    // ─── GERMAN ENTRIES ───────────────────────────────────────────
    {
      clientId,
      category: "overview",
      language: "de",
      priority: 10,
      question: "Was ist Dosteli?",
      answer:
        "Dosteli GmbH ist ein ambulanter Pflegedienst in Deutschland mit dem Schwerpunkt auf kultursensible Pflege. Wir betreuen Menschen mit Migrationshintergrund – insbesondere türkisch-, arabisch- und deutschsprachige Familien – in ihrer eigenen Sprache und mit Respekt für ihre kulturellen Werte.",
    },
    {
      clientId,
      category: "services",
      language: "de",
      priority: 9,
      question: "Welche Pflegeleistungen bietet Dosteli an?",
      answer:
        "Wir bieten: 1) Demenz-WG – betreutes Wohnen für Menschen mit Demenz in kleinen Wohngemeinschaften, 2) Ambulante Pflege – Unterstützung zu Hause bei alltäglichen Aufgaben, Körperpflege und medizinischer Versorgung, 3) 24-Stunden-Betreuung – rund um die Uhr Begleitung für Menschen mit hohem Pflegebedarf.",
    },
    {
      clientId,
      category: "demenz_wg",
      language: "de",
      priority: 8,
      question: "Was ist die Demenz-WG von Dosteli?",
      answer:
        "Unsere Demenz-WG ist eine kleine, familiäre Wohngemeinschaft für Menschen mit Demenz. Maximal 8 Bewohner leben zusammen und werden rund um die Uhr von unserem geschulten Team betreut. Die Einrichtung ist kultursensibel gestaltet – türkische und arabische Speisen, Sprache und Traditionen sind selbstverständlicher Teil des Alltags.",
    },
    {
      clientId,
      category: "demenz_wg",
      language: "de",
      priority: 7,
      question: "Wie viele Plätze hat die Demenz-WG und wo ist sie?",
      answer:
        "Unsere Demenz-WG bietet Platz für maximal 8 Bewohner in einer familiären Atmosphäre. Für genaue Standortinformationen und aktuelle Verfügbarkeit sprechen Sie uns direkt an – wir informieren Sie gerne im persönlichen Gespräch.",
    },
    {
      clientId,
      category: "language_culture",
      language: "de",
      priority: 9,
      question: "Spricht das Pflegepersonal Türkisch oder Arabisch?",
      answer:
        "Ja – unser Team besteht aus muttersprachlichen Pflegekräften, die Deutsch, Türkisch und Arabisch sprechen. Kultursensible Pflege bedeutet für uns: gleiche Sprache, gleiche Werte, vertraute Atmosphäre.",
    },
    {
      clientId,
      category: "regions",
      language: "de",
      priority: 7,
      question: "In welchen Städten und Regionen ist Dosteli aktiv?",
      answer:
        "Dosteli ist aktuell in Deutschland tätig. Für genaue Informationen zu Ihrem Standort sprechen Sie uns direkt an – wir helfen Ihnen gerne herauszufinden, ob wir in Ihrer Region verfügbar sind.",
    },
    {
      clientId,
      category: "pricing",
      language: "de",
      priority: 7,
      question: "Was kostet die Pflege bei Dosteli?",
      answer:
        "Die Kosten hängen vom individuellen Pflegegrad und den benötigten Leistungen ab. Ein Teil der Kosten wird von der Pflegeversicherung übernommen. Genaue Preise besprechen wir gerne in einem persönlichen Beratungsgespräch – rufen Sie uns an oder lassen Sie sich zurückrufen.",
    },
    {
      clientId,
      category: "callback",
      language: "de",
      priority: 10,
      question: "Wann kann ich einen Rückruf erhalten?",
      answer:
        "Unser Team ist Montag bis Freitag von 8:00 bis 18:00 Uhr erreichbar. Wir rufen Sie gerne zurück – sagen Sie uns einfach, wann es Ihnen am besten passt: heute oder morgen, vormittags oder nachmittags.",
    },
    {
      clientId,
      category: "intake_fields",
      language: "de",
      priority: 10,
      question: "Welche Informationen benötigt Dosteli zur Ersteinschätzung?",
      answer:
        "Für eine erste Einschätzung genügen uns: Name der pflegebedürftigen Person, Wohnort, Art der benötigten Unterstützung (z.B. Demenz, ambulante Pflege, 24h-Betreuung), ob Sie selbst betroffen sind oder für eine Angehörige anfragen, und Ihre bevorzugte Kontaktzeit.",
    },
    {
      clientId,
      category: "gdpr_boundary",
      language: "de",
      priority: 10,
      question: "Welche medizinischen Informationen sollte ich dem Bot mitteilen?",
      answer:
        "Medizinische Details, Diagnosen oder Medikamentenpläne besprechen wir ausschließlich im persönlichen Gespräch mit unserem Pflegeteam. Im Chat genügen uns allgemeine Angaben zur benötigten Unterstützung.",
    },
    {
      clientId,
      category: "jobs",
      language: "de",
      priority: 5,
      question: "Sucht Dosteli Pflegekräfte?",
      answer:
        "Ja, wir suchen regelmäßig engagierte Pflegekräfte mit Herz – besonders Personen mit Türkisch- oder Arabischkenntnissen. Schauen Sie auf unserer Webseite unter 'Jobs' oder fragen Sie uns direkt.",
    },

    // ─── TURKISH ENTRIES ──────────────────────────────────────────
    {
      clientId,
      category: "overview",
      language: "tr",
      priority: 10,
      question: "Dosteli nedir?",
      answer:
        "Dosteli GmbH, Almanya'da kültüre duyarlı bakım hizmetleri sunan bir ayakta bakım şirketidir. Göçmen geçmişine sahip ailelere – özellikle Türkçe, Arapça ve Almanca konuşan bireylere – kendi dillerinde ve kültürel değerlerine saygı göstererek hizmet veriyoruz.",
    },
    {
      clientId,
      category: "services",
      language: "tr",
      priority: 9,
      question: "Dosteli hangi bakım hizmetlerini sunuyor?",
      answer:
        "Sunduğumuz hizmetler: 1) Demans Konutu (WG) – demans hastaları için küçük ve aile ortamı sunan yaşam toplulukları, 2) Evde Bakım – günlük yaşam, kişisel bakım ve tıbbi destek, 3) 24 Saat Bakım – yoğun bakım ihtiyacı olan bireyler için kesintisiz refakat.",
    },
    {
      clientId,
      category: "demenz_wg",
      language: "tr",
      priority: 8,
      question: "Dosteli'nin Demans Konutu (WG) nedir?",
      answer:
        "Demans Konutumuz, demans hastası bireyler için küçük ve ailevi bir yaşam topluluğudur. En fazla 8 sakin bir arada yaşar ve 24 saat boyunca eğitimli ekibimiz tarafından bakılır. Tesis, kültüre duyarlı bir şekilde tasarlanmıştır – Türk ve Arap yemekleri, dil ve gelenekler günlük yaşamın doğal bir parçasıdır.",
    },
    {
      clientId,
      category: "demenz_wg",
      language: "tr",
      priority: 7,
      question: "Demans Konutu'nda kaç yer var ve nerede bulunuyor?",
      answer:
        "Demans Konutumuz, ailevi bir ortamda en fazla 8 sakine yer sunmaktadır. Kesin konum bilgisi ve mevcut kapasite için lütfen bizimle doğrudan iletişime geçin – sizi kişisel görüşmeyle bilgilendirmekten memnuniyet duyarız.",
    },
    {
      clientId,
      category: "language_culture",
      language: "tr",
      priority: 9,
      question: "Bakıcılar Türkçe biliyor mu?",
      answer:
        "Evet – ekibimiz Türkçe, Arapça ve Almanca konuşan anadil düzeyinde çalışanlardan oluşmaktadır. Kültüre duyarlı bakım bizim için şu anlama gelir: aynı dil, aynı değerler, tanıdık bir ortam.",
    },
    {
      clientId,
      category: "regions",
      language: "tr",
      priority: 7,
      question: "Dosteli hangi şehir ve bölgelerde hizmet veriyor?",
      answer:
        "Dosteli şu anda Almanya genelinde faaliyet göstermektedir. Bulunduğunuz bölgeye ilişkin kesin bilgi için lütfen bizimle doğrudan iletişime geçin – bölgenizde hizmet verip vermediğimizi öğrenmenize yardımcı oluruz.",
    },
    {
      clientId,
      category: "pricing",
      language: "tr",
      priority: 7,
      question: "Dosteli'nin bakım hizmetleri ne kadar tutuyor?",
      answer:
        "Maliyetler, bireysel bakım derecesine (Pflegegrad) ve ihtiyaç duyulan hizmetlere göre değişmektedir. Masrafların bir kısmı bakım sigortası tarafından karşılanmaktadır. Kesin fiyatlar için kişisel görüşme talep etmenizi öneririz – sizi arayalım mı?",
    },
    {
      clientId,
      category: "callback",
      language: "tr",
      priority: 10,
      question: "Ne zaman geri arama alabilirim?",
      answer:
        "Ekibimiz Pazartesi'den Cuma'ya 08:00 – 18:00 saatleri arasında hizmet vermektedir. Sizi memnuniyetle ararız – bugün mü, yoksa yarın mı daha uygun? Sabah mı, öğleden sonra mı?",
    },
    {
      clientId,
      category: "intake_fields",
      language: "tr",
      priority: 10,
      question: "İlk değerlendirme için hangi bilgiler gerekli?",
      answer:
        "İlk değerlendirme için yeterli olan bilgiler: bakıma ihtiyaç duyan kişinin adı, yaşadığı şehir, ihtiyaç duyulan destek türü (örn. demans, evde bakım, 24 saat), kendiniz için mi yoksa bir yakınınız için mi sorduğunuz ve tercih ettiğiniz iletişim zamanı.",
    },
    {
      clientId,
      category: "gdpr_boundary",
      language: "tr",
      priority: 10,
      question: "Bota hangi tıbbi bilgileri paylaşmalıyım?",
      answer:
        "Tıbbi ayrıntılar, tanılar veya ilaç planları yalnızca bakım ekibimizle yapılacak kişisel görüşmelerde ele alınmaktadır. Sohbet sırasında, ihtiyaç duyulan destek hakkında genel bilgi vermek yeterlidir.",
    },
    {
      clientId,
      category: "jobs",
      language: "tr",
      priority: 5,
      question: "Dosteli bakım elemanı arıyor mu?",
      answer:
        "Evet, gönülden çalışan ve özellikle Türkçe veya Arapça bilen bakım elemanlarını düzenli olarak arıyoruz. Web sitemizin 'Jobs' bölümünü inceleyebilir ya da doğrudan bize sorabilirsiniz.",
    },
  ];

  await db.insert(companyKnowledgeTable).values(knowledge);

  console.log(`Seeded ${knowledge.length} knowledge entries for client id=${clientId}.`);
  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
