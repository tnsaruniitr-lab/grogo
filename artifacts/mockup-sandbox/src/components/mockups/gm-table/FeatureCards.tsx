import React from 'react';
import { Search, MessageCircle, Bot, Globe, Calendar, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Search,
    problem: "Invisible in AI search (ChatGPT, Perplexity, AI Overviews)",
    solution: "Optimised for AI search engines — patients find you first"
  },
  {
    icon: MessageCircle,
    problem: "Leads from WhatsApp & Instagram go unanswered for hours",
    solution: "AI responds to every message in under 2 minutes, 24/7"
  },
  {
    icon: Bot,
    problem: "Staff spend hours qualifying the same basic enquiries",
    solution: "AI qualifies, filters, and routes leads automatically"
  },
  {
    icon: Globe,
    problem: "Language barriers losing you multilingual patients",
    solution: "Conversations in English, German, Turkish, Arabic and more"
  },
  {
    icon: Calendar,
    problem: "Leads captured but never followed up on consistently",
    solution: "AI books appointments and callbacks without human input"
  }
];

export function FeatureCards() {
  return (
    <section className="min-h-screen py-24 px-6 flex flex-col items-center justify-center font-sans" style={{ backgroundColor: '#030712' }}>
      <div className="max-w-5xl w-full">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="text-xs font-semibold tracking-wider text-gray-400">THE PROBLEM</span>
            <ArrowRight className="w-3 h-3 text-gray-500" />
            <span className="text-xs font-semibold tracking-wider" style={{ color: '#22c55e' }}>THE FIX</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Stop losing patients to practices that move faster
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Healthcare businesses that rely on manual processes are losing patients to AI-enabled competitors. GrowthMonk closes that gap.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const isLast = index === features.length - 1;
            const Icon = feature.icon;
            
            return (
              <div 
                key={index}
                className={`group relative flex flex-col p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden ${isLast ? 'md:col-span-2 md:w-1/2 md:mx-auto' : ''}`}
                style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)'
                }}
              >
                {/* Accent top border */}
                <div 
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: '#22c55e' }}
                />

                <div className="flex items-start gap-4 mb-6">
                  <div 
                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 border border-white/10"
                  >
                    <Icon className="w-6 h-6" style={{ color: '#22c55e' }} />
                  </div>
                  <div className="pt-2">
                    <p className="text-sm font-medium text-gray-500 line-through decoration-gray-600/50 decoration-2">
                      {feature.problem}
                    </p>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowRight className="w-4 h-4" style={{ color: '#22c55e' }} />
                    <span className="text-xs font-semibold tracking-wider" style={{ color: '#22c55e' }}>THE SOLUTION</span>
                  </div>
                  <p className="text-xl font-semibold text-white leading-snug">
                    {feature.solution}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeatureCards;