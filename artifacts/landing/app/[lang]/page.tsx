import type { Metadata } from "next";
import { LandingPage } from "../landing-page";
import { translations, type Lang } from "../i18n/translations";

const VALID_LANGS: Lang[] = ["en", "de", "tr", "ar"];
const BASE_URL = "https://growthmonk.ai";

const LANG_META: Record<Lang, { title: string; locale: string }> = {
  en: { title: "GrowthMonk — AI Growth Engine for Healthcare & Wellness", locale: "en_US" },
  de: { title: "GrowthMonk — KI-Wachstumsmotor für Gesundheit & Wellness", locale: "de_DE" },
  tr: { title: "GrowthMonk — Sağlık için Yapay Zeka Büyüme Motoru", locale: "tr_TR" },
  ar: { title: "GrowthMonk — محرك النمو بالذكاء الاصطناعي للرعاية الصحية", locale: "ar_SA" },
};

const HREFLANG_ALTERNATES = {
  en: BASE_URL,
  de: `${BASE_URL}/de`,
  tr: `${BASE_URL}/tr`,
  ar: `${BASE_URL}/ar`,
  "x-default": BASE_URL,
};

export function generateStaticParams() {
  return VALID_LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const validLang = VALID_LANGS.includes(lang as Lang) ? (lang as Lang) : "en";
  const { title, locale } = LANG_META[validLang];
  const t = translations[validLang];
  const canonical = `${BASE_URL}/${validLang}`;

  return {
    title,
    description: t.hero.sub,
    alternates: {
      canonical,
      languages: HREFLANG_ALTERNATES,
    },
    openGraph: {
      title,
      description: t.hero.sub,
      url: canonical,
      locale,
      alternateLocale: VALID_LANGS.filter((l) => l !== validLang).map(
        (l) => LANG_META[l].locale
      ),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const validLang = VALID_LANGS.includes(lang as Lang) ? (lang as Lang) : "en";
  return <LandingPage lang={validLang} />;
}
