import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { DoubleRingDivider } from "@/components/ui/double-ring-divider";
import { ArrowRight, BookOpen, Layers, CheckCircle2 } from "lucide-react";

const majorsCatalog = [
  {
    number: "01",
    code: "MAJ-EDL",
    title: "Educational Leadership & Higher Education Policy",
    title_ar: "القيادة التربوية وسياسات التعليم العالي",
    department: "School of Academic Governance",
    description:
      "Focuses on higher education institutional architecture, accreditation standards, strategic leadership, and trans-border higher education policy.",
    modules: [
      "Institutional Strategy & Accreditations",
      "Higher Education Law & Policy",
      "Executive Financial Management in Education",
      "Curriculum Innovation & Quality Assurance",
    ],
  },
  {
    number: "02",
    code: "MAJ-IBA",
    title: "Transnational Business Administration & Global Strategy",
    title_ar: "إدارة الأعمال العابرة للحدود والاستراتيجية العالمية",
    department: "Faculty of Executive Commerce",
    description:
      "Examines multinational enterprise governance, transnational market dynamics, strategic leadership, and international regulatory compliance.",
    modules: [
      "Global Corporate Strategy",
      "Multinational Financial Systems",
      "Cross-Border Mergers & Governance",
      "Executive Decision Analytics",
    ],
  },
  {
    number: "03",
    code: "MAJ-SEC",
    title: "Cloud Infrastructure Defense & Digital Forensics",
    title_ar: "دفاع البنية التحتية السحابية والتحقيق الجنائي الرقمي",
    department: "Institute of Applied Computing",
    description:
      "Advanced technical discipline concentrating on defensive engineering, cryptographic controls, zero-trust cloud architectures, and incident investigation.",
    modules: [
      "Zero-Trust Architecture & Threat Modeling",
      "Enterprise Cloud Security Operations",
      "Digital Evidence Analysis & Forensics",
      "Regulatory Security Compliance (ISO/NIST)",
    ],
  },
  {
    number: "04",
    code: "MAJ-AID",
    title: "Enterprise Artificial Intelligence & Applied Data Systems",
    title_ar: "الذكاء الاصطناعي للمؤسسات وأنظمة البيانات التطبيقية",
    department: "Institute of Applied Computing",
    description:
      "Prepares technical directors to design, govern, and deploy scalable machine learning architectures, predictive algorithms, and enterprise data lakes.",
    modules: [
      "Large-Scale Data Engineering",
      "Applied Deep Learning Frameworks",
      "AI Ethics, Governance & Model Risk",
      "Natural Language & Cognitive Systems",
    ],
  },
  {
    number: "05",
    code: "MAJ-HCA",
    title: "Healthcare Systems Administration & Clinical Governance",
    title_ar: "إدارة النظم الصحية والحوكمة السريرية",
    department: "School of Health Sciences Management",
    description:
      "Addresses executive oversight in hospital administration, clinical quality frameworks, public health informatics, and patient safety systems.",
    modules: [
      "Hospital Operations & Capacity Modeling",
      "Clinical Quality & Risk Management",
      "Health Informatics & Data Privacy",
      "Healthcare Economics & Policy",
    ],
  },
  {
    number: "06",
    code: "MAJ-FIN",
    title: "Financial Technology, Risk Analytics & Compliance",
    title_ar: "التكنولوجيا المالية وتحليل المخاطر والامتثال",
    department: "Faculty of Executive Commerce",
    description:
      "Blends computational quantitative finance, decentralized ledger technology, regulatory risk modeling, and modern wealth systems.",
    modules: [
      "Quantitative Risk Modeling",
      "Algorithmic & Digital Payment Systems",
      "Anti-Money Laundering & Financial Law",
      "Portfolio Optimization & Analytics",
    ],
  },
];

export default function MajorsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Academic Disciplines"
        title="Majors & Concentrations"
        description="Comprehensive catalog of disciplinary specializations across executive administration, information systems, and academic governance."
        variant="navy"
      />

      <Section variant="offwhite" watermark>
        <Container>
          <div className="max-w-3xl mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-cambria-navy tracking-tight">
              Disciplines Designed for Executive Mastery
            </h2>
            <DoubleRingDivider />
            <p className="text-slate-600 text-base leading-relaxed">
              Majors represent concentrated fields of study integrated into our Professional Diplomas
              and Master&apos;s degrees. Each major is governed by designated academic boards to ensure
              pedagogical relevance and rigorous assessment.
            </p>
          </div>

          {/* Numbered Editorial Catalog */}
          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {majorsCatalog.map((major) => (
              <div
                key={major.number}
                className="py-10 group hover:bg-white/50 px-4 -mx-4 rounded-[4px] transition-colors"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Number & Code */}
                  <div className="lg:col-span-2">
                    <span className="font-serif text-3xl text-[#C8A84E] font-bold block">
                      {major.number}.
                    </span>
                    <span className="font-mono text-xs text-slate-500 font-semibold block mt-1">
                      {major.code}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-2">
                      {major.department}
                    </span>
                  </div>

                  {/* Title & Narrative */}
                  <div className="lg:col-span-6 space-y-2">
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cambria-navy group-hover:text-cambria-academic transition-colors">
                      {major.title}
                    </h3>
                    <p className="text-sm font-semibold text-slate-500 font-arabic" dir="rtl">
                      {major.title_ar}
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed pt-2">
                      {major.description}
                    </p>
                  </div>

                  {/* Curricular Modules */}
                  <div className="lg:col-span-4 bg-white border border-slate-200 rounded-[6px] p-5 shadow-subtle space-y-3">
                    <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 block border-b border-slate-100 pb-2">
                      Representative Core Units
                    </span>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {major.modules.map((m, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#C8A84E] font-bold">★</span>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-2">
                      <Link href="/programs">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-xs text-cambria-academic hover:bg-cambria-soft font-semibold gap-1.5 justify-start p-0 h-auto group"
                        >
                          View Qualifying Programs
                          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}
