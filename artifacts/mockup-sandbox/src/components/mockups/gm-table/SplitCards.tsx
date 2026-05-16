import React from "react";
import { X, Check } from "lucide-react";

export function SplitCards() {
  const problems = [
    "Invisible in AI search (ChatGPT, Perplexity, AI Overviews)",
    "Leads from WhatsApp & Instagram go unanswered for hours",
    "Staff spend hours qualifying the same basic enquiries",
    "Language barriers losing you multilingual patients",
    "Leads captured but never followed up on consistently"
  ];

  const solutions = [
    "Optimised for AI search engines — patients find you first",
    "AI responds to every message in under 2 minutes, 24/7",
    "AI qualifies, filters, and routes leads automatically",
    "Conversations in English, German, Turkish, Arabic and more",
    "AI books appointments and callbacks without human input"
  ];

  return (
    <div style={{ backgroundColor: "#030712" }} className="min-h-screen text-slate-200 py-24 px-6 font-sans flex flex-col items-center selection:bg-green-500/30">
      <div className="max-w-5xl w-full">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 text-xs font-semibold tracking-widest text-slate-400 uppercase">
            <span>The Problem</span>
            <span className="text-slate-500">→</span>
            <span className="text-green-400">The Fix</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Stop losing patients to practices that move <span className="italic font-light text-slate-400">faster</span>
          </h2>
          
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Healthcare businesses that rely on manual processes are losing patients to AI-enabled competitors. GrowthMonk closes that gap.
          </p>
        </div>

        {/* Split Cards Container */}
        <div className="relative grid md:grid-cols-2 gap-4 lg:gap-8 items-stretch">
          
          {/* VS Badge (Desktop) */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#030712] border border-slate-800 items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <span className="text-sm font-bold text-slate-500 italic">VS</span>
          </div>

          {/* Left Panel: The Old Way */}
          <div className="relative group rounded-3xl bg-gradient-to-b from-slate-900/80 to-[#0a0a0a] border border-red-900/20 p-8 md:p-10 flex flex-col gap-8 overflow-hidden shadow-2xl transition-all hover:border-red-900/40">
            {/* Subtle red glow top right */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-red-500/5 rounded-full blur-[100px] pointer-events-none transition-opacity opacity-50 group-hover:opacity-100" />
            
            <div className="space-y-2 relative z-10">
              <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
                The Old Way
              </h3>
              <p className="text-red-400/80 text-sm">Slow, manual, leaky funnel.</p>
            </div>

            <ul className="space-y-6 relative z-10 flex-1">
              {problems.map((problem, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center mt-0.5">
                    <X className="w-3.5 h-3.5 text-red-500" strokeWidth={3} />
                  </div>
                  <span className="text-slate-300 leading-relaxed">{problem}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Panel: The GrowthMonk Way */}
          <div className="relative group rounded-3xl bg-gradient-to-b from-[#06180c] to-[#0a0a0a] border border-green-500/20 p-8 md:p-10 flex flex-col gap-8 overflow-hidden shadow-[0_0_40px_rgba(34,197,94,0.05)] transition-all hover:border-green-500/40 hover:shadow-[0_0_60px_rgba(34,197,94,0.1)]">
            {/* Glowing green background effect */}
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-green-500/10 rounded-full blur-[120px] pointer-events-none transition-opacity opacity-70 group-hover:opacity-100" />
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-green-500/5 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="space-y-2 relative z-10">
              <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
                The GrowthMonk Way
              </h3>
              <p className="text-green-400/80 text-sm">Automated, instant, optimized.</p>
            </div>

            <ul className="space-y-6 relative z-10 flex-1">
              {solutions.map((solution, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5 shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                    <Check className="w-3.5 h-3.5 text-green-400" strokeWidth={3} />
                  </div>
                  <span className="text-white font-medium leading-relaxed">{solution}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}

export default SplitCards;
