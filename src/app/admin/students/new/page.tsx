"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { createStudentAction } from "@/actions/students";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, UserPlus, AlertCircle, ShieldAlert } from "lucide-react";

export default function NewStudentPage() {
  const [state, formAction, isPending] = useActionState(createStudentAction, null);

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/students">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-slate-500">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Students
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="font-serif text-3xl font-bold text-cambria-navy tracking-tight">
          Register New Scholar
        </h1>
        <p className="text-sm text-slate-500 pt-0.5">
          Record student identity for official credential conferral and bilingual certificate generation.
        </p>
      </div>

      <Card className="shadow-card">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="text-xl">Student Identity Dossier</CardTitle>
          <p className="text-xs text-slate-500">
            All fields marked with <span className="text-rose-600 font-bold">*</span> are required.
          </p>
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
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Student Institutional ID <span className="text-rose-600">*</span>
                </label>
                <Input
                  name="student_id_number"
                  required
                  placeholder="e.g. STU-2026-000189"
                  defaultValue={`STU-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`}
                  className="font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Institutional Email Address <span className="text-rose-600">*</span>
                </label>
                <Input
                  name="email"
                  type="email"
                  required
                  placeholder="e.g. scholar@example.org"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Full Name in English (Parchment Title) <span className="text-rose-600">*</span>
                </label>
                <Input
                  name="full_name_en"
                  required
                  placeholder="e.g. Tariq Mansoor Al-Hashimi"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Full Name in Arabic (الاسم الكامل بالعربية) <span className="text-rose-600">*</span>
                </label>
                <Input
                  name="full_name_ar"
                  required
                  dir="rtl"
                  placeholder="مثال: طارق منصور الهاشمي"
                  className="font-arabic"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-[4px] space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-cambria-navy">
                <ShieldAlert className="w-4 h-4 text-[#C8A84E]" />
                <span>Sensitive Identity Protection (RLS Restricted)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    National ID / Passport Number <span className="text-rose-600">*</span>
                  </label>
                  <Input
                    name="national_id"
                    required
                    placeholder="e.g. ID-94829104"
                    className="font-mono bg-white"
                  />
                  <p className="text-[11px] text-slate-500">
                    Protected behind RLS. Never exposed to the public verification endpoint.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Nationality
                  </label>
                  <Input
                    name="nationality"
                    placeholder="e.g. British, Jordanian, Emirati"
                    className="bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Contact Phone
                </label>
                <Input
                  name="phone"
                  placeholder="e.g. +44 20 7946 0912"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Date of Birth
                </label>
                <Input
                  name="birth_date"
                  type="date"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Gender
                </label>
                <select
                  name="gender"
                  className="flex h-10 w-full rounded-[4px] border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cambria-academic"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Link href="/admin/students">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-cambria-navy hover:bg-cambria-academic text-white font-semibold gap-2"
              >
                <UserPlus className="w-4 h-4" />
                {isPending ? "Recording Student..." : "Register Student"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
