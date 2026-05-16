import React from "react";
import { ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

const pairs = [
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

export function BeforeAfter() {
  return (
    <div
      className="min-h-screen w-full py-24 px-6 md:px-12 flex flex-col items-center font-sans"
      style={{ backgroundColor: "#030712", color: "#f8fafc" }}
    >
      <div className="max-w-5xl w-full flex flex-col gap-16">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-widest text-slate-300 uppercase">
            <span className="text-red-400">THE PROBLEM</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span className="text-green-400">THE FIX</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white max-w-3xl">
            Stop losing patients to practices that move faster
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
            Healthcare businesses that rely on manual processes are losing
            patients to AI-enabled competitors. GrowthMonk closes that gap.
          </p>
        </div>

        {/* Timeline / Comparison List */}
        <div className="flex flex-col gap-6 relative">
          {/* Subtle vertical connecting line */}
          <div className="absolute left-1/2 top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent hidden md:block -translate-x-1/2" />

          {pairs.map((pair, idx) => (
            <div
              key={idx}
              className="flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-8 group relative"
            >
              {/* Problem (Left) */}
              <div className="flex-1 flex flex-col md:items-end text-left md:text-right relative">
                <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 md:pr-10 w-full transition-colors duration-300 hover:bg-red-500/10">
                  <div className="flex items-center md:flex-row-reverse gap-3 mb-2">
                    <AlertCircle className="w-5 h-5 text-red-500/70" />
                    <span className="text-sm font-medium text-red-500/70 uppercase tracking-wider">
                      Before
                    </span>
                  </div>
                  <p className="text-slate-300 text-lg leading-snug">
                    {pair.problem}
                  </p>
                </div>
              </div>

              {/* Transform Indicator (Center) */}
              <div className="flex justify-center md:absolute md:left-1/2 md:-translate-x-1/2 z-10 py-4 md:py-0">
                <div className="bg-[#030712] p-2 rounded-full border border-white/5 group-hover:border-green-500/30 transition-colors duration-500">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-[#22c55e] group-hover:bg-[#22c55e] group-hover:text-[#030712] transition-all duration-500 shadow-[0_0_15px_rgba(34,197,94,0.15)] group-hover:shadow-[0_0_25px_rgba(34,197,94,0.4)]">
                    <ArrowRight className="w-5 h-5 rotate-90 md:rotate-0" />
                  </div>
                </div>
              </div>

              {/* Solution (Right) */}
              <div className="flex-1 flex flex-col text-left relative">
                <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6 md:pl-10 w-full transition-colors duration-300 hover:bg-green-500/10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-[#22c55e]" />
                    <span className="text-sm font-medium text-[#22c55e] uppercase tracking-wider">
                      With GrowthMonk
                    </span>
                  </div>
                  <p className="text-white text-lg leading-snug font-medium">
                    {pair.solution}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
