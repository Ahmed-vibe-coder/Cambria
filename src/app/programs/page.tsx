import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { DoubleRingDivider } from "@/components/ui/double-ring-divider";
import { getPrograms } from "@/lib/db";
import { ArrowRight, CheckCircle2, Clock, Award, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProgramsPage() {
  const programs = await getPrograms();

  const masters = programs.filter((p) => p.degree_level === "professional_masters");
  const diplomas = programs.filter((p) => p.degree_level === "professional_diploma");
  const training = programs.filter((p) => p.degree_level === "training_course");
  const other = programs.filter((p) => p.degree_level === "other");

  return (
    <div>
      <PageHeader
        eyebrow="Academic Curriculum"
        title="Programs of Study"
        description="A structured portfolio of professional postgraduate master's, diplomas, and specialized executive training courses designed for global impact."
        variant="navy"
      />

      {/* Overview Intro */}
      <Section variant="offwhite">
        <Container>
          <div className="max-w-3xl mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-cambria-navy tracking-tight">
              Modular Qualifications for Experienced Leaders
            </h2>
            <DoubleRingDivider />
            <p className="text-slate-600 text-base leading-relaxed">
              Every program at Cambria International College is grounded in high-level competency
              frameworks. Upon successful completion, candidates receive an official credential
              accompanied by both an official parchment certificate and an institutional student card
              bearing verifiable QR codes.
            </p>
          </div>

          {/* 1. PROFESSIONAL MASTER'S SECTION */}
          <div id="executive" className="mb-16">
            <div className="flex items-center justify-between pb-4 border-b-2 border-cambria-navy">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C8A84E] block">
                  Category 01
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cambria-navy">
                  Professional Master&apos;s Programs
                </h3>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-[4px] bg-cambria-soft text-cambria-navy border border-blue-200">
                Level 7 Equivalent
              </span>
            </div>

            <div className="divide-y divide-slate-200">
              {masters.map((prog, idx) => (
                <div key={prog.id} className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-1">
                    <span className="font-serif text-2xl text-[#C8A84E] font-bold">
                      {String(idx + 1).padStart(2, "0")}.
                    </span>
                  </div>

                  <div className="lg:col-span-8 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-semibold text-slate-500 uppercase">
                        {prog.code}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-600 font-medium">
                        {prog.duration}
                      </span>
                    </div>

                    <h4 className="font-serif text-2xl font-bold text-cambria-navy">
                      {prog.name}
                    </h4>

                    {prog.name_ar && (
                      <p className="text-sm font-semibold text-slate-500 font-arabic" dir="rtl">
                        {prog.name_ar}
                      </p>
                    )}

                    <p className="text-sm text-slate-600 leading-relaxed pt-1">
                      {prog.description}
                    </p>

                    <div className="flex items-center gap-6 pt-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-cambria-academic" />
                        {prog.duration}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-[#C8A84E]" />
                        {prog.credits} Academic Credits
                      </span>
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                        Dual Document Issuance (Cert + Card)
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-3 flex justify-start lg:justify-end pt-2">
                    <Link href="/contact">
                      <Button variant="outline" size="sm" className="font-medium gap-1.5">
                        Inquire with Registrar
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. PROFESSIONAL DIPLOMAS SECTION */}
          <div id="diplomas" className="mb-16">
            <div className="flex items-center justify-between pb-4 border-b-2 border-cambria-navy">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C8A84E] block">
                  Category 02
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cambria-navy">
                  Professional Diplomas
                </h3>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-[4px] bg-cambria-soft text-cambria-navy border border-blue-200">
                Advanced Career Standing
              </span>
            </div>

            <div className="divide-y divide-slate-200">
              {diplomas.map((prog, idx) => (
                <div key={prog.id} className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-1">
                    <span className="font-serif text-2xl text-[#C8A84E] font-bold">
                      {String(idx + 1).padStart(2, "0")}.
                    </span>
                  </div>

                  <div className="lg:col-span-8 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-semibold text-slate-500 uppercase">
                        {prog.code}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-600 font-medium">
                        {prog.duration}
                      </span>
                    </div>

                    <h4 className="font-serif text-2xl font-bold text-cambria-navy">
                      {prog.name}
                    </h4>

                    {prog.name_ar && (
                      <p className="text-sm font-semibold text-slate-500 font-arabic" dir="rtl">
                        {prog.name_ar}
                      </p>
                    )}

                    <p className="text-sm text-slate-600 leading-relaxed pt-1">
                      {prog.description}
                    </p>

                    <div className="flex items-center gap-6 pt-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-cambria-academic" />
                        {prog.duration}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-[#C8A84E]" />
                        {prog.credits} Credits
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-3 flex justify-start lg:justify-end pt-2">
                    <Link href="/contact">
                      <Button variant="outline" size="sm" className="font-medium gap-1.5">
                        Inquire with Registrar
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. SPECIALIZED TRAINING COURSES SECTION */}
          <div id="training" className="mb-12">
            <div className="flex items-center justify-between pb-4 border-b-2 border-cambria-navy">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C8A84E] block">
                  Category 03
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cambria-navy">
                  Specialized Training Courses
                </h3>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-[4px] bg-cambria-soft text-cambria-navy border border-blue-200">
                Executive Upskilling
              </span>
            </div>

            <div className="divide-y divide-slate-200">
              {training.map((prog, idx) => (
                <div key={prog.id} className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-1">
                    <span className="font-serif text-2xl text-[#C8A84E] font-bold">
                      {String(idx + 1).padStart(2, "0")}.
                    </span>
                  </div>

                  <div className="lg:col-span-8 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-semibold text-slate-500 uppercase">
                        {prog.code}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-600 font-medium">
                        {prog.duration}
                      </span>
                    </div>

                    <h4 className="font-serif text-2xl font-bold text-cambria-navy">
                      {prog.name}
                    </h4>

                    {prog.name_ar && (
                      <p className="text-sm font-semibold text-slate-500 font-arabic" dir="rtl">
                        {prog.name_ar}
                      </p>
                    )}

                    <p className="text-sm text-slate-600 leading-relaxed pt-1">
                      {prog.description}
                    </p>

                    <div className="flex items-center gap-6 pt-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-cambria-academic" />
                        {prog.duration}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-[#C8A84E]" />
                        {prog.credits} Credits
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-3 flex justify-start lg:justify-end pt-2">
                    <Link href="/contact">
                      <Button variant="outline" size="sm" className="font-medium gap-1.5">
                        Inquire with Registrar
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
