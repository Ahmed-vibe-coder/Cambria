import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCredentialById, getAuditLogs } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/utils";
import { transitionStatusAction, regenerateDocumentAction } from "@/actions/credentials";
import {
  ArrowLeft,
  Award,
  ExternalLink,
  Download,
  RefreshCw,
  AlertTriangle,
  XCircle,
  CheckCircle,
  FileText,
  CreditCard,
  History,
  QrCode,
  Shield,
} from "lucide-react";

interface CredentialDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CredentialDetailPage({ params }: CredentialDetailPageProps) {
  const { id } = await params;
  const credential = await getCredentialById(id);

  if (!credential) {
    notFound();
  }

  const allLogs = await getAuditLogs();
  const credentialLogs = allLogs.filter(
    (l) => l.entity_id === credential.id || l.entity_id.startsWith("doc-")
  );

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/credentials">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-slate-500">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Credentials
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/verify/${credential.verification_token}`} target="_blank">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs border-slate-300">
              <ExternalLink className="w-3.5 h-3.5" />
              View Public Verify Record
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Credential Identity Card */}
      <Card className="shadow-card">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-lg font-bold text-cambria-navy">
                  {credential.credential_number}
                </span>
                <StatusBadge status={credential.status} />
              </div>
              <h1 className="font-serif text-2xl font-bold text-cambria-navy">
                {credential.program?.name}
              </h1>
            </div>

            <div className="text-right text-xs text-slate-500">
              <span>Token: </span>
              <code className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                {credential.verification_token}
              </code>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Candidate Scholar</span>
              <Link
                href={`/admin/students/${credential.student_id}`}
                className="font-semibold text-cambria-academic hover:underline text-sm block"
              >
                {credential.student?.full_name_en}
              </Link>
              <span className="text-[11px] text-slate-500 font-arabic" dir="rtl">
                {credential.student?.full_name_ar}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Academic Program</span>
              <span className="font-semibold text-slate-800 text-sm block">
                {credential.program?.name}
              </span>
              <span className="text-[11px] text-slate-500 uppercase">
                {credential.program?.code} • {credential.program?.degree_level?.replace("_", " ")}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Conferral & Expiry Dates</span>
              <span className="font-semibold text-slate-800 text-sm block">
                Issued: {formatDate(credential.issue_date)}
              </span>
              <span className="text-[11px] text-slate-500">
                Expires: {credential.expiry_date ? formatDate(credential.expiry_date) : "Permanent"}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Administrative Notes</span>
              <p className="text-xs text-slate-600 line-clamp-2">
                {credential.notes || "Standard issuance on institutional record."}
              </p>
            </div>
          </div>

          {/* Revocation / Suspension Notice */}
          {credential.status === "revoked" && (
            <div className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-[4px] text-xs text-rose-900 space-y-1">
              <strong className="block font-semibold">Credential Revoked by Institutional Order</strong>
              <p>Reason: {credential.revocation_reason}</p>
              <p className="text-slate-500 text-[11px]">Revoked at: {formatDate(credential.revoked_at)}</p>
            </div>
          )}

          {credential.status === "suspended" && (
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-[4px] text-xs text-amber-900 space-y-1">
              <strong className="block font-semibold">Credential Temporarily Suspended</strong>
              <p>Reason: {credential.suspension_reason}</p>
              <p className="text-slate-500 text-[11px]">Suspended at: {formatDate(credential.suspended_at)}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attached Documents Section (§4 & §6) */}
      <div className="space-y-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-cambria-navy">
            Attached Documents & Version Ledger
          </h2>
          <p className="text-xs text-slate-500">
            Both certificate and card share the identical credential number ({credential.credential_number}) and verification token.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {credential.documents?.map((doc) => {
            const isCard = doc.document_type === "student_card";
            const versionCount = doc.versions?.length || 1;

            return (
              <Card key={doc.id} className="shadow-card overflow-hidden">
                <CardHeader className="bg-slate-50/80 border-b border-slate-100 p-4 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isCard ? (
                      <CreditCard className="w-4 h-4 text-cambria-academic" />
                    ) : (
                      <FileText className="w-4 h-4 text-cambria-navy" />
                    )}
                    <CardTitle className="text-base">
                      {isCard ? "Official Student ID Card" : "Official Parchment Certificate"}
                    </CardTitle>
                  </div>
                  <span className="text-[11px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                    Active Version: v{versionCount}
                  </span>
                </CardHeader>

                <CardContent className="p-6 space-y-5">
                  {/* Thumbnail / Document Preview */}
                  <div className="border border-slate-200 rounded-[4px] p-2 bg-slate-50 flex items-center justify-center min-h-[160px]">
                    {doc.thumbnail_path ? (
                      <img
                        src={doc.thumbnail_path}
                        alt="Document Preview"
                        className="max-h-[150px] object-contain rounded shadow-sm border border-slate-200"
                      />
                    ) : (
                      <div className="text-center text-xs text-slate-400 space-y-1">
                        <FileText className="w-8 h-8 mx-auto text-slate-300" />
                        <span>Ready for generation</span>
                      </div>
                    )}
                  </div>

                  {/* Document Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    {doc.file_path ? (
                      <a href={doc.file_path} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline" className="text-xs gap-1.5">
                          <Download className="w-3.5 h-3.5" />
                          Download PDF
                        </Button>
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400">PDF not generated yet</span>
                    )}

                    {/* Regeneration Form (creates new version, preserves token) */}
                    <form action={regenerateDocumentAction}>
                      <input type="hidden" name="credential_document_id" value={doc.id} />
                      <input type="hidden" name="credential_id" value={credential.id} />
                      <input type="hidden" name="document_type" value={doc.document_type} />
                      <Button
                        type="submit"
                        size="sm"
                        className="text-xs gap-1.5 bg-cambria-navy hover:bg-cambria-academic text-white"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Regenerate (v{versionCount + 1})
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Lifecycle State Machine Transitions (§8) */}
      <Card className="shadow-card">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="text-lg">Credential Lifecycle Management</CardTitle>
          <p className="text-xs text-slate-500">
            Adjudicate status transitions according to Academic Integrity Bylaws. Every transition writes to the audit log.
          </p>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Revoke Credential */}
            <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-[6px] space-y-3">
              <div className="flex items-center gap-2 text-rose-900 font-semibold text-xs">
                <XCircle className="w-4 h-4 text-rose-700" />
                <span>Revoke Credential (Terminal)</span>
              </div>
              <p className="text-[11px] text-rose-800 leading-relaxed">
                Permanently cancels the award. Displays as Revoked on public verification.
              </p>
              <form action={transitionStatusAction} className="space-y-2">
                <input type="hidden" name="credential_id" value={credential.id} />
                <input type="hidden" name="to_status" value="revoked" />
                <textarea
                  name="reason"
                  required
                  rows={2}
                  placeholder="Mandatory disciplinary reason..."
                  className="w-full text-xs p-2 rounded border border-rose-300 bg-white"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="destructive"
                  className="w-full text-xs"
                  disabled={credential.status === "revoked"}
                >
                  Confirm Revocation
                </Button>
              </form>
            </div>

            {/* 2. Suspend Credential */}
            <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-[6px] space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>Suspend Credential</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Temporarily suspends validity pending academic committee inquiry.
              </p>
              <form action={transitionStatusAction} className="space-y-2">
                <input type="hidden" name="credential_id" value={credential.id} />
                <input type="hidden" name="to_status" value="suspended" />
                <textarea
                  name="reason"
                  required
                  rows={2}
                  placeholder="Mandatory suspension reason..."
                  className="w-full text-xs p-2 rounded border border-amber-300 bg-white"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="w-full text-xs bg-amber-700 hover:bg-amber-800 text-white"
                  disabled={credential.status === "suspended" || credential.status === "revoked"}
                >
                  Suspend Credential
                </Button>
              </form>
            </div>

            {/* 3. Re-Activate Credential */}
            <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-[6px] space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-semibold text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-700" />
                <span>Activate / Reinstate</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Restores credential to Active and Verified status on the public ledger.
              </p>
              <form action={transitionStatusAction} className="space-y-2">
                <input type="hidden" name="credential_id" value={credential.id} />
                <input type="hidden" name="to_status" value="active" />
                <textarea
                  name="reason"
                  required
                  rows={2}
                  placeholder="Reason for reinstatement..."
                  className="w-full text-xs p-2 rounded border border-emerald-300 bg-white"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="w-full text-xs bg-emerald-700 hover:bg-emerald-800 text-white"
                  disabled={credential.status === "active"}
                >
                  Reinstate Credential
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credential Audit Trail */}
      <Card className="shadow-card">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-cambria-academic" />
            <CardTitle className="text-base">Audit Trail for this Credential</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {credentialLogs.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No historical state changes recorded.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {credentialLogs.map((log) => (
                <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 font-medium">
                      <span className="font-mono uppercase text-[10px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        {log.action}
                      </span>
                      <span className="text-slate-800">{log.reason || "Action performed"}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block">
                      Actor: {log.actor_email || "System"} • Transition: {log.from_state || "none"} → {log.to_state || "none"}
                    </span>
                  </div>
                  <span className="text-slate-400 text-[11px] shrink-0 font-mono">
                    {formatDate(log.created_at)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
