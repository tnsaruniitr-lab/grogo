import { Link, useLocation } from "wouter";
import { Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { LANG_OPTIONS } from "@/lib/demo-i18n";

export function Nav({ logoUrl, demoLanguage }: { logoUrl?: string | null; demoLanguage?: string | null }) {
  const [location] = useLocation();
  const isHome = location === "/";
  const langOption = LANG_OPTIONS.find((l) => l.value === (demoLanguage || "de"));

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8 relative">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2" data-testid="link-home">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo"
                className="h-10 max-w-[160px] object-contain"
                style={{ mixBlendMode: "multiply" }}
              />
            ) : (
              <>
                <span className="text-3xl font-extrabold tracking-tight text-secondary">DOSTELI</span>
                <Moon className="h-6 w-6 fill-destructive text-destructive" aria-hidden="true" />
              </>
            )}
          </Link>
          {langOption && (
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full border border-border bg-muted text-muted-foreground flex items-center gap-1"
              title={langOption.label}
            >
              <span>{langOption.flag}</span>
              <span>{langOption.value.toUpperCase()}</span>
            </span>
          )}
        </div>

        <div className="hidden md:flex items-center space-x-8">
          {isHome ? (
            <>
              <a href="#demenz-wg" className="text-sm font-semibold text-secondary hover:text-primary transition-colors">Demenz WG</a>
              <a href="#leistungen" className="text-sm font-semibold text-secondary hover:text-primary transition-colors">Leistungen</a>
              <a href="#uber-uns" className="text-sm font-semibold text-secondary hover:text-primary transition-colors">Über uns</a>
              <a href="#jobs" className="text-sm font-semibold text-secondary hover:text-primary transition-colors">Jobs</a>
            </>
          ) : (
            <Link href="/" className="text-sm font-semibold text-secondary hover:text-primary transition-colors">Zurück zur Website</Link>
          )}
          
          <div className="flex items-center gap-4 border-l pl-4 ml-2">
            <Link 
              href="/dashboard" 
              className={cn("text-sm font-medium transition-colors", location.startsWith("/dashboard") ? "text-primary" : "text-muted-foreground hover:text-foreground")}
              data-testid="nav-dashboard"
            >
              Dashboard
            </Link>
            <Link 
              href="/mockups" 
              className={cn("text-sm font-medium transition-colors", location.startsWith("/mockups") ? "text-primary" : "text-muted-foreground hover:text-foreground")}
              data-testid="nav-mockups"
            >
              Ad Mockups
            </Link>
            <Link 
              href="/admin" 
              className={cn("text-sm font-medium transition-colors", location.startsWith("/admin") ? "text-primary" : "text-muted-foreground hover:text-foreground")}
              data-testid="nav-admin"
            >
              Demo Admin
            </Link>
          </div>
        </div>

        {/* Demo banner */}
        <div 
          className="absolute top-0 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-b-lg shadow-sm"
          data-testid="badge-demo"
        >
          Demo-System
        </div>
      </div>
    </nav>
  );
}
