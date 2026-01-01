import Image from "next/image";

export default function StorySection() {
  return (
    <section id="origin" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12">
        {/* Section header */}
        <div className="text-center mb-16 reveal">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#d4a012]" />
            <span className="font-sans text-[10px] tracking-[0.5em] uppercase text-[#d4a012]">The Origin</span>
            <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#d4a012]" />
          </div>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-light text-[#f5f0e6] tracking-wide">
            The Straw Hat
          </h2>
        </div>

        {/* Hat Image - Floating elegant style */}
        <div className="mb-24 reveal">
          <div className="relative max-w-md mx-auto">
            {/* Outer glow ring */}
            <div className="absolute -inset-8 rounded-full bg-gradient-to-b from-[#d4a012]/20 via-[#d4a012]/5 to-transparent blur-2xl" />
            
            {/* Inner glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#d4a012]/10 to-transparent blur-xl" />
            
            {/* Image */}
            <div className="relative rounded-3xl overflow-hidden border border-[#d4a012]/20 bg-[#0a0e14]/50 p-4">
              <Image
                src="/straw-hat.png"
                alt="The Legendary Straw Hat"
                width={400}
                height={400}
                className="w-full h-auto rounded-2xl drop-shadow-[0_20px_50px_rgba(212,160,18,0.3)]"
                priority
              />
            </div>
            
            {/* Caption */}
            <div className="text-center mt-10">
              <p className="font-display text-2xl italic text-[#d4a012]/80">
                The Symbol of Freedom
              </p>
            </div>
          </div>
        </div>

        {/* Big quote */}
        <div className="text-center mb-16 reveal">
          <p className="font-display text-3xl md:text-4xl lg:text-5xl italic text-[#f5f0e6]/90 leading-[1.3]">
            More than an accessory —
            <br />
            <span className="text-gradient">a legacy.</span>
          </p>
        </div>

        {/* Content cards */}
        <div className="space-y-4 reveal">
          {[
            {
              num: "I",
              title: "The Pirate King's Hat",
              text: "Long before Luffy wore it, the hat belonged to Gol D. Roger, the Pirate King."
            },
            {
              num: "II", 
              title: "Inherited Will",
              text: "Passed from Roger to Shanks, and from Shanks to Luffy — a dream of freedom across generations."
            },
            {
              num: "III",
              title: "The Secret",
              text: "Hidden deep within the World Government lies a frozen, giant Straw Hat."
            }
          ].map((item, i) => (
            <div key={i} className="group">
              <div className="flex gap-5 items-center p-5 rounded-2xl bg-[#0a0e14]/30 backdrop-blur-sm border border-[#d4a012]/5 hover:border-[#d4a012]/20 hover:bg-[#0a0e14]/50 transition-all duration-300">
                {/* Number */}
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#d4a012]/10 flex items-center justify-center border border-[#d4a012]/20">
                  <span className="font-display text-lg text-[#d4a012]">{item.num}</span>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-lg text-[#f5f0e6] group-hover:text-[#d4a012] transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-sans text-sm text-[#8a9bb0] mt-1 line-clamp-2">
                    {item.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
