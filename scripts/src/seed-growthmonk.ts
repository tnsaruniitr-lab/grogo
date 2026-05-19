/**
 * seed-growthmonk.ts
 *
 * Enriches the knowledge base for client_id=12 (slug: "growthmonk").
 *
 * Strategy:
 *  - Deletes all existing entries for client 12 (was only 6 sparse entries)
 *  - Inserts a clean, deduplicated, persuasion-first set of ~30 entries
 *  - Draws from the best content in growthmonk10 (client 26) + new objection/
 *    social-proof/demo entries that were missing across all GrowthMonk clients
 *
 * Run against dev:  pnpm --filter @workspace/scripts run seed-growthmonk
 * Run against prod: DATABASE_URL=<prod_url> pnpm --filter @workspace/scripts run seed-growthmonk
 */

import { db } from "@workspace/db";
import { companyKnowledgeTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const CLIENT_ID = 12; // slug: growthmonk

async function seedGrowthMonk() {
  console.log(`Seeding knowledge for client_id=${CLIENT_ID} (growthmonk)…`);

  // Clear existing entries — was only 6 sparse rows, safe to replace cleanly
  const deleted = await db
    .delete(companyKnowledgeTable)
    .where(eq(companyKnowledgeTable.clientId, CLIENT_ID));
  console.log(`Deleted existing entries (${JSON.stringify(deleted)})`);

  const knowledge = [
    // ─── IDENTITY ────────────────────────────────────────────────────────────
    // Outcome-first pitch. The single most important entry — used whenever a
    // prospect asks "what is GrowthMonk?" or opens the conversation cold.
    {
      clientId: CLIENT_ID,
      category: "identity",
      language: "en",
      priority: 10,
      question: "What is GrowthMonk?",
      answer:
        "GrowthMonk is an AI growth engine built exclusively for healthcare and wellness businesses. It puts an AI assistant on your WhatsApp, Instagram, and Facebook that captures every patient enquiry 24/7, qualifies them automatically, and books consultations directly into your calendar — so your team only handles confirmed, ready-to-book patients, not cold enquiries.",
    },

    // ─── SOCIAL PROOF ────────────────────────────────────────────────────────
    // High-leverage persuasion. Answers the silent question: "does it actually work?"
    {
      clientId: CLIENT_ID,
      category: "social_proof",
      language: "en",
      priority: 9,
      question: "Why WhatsApp? Does it actually perform better than email?",
      answer:
        "WhatsApp messages have a 98% open rate compared to around 20% for email — and most patients read and reply within 3 minutes. The average clinic takes over 4 hours to respond to an enquiry; GrowthMonk responds in under 90 seconds, around the clock. That speed difference is where most bookings are won or lost.",
    },
    {
      clientId: CLIENT_ID,
      category: "social_proof",
      language: "en",
      priority: 9,
      question: "What kind of results do clinics see with GrowthMonk?",
      answer:
        "Clinics using GrowthMonk typically see a 30–40% improvement in lead-to-appointment conversion. The main driver is speed: the AI responds in under 90 seconds, 24 hours a day, compared to an industry average response time of 4+ hours. Patients who get an instant, helpful reply are far more likely to book.",
    },

    // ─── SERVICE CAPABILITIES ────────────────────────────────────────────────
    {
      clientId: CLIENT_ID,
      category: "service",
      language: "en",
      priority: 9,
      question: "How does GrowthMonk capture leads from WhatsApp?",
      answer:
        "GrowthMonk connects to your WhatsApp Business number via the official Meta WhatsApp Business API. When a patient messages you, the AI bot responds instantly — it captures their details, qualifies their needs (service, timing, budget), and either books an appointment into your calendar or schedules a callback automatically. This happens 24 hours a day without any manual effort from your team.",
    },
    {
      clientId: CLIENT_ID,
      category: "service",
      language: "en",
      priority: 9,
      question: "Which channels does GrowthMonk work on?",
      answer:
        "GrowthMonk connects WhatsApp Business, Instagram DMs, Facebook Messenger, and your website chat into one platform. Every enquiry from any channel is captured, qualified, and responded to by the same AI — so no lead slips through regardless of where they reach out.",
    },
    {
      clientId: CLIENT_ID,
      category: "service",
      language: "en",
      priority: 8,
      question: "How does the automatic lead qualification work?",
      answer:
        "The AI asks the right questions to understand each patient's needs and intent — service required, preferred timing, location, and any qualifying details specific to your practice. It then scores each lead and routes hot leads directly to your team for booking, while politely filtering out tyre-kickers and time-wasters.",
    },
    {
      clientId: CLIENT_ID,
      category: "service",
      language: "en",
      priority: 8,
      question: "Can GrowthMonk book appointments automatically?",
      answer:
        "Yes. GrowthMonk syncs with your calendar in real time and converts qualified leads into booked consultations automatically. For patients who need more time before committing, it schedules a callback and reminds them — all without your receptionist needing to be involved.",
    },
    {
      clientId: CLIENT_ID,
      category: "service",
      language: "en",
      priority: 7,
      question: "Can GrowthMonk reactivate old leads and past patients?",
      answer:
        "Yes. GrowthMonk can automatically re-engage cold leads, lapsed patients, and unconverted consultations via WhatsApp. If someone enquired six months ago and never booked, the platform can follow up with a relevant, personalised message — turning dormant contacts into new bookings without any manual work.",
    },
    {
      clientId: CLIENT_ID,
      category: "service",
      language: "en",
      priority: 7,
      question: "Does GrowthMonk include a dashboard or reporting?",
      answer:
        "Yes. The live analytics dashboard shows every lead, conversation, and conversion in real time — including source channel, language, AI-detected intent, and booking status. You get a complete picture of your pipeline in one place.",
    },
    {
      clientId: CLIENT_ID,
      category: "service",
      language: "en",
      priority: 6,
      question: "Does GrowthMonk help with AI search visibility?",
      answer:
        "Yes — this is GrowthMonk's AEO (Answer Engine Optimization) offering. It helps your clinic appear in AI-generated answers on ChatGPT, Perplexity, and Google AI Overviews when patients ask health questions. GrowthMonk builds the structured data, semantic content, and Q&A foundations your practice needs to get cited by AI search engines before your competitors.",
    },

    // ─── PROCESS ─────────────────────────────────────────────────────────────
    {
      clientId: CLIENT_ID,
      category: "process",
      language: "en",
      priority: 8,
      question: "How does GrowthMonk work — step by step?",
      answer:
        "It works in four steps: 1) Audit — we review your current AI search presence and lead gaps. 2) Connect — we link your WhatsApp, Instagram, Facebook, and website chat to the platform. 3) Qualify — the AI captures and qualifies every incoming enquiry automatically. 4) Book — qualified patients are booked directly into your calendar or scheduled for a callback. Most clinics are fully live within 24 hours of onboarding.",
    },
    {
      clientId: CLIENT_ID,
      category: "process",
      language: "en",
      priority: 8,
      question: "How quickly does the AI respond to patient enquiries?",
      answer:
        "The AI responds to every WhatsApp, Instagram DM, and Facebook message in under 90 seconds — 24 hours a day, 7 days a week. The industry average response time for clinics is over 4 hours. That gap is where most bookings are lost to competitors.",
    },
    {
      clientId: CLIENT_ID,
      category: "process",
      language: "en",
      priority: 7,
      question: "How long does setup take?",
      answer:
        "Most healthcare businesses are fully set up and live within 24 hours of onboarding. The GrowthMonk team handles channel integrations, AI configuration, and knowledge base setup — you just review and approve. No technical skills or IT involvement needed on your side.",
    },
    {
      clientId: CLIENT_ID,
      category: "process",
      language: "en",
      priority: 7,
      question: "What does onboarding involve on my side?",
      answer:
        "Very little. You share information about your services, FAQs, pricing, and intake questions — this can be done via WhatsApp or a brief call. The team then configures everything and hands you a live bot to review. The whole process typically takes one working day.",
    },
    {
      clientId: CLIENT_ID,
      category: "process",
      language: "en",
      priority: 7,
      question: "What happens when a patient needs to speak to a human?",
      answer:
        "GrowthMonk includes smart escalation: when a patient's enquiry requires a human touch — complex clinical questions, complaints, or sensitive situations — the conversation is flagged and handed off to your team instantly. The AI handles the routine 80%; your staff focus on the cases that actually need them.",
    },

    // ─── INTEGRATION ─────────────────────────────────────────────────────────
    {
      clientId: CLIENT_ID,
      category: "integration",
      language: "en",
      priority: 7,
      question: "Does GrowthMonk sync with my calendar or booking system?",
      answer:
        "Yes. GrowthMonk syncs with your calendar in real time to avoid double-bookings and eliminate manual diary entry. Integration details — including which booking system you use — are confirmed during the onboarding call.",
    },
    {
      clientId: CLIENT_ID,
      category: "integration",
      language: "en",
      priority: 7,
      question: "Does GrowthMonk use the official WhatsApp Business API?",
      answer:
        "Yes. GrowthMonk connects via the official Meta WhatsApp Business API — not a third-party workaround. This means your number is fully compliant, messages are end-to-end encrypted, and your account is protected against the bans that affect unofficial API users.",
    },
    {
      clientId: CLIENT_ID,
      category: "integration",
      language: "en",
      priority: 6,
      question: "Does GrowthMonk support multiple languages?",
      answer:
        "Yes. The AI detects each patient's language automatically from their first message and continues the entire conversation in that language. GrowthMonk currently supports English, German, Turkish, and Arabic — covering the primary languages of most clinic patient bases across the UK, DACH region, and the Gulf.",
    },

    // ─── TARGET CUSTOMER ─────────────────────────────────────────────────────
    {
      clientId: CLIENT_ID,
      category: "target_customer",
      language: "en",
      priority: 7,
      question: "Which types of healthcare businesses is GrowthMonk built for?",
      answer:
        "GrowthMonk is built for private healthcare and wellness businesses: GP and specialist clinics, dental practices, medspas, aesthetics clinics, physiotherapy and rehab clinics, therapy practices, home nursing and care agencies, IV therapy providers, hair clinics, fertility clinics, and nutrition and wellness businesses. If you run a private practice and rely on appointments, GrowthMonk is built for you.",
    },

    // ─── TRUST & DATA PRIVACY ────────────────────────────────────────────────
    {
      clientId: CLIENT_ID,
      category: "trust",
      language: "en",
      priority: 9,
      question: "Is GrowthMonk GDPR-compliant? Is patient data safe?",
      answer:
        "Yes. GrowthMonk is built with data privacy by design. All patient conversations are encrypted in transit and at rest, data is processed within GDPR-compliant infrastructure, and you retain full control over what is stored and for how long. Technical details — including DPA agreements and data residency — are covered during the demo call.",
    },
    {
      clientId: CLIENT_ID,
      category: "trust",
      language: "en",
      priority: 8,
      question: "Is GrowthMonk just a generic chatbot?",
      answer:
        "No. GrowthMonk's AI is built exclusively for healthcare and wellness — it is trained on healthcare and wellness protocols, clinical communication best practices, and patient empathy patterns. It understands the difference between a routine booking enquiry and a sensitive clinical question, and handles each appropriately. It is not a repurposed general-purpose chatbot.",
    },

    // ─── OBJECTION HANDLING ──────────────────────────────────────────────────
    // These are the four questions that most often kill demo bookings.
    {
      clientId: CLIENT_ID,
      category: "objection",
      language: "en",
      priority: 8,
      question: "We already have a receptionist — why do we need this?",
      answer:
        "GrowthMonk doesn't replace your receptionist — it handles what they can't: out-of-hours enquiries, WhatsApp and social media messages, and simultaneous conversations at peak times. Your receptionist focuses on the patients in front of them; the AI captures and qualifies the ones reaching out online, so nothing falls through the cracks.",
    },
    {
      clientId: CLIENT_ID,
      category: "objection",
      language: "en",
      priority: 8,
      question: "Is GrowthMonk expensive? Is it worth the cost?",
      answer:
        "GrowthMonk pays for itself with one or two additional bookings per week — which most clinics see within the first month. The exact plan depends on your clinic size and channels. Pricing is discussed during the demo so we can match you to the right tier. There is no credit card required to book a demo.",
    },
    {
      clientId: CLIENT_ID,
      category: "objection",
      language: "en",
      priority: 8,
      question: "Is setup complicated? We don't have a technical team.",
      answer:
        "Setup requires no technical skills on your side. GrowthMonk's team handles everything — channel connections, AI configuration, and knowledge base setup. All you need to do is share information about your services and approve the bot before it goes live. Most clinics are up and running within 24 hours.",
    },
    {
      clientId: CLIENT_ID,
      category: "objection",
      language: "en",
      priority: 7,
      question: "What if it doesn't work for us? Are we locked in?",
      answer:
        "No long-term lock-in. You can cancel at any time. GrowthMonk is designed to demonstrate value quickly — most clinics see measurable results in the first few weeks. The demo call is a chance to see the product live before committing to anything.",
    },

    // ─── PRICING ─────────────────────────────────────────────────────────────
    {
      clientId: CLIENT_ID,
      category: "pricing",
      language: "en",
      priority: 9,
      question: "Is there a free demo? Do I need a credit card?",
      answer:
        "Yes — the demo is completely free and no credit card is required. It is a 30-minute video call where you see the live product, a simulated patient conversation, and your dashboard. There is no obligation to buy. To book, just let us know a time that works.",
    },
    {
      clientId: CLIENT_ID,
      category: "pricing",
      language: "en",
      priority: 8,
      question: "Can I cancel at any time?",
      answer:
        "Yes. There are no long-term contracts and you can cancel at any time. GrowthMonk is built to earn your renewal through results, not lock you in through paperwork.",
    },

    // ─── DEMO ────────────────────────────────────────────────────────────────
    // Critical for conversion: most prospects hesitate to book because they
    // don't know what they're committing to. This removes that anxiety.
    {
      clientId: CLIENT_ID,
      category: "demo",
      language: "en",
      priority: 10,
      question: "What does the demo call involve? What will I see?",
      answer:
        "The demo is a 20–30 minute video call — no slides, no sales pitch. We show you the live WhatsApp bot in action, walk through a simulated patient conversation for your specific clinic type, and show you the lead dashboard. You leave knowing exactly what you'd be getting and whether it fits your practice. There is no pressure to sign up.",
    },
    {
      clientId: CLIENT_ID,
      category: "demo",
      language: "en",
      priority: 10,
      question: "How do I book a demo or get started?",
      answer:
        "Just tell us a time that works — today, tomorrow, morning or afternoon — and we will confirm a slot. The demo is free, takes 20–30 minutes, and requires no credit card or commitment. We can usually get you in within 24 hours.",
    },
  ];

  await db.insert(companyKnowledgeTable).values(knowledge);
  console.log(`✓ Inserted ${knowledge.length} knowledge entries for client_id=${CLIENT_ID}.`);
  console.log("Seed complete.");
  process.exit(0);
}

seedGrowthMonk().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
