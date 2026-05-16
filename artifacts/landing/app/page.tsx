import {
  MessageCircle,
  Search,
  Globe,
  Bot,
  Calendar,
  BarChart3,
  ArrowRight,
  Check,
  Zap,
  Shield,
  Star,
  TrendingUp,
  Users,
  Clock,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { VideoHero } from "./hero";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-gray-100">
      <main>
        <VideoHero />
        <TrustBar />
        <ProblemSolution />
        <Features />
        <HowItWorks />
        <Industries />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

function TrustBar() {
  const stats = [
    { value: "3×", label: "More leads discovered through AI search" },
    { value: "80%", label: "Of leads qualified automatically by AI" },
    { value: "24/7", label: "AI follow-up, never misses a lead" },
    { value: "<2 min", label: "Average response time to new leads" },
  ];

  return (
    <section
      className="border-y border-gray-800/60 bg-gray-900/30 px-6 py-12"
      aria-label="Key statistics"
    >
      <div className="mx-auto max-w-5xl">
        <p className="mb-10 text-center text-sm font-medium uppercase tracking-widest text-gray-500">
          What GrowthMonk delivers for healthcare businesses
        </p>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.value} className="text-center">
              <div className="mb-1 text-4xl font-extrabold text-green-400">
                {stat.value}
              </div>
              <div className="text-sm leading-snug text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProblemSolution() {
  const comparisons = [
    {
      problem: "Invisible in AI search (ChatGPT, Perplexity, AI Overviews)",
      solution: "Optimised for AI search engines — patients find you first",
    },
    {
      problem: "Leads from WhatsApp & Instagram go unanswered for hours",
      solution: "AI responds to every message in under 2 minutes, 24/7",
    },
    {
      problem: "Staff spend hours qualifying the same basic enquiries",
      solution: "AI qualifies, filters, and routes leads automatically",
    },
    {
      problem: "Language barriers losing you multilingual patients",
      solution: "Conversations in English, German, Turkish, Arabic and more",
    },
    {
      problem: "Leads captured but never followed up on consistently",
      solution: "AI books appointments and callbacks without human input",
    },
  ];

  return (
    <section className="px-6 py-24" aria-labelledby="problem-heading">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-green-500">
            The Problem → The Fix
          </span>
        </div>
        <h2
          id="problem-heading"
          className="mb-4 text-center text-4xl font-extrabold text-white"
        >
          Stop losing patients to practices that move faster
        </h2>
        <p className="mx-auto mb-16 max-w-xl text-center text-gray-400">
          Healthcare businesses that rely on manual processes are losing patients
          to AI-enabled competitors. GrowthMonk closes that gap.
        </p>

        <div className="overflow-hidden rounded-2xl border border-gray-800">
          <div className="grid grid-cols-2 border-b border-gray-800 bg-gray-900/60">
            <div className="px-6 py-3 text-sm font-semibold text-red-400">
              ✗ &nbsp;The old way
            </div>
            <div className="border-l border-gray-800 px-6 py-3 text-sm font-semibold text-green-400">
              ✓ &nbsp;The GrowthMonk way
            </div>
          </div>
          {comparisons.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-2 border-b border-gray-800/60 last:border-0"
            >
              <div className="px-6 py-4 text-sm text-gray-400">
                {row.problem}
              </div>
              <div className="border-l border-gray-800/60 px-6 py-4 text-sm text-gray-200">
                {row.solution}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    icon: Search,
    title: "AI Search Discovery",
    description:
      "Optimise your practice to appear when patients ask health questions on ChatGPT, Perplexity, Google AI Overviews, and other AI search engines. AEO-first approach from day one.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp & Social Capture",
    description:
      "Capture every lead that messages you on WhatsApp, Instagram DMs, and Facebook. No enquiry falls through the cracks — ever.",
  },
  {
    icon: Globe,
    title: "Multilingual Conversations",
    description:
      "AI detects the patient's language automatically and responds throughout the conversation in English, German, Turkish, Arabic, and more. No staff language skills required.",
  },
  {
    icon: Bot,
    title: "Automated Qualification",
    description:
      "The AI asks the right questions, understands the patient's need, and qualifies or routes leads intelligently — so your team only talks to serious prospects.",
  },
  {
    icon: Calendar,
    title: "Instant Booking",
    description:
      "Qualified leads are converted to booked consultations or scheduled callbacks automatically. Your calendar fills while you focus on delivering care.",
  },
  {
    icon: BarChart3,
    title: "Live Analytics Dashboard",
    description:
      "See every lead, conversation, and conversion in real time. Track source, language, status, and AI-detected intent — complete visibility with zero manual tracking.",
  },
];

function Features() {
  return (
    <section
      id="features"
      className="px-6 py-24"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-green-500">
            Platform Features
          </span>
        </div>
        <h2
          id="features-heading"
          className="mb-4 text-center text-4xl font-extrabold text-white"
        >
          Everything you need to grow faster
        </h2>
        <p className="mx-auto mb-16 max-w-xl text-center text-gray-400">
          GrowthMonk combines AI search visibility, lead capture, qualification,
          and booking into one connected platform built for healthcare.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6 transition-all hover:border-green-500/30 hover:bg-gray-900/60"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10">
                  <Icon className="h-5 w-5 text-green-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-400">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Connect your channels",
      description:
        "Link your WhatsApp Business number, Instagram, and other social media channels to GrowthMonk in minutes. No technical skills needed — we handle the integration.",
      detail: "WhatsApp · Instagram · Facebook · Website chat",
    },
    {
      number: "02",
      title: "AI captures and qualifies every lead",
      description:
        "The moment a potential patient sends a message, our AI responds instantly — in their language. It asks the right questions, understands their need, and qualifies their intent automatically.",
      detail: "24/7 response · Multilingual · Zero staff time",
    },
    {
      number: "03",
      title: "You receive booked appointments",
      description:
        "Qualified patients are booked into your calendar or scheduled for a callback automatically. You open your dashboard to a list of warm, qualified leads ready to convert.",
      detail: "Auto-booking · Callback scheduling · Live dashboard",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="px-6 py-24"
      aria-labelledby="how-heading"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-green-500">
            How It Works
          </span>
        </div>
        <h2
          id="how-heading"
          className="mb-4 text-center text-4xl font-extrabold text-white"
        >
          Up and running in 24 hours
        </h2>
        <p className="mx-auto mb-16 max-w-xl text-center text-gray-400">
          Three steps from sign-up to a fully automated lead pipeline for your
          healthcare business.
        </p>

        <div className="relative">
          <div
            className="absolute left-8 top-0 hidden h-full w-px md:block"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(34,197,94,0.3), transparent)",
            }}
          />

          <div className="space-y-12">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-8">
                <div className="relative flex-shrink-0">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-green-500/30 bg-green-500/10 text-xl font-black text-green-400">
                    {step.number}
                  </div>
                </div>
                <div className="pb-4 pt-2">
                  <h3 className="mb-2 text-xl font-bold text-white">
                    {step.title}
                  </h3>
                  <p className="mb-3 text-gray-400">{step.description}</p>
                  <p className="text-sm font-medium text-green-500/80">
                    {step.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Industries() {
  const industries = [
    {
      name: "Medical Clinics",
      icon: "🏥",
      desc: "GP practices, specialist clinics, and private hospitals",
    },
    {
      name: "Dental Practices",
      icon: "🦷",
      desc: "General dentistry, orthodontics, and implant centres",
    },
    {
      name: "MedSpas & Aesthetics",
      icon: "✨",
      desc: "Aesthetic clinics, laser centres, and skin practices",
    },
    {
      name: "Physiotherapy",
      icon: "🤸",
      desc: "Physio, sports rehab, and movement clinics",
    },
    {
      name: "Mental Health",
      icon: "🧠",
      desc: "Therapy, counselling, and psychiatry practices",
    },
    {
      name: "Care Services",
      icon: "❤️",
      desc: "Home nursing, elderly care, and care agencies",
    },
    {
      name: "Nutrition & Wellness",
      icon: "🥗",
      desc: "Nutritionists, dietitians, and wellness coaches",
    },
    {
      name: "Fertility & IVF",
      icon: "👶",
      desc: "Fertility clinics and reproductive health centres",
    },
  ];

  return (
    <section
      id="industries"
      className="px-6 py-24"
      aria-labelledby="industries-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-green-500">
            Industries
          </span>
        </div>
        <h2
          id="industries-heading"
          className="mb-4 text-center text-4xl font-extrabold text-white"
        >
          Built for every healthcare vertical
        </h2>
        <p className="mx-auto mb-16 max-w-xl text-center text-gray-400">
          Whether you run a boutique medspa or a multi-location clinic,
          GrowthMonk adapts to your specialty and patient demographics.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((item) => (
            <div
              key={item.name}
              className="rounded-xl border border-gray-800 bg-gray-900/30 p-5 transition-all hover:border-green-500/20 hover:bg-gray-900/50"
            >
              <div className="mb-3 text-3xl">{item.icon}</div>
              <h3 className="mb-1 font-semibold text-white">{item.name}</h3>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    {
      q: "What is GrowthMonk?",
      a: "GrowthMonk is an AI growth engine for healthcare and wellness businesses. It helps clinics, medspas, dental practices, and care providers get discovered in AI search engines like ChatGPT and Perplexity, capture leads from WhatsApp and social media, and automatically qualify and convert those leads into booked appointments.",
    },
    {
      q: "How does GrowthMonk capture leads from WhatsApp?",
      a: "GrowthMonk connects to your WhatsApp Business number via the official Meta API. When a patient messages you, the AI bot responds instantly, captures their details, qualifies their needs, and either books an appointment or schedules a callback — automatically, 24 hours a day.",
    },
    {
      q: "Does GrowthMonk support multiple languages?",
      a: "Yes. GrowthMonk detects the patient's language automatically and continues in that language for the entire conversation. Currently supported: English, German, Turkish, and Arabic, with more languages being added.",
    },
    {
      q: "What is Answer Engine Optimization (AEO) for healthcare?",
      a: "AEO is the practice of structuring your content so AI search engines (ChatGPT, Perplexity, Google AI Overviews) cite your practice when patients ask health questions. GrowthMonk builds your AEO foundation — structured data, semantic content, and Q&A pages — so you appear in AI answers before your competitors.",
    },
    {
      q: "How long does setup take?",
      a: "Most healthcare businesses are fully set up and live within 24 hours of onboarding. Our team handles the channel integrations, AI configuration, and knowledge base setup. You just review and approve.",
    },
    {
      q: "Is patient data safe and GDPR-compliant?",
      a: "Yes. GrowthMonk is built with data privacy by design. All patient conversations are encrypted, data is processed within compliant infrastructure, and you retain full control over what is stored and for how long.",
    },
  ];

  return (
    <section
      id="faq"
      className="px-6 py-24"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-green-500">
            FAQ
          </span>
        </div>
        <h2
          id="faq-heading"
          className="mb-4 text-center text-4xl font-extrabold text-white"
        >
          Common questions
        </h2>
        <p className="mx-auto mb-16 max-w-lg text-center text-gray-400">
          Everything you need to know about GrowthMonk and AI-powered growth for
          healthcare.
        </p>

        <dl className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.q}
              className="rounded-xl border border-gray-800 bg-gray-900/40 p-6"
            >
              <dt className="mb-3 font-semibold text-white">{faq.q}</dt>
              <dd className="text-sm leading-relaxed text-gray-400">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section
      id="cta"
      className="px-6 py-24"
      aria-labelledby="cta-heading"
    >
      <div className="mx-auto max-w-4xl">
        <div
          className="relative overflow-hidden rounded-3xl p-12 text-center"
          style={{
            background:
              "linear-gradient(135deg, #052e16 0%, #14532d 50%, #052e16 100%)",
            border: "1px solid rgba(34,197,94,0.3)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(34,197,94,0.12), transparent)",
            }}
          />
          <div className="relative">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-500/20 px-4 py-1.5 text-sm font-medium text-green-300">
              <Zap className="h-3.5 w-3.5" />
              Start growing today
            </div>
            <h2
              id="cta-heading"
              className="mb-4 text-4xl font-extrabold text-white md:text-5xl"
            >
              Ready to grow your practice with AI?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-lg text-green-100/70">
              Book a free 30-minute demo. We&apos;ll show you exactly how
              GrowthMonk would work for your practice — live, no slides, no
              sales pitch.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href="mailto:hello@answermonk.ai?subject=GrowthMonk Demo Request"
                className="inline-flex items-center gap-2 rounded-full bg-green-500 px-8 py-3.5 font-semibold text-white shadow-lg shadow-green-900/50 transition-all hover:bg-green-400"
              >
                Book Your Free Demo
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {[
                "No credit card",
                "24-hour setup",
                "Cancel anytime",
                "GDPR compliant",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm text-green-300/70"
                >
                  <Check className="h-3.5 w-3.5 text-green-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-800/60 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-500">
              <TrendingUp className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-white">GrowthMonk</span>
            <span className="text-gray-600">by AnswerMonk.ai</span>
          </div>

          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
              <li>
                <a href="#features" className="transition-colors hover:text-gray-300">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="transition-colors hover:text-gray-300">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#industries" className="transition-colors hover:text-gray-300">
                  Industries
                </a>
              </li>
              <li>
                <a href="#faq" className="transition-colors hover:text-gray-300">
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@answermonk.ai"
                  className="transition-colors hover:text-gray-300"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} GrowthMonk by AnswerMonk.ai
          </p>
        </div>
      </div>
    </footer>
  );
}
