import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Globe, Settings } from "lucide-react";

export function AdminNav() {
  const [location] = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8 relative">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Settings className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">Demo System</span>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-1.5 text-sm font-medium transition-colors",
              location === "/admin" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Globe className="h-4 w-4" />
            Demos
          </Link>
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-1.5 text-sm font-medium transition-colors",
              location.startsWith("/dashboard") ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Lead-Dashboard
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Website
          </Link>
        </div>
      </div>
    </nav>
  );
}
