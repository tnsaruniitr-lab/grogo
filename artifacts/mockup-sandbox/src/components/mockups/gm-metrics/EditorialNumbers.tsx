import React from "react";

export function EditorialNumbers() {
  const stats = [
    {
      value: "2-4×",
      label: "More AI search appearances for your business",
    },
    {
      value: "3×",
      label: "More leads discovered and captured",
    },
    {
      value: "80%",
      label: "Of leads qualified automatically by AI",
    },
    {
      value: "24/7",
      label: "AI follow-up, never misses a lead",
    },
  ];

  return (
    <section 
      className="w-full min-h-[60vh] flex flex-col justify-center items-center px-6 py-24 md:py-32"
      style={{ backgroundColor: "#030712" }}
    >
      <div className="max-w-7xl w-full mx-auto flex flex-col gap-20">
        <header className="flex justify-center text-center">
          <h2 className="text-gray-400 uppercase tracking-widest text-sm font-semibold max-w-lg leading-relaxed">
            What GrowthMonk delivers for healthcare businesses
          </h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-0 divide-y md:divide-y-0 lg:divide-x divide-gray-800/50">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className="flex flex-col items-center text-center pt-12 lg:pt-0 lg:px-12 group"
            >
              <div 
                className="text-7xl md:text-8xl lg:text-[120px] leading-none font-light tracking-tighter mb-6 bg-clip-text text-transparent transition-all duration-700"
                style={{
                  backgroundImage: "linear-gradient(180deg, #f8fafc 0%, #22c55e 150%)",
                }}
              >
                {stat.value}
              </div>
              <p className="text-gray-400 text-sm md:text-base max-w-[200px] leading-relaxed font-light">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default EditorialNumbers;
