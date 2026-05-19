import type { Metadata } from "next";
import "./globals.css";

const BASE_URL = "https://growthmonk.ai";

export const metadata: Metadata = {
  metadataBase: new URL("https://growthmonk.ai"),
  title: {
    default: "GrowthMonk — AI Growth Engine for Healthcare & Wellness",
    template: "%s | GrowthMonk",
  },
  description:
    "GrowthMonk helps clinics, medspas, dental practices, and wellness businesses capture inbound enquiries from WhatsApp and social media, qualify them automatically, and get discovered in AI search engines like ChatGPT, Perplexity, and Google AI Overviews — 24/7, multilingual.",
  keywords: [
    "AI healthcare marketing",
    "wellness lead generation",
    "WhatsApp chatbot healthcare",
    "AI search optimization healthcare",
    "AEO healthcare",
    "medical practice growth",
    "medspa lead capture",
    "dental practice AI",
    "healthcare AI automation",
    "AI lead qualification",
  ],
  authors: [{ name: "GrowthMonk", url: BASE_URL }],
  creator: "GrowthMonk",
  publisher: "GrowthMonk",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "GrowthMonk",
    title: "GrowthMonk — AI Growth Engine for Healthcare & Wellness",
    description:
      "Get discovered in AI search and social media. Capture inbound enquiries automatically and turn them into booked consultations. Built for healthcare and wellness businesses.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GrowthMonk — AI Growth Engine for Healthcare & Wellness",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GrowthMonk — AI Growth Engine for Healthcare & Wellness",
    description:
      "Get discovered in AI search and social media. Capture inbound enquiries and turn them into booked consultations.",
    images: ["/og-image.jpg"],
    creator: "@growthmonk",
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      en: BASE_URL,
      de: `${BASE_URL}/de`,
      tr: `${BASE_URL}/tr`,
      ar: `${BASE_URL}/ar`,
      "x-default": BASE_URL,
    },
  },
  category: "technology",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}#organization`,
      name: "GrowthMonk",
      url: BASE_URL,
      description:
        "GrowthMonk helps clinics, medspas, dental practices, and wellness businesses capture inbound enquiries from WhatsApp and social media, qualify them using business-approved rules, and get discovered in AI search engines. GrowthMonk does not provide medical advice or clinical decision-making.",
      foundingDate: "2024",
      areaServed: "Worldwide",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/og-image.jpg`,
      },
      sameAs: [
        "https://twitter.com/growthmonk",
        "https://linkedin.com/company/growthmonk",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        email: "hello@growthmonk.ai",
        contactType: "customer support",
      },
      knowsAbout: [
        "AI marketing automation",
        "Healthcare lead generation",
        "WhatsApp chatbots",
        "Answer Engine Optimization",
        "Multilingual AI chatbots",
      ],
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${BASE_URL}#software`,
      name: "GrowthMonk",
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Healthcare Marketing Automation",
      operatingSystem: "Web",
      url: BASE_URL,
      datePublished: "2025-01-01",
      dateModified: "2026-05-19",
      description:
        "GrowthMonk is a business communication and lead management platform for healthcare, wellness, medspa, and service businesses. It captures inbound enquiries from WhatsApp, Instagram, and social media, qualifies them using business-approved questions, routes them to staff, and supports appointment booking — 24/7, multilingual. GrowthMonk does not provide medical advice, diagnosis, treatment recommendations, prescriptions, emergency support, or clinical decision-making.",
      featureList: [
        "AI search discovery and optimization",
        "WhatsApp and Instagram lead capture",
        "Multilingual AI conversations (English, German, Turkish, Arabic)",
        "Automated lead qualification",
        "Instant appointment booking",
        "Real-time analytics dashboard",
      ],
      audience: {
        "@type": "BusinessAudience",
        audienceType:
          "Healthcare businesses, medical clinics, medspas, dental practices, physiotherapy, mental health, care services",
      },
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${BASE_URL}#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "What is GrowthMonk?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "GrowthMonk is a business communication and lead management platform for healthcare, wellness, medspa, and service businesses. It captures inbound enquiries from WhatsApp, Instagram, Facebook and websites, qualifies them using business-approved questions, routes them to staff, and supports appointment booking. GrowthMonk does not provide medical advice, diagnosis, treatment recommendations, prescriptions, emergency support, or clinical decision-making.",
          },
        },
        {
          "@type": "Question",
          name: "How does GrowthMonk capture leads from WhatsApp?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "GrowthMonk connects to your WhatsApp Business number via the official Meta WhatsApp Business API. When a patient sends a message, the AI bot responds instantly, captures their details, qualifies their needs, and either books an appointment or schedules a callback — all automatically, 24 hours a day.",
          },
        },
        {
          "@type": "Question",
          name: "Does GrowthMonk support multiple languages?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. GrowthMonk detects the patient's language automatically and responds in that language throughout the entire conversation. Currently supported languages include English, German, Turkish, and Arabic, with more being added continuously.",
          },
        },
        {
          "@type": "Question",
          name: "What is Answer Engine Optimization (AEO) for healthcare?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Answer Engine Optimization (AEO) is the practice of structuring your online content so that AI search engines like ChatGPT, Perplexity, and Google AI Overviews will cite your practice when patients ask health-related questions. GrowthMonk helps healthcare businesses get discovered in these AI-powered search results, following Google's AI Overviews guidelines for structured content.",
          },
        },
        {
          "@type": "Question",
          name: "Which healthcare businesses does GrowthMonk serve?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "GrowthMonk serves medical clinics, dental practices, medspas and aesthetic clinics, physiotherapy and rehabilitation centers, mental health practices, care services and home nursing providers, and wellness and nutrition businesses.",
          },
        },
        {
          "@type": "Question",
          name: "Is patient data safe and GDPR-compliant?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. GrowthMonk is built with data privacy by design. All patient conversations are encrypted, data is processed within GDPR-compliant infrastructure, and you retain full control over what is stored and for how long.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-brand-dark text-gray-100 antialiased">{children}</body>
    </html>
  );
}
