import React from "react";
import Link from "next/link";
import { getCredentials } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { FileText, CreditCard, Download, ExternalLink, Award } from "lucide-react";

export default async function AdminDocumentsPage() {
  const credentials = await getCredentials();

  // Flatten all documents
  const allDocuments = credentials.flatMap((c) =>
    (c.documents || []).map((d) => ({
      ...d,
      credential: c,
    }))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-cambria-navy tracking-tight">
            Digital Documents Repository
          </h1>
          <p className="text-sm text-slate-500 pt-0.5">
            Visual gallery of generated parchment diplomas and plastic student identification cards.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allDocuments.map((doc) => {
          const isCard = doc.document_type === "student_card";
          const cred = doc.credential;

          return (
            <Card key={doc.id} className="shadow-card overflow-hidden flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isCard ? (
                      <CreditCard className="w-4 h-4 text-cambria-academic" />
                    ) : (
                      <FileText className="w-4 h-4 text-cambria-navy" />
                    )}
                    <span className="font-serif text-sm font-bold text-cambria-navy">
                      {isCard ? "Student Identification Card" : "Official Diploma Parchment"}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#C8A84E]">
                    {cred.credential_number}
                  </span>
                </div>

                {/* Preview Thumbnail */}
                <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-center min-h-[180px]">
                  {doc.thumbnail_path ? (
                    <img
                      src={doc.thumbnail_path}
                      alt="Document Thumbnail"
                      className="max-h-[160px] object-contain rounded border border-slate-200 shadow-sm"
                    />
                  ) : (
                    <div className="text-center text-xs text-slate-400 space-y-1">
                      <FileText className="w-10 h-10 mx-auto text-slate-300" />
                      <span>Document file ready</span>
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="p-4 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Candidate</span>
                    <span className="font-bold text-slate-800 text-sm block">
                      {cred.student?.full_name_en}
                    </span>
                    <span className="text-[11px] text-slate-500 font-arabic" dir="rtl">
                      {cred.student?.full_name_ar}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Program</span>
                    <span className="text-slate-700 block truncate">
                      {cred.program?.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link href={`/admin/credentials/${cred.id}`}>
                  <Button variant="ghost" size="sm" className="text-xs text-cambria-academic hover:bg-cambria-soft">
                    Manage Credential
                  </Button>
                </Link>

                {doc.file_path && (
                  <a href={doc.file_path} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="text-xs gap-1.5 border-slate-300">
                      <Download className="w-3.5 h-3.5" />
                      Download PDF
                    </Button>
                  </a>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
