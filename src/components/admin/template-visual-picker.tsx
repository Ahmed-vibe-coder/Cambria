"use client";

import React, { useState } from "react";
import { Template } from "@/types/database";
import {
  CheckCircle2,
  Eye,
  Maximize2,
  X,
  Award,
  Sparkles,
  CreditCard,
  FileText,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TemplateVisualPickerProps {
  templates: Template[];
  selectedId: string;
  onSelect: (id: string) => void;
  name: string; // Form input name (e.g. "certificate_template_id" or "card_template_id")
  kind: "certificate" | "student_card";
  disabled?: boolean;
}

export function TemplateVisualPicker({
  templates,
  selectedId,
  onSelect,
  name,
  kind,
  disabled = false,
}: TemplateVisualPickerProps) {
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const filteredTemplates = templates.filter((t) => t.template_kind === kind);

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className={`space-y-3 ${disabled ? "opacity-40 pointer-events-none" : ""}`}>
      {/* Hidden input to ensure FormData gets the selected template ID */}
      <input type="hidden" name={name} value={selectedId || ""} />

      {filteredTemplates.length === 0 ? (
        <div className="p-6 border border-dashed border-slate-300 rounded-[6px] text-center bg-slate-50 text-slate-500 text-xs">
          <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
          <p className="font-semibold text-slate-700">No custom templates found for this category</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            The platform will automatically generate the standard institutional default design.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredTemplates.map((template) => {
            const isSelected = selectedId === template.id;
            const hasError = imageErrors[template.id];
            const hasImage = Boolean(template.background_image_url && !hasError);
            const isLandscape = template.width >= template.height;

            return (
              <div
                key={template.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelect(template.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(template.id);
                  }
                }}
                className={`group relative rounded-[8px] border text-left transition-all overflow-hidden flex flex-col justify-between cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-cambria-academic ${
                  isSelected
                    ? "border-cambria-navy bg-cambria-soft/25 ring-2 ring-cambria-navy shadow-md"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs"
                }`}
              >
                {/* Visual Thumbnail Frame */}
                <div className="relative p-2.5 bg-slate-100/70 border-b border-slate-100 flex items-center justify-center overflow-hidden h-36">
                  {/* Selected / Radio Badge */}
                  <div className="absolute top-2 left-2 z-10">
                    {isSelected ? (
                      <span className="flex items-center gap-1 bg-cambria-navy text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                        <CheckCircle2 className="w-3 h-3 text-[#C8A84E]" />
                        Selected
                      </span>
                    ) : (
                      <span className="w-4 h-4 rounded-full border-2 border-slate-300 bg-white group-hover:border-slate-400 block transition-colors" />
                    )}
                  </div>

                  {/* Zoom Preview Button */}
                  <button
                    type="button"
                    title="Enlarge & Preview Template"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewTemplate(template);
                    }}
                    className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-cambria-navy shadow-xs border border-slate-200 opacity-80 group-hover:opacity-100 transition-all hover:scale-105"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </button>

                  {/* Image Preview or Stylized Mockup */}
                  {hasImage ? (
                    <div className="w-full h-full flex items-center justify-center p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={template.background_image_url!}
                        alt={template.name}
                        onError={() => handleImageError(template.id)}
                        className={`max-h-full max-w-full object-contain rounded-[3px] shadow-xs border border-slate-200/60 transition-transform duration-200 group-hover:scale-[1.02] ${
                          isLandscape ? "w-full" : "h-full"
                        }`}
                      />
                    </div>
                  ) : (
                    /* Elegant CSS Mockup for templates without uploaded image */
                    <div
                      className={`w-full max-w-[200px] h-24 bg-white border border-dashed border-[#C8A84E]/60 rounded-[4px] p-2 flex flex-col justify-between shadow-2xs ${
                        isLandscape ? "aspect-[1.41/1]" : "aspect-[1/1.41] max-w-[120px]"
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                        <Award className="w-3 h-3 text-[#C8A84E]" />
                        <span className="text-[8px] font-serif text-slate-400 font-bold uppercase tracking-widest">
                          CAMBRIA
                        </span>
                      </div>
                      <div className="space-y-1 my-auto text-center">
                        <div className="h-1.5 w-16 bg-slate-200 rounded mx-auto" />
                        <div className="h-1 w-20 bg-slate-100 rounded mx-auto" />
                      </div>
                      <div className="flex justify-between items-center text-[7px] text-slate-300">
                        <span>QR CODE</span>
                        <span>OFFICIAL SEAL</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Template Meta Information */}
                <div className="p-3 space-y-1.5">
                  <div className="flex items-start justify-between gap-1.5">
                    <strong className="text-xs font-serif font-bold text-cambria-navy line-clamp-1 leading-snug">
                      {template.name}
                    </strong>
                    {template.is_active && (
                      <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider text-cambria-academic bg-cambria-soft px-1.5 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-mono text-[10px] text-slate-400">{template.code}</span>
                    <span className="text-[10px] text-slate-600 font-medium">
                      {template.width}×{template.height}px ({isLandscape ? "Landscape" : "Portrait"})
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIGHTBOX / FULL DESIGN PREVIEW MODAL */}
      {previewTemplate && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 sm:p-6"
          onClick={() => setPreviewTemplate(null)}
        >
          <div
            className="bg-white rounded-[10px] shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-hidden flex flex-col border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[4px] bg-cambria-soft text-cambria-navy flex items-center justify-center shrink-0">
                  {kind === "certificate" ? (
                    <Award className="w-4 h-4 text-cambria-academic" />
                  ) : (
                    <CreditCard className="w-4 h-4 text-cambria-academic" />
                  )}
                </div>
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-cambria-navy line-clamp-1">
                    {previewTemplate.name}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="font-mono font-medium text-cambria-academic">{previewTemplate.code}</span>
                    <span>•</span>
                    <span>
                      {previewTemplate.width} × {previewTemplate.height} px (
                      {previewTemplate.width >= previewTemplate.height ? "Landscape" : "Portrait"})
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / High Resolution Preview */}
            <div className="p-6 bg-slate-900/90 flex-1 overflow-auto flex items-center justify-center min-h-[300px] max-h-[65vh]">
              {previewTemplate.background_image_url && !imageErrors[previewTemplate.id] ? (
                <div className="relative max-h-full max-w-full flex items-center justify-center shadow-2xl rounded-[4px] overflow-hidden border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewTemplate.background_image_url}
                    alt={previewTemplate.name}
                    className="max-h-[55vh] max-w-full object-contain rounded-[4px]"
                  />
                </div>
              ) : (
                <div className="p-10 bg-white rounded-[6px] text-center space-y-3 max-w-md">
                  <Award className="w-12 h-12 text-[#C8A84E] mx-auto" />
                  <h4 className="font-serif text-lg font-bold text-cambria-navy">{previewTemplate.name}</h4>
                  <p className="text-xs text-slate-500">
                    Custom SVG and CSS canvas background with dynamic field bindings.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:px-6 border-t border-slate-100 flex items-center justify-between bg-white">
              <span className="text-xs text-slate-500 hidden sm:inline">
                Click below to select this template for credential generation.
              </span>
              <div className="flex items-center gap-2.5 ml-auto">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewTemplate(null)}
                  className="text-xs"
                >
                  Close Preview
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    onSelect(previewTemplate.id);
                    setPreviewTemplate(null);
                  }}
                  className="bg-cambria-navy hover:bg-cambria-academic text-white font-semibold text-xs gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C8A84E]" />
                  Select This Design
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
