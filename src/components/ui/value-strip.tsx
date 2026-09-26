import React from "react";
import { Container } from "@/components/ui/container";
import { ShieldCheck, CheckCircle2, GraduationCap } from "lucide-react";

interface ValuePillar {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const PILLARS: ValuePillar[] = [
  {
    icon: ShieldCheck,
    title: "Transnational Accreditation",
    description:
      "Academic charters adhering to rigorous institutional bylaws and international educational governance standards.",
  },
  {
    icon: CheckCircle2,
    title: "Cryptographic Verification Standard",
    description:
      "Instant, tamper-evident digital credential verification powered by unalterable capability tokens.",
  },
  {
    icon: GraduationCap,
    title: "Modular Executive Delivery",
    description:
      "Structured professional diplomas and master's degrees tailored for senior administrators and working scholars.",
  },
];

export const ValueStrip: React.FC = () => {
  return (
    <section className="relative z-20 -mt-8 sm:-mt-12 mb-8">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 rounded-[8px] overflow-hidden border border-slate-200/90 shadow-card bg-white">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            const isMiddle = idx === 1;

            return (
              <div
                key={pillar.title}
                className={`p-6 sm:p-8 flex items-start gap-4 transition-colors duration-200 ${
                  isMiddle
                    ? "bg-cambria-soft/50 hover:bg-cambria-soft/70 border-y md:border-y-0 md:border-x border-slate-200"
                    : "bg-cambria-offwhite hover:bg-slate-100/60"
                }`}
              >
                {/* Circular Dual-Ring Icon Framing */}
                <div className="shrink-0 w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-subtle ring-2 ring-slate-100">
                  <Icon className="w-5 h-5 text-cambria-academic" />
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-bold text-cambria-navy tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
