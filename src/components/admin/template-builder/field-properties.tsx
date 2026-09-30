"use client";

import React, { useState } from "react";
import { TemplateField } from "@/types/database";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FieldPreset, AVAILABLE_FIELD_PRESETS } from "./template-presets";
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
  ArrowLeft,
  Plus,
  Layers,
  Sparkles,
  QrCode,
  Image as ImageIcon,
  ChevronRight,
  Check,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ChevronsDown,
  Ratio,
} from "lucide-react";

export interface FieldPropertiesProps {
  field: TemplateField | null;
  fields?: TemplateField[];
  selectedFieldId?: string | null;
  onSelectField?: (id: string | null) => void;
  canvasWidth: number;
  canvasHeight: number;
  onUpdateField: (id: string, updates: Partial<TemplateField>) => void;
  onDeleteField: (id: string) => void;
  onDuplicateField: (id: string) => void;
  onAddFieldPreset?: (preset: FieldPreset) => void;
  onBringToFront?: (id: string) => void;
  onSendToBack?: (id: string) => void;
  onMoveForward?: (id: string) => void;
  onMoveBackward?: (id: string) => void;
  onToggleLock?: (id: string) => void;
  onToggleVisibility?: (id: string) => void;
  onAlignField?: (id: string, align: "left" | "center-h" | "right" | "top" | "center-v" | "bottom") => void;
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
  { value: "Alex Brush", label: "Alex Brush (Formal Calligraphy Script)" },
  { value: "Great Vibes", label: "Great Vibes (Classic Elegant Script)" },
  { value: "Montserrat", label: "Montserrat (Clean Grotesque Sans)" },
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
  { value: "student_national_id", label: "National ID (Masked) — الرقم القومي" },
  { value: "student_country", label: "Student Country — الدولة / الجنسية" },
  { value: "specialization", label: "Specialization / Major — التخصص الأكاديمي" },
  { value: "grade", label: "Academic Grade / Honors — التقدير الأكاديمي" },
  { value: "issue_date", label: "Issue Date — تاريخ الإصدار" },
  { value: "expiry_date", label: "Expiry Date — تاريخ الانتهاء" },
  { value: "degree_level", label: "Degree Level — الدرجة الأكاديمية" },
  { value: "college_name_en", label: "College Name (English) — كلية كامبريا" },
  { value: "college_name_ar", label: "College Name (Arabic) — كلية كامبريا الدولية" },
  { value: "verification_url", label: "Verification QR URL — رابط التحقق الرقمي" },
  { value: "verification_notice", label: "Verification Notice — نص وبوابة التحقق" },
  { value: "student_photo", label: "Student Photo / Avatar — صورة الطالب" },
  { value: "college_seal", label: "Institutional College Seal — ختم الكلية" },
];

export function FieldPropertiesPanel({
  field,
  fields = [],
  selectedFieldId,
  onSelectField,
  canvasWidth,
  canvasHeight,
  onUpdateField,
  onDeleteField,
  onDuplicateField,
  onAddFieldPreset,
  onBringToFront,
  onSendToBack,
  onMoveForward,
  onMoveBackward,
  onToggleLock,
  onToggleVisibility,
  onAlignField,
}: FieldPropertiesProps) {
  // If NO field is currently selected, display the Canvas Layers & Elements List
  if (!field) {
    return (
      <div className="p-4 space-y-5 text-xs text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#C8A84E]" />
            <div>
              <h3 className="text-sm font-bold text-white">Canvas Elements</h3>
              <span className="text-[10px] text-slate-400">
                {fields.length} active element{fields.length === 1 ? "" : "s"} on canvas
              </span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 text-[#C8A84E] border border-slate-700">
            {fields.length} Layers
          </span>
        </div>

        {/* Elements List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 px-1">
            <span>Placed Elements (Click to Edit)</span>
          </div>

          {fields.length === 0 ? (
            <div className="p-6 text-center border border-dashed border-slate-800 rounded-lg bg-slate-900/40 space-y-2">
              <Sliders className="w-7 h-7 mx-auto text-slate-600" />
              <p className="text-xs text-slate-400">No elements on canvas yet.</p>
              <p className="text-[11px] text-slate-500">
                Choose a preset below to place your first dynamic student field.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
              {fields.map((f, idx) => {
                const isSelected = selectedFieldId === f.id;
                return (
                  <div
                    key={f.id}
                    onClick={() => onSelectField?.(f.id)}
                    className={`w-full text-left p-2 rounded-md border flex items-center justify-between gap-1.5 cursor-pointer transition-all ${
                      isSelected
                        ? "border-[#C8A84E] bg-[#C8A84E]/10 text-white shadow-sm"
                        : "border-slate-800 bg-slate-900 hover:border-slate-700 hover:bg-slate-800/80 text-slate-300"
                    } ${f.isHidden ? "opacity-40" : ""}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[10px] font-mono text-slate-500 w-4 text-center shrink-0">
                        #{idx + 1}
                      </span>
                      <div className="w-6 h-6 rounded flex items-center justify-center bg-slate-800 text-[#C8A84E] shrink-0 border border-slate-700">
                        {f.type === "qr" ? (
                          <QrCode className="w-3.5 h-3.5" />
                        ) : f.type === "image" ? (
                          <ImageIcon className="w-3.5 h-3.5" />
                        ) : (
                          <Type className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-white truncate flex items-center gap-1.5">
                          <span>{f.label || f.id}</span>
                          {f.isLocked && <Lock className="w-2.5 h-2.5 text-amber-400 shrink-0" />}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">
                          {f.x},{f.y} • {f.w}×{f.h}px
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleVisibility?.(f.id)}
                        title={f.isHidden ? "Show Element" : "Hide Element"}
                        className="h-6 w-6 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
                      >
                        {f.isHidden ? <EyeOff className="w-3 h-3 text-rose-400" /> : <Eye className="w-3 h-3" />}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleLock?.(f.id)}
                        title={f.isLocked ? "Unlock Position" : "Lock Position"}
                        className="h-6 w-6 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
                      >
                        {f.isLocked ? <Lock className="w-3 h-3 text-amber-400" /> : <Unlock className="w-3 h-3" />}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={idx === fields.length - 1}
                        onClick={() => onMoveForward?.(f.id)}
                        title="Move Up in Stack"
                        className="h-6 w-6 p-0 text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-20"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={idx === 0}
                        onClick={() => onMoveBackward?.(f.id)}
                        title="Move Down in Stack"
                        className="h-6 w-6 p-0 text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-20"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onDuplicateField(f.id)}
                        title="Duplicate"
                        className="h-6 w-6 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={f.isLocked}
                        onClick={() => onDeleteField(f.id)}
                        title={f.isLocked ? "Unlock to delete" : "Delete"}
                        className="h-6 w-6 p-0 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 disabled:opacity-20"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Add Presets Section */}
        {onAddFieldPreset && (
          <div className="space-y-2 pt-3 border-t border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400 px-1">
              Quick Add Presets
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {AVAILABLE_FIELD_PRESETS.slice(0, 6).map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => onAddFieldPreset(preset)}
                  className="w-full text-left px-2.5 py-2 rounded border border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-700 flex items-center justify-between text-xs text-slate-300 hover:text-white transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <Plus className="w-3.5 h-3.5 text-[#C8A84E] group-hover:scale-110 transition-transform" />
                    <span className="font-medium">{preset.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-sans">{preset.labelAr}</span>
                </button>
              ))}
            </div>
          </div>
        )}
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
    <div className="p-4 sm:p-5 space-y-5 text-xs text-slate-200">
      {/* 1. Header with Back Button & Quick Actions */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2 min-w-0">
          {onSelectField && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onSelectField(null)}
              className="h-7 px-2 text-slate-400 hover:text-white hover:bg-slate-800 text-[11px] gap-1 -ml-1 shrink-0"
              title="Return to elements list"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Layers</span>
            </Button>
          )}
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#C8A84E] block">
              Properties
            </span>
            <h3 className="text-sm font-bold text-white truncate max-w-[140px] sm:max-w-[170px]">
              {field.label || field.id}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onDuplicateField(field.id)}
            title="Duplicate Field"
            className="h-7 w-7 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <Copy className="w-3.5 h-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={field.isLocked}
            onClick={() => onDeleteField(field.id)}
            title={field.isLocked ? "Unlock to delete" : "Delete Field"}
            className="h-7 w-7 p-0 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 disabled:opacity-20"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Lock Banner Notice */}
      {field.isLocked && (
        <div className="flex items-center justify-between p-2.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs animate-in fade-in">
          <div className="flex items-center gap-2 min-w-0">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="truncate">
              Element is <strong>Locked</strong> against moving.
            </span>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onToggleLock?.(field.id)}
            className="h-6 text-[10px] px-2 border-amber-500/40 bg-amber-500/20 text-amber-200 hover:bg-amber-500/30 shrink-0"
          >
            Unlock
          </Button>
        </div>
      )}

      {/* Quick Alignment Toolbar */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-300">Quick Alignment</span>
        </div>
        <div className="grid grid-cols-6 gap-1">
          <button
            type="button"
            disabled={field.isLocked}
            onClick={() => onAlignField ? onAlignField(field.id, "left") : onUpdateField(field.id, { x: 0 })}
            className="h-7 rounded border border-slate-800 bg-slate-900 hover:bg-slate-800 hover:border-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-[10px] font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Align Left (محاذاة لليسار)"
          >
            Left
          </button>
          <button
            type="button"
            disabled={field.isLocked}
            onClick={() => onAlignField ? onAlignField(field.id, "center-h") : centerHorizontally()}
            className="h-7 rounded border border-slate-800 bg-slate-900 hover:bg-slate-800 hover:border-slate-700 text-[#C8A84E] flex items-center justify-center text-[10px] font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Center Horizontally (توسيط أفقي)"
          >
            Center H
          </button>
          <button
            type="button"
            disabled={field.isLocked}
            onClick={() => onAlignField ? onAlignField(field.id, "right") : onUpdateField(field.id, { x: Math.max(0, canvasWidth - field.w) })}
            className="h-7 rounded border border-slate-800 bg-slate-900 hover:bg-slate-800 hover:border-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-[10px] font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Align Right (محاذاة لليمين)"
          >
            Right
          </button>
          <button
            type="button"
            disabled={field.isLocked}
            onClick={() => onAlignField ? onAlignField(field.id, "top") : onUpdateField(field.id, { y: 0 })}
            className="h-7 rounded border border-slate-800 bg-slate-900 hover:bg-slate-800 hover:border-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-[10px] font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Align Top (محاذاة لأعلى)"
          >
            Top
          </button>
          <button
            type="button"
            disabled={field.isLocked}
            onClick={() => onAlignField ? onAlignField(field.id, "center-v") : centerVertically()}
            className="h-7 rounded border border-slate-800 bg-slate-900 hover:bg-slate-800 hover:border-slate-700 text-[#C8A84E] flex items-center justify-center text-[10px] font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Center Vertically (توسيط رأسي)"
          >
            Center V
          </button>
          <button
            type="button"
            disabled={field.isLocked}
            onClick={() => onAlignField ? onAlignField(field.id, "bottom") : onUpdateField(field.id, { y: Math.max(0, canvasHeight - field.h) })}
            className="h-7 rounded border border-slate-800 bg-slate-900 hover:bg-slate-800 hover:border-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-[10px] font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Align Bottom (محاذاة لأسفل)"
          >
            Bottom
          </button>
        </div>
      </div>

      {/* Layer Arrangement & Hierarchy */}
      <div className="space-y-1.5 pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#C8A84E]" />
            Layer Hierarchy
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onBringToFront?.(field.id)}
            className="h-7 text-[10px] px-1 border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 gap-1"
            title="Bring to Very Front (إلى المقدمة تماماً)"
          >
            <ChevronsUp className="w-3 h-3 text-[#C8A84E]" />
            To Front
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onMoveForward?.(field.id)}
            className="h-7 text-[10px] px-1 border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 gap-1"
            title="Move Up 1 Layer (تقديم للأمام)"
          >
            <ArrowUp className="w-3 h-3" />
            Up
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onMoveBackward?.(field.id)}
            className="h-7 text-[10px] px-1 border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 gap-1"
            title="Move Down 1 Layer (تأخير للخلف)"
          >
            <ArrowDown className="w-3 h-3" />
            Down
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onSendToBack?.(field.id)}
            className="h-7 text-[10px] px-1 border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 gap-1"
            title="Send to Very Back (إلى الخلفية تماماً)"
          >
            <ChevronsDown className="w-3 h-3 text-slate-400" />
            To Back
          </Button>
        </div>
      </div>

      {/* Protection & Behavior Controls */}
      <div className="space-y-1.5 pt-2 border-t border-slate-800">
        <span className="text-[11px] font-semibold text-slate-300">Protection & Behavior</span>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => onToggleLock?.(field.id)}
            className={`h-7 px-2 rounded border flex items-center justify-center gap-1.5 text-[10px] font-medium transition-colors ${
              field.isLocked
                ? "border-amber-500 bg-amber-500/20 text-amber-300 font-bold"
                : "border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
            }`}
            title="Lock or Unlock position from accidental drag"
          >
            {field.isLocked ? <Lock className="w-3 h-3 text-amber-400" /> : <Unlock className="w-3 h-3" />}
            <span>{field.isLocked ? "Locked" : "Unlocked"}</span>
          </button>

          <button
            type="button"
            onClick={() => onUpdateField(field.id, { lockAspectRatio: !field.lockAspectRatio })}
            className={`h-7 px-2 rounded border flex items-center justify-center gap-1.5 text-[10px] font-medium transition-colors ${
              field.lockAspectRatio
                ? "border-[#C8A84E] bg-[#C8A84E]/20 text-[#C8A84E] font-bold"
                : "border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
            }`}
            title="Lock aspect ratio when resizing"
          >
            <Ratio className="w-3 h-3" />
            <span>{field.lockAspectRatio ? "Ratio Locked" : "Free Ratio"}</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleVisibility?.(field.id)}
            className={`h-7 px-2 rounded border flex items-center justify-center gap-1.5 text-[10px] font-medium transition-colors ${
              field.isHidden
                ? "border-rose-500 bg-rose-500/20 text-rose-300 font-bold"
                : "border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
            }`}
            title="Hide or show element"
          >
            {field.isHidden ? <EyeOff className="w-3 h-3 text-rose-400" /> : <Eye className="w-3 h-3" />}
            <span>{field.isHidden ? "Hidden" : "Visible"}</span>
          </button>
        </div>
      </div>

      {/* 2. Field Label & Data Binding */}
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-300">Display Label</label>
          <Input
            value={field.label || ""}
            onChange={(e) => onUpdateField(field.id, { label: e.target.value })}
            placeholder="e.g. Student Name (AR)"
            className="h-8 text-xs bg-slate-900 border-slate-700 text-white"
          />
        </div>

        {/* Dynamic Variable or Static Text */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-300">Data Variable Binding</label>
          <select
            value={field.contentKey || (field.staticText ? "custom_static" : "")}
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

      {/* 3. Position & Dimensions (px) */}
      <div className="space-y-3 pt-3 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-300">Coordinates & Size (px)</span>
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

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400">X (Horizontal)</span>
            <Input
              type="number"
              value={field.x}
              onChange={(e) => onUpdateField(field.id, { x: Number(e.target.value) })}
              className="h-7 text-xs bg-slate-900 border-slate-700 font-mono text-white"
            />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400">Y (Vertical)</span>
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

      {/* 4. Typography & Styling (For Text Fields) */}
      {isText && (
        <div className="space-y-3 pt-3 border-t border-slate-800">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-[#C8A84E]" />
            Typography & Font
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
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400">Font Size ({field.size || 16}px)</span>
              <Input
                type="number"
                min={8}
                max={140}
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

          {/* Font Style & Static Prefix */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400">Font Style</span>
              <select
                value={field.fontStyle || "normal"}
                onChange={(e) => onUpdateField(field.id, { fontStyle: e.target.value as "normal" | "italic" })}
                className="w-full h-7 px-2 text-xs bg-slate-900 border border-slate-700 text-white rounded-[4px]"
              >
                <option value="normal">Normal (مستقيم)</option>
                <option value="italic">Italic (مائل)</option>
              </select>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400">Static Prefix (e.g. &quot;: &quot;)</span>
              <Input
                value={field.staticPrefix || ""}
                onChange={(e) => onUpdateField(field.id, { staticPrefix: e.target.value })}
                placeholder='e.g. ": " or "ID: "'
                className="h-7 text-xs bg-slate-900 border-slate-700 font-mono text-white"
              />
            </div>
          </div>

          {/* Alignment & Reading Direction */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400">Text Align</span>
              <div className="flex rounded-[4px] border border-slate-700 overflow-hidden">
                <button
                  type="button"
                  onClick={() => onUpdateField(field.id, { align: "left" })}
                  className={`flex-1 h-7 flex items-center justify-center transition-colors ${
                    field.align === "left" || (!field.align && field.direction !== "rtl")
                      ? "bg-[#C8A84E] text-slate-950 font-bold"
                      : "bg-slate-900 text-slate-400 hover:text-white"
                  }`}
                  title="Align Left"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateField(field.id, { align: "center" })}
                  className={`flex-1 h-7 flex items-center justify-center transition-colors ${
                    field.align === "center"
                      ? "bg-[#C8A84E] text-slate-950 font-bold"
                      : "bg-slate-900 text-slate-400 hover:text-white"
                  }`}
                  title="Align Center"
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateField(field.id, { align: "right" })}
                  className={`flex-1 h-7 flex items-center justify-center transition-colors ${
                    field.align === "right" || (!field.align && field.direction === "rtl")
                      ? "bg-[#C8A84E] text-slate-950 font-bold"
                      : "bg-slate-900 text-slate-400 hover:text-white"
                  }`}
                  title="Align Right"
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
                  className={`w-5 h-5 rounded-full border ${
                    field.color === c ? "ring-2 ring-[#C8A84E] border-white scale-110" : "border-slate-700"
                  } transition-transform`}
                  title={c}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Visual Opacity & Corner Radius */}
      <div className="space-y-2 pt-3 border-t border-slate-800">
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

      {/* 6. Quick Jump to Other Elements */}
      {fields.length > 1 && onSelectField && (
        <div className="space-y-2 pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Switch to Another Element:</span>
          </div>
          <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
            {fields.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => onSelectField(f.id)}
                className={`px-2 py-1 rounded text-[10px] border transition-colors ${
                  f.id === field.id
                    ? "bg-[#C8A84E] text-slate-950 font-bold border-[#C8A84E]"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                {f.label || f.id}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
