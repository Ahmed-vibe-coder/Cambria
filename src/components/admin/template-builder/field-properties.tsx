"use client";

import React from "react";
import { TemplateField } from "@/types/database";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Copy,
  AlignLeft,
  AlignCenter,
  AlignRight,
  MoveHorizontal,
  MoveVertical,
  Type,
  Palette,
  Sliders,
} from "lucide-react";

interface FieldPropertiesProps {
  field: TemplateField | null;
  canvasWidth: number;
  canvasHeight: number;
  onUpdateField: (id: string, updates: Partial<TemplateField>) => void;
  onDeleteField: (id: string) => void;
  onDuplicateField: (id: string) => void;
}

const PRESET_COLORS = [
  "#020B5A", // Cambria Deep Navy
  "#07133F", // Midnight Blue
  "#243A8F", // Royal Academic Blue
  "#C8A84E", // Cambria Gold
  "#B59438", // Antique Gold
  "#1E293B", // Dark Slate
  "#64748B", // Muted Slate
  "#FFFFFF", // Pure White
  "#059669", // Emerald Green
  "#991B1B", // Deep Crimson
];

const FONTS = [
  { value: "Cormorant Garamond", label: "Cormorant Garamond (Editorial Serif)" },
  { value: "Cairo", label: "Cairo (Arabic Calligraphy - خط عربي)" },
  { value: "Inter", label: "Inter (Modern Sans-Serif)" },
  { value: "Playfair Display", label: "Playfair Display (Luxury Serif)" },
  { value: "Courier New", label: "Courier New (Monospace Security)" },
];

const DYNAMIC_VARIABLES = [
  { value: "student_name_en", label: "Student Name (English) — اسم الطالب إنجليزي" },
  { value: "student_name_ar", label: "Student Name (Arabic) — اسم الطالب عربي" },
  { value: "program_name_en", label: "Academic Program (English) — البرنامج إنجليزي" },
  { value: "program_name_ar", label: "Academic Program (Arabic) — البرنامج عربي" },
  { value: "credential_number", label: "Credential Number — رقم الاعتماد والشهادة" },
  { value: "student_id_number", label: "Student ID Number — الرقم الجامعي للطالب" },
  { value: "issue_date", label: "Issue Date — تاريخ الإصدار" },
  { value: "expiry_date", label: "Expiry Date — تاريخ الانتهاء" },
  { value: "degree_level", label: "Degree Level — الدرجة الأكاديمية" },
  { value: "college_name_en", label: "College Name (English) — كلية كامبريا" },
  { value: "college_name_ar", label: "College Name (Arabic) — كلية كامبريا الدولية" },
  { value: "verification_url", label: "Verification QR URL — رابط التحقق الرقمي" },
  { value: "student_photo", label: "Student Photo / Avatar — صورة الطالب" },
  { value: "college_seal", label: "Institutional College Seal — ختم الكلية" },
];

export function FieldPropertiesPanel({
  field,
  canvasWidth,
  canvasHeight,
  onUpdateField,
  onDeleteField,
  onDuplicateField,
}: FieldPropertiesProps) {
  if (!field) {
    return (
      <div className="p-6 text-center text-slate-400 space-y-3">
        <Sliders className="w-8 h-8 mx-auto text-slate-500 opacity-60" />
        <h3 className="text-sm font-semibold text-slate-300">No Field Selected</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Click on any field on the canvas or add a new field from the top toolbar to configure its
          position, typography, and dynamic data variables.
        </p>
      </div>
    );
  }

  const isText = field.type === "text" || !field.type;

  // Alignment Helpers
  const centerHorizontally = () => {
    const newX = Math.round((canvasWidth - field.w) / 2);
    onUpdateField(field.id, { x: Math.max(0, newX) });
  };

  const centerVertically = () => {
    const newY = Math.round((canvasHeight - field.h) / 2);
    onUpdateField(field.id, { y: Math.max(0, newY) });
  };

  return (
    <div className="p-5 space-y-6 text-xs text-slate-200">
      {/* Header & Quick Actions */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-700/80">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#C8A84E]">
            Field Properties
          </span>
          <h3 className="text-sm font-bold text-white truncate max-w-[180px]">
            {field.label || field.id}
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onDuplicateField(field.id)}
            title="Duplicate Field"
            className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <Copy className="w-3.5 h-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onDeleteField(field.id)}
            title="Delete Field"
            className="h-8 w-8 p-0 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* 1. Field Label & Type */}
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-300">Field Display Label</label>
          <Input
            value={field.label || ""}
            onChange={(e) => onUpdateField(field.id, { label: e.target.value })}
            placeholder="e.g. Student Name (AR)"
            className="h-8 text-xs bg-slate-900 border-slate-700 text-white"
          />
        </div>

        {/* Dynamic Variable or Static Text */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-300">Dynamic Variable Binding</label>
          <select
            value={field.contentKey || ""}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "custom_static") {
                onUpdateField(field.id, { contentKey: undefined, staticText: field.staticText || "Custom Text" });
              } else {
                onUpdateField(field.id, { contentKey: val, staticText: undefined });
              }
            }}
            className="w-full h-8 px-2 text-xs bg-slate-900 border border-slate-700 text-white rounded-[4px] focus:outline-none focus:ring-1 focus:ring-[#C8A84E]"
          >
            <option value="custom_static">✍️ Static Custom Text (نص ثابت مخصص)</option>
            {DYNAMIC_VARIABLES.map((v) => (
              <option key={v.value} value={v.value}>
                {v.label}
              </option>
            ))}
          </select>
        </div>

        {(!field.contentKey || field.contentKey === "custom_static") && (
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-300">Custom Static Content</label>
            <Input
              value={field.staticText || ""}
              onChange={(e) => onUpdateField(field.id, { staticText: e.target.value })}
              placeholder="Enter text to render on template..."
              className="h-8 text-xs bg-slate-900 border-slate-700 text-white"
            />
          </div>
        )}
      </div>

      {/* 2. Position & Dimensions */}
      <div className="space-y-3 pt-2 border-t border-slate-700/60">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-300">Position & Dimensions (px)</span>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={centerHorizontally}
              className="h-6 text-[10px] px-1.5 py-0 border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 gap-1"
            >
              <MoveHorizontal className="w-3 h-3" />
              Center H
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={centerVertically}
              className="h-6 text-[10px] px-1.5 py-0 border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 gap-1"
            >
              <MoveVertical className="w-3 h-3" />
              Center V
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400">X Position</span>
            <Input
              type="number"
              value={field.x}
              onChange={(e) => onUpdateField(field.id, { x: Number(e.target.value) })}
              className="h-7 text-xs bg-slate-900 border-slate-700 font-mono text-white"
            />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400">Y Position</span>
            <Input
              type="number"
              value={field.y}
              onChange={(e) => onUpdateField(field.id, { y: Number(e.target.value) })}
              className="h-7 text-xs bg-slate-900 border-slate-700 font-mono text-white"
            />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400">Width</span>
            <Input
              type="number"
              value={field.w}
              onChange={(e) => onUpdateField(field.id, { w: Math.max(10, Number(e.target.value)) })}
              className="h-7 text-xs bg-slate-900 border-slate-700 font-mono text-white"
            />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400">Height</span>
            <Input
              type="number"
              value={field.h}
              onChange={(e) => onUpdateField(field.id, { h: Math.max(10, Number(e.target.value)) })}
              className="h-7 text-xs bg-slate-900 border-slate-700 font-mono text-white"
            />
          </div>
        </div>
      </div>

      {/* 3. Typography & Styling (For Text Fields) */}
      {isText && (
        <div className="space-y-3 pt-2 border-t border-slate-700/60">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-[#C8A84E]" />
            Typography & Font Styling
          </span>

          {/* Font Family */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400">Font Family</label>
            <select
              value={field.font || "Inter"}
              onChange={(e) => onUpdateField(field.id, { font: e.target.value })}
              className="w-full h-8 px-2 text-xs bg-slate-900 border border-slate-700 text-white rounded-[4px] focus:outline-none focus:ring-1 focus:ring-[#C8A84E]"
            >
              {FONTS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          {/* Font Size & Weight */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400">Font Size ({field.size || 16}px)</span>
              <Input
                type="number"
                min={8}
                max={120}
                value={field.size || 16}
                onChange={(e) => onUpdateField(field.id, { size: Number(e.target.value) })}
                className="h-7 text-xs bg-slate-900 border-slate-700 font-mono text-white"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400">Font Weight</span>
              <select
                value={field.weight || 400}
                onChange={(e) => onUpdateField(field.id, { weight: Number(e.target.value) })}
                className="w-full h-7 px-2 text-xs bg-slate-900 border border-slate-700 text-white rounded-[4px]"
              >
                <option value={400}>Regular (400)</option>
                <option value={500}>Medium (500)</option>
                <option value={600}>Semi-Bold (600)</option>
                <option value={700}>Bold (700)</option>
                <option value={800}>Extra Bold (800)</option>
              </select>
            </div>
          </div>

          {/* Alignment & Direction */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400">Text Align</span>
              <div className="flex rounded-[4px] border border-slate-700 overflow-hidden">
                <button
                  type="button"
                  onClick={() => onUpdateField(field.id, { align: "left" })}
                  className={`flex-1 h-7 flex items-center justify-center ${field.align === "left" || (!field.align && field.direction !== "rtl") ? "bg-[#C8A84E] text-slate-900 font-bold" : "bg-slate-900 text-slate-400"}`}
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateField(field.id, { align: "center" })}
                  className={`flex-1 h-7 flex items-center justify-center ${field.align === "center" ? "bg-[#C8A84E] text-slate-900 font-bold" : "bg-slate-900 text-slate-400"}`}
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateField(field.id, { align: "right" })}
                  className={`flex-1 h-7 flex items-center justify-center ${field.align === "right" || (!field.align && field.direction === "rtl") ? "bg-[#C8A84E] text-slate-900 font-bold" : "bg-slate-900 text-slate-400"}`}
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-400">Reading Direction</span>
              <select
                value={field.direction || "ltr"}
                onChange={(e) => onUpdateField(field.id, { direction: e.target.value as "ltr" | "rtl" })}
                className="w-full h-7 px-2 text-xs bg-slate-900 border border-slate-700 text-white rounded-[4px]"
              >
                <option value="ltr">LTR (English / Numbers)</option>
                <option value="rtl">RTL (Arabic - نصوص عربية)</option>
              </select>
            </div>
          </div>

          {/* Color Palette & Custom Hex */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Palette className="w-3 h-3 text-[#C8A84E]" />
                Color
              </span>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={field.color || "#020B5A"}
                  onChange={(e) => onUpdateField(field.id, { color: e.target.value })}
                  className="w-5 h-5 rounded cursor-pointer border border-slate-700 bg-transparent"
                />
                <span className="font-mono text-[10px] text-slate-300">{field.color || "#020B5A"}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onUpdateField(field.id, { color: c })}
                  style={{ backgroundColor: c }}
                  className={`w-5 h-5 rounded-full border ${field.color === c ? "ring-2 ring-[#C8A84E] border-white scale-110" : "border-slate-700"} transition-transform`}
                  title={c}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Visual Opacity & Border Radius */}
      <div className="space-y-2 pt-2 border-t border-slate-700/60">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-400">Opacity ({Math.round((field.opacity ?? 1) * 100)}%)</span>
          <input
            type="range"
            min={10}
            max={100}
            value={Math.round((field.opacity ?? 1) * 100)}
            onChange={(e) => onUpdateField(field.id, { opacity: Number(e.target.value) / 100 })}
            className="w-24 accent-[#C8A84E]"
          />
        </div>

        {(field.type === "image" || field.type === "qr") && (
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-slate-400">Corner Radius ({field.borderRadius || 0}px)</span>
            <input
              type="range"
              min={0}
              max={50}
              value={field.borderRadius || 0}
              onChange={(e) => onUpdateField(field.id, { borderRadius: Number(e.target.value) })}
              className="w-24 accent-[#C8A84E]"
            />
          </div>
        )}
      </div>
    </div>
  );
}
