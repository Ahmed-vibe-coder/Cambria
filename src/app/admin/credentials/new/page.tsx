"use client";

import React, { useActionState, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { createCredentialAction } from "@/actions/credentials";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Award,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  UserPlus,
  Users,
  Plus,
  Trash2,
  RefreshCw,
  Eye,
  CheckCircle2,
  FileText,
  Bookmark,
  GraduationCap,
  Calendar,
  Layers,
} from "lucide-react";
import { Student, Program, Template } from "@/types/database";
import { TemplateVisualPicker } from "@/components/admin/template-visual-picker";
import { LiveCertificatePreview } from "@/components/admin/live-certificate-preview";

interface CustomFieldItem {
  id: string;
  key: string;
  label: string;
  value: string;
}

export default function NewCredentialPage() {
  const [state, formAction, isPending] = useActionState(createCredentialAction, null);
  const [students, setStudents] = useState<Student[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Scholar Mode: "inline" (direct entry - default) vs "existing" (select from database)
  const [studentMode, setStudentMode] = useState<"inline" | "existing">("inline");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  // Direct Inline Student Data
  const [inlineFullNameEn, setInlineFullNameEn] = useState("");
  const [inlineFullNameAr, setInlineFullNameAr] = useState("");
  const [inlineStudentId, setInlineStudentId] = useState("");
  const [inlineNationalId, setInlineNationalId] = useState("");
  const [inlineEmail, setInlineEmail] = useState("");
  const [inlineNationality, setInlineNationality] = useState("Egyptian");
  const [inlinePhone, setInlinePhone] = useState("");
  const [inlineBirthDate, setInlineBirthDate] = useState("");
  const [inlineGender, setInlineGender] = useState("Male");
  const [saveAsStudent, setSaveAsStudent] = useState(true);

  // 2. Program & Conferral Dates
  const [selectedProgramId, setSelectedProgramId] = useState<string>("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [expiryDate, setExpiryDate] = useState("");

  // 3. Dynamic Academic & Flexible Custom Fields
  const [grade, setGrade] = useState("Excellent with First Class Honours");
  const [specialization, setSpecialization] = useState("");
  const [honors, setHonors] = useState("");
  const [customFields, setCustomFields] = useState<CustomFieldItem[]>([]);

  // 4. Template Selection & Document Generation
  const [selectedCertTemplateId, setSelectedCertTemplateId] = useState<string>("");
  const [selectedCardTemplateId, setSelectedCardTemplateId] = useState<string>("");
  const [generateCertificate, setGenerateCertificate] = useState<boolean>(true);
  const [generateStudentCard, setGenerateStudentCard] = useState<boolean>(true);

  // 5. Active Preview Document Switcher
  const [previewDocType, setPreviewDocType] = useState<"certificate" | "student_card">("certificate");

  useEffect(() => {
    async function loadData() {
      try {
        const [resStudents, resPrograms, resTemplates] = await Promise.all([
          fetch("/api/admin-data?type=students").then((r) => r.json()),
          fetch("/api/admin-data?type=programs").then((r) => r.json()),
          fetch("/api/admin-data?type=templates").then((r) => r.json()),
        ]);
        const loadedStudents: Student[] = resStudents || [];
        const loadedPrograms: Program[] = resPrograms || [];
        const loadedTemplates: Template[] = resTemplates || [];

        setStudents(loadedStudents);
        setPrograms(loadedPrograms);
        setTemplates(loadedTemplates);

        // Pre-select first program
        if (loadedPrograms.length > 0) {
          setSelectedProgramId(loadedPrograms[0].id);
        }

        // Pre-select default templates
        const defaultCert =
          loadedTemplates.find((t) => t.template_kind === "certificate" && t.is_active) ||
          loadedTemplates.find((t) => t.template_kind === "certificate");
        if (defaultCert) setSelectedCertTemplateId(defaultCert.id);

        const defaultCard =
          loadedTemplates.find((t) => t.template_kind === "student_card" && t.is_active) ||
          loadedTemplates.find((t) => t.template_kind === "student_card");
        if (defaultCard) setSelectedCardTemplateId(defaultCard.id);

        // Auto-generate starting student ID for inline mode
        const autoId = `STU-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
        setInlineStudentId(autoId);
      } catch {
        // Fallback handled gracefully
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Helper to re-generate student ID
  const handleRegenerateStudentId = () => {
    const autoId = `STU-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    setInlineStudentId(autoId);
  };

  // Helper to add custom field
  const handleAddCustomField = () => {
    const id = `cf_${Date.now()}`;
    setCustomFields((prev) => [
      ...prev,
      {
        id,
        key: `custom_attribute_${prev.length + 1}`,
        label: `Field ${prev.length + 1}`,
        value: "",
      },
    ]);
  };

  const handleUpdateCustomField = (id: string, updates: Partial<CustomFieldItem>) => {
    setCustomFields((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, ...updates };
          // If label changed, keep key synchronized if desired
          if (updates.label && (!item.key || item.key.startsWith("custom_attribute_"))) {
            updated.key = updates.label
              .toLowerCase()
              .replace(/[^a-z0-9]/g, "_")
              .slice(0, 30);
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleRemoveCustomField = (id: string) => {
    setCustomFields((prev) => prev.filter((item) => item.id !== id));
  };

  // Resolve active objects for real-time live preview
  const activeStudent = useMemo(() => {
    if (studentMode === "existing") {
      return students.find((s) => s.id === selectedStudentId);
    }
    return null;
  }, [studentMode, selectedStudentId, students]);

  const activeProgram = useMemo(() => {
    return programs.find((p) => p.id === selectedProgramId);
  }, [selectedProgramId, programs]);

  const activeCertTemplate = useMemo(() => {
    return templates.find((t) => t.id === selectedCertTemplateId);
  }, [selectedCertTemplateId, templates]);

  const activeCardTemplate = useMemo(() => {
    return templates.find((t) => t.id === selectedCardTemplateId);
  }, [selectedCardTemplateId, templates]);

  // Serialized custom fields JSON for form submission
  const customFieldsJson = useMemo(() => {
    const map: Record<string, string> = {};
    for (const item of customFields) {
      if (item.key && item.value) {
        map[item.key] = item.value;
      }
    }
    return JSON.stringify(map);
  }, [customFields]);

  // Live preview data packet
  const livePreviewData = useMemo(() => {
    const sNameEn =
      studentMode === "inline"
        ? inlineFullNameEn
        : activeStudent?.full_name_en || "";
    const sNameAr =
      studentMode === "inline"
        ? inlineFullNameAr
        : activeStudent?.full_name_ar || "";
    const sId =
      studentMode === "inline"
        ? inlineStudentId
        : activeStudent?.student_id_number || "";

    return {
      studentNameEn: sNameEn,
      studentNameAr: sNameAr,
      studentIdNumber: sId,
      programNameEn: activeProgram?.name || "Qualification Program",
      programNameAr: activeProgram?.name_ar || activeProgram?.name || "المؤهل الأكاديمي",
      issueDate: issueDate,
      expiryDate: expiryDate,
      grade: grade,
      specialization: specialization || activeProgram?.name || "",
      honors: honors,
      customFields: customFields.filter((cf) => cf.label && cf.value),
    };
  }, [
    studentMode,
    inlineFullNameEn,
    inlineFullNameAr,
    inlineStudentId,
    activeStudent,
    activeProgram,
    issueDate,
    expiryDate,
    grade,
    specialization,
    honors,
    customFields,
  ]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/admin/credentials">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-slate-500 h-8 px-2">
                <ArrowLeft className="w-3.5 h-3.5" />
                Credentials
              </Button>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-semibold text-cambria-academic uppercase tracking-wider">
              Issue & Conferral
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-cambria-navy tracking-tight">
            Issue New Academic Credential
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Confer an official certificate or student ID card. Type scholar details directly or select from records, with instant live certificate simulation.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link href="/admin/templates">
            <Button variant="outline" size="sm" className="text-xs gap-1.5 h-9">
              <Layers className="w-3.5 h-3.5" />
              Template Studio
            </Button>
          </Link>
        </div>
      </div>

      {state?.error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-[6px] text-xs text-rose-800 flex items-start gap-2.5 shadow-xs">
          <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block">Conferral Validation Error</strong>
            <span>{state.error}</span>
          </div>
        </div>
      )}

      {/* Main 2-Column Split: Form (Left) vs Sticky Live Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Input Form */}
        <div className="lg:col-span-7 space-y-6">
          <form action={formAction} className="space-y-6">
            <input type="hidden" name="student_mode" value={studentMode} />
            <input type="hidden" name="custom_fields_json" value={customFieldsJson} />

            {/* 1. SCHOLAR ENTRY MODE & CANDIDATE PARTICULARS */}
            <Card className="shadow-card border-slate-200">
              <CardHeader className="p-5 border-b border-slate-100 bg-slate-50/70">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-cambria-academic" />
                    <CardTitle className="text-lg">Candidate Scholar Particulars</CardTitle>
                  </div>

                  {/* Mode Tabs */}
                  <div className="flex items-center bg-slate-200/80 p-0.5 rounded-[6px] text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setStudentMode("inline")}
                      className={`px-3 py-1.5 rounded-[5px] transition-all flex items-center gap-1.5 ${
                        studentMode === "inline"
                          ? "bg-white text-cambria-navy shadow-xs font-bold"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <UserPlus className="w-3.5 h-3.5 text-cambria-academic" />
                      Direct Entry (Recommended)
                    </button>
                    <button
                      type="button"
                      onClick={() => setStudentMode("existing")}
                      className={`px-3 py-1.5 rounded-[5px] transition-all flex items-center gap-1.5 ${
                        studentMode === "existing"
                          ? "bg-white text-cambria-navy shadow-xs font-bold"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <Users className="w-3.5 h-3.5 text-cambria-academic" />
                      Existing Scholar
                    </button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 sm:p-6 space-y-5">
                {studentMode === "inline" ? (
                  /* DIRECT INLINE STUDENT ENTRY */
                  <div className="space-y-4">
                    <div className="bg-amber-50/60 border border-amber-200/70 rounded-[6px] p-3 text-xs text-amber-900 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-[#C8A84E] shrink-0 mt-0.5" />
                      <span>
                        <strong>Direct Issuance Workflow:</strong> Enter the scholar&apos;s name and particulars directly. A student record will be automatically synchronized into the institutional registry.
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                          Full Name (English) <span className="text-rose-600">*</span>
                        </label>
                        <Input
                          name="student_full_name_en"
                          required
                          value={inlineFullNameEn}
                          onChange={(e) => setInlineFullNameEn(e.target.value)}
                          placeholder="e.g. Dr. Robert Vance or Eleanor Vance"
                          className="text-xs h-9 font-medium"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                          الاسم الكامل (بالعربية)
                        </label>
                        <Input
                          name="student_full_name_ar"
                          value={inlineFullNameAr}
                          onChange={(e) => setInlineFullNameAr(e.target.value)}
                          placeholder="مثال: د. روبرت فانس أو إليانور فانس"
                          dir="rtl"
                          className="text-xs h-9 font-arabic"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-slate-700">Student ID Number</label>
                          <button
                            type="button"
                            onClick={handleRegenerateStudentId}
                            title="Auto-generate new ID"
                            className="text-[10px] text-cambria-academic font-semibold hover:underline flex items-center gap-1"
                          >
                            <RefreshCw className="w-2.5 h-2.5" />
                            Auto
                          </button>
                        </div>
                        <Input
                          name="student_id_number"
                          value={inlineStudentId}
                          onChange={(e) => setInlineStudentId(e.target.value)}
                          placeholder="e.g. STU-2026-000190"
                          className="text-xs h-9 font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">National ID / Passport</label>
                        <Input
                          name="student_national_id"
                          value={inlineNationalId}
                          onChange={(e) => setInlineNationalId(e.target.value)}
                          placeholder="e.g. ID-98472910"
                          className="text-xs h-9"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">Country / Nationality</label>
                        <Input
                          name="student_nationality"
                          value={inlineNationality}
                          onChange={(e) => setInlineNationality(e.target.value)}
                          placeholder="e.g. British or Egyptian"
                          className="text-xs h-9"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">Student Email Address</label>
                        <Input
                          name="student_email"
                          type="email"
                          value={inlineEmail}
                          onChange={(e) => setInlineEmail(e.target.value)}
                          placeholder="e.vance@example.org (Optional)"
                          className="text-xs h-9"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">Telephone / WhatsApp</label>
                        <Input
                          name="student_phone"
                          type="tel"
                          value={inlinePhone}
                          onChange={(e) => setInlinePhone(e.target.value)}
                          placeholder="+44 20 7946 0945 (Optional)"
                          className="text-xs h-9"
                        />
                      </div>
                    </div>

                    {/* Auto-save Checkbox */}
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        id="save_as_student"
                        name="save_as_student"
                        checked={saveAsStudent}
                        onChange={(e) => setSaveAsStudent(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-cambria-navy focus:ring-cambria-academic"
                      />
                      <label htmlFor="save_as_student" className="text-xs text-slate-700 cursor-pointer select-none">
                        <strong>Save scholar to institutional directory</strong> (allows issuing future credentials without re-entering data)
                      </label>
                    </div>
                  </div>
                ) : (
                  /* EXISTING SCHOLAR DROPDOWN SELECTOR */
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                      <span>
                        Select Existing Scholar <span className="text-rose-600">*</span>
                      </span>
                      <span className="text-[11px] text-slate-400 font-normal">
                        {students.length} registered scholars
                      </span>
                    </label>

                    <select
                      name="student_id"
                      value={selectedStudentId}
                      onChange={(e) => setSelectedStudentId(e.target.value)}
                      required={studentMode === "existing"}
                      className="flex h-10 w-full rounded-[4px] border border-slate-300 bg-white px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cambria-academic"
                    >
                      <option value="">-- Choose Registered Scholar --</option>
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.full_name_en} — {s.student_id_number} ({s.nationality || "International"})
                        </option>
                      ))}
                    </select>

                    {activeStudent && (
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-[6px] text-xs space-y-1">
                        <div className="font-semibold text-cambria-navy">
                          {activeStudent.full_name_en} / {activeStudent.full_name_ar}
                        </div>
                        <div className="text-slate-500 text-[11px]">
                          ID: <span className="font-mono font-medium">{activeStudent.student_id_number}</span> • National ID: {activeStudent.national_id} • Email: {activeStudent.email}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 2. PROGRAM & CONFERRAL TIMELINE */}
            <Card className="shadow-card border-slate-200">
              <CardHeader className="p-5 border-b border-slate-100 bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-cambria-academic" />
                  <CardTitle className="text-lg">Academic Qualification & Dates</CardTitle>
                </div>
              </CardHeader>

              <CardContent className="p-5 sm:p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Academic Program / Degree Qualification <span className="text-rose-600">*</span>
                  </label>
                  <select
                    name="program_id"
                    required
                    value={selectedProgramId}
                    onChange={(e) => setSelectedProgramId(e.target.value)}
                    className="flex h-10 w-full rounded-[4px] border border-slate-300 bg-white px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cambria-academic"
                  >
                    <option value="">-- Choose Qualification --</option>
                    {programs.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.code}) — {p.degree_level.replace(/_/g, " ").toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Conferral / Issue Date <span className="text-rose-600">*</span>
                    </label>
                    <Input
                      name="issue_date"
                      type="date"
                      required
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      className="text-xs h-9"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Expiration Date (Optional)
                    </label>
                    <Input
                      name="expiry_date"
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      placeholder="Leave empty for permanent validity"
                      className="text-xs h-9"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3. DYNAMIC ACADEMIC ATTRIBUTES & CUSTOM FIELDS */}
            <Card className="shadow-card border-slate-200">
              <CardHeader className="p-5 border-b border-slate-100 bg-slate-50/70 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Academic Honors & Flexible Custom Fields</CardTitle>
                  <p className="text-[11px] text-slate-500 pt-0.5">
                    Add standard academic notations or create custom attributes dynamically.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddCustomField}
                  className="text-xs gap-1.5 h-8 border-cambria-academic/30 text-cambria-academic hover:bg-cambria-soft"
                >
                  <Plus className="w-3.5 h-3.5" />
                  + Add Custom Field
                </Button>
              </CardHeader>

              <CardContent className="p-5 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Grade / Evaluation (التقدير)
                    </label>
                    <Input
                      name="grade"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      placeholder="e.g. First Class Honours / ممتاز"
                      className="text-xs h-9"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Specialization Focus (التخصص الدقيق)
                    </label>
                    <Input
                      name="specialization"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      placeholder="e.g. Corporate Financial Law"
                      className="text-xs h-9"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Academic Honors (مرتبة الشرف)
                    </label>
                    <Input
                      name="honors"
                      value={honors}
                      onChange={(e) => setHonors(e.target.value)}
                      placeholder="e.g. Summa Cum Laude"
                      className="text-xs h-9"
                    />
                  </div>
                </div>

                {/* Dynamic Added Fields List */}
                {customFields.length > 0 && (
                  <div className="space-y-3 pt-3 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-cambria-navy">
                        User-Defined Custom Fields ({customFields.length})
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Will be saved to credential metadata and passed to document renderer
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {customFields.map((field) => (
                        <div
                          key={field.id}
                          className="flex items-center gap-2.5 p-2.5 bg-slate-50 border border-slate-200 rounded-[6px]"
                        >
                          <div className="w-1/3">
                            <Input
                              value={field.label}
                              onChange={(e) =>
                                handleUpdateCustomField(field.id, { label: e.target.value })
                              }
                              placeholder="Field Name (e.g. Thesis Title)"
                              className="text-xs h-8 bg-white font-medium"
                            />
                          </div>
                          <div className="flex-1">
                            <Input
                              value={field.value}
                              onChange={(e) =>
                                handleUpdateCustomField(field.id, { value: e.target.value })
                              }
                              placeholder="Field Value (e.g. Artificial Intelligence Ethics)"
                              className="text-xs h-8 bg-white"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveCustomField(field.id)}
                            className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 h-8 w-8"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 4. DOCUMENT GENERATION & VISUAL TEMPLATE GALLERY */}
            <Card className="shadow-card border-slate-200">
              <CardHeader className="p-5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Generate Official Documents</CardTitle>
                  <p className="text-[11px] text-slate-500 pt-0.5">
                    Select visual designs for certificates and student ID cards.
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
              </CardHeader>

              <CardContent className="p-5 sm:p-6 space-y-6">
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
                        Select design below
                      </span>
                    )}
                  </div>

                  {generateCertificate && (
                    <div className="pt-2 border-t border-slate-100">
                      <TemplateVisualPicker
                        templates={templates}
                        selectedId={selectedCertTemplateId}
                        onSelect={(id) => {
                          setSelectedCertTemplateId(id);
                          setPreviewDocType("certificate");
                        }}
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
                        Select card layout below
                      </span>
                    )}
                  </div>

                  {generateStudentCard && (
                    <div className="pt-2 border-t border-slate-100">
                      <TemplateVisualPicker
                        templates={templates}
                        selectedId={selectedCardTemplateId}
                        onSelect={(id) => {
                          setSelectedCardTemplateId(id);
                          setPreviewDocType("student_card");
                        }}
                        name="card_template_id"
                        kind="student_card"
                        disabled={!generateStudentCard}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 5. ADMINISTRATIVE NOTES */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Administrative Notes / Internal Audit Memo
              </label>
              <textarea
                name="notes"
                rows={2}
                className="w-full rounded-[4px] border border-slate-300 bg-white p-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cambria-academic"
                placeholder="e.g. Conferred following board review and thesis defense..."
              />
            </div>

            {/* Submission Bar */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <Link href="/admin/credentials">
                <Button variant="outline" type="button" className="text-xs">
                  Cancel
                </Button>
              </Link>

              <Button
                type="submit"
                disabled={isPending}
                className="bg-cambria-navy hover:bg-cambria-academic text-white font-semibold text-xs px-6 py-2.5 gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <Award className="w-4 h-4 text-[#C8A84E]" />
                {isPending ? "Conferring & Rendering Documents..." : "Issue & Confer Official Credential"}
              </Button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Real-Time Interactive Live Preview */}
        <div className="lg:col-span-5 sticky top-6 space-y-4">
          <LiveCertificatePreview
            certTemplate={activeCertTemplate}
            cardTemplate={activeCardTemplate}
            data={livePreviewData}
            activeDocType={previewDocType}
            onChangeDocType={setPreviewDocType}
          />

          {/* Quick Guidance Box */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-[8px] space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 font-bold text-cambria-navy">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Real-Time WYSIWYG Rendering</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              The preview reflects your active certificate layout, fonts, and live field bindings simultaneously with every keystroke. On submit, vector PDF and resolution-locked documents will be compiled.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
