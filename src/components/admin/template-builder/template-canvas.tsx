"use client";

import React, { useRef, useState, useEffect } from "react";
import { TemplateField, TemplateKind } from "@/types/database";
import { SAMPLE_STUDENT_PREVIEW_DATA } from "./template-presets";
import { cn } from "@/lib/utils";
import { Move, QrCode, Image as ImageIcon, Sparkles } from "lucide-react";

interface TemplateCanvasProps {
  width: number;
  height: number;
  backgroundImageUrl?: string | null;
  backgroundColor?: string;
  templateKind: TemplateKind;
  fields: TemplateField[];
  selectedFieldId: string | null;
  onSelectField: (id: string | null) => void;
  onUpdateField: (id: string, updates: Partial<TemplateField>) => void;
  zoom: number;
  showGrid: boolean;
  previewMode: boolean;
}

export function TemplateCanvas({
  width,
  height,
  backgroundImageUrl,
  backgroundColor = "#FFFFFF",
  templateKind,
  fields,
  selectedFieldId,
  onSelectField,
  onUpdateField,
  zoom,
  showGrid,
  previewMode,
}: TemplateCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingFieldId, setDraggingFieldId] = useState<string | null>(null);
  const [resizingFieldId, setResizingFieldId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; fieldX: number; fieldY: number }>({
    x: 0,
    y: 0,
    fieldX: 0,
    fieldY: 0,
  });
  const [resizeStart, setResizeStart] = useState<{ x: number; y: number; fieldW: number; fieldH: number }>({
    x: 0,
    y: 0,
    fieldW: 0,
    fieldH: 0,
  });

  const isCertificate = templateKind === "certificate";

  // Handle Field Drag Start
  const handleFieldMouseDown = (e: React.MouseEvent, field: TemplateField) => {
    if (previewMode) return;
    e.stopPropagation();
    onSelectField(field.id);
    setDraggingFieldId(field.id);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      fieldX: field.x,
      fieldY: field.y,
    });
  };

  // Handle Field Resize Start
  const handleResizeMouseDown = (e: React.MouseEvent, field: TemplateField) => {
    if (previewMode) return;
    e.stopPropagation();
    onSelectField(field.id);
    setResizingFieldId(field.id);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      fieldW: field.w,
      fieldH: field.h,
    });
  };

  // Handle Global Mouse Move & Up for dragging/resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggingFieldId) {
        const deltaX = (e.clientX - dragStart.x) / zoom;
        const deltaY = (e.clientY - dragStart.y) / zoom;
        let newX = Math.round(dragStart.fieldX + deltaX);
        let newY = Math.round(dragStart.fieldY + deltaY);

        // Snap to 10px grid if grid is enabled
        if (showGrid) {
          newX = Math.round(newX / 10) * 10;
          newY = Math.round(newY / 10) * 10;
        }

        // Clamp inside canvas boundary
        newX = Math.max(0, Math.min(width - 20, newX));
        newY = Math.max(0, Math.min(height - 20, newY));

        onUpdateField(draggingFieldId, { x: newX, y: newY });
      } else if (resizingFieldId) {
        const deltaW = (e.clientX - resizeStart.x) / zoom;
        const deltaH = (e.clientY - resizeStart.y) / zoom;
        let newW = Math.max(30, Math.round(resizeStart.fieldW + deltaW));
        let newH = Math.max(20, Math.round(resizeStart.fieldH + deltaH));

        if (showGrid) {
          newW = Math.round(newW / 10) * 10;
          newH = Math.round(newH / 10) * 10;
        }

        onUpdateField(resizingFieldId, { w: newW, h: newH });
      }
    };

    const handleMouseUp = () => {
      setDraggingFieldId(null);
      setResizingFieldId(null);
    };

    if (draggingFieldId || resizingFieldId) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingFieldId, resizingFieldId, dragStart, resizeStart, zoom, showGrid, width, height, onUpdateField]);

  return (
    <div
      ref={containerRef}
      onClick={() => onSelectField(null)}
      className="relative flex items-center justify-center p-8 min-h-[600px] overflow-auto select-none bg-slate-950/40 rounded-lg border border-slate-800"
    >
      {/* Canvas Paper / Board */}
      <div
        style={{
          width: `${width * zoom}px`,
          height: `${height * zoom}px`,
        }}
        className="relative transition-all duration-75 shadow-2xl overflow-hidden rounded-[2px]"
      >
        <div
          style={{
            width: `${width}px`,
            height: `${height}px`,
            transform: `scale(${zoom})`,
            transformOrigin: "top left",
            backgroundColor: backgroundColor || (isCertificate ? "#FFFFFF" : "#020B5A"),
            backgroundImage: backgroundImageUrl ? `url('${backgroundImageUrl}')` : undefined,
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          className={cn(
            "relative w-full h-full",
            showGrid && !backgroundImageUrl && "bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:20px_20px]"
          )}
        >
          {/* Default Decorative Borders if no background image is uploaded */}
          {!backgroundImageUrl && isCertificate && (
            <>
              <div className="absolute top-[30px] left-[30px] right-[30px] bottom-[30px] border-[3px] border-[#020B5A] pointer-events-none" />
              <div className="absolute top-[40px] left-[40px] right-[40px] bottom-[40px] border border-[#C8A84E] pointer-events-none" />
              <div className="absolute top-[46px] left-[46px] w-10 h-10 border-t-2 border-l-2 border-[#C8A84E] pointer-events-none" />
              <div className="absolute top-[46px] right-[46px] w-10 h-10 border-t-2 border-r-2 border-[#C8A84E] pointer-events-none" />
              <div className="absolute bottom-[46px] left-[46px] w-10 h-10 border-b-2 border-l-2 border-[#C8A84E] pointer-events-none" />
              <div className="absolute bottom-[46px] right-[46px] w-10 h-10 border-b-2 border-r-2 border-[#C8A84E] pointer-events-none" />
            </>
          )}

          {!backgroundImageUrl && !isCertificate && (
            <div className="absolute top-[15px] left-[15px] right-[15px] bottom-[15px] border border-[#C8A84E]/40 rounded-lg pointer-events-none" />
          )}

          {/* DYNAMIC PLACED FIELDS */}
          {fields.map((field) => {
            const isSelected = selectedFieldId === field.id;
            const isRtl = field.direction === "rtl";

            // Resolve Preview Content
            let displayContent = field.label || field.staticText || field.contentKey || "Field";
            if (previewMode) {
              if (field.contentKey && (SAMPLE_STUDENT_PREVIEW_DATA as any)[field.contentKey]) {
                displayContent = (SAMPLE_STUDENT_PREVIEW_DATA as any)[field.contentKey];
              } else if (field.staticText) {
                displayContent = field.staticText;
              }
            }

            const prefix = field.staticPrefix || "";
            const finalRenderedText = prefix ? `${prefix}${displayContent}` : displayContent;

            return (
              <div
                key={field.id}
                onMouseDown={(e) => handleFieldMouseDown(e, field)}
                style={{
                  left: `${field.x}px`,
                  top: `${field.y}px`,
                  width: `${field.w}px`,
                  height: `${field.h}px`,
                  opacity: field.opacity ?? 1,
                  borderRadius: field.borderRadius ? `${field.borderRadius}px` : undefined,
                }}
                className={cn(
                  "absolute flex flex-col justify-center transition-shadow",
                  !previewMode && "cursor-move hover:outline hover:outline-1 hover:outline-blue-400",
                  isSelected && !previewMode && "outline outline-2 outline-[#C8A84E] bg-blue-500/10 shadow-lg z-30",
                  !isSelected && !previewMode && "border border-dashed border-slate-400/60 bg-white/5"
                )}
              >
                {/* Field Coordinate Badge & Label (When Selected) */}
                {isSelected && !previewMode && (
                  <div className="absolute -top-7 left-0 bg-[#020B5A] text-white text-[11px] font-mono font-semibold px-2 py-0.5 rounded shadow flex items-center gap-1.5 whitespace-nowrap z-40 pointer-events-none">
                    <Move className="w-3 h-3 text-[#C8A84E]" />
                    <span>{field.label || field.id}</span>
                    <span className="text-slate-300 border-l border-white/20 pl-1.5">
                      {field.x},{field.y} ({field.w}×{field.h})
                    </span>
                  </div>
                )}

                {/* Resize Handle (Bottom-Right Corner) */}
                {isSelected && !previewMode && (
                  <div
                    onMouseDown={(e) => handleResizeMouseDown(e, field)}
                    className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-[#C8A84E] border-2 border-white rounded-full cursor-nwse-resize shadow z-40"
                  />
                )}

                {/* FIELD CONTENT RENDERING */}
                {field.type === "qr" ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-1 bg-white border border-slate-200 rounded">
                    <QrCode className="w-full h-full text-[#020B5A]" />
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider block mt-0.5">
                      QR Verify
                    </span>
                  </div>
                ) : field.type === "image" ? (
                  field.contentKey === "college_seal" ? (
                    <div className="w-full h-full flex items-center justify-center p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/images/cambria-seal.png"
                        alt="Cambria Official Seal"
                        className="w-full h-full object-contain filter drop-shadow-sm"
                      />
                    </div>
                  ) : field.contentKey === "student_photo" || field.contentKey === "student_avatar" ? (
                    <div
                      style={{ borderRadius: field.borderRadius ? `${field.borderRadius}px` : undefined }}
                      className="w-full h-full border-2 border-[#C8A84E] overflow-hidden flex flex-col items-center justify-center bg-slate-100 text-slate-400"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/images/avatar-placeholder.png"
                        alt="Student Photo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center border border-dashed border-slate-300 bg-slate-50 text-[10px] text-slate-500">
                      Image Asset
                    </div>
                  )
                ) : (
                  /* Text Field */
                  <div
                    style={{
                      fontFamily:
                        field.font === "Alex Brush"
                          ? "'Alex Brush', cursive"
                          : field.font === "Great Vibes"
                          ? "'Great Vibes', cursive"
                          : field.font === "Montserrat"
                          ? "'Montserrat', sans-serif"
                          : field.font === "Cormorant Garamond"
                          ? "'Cormorant Garamond', serif"
                          : field.font === "Cairo"
                          ? "'Cairo', sans-serif"
                          : field.font === "Playfair Display"
                          ? "'Playfair Display', serif"
                          : field.font === "Courier New"
                          ? "'Courier New', monospace"
                          : "'Inter', sans-serif",
                      fontSize: `${field.size || 16}px`,
                      fontWeight: field.weight || 400,
                      fontStyle: field.fontStyle || "normal",
                      color: field.color || (isCertificate ? "#020B5A" : "#FFFFFF"),
                      textAlign: field.align || (isRtl ? "right" : "left"),
                      direction: isRtl ? "rtl" : "ltr",
                      letterSpacing: field.letterSpacing,
                      lineHeight: field.lineHeight ? `${field.lineHeight}` : 1.25,
                    }}
                    className={cn(
                      "w-full truncate px-1",
                      !previewMode && !field.staticText && !displayContent && "text-slate-400 italic"
                    )}
                  >
                    {finalRenderedText}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
