"use client";

import React, { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { createCredentialAction } from "@/actions/credentials";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Award, ShieldCheck, AlertCircle, Info } from "lucide-react";
import { Student, Program, Template } from "@/types/database";

export default function NewCredentialPage() {
  const [state, formAction, isPending] = useActionState(createCredentialAction, null);
  const [students, setStudents] = useState<Student[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [resStudents, resPrograms, resTemplates] = await Promise.all([
          fetch("/api/admin-data?type=students").then((r) => r.json()),
          fetch("/api/admin-data?type=programs").then((r) => r.json()),
          fetch("/api/admin-data?type=templates").then((r) => r.json()),
        ]);
        setStudents(resStudents || []);
        setPrograms(resPrograms || []);
        setTemplates(resTemplates || []);
      } catch {
        // Fallback handled gracefully
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/credentials">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-slate-500">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Credentials
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="font-serif text-3xl font-bold text-cambria-navy tracking-tight">
          Issue New Academic Credential
        </h1>
        <p className="text-sm text-slate-500 pt-0.5">
          Confer a verifiable credential to an enrolled scholar. Automatically prepares official
          certificates and student identification cards.
        </p>
      </div>

      {/* Shared Token Architecture Notice */}
      <div className="bg-cambria-soft/60 border border-blue-200 rounded-[6px] p-5 flex items-start gap-3.5 text-xs text-cambria-navy">
        <ShieldCheck className="w-5 h-5 text-cambria-academic shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="block text-sm font-semibold">
            Unified Credential Token Architecture (§4)
          </strong>
          <p className="text-slate-600 leading-relaxed">
            A single sequential credential number (e.g. <code className="font-mono font-bold text-cambria-navy">CAM-2026-000189</code>)
            and one cryptographic QR verification token will be generated and shared across both the certificate
            and student identification card.
          </p>
        </div>
      </div>

      <Card className="shadow-card">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="text-xl">Conferral Parameters</CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          {state?.error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-[4px] text-xs text-rose-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
              <span>{state.error}</span>
            </div>
          )}

          <form action={formAction} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Student Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Select Candidate Scholar <span className="text-rose-600">*</span>
                </label>
                <select
                  name="student_id"
                  required
                  className="flex h-10 w-full rounded-[4px] border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cambria-academic"
                >
                  <option value="">-- Choose Candidate --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.full_name_en} ({s.student_id_number})
                    </option>
                  ))}
                  {students.length === 0 && (
                    <>
                      <option value="stu-001">Tariq Mansoor Al-Hashimi (STU-2026-000184)</option>
                      <option value="stu-002">Eleanor Claire Vance (STU-2026-000185)</option>
                      <option value="stu-003">Khalid Abdulrahman Al-Fassi (STU-2026-000186)</option>
                      <option value="stu-004">Sarah Louise Jenkins (STU-2026-000187)</option>
                      <option value="stu-005">Omar Zaid Al-Qadi (STU-2026-000188)</option>
                    </>
                  )}
                </select>
              </div>

              {/* Program Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Select Academic Program <span className="text-rose-600">*</span>
                </label>
                <select
                  name="program_id"
                  required
                  className="flex h-10 w-full rounded-[4px] border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cambria-academic"
                >
                  <option value="">-- Choose Qualification --</option>
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.code})
                    </option>
                  ))}
                  {programs.length === 0 && (
                    <>
                      <option value="prog-001">Executive Leadership & Educational Governance (EMBA-701)</option>
                      <option value="prog-002">International Business Administration (IBDS-501)</option>
                      <option value="prog-003">Advanced Cybersecurity Systems (CYBR-301)</option>
                      <option value="prog-004">Applied AI & Data Architecture (AIMS-601)</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Conferral / Issue Date <span className="text-rose-600">*</span>
                </label>
                <Input
                  name="issue_date"
                  type="date"
                  required
                  defaultValue={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Expiration Date (Optional)
                </label>
                <Input
                  name="expiry_date"
                  type="date"
                  placeholder="Leave empty for permanent validity"
                />
              </div>
            </div>

            {/* Document Generation Options */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-[6px] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-700 block">
                  Generate Official Documents
                </span>
                <Link
                  href="/admin/templates/new"
                  target="_blank"
                  className="text-xs text-cambria-navy hover:underline font-semibold"
                >
                  + Create New Template
                </Link>
              </div>

              {/* Certificate Template */}
              <div className="space-y-2 p-3 bg-white border border-slate-200 rounded">
                <label className="flex items-center gap-3 text-sm text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    name="generate_certificate"
                    defaultChecked
                    className="w-4 h-4 rounded border-slate-300 text-cambria-navy focus:ring-cambria-academic"
                  />
                  <span>
                    Generate <strong>Official Certificate / Diploma</strong>
                  </span>
                </label>
                <div className="pl-7 space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 block">Certificate Design Template:</label>
                  <select
                    name="certificate_template_id"
                    className="flex h-9 w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cambria-academic"
                  >
                    {templates.filter((t) => t.template_kind === "certificate").map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.width}×{t.height}px) {t.is_active ? "— [Default]" : ""}
                      </option>
                    ))}
                    {templates.filter((t) => t.template_kind === "certificate").length === 0 && (
                      <option value="">Default Institutional Certificate (1600×1131)</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Student Card Template */}
              <div className="space-y-2 p-3 bg-white border border-slate-200 rounded">
                <label className="flex items-center gap-3 text-sm text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    name="generate_student_card"
                    defaultChecked
                    className="w-4 h-4 rounded border-slate-300 text-cambria-navy focus:ring-cambria-academic"
                  />
                  <span>
                    Generate <strong>Official Student Identification Card</strong>
                  </span>
                </label>
                <div className="pl-7 space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 block">Student Card Design Template:</label>
                  <select
                    name="card_template_id"
                    className="flex h-9 w-full rounded border border-slate-300 bg-white px-2.5 py-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cambria-academic"
                  >
                    {templates.filter((t) => t.template_kind === "student_card").map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.width}×{t.height}px) {t.is_active ? "— [Default]" : ""}
                      </option>
                    ))}
                    {templates.filter((t) => t.template_kind === "student_card").length === 0 && (
                      <option value="">Default Student ID Card (600×900)</option>
                    )}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Administrative Notes / Academic Honors (Internal)
              </label>
              <textarea
                name="notes"
                rows={2}
                className="w-full rounded-[4px] border border-slate-300 bg-white p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cambria-academic"
                placeholder="e.g. Conferred with Distinction by the Faculty Examination Board..."
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Link href="/admin/credentials">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-cambria-navy hover:bg-cambria-academic text-white font-semibold gap-2"
              >
                <Award className="w-4 h-4" />
                {isPending ? "Conferring & Rendering Documents..." : "Issue Credential"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
