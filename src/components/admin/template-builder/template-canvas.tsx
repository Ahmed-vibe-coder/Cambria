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

  const isDraggingRef = useRef(false);
  const isResizingRef = useRef(false);
  const activeFieldIdRef = useRef<string | null>(null);
  const dragOccurredRef = useRef(false);
  const justFinishedDragRef = useRef(false);

  const dragStartRef = useRef<{
    clientX: number;
    clientY: number;
    fieldX: number;
    fieldY: number;
  }>({ clientX: 0, clientY: 0, fieldX: 0, fieldY: 0 });

  const resizeStartRef = useRef<{
    clientX: number;
    clientY: number;
    fieldW: number;
    fieldH: number;
  }>({ clientX: 0, clientY: 0, fieldW: 0, fieldH: 0 });

  // Up-to-date refs to prevent stale closures and listener recreation thrashing
  const onUpdateFieldRef = useRef(onUpdateField);
  onUpdateFieldRef.current = onUpdateField;

  const onSelectFieldRef = useRef(onSelectField);
  onSelectFieldRef.current = onSelectField;

  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;

  const showGridRef = useRef(showGrid);
  showGridRef.current = showGrid;

  const widthRef = useRef(width);
  widthRef.current = width;

  const heightRef = useRef(height);
  heightRef.current = height;

  const fieldsRef = useRef(fields);
  fieldsRef.current = fields;

  const isCertificate = templateKind === "certificate";

  // Handle Field Drag Start
  const handleFieldMouseDown = (e: React.MouseEvent, field: TemplateField) => {
    if (previewMode) return;
    if (e.button !== 0) return; // Only primary left-click
    e.stopPropagation();

    // Select immediately on mouse down
    onSelectField(field.id);

    isDraggingRef.current = true;
    dragOccurredRef.current = false;
    justFinishedDragRef.current = false;
    activeFieldIdRef.current = field.id;

    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      fieldX: field.x,
      fieldY: field.y,
    };

    setDraggingFieldId(field.id);
  };

  // Handle Field Resize Start
  const handleResizeMouseDown = (e: React.MouseEvent, field: TemplateField) => {
    if (previewMode) return;
    if (e.button !== 0) return;
    e.stopPropagation();

    onSelectField(field.id);

    isResizingRef.current = true;
    dragOccurredRef.current = false;
    justFinishedDragRef.current = false;
    activeFieldIdRef.current = field.id;

    resizeStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      fieldW: field.w,
      fieldH: field.h,
    };

    setResizingFieldId(field.id);
  };

  // Stable Global Mouse Move & Up Handler
  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      const z = zoomRef.current || 1;
      const w = widthRef.current;
      const h = heightRef.current;
      const grid = showGridRef.current;

      if (isDraggingRef.current && activeFieldIdRef.current) {
        const deltaScreenX = e.clientX - dragStartRef.current.clientX;
        const deltaScreenY = e.clientY - dragStartRef.current.clientY;

        if (Math.abs(deltaScreenX) > 2 || Math.abs(deltaScreenY) > 2) {
          dragOccurredRef.current = true;
        }

        const deltaX = deltaScreenX / z;
        const deltaY = deltaScreenY / z;

        let newX = Math.round(dragStartRef.current.fieldX + deltaX);
        let newY = Math.round(dragStartRef.current.fieldY + deltaY);

        // Snap to 10px grid if grid is enabled
        if (grid) {
          newX = Math.round(newX / 10) * 10;
          newY = Math.round(newY / 10) * 10;
        }

        // Clamp inside canvas boundary
        newX = Math.max(0, Math.min(w - 20, newX));
        newY = Math.max(0, Math.min(h - 20, newY));

        onUpdateFieldRef.current(activeFieldIdRef.current, { x: newX, y: newY });
      } else if (isResizingRef.current && activeFieldIdRef.current) {
        const deltaScreenW = e.clientX - resizeStartRef.current.clientX;
        const deltaScreenH = e.clientY - resizeStartRef.current.clientY;

        if (Math.abs(deltaScreenW) > 2 || Math.abs(deltaScreenH) > 2) {
          dragOccurredRef.current = true;
        }

        const deltaW = deltaScreenW / z;
        const deltaH = deltaScreenH / z;

        let newW = Math.max(30, Math.round(resizeStartRef.current.fieldW + deltaW));
        let newH = Math.max(20, Math.round(resizeStartRef.current.fieldH + deltaH));

        if (grid) {
          newW = Math.round(newW / 10) * 10;
          newH = Math.round(newH / 10) * 10;
        }

        onUpdateFieldRef.current(activeFieldIdRef.current, { w: newW, h: newH });
      }
    };

    const handleWindowMouseUp = () => {
      if (isDraggingRef.current || isResizingRef.current) {
        isDraggingRef.current = false;
        isResizingRef.current = false;
        setDraggingFieldId(null);
        setResizingFieldId(null);

        if (dragOccurredRef.current) {
          justFinishedDragRef.current = true;
          setTimeout(() => {
            justFinishedDragRef.current = false;
            dragOccurredRef.current = false;
          }, 150);
        }
      }
    };

    window.addEventListener("mousemove", handleWindowMouseMove, { passive: true });
    window.addEventListener("mouseup", handleWindowMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
      window.removeEventListener("mouseup", handleWindowMouseUp);
    };
  }, []);

  // Keyboard Nudge & Navigation for Selected Field
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedFieldId || previewMode) return;

      // Don't intercept if user is typing in form controls
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.tagName === "SELECT")
      ) {
        return;
      }

      const targetField = fieldsRef.current.find((f) => f.id === selectedFieldId);
      if (!targetField) return;

      const step = e.shiftKey ? 10 : 1;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onUpdateFieldRef.current(selectedFieldId, {
          x: Math.max(0, targetField.x - step),
        });
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onUpdateFieldRef.current(selectedFieldId, {
          x: Math.min(widthRef.current - 20, targetField.x + step),
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        onUpdateFieldRef.current(selectedFieldId, {
          y: Math.max(0, targetField.y - step),
        });
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        onUpdateFieldRef.current(selectedFieldId, {
          y: Math.min(heightRef.current - 20, targetField.y + step),
        });
      } else if (e.key === "Escape") {
        onSelectFieldRef.current(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedFieldId, previewMode]);

  return (
    <div
      ref={containerRef}
      data-canvas-container="true"
      onClick={(e) => {
        // If a drag just took place, ignore this click
        if (justFinishedDragRef.current || dragOccurredRef.current) {
          return;
        }

        // Only deselect if clicked directly on container background or canvas board background
        const target = e.target as HTMLElement;
        const isBg =
          target === containerRef.current ||
          target.getAttribute("data-canvas-board") === "true" ||
          target.getAttribute("data-canvas-bg") === "true";

        if (isBg) {
          onSelectField(null);
        }
      }}
      className="relative flex items-center justify-center p-8 min-h-[600px] overflow-auto select-none bg-slate-950/40 rounded-lg border border-slate-800"
    >
      {/* Canvas Paper / Board Wrapper */}
      <div
        data-canvas-board="true"
        style={{
          width: `${width * zoom}px`,
          height: `${height * zoom}px`,
        }}
        className="relative transition-all duration-75 shadow-2xl overflow-hidden rounded-[2px]"
      >
        <div
          data-canvas-bg="true"
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
            <div data-canvas-bg="true" className="pointer-events-none">
              <div className="absolute top-[30px] left-[30px] right-[30px] bottom-[30px] border-[3px] border-[#020B5A] pointer-events-none" />
              <div className="absolute top-[40px] left-[40px] right-[40px] bottom-[40px] border border-[#C8A84E] pointer-events-none" />
              <div className="absolute top-[46px] left-[46px] w-10 h-10 border-t-2 border-l-2 border-[#C8A84E] pointer-events-none" />
              <div className="absolute top-[46px] right-[46px] w-10 h-10 border-t-2 border-r-2 border-[#C8A84E] pointer-events-none" />
              <div className="absolute bottom-[46px] left-[46px] w-10 h-10 border-b-2 border-l-2 border-[#C8A84E] pointer-events-none" />
              <div className="absolute bottom-[46px] right-[46px] w-10 h-10 border-b-2 border-r-2 border-[#C8A84E] pointer-events-none" />
            </div>
          )}

          {!backgroundImageUrl && !isCertificate && (
            <div
              data-canvas-bg="true"
              className="absolute top-[15px] left-[15px] right-[15px] bottom-[15px] border border-[#C8A84E]/40 rounded-lg pointer-events-none"
            />
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
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectField(field.id);
                }}
                style={{
                  left: `${field.x}px`,
                  top: `${field.y}px`,
                  width: `${field.w}px`,
                  height: `${field.h}px`,
                  opacity: field.opacity ?? 1,
                  borderRadius: field.borderRadius ? `${field.borderRadius}px` : undefined,
                }}
                className={cn(
                  "absolute flex flex-col justify-center transition-shadow select-none",
                  !previewMode && "cursor-pointer hover:outline hover:outline-2 hover:outline-blue-400/80 hover:bg-blue-500/5",
                  isSelected && !previewMode && "outline outline-2 outline-[#C8A84E] bg-blue-500/10 shadow-lg z-30 cursor-move ring-2 ring-[#C8A84E]/40",
                  !isSelected && !previewMode && "border border-dashed border-slate-400/60 bg-white/5 z-10"
                )}
                title={!previewMode ? `${field.label || field.id} — Click to select & edit in right panel` : undefined}
              >
                {/* Field Coordinate Badge & Label (When Selected) */}
                {isSelected && !previewMode && (
                  <div className="absolute -top-7 left-0 bg-[#020B5A] text-white text-[11px] font-mono font-semibold px-2 py-0.5 rounded shadow-lg flex items-center gap-1.5 whitespace-nowrap z-40 pointer-events-none border border-[#C8A84E]/40">
                    <Move className="w-3 h-3 text-[#C8A84E]" />
                    <span>{field.label || field.id}</span>
                    <span className="text-slate-300 border-l border-white/20 pl-1.5 text-[10px]">
                      {field.x},{field.y} ({field.w}×{field.h})
                    </span>
                  </div>
                )}

                {/* Resize Handle (Bottom-Right Corner) */}
                {isSelected && !previewMode && (
                  <div
                    onMouseDown={(e) => handleResizeMouseDown(e, field)}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute -bottom-2 -right-2 w-4 h-4 bg-[#C8A84E] border-2 border-white rounded-full cursor-nwse-resize shadow-md z-40 hover:scale-125 transition-transform"
                    title="Drag to resize field"
                  />
                )}

                {/* FIELD CONTENT RENDERING (pointer-events-none & draggable=false to prevent native browser conflicts) */}
                {field.type === "qr" ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-1 bg-white border border-slate-200 rounded pointer-events-none select-none">
                    <QrCode className="w-full h-full text-[#020B5A] pointer-events-none" />
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider block mt-0.5 pointer-events-none">
                      QR Verify
                    </span>
                  </div>
                ) : field.type === "image" ? (
                  field.contentKey === "college_seal" ? (
                    <div className="w-full h-full flex items-center justify-center p-1 pointer-events-none select-none">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/images/cambria-seal.png"
                        alt="Cambria Official Seal"
                        draggable={false}
                        className="w-full h-full object-contain filter drop-shadow-sm pointer-events-none select-none"
                      />
                    </div>
                  ) : field.contentKey === "student_photo" || field.contentKey === "student_avatar" ? (
                    <div
                      style={{ borderRadius: field.borderRadius ? `${field.borderRadius}px` : undefined }}
                      className="w-full h-full border-2 border-[#C8A84E] overflow-hidden flex flex-col items-center justify-center bg-slate-100 text-slate-400 pointer-events-none select-none"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/images/avatar-placeholder.png"
                        alt="Student Photo"
                        draggable={false}
                        className="w-full h-full object-cover pointer-events-none select-none"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center border border-dashed border-slate-300 bg-slate-50 text-[10px] text-slate-500 pointer-events-none select-none">
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
                      "w-full truncate px-1 pointer-events-none select-none",
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
