import React from 'react';
import { Activity, Target, Zap, Clock } from 'lucide-react';

export function GlowCards() {
  const stats = [
    {
      value: "2-4×",
      label: "More AI search appearances for your business",
      icon: Activity
    },
    {
      value: "3×",
      label: "More leads discovered and captured",
      icon: Target
    },
    {
      value: "80%",
      label: "Of leads qualified automatically by AI",
      icon: Zap
    },
    {
      value: "24/7",
      label: "AI follow-up, never misses a lead",
      icon: Clock
    }
  ];

  return (
    <section className="py-24 px-6 md:px-12 w-full flex flex-col items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#030712' }}>
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl w-full z-10">
        <h2 className="text-sm font-bold tracking-widest uppercase text-green-500 mb-12 text-center">
          What GrowthMonk delivers for healthcare businesses
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className="relative group rounded-2xl bg-gray-900/40 border border-gray-800/50 p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:bg-gray-900/60"
            >
              {/* Bottom green accent line */}
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-green-500/30 group-hover:bg-green-500 transition-colors duration-300" />
              
              {/* Inner glow radial gradient behind the number */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-500/10 rounded-full blur-[40px] group-hover:bg-green-500/20 transition-all duration-500" />
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="mb-6 flex justify-between items-start">
                  <span className="text-6xl font-extrabold tracking-tight bg-gradient-to-br from-green-300 via-green-500 to-green-700 bg-clip-text text-transparent inline-block pb-2">
                    {stat.value}
                  </span>
                  <div className="p-2 rounded-lg bg-gray-900/80 border border-gray-800 text-green-500 opacity-50 group-hover:opacity-100 transition-opacity">
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
                
                <p className="text-gray-400 text-base font-medium leading-relaxed">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
