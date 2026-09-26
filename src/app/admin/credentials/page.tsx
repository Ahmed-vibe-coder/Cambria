import Link from "next/link";
import { getCredentials } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/utils";
import { Award, PlusCircle, ExternalLink, FileText, CreditCard } from "lucide-react";

export default async function AdminCredentialsPage() {
  const credentials = await getCredentials();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-cambria-navy tracking-tight">
            Institutional Credentials Registry
          </h1>
          <p className="text-sm text-slate-500 pt-0.5">
            Central repository of all conferred awards, certificates, and student identification cards.
          </p>
        </div>

        <Link href="/admin/credentials/new">
          <Button size="sm" className="gap-2 bg-cambria-navy hover:bg-cambria-academic text-white">
            <PlusCircle className="w-4 h-4" />
            Issue Credential
          </Button>
        </Link>
      </div>

      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-cambria-academic" />
            <CardTitle className="text-lg">Conferred Records: {credentials.length}</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3">Credential ID</th>
                  <th className="px-6 py-3">Candidate Scholar</th>
                  <th className="px-6 py-3">Academic Program</th>
                  <th className="px-6 py-3">Issue Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Attached Docs</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {credentials.map((cred) => {
                  const hasCert = cred.documents?.some((d) => d.document_type === "certificate");
                  const hasCard = cred.documents?.some((d) => d.document_type === "student_card");

                  return (
                    <tr key={cred.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-cambria-navy">
                        {cred.credential_number}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-800 block">
                          {cred.student?.full_name_en}
                        </span>
                        <span className="text-[11px] text-slate-500 font-arabic" dir="rtl">
                          {cred.student?.full_name_ar}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 max-w-[220px]">
                        {cred.program?.name}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {formatDate(cred.issue_date)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={cred.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          {hasCert && (
                            <span className="p-1 rounded bg-slate-100 text-cambria-navy" title="Certificate Attached">
                              <FileText className="w-3.5 h-3.5" />
                            </span>
                          )}
                          {hasCard && (
                            <span className="p-1 rounded bg-slate-100 text-cambria-academic" title="Student Card Attached">
                              <CreditCard className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/verify/${cred.verification_token}`} target="_blank">
                            <Button size="sm" variant="ghost" className="h-7 px-2 text-slate-500 hover:text-cambria-navy">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                          <Link href={`/admin/credentials/${cred.id}`}>
                            <Button size="sm" variant="outline" className="text-xs h-7 px-2.5">
                              Manage
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
