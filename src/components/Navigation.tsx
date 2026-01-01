"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? "glass py-4" 
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
        <a href="#" className="group flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden transition-transform duration-300 group-hover:scale-110">
            <Image
              src="/logo.png"
              alt="Strawhat Cult"
              fill
              className="object-cover"
            />
          </div>
          <span className="font-display text-xl tracking-[0.05em] text-[#f5f0e6] group-hover:text-[#d4a012] transition-colors duration-300">
            Strawhat Cult
          </span>
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {["Origin", "Meaning", "Generator", "Community"].map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                className="relative font-sans text-[11px] tracking-[0.15em] uppercase text-[#8a9bb0] hover:text-[#d4a012] transition-colors duration-300 py-2"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#d4a012] transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile menu button */}
        <button className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5">
          <span className="w-5 h-[1px] bg-[#f5f0e6]" />
          <span className="w-5 h-[1px] bg-[#f5f0e6]" />
        </button>
      </div>
    </nav>
  );
}
