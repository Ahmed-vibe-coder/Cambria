import React from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PageHeader } from "@/components/ui/page-header";
import { DoubleRingDivider } from "@/components/ui/double-ring-divider";
import { MajorsInteractiveClient } from "@/components/majors/majors-interactive-client";
import { Award, BookOpen, GraduationCap, ShieldCheck, Sparkles, Building } from "lucide-react";

export const metadata = {
  title: "Academic Majors & Disciplines | Cambria International College",
  description:
    "Explore 45+ accredited professional majors across 7 faculties at Cambria International College, London. Designed for executives and working adults with cryptographic QR verification.",
};

export default function MajorsPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* 1. EDITORIAL PAGE HEADER */}
      <PageHeader
        eyebrow="Academic Disciplines & Specializations"
        title="Curricular Majors & Faculties"
        description="A distinguished portfolio of 45+ specialized academic disciplines across business administration, applied technology, healthcare, law, architecture, and social sciences."
        variant="navy"
      />

      {/* 2. INSTITUTIONAL INTRODUCTION & HIGHLIGHT STRIP */}
      <section className="bg-white border-b border-slate-200 py-12 md:py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C8A84E] block">
                Academic Rigor & Industry Alignment
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cambria-navy tracking-tight leading-tight">
                Disciplines Designed for Practicing Executives & Working Adults
              </h2>
              <DoubleRingDivider />
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed pt-1">
                Cambria International College delivers a wide variety of majors that are specifically designed
                for experienced professionals, senior administrators, and working adults. These majors cover
                virtually every industry—bridging academic depth with real-world executive decision-making.
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Whether integrated into our <strong className="text-cambria-navy">Professional Master&apos;s</strong> (Level 7)
                or <strong className="text-cambria-navy">Professional Diploma</strong> qualifications, every major
                is governed by designated academic boards and concludes with verifiable cryptographic credentials
                resolvable internationally.
              </p>
            </div>

            {/* Right Metric Cards */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-[8px] p-5 space-y-2">
                <div className="w-10 h-10 rounded-[6px] bg-cambria-soft text-cambria-navy flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-cambria-academic" />
                </div>
                <div className="font-serif text-3xl font-bold text-cambria-navy">45+</div>
                <div className="text-xs font-semibold text-slate-700">Disciplinary Majors</div>
                <div className="text-[11px] text-slate-500">
                  Covering commerce, engineering, health, law & sciences
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-[8px] p-5 space-y-2">
                <div className="w-10 h-10 rounded-[6px] bg-cambria-soft text-cambria-navy flex items-center justify-center">
                  <Building className="w-5 h-5 text-cambria-academic" />
                </div>
                <div className="font-serif text-3xl font-bold text-cambria-navy">7</div>
                <div className="text-xs font-semibold text-slate-700">Academic Faculties</div>
                <div className="text-[11px] text-slate-500">
                  Governed by specialized academic review boards
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-[8px] p-5 space-y-2">
                <div className="w-10 h-10 rounded-[6px] bg-cambria-soft text-cambria-navy flex items-center justify-center">
                  <Award className="w-5 h-5 text-[#C8A84E]" />
                </div>
                <div className="font-serif text-3xl font-bold text-cambria-navy">100%</div>
                <div className="text-xs font-semibold text-slate-700">Verifiable Standards</div>
                <div className="text-[11px] text-slate-500">
                  Instant QR lookup & cryptographic verification
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-[8px] p-5 space-y-2">
                <div className="w-10 h-10 rounded-[6px] bg-cambria-soft text-cambria-navy flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="font-serif text-3xl font-bold text-cambria-navy">RPL</div>
                <div className="text-xs font-semibold text-slate-700">Prior Experience</div>
                <div className="text-[11px] text-slate-500">
                  Credit recognition for executive career achievements
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. INTERACTIVE SEARCH, FILTER & CATALOG */}
      <MajorsInteractiveClient />
    </div>
  );
}
