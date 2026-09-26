import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { CambriaSeal } from "@/components/ui/cambria-seal";
import { DoubleRingDivider } from "@/components/ui/double-ring-divider";
import { GoldStar } from "@/components/ui/gold-star";
import { TaglineRotator } from "@/components/ui/tagline-rotator";
import { ValueStrip } from "@/components/ui/value-strip";
import { EditorialWelcomeCard } from "@/components/ui/editorial-welcome-card";
import { InstitutionalStatBand } from "@/components/ui/institutional-stat-band";
import { AchievementVisual } from "@/components/ui/achievement-visual";
import { QuoteSection } from "@/components/ui/quote-card";
import { getPrograms } from "@/lib/db";
import {
  ShieldCheck,
  Award,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Search,
  Building2,
  GraduationCap,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const programs = await getPrograms();
  const highlightedPrograms = programs.slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* 1. EDITORIAL HERO SECTION */}
      <section className="relative bg-cambria-navy text-white pt-20 pb-24 md:pt-28 md:pb-32 overflow-hidden border-b border-cambria-deep">
        {/* Subtle Watermark Seal */}
        <div
          className="absolute right-[-10%] top-[10%] pointer-events-none opacity-[0.035] select-none transform rotate-6"
          aria-hidden="true"
        >
          <CambriaSeal size={650} variant="white" />
        </div>

        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Narrative */}
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[4px] bg-white/5 border border-white/10 text-xs font-semibold tracking-widest uppercase text-[#C8A84E]">
                <span>Transnational Higher Education</span>
                <span className="text-[#C8A84E]">★</span>
                <span>London Academic Liaison</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.08] tracking-tight">
                Academic Rigor. <br />
                <span className="italic font-normal text-slate-200">
                  Global Distinction.
                </span>{" "}
                <br />
                Verifiable Excellence.
              </h1>

              <DoubleRingDivider variant="dark" />

              {/* Subhead with Restrained Crossfade Tagline Rotation */}
              <div className="space-y-2 max-w-2xl">
                <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed">
                  Cambria International College provides specialized executive programs,
                  professional diplomas, and cryptographic credentialing tailored for modern
                  organizational leaders and global scholars.
                </p>
                <div className="text-xs sm:text-sm font-medium text-[#C8A84E] tracking-wider uppercase flex items-center gap-2 pt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8A84E] animate-pulse shrink-0" />
                  <TaglineRotator />
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4 items-center">
                <Link href="/programs">
                  <Button
                    size="lg"
                    className="bg-[#C8A84E] text-cambria-deep hover:bg-[#B89840] font-semibold gap-2 shadow-subtle group"
                  >
                    Explore Academic Programs
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/verify">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/30 text-white bg-white/5 hover:bg-white/10 hover:border-white gap-2 font-medium"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#C8A84E]" />
                    Verify a Credential
                  </Button>
                </Link>
              </div>

              {/* Institutional Assurance Pillars */}
              <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-white/10 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <Award className="w-4 h-4 text-[#C8A84E] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white font-medium">Bespoke Executive Curricula</strong>
                    Designed for senior practitioners.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#C8A84E] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white font-medium">Tamper-Proof Verification</strong>
                    Real-time cryptographic QR validation.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Building2 className="w-4 h-4 text-[#C8A84E] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white font-medium">Transnational Standards</strong>
                    Curricula aligned with global benchmarks.
                  </div>
                </div>
              </div>
            </div>

            {/* Right Emblem Vignette */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative p-6 sm:p-8 rounded-full border border-white/15 bg-white/[0.02] backdrop-blur-sm">
                <div className="absolute inset-0 rounded-full border border-[#C8A84E]/30 animate-pulse" />
                <div className="relative p-6 rounded-full border-2 border-dashed border-white/20 bg-cambria-deep/80 shadow-2xl flex flex-col items-center justify-center text-center">
                  <CambriaSeal size={180} variant="white" priority />
                  <div className="mt-4 pt-3 border-t border-white/10 text-center">
                    <span className="block font-serif text-sm tracking-wider uppercase text-white font-semibold">
                      Cambria Seal
                    </span>
                    <span className="text-[11px] text-[#C8A84E] tracking-widest uppercase">
                      Official Source of Truth
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. THREE-POINT VALUE STRIP (Under-Fold Benefit Panels) */}
      <ValueStrip />

      {/* 3. EDITORIAL WELCOME OVERLAP SECTION */}
      <Section variant="offwhite">
        <Container>
          <EditorialWelcomeCard />
        </Container>
      </Section>

      {/* 4. ACADEMIC PROGRAMS CATALOG (Locked Editorial Numbered List) */}
      <Section variant="white" watermark>
        <Container>
          <div className="max-w-2xl mb-12">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-cambria-academic block mb-2">
              Academic Curricula
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-cambria-navy tracking-tight">
              Featured Programs of Study
            </h2>
            <DoubleRingDivider />
            <p className="text-slate-600 text-base leading-relaxed">
              Our pedagogical philosophy integrates academic governance, digital transformation,
              and executive management into disciplined modular units.
            </p>
          </div>

          {/* Numbered Editorial Catalog */}
          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {highlightedPrograms.map((prog, idx) => (
              <div
                key={prog.id}
                className="py-8 group transition-colors hover:bg-slate-50/80 px-4 -mx-4 rounded-[4px]"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline">
                  {/* Serial Number */}
                  <div className="md:col-span-1">
                    <span className="font-serif text-2xl md:text-3xl text-[#C8A84E] font-bold">
                      {String(idx + 1).padStart(2, "0")}.
                    </span>
                  </div>

                  {/* Title & Degree Badge */}
                  <div className="md:col-span-7 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-[4px] bg-cambria-soft text-cambria-navy border border-blue-200 uppercase tracking-wider">
                        {prog.degree_level.replace("_", " ")}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {prog.code}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-cambria-navy group-hover:text-cambria-academic transition-colors">
                      {prog.name}
                    </h3>

                    {prog.name_ar && (
                      <p className="text-sm font-semibold text-slate-500 font-arabic leading-relaxed" dir="rtl">
                        {prog.name_ar}
                      </p>
                    )}

                    <p className="text-sm text-slate-600 line-clamp-2 pt-1 leading-relaxed">
                      {prog.description}
                    </p>
                  </div>

                  {/* Metrics & Duration */}
                  <div className="md:col-span-2 text-sm text-slate-500 space-y-1">
                    <div>
                      <span className="text-slate-400 block text-xs">Duration:</span>
                      <span className="font-medium text-slate-700">{prog.duration}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-xs">Credits:</span>
                      <span className="font-medium text-slate-700">{prog.credits} Academic Credits</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="md:col-span-2 flex justify-start md:justify-end">
                    <Link href={`/programs#${prog.code.toLowerCase()}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="group-hover:border-cambria-navy group-hover:bg-cambria-navy group-hover:text-white transition-all gap-1.5"
                      >
                        Syllabus Details
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-between items-center flex-wrap gap-4">
            <p className="text-xs text-slate-500">
              Showing {highlightedPrograms.length} of {programs.length} accredited program frameworks.
            </p>
            <Link href="/programs">
              <Button variant="ghost" className="font-semibold text-cambria-academic hover:bg-cambria-soft gap-2">
                View Complete Programs Catalog
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Container>
      </Section>

      {/* 5. DARK "WHY CAMBRIA" STAT BAND (Full-Width Benchmark Metrics) */}
      <InstitutionalStatBand />

      {/* 6. ACHIEVEMENTS & CRYPTOGRAPHIC CREDENTIAL STANDARD */}
      <Section variant="navy" className="text-white relative overflow-hidden">
        <div
          className="absolute -right-24 -bottom-24 pointer-events-none opacity-[0.035]"
          aria-hidden="true"
        >
          <CambriaSeal size={550} variant="white" />
        </div>

        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C8A84E] block">
                Verification Ledger Architecture
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight leading-tight">
                An Educational Standard Grounded in Cryptographic Proof
              </h2>
              <DoubleRingDivider variant="dark" />
              <p className="text-slate-300 text-base leading-relaxed font-light">
                In an era of proliferating unverified digital credentials, Cambria International College
                maintains an immutable, centralized verification ledger. Every graduate&apos;s achievement
                is permanently stored and provable through our sovereign verification registry.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#C8A84E] shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-200">
                    <strong className="text-white">Unified Credential Identity:</strong> Certificates and Student Cards share a single
                    verification token and sequential serial number.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#C8A84E] shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-200">
                    <strong className="text-white">Bilingual OpenType Rendering:</strong> Full native Arabic (Cairo / Noto Naskh)
                    and English typography shaped with vector precision.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#C8A84E] shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-200">
                    <strong className="text-white">Complete Audit Trail:</strong> Every issuance, state change, and regeneration
                    is recorded in an immutable institutional ledger.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link href="/verify">
                  <Button className="bg-[#C8A84E] text-cambria-deep hover:bg-[#B89840] font-semibold gap-2 shadow-subtle group">
                    <Search className="w-4 h-4" />
                    Open Verification Search
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    variant="outline"
                    className="border-white/30 text-white bg-white/5 hover:bg-white/10 hover:border-white font-medium"
                  >
                    Read Governance Charter
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Circular Composite Achievement Visual */}
            <div className="lg:col-span-5 flex justify-center">
              <AchievementVisual />
            </div>
          </div>
        </Container>
      </Section>

      {/* 7. INSTITUTIONAL VOICES & ETHOS (Quote Cards) */}
      <QuoteSection />

      {/* 8. BOTTOM CALLOUT / ADMISSION INQUIRY */}
      <section className="bg-cambria-deep text-white py-14 border-t border-white/10">
        <Container>
          <div className="bg-white/5 border border-white/10 rounded-[6px] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 max-w-xl">
              <h3 className="font-serif text-2xl font-semibold text-white">
                Begin Your Executive Study with Cambria
              </h3>
              <p className="text-sm text-slate-300">
                Admissions for upcoming cohort intakes are managed directly through the Registrar Liaison Office.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/contact">
                <Button className="bg-[#C8A84E] text-cambria-deep hover:bg-[#B89840] font-semibold text-xs px-5 py-2.5">
                  Registrar Direct Inquiry
                </Button>
              </Link>
              <Link href="/programs">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 text-xs px-5 py-2.5">
                  View Curricula
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
