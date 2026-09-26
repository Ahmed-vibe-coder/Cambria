import React from "react";
import { PublicVerificationResult } from "@/types/database";
import { StatusBadge } from "@/components/ui/status-badge";
import { CambriaSeal } from "@/components/ui/cambria-seal";
import { DoubleRingDivider } from "@/components/ui/double-ring-divider";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Clock,
  Download,
  FileText,
  CreditCard,
  ExternalLink,
  Award,
} from "lucide-react";

interface VerificationDisplayProps {
  data: PublicVerificationResult;
}

export const VerificationDisplay: React.FC<VerificationDisplayProps> = ({ data }) => {
  const isRevoked = data.status === "revoked";
  const isSuspended = data.status === "suspended";
  const isExpired = data.status === "expired";
  const isActive = data.status === "active";

  return (
    <div className="bg-white border border-slate-200 rounded-[6px] shadow-card overflow-hidden">
      {/* Header Banner */}
      <div
        className={`p-6 sm:p-8 border-b ${
          isRevoked
            ? "bg-rose-900 text-white border-rose-950"
            : isSuspended
            ? "bg-amber-900 text-white border-amber-950"
            : isExpired
            ? "bg-slate-800 text-white border-slate-900"
            : "bg-cambria-navy text-white border-cambria-deep"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-full bg-white/10 border border-white/20 shrink-0">
              <CambriaSeal size={48} variant="white" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-medium text-slate-300 block">
                Official Credential Verification Result
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {data.program_name_en}
              </h2>
            </div>
          </div>

          <div>
            <StatusBadge status={data.status} className="text-sm px-3.5 py-1" />
          </div>
        </div>
      </div>

      {/* Revocation / Suspension Alerts */}
      {isRevoked && (
        <div className="bg-rose-50 border-b border-rose-200 p-4 sm:p-6 flex items-start gap-3.5 text-rose-900">
          <XCircle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm">Notice of Credential Revocation</h4>
            <p className="text-xs text-rose-800 mt-1 leading-relaxed">
              This credential was formally revoked by the Academic Ethics & Disciplinary Council. It is
              null and void for all academic, professional, and governmental purposes.
            </p>
            {data.revocation_reason && (
              <p className="text-xs font-semibold text-rose-950 mt-1.5 p-2 bg-rose-100/70 rounded border border-rose-200">
                Official Justification: {data.revocation_reason}
              </p>
            )}
          </div>
        </div>
      )}

      {isSuspended && (
        <div className="bg-amber-50 border-b border-amber-200 p-4 sm:p-6 flex items-start gap-3.5 text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm">Notice of Administrative Suspension</h4>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              This credential is temporarily suspended under institutional review. Privileges and rights
              associated with this award are in abeyance pending completion of the administrative inquiry.
            </p>
            {data.suspension_reason && (
              <p className="text-xs font-semibold text-amber-950 mt-1.5 p-2 bg-amber-100/70 rounded border border-amber-200">
                Official Justification: {data.suspension_reason}
              </p>
            )}
          </div>
        </div>
      )}

      {isExpired && (
        <div className="bg-slate-100 border-b border-slate-200 p-4 sm:p-6 flex items-start gap-3.5 text-slate-800">
          <Clock className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm">Credential Validity Period Elapsed</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              This credential reached its standard expiration date on {formatDate(data.expiry_date)}.
              The historical award remains authentic on archive record.
            </p>
          </div>
        </div>
      )}

      {/* Core Credential Record Details */}
      <div className="p-6 sm:p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Candidate Information */}
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 block border-b border-slate-100 pb-2">
              Credential Holder
            </span>
            <div>
              <span className="text-xs text-slate-500 block">Full Name (English)</span>
              <p className="font-serif text-2xl font-bold text-cambria-navy">
                {data.student_name_en}
              </p>
            </div>
            {data.student_name_ar && (
              <div>
                <span className="text-xs text-slate-500 block">Full Name (Arabic)</span>
                <p className="text-xl font-bold text-cambria-academic font-arabic" dir="rtl">
                  {data.student_name_ar}
                </p>
              </div>
            )}
            <div>
              <span className="text-xs text-slate-500 block">Program Qualification</span>
              <p className="text-sm font-semibold text-slate-800">
                {data.program_name_en}
              </p>
              {data.program_name_ar && (
                <p className="text-xs text-slate-500 font-arabic pt-0.5" dir="rtl">
                  {data.program_name_ar}
                </p>
              )}
            </div>
          </div>

          {/* Institutional Identifier & Dates */}
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 block border-b border-slate-100 pb-2">
              Verification Metadata
            </span>
            <div>
              <span className="text-xs text-slate-500 block">Official Credential Serial Number</span>
              <p className="font-mono text-lg font-bold text-cambria-navy">
                {data.credential_number}
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Verification Token</span>
              <p className="font-mono text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-200 inline-block">
                {data.verification_token}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <span className="text-xs text-slate-500 block">Conferral / Issue Date</span>
                <p className="text-sm font-semibold text-slate-800">
                  {formatDate(data.issue_date)}
                </p>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Expiration Date</span>
                <p className="text-sm font-semibold text-slate-800">
                  {data.expiry_date ? formatDate(data.expiry_date) : "Indefinite / Permanent"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Issued Documents Section (Certificate + Student Card) */}
        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-cambria-navy">
                Associated Digital Documents
              </h3>
              <p className="text-xs text-slate-500">
                Official documents issued under this credential identity. Both share this exact verification record.
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              {data.documents.length} Available
            </span>
          </div>

          {data.documents.length === 0 ? (
            <div className="p-4 bg-slate-50 rounded-[4px] border border-slate-200 text-xs text-slate-500 text-center">
              Documents are in preparation or awaiting final registrar publication.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.documents.map((doc, idx) => {
                const isCard = doc.document_type === "student_card";
                return (
                  <div
                    key={idx}
                    className="p-4 border border-slate-200 rounded-[6px] bg-slate-50/50 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[4px] bg-white border border-slate-200 flex items-center justify-center text-cambria-navy shrink-0">
                        {isCard ? (
                          <CreditCard className="w-5 h-5 text-cambria-academic" />
                        ) : (
                          <FileText className="w-5 h-5 text-cambria-navy" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-cambria-navy">
                          {isCard ? "Official Student Card" : "Official Certificate & Diploma"}
                        </h4>
                        <span className="text-[11px] text-slate-500 uppercase tracking-wider block">
                          PDF • Verifiable Cryptographic Copy
                        </span>
                      </div>
                    </div>

                    <a
                      href={doc.file_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0"
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 border-slate-300 hover:border-cambria-navy"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </Button>
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Security & Verification Seal Footer */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Cryptographically sealed by Cambria Transnational Academic Ledger.</span>
          </div>
          <div>
            <span>Verified at: {new Date().toUTCString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
