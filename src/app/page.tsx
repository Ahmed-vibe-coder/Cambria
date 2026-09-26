import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { CambriaSeal } from "@/components/ui/cambria-seal";
import { DoubleRingDivider } from "@/components/ui/double-ring-divider";
import { GoldStar } from "@/components/ui/gold-star";
import { getPrograms } from "@/lib/db";
import {
  ShieldCheck,
  Award,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileCheck,
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
      <section className="relative bg-cambria-navy text-white pt-20 pb-28 md:pt-28 md:pb-36 overflow-hidden border-b border-cambria-deep">
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

              <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl">
                Cambria International College provides specialized executive programs,
                professional diplomas, and cryptographic credentialing tailored for modern
                organizational leaders and global scholars.
              </p>

              <div className="pt-4 flex flex-wrap gap-4 items-center">
                <Link href="/programs">
                  <Button
                    size="lg"
                    className="bg-[#C8A84E] text-cambria-deep hover:bg-[#B89840] font-semibold gap-2 shadow-subtle"
                  >
                    Explore Academic Programs
                    <ArrowRight className="w-4 h-4" />
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

            {/* Right Emblem Vignette (Seal Geometry without stock photos) */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative p-6 sm:p-8 rounded-full border border-white/15 bg-white/[0.02] backdrop-blur-sm">
                <div className="absolute inset-0 rounded-full border border-[#C8A84E]/30 animate-pulse" />
                <div className="relative p-6 rounded-full border-2 border-dashed border-white/20 bg-cambria-deep/80 shadow-2xl flex flex-col items-center justify-center text-center">
                  <CambriaSeal size={180} variant="white" />
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

      {/* 2. SIGNATURE VERIFICATION CALLOUT */}
      <section className="bg-cambria-deep text-white py-12 border-b border-white/10">
        <Container>
          <div className="bg-white/5 border border-white/10 rounded-[6px] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-[4px] bg-[#C8A84E]/10 border border-[#C8A84E]/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-8 h-8 text-[#C8A84E]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-2xl font-semibold text-white">
                  Institutional Credential Verification Portal
                </h3>
                <p className="text-sm text-slate-300">
                  Every diploma, certificate, and student card issued by Cambria contains a unique
                  sequential serial number and cryptographic verification QR token.
                </p>
              </div>
            </div>

            <Link href="/verify" className="shrink-0 w-full md:w-auto">
              <Button className="w-full md:w-auto bg-[#C8A84E] text-cambria-deep hover:bg-[#B89840] font-semibold gap-2">
                <Search className="w-4 h-4" />
                Launch Verification Engine
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* 3. ACADEMIC PROGRAMS CATALOG (Editorial Numbered List) */}
      <Section variant="offwhite" watermark>
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
                className="py-8 group transition-colors hover:bg-white/60 px-4 -mx-4 rounded-[4px]"
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

      {/* 4. INSTITUTIONAL ACCREDITATION & ETHOS */}
      <Section variant="white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md p-8 bg-cambria-offwhite border border-slate-200 rounded-[6px] shadow-card text-center relative overflow-hidden">
                <div className="inline-block p-4 rounded-full bg-white border border-slate-200 mb-4">
                  <CambriaSeal size={100} variant="navy" />
                </div>
                <h4 className="font-serif text-xl font-bold text-cambria-navy">
                  Academic Integrity Charter
                </h4>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Registered under transnational academic bylaws with strict verification protocols
                  protecting degree holders and partner employers worldwide.
                </p>
                <div className="mt-6 pt-4 border-t border-slate-200 flex justify-around text-xs text-slate-600">
                  <div>
                    <span className="block font-serif text-xl font-bold text-cambria-navy">100%</span>
                    Verifiable Records
                  </div>
                  <div className="border-r border-slate-200" />
                  <div>
                    <span className="block font-serif text-xl font-bold text-cambria-navy">Zero</span>
                    Unverified Issuance
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-cambria-academic block">
                Ethos & Governance
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-cambria-navy tracking-tight leading-tight">
                An Educational Standard Grounded in Verification
              </h2>
              <DoubleRingDivider />
              <p className="text-slate-600 text-base leading-relaxed">
                In an era of proliferating unverified digital credentials, Cambria International College
                maintains an immutable, centralized verification ledger. Every graduate&apos;s achievement
                is permanently stored and provable through our sovereign verification registry.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700">
                    <strong>Unified Credential Identity:</strong> Certificates and Student Cards share a single
                    verification token and sequential serial number.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700">
                    <strong>Bilingual OpenType Rendering:</strong> Full native Arabic (Cairo / Noto Naskh)
                    and English typography shaped with vector precision.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700">
                    <strong>Complete Audit Trail:</strong> Every issuance, state change, and regeneration
                    is recorded in an immutable institutional ledger.
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Link href="/about">
                  <Button variant="outline" className="border-cambria-navy text-cambria-navy hover:bg-cambria-soft font-medium">
                    Read Institutional Governance Charter
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
