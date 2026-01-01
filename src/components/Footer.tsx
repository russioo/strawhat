import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative py-8 border-t border-[#d4a012]/5">
      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image
                src="/logo.png"
                alt="Strawhat Cult"
                fill
                className="object-cover"
              />
            </div>
            <span className="font-display text-lg text-[#f5f0e6]">Strawhat Cult</span>
          </div>
          
          <div className="flex items-center gap-6 text-[10px] tracking-[0.1em] text-[#6b7280]">
            <span>Inspired by One Piece</span>
            <span>© 2025</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
