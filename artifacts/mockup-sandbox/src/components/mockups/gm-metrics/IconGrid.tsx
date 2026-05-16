import React from 'react';
import { Search, Users, Bot, Clock } from 'lucide-react';

export function IconGrid() {
  const stats = [
    {
      icon: Search,
      value: "2-4×",
      label: "More AI search appearances for your business"
    },
    {
      icon: Users,
      value: "3×",
      label: "More leads discovered and captured"
    },
    {
      icon: Bot,
      value: "80%",
      label: "Of leads qualified automatically by AI"
    },
    {
      icon: Clock,
      value: "24/7",
      label: "AI follow-up, never misses a lead"
    }
  ];

  return (
    <section className="w-full py-24 bg-[#030712] font-sans">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-white/90">
            What GrowthMonk delivers for healthcare businesses
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div 
                key={i}
                className="relative group p-6 sm:p-8 rounded-2xl bg-gray-900/40 border border-gray-800/50 hover:bg-gray-900/60 hover:border-gray-700/50 transition-all duration-300 flex flex-col"
              >
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center mb-8 text-[#22c55e] group-hover:bg-[#22c55e]/20 group-hover:border-[#22c55e]/30 transition-all duration-300">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
                </div>
                <div className="text-4xl sm:text-5xl font-semibold text-[#22c55e] mb-4 tracking-tight">
                  {stat.value}
                </div>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default IconGrid;
