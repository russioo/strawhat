"use client";

import { useState } from "react";

const CA = "9Bhbkx3sBxGgjkZsMSnmjamXhwGF9oeNH6WUK79c1hSK";
const COMMUNITY_URL = "https://x.com/i/communities/2006180410724675850";
const X_ACCOUNT_URL = "https://x.com/strawhatusd1";

export default function CommunitySection() {
  const [copied, setCopied] = useState(false);

  const copyCA = async () => {
    await navigator.clipboard.writeText(CA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="community" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12 reveal">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#d4a012]" />
            <span className="font-sans text-[10px] tracking-[0.5em] uppercase text-[#d4a012]">Unite</span>
            <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#d4a012]" />
          </div>
          <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-light text-[#f5f0e6] tracking-wide mb-4">
            Join the <span className="text-gradient">Crew</span>
          </h2>
        </div>

        {/* CA Box - Big and visible */}
        <div className="mb-12 reveal">
          <div className="p-6 md:p-8 rounded-2xl bg-[#0a0e14]/50 backdrop-blur-sm border border-[#d4a012]/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#d4a012] mb-2">Contract Address</p>
                <p className="font-mono text-sm md:text-base text-[#f5f0e6] break-all">
                  {CA}
                </p>
              </div>
              <button
                onClick={copyCA}
                className={`flex-shrink-0 flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 ${
                  copied 
                    ? "bg-green-500/20 border border-green-500/30 text-green-400" 
                    : "bg-[#d4a012]/10 border border-[#d4a012]/20 text-[#d4a012] hover:bg-[#d4a012]/20 hover:border-[#d4a012]/40"
                }`}
              >
                {copied ? (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-sans text-sm font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                    </svg>
                    <span className="font-sans text-sm font-medium">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-xl mx-auto reveal">
          {/* Community */}
          <div className="group text-center p-8 rounded-2xl bg-[#0a0e14]/30 backdrop-blur-sm border border-[#d4a012]/5 hover:border-[#d4a012]/25 transition-all duration-500">
            <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-gradient-to-br from-[#d4a012]/15 to-transparent flex items-center justify-center border border-[#d4a012]/10 group-hover:border-[#d4a012]/30 transition-all">
              <svg className="w-7 h-7 text-[#d4a012]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#8a9bb0] mb-4">X Community</p>
            <a
              href={COMMUNITY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glow inline-block px-8 py-3 font-sans text-[10px] tracking-[0.15em] uppercase bg-gradient-to-r from-[#d4a012] to-[#b8900f] text-[#020408] font-medium rounded-full transition-all duration-300 hover:shadow-[0_0_25px_rgba(212,160,18,0.3)]"
            >
              Join Now
            </a>
          </div>

          {/* Twitter/X */}
          <div className="group text-center p-8 rounded-2xl bg-[#0a0e14]/30 backdrop-blur-sm border border-[#d4a012]/5 hover:border-[#d4a012]/25 transition-all duration-500">
            <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-gradient-to-br from-[#d4a012]/15 to-transparent flex items-center justify-center border border-[#d4a012]/10 group-hover:border-[#d4a012]/30 transition-all">
              <svg className="w-6 h-6 text-[#d4a012]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </div>
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#8a9bb0] mb-4">Follow Us</p>
            <a
              href={X_ACCOUNT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 font-sans text-[10px] tracking-[0.15em] uppercase border border-[#d4a012]/25 text-[#d4a012] rounded-full hover:bg-[#d4a012] hover:text-[#020408] transition-all duration-300"
            >
              Follow
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
