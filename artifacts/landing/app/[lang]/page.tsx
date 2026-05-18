import { LandingPage } from "../landing-page";
import { translations, type Lang } from "../i18n/translations";

const VALID_LANGS: Lang[] = ["en", "de", "tr", "ar"];

export function generateStaticParams() {
  return VALID_LANGS.map((lang) => ({ lang }));
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const validLang = VALID_LANGS.includes(lang as Lang) ? (lang as Lang) : "en";
  return <LandingPage lang={validLang} />;
}
