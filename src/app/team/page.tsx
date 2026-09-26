import React from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PageHeader } from "@/components/ui/page-header";
import { DoubleRingDivider } from "@/components/ui/double-ring-divider";
import { CambriaSeal } from "@/components/ui/cambria-seal";
import { Info, UserCheck, Shield, GraduationCap } from "lucide-react";

const governanceStructure = [
  {
    role: "Office of the Chancellor & Board of Governors",
    role_ar: "مكتب المستشار ومجلس الأمناء",
    description:
      "Responsible for supreme institutional policy, fiduciary governance, academic charters, and strategic oversight across all international learning jurisdictions.",
    status: "Biographical profiles and executive council portraits pending official publication.",
    code: "GOV-BOG-01",
  },
  {
    role: "Academic Senate & Board of Examiners",
    role_ar: "مجلس الشيوخ الأكاديمي ولجنة الممتحنين",
    description:
      "Provides faculty leadership, curriculum accreditation standards, external moderation of awards, and academic integrity regulations.",
    status: "Faculty council listings and disciplinary chairs dossier under annual review.",
    code: "GOV-SEN-02",
  },
  {
    role: "Office of the Academic Registrar",
    role_ar: "مكتب المسجل العام الأكاديمي",
    description:
      "Direct custodian of the official credential registry, student identity records, cryptographic verification keys, and archival graduation ledgers.",
    status: "Registrar executive staff and attested signatory officers verified on institutional record.",
    code: "GOV-REG-03",
  },
  {
    role: "Disciplinary Ethics & Quality Assurance Council",
    role_ar: "لجنة الأخلاقيات التأديبية وضمان الجودة الأكاديمية",
    description:
      "Oversees the institutional state machine for credentials, adjudicates appeals, enforces plagiarism controls, and manages credential revocation/suspension bylaws.",
    status: "Statutory council members appointed under the Institutional Governance Bylaws.",
    code: "GOV-ETH-04",
  },
];

export default function TeamPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Academic Leadership"
        title="Faculty & Institutional Governance"
        description="The governing bodies, academic senate, and executive registry responsible for maintaining the scholastic integrity and standards of Cambria International College."
        variant="navy"
      />

      <Section variant="offwhite">
        <Container>
          {/* Honest Client Content Pending Banner */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-[6px] p-6 mb-12 flex flex-col sm:flex-row items-start gap-4">
            <div className="w-10 h-10 rounded-[4px] bg-amber-100 flex items-center justify-center shrink-0 text-[#C8A84E]">
              <Info className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-serif text-lg font-bold text-amber-950">
                Institutional Roster Notice
              </h4>
              <p className="text-sm text-amber-900/90 leading-relaxed">
                In strict adherence to our anti-fabrication editorial guidelines, individual executive portrait
                photographs and detailed biographical dossiers are presented exclusively upon final client
                clearance. Academic bodies are outlined below according to the formal college governance charter.
              </p>
              <div className="text-xs font-mono text-amber-800 pt-1">
                Reference: docs/CONTENT_NEEDED.md §2 (Leadership & Academic Faculty Directory)
              </div>
            </div>
          </div>

          {/* Governance Structure */}
          <div className="space-y-8">
            <div className="max-w-3xl">
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-cambria-navy tracking-tight">
                Institutional Governance Framework
              </h2>
              <DoubleRingDivider />
              <p className="text-slate-600 text-base leading-relaxed">
                Cambria operates under a bicameral governance model separating academic evaluation
                from administrative oversight to preserve absolute scholastic autonomy and integrity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              {governanceStructure.map((gov) => (
                <div
                  key={gov.code}
                  className="bg-white border border-slate-200 rounded-[6px] p-8 shadow-card flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-cambria-soft text-cambria-academic border border-blue-100">
                        {gov.code}
                      </span>
                      <CambriaSeal size={32} variant="navy" />
                    </div>

                    <div>
                      <h3 className="font-serif text-2xl font-bold text-cambria-navy">
                        {gov.role}
                      </h3>
                      <p className="text-sm font-semibold text-slate-500 font-arabic pt-0.5" dir="rtl">
                        {gov.role_ar}
                      </p>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {gov.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Shield className="w-3.5 h-3.5 text-[#C8A84E]" />
                      <span>{gov.status}</span>
                    </div>
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
