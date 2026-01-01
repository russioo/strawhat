const meanings = [
  {
    title: "Freedom",
    text: "The boundless sea calls to those who refuse chains. To wear the hat is to choose your own path.",
    icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064",
  },
  {
    title: "Dreams",
    text: "Every great journey begins with a dream too vast for others to understand.",
    icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  },
  {
    title: "Will",
    text: "What cannot be completed in one lifetime is passed to the next. The will of D. lives on.",
    icon: "M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7",
  },
  {
    title: "Dawn",
    text: "A world awaits its true sunrise. The hat is the promise of a new era.",
    icon: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z",
  },
];

export default function MeaningSection() {
  return (
    <section id="meaning" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-20 reveal">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#d4a012]" />
            <span className="font-sans text-[10px] tracking-[0.5em] uppercase text-[#d4a012]">Symbolism</span>
            <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#d4a012]" />
          </div>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-light text-[#f5f0e6] tracking-wide">
            What It <span className="text-gradient">Represents</span>
          </h2>
        </div>

        {/* Horizontal scroll-style cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 reveal">
          {meanings.map((item, i) => (
            <div
              key={item.title}
              className="group relative p-6 md:p-8 rounded-2xl bg-[#0a0e14]/30 backdrop-blur-sm border border-[#d4a012]/5 hover:border-[#d4a012]/25 transition-all duration-500 hover:bg-[#0a0e14]/50"
            >
              {/* Number watermark */}
              <span className="absolute top-4 right-4 font-display text-5xl md:text-6xl text-[#d4a012]/[0.04] select-none">
                0{i + 1}
              </span>

              {/* Icon */}
              <div className="w-12 h-12 md:w-14 md:h-14 mb-6 rounded-xl bg-gradient-to-br from-[#d4a012]/15 to-transparent flex items-center justify-center border border-[#d4a012]/10 group-hover:border-[#d4a012]/30 transition-all duration-300">
                <svg className="w-6 h-6 md:w-7 md:h-7 text-[#d4a012]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
              </div>

              {/* Content */}
              <h3 className="font-display text-xl md:text-2xl text-[#f5f0e6] mb-3 group-hover:text-[#d4a012] transition-colors duration-300">
                {item.title}
              </h3>
              <p className="font-sans text-[13px] md:text-[14px] leading-[1.7] text-[#8a9bb0]/80">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
