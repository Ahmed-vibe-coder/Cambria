"use client";

import React, { useState, useRef } from "react";
import { TemplateKind } from "@/types/database";
import { DIMENSION_PRESETS } from "./template-presets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Upload,
  Image as ImageIcon,
  Check,
  X,
  FileText,
  CreditCard,
  Trash2,
  Sparkles,
} from "lucide-react";

interface TemplateSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  code: string;
  templateKind: TemplateKind;
  width: number;
  height: number;
  backgroundImageUrl?: string | null;
  backgroundColor?: string;
  isDefault: boolean;
  onUpdateSettings: (settings: {
    name?: string;
    code?: string;
    templateKind?: TemplateKind;
    width?: number;
    height?: number;
    backgroundImageUrl?: string | null;
    backgroundColor?: string;
    isDefault?: boolean;
  }) => void;
}

export function TemplateSettingsModal({
  isOpen,
  onClose,
  name,
  code,
  templateKind,
  width,
  height,
  backgroundImageUrl,
  backgroundColor = "#FFFFFF",
  isDefault,
  onUpdateSettings,
}: TemplateSettingsModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/templates/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload image file");
      }

      const data = await res.json();
      onUpdateSettings({ backgroundImageUrl: data.url || data.dataUri });
    } catch (err: any) {
      // Fallback: read directly as base64 data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUri = event.target?.result as string;
        onUpdateSettings({ backgroundImageUrl: dataUri });
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-lg max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div>
            <span className="text-[10px] font-bold text-[#C8A84E] uppercase tracking-wider block">
              Canvas Configuration
            </span>
            <h2 className="text-base font-bold text-white">Template Canvas & Design Settings</h2>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-slate-800 h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 overflow-y-auto text-xs text-slate-200">
          {/* 1. Basic Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200">Template Title / Name *</label>
              <Input
                value={name}
                onChange={(e) => onUpdateSettings({ name: e.target.value })}
                placeholder="e.g. Master's Degree Golden Diploma"
                className="bg-slate-800 border-slate-700 text-white text-xs h-9"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200">Template Unique Code</label>
              <Input
                value={code}
                onChange={(e) => onUpdateSettings({ code: e.target.value.toUpperCase() })}
                placeholder="e.g. CERT_MASTER_GOLD_2026"
                className="bg-slate-800 border-slate-700 text-white font-mono text-xs h-9"
              />
            </div>
          </div>

          {/* 2. Document Kind */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-200">Document Kind</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onUpdateSettings({ templateKind: "certificate" })}
                className={`p-3 rounded border text-left flex items-start gap-3 transition-all ${templateKind === "certificate" ? "border-[#C8A84E] bg-[#C8A84E]/10 ring-1 ring-[#C8A84E]" : "border-slate-800 bg-slate-800/60 hover:bg-slate-800"}`}
              >
                <FileText className={`w-5 h-5 shrink-0 mt-0.5 ${templateKind === "certificate" ? "text-[#C8A84E]" : "text-slate-400"}`} />
                <div>
                  <div className="font-bold text-white text-xs">Official Certificate</div>
                  <div className="text-[11px] text-slate-400">Diploma, Degree, or Award (شهادة تخرج)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onUpdateSettings({ templateKind: "student_card" })}
                className={`p-3 rounded border text-left flex items-start gap-3 transition-all ${templateKind === "student_card" ? "border-[#C8A84E] bg-[#C8A84E]/10 ring-1 ring-[#C8A84E]" : "border-slate-800 bg-slate-800/60 hover:bg-slate-800"}`}
              >
                <CreditCard className={`w-5 h-5 shrink-0 mt-0.5 ${templateKind === "student_card" ? "text-[#C8A84E]" : "text-slate-400"}`} />
                <div>
                  <div className="font-bold text-white text-xs">Student ID Card</div>
                  <div className="text-[11px] text-slate-400">CR80 Plastic Card Format (بطاقة طالب)</div>
                </div>
              </button>
            </div>
          </div>

          {/* 3. Canvas Dimensions & Presets */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-200">Dimensions & Presets</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DIMENSION_PRESETS.map((preset) => {
                const isSelected = width === preset.width && height === preset.height;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => onUpdateSettings({ width: preset.width, height: preset.height, templateKind: preset.kind })}
                    className={`p-2.5 rounded border text-left text-xs transition-all ${isSelected ? "border-[#C8A84E] bg-[#C8A84E]/10 text-white font-semibold" : "border-slate-800 bg-slate-800/40 text-slate-300 hover:bg-slate-800"}`}
                  >
                    <div>{preset.label}</div>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400">Custom Width (px)</span>
                <Input
                  type="number"
                  value={width}
                  onChange={(e) => onUpdateSettings({ width: Number(e.target.value) })}
                  className="bg-slate-800 border-slate-700 text-white font-mono text-xs h-8"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400">Custom Height (px)</span>
                <Input
                  type="number"
                  value={height}
                  onChange={(e) => onUpdateSettings({ height: Number(e.target.value) })}
                  className="bg-slate-800 border-slate-700 text-white font-mono text-xs h-8"
                />
              </div>
            </div>
          </div>

          {/* 4. Background Image Upload (Blank Design) */}
          <div className="space-y-2.5 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold text-slate-200 block">
                  Blank Template Background Image (تصميم الخلفية الخارجي)
                </label>
                <span className="text-[11px] text-slate-400 block">
                  Upload any blank certificate, frame design, or student card backdrop.
                </span>
              </div>
              {backgroundImageUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onUpdateSettings({ backgroundImageUrl: null })}
                  className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 h-7 text-[11px] gap-1 px-2"
                >
                  <Trash2 className="w-3 h-3" />
                  Remove Image
                </Button>
              )}
            </div>

            {backgroundImageUrl ? (
              <div className="relative p-2 bg-slate-950 rounded border border-slate-700 flex items-center gap-3">
                <img
                  src={backgroundImageUrl}
                  alt="Template Background Preview"
                  className="w-20 h-14 object-cover rounded border border-slate-600 bg-white"
                />
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-white block text-xs truncate">Custom Background Active</span>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                    <Check className="w-3 h-3" />
                    Ready for dynamic field placement
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-7 text-xs border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Replace
                </Button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-6 border-2 border-dashed border-slate-700 hover:border-[#C8A84E] rounded-lg bg-slate-950/50 hover:bg-slate-950/80 cursor-pointer text-center space-y-2 transition-colors"
              >
                <Upload className="w-6 h-6 mx-auto text-[#C8A84E]" />
                <div className="text-xs font-semibold text-white">Click or Drag &amp; Drop Background Image</div>
                <div className="text-[11px] text-slate-400">
                  PNG, JPG, or WebP (Recommended: 1600×1131 px for certificates, 600×900 px for ID cards)
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={handleFileUpload}
              className="hidden"
            />

            {uploading && (
              <div className="text-xs text-[#C8A84E] animate-pulse">Uploading and preparing image...</div>
            )}

            {uploadError && (
              <div className="text-xs text-rose-400">{uploadError}</div>
            )}
          </div>

          {/* 5. Default Template Setting */}
          <div className="p-3 bg-slate-950/60 rounded border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-semibold text-white block text-xs">
                Set as Default {templateKind === "certificate" ? "Certificate" : "Student Card"} Template
              </span>
              <span className="text-[11px] text-slate-400 block">
                Automatically use this template when issuing new credentials unless chosen otherwise.
              </span>
            </div>
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => onUpdateSettings({ isDefault: e.target.checked })}
              className="w-4 h-4 text-[#020B5A] rounded border-slate-700 accent-[#C8A84E] cursor-pointer"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end gap-2 bg-slate-950/60">
          <Button
            type="button"
            onClick={onClose}
            className="bg-[#020B5A] hover:bg-cambria-academic text-white font-semibold text-xs px-5 h-9"
          >
            Apply &amp; Continue Editing
          </Button>
        </div>
      </div>
    </div>
  );
}
