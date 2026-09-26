import React from "react";
import { Container } from "@/components/ui/container";
import { CambriaSeal } from "@/components/ui/cambria-seal";
import { ShieldCheck } from "lucide-react";

interface StatItem {
  value: string;
  label: string;
  sublabel: string;
}

const STATS: StatItem[] = [
  {
    value: "4",
    label: "Accredited Curricula",
    sublabel: "Master's, Diplomas & Executive Certifications",
  },
  {
    value: "100%",
    label: "On-Ledger Verification",
    sublabel: "Cryptographic capability tokens on every award",
  },
  {
    value: "0",
    label: "Compromised Records",
    sublabel: "Immutable registry with tamper-evident audit logs",
  },
  {
    value: "24/7",
    label: "Global Verification Uptime",
    sublabel: "Instant QR scan lookup across all time zones",
  },
];

export const InstitutionalStatBand: React.FC = () => {
  return (
    <section className="bg-cambria-deep text-white py-16 md:py-20 relative overflow-hidden border-y border-white/10">
      {/* Background Seal Watermark */}
      <div
        className="absolute -right-20 -bottom-20 pointer-events-none opacity-[0.03] select-none"
        aria-hidden="true"
      >
        <CambriaSeal size={500} variant="white" />
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Editorial Narrative */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-white/5 border border-white/10 text-xs text-[#C8A84E] font-medium tracking-wider uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              Institutional Benchmark
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              Why Institutional Stakeholders Trust Cambria
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
              Unlike traditional institutions reliant on physical paper certificates vulnerable to forgery,
              Cambria operates under an uncompromising cryptographic ledger standard. Every degree, diploma,
              and professional award is backed by immutable capability tokens and strict registrar governance.
            </p>

            <div className="pt-2 text-xs text-slate-400 border-t border-white/10">
              <span>Audited under Transnational Academic Integrity Frameworks • London Registry</span>
            </div>
          </div>

          {/* Right Metrics Grid — Circular Motif with Gold Accents */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-5 sm:gap-6">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="p-5 sm:p-6 bg-white/[0.04] border border-white/10 rounded-[6px] hover:border-[#C8A84E]/40 transition-colors duration-200 space-y-2 relative group"
              >
                {/* Subtle Circular Highlight */}
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-1 group-hover:border-[#C8A84E]/50 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-[#C8A84E]" />
                </div>

                <div>
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-[#C8A84E] block tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-sm font-semibold text-white block mt-0.5">
                    {stat.label}
                  </span>
                  <span className="text-xs text-slate-400 block mt-1 leading-snug">
                    {stat.sublabel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
