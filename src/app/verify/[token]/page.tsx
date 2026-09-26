import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { VerificationDisplay } from "@/components/verification/verification-display";
import { getPublicVerification } from "@/lib/db";
import { ShieldAlert, ArrowLeft, Search } from "lucide-react";

interface VerifyTokenPageProps {
  params: Promise<{
    token: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function VerifyTokenPage({ params }: VerifyTokenPageProps) {
  const { token } = await params;
  const result = await getPublicVerification(token);

  if (!result) {
    return (
      <div>
        <PageHeader
          eyebrow="Verification Error"
          title="Invalid Verification Capability Token"
          description="The provided cryptographic token does not resolve to an active or archived record in the Cambria Transnational Academic Ledger."
          variant="navy"
        />

        <Section variant="offwhite">
          <Container className="max-w-2xl text-center space-y-6">
            <div className="p-8 bg-white border border-slate-200 rounded-[6px] shadow-card space-y-4">
              <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center mx-auto text-rose-700">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-cambria-navy">
                Unrecognized Verification Token
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                The QR code or direct link you followed contains a token that could not be verified:
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-[4px] font-mono text-xs text-slate-700 break-all">
                {token}
              </div>
              <p className="text-xs text-slate-500">
                If you believe this record is authentic, please manually search using the credential
                number printed on the document.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <Link href="/verify">
                  <Button className="bg-cambria-navy hover:bg-cambria-academic text-white font-medium gap-2">
                    <Search className="w-4 h-4" />
                    Search by Credential Number
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </Section>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Cryptographic QR Resolution"
        title="Verified Credential Record"
        description="Authentic institutional award record resolved directly from the document's cryptographic QR verification token."
        variant="navy"
      />

      <Section variant="offwhite">
        <Container className="max-w-4xl space-y-6">
          <div className="flex items-center justify-between">
            <Link href="/verify">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-slate-600 hover:text-cambria-navy">
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Credential Search
              </Button>
            </Link>
            <span className="text-xs text-slate-400 font-mono">
              Token: {token.slice(0, 14)}...
            </span>
          </div>

          <VerificationDisplay data={result} />
        </Container>
      </Section>
    </div>
  );
}
