"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { createProgramAction } from "@/actions/programs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, GraduationCap, AlertCircle } from "lucide-react";

export default function NewProgramPage() {
  const [state, formAction, isPending] = useActionState(createProgramAction, null);

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/programs">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-slate-500">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Programs
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="font-serif text-3xl font-bold text-cambria-navy tracking-tight">
          Create Academic Curriculum
        </h1>
        <p className="text-sm text-slate-500 pt-0.5">
          Define a new qualification framework for credential conferral and digital diplomas.
        </p>
      </div>

      <Card className="shadow-card">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="text-xl">Program Specifications</CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          {state?.error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-[4px] text-xs text-rose-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
              <span>{state.error}</span>
            </div>
          )}

          <form action={formAction} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Curriculum Code <span className="text-rose-600">*</span>
                </label>
                <Input
                  name="code"
                  required
                  placeholder="e.g. EMBA-702"
                  className="font-mono uppercase"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Qualification Level <span className="text-rose-600">*</span>
                </label>
                <select
                  name="degree_level"
                  className="flex h-10 w-full rounded-[4px] border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cambria-academic"
                >
                  <option value="professional_masters">Professional Master&apos;s Degree</option>
                  <option value="professional_diploma">Professional Diploma</option>
                  <option value="training_course">Executive Training Course</option>
                  <option value="other">Other Academic Qualification</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Program Title (English) <span className="text-rose-600">*</span>
                </label>
                <Input
                  name="name"
                  required
                  placeholder="e.g. Executive Master of Business Governance"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Program Title (Arabic) <span className="text-rose-600">*</span>
                </label>
                <Input
                  name="name_ar"
                  required
                  dir="rtl"
                  placeholder="مثال: الماجستير التنفيذي في حوكمة الأعمال"
                  className="font-arabic"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Program Duration
                </label>
                <Input
                  name="duration"
                  placeholder="e.g. 18 Months (Full-Time)"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Academic Credit Units (ECTS Equivalent)
                </label>
                <Input
                  name="credits"
                  type="number"
                  defaultValue="60"
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                English Curriculum Description
              </label>
              <textarea
                name="description"
                rows={3}
                className="w-full rounded-[4px] border border-slate-300 bg-white p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cambria-academic"
                placeholder="Comprehensive description of competencies, learning outcomes, and assessment criteria..."
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Link href="/admin/programs">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-cambria-navy hover:bg-cambria-academic text-white font-semibold gap-2"
              >
                <GraduationCap className="w-4 h-4" />
                {isPending ? "Registering Program..." : "Create Academic Program"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
