import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { DoubleRingDivider } from "@/components/ui/double-ring-divider";
import { ArrowRight, ShieldCheck, Mail } from "lucide-react";

const servicesCatalog = [
  {
    number: "01",
    title: "Official Digital Credential Issuance & Real-Time Verification",
    title_ar: "إصدار المؤهلات الرقمية الرسمية والتحقق الفوري",
    description:
      "All credentials issued by Cambria are fortified with cryptographic QR verification tokens. Employers, government bodies, and academic institutions worldwide can instantly verify graduate authenticity through our public portal without manual registrar delay.",
    audience: "Graduates, Accredited Employers, Transnational Academic Registries",
    actionText: "Verify a Credential",
    actionLink: "/verify",
  },
  {
    number: "02",
    title: "Prior Experiential Learning Assessment & Recognition (PLAR)",
    title_ar: "تقييم والاعتراف بالتعلم والخبرات السابقة",
    description:
      "A structured academic evaluation mechanism designed for seasoned practitioners. Candidates demonstrate competency through portfolio assessment, executive retrospectives, and peer review, converting documented professional experience into recognized modular academic credits.",
    audience: "Senior Executives, Civil Servants, Technical Specialists with 7+ Years Experience",
    actionText: "Inquire About PLAR Evaluation",
    actionLink: "/contact",
  },
  {
    number: "03",
    title: "Official Transcript Attestation & Apostille Support",
    title_ar: "توثيق السجلات الأكاديمية ودعم التصديق القنصلي",
    description:
      "Provision of official, tamper-evident academic transcripts detailing modular units, European Credit Transfer and Accumulation System (ECTS) credit values, and cumulative GPA standing. Includes formal notarization documentation support for international recognition.",
    audience: "Alumni and Registered Students Pursuing International Consular Attestation",
    actionText: "Request Transcript Support",
    actionLink: "/contact",
  },
  {
    number: "04",
    title: "Customized Corporate & Government Executive Training",
    title_ar: "برامج التدريب التنفيذي المخصصة للمؤسسات والحكومات",
    description:
      "Bespoke curriculum design and modular executive masterclasses tailored to the organizational objectives of ministries, public sector entities, and enterprise corporations. Delivered via flexible hybrid formats.",
    audience: "Corporate Human Capital Directors, Government Ministries, Public Bodies",
    actionText: "Consult Institutional Liaison",
    actionLink: "/contact",
  },
  {
    number: "05",
    title: "Transnational Joint Academic Recognition & Dual Awards",
    title_ar: "الاعتراف الأكاديمي المشترك والشهادات المزدوجة العابرة للحدود",
    description:
      "Academic collaboration frameworks enabling partner colleges and vocational training institutes worldwide to articulate curricula and offer dual-award credentialing backed by Cambria's verification infrastructure.",
    audience: "International Higher Education Colleges & Training Academies",
    actionText: "Explore Institutional Partnership",
    actionLink: "/contact",
  },
];

export default function ServicesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Institutional Services"
        title="Academic & Credentialing Services"
        description="Comprehensive services supporting credential authenticity, prior experiential learning evaluation, and transnational institutional partnerships."
        variant="navy"
      />

      <Section variant="offwhite" watermark>
        <Container>
          <div className="max-w-3xl mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-cambria-navy tracking-tight">
              Institutional Excellence in Service Delivery
            </h2>
            <DoubleRingDivider />
            <p className="text-slate-600 text-base leading-relaxed">
              Our administrative and academic offices provide dedicated support to students, alumni,
              and institutional partners. Explore our core services structured below in numbered sequence.
            </p>
          </div>

          {/* Numbered Editorial Blocks */}
          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {servicesCatalog.map((service) => (
              <div
                key={service.number}
                className="py-10 group hover:bg-white/60 px-4 -mx-4 rounded-[4px] transition-colors"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Number */}
                  <div className="lg:col-span-1">
                    <span className="font-serif text-3xl text-[#C8A84E] font-bold block">
                      {service.number}.
                    </span>
                  </div>

                  {/* Narrative */}
                  <div className="lg:col-span-8 space-y-2">
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cambria-navy group-hover:text-cambria-academic transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm font-semibold text-slate-500 font-arabic" dir="rtl">
                      {service.title_ar}
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed pt-2">
                      {service.description}
                    </p>
                    <div className="pt-3 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">Intended Audience:</span>{" "}
                      {service.audience}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="lg:col-span-3 flex justify-start lg:justify-end pt-2">
                    <Link href={service.actionLink}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-cambria-navy/40 hover:bg-cambria-navy hover:text-white font-medium gap-1.5 group"
                      >
                        {service.actionText}
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
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
