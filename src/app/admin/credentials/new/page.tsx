"use client";

import React, { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { createCredentialAction } from "@/actions/credentials";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Award, ShieldCheck, AlertCircle, Info, Sparkles } from "lucide-react";
import { Student, Program, Template } from "@/types/database";
import { TemplateVisualPicker } from "@/components/admin/template-visual-picker";

export default function NewCredentialPage() {
  const [state, formAction, isPending] = useActionState(createCredentialAction, null);
  const [students, setStudents] = useState<Student[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  // Dynamic visual template selection states
  const [selectedCertTemplateId, setSelectedCertTemplateId] = useState<string>("");
  const [selectedCardTemplateId, setSelectedCardTemplateId] = useState<string>("");
  const [generateCertificate, setGenerateCertificate] = useState<boolean>(true);
  const [generateStudentCard, setGenerateStudentCard] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [resStudents, resPrograms, resTemplates] = await Promise.all([
          fetch("/api/admin-data?type=students").then((r) => r.json()),
          fetch("/api/admin-data?type=programs").then((r) => r.json()),
          fetch("/api/admin-data?type=templates").then((r) => r.json()),
        ]);
        const loadedTemplates: Template[] = resTemplates || [];
        setStudents(resStudents || []);
        setPrograms(resPrograms || []);
        setTemplates(loadedTemplates);

        // Pre-select active default templates
        const defaultCert =
          loadedTemplates.find((t) => t.template_kind === "certificate" && t.is_active) ||
          loadedTemplates.find((t) => t.template_kind === "certificate");
        if (defaultCert) setSelectedCertTemplateId(defaultCert.id);

        const defaultCard =
          loadedTemplates.find((t) => t.template_kind === "student_card" && t.is_active) ||
          loadedTemplates.find((t) => t.template_kind === "student_card");
        if (defaultCard) setSelectedCardTemplateId(defaultCard.id);
      } catch {
        // Fallback handled gracefully
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="max-w-4xl space-y-6">
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
          Confer a verifiable credential to an enrolled scholar. Select visual certificate and student card designs with real-time previews.
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

            {/* Visual Document Generation Options */}
            <div className="p-5 sm:p-6 bg-slate-50 border border-slate-200 rounded-[8px] space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-cambria-navy block">
                    Generate Official Documents
                  </span>
                  <p className="text-[11px] text-slate-500 pt-0.5">
                    Choose visual designs for documents to be generated upon credential issuance.
                  </p>
                </div>
                <Link
                  href="/admin/templates/new"
                  target="_blank"
                  className="text-xs text-cambria-academic hover:underline font-semibold flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C8A84E]" />
                  + Create New Template
                </Link>
              </div>

              {/* Certificate Visual Selector */}
              <div className="space-y-3.5 p-4 sm:p-5 bg-white border border-slate-200 rounded-[8px] shadow-2xs">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-3 text-sm text-slate-800 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="generate_certificate"
                      checked={generateCertificate}
                      onChange={(e) => setGenerateCertificate(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-cambria-navy focus:ring-cambria-academic"
                    />
                    <span>
                      Generate <strong>Official Certificate / Diploma</strong>
                    </span>
                  </label>
                  {generateCertificate && (
                    <span className="text-[11px] text-slate-400 font-medium">
                      Select Certificate Design
                    </span>
                  )}
                </div>

                {generateCertificate && (
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-slate-700">
                        Certificate Design Template:
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {templates.filter((t) => t.template_kind === "certificate").length} templates available
                      </span>
                    </div>

                    <TemplateVisualPicker
                      templates={templates}
                      selectedId={selectedCertTemplateId}
                      onSelect={(id) => setSelectedCertTemplateId(id)}
                      name="certificate_template_id"
                      kind="certificate"
                      disabled={!generateCertificate}
                    />
                  </div>
                )}
              </div>

              {/* Student Card Visual Selector */}
              <div className="space-y-3.5 p-4 sm:p-5 bg-white border border-slate-200 rounded-[8px] shadow-2xs">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-3 text-sm text-slate-800 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="generate_student_card"
                      checked={generateStudentCard}
                      onChange={(e) => setGenerateStudentCard(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-cambria-navy focus:ring-cambria-academic"
                    />
                    <span>
                      Generate <strong>Official Student Identification Card</strong>
                    </span>
                  </label>
                  {generateStudentCard && (
                    <span className="text-[11px] text-slate-400 font-medium">
                      Select Student Card Design
                    </span>
                  )}
                </div>

                {generateStudentCard && (
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-slate-700">
                        Student Card Design Template:
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {templates.filter((t) => t.template_kind === "student_card").length} templates available
                      </span>
                    </div>

                    <TemplateVisualPicker
                      templates={templates}
                      selectedId={selectedCardTemplateId}
                      onSelect={(id) => setSelectedCardTemplateId(id)}
                      name="card_template_id"
                      kind="student_card"
                      disabled={!generateStudentCard}
                    />
                  </div>
                )}
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
