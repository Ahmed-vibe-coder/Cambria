import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStudentById, getCredentials } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { maskNationalId, formatDate } from "@/lib/utils";
import { ArrowLeft, User, Award, PlusCircle, Calendar, Mail, Phone, Globe, Shield } from "lucide-react";

interface StudentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function StudentDetailPage({ params }: StudentDetailPageProps) {
  const { id } = await params;
  const student = await getStudentById(id);

  if (!student) {
    notFound();
  }

  const allCredentials = await getCredentials();
  const studentCredentials = allCredentials.filter((c) => c.student_id === student.id);

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <Link href="/admin/students">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-slate-500">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Students Directory
          </Button>
        </Link>

        <Link href={`/admin/credentials/new?student_id=${student.id}`}>
          <Button size="sm" className="gap-1.5 bg-cambria-navy hover:bg-cambria-academic text-white">
            <PlusCircle className="w-4 h-4" />
            Issue Credential to Scholar
          </Button>
        </Link>
      </div>

      {/* Student Profile Card */}
      <Card className="shadow-card">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-cambria-soft border border-blue-200 flex items-center justify-center text-cambria-navy font-serif text-2xl font-bold">
                {student.full_name_en.charAt(0)}
              </div>
              <div>
                <span className="font-mono text-xs text-slate-500 uppercase">
                  {student.student_id_number}
                </span>
                <h1 className="font-serif text-2xl font-bold text-cambria-navy">
                  {student.full_name_en}
                </h1>
                <p className="text-sm font-semibold text-cambria-academic font-arabic" dir="rtl">
                  {student.full_name_ar}
                </p>
              </div>
            </div>

            <div className="text-right text-xs text-slate-500">
              <span>Registered on: {formatDate(student.created_at)}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 block font-medium">Email Address</span>
              <div className="flex items-center gap-1.5 text-slate-800 font-semibold text-sm">
                <Mail className="w-4 h-4 text-cambria-academic" />
                <span>{student.email}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 block font-medium">Telephone</span>
              <div className="flex items-center gap-1.5 text-slate-800 font-semibold text-sm">
                <Phone className="w-4 h-4 text-cambria-academic" />
                <span>{student.phone || "Not recorded"}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 block font-medium">National ID (Masked)</span>
              <div className="flex items-center gap-1.5 text-slate-800 font-mono font-semibold text-sm">
                <Shield className="w-4 h-4 text-[#C8A84E]" />
                <span>{maskNationalId(student.national_id)}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 block font-medium">Nationality & Gender</span>
              <div className="flex items-center gap-1.5 text-slate-800 font-semibold text-sm">
                <Globe className="w-4 h-4 text-cambria-academic" />
                <span>{student.nationality || "International"} • {student.gender || "Unspecified"}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Linked Credentials Section */}
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <CardTitle className="text-xl">Conferred Credentials</CardTitle>
            <p className="text-xs text-slate-500">
              Certificates and student cards issued to this student.
            </p>
          </div>
          <span className="font-semibold text-xs px-2.5 py-0.5 rounded bg-cambria-soft text-cambria-navy">
            {studentCredentials.length} Total
          </span>
        </CardHeader>

        <CardContent className="p-0">
          {studentCredentials.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 space-y-3">
              <Award className="w-8 h-8 text-slate-400 mx-auto" />
              <p>No credentials have been conferred to this student yet.</p>
              <Link href={`/admin/credentials/new?student_id=${student.id}`}>
                <Button size="sm" className="bg-cambria-navy text-white">
                  Issue First Credential
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {studentCredentials.map((c) => (
                <div key={c.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cambria-navy">
                        {c.credential_number}
                      </span>
                      <StatusBadge status={c.status} />
                    </div>
                    <h4 className="font-serif text-lg font-bold text-cambria-navy">
                      {c.program?.name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Conferred on: {formatDate(c.issue_date)} • Expires: {c.expiry_date ? formatDate(c.expiry_date) : "Indefinite"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/verify/${c.verification_token}`} target="_blank">
                      <Button variant="outline" size="sm" className="text-xs">
                        Public Record
                      </Button>
                    </Link>
                    <Link href={`/admin/credentials/${c.id}`}>
                      <Button size="sm" className="bg-cambria-navy hover:bg-cambria-academic text-white text-xs">
                        Manage Documents
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
