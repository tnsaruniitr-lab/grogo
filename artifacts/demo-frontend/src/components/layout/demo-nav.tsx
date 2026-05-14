import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Globe, ArrowLeft } from "lucide-react";
import { getDemoT } from "@/lib/demo-i18n";

interface DemoNavBranding {
  companyName: string;
  slug: string;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  logoUrl?: string | null;
  demoLanguage?: string | null;
}

export function DemoNav({ branding }: { branding: DemoNavBranding }) {
  const [location] = useLocation();
  const base = `/demo/${branding.slug}`;
  const secondary = branding.secondaryColor ?? "#1a3a1a";
  const t = getDemoT(branding.demoLanguage);

  return (
    <nav className="sticky top-0 z-50 w-full border-b" style={{ backgroundColor: secondary }}>
      <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-3">
          {branding.logoUrl ? (
            <img
              src={branding.logoUrl}
              alt={branding.companyName}
              className="h-8 w-auto max-w-[120px] object-contain rounded"
              style={{ mixBlendMode: "multiply" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : (
            <span className="text-base font-extrabold text-white tracking-tight">
              {branding.companyName.toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-5">
          <Link
            href={base}
            className={cn(
              "flex items-center gap-1.5 text-xs font-semibold transition-colors",
              location === base ? "text-white" : "text-white/60 hover:text-white"
            )}
          >
            <Globe className="h-3.5 w-3.5" /> {t.nav.overview}
          </Link>
          <Link
            href={`${base}/dashboard`}
            className={cn(
              "flex items-center gap-1.5 text-xs font-semibold transition-colors",
              location === `${base}/dashboard` ? "text-white" : "text-white/60 hover:text-white"
            )}
          >
            <LayoutDashboard className="h-3.5 w-3.5" /> {t.nav.dashboard}
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition-colors ml-2 border-l border-white/20 pl-4"
          >
            <ArrowLeft className="h-3 w-3" /> {t.nav.back}
          </Link>
        </div>
      </div>
    </nav>
  );
}
