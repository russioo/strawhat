import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left - Text */}
          <div className="animate-slide-up order-2 lg:order-1">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#d4a012] to-[#d4a012]" />
              <span className="font-sans text-[10px] tracking-[0.5em] uppercase text-[#d4a012]">
                A Shrine to the Legend
              </span>
            </div>
            
            <h1 className="font-display text-[clamp(4rem,12vw,9rem)] font-light leading-[0.9] tracking-[-0.02em] mb-8">
              <span className="block text-[#f5f0e6]">Strawhat</span>
              <span className="block text-gradient">Cult</span>
            </h1>
            
            <p className="font-display text-xl md:text-2xl lg:text-3xl italic text-[#8a9bb0] leading-relaxed max-w-lg mb-12">
              A Symbol of Freedom, Dreams, and Inherited Will
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a 
                href="#origin" 
                className="btn-glow group relative px-10 py-5 bg-gradient-to-r from-[#d4a012] to-[#b8900f] text-[#020408] text-[11px] tracking-[0.2em] uppercase font-semibold rounded-full overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(212,160,18,0.4)]"
              >
                <span className="relative z-10">Explore Origin</span>
              </a>
              <a 
                href="#generator" 
                className="group px-10 py-5 border border-[#d4a012]/30 text-[#d4a012] text-[11px] tracking-[0.2em] uppercase font-medium rounded-full hover:bg-[#d4a012]/10 hover:border-[#d4a012]/50 transition-all duration-500"
              >
                Generator
              </a>
            </div>
          </div>

          {/* Right - Featured Image */}
          <div className="animate-slide-up-delay order-1 lg:order-2">
            <div className="relative">
              {/* Decorative frame */}
              <div className="absolute -inset-4 border border-[#d4a012]/20 rounded-[2rem]" style={{ animation: 'border-dance 3s ease-in-out infinite' }} />
              
              {/* Glow behind image */}
              <div className="absolute -inset-8 bg-gradient-to-br from-[#d4a012]/30 via-[#1a3a5c]/20 to-transparent rounded-[3rem] blur-3xl opacity-50" />
              
              {/* Main image container */}
              <div className="relative aspect-[4/5] w-full max-w-lg mx-auto lg:ml-auto rounded-3xl overflow-hidden img-hover">
                {/* Image */}
                <Image
                  src="/shanks-giving-straw-hat-to-young-luffy-emotional-c.jpg"
                  alt="Shanks giving the Straw Hat to Luffy - The Promise"
                  fill
                  className="object-cover object-top"
                  priority
                />
                
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-[#020408]/20 to-transparent opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#020408]/50 via-transparent to-transparent" />
                
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-24 h-24">
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#d4a012]/50" />
                </div>
                <div className="absolute bottom-0 left-0 w-24 h-24">
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#d4a012]/50" />
                </div>
                
                {/* Caption overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                  <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-[#d4a012]/80 mb-2">
                    The Promise
                  </p>
                  <p className="font-display text-lg md:text-xl italic text-[#f5f0e6]/90">
                    &ldquo;Come back as a great pirate&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-slide-up-delay-3">
        <div className="flex flex-col items-center gap-3">
          <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-[#6b7280]">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-[#d4a012] to-transparent" />
        </div>
      </div>
      
      {/* Side accent */}
      <div className="hidden xl:block absolute right-12 top-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center gap-4">
          <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-[#d4a012]/50 to-transparent" />
          <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-[#6b7280]" style={{ writingMode: 'vertical-rl' }}>
            Est. 2024
          </span>
          <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-[#d4a012]/50 to-transparent" />
        </div>
      </div>
    </section>
  );
}
