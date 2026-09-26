"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CambriaSeal } from "@/components/ui/cambria-seal";
import { DoubleRingDivider } from "@/components/ui/double-ring-divider";
import { VerificationDisplay } from "@/components/verification/verification-display";
import { PublicVerificationResult } from "@/types/database";
import {
  ShieldCheck,
  Search,
  QrCode,
  AlertCircle,
  HelpCircle,
  FileSearch,
} from "lucide-react";

export default function VerifyPage() {
  const [credentialNumber, setCredentialNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PublicVerificationResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [rateLimited, setRateLimited] = useState<string | null>(null);
  const [searchedNumber, setSearchedNumber] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentialNumber.trim()) return;

    setLoading(true);
    setNotFound(false);
    setRateLimited(null);
    setResult(null);
    setSearchedNumber(credentialNumber.trim());

    try {
      const res = await fetch("/api/verify/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credentialNumber: credentialNumber.trim() }),
      });

      if (res.status === 429) {
        const data = await res.json();
        setRateLimited(
          data.error || "Rate limit reached. Please wait before attempting further lookups."
        );
        return;
      }

      const data = await res.json();
      if (data.found && data.credential) {
        setResult(data.credential);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Institutional Registry"
        title="Digital Credential Verification"
        description="Verify the validity, conferral date, and authentic lifecycle standing of any certificate or student card issued by Cambria International College."
        variant="navy"
      />

      {/* Signature Deep Navy Verification Section */}
      <section className="bg-cambria-deep text-white py-14 border-b border-white/10 relative overflow-hidden">
        <div
          className="absolute -right-20 -bottom-20 pointer-events-none opacity-[0.03]"
          aria-hidden="true"
        >
          <CambriaSeal size={400} variant="white" />
        </div>

        <Container className="relative z-10 max-w-4xl">
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-white/10 border border-white/15 text-xs text-[#C8A84E] font-medium tracking-wider uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sovereign Credential Ledger</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Enter Credential Identification Number
            </h2>
            <p className="text-sm text-slate-300 max-w-xl mx-auto">
              Please enter the sequential identifier printed on the parchment certificate or physical student
              identification card (e.g., <code className="font-mono text-[#C8A84E]">CAM-2026-000184</code>).
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  required
                  value={credentialNumber}
                  onChange={(e) => setCredentialNumber(e.target.value)}
                  placeholder="e.g. CAM-2026-000184"
                  className="pl-11 h-12 bg-white text-cambria-navy text-base font-mono uppercase tracking-wider rounded-[4px] border-white/30 focus-visible:ring-[#C8A84E]"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="h-12 px-8 bg-[#C8A84E] hover:bg-[#B89840] text-cambria-deep font-bold text-base shrink-0 shadow-subtle"
              >
                {loading ? "Verifying..." : "Verify Credential"}
              </Button>
            </div>

            {/* Quick Helper Links */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-1">
              <span>Rate limited for data integrity (10 requests/min).</span>
              <div className="flex items-center gap-2">
                <span>Try sample:</span>
                <button
                  type="button"
                  onClick={() => setCredentialNumber("CAM-2026-000184")}
                  className="text-[#C8A84E] hover:underline font-mono"
                >
                  CAM-2026-000184
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setCredentialNumber("CAM-2026-000186")}
                  className="text-rose-300 hover:underline font-mono"
                >
                  Revoked
                </button>
              </div>
            </div>
          </form>
        </Container>
      </section>

      {/* Results / Status Presentation Area */}
      <Section variant="offwhite">
        <Container className="max-w-4xl">
          {rateLimited && (
            <div className="p-6 bg-rose-50 border border-rose-200 rounded-[6px] text-rose-900 flex items-start gap-4 animate-in fade-in duration-200">
              <AlertCircle className="w-6 h-6 text-rose-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif text-lg font-bold">Query Limit Reached</h4>
                <p className="text-sm text-rose-800 mt-1 leading-relaxed">
                  {rateLimited}
                </p>
                <p className="text-xs text-rose-700 mt-2">
                  To safeguard student records from brute-force enumeration, searches from your IP
                  address are temporarily restricted. Please try again in 60 seconds.
                </p>
              </div>
            </div>
          )}

          {notFound && (
            <div className="p-8 bg-white border border-slate-200 rounded-[6px] shadow-card text-center space-y-4 animate-in fade-in duration-200">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-500">
                <FileSearch className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-cambria-navy">
                No Record Located
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                No active, expired, or archived credential matches identification number{" "}
                <code className="font-mono font-bold text-cambria-navy">{searchedNumber}</code>.
              </p>
              <div className="p-4 bg-slate-50 rounded-[4px] border border-slate-200 text-xs text-slate-500 max-w-lg mx-auto text-left space-y-1.5">
                <p className="font-semibold text-slate-700">Verification Troubleshooting:</p>
                <p>• Verify that the credential number format matches <code className="font-mono">CAM-YYYY-XXXXXX</code>.</p>
                <p>• Ensure all digits and hyphens are typed without leading or trailing spaces.</p>
                <p>• If using a smartphone, scan the cryptographic QR code directly for immediate resolution.</p>
              </div>
            </div>
          )}

          {result && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <VerificationDisplay data={result} />
            </div>
          )}

          {/* QR Code Verification Guidance */}
          {!result && !notFound && !rateLimited && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="p-6 bg-white border border-slate-200 rounded-[6px] shadow-subtle space-y-3">
                <div className="w-10 h-10 rounded-[4px] bg-cambria-soft flex items-center justify-center text-cambria-navy">
                  <QrCode className="w-5 h-5 text-cambria-academic" />
                </div>
                <h4 className="font-serif text-lg font-bold text-cambria-navy">
                  Direct QR Code Verification
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every official Cambria certificate and student card features a high-density QR code.
                  Scanning the code with any mobile camera immediately opens the verified capability record
                  without requiring manual identifier entry.
                </p>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-[6px] shadow-subtle space-y-3">
                <div className="w-10 h-10 rounded-[4px] bg-cambria-soft flex items-center justify-center text-cambria-navy">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                </div>
                <h4 className="font-serif text-lg font-bold text-cambria-navy">
                  Single Shared Token Architecture
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Both the graduation parchment and the plastic student card issued under a credential
                  share the same verification token and QR destination, resolving to the identical
                  tamper-evident institutional record.
                </p>
              </div>
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}
