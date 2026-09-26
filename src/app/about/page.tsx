import React from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PageHeader } from "@/components/ui/page-header";
import { DoubleRingDivider } from "@/components/ui/double-ring-divider";
import { CambriaSeal } from "@/components/ui/cambria-seal";
import { ShieldCheck, BookOpen, Scale, Award, Info, FileText } from "lucide-react";

export default function AboutPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Institutional Heritage"
        title="About Cambria International College"
        description="A distinguished transnational academic institution committed to executive leadership, professional qualification, and verifiable scholarship."
        variant="navy"
      />

      {/* 1. ACADEMIC MISSION & PHILOSOPHY */}
      <Section variant="offwhite">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8 space-y-6">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-cambria-academic block">
                Educational Purpose
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-cambria-navy tracking-tight">
                Fostering Leadership in a Borderless Knowledge Economy
              </h2>
              <DoubleRingDivider />
              <div className="space-y-4 text-slate-700 text-base leading-relaxed">
                <p>
                  Cambria International College was founded upon the premise that professional
                  excellence in higher education requires a deliberate synthesis of classical academic
                  rigor and pragmatic executive practice. We serve working executives, civil servants,
                  and specialized practitioners across global markets who demand recognized qualifications
                  without geographical confinement.
                </p>
                <p>
                  Our institutional ethos places transparency and cryptographic certainty at the core of
                  our pedagogical mission. Unlike conventional institutions where verification remains
                  cumbersome and prone to forgery, every award issued by Cambria is integrated directly
                  with our public digital verification registry.
                </p>
              </div>

              {/* Core Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                <div className="p-5 bg-white border border-slate-200 rounded-[6px] shadow-subtle space-y-2">
                  <div className="w-10 h-10 rounded-[4px] bg-cambria-soft flex items-center justify-center text-cambria-navy mb-3">
                    <Scale className="w-5 h-5 text-cambria-academic" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-cambria-navy">
                    Academic Integrity
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Uncompromising standards of scholarship, independent peer assessment, and rigorous
                    evaluation criteria across all diplomas and master&apos;s frameworks.
                  </p>
                </div>

                <div className="p-5 bg-white border border-slate-200 rounded-[6px] shadow-subtle space-y-2">
                  <div className="w-10 h-10 rounded-[4px] bg-cambria-soft flex items-center justify-center text-cambria-navy mb-3">
                    <BookOpen className="w-5 h-5 text-cambria-academic" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-cambria-navy">
                    Transnational Curricula
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Modular, practical curricula designed in alignment with international vocational and
                    higher educational qualification descriptors.
                  </p>
                </div>

                <div className="p-5 bg-white border border-slate-200 rounded-[6px] shadow-subtle space-y-2">
                  <div className="w-10 h-10 rounded-[4px] bg-cambria-soft flex items-center justify-center text-cambria-navy mb-3">
                    <ShieldCheck className="w-5 h-5 text-cambria-academic" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-cambria-navy">
                    Instant Verifiability
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Sovereign digital credential infrastructure ensuring that every credential can be verified
                    globally 24/7 in real time.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar Institutional Facts */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-slate-200 rounded-[6px] p-6 shadow-card space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <CambriaSeal size={40} variant="navy" />
                  <div>
                    <h4 className="font-serif text-base font-bold text-cambria-navy">
                      Institutional Registry
                    </h4>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                      Registrar Profile
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-600">
                  <div>
                    <span className="block text-slate-400 font-medium">Headquarters Liaison:</span>
                    <span className="font-semibold text-slate-800">
                      London & International Transnational Operations
                    </span>
                  </div>
                  <div>
                    <span className="block text-slate-400 font-medium">Credentialing Mechanism:</span>
                    <span className="font-semibold text-slate-800">
                      CSPRNG Verification Token & Sequential Serials
                    </span>
                  </div>
                  <div>
                    <span className="block text-slate-400 font-medium">Document Typologies:</span>
                    <span className="font-semibold text-slate-800">
                      Official Certificates & Physical Student Cards
                    </span>
                  </div>
                  <div>
                    <span className="block text-slate-400 font-medium">Bilingual Support:</span>
                    <span className="font-semibold text-slate-800">
                      English & Arabic (Dual-Script OpenType)
                    </span>
                  </div>
                </div>
              </div>

              {/* Honest Content Needed Notice for Accreditation Dossier */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-[6px] p-5 text-xs text-amber-900 space-y-2">
                <div className="flex items-center gap-2 font-semibold">
                  <Info className="w-4 h-4 text-[#C8A84E]" />
                  <span>Accreditation & Registry Notice</span>
                </div>
                <p className="leading-relaxed text-amber-800/90">
                  Official regulatory dossiers, ministry registration references, and inspection body
                  filings are maintained by the Office of the Registrar and are available upon formal
                  consular and institutional request.
                </p>
                <div className="pt-2 text-[11px] text-amber-700 font-mono">
                  [Ref: DOCS-ACC-2026-PENDING]
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 2. INSTITUTIONAL SEAL SYMBOLISM */}
      <Section variant="white" watermark>
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-cambria-academic block">
              Heraldry & Semiotics
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-cambria-navy tracking-tight">
              The Meaning of the Cambria Seal
            </h2>
            <DoubleRingDivider centered withStar />
            <p className="text-slate-600 text-sm leading-relaxed">
              Every detail in the institutional mark of Cambria reflects an academic principle
              honored by our faculty and scholars.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-cambria-offwhite border border-slate-200 rounded-[6px] space-y-3">
              <span className="text-[#C8A84E] font-serif text-xl font-bold block">01.</span>
              <h4 className="font-serif text-lg font-bold text-cambria-navy">
                The Open Codex
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Represents open access to verified scholarship, intellectual inquiry, and the accumulation
                of human wisdom across borders.
              </p>
            </div>

            <div className="p-6 bg-cambria-offwhite border border-slate-200 rounded-[6px] space-y-3">
              <span className="text-[#C8A84E] font-serif text-xl font-bold block">02.</span>
              <h4 className="font-serif text-lg font-bold text-cambria-navy">
                The Radiant Sunburst
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Symbolizes enlightenment, critical reasoning, and the dawn of professional mastery
                achieved through focused study.
              </p>
            </div>

            <div className="p-6 bg-cambria-offwhite border border-slate-200 rounded-[6px] space-y-3">
              <span className="text-[#C8A84E] font-serif text-xl font-bold block">03.</span>
              <h4 className="font-serif text-lg font-bold text-cambria-navy">
                The Three Stars
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Arched above the codex, representing the three foundational pillars of the institution:
                Excellence, Integrity, and Knowledge.
              </p>
            </div>

            <div className="p-6 bg-cambria-offwhite border border-slate-200 rounded-[6px] space-y-3">
              <span className="text-[#C8A84E] font-serif text-xl font-bold block">04.</span>
              <h4 className="font-serif text-lg font-bold text-cambria-navy">
                The Laurel & Double Ring
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                The double ring signifies institutional boundary and protection, while the flanking laurels
                commemorate academic achievement.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
