"use client";

import React, { useState } from "react";
import { Template, TemplateField } from "@/types/database";
import {
  Award,
  CreditCard,
  Maximize2,
  X,
  Sparkles,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface LivePreviewData {
  studentNameEn: string;
  studentNameAr: string;
  studentIdNumber: string;
  programNameEn: string;
  programNameAr: string;
  issueDate: string;
  expiryDate?: string;
  grade?: string;
  specialization?: string;
  honors?: string;
  customFields?: Array<{ key: string; label: string; value: string }>;
}

interface LiveCertificatePreviewProps {
  certTemplate?: Template | null;
  cardTemplate?: Template | null;
  data: LivePreviewData;
  activeDocType: "certificate" | "student_card";
  onChangeDocType: (type: "certificate" | "student_card") => void;
}

export function LiveCertificatePreview({
  certTemplate,
  cardTemplate,
  data,
  activeDocType,
  onChangeDocType,
}: LiveCertificatePreviewProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageError, setImageError] = useState(false);

  const currentTemplate = activeDocType === "certificate" ? certTemplate : cardTemplate;
  const isCert = activeDocType === "certificate";

  const templateWidth = currentTemplate?.width || (isCert ? 2000 : 1013);
  const templateHeight = currentTemplate?.height || (isCert ? 1414 : 638);
  const aspectRatio = `${templateWidth} / ${templateHeight}`;
  const isLandscape = templateWidth >= templateHeight;

  // Resolve field values for live overlay
  const resolveFieldValue = (field: TemplateField): string => {
    switch (field.contentKey) {
      case "student_name_en":
        return data.studentNameEn.trim() || "Scholar Full Name";
      case "student_name_ar":
        return data.studentNameAr.trim() || data.studentNameEn.trim() || "اسم الباحث باللغة العربية";
      case "program_name_en":
        return data.programNameEn.trim() || "Academic Qualification Title";
      case "program_name_ar":
        return data.programNameAr.trim() || data.programNameEn.trim() || "عنوان المؤهل الأكاديمي";
      case "credential_number":
        return "CAM-2026-LIVE";
      case "student_id_number":
        return data.studentIdNumber.trim() || "STU-2026-000190";
      case "issue_date":
        return data.issueDate || new Date().toISOString().split("T")[0];
      case "expiry_date":
      case "valid_date":
        return data.expiryDate || "Permanent Validity";
      case "grade":
      case "gpa":
        return data.grade || "First Class Honours";
      case "specialization":
        return data.specialization || data.programNameEn || "Curricular Specialization";
      case "honors":
        return data.honors || "Conferred with Distinction";
      default:
        if (field.contentKey && data.customFields) {
          const match = data.customFields.find((cf) => cf.key === field.contentKey);
          if (match && match.value) return match.value;
        }
        return field.staticText || "";
    }
  };

  const fields = currentTemplate?.layout_schema?.fields || [];

  return (
    <div className="bg-white border border-slate-200 rounded-[10px] shadow-sm overflow-hidden flex flex-col">
      {/* Header Bar */}
      <div className="p-3.5 px-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <strong className="text-xs font-semibold tracking-wide uppercase text-slate-200">
            Live Interactive Preview
          </strong>
        </div>

        {/* Document Type Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-800 p-0.5 rounded-[6px]">
          <button
            type="button"
            onClick={() => onChangeDocType("certificate")}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-[4px] transition-all flex items-center gap-1 ${
              activeDocType === "certificate"
                ? "bg-cambria-academic text-white shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Certificate
          </button>
          <button
            type="button"
            onClick={() => onChangeDocType("student_card")}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-[4px] transition-all flex items-center gap-1 ${
              activeDocType === "student_card"
                ? "bg-cambria-academic text-white shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Student ID
          </button>

          <button
            type="button"
            onClick={() => setIsZoomed(true)}
            title="Expand Fullscreen Preview"
            className="p-1 text-slate-400 hover:text-white rounded-[4px] hover:bg-slate-700 transition-colors ml-1"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Live Preview Canvas Stage */}
      <div className="p-4 bg-slate-100/70 flex items-center justify-center overflow-hidden">
        <div
          className="relative w-full max-w-[540px] bg-white rounded-[6px] shadow-md border border-slate-300 overflow-hidden select-none"
          style={{ aspectRatio }}
        >
          {/* Background Image / Canvas Template */}
          {currentTemplate?.background_image_url && !imageError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentTemplate.background_image_url}
              alt={currentTemplate.name}
              onError={() => setImageError(true)}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
          ) : (
            /* Institutional Default Decorative Canvas */
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-amber-50/40 via-white to-amber-50/20 p-4 flex flex-col justify-between pointer-events-none">
              <div className="absolute inset-2 border-2 border-dashed border-[#C8A84E]/50 rounded-[4px]" />
              <div className="absolute inset-3 border border-slate-200 rounded-[2px]" />
            </div>
          )}

          {/* Dynamic Layered Fields (Real-time keystroke bindings) */}
          {fields.length > 0 ? (
            fields.map((field) => {
              const leftPct = (field.x / templateWidth) * 100;
              const topPct = (field.y / templateHeight) * 100;
              const widthPct = (field.w / templateWidth) * 100;
              const heightPct = (field.h / templateHeight) * 100;

              if (field.type === "qr") {
                return (
                  <div
                    key={field.id}
                    className="absolute z-10 flex items-center justify-center bg-white p-0.5 rounded shadow-xs"
                    style={{
                      left: `${leftPct}%`,
                      top: `${topPct}%`,
                      width: `${widthPct}%`,
                      height: `${heightPct}%`,
                    }}
                  >
                    <QrCode className="w-full h-full text-cambria-navy" />
                  </div>
                );
              }

              if (field.type === "image" && field.contentKey === "college_seal") {
                return (
                  <div
                    key={field.id}
                    className="absolute z-10 flex items-center justify-center"
                    style={{
                      left: `${leftPct}%`,
                      top: `${topPct}%`,
                      width: `${widthPct}%`,
                      height: `${heightPct}%`,
                    }}
                  >
                    <div className="w-full h-full rounded-full border-2 border-dashed border-[#C8A84E] flex items-center justify-center bg-white/70 shadow-xs">
                      <Award className="w-1/2 h-1/2 text-[#C8A84E]" />
                    </div>
                  </div>
                );
              }

              const value = resolveFieldValue(field);
              const isRtl = field.direction === "rtl" || Boolean(field.contentKey?.includes("_ar"));

              return (
                <div
                  key={field.id}
                  className="absolute z-10 flex flex-col justify-center overflow-hidden leading-tight font-sans transition-all"
                  style={{
                    left: `${leftPct}%`,
                    top: `${topPct}%`,
                    width: `${widthPct}%`,
                    height: `${heightPct}%`,
                    color: field.color || (isCert ? "#020B5A" : "#FFFFFF"),
                    textAlign: (field.align as any) || (isRtl ? "right" : "center"),
                    direction: isRtl ? "rtl" : "ltr",
                    fontFamily: field.font === "Cormorant Garamond" ? "serif" : undefined,
                    fontWeight: field.weight || 600,
                    // Dynamic responsive scaling for container
                    fontSize: `calc(${field.size || 16}px * 0.28)`,
                  }}
                >
                  <span className="truncate block">{value}</span>
                </div>
              );
            })
          ) : (
            /* Fallback generic text overlay if template has 0 fields defined */
            <div className="absolute inset-0 z-10 p-6 flex flex-col justify-center items-center text-center space-y-2 pointer-events-none">
              <span className="text-[10px] font-serif uppercase tracking-[0.2em] text-[#C8A84E] font-bold">
                CAMBRIA INTERNATIONAL COLLEGE
              </span>
              <strong className="text-sm font-serif font-bold text-cambria-navy">
                {data.studentNameEn || "Scholar Name"}
              </strong>
              {data.studentNameAr && (
                <span className="text-xs font-arabic text-slate-600" dir="rtl">
                  {data.studentNameAr}
                </span>
              )}
              <p className="text-[11px] text-slate-500 font-medium">
                {data.programNameEn || "Academic Qualification Title"}
              </p>
              <div className="flex items-center gap-3 pt-2 text-[9px] text-slate-400 font-mono">
                <span>CAM-2026-LIVE</span>
                <span>•</span>
                <span>{data.issueDate || "2026-09-27"}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Meta Footer & Custom Field Badges */}
      <div className="p-3 px-4 bg-slate-50 border-t border-slate-200 text-xs space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span className="font-medium text-slate-700 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cambria-academic" />
            Template: <strong>{currentTemplate?.name || "Standard Institutional"}</strong>
          </span>
          <span className="font-mono text-slate-400">
            {templateWidth}×{templateHeight}px
          </span>
        </div>

        {/* Dynamic Custom Fields Summary Strip */}
        {data.customFields && data.customFields.length > 0 && (
          <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
              Custom Attributes:
            </span>
            {data.customFields.map((cf, idx) => (
              <span
                key={idx}
                className="bg-white border border-slate-200 rounded px-2 py-0.5 text-[10px] text-cambria-navy font-medium shadow-2xs"
              >
                <strong className="text-slate-500">{cf.label}:</strong> {cf.value}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isZoomed && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 sm:p-8"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="bg-white rounded-[10px] shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-2.5">
                <Award className="w-5 h-5 text-[#C8A84E]" />
                <div>
                  <h3 className="font-serif text-base font-bold">
                    Full High-Resolution Certificate Simulation
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Live WYSIWYG preview reflecting current candidate & custom parameters
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 bg-slate-900 flex-1 overflow-auto flex items-center justify-center">
              <div
                className="relative w-full max-w-[800px] bg-white rounded-[6px] shadow-2xl overflow-hidden"
                style={{ aspectRatio }}
              >
                {currentTemplate?.background_image_url && !imageError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={currentTemplate.background_image_url}
                    alt={currentTemplate.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-amber-50/50 via-white to-amber-50/30 p-6 flex flex-col justify-between">
                    <div className="absolute inset-3 border-2 border-dashed border-[#C8A84E]/60 rounded" />
                  </div>
                )}

                {/* Layered fields at full scale */}
                {fields.map((field) => {
                  const leftPct = (field.x / templateWidth) * 100;
                  const topPct = (field.y / templateHeight) * 100;
                  const widthPct = (field.w / templateWidth) * 100;
                  const heightPct = (field.h / templateHeight) * 100;

                  if (field.type === "qr") {
                    return (
                      <div
                        key={field.id}
                        className="absolute z-10 flex items-center justify-center bg-white p-1 rounded shadow-xs"
                        style={{
                          left: `${leftPct}%`,
                          top: `${topPct}%`,
                          width: `${widthPct}%`,
                          height: `${heightPct}%`,
                        }}
                      >
                        <QrCode className="w-full h-full text-cambria-navy" />
                      </div>
                    );
                  }

                  const value = resolveFieldValue(field);
                  const isRtl = field.direction === "rtl" || Boolean(field.contentKey?.includes("_ar"));

                  return (
                    <div
                      key={field.id}
                      className="absolute z-10 flex flex-col justify-center overflow-hidden leading-tight font-sans"
                      style={{
                        left: `${leftPct}%`,
                        top: `${topPct}%`,
                        width: `${widthPct}%`,
                        height: `${heightPct}%`,
                        color: field.color || (isCert ? "#020B5A" : "#FFFFFF"),
                        textAlign: (field.align as any) || (isRtl ? "right" : "center"),
                        direction: isRtl ? "rtl" : "ltr",
                        fontFamily: field.font === "Cormorant Garamond" ? "serif" : undefined,
                        fontWeight: field.weight || 600,
                        fontSize: `calc(${field.size || 16}px * 0.45)`,
                      }}
                    >
                      <span className="truncate block">{value}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 px-6 border-t border-slate-100 flex items-center justify-end bg-white">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsZoomed(false)}
                className="text-xs"
              >
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
