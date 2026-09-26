import React from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { DoubleRingDivider } from "@/components/ui/double-ring-divider";
import { ShieldCheck, Info } from "lucide-react";

interface QuoteItem {
  quote: string;
  sourceName: string;
  sourceRole: string;
  sourceAffiliation: string;
}

const INSTITUTIONAL_CITATIONS: QuoteItem[] = [
  {
    quote:
      "The integrity of higher education in a transnational landscape relies not on physical paper or ornamental seals, but on mathematical certainty, cryptographically verifiable records, and ethical academic governance.",
    sourceName: "Academic Charter Preamble",
    sourceRole: "Founding Declaration",
    sourceAffiliation: "Cambria International College Governance Framework",
  },
  {
    quote:
      "A credential must serve as a permanent passport of merit for the graduate. By decoupling verification from proprietary centralized friction, we empower employers worldwide with instantaneous truth.",
    sourceName: "Office of the Registrar",
    sourceRole: "Institutional Standards Protocol",
    sourceAffiliation: "Transnational Academic Registry Review",
  },
];

export const QuoteSection: React.FC = () => {
  return (
    <Section variant="offwhite" className="border-t border-slate-200">
      <Container>
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <span className="text-xs uppercase tracking-[0.22em] font-semibold text-[#C8A84E] block">
            INSTITUTIONAL VOICES & ETHOS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cambria-navy tracking-tight">
            Guiding Principles of Academic Stewardship
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Institutional declarations and governance tenets defining our transnational academic mission.
          </p>
          <div className="pt-2">
            <DoubleRingDivider className="max-w-xs mx-auto" />
          </div>
        </div>

        {/* Quote Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {INSTITUTIONAL_CITATIONS.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-[6px] p-7 sm:p-8 shadow-card flex flex-col justify-between hover:border-[#C8A84E]/40 transition-colors duration-200 relative group"
            >
              {/* Gold Quotation Mark Accent */}
              <div className="font-serif text-5xl leading-none text-[#C8A84E]/70 select-none mb-2">
                “
              </div>

              {/* Quote Body */}
              <blockquote className="text-sm sm:text-[15px] text-slate-700 leading-relaxed font-serif italic mb-6">
                {item.quote}
              </blockquote>

              {/* Divider & Attribution */}
              <div className="pt-4 border-t border-slate-100 mt-auto space-y-0.5">
                <span className="font-serif text-base font-bold text-cambria-navy block">
                  {item.sourceName}
                </span>
                <span className="text-xs font-semibold text-[#C8A84E] block">
                  {item.sourceRole}
                </span>
                <span className="text-[11px] text-slate-400 block">
                  {item.sourceAffiliation}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Honest Content Pending Callout */}
        <div className="mt-10 max-w-2xl mx-auto p-4 rounded-[6px] bg-slate-50 border border-slate-200 flex items-center gap-3 text-xs text-slate-500 justify-center text-center">
          <Info className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            <strong>Note on Student & Partner Testimonials:</strong> Cambria publishes only verified graduate testimonials following formal registrar privacy consent. Submissions currently in review.
          </span>
        </div>
      </Container>
    </Section>
  );
};
