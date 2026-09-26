import React from "react";
import Link from "next/link";
import { getPrograms, getCredentials } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, PlusCircle, Award } from "lucide-react";
import { deleteProgramAction } from "@/actions/programs";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminProgramsPage() {
  const [programs, credentials] = await Promise.all([
    getPrograms(),
    getCredentials(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-cambria-navy tracking-tight">
            Academic Curricula & Programs
          </h1>
          <p className="text-sm text-slate-500 pt-0.5">
            Manage institutional courses, diplomas, and master&apos;s degree qualifications.
          </p>
        </div>

        <Link href="/admin/programs/new">
          <Button size="sm" className="gap-2 bg-cambria-navy hover:bg-cambria-academic text-white">
            <PlusCircle className="w-4 h-4" />
            Add Program
          </Button>
        </Link>
      </div>

      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-cambria-academic" />
            <CardTitle className="text-lg">Total Offerings: {programs.length}</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3">Code</th>
                  <th className="px-6 py-3">Program Title (English)</th>
                  <th className="px-6 py-3">Arabic Title</th>
                  <th className="px-6 py-3">Degree Level</th>
                  <th className="px-6 py-3">Duration & Credits</th>
                  <th className="px-6 py-3">Conferred</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {programs.map((p) => {
                  const issuedCount = credentials.filter((c) => c.program_id === p.id).length;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-cambria-navy">
                        {p.code}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800 max-w-[240px]">
                        {p.name}
                      </td>
                      <td className="px-6 py-4 font-arabic text-sm text-slate-600" dir="rtl">
                        {p.name_ar}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold uppercase text-[10px] px-2 py-0.5 rounded bg-cambria-soft text-cambria-navy border border-blue-100">
                          {p.degree_level.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {p.duration || "N/A"} • {p.credits} Credits
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                          <Award className="w-3.5 h-3.5 text-[#C8A84E]" />
                          {issuedCount} Conferred
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DeleteButton
                          id={p.id}
                          action={deleteProgramAction}
                          entityName="Program"
                          itemName={`${p.name} (${p.code})`}
                          variant="icon"
                        />
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
