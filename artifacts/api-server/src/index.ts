import app from "./app";
import { logger } from "./lib/logger";
import { db } from "@workspace/db";
import { botProfilesTable } from "@workspace/db";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");

  void ensureSaasProfile();
});

async function ensureSaasProfile(): Promise<void> {
  try {
    await db
      .insert(botProfilesTable)
      .values({
        industry: "saas",
        personaRole: "GrowthMonk AI assistant",
        companyContext:
          "GrowthMonk, a B2B SaaS platform that helps healthcare clinics, medspas, dental practices, and care providers automate WhatsApp lead capture, qualify leads automatically, and convert inquiries into booked appointments",
        primaryGoal:
          "answer questions about the GrowthMonk platform, qualify the prospect's clinic type and size, and book a product demo or discovery call",
        callbackOffer: {
          de: '"Darf ich für Sie einen kostenlosen Demo-Termin vereinbaren? Wann hätten Sie Zeit — heute oder morgen, vormittags oder nachmittags?"',
          tr: '"Sizin için ücretsiz bir demo görüşmesi ayarlayabilir miyim? Ne zaman uygun — bugün mü yarın mı, sabah mı öğleden sonra mı?"',
          en: '"Can I book a free product demo for you? When works best — today or tomorrow, morning or afternoon?"',
        },
        gdprAllowedFields: {
          de: "Name, Praxistyp oder Klinikart (z.B. Zahnarzt, Medspa, Pflegedienst), Unternehmensgröße (ungefähre Anzahl an Leads pro Monat), bevorzugte Demo-Zeit",
          tr: "İsim, klinik türü (örn. diş hekimi, medspa, bakım hizmeti), işletme büyüklüğü (aylık yaklaşık lead sayısı), tercih edilen demo zamanı",
          en: "Name, practice or clinic type (e.g. dental, medspa, care provider), business size (approximate monthly leads), preferred demo time",
        },
        gdprRedirect: {
          de: "Technische Details zur Integration und Datenschutz besprechen wir gerne im Demo-Gespräch",
          tr: "Entegrasyon ve veri gizliliği teknik detayları demo görüşmesinde ele alınır",
          en: "We'd be happy to discuss integration details and data privacy during the demo call",
        },
        dataFields: [
          {
            key: "name",
            label: { de: "Name der anfragenden Person", tr: "Soran kişinin adı", en: "Name of the person enquiring" },
          },
          {
            key: "careType",
            label: {
              de: "Praxistyp oder Klinikart (z.B. Zahnarzt, Medspa, Pflegedienst, Klinik)",
              tr: "Klinik türü (örn. diş hekimi, medspa, bakım hizmeti, klinik)",
              en: "Practice or clinic type (e.g. dental practice, medspa, care provider, medical clinic)",
            },
          },
          {
            key: "city",
            label: { de: "Unternehmensgröße oder Standort", tr: "İşletme büyüklüğü veya konum", en: "Business size or location" },
          },
          {
            key: "preferredTime",
            label: { de: "Bevorzugte Demo-Zeit", tr: "Tercih edilen demo zamanı", en: "Preferred demo time" },
          },
        ],
        outOfScopeTopics:
          "specific technical implementation details beyond the product scope, competitor pricing, refund disputes, legal contract terms",
      })
      .onConflictDoUpdate({
        target: botProfilesTable.industry,
        set: {
          personaRole: "GrowthMonk AI assistant",
          companyContext:
            "GrowthMonk, a B2B SaaS platform that helps healthcare clinics, medspas, dental practices, and care providers automate WhatsApp lead capture, qualify leads automatically, and convert inquiries into booked appointments",
          primaryGoal:
            "answer questions about the GrowthMonk platform, qualify the prospect's clinic type and size, and book a product demo or discovery call",
          callbackOffer: {
            de: '"Darf ich für Sie einen kostenlosen Demo-Termin vereinbaren? Wann hätten Sie Zeit — heute oder morgen, vormittags oder nachmittags?"',
            tr: '"Sizin için ücretsiz bir demo görüşmesi ayarlayabilir miyim? Ne zaman uygun — bugün mü yarın mı, sabah mı öğleden sonra mı?"',
            en: '"Can I book a free product demo for you? When works best — today or tomorrow, morning or afternoon?"',
          },
          gdprAllowedFields: {
            de: "Name, Praxistyp oder Klinikart (z.B. Zahnarzt, Medspa, Pflegedienst), Unternehmensgröße (ungefähre Anzahl an Leads pro Monat), bevorzugte Demo-Zeit",
            tr: "İsim, klinik türü (örn. diş hekimi, medspa, bakım hizmeti), işletme büyüklüğü (aylık yaklaşık lead sayısı), tercih edilen demo zamanı",
            en: "Name, practice or clinic type (e.g. dental, medspa, care provider), business size (approximate monthly leads), preferred demo time",
          },
          gdprRedirect: {
            de: "Technische Details zur Integration und Datenschutz besprechen wir gerne im Demo-Gespräch",
            tr: "Entegrasyon ve veri gizliliği teknik detayları demo görüşmesinde ele alınır",
            en: "We'd be happy to discuss integration details and data privacy during the demo call",
          },
          dataFields: [
            {
              key: "name",
              label: { de: "Name der anfragenden Person", tr: "Soran kişinin adı", en: "Name of the person enquiring" },
            },
            {
              key: "careType",
              label: {
                de: "Praxistyp oder Klinikart (z.B. Zahnarzt, Medspa, Pflegedienst, Klinik)",
                tr: "Klinik türü (örn. diş hekimi, medspa, bakım hizmeti, klinik)",
                en: "Practice or clinic type (e.g. dental practice, medspa, care provider, medical clinic)",
              },
            },
            {
              key: "city",
              label: { de: "Unternehmensgröße oder Standort", tr: "İşletme büyüklüğü veya konum", en: "Business size or location" },
            },
            {
              key: "preferredTime",
              label: { de: "Bevorzugte Demo-Zeit", tr: "Tercih edilen demo zamanı", en: "Preferred demo time" },
            },
          ],
          outOfScopeTopics:
            "specific technical implementation details beyond the product scope, competitor pricing, refund disputes, legal contract terms",
          updatedAt: new Date(),
        },
      });
    logger.info("saas bot profile upserted on startup");
  } catch (err) {
    logger.error({ err }, "Failed to upsert saas bot profile on startup — non-fatal");
  }
}
