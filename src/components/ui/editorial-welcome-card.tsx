import React from "react";
import Link from "next/link";
import { CambriaSeal } from "@/components/ui/cambria-seal";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Award } from "lucide-react";

interface EditorialWelcomeCardProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  leadParagraph?: string;
  bodyParagraph?: string;
  ctaText?: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
}

export const EditorialWelcomeCard: React.FC<EditorialWelcomeCardProps> = ({
  eyebrow = "INSTITUTIONAL WELCOME",
  title = "A Tradition of Intellectual Rigor & Transnational Stewardship",
  subtitle = "Office of the Dean & Academic Governance",
  leadParagraph = "Welcome to Cambria International College. Established to bridge transnational academic excellence with modern verifiable credential integrity, our institution prepares senior executives, educational leaders, and policy directors for meaningful global stewardship.",
  bodyParagraph = "Every program offered at Cambria is calibrated against rigorous quality benchmarks, combining deep theoretical frameworks with immediately applicable strategic competencies. Through our cryptographic verification ledger, the credentials earned by our scholars remain permanently protected against fraud and instantly verifiable worldwide.",
  ctaText = "Explore Academic Curricula",
  ctaHref = "/programs",
  secondaryCtaText = "Institutional Ethos",
  secondaryCtaHref = "/about",
}) => {
  return (
    <div className="relative py-8 md:py-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 items-center">
        {/* Left Visual: Concentric Circular Medallion Frame */}
        <div className="lg:col-span-5 flex justify-center relative z-0">
          <div className="relative p-6 sm:p-8 rounded-full border border-slate-200 bg-white shadow-card">
            {/* Subtle background seal watermark inside ring */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]"
              aria-hidden="true"
            >
              <CambriaSeal size={320} variant="navy" />
            </div>

            {/* Inner Concentric Circle with Gold Ring Accent */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-2 border-dashed border-[#C8A84E]/40 bg-cambria-offwhite flex flex-col items-center justify-center p-6 text-center shadow-inner">
              <CambriaSeal size={130} variant="navy" priority />

              <div className="mt-3 pt-2.5 border-t border-slate-200 w-full text-center">
                <span className="block font-serif text-sm font-bold text-cambria-navy uppercase tracking-wider">
                  Cambria College
                </span>
                <span className="text-[10px] text-[#C8A84E] font-semibold tracking-widest uppercase">
                  Institutional Seal
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Overlapping Editorial Card with Gold Left Accent */}
        <div className="lg:col-span-7 lg:-ml-10 relative z-10">
          <div className="bg-white border border-slate-200/90 rounded-[6px] shadow-card p-7 sm:p-10 border-l-4 border-l-[#C8A84E] space-y-5">
            {/* Eyebrow & Subtitle */}
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-[0.22em] font-semibold text-[#C8A84E] block">
                {eyebrow}
              </span>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium block">
                {subtitle}
              </span>
            </div>

            {/* Display Heading */}
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-bold text-cambria-navy tracking-tight leading-tight">
              {title}
            </h2>

            {/* Paragraphs */}
            <div className="space-y-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              <p className="font-medium text-slate-700">{leadParagraph}</p>
              <p className="text-sm leading-relaxed text-slate-500">{bodyParagraph}</p>
            </div>

            {/* Badges / Commitments */}
            <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-600 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#C8A84E]" />
                <span className="font-medium">100% On-Ledger Verification</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-cambria-academic" />
                <span className="font-medium">Chartered Executive Curricula</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link href={ctaHref}>
                <Button className="bg-cambria-navy hover:bg-cambria-deep text-white font-medium text-xs px-5 py-2.5 rounded-[4px] gap-2 shadow-subtle group">
                  {ctaText}
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href={secondaryCtaHref}>
                <Button
                  variant="outline"
                  className="border-slate-300 hover:border-cambria-navy text-cambria-navy font-medium text-xs px-5 py-2.5 rounded-[4px]"
                >
                  {secondaryCtaText}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
