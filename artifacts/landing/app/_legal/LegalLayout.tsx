import { TrendingUp } from "lucide-react";

export function LegalLayout({
  title,
  description,
  lastUpdated,
  children,
}: {
  title: string;
  description?: string;
  lastUpdated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0f0a] text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800/60 px-6 py-4">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-500">
              <TrendingUp className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-white">GrowthMonk</span>
          </a>
          <a href="/" className="text-sm text-gray-400 hover:text-gray-200 transition-colors">
            ← Back to home
          </a>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-3">{title}</h1>
          {description && <p className="text-gray-400 text-base">{description}</p>}
          {lastUpdated && (
            <p className="text-sm text-gray-600 mt-2">Last updated: {lastUpdated}</p>
          )}
        </div>

        <div className="prose prose-invert prose-sm max-w-none
          prose-headings:text-white prose-headings:font-semibold
          prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-3
          prose-h3:text-base prose-h3:mt-6 prose-h3:mb-2
          prose-p:text-gray-300 prose-p:leading-relaxed
          prose-li:text-gray-300
          prose-ul:pl-5 prose-ul:space-y-1
          prose-ol:pl-5 prose-ol:space-y-1
          prose-a:text-green-400 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-white">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/60 px-6 py-10 mt-10">
        <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <div>
            <p>GrowthMonk is operated by <strong className="text-gray-500">Dreamport Technology Private Limited</strong>.</p>
            <p className="text-xs text-gray-700 mt-1">CIN: U78100RJ2025PTC104714 &middot; 72 Mangal Vihar (MCL), Scheme No. 5, Bhoggore, Alwar, Rajasthan &ndash; 301001, India</p>
          </div>
          <nav className="flex flex-wrap gap-5">
            <a href="/privacy-policy" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            <a href="/data-deletion" className="hover:text-gray-300 transition-colors">Data Deletion</a>
            <a href="/contact" className="hover:text-gray-300 transition-colors">Contact</a>
          </nav>
          <p>© {new Date().getFullYear()} GrowthMonk</p>
        </div>
      </footer>
    </div>
  );
}
