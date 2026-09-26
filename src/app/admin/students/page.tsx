import React from "react";
import Link from "next/link";
import { getStudents, getCredentials } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { maskNationalId, formatDate } from "@/lib/utils";
import { Users, UserPlus, Search, ArrowRight, Award } from "lucide-react";

export default async function AdminStudentsPage() {
  const [students, credentials] = await Promise.all([
    getStudents(),
    getCredentials(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-cambria-navy tracking-tight">
            Registered Scholars Directory
          </h1>
          <p className="text-sm text-slate-500 pt-0.5">
            Manage student records, masked national identities, and linked credentials.
          </p>
        </div>

        <Link href="/admin/students/new">
          <Button size="sm" className="gap-2 bg-cambria-navy hover:bg-cambria-academic text-white">
            <UserPlus className="w-4 h-4" />
            Register Student
          </Button>
        </Link>
      </div>

      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cambria-academic" />
            <CardTitle className="text-lg">Total Enrolled: {students.length}</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3">Student ID</th>
                  <th className="px-6 py-3">Full Name (English)</th>
                  <th className="px-6 py-3">Full Name (Arabic)</th>
                  <th className="px-6 py-3">National ID (Masked)</th>
                  <th className="px-6 py-3">Email Address</th>
                  <th className="px-6 py-3">Credentials</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((stu) => {
                  const linkedCreds = credentials.filter((c) => c.student_id === stu.id);
                  return (
                    <tr key={stu.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4 font-mono font-semibold text-cambria-navy">
                        {stu.student_id_number}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {stu.full_name_en}
                      </td>
                      <td className="px-6 py-4 font-arabic text-sm font-semibold text-slate-600" dir="rtl">
                        {stu.full_name_ar}
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-500">
                        {maskNationalId(stu.national_id)}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {stu.email}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 font-semibold px-2 py-0.5 bg-cambria-soft rounded text-cambria-navy">
                          <Award className="w-3 h-3 text-[#C8A84E]" />
                          {linkedCreds.length} Issued
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/admin/students/${stu.id}`}>
                          <Button size="sm" variant="outline" className="text-xs h-7 px-2.5">
                            Profile
                          </Button>
                        </Link>
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
