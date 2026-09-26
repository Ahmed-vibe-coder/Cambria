import React from "react";
import { CambriaSeal } from "@/components/ui/cambria-seal";
import { GoldStar } from "@/components/ui/gold-star";
import { ShieldCheck, Award, FileCheck2 } from "lucide-react";

export const AchievementVisual: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer Glow Ring */}
      <div className="relative p-6 sm:p-8 rounded-full border border-white/15 bg-white/[0.02] backdrop-blur-sm shadow-2xl">
        {/* Subtle Animated Gold Border Ring */}
        <div className="absolute inset-0 rounded-full border border-[#C8A84E]/30 animate-pulse pointer-events-none" />

        {/* Small Celestial Star Accent on Upper Edge (1 o'clock) */}
        <div className="absolute top-2 right-6 sm:right-8 z-20 bg-cambria-deep px-2 py-1 rounded-full border border-[#C8A84E]/50 flex items-center gap-1 shadow-md">
          <GoldStar size={12} />
          <span className="text-[10px] font-semibold tracking-widest uppercase text-[#C8A84E]">
            Chartered
          </span>
        </div>

        {/* Middle Concentric Ring */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border-2 border-dashed border-white/20 bg-cambria-deep/90 shadow-2xl flex flex-col items-center justify-center text-center p-6">
          {/* Inner Official Cambria Seal */}
          <CambriaSeal size={150} variant="white" priority />

          {/* Sub-text inside medallion */}
          <div className="mt-3 pt-2.5 border-t border-white/10 w-full text-center">
            <span className="block font-serif text-sm tracking-wider uppercase text-white font-bold">
              Cambria Academic Ledger
            </span>
            <span className="text-[11px] text-[#C8A84E] tracking-widest uppercase font-medium">
              Official Cryptographic Standard
            </span>
          </div>
        </div>
      </div>

      {/* Floating Milestone Badges Flanking the Circle */}
      <div className="hidden sm:flex absolute -left-4 top-1/4 bg-white/10 backdrop-blur-md border border-white/15 p-3 rounded-[6px] shadow-lg items-center gap-2.5 text-xs text-white max-w-[190px]">
        <ShieldCheck className="w-5 h-5 text-[#C8A84E] shrink-0" />
        <span className="leading-snug">Tamper-Evident SHA-256 Hashes</span>
      </div>

      <div className="hidden sm:flex absolute -right-4 bottom-1/4 bg-white/10 backdrop-blur-md border border-white/15 p-3 rounded-[6px] shadow-lg items-center gap-2.5 text-xs text-white max-w-[190px]">
        <Award className="w-5 h-5 text-[#C8A84E] shrink-0" />
        <span className="leading-snug">Bilingual Transcripts & Certificates</span>
      </div>
    </div>
  );
};
