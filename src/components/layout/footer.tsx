"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CambriaSeal } from "@/components/ui/cambria-seal";
import { Container } from "@/components/ui/container";
import { DoubleRingDivider } from "@/components/ui/double-ring-divider";
import { ShieldCheck, Mail, MapPin, ExternalLink } from "lucide-react";

export const Footer: React.FC = () => {
  const pathname = usePathname();

  // If in admin layout, don't show the public footer
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-cambria-deep text-white border-t border-white/10 pt-16 pb-12 relative overflow-hidden">
      {/* Background Watermark Seal */}
      <div
        className="absolute -right-24 -bottom-24 pointer-events-none opacity-[0.025]"
        aria-hidden="true"
      >
        <CambriaSeal size={450} variant="white" />
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Col 1 & 2: Institutional Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3.5">
              <CambriaSeal size={56} variant="white" />
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-white block leading-none">
                  CAMBRIA
                </span>
                <span className="text-[11px] tracking-[0.2em] font-medium text-slate-400 uppercase mt-0.5 block">
                  International College
                </span>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed max-w-md pt-2">
              Cambria International College is dedicated to distinguished executive education,
              transnational professional certification, and digital credential verification.
              Upholding the highest academic standards of excellence, integrity, and ethical leadership.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-[4px] text-xs text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C8A84E]" />
                Verifiable Cryptographic Credentials Standard
              </span>
            </div>
          </div>

          {/* Col 3: Academic Offerings */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-semibold text-white tracking-wide border-b border-white/10 pb-2">
              Academic Programs
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link href="/programs#executive" className="hover:text-white transition-colors">
                  Executive Master&apos;s
                </Link>
              </li>
              <li>
                <Link href="/programs#diplomas" className="hover:text-white transition-colors">
                  Professional Diplomas
                </Link>
              </li>
              <li>
                <Link href="/programs#training" className="hover:text-white transition-colors">
                  Specialized Training
                </Link>
              </li>
              <li>
                <Link href="/majors" className="hover:text-white transition-colors">
                  Majors & Disciplines
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Academic Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Verification & Governance */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-semibold text-white tracking-wide border-b border-white/10 pb-2">
              Verification & Policy
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link href="/verify" className="hover:text-[#C8A84E] text-[#C8A84E] transition-colors flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  Verify a Credential
                </Link>
              </li>
              <li>
                <Link href="/about#accreditation" className="hover:text-white transition-colors">
                  Accreditation & Registry
                </Link>
              </li>
              <li>
                <Link href="/about#governance" className="hover:text-white transition-colors">
                  Academic Governance
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-white transition-colors">
                  Faculty Council
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Institutional Registrar */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-semibold text-white tracking-wide border-b border-white/10 pb-2">
              Registrar Liaison
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C8A84E] shrink-0 mt-0.5" />
                <span>
                  Office of the Academic Registrar<br />
                  London & International Transnational Operations
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C8A84E] shrink-0" />
                <span>registrar@cambria.edu</span>
              </div>
              <p className="text-[11px] text-slate-400 pt-2 leading-relaxed">
                Credentials issued by Cambria International College bear cryptographic QR verification
                resolvable in real time.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Cambria International College. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-white transition-colors">
              Privacy & Data Policy
            </Link>
            <span>•</span>
            <Link href="/about" className="hover:text-white transition-colors">
              Terms of Verification
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-white transition-colors">
              Campus Directory
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};
