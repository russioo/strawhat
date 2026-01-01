"use client";

import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import StorySection from "@/components/StorySection";
import MeaningSection from "@/components/MeaningSection";
import GeneratorSection from "@/components/GeneratorSection";
import CommunitySection from "@/components/CommunitySection";
import Footer from "@/components/Footer";

export default function Home() {
  useEffect(() => {
    // Intersection Observer for reveal animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { 
        threshold: 0.05,
        rootMargin: "0px 0px -10% 0px"
      }
    );

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const sections = document.querySelectorAll(".reveal");
      sections.forEach((section) => observer.observe(section));
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <main className="min-h-screen overflow-hidden relative">
      {/* GLOBAL Animated Background - Same as Hero */}
      <div className="fixed inset-0 z-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#020408] via-[#0a1020] to-[#0f1a2a]" />
        
        {/* Animated floating orbs - visible throughout */}
        <div className="absolute top-[20%] right-[20%] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-[#d4a012]/15 to-transparent blur-[150px] animate-float-1 animate-pulse-glow" />
        <div className="absolute top-[60%] left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#1a3a5c]/25 to-transparent blur-[130px] animate-float-2" />
        <div className="absolute top-[40%] right-[40%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-[#d4a012]/8 to-transparent blur-[120px] animate-float-3" />
        <div className="absolute bottom-[10%] right-[15%] w-[400px] h-[400px] rounded-full bg-gradient-to-tl from-[#1a3a5c]/20 to-transparent blur-[100px] animate-float-1" style={{ animationDelay: '-5s' }} />
        
        {/* Subtle radial gradient overlay */}
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse 100% 60% at 50% 0%, rgba(212, 160, 18, 0.03) 0%, transparent 50%),
            radial-gradient(ellipse 80% 50% at 100% 50%, rgba(26, 58, 92, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 80% 50% at 0% 100%, rgba(26, 58, 92, 0.06) 0%, transparent 50%)
          `
        }} />
        
        {/* Noise texture */}
        <div className="absolute inset-0 bg-noise opacity-[0.015]" />
        
        {/* Very subtle grid */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `
            linear-gradient(rgba(212, 160, 18, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212, 160, 18, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px'
        }} />
      </div>
      
      {/* Content layer */}
      <div className="relative z-10">
        <Navigation />
        <HeroSection />
        <GeneratorSection />
        <StorySection />
        <MeaningSection />
        <CommunitySection />
        <Footer />
      </div>
    </main>
  );
}
