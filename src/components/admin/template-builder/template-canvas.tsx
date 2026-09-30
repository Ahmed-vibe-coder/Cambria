"use client";

import React, { useRef, useState, useEffect } from "react";
import { TemplateField, TemplateKind } from "@/types/database";
import { SAMPLE_STUDENT_PREVIEW_DATA } from "./template-presets";
import { cn } from "@/lib/utils";
import {
  Move,
  QrCode,
  Image as ImageIcon,
  Sparkles,
  Lock,
  Unlock,
  Copy,
  Trash2,
  MoveHorizontal,
  MoveVertical,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
} from "lucide-react";

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
  onDeleteField?: (id: string) => void;
  onDuplicateField?: (id: string) => void;
  onBringToFront?: (id: string) => void;
  onSendToBack?: (id: string) => void;
  onToggleLock?: (id: string) => void;
  onAlignField?: (id: string, align: "center-h" | "center-v") => void;
  onCommitHistory?: () => void;
  zoom: number;
  showGrid: boolean;
  previewMode: boolean;
}

type ResizeHandleType = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

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
  onDeleteField,
  onDuplicateField,
  onBringToFront,
  onSendToBack,
  onToggleLock,
  onAlignField,
  onCommitHistory,
  zoom,
  showGrid,
  previewMode,
}: TemplateCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingFieldId, setDraggingFieldId] = useState<string | null>(null);
  const [resizingFieldId, setResizingFieldId] = useState<string | null>(null);
  const [guideLines, setGuideLines] = useState<{ x: number | null; y: number | null }>({
    x: null,
    y: null,
  });

  const isDraggingRef = useRef(false);
  const isResizingRef = useRef(false);
  const activeFieldIdRef = useRef<string | null>(null);
  const currentResizeHandleRef = useRef<ResizeHandleType>("se");
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
    fieldX: number;
    fieldY: number;
    fieldW: number;
    fieldH: number;
    lockAspectRatio: boolean;
  }>({
    clientX: 0,
    clientY: 0,
    fieldX: 0,
    fieldY: 0,
    fieldW: 0,
    fieldH: 0,
    lockAspectRatio: false,
  });

  // Up-to-date refs to avoid stale closures in global listeners
  const onUpdateFieldRef = useRef(onUpdateField);
  onUpdateFieldRef.current = onUpdateField;

  const onSelectFieldRef = useRef(onSelectField);
  onSelectFieldRef.current = onSelectField;

  const onDeleteFieldRef = useRef(onDeleteField);
  onDeleteFieldRef.current = onDeleteField;

  const onCommitHistoryRef = useRef(onCommitHistory);
  onCommitHistoryRef.current = onCommitHistory;

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
    if (previewMode || field.isLocked) return;
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

  // Handle 8-Directional Field Resize Start
  const handleResizeMouseDown = (
    e: React.MouseEvent,
    field: TemplateField,
    handle: ResizeHandleType
  ) => {
    if (previewMode || field.isLocked) return;
    if (e.button !== 0) return;
    e.stopPropagation();

    onSelectField(field.id);

    isResizingRef.current = true;
    currentResizeHandleRef.current = handle;
    dragOccurredRef.current = false;
    justFinishedDragRef.current = false;
    activeFieldIdRef.current = field.id;

    const lockRatio = Boolean(
      field.lockAspectRatio ||
        field.type === "qr" ||
        field.contentKey === "college_seal"
    );

    resizeStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      fieldX: field.x,
      fieldY: field.y,
      fieldW: field.w,
      fieldH: field.h,
      lockAspectRatio: lockRatio,
    };

    setResizingFieldId(field.id);
  };

  // Stable Global Mouse Move & Up Handler with Smart Magnetic Snapping
  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      const z = zoomRef.current || 1;
      const w = widthRef.current;
      const h = heightRef.current;
      const grid = showGridRef.current;

      // 1. DRAGGING HANDLER
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

        const currentField = fieldsRef.current.find(
          (f) => f.id === activeFieldIdRef.current
        );
        const fW = currentField?.w || 100;
        const fH = currentField?.h || 40;

        let activeGuideX: number | null = null;
        let activeGuideY: number | null = null;

        // Smart Magnetic Snapping to Canvas Center (X)
        const canvasCenterX = Math.round(w / 2);
        const elementCenterX = newX + Math.round(fW / 2);
        if (Math.abs(elementCenterX - canvasCenterX) <= 10) {
          newX = Math.round(canvasCenterX - fW / 2);
          activeGuideX = canvasCenterX;
        }

        // Smart Magnetic Snapping to Canvas Center (Y)
        const canvasCenterY = Math.round(h / 2);
        const elementCenterY = newY + Math.round(fH / 2);
        if (Math.abs(elementCenterY - canvasCenterY) <= 10) {
          newY = Math.round(canvasCenterY - fH / 2);
          activeGuideY = canvasCenterY;
        }

        // Magnetic Snapping to other elements' alignment points
        if (!activeGuideX) {
          for (const other of fieldsRef.current) {
            if (other.id === activeFieldIdRef.current || other.isHidden) continue;
            const otherCenterX = other.x + Math.round(other.w / 2);
            if (Math.abs(elementCenterX - otherCenterX) <= 8) {
              newX = Math.round(otherCenterX - fW / 2);
              activeGuideX = otherCenterX;
              break;
            } else if (Math.abs(newX - other.x) <= 6) {
              newX = other.x;
              activeGuideX = other.x;
              break;
            }
          }
        }

        // Apply 10px grid if not magnetically snapped
        if (grid && !activeGuideX) {
          newX = Math.round(newX / 10) * 10;
        }
        if (grid && !activeGuideY) {
          newY = Math.round(newY / 10) * 10;
        }

        // Clamp inside canvas boundary
        newX = Math.max(0, Math.min(w - 20, newX));
        newY = Math.max(0, Math.min(h - 20, newY));

        setGuideLines({ x: activeGuideX, y: activeGuideY });
        onUpdateFieldRef.current(activeFieldIdRef.current, { x: newX, y: newY });
      }

      // 2. 8-DIRECTIONAL RESIZING HANDLER
      else if (isResizingRef.current && activeFieldIdRef.current) {
        const handle = currentResizeHandleRef.current;
        const start = resizeStartRef.current;
        const deltaX = (e.clientX - start.clientX) / z;
        const deltaY = (e.clientY - start.clientY) / z;

        if (Math.abs(e.clientX - start.clientX) > 2 || Math.abs(e.clientY - start.clientY) > 2) {
          dragOccurredRef.current = true;
        }

        let newX = start.fieldX;
        let newY = start.fieldY;
        let newW = start.fieldW;
        let newH = start.fieldH;

        // Horizontal changes (East / West)
        if (handle.includes("e")) {
          newW = Math.max(30, Math.round(start.fieldW + deltaX));
        } else if (handle.includes("w")) {
          const rawW = Math.round(start.fieldW - deltaX);
          newW = Math.max(30, rawW);
          newX = start.fieldX + (start.fieldW - newW);
        }

        // Vertical changes (North / South)
        if (handle.includes("s")) {
          newH = Math.max(20, Math.round(start.fieldH + deltaY));
        } else if (handle.includes("n")) {
          const rawH = Math.round(start.fieldH - deltaY);
          newH = Math.max(20, rawH);
          newY = start.fieldY + (start.fieldH - newH);
        }

        // Lock Aspect Ratio if enabled
        if (start.lockAspectRatio) {
          const ratio = start.fieldW / start.fieldH;
          if (handle === "e" || handle === "w") {
            newH = Math.round(newW / ratio);
          } else {
            newW = Math.round(newH * ratio);
          }
        }

        if (grid) {
          newW = Math.round(newW / 10) * 10;
          newH = Math.round(newH / 10) * 10;
          newX = Math.round(newX / 10) * 10;
          newY = Math.round(newY / 10) * 10;
        }

        onUpdateFieldRef.current(activeFieldIdRef.current, {
          x: Math.max(0, newX),
          y: Math.max(0, newY),
          w: Math.max(20, newW),
          h: Math.max(15, newH),
        });
      }
    };

    const handleWindowMouseUp = () => {
      if (isDraggingRef.current || isResizingRef.current) {
        isDraggingRef.current = false;
        isResizingRef.current = false;
        setDraggingFieldId(null);
        setResizingFieldId(null);
        setGuideLines({ x: null, y: null });

        if (dragOccurredRef.current) {
          justFinishedDragRef.current = true;
          onCommitHistoryRef.current?.();
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

  // Keyboard Nudge, Navigation, and Delete for Selected Field
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
      } else if (e.key === "Delete" || e.key === "Backspace") {
        if (!targetField.isLocked && onDeleteFieldRef.current) {
          e.preventDefault();
          onDeleteFieldRef.current(selectedFieldId);
        }
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
          {/* Smart Magnetic Snapping Guidelines */}
          {guideLines.x !== null && (
            <div
              style={{ left: `${guideLines.x}px` }}
              className="absolute top-0 bottom-0 w-[1.5px] bg-[#C8A84E] shadow-[0_0_8px_rgba(200,168,78,0.9)] z-50 pointer-events-none"
            >
              <span className="absolute top-2 left-1 bg-[#020B5A] text-[#C8A84E] text-[9px] font-mono px-1 py-0.5 rounded shadow border border-[#C8A84E]/40 whitespace-nowrap">
                Snap Center X
              </span>
            </div>
          )}

          {guideLines.y !== null && (
            <div
              style={{ top: `${guideLines.y}px` }}
              className="absolute left-0 right-0 h-[1.5px] bg-[#C8A84E] shadow-[0_0_8px_rgba(200,168,78,0.9)] z-50 pointer-events-none"
            >
              <span className="absolute top-1 left-2 bg-[#020B5A] text-[#C8A84E] text-[9px] font-mono px-1 py-0.5 rounded shadow border border-[#C8A84E]/40 whitespace-nowrap">
                Snap Center Y
              </span>
            </div>
          )}

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
            if (field.isHidden && previewMode) return null;

            const isSelected = selectedFieldId === field.id;
            const isRtl = field.direction === "rtl";
            const isDraggingThis = draggingFieldId === field.id;

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
                  opacity: field.isHidden ? 0.35 : field.opacity ?? 1,
                  borderRadius: field.borderRadius ? `${field.borderRadius}px` : undefined,
                }}
                className={cn(
                  "absolute flex flex-col justify-center select-none transition-shadow",
                  !previewMode && !field.isLocked && "cursor-pointer hover:outline hover:outline-2 hover:outline-blue-400/80 hover:bg-blue-500/5",
                  !previewMode && field.isLocked && "cursor-not-allowed",
                  isSelected && !previewMode && "outline outline-2 outline-[#C8A84E] bg-blue-500/10 shadow-xl z-30 ring-2 ring-[#C8A84E]/40",
                  isSelected && !previewMode && !field.isLocked && "cursor-move",
                  isDraggingThis && "opacity-90 shadow-2xl scale-[1.01] cursor-grabbing",
                  !isSelected && !previewMode && "border border-dashed border-slate-400/60 bg-white/5 z-10"
                )}
                title={!previewMode ? `${field.label || field.id} — ${field.isLocked ? "Locked" : "Drag to move or resize"}` : undefined}
              >
                {/* 1. Floating Quick Actions Context Bar (When Selected) */}
                {isSelected && !previewMode && (
                  <div
                    style={{
                      top: field.y < 45 ? `${field.h + 8}px` : "-36px",
                      left: "0px",
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute z-50 flex items-center gap-0.5 bg-slate-900/95 border border-[#C8A84E]/60 text-white rounded-md p-1 shadow-2xl backdrop-blur-sm animate-in fade-in zoom-in-95 duration-100 whitespace-nowrap"
                  >
                    <button
                      type="button"
                      onClick={() => onAlignField?.(field.id, "center-h")}
                      className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white"
                      title="Center Horizontally (توسيط أفقي)"
                    >
                      <MoveHorizontal className="w-3.5 h-3.5 text-[#C8A84E]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onAlignField?.(field.id, "center-v")}
                      className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white"
                      title="Center Vertically (توسيط رأسي)"
                    >
                      <MoveVertical className="w-3.5 h-3.5 text-[#C8A84E]" />
                    </button>
                    <div className="w-[1px] h-3.5 bg-slate-700 mx-0.5" />
                    <button
                      type="button"
                      onClick={() => onBringToFront?.(field.id)}
                      className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white"
                      title="Bring to Front (إلى المقدمة)"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onSendToBack?.(field.id)}
                      className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white"
                      title="Send to Back (إلى الخلفية)"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-[1px] h-3.5 bg-slate-700 mx-0.5" />
                    <button
                      type="button"
                      onClick={() => onToggleLock?.(field.id)}
                      className={`p-1 rounded ${
                        field.isLocked
                          ? "bg-amber-500/20 text-amber-400"
                          : "hover:bg-slate-800 text-slate-300 hover:text-white"
                      }`}
                      title={
                        field.isLocked
                          ? "Unlock Position (فك قفل العنصر)"
                          : "Lock Position (قفل العنصر لمنع التحريك بالخطأ)"
                      }
                    >
                      {field.isLocked ? (
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <Unlock className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDuplicateField?.(field.id)}
                      className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white"
                      title="Duplicate (تكرار العنصر)"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteField?.(field.id)}
                      className="p-1 hover:bg-rose-950/60 rounded text-rose-400 hover:text-rose-300"
                      title="Delete (حذف العنصر)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Field Coordinate Badge & Label (When Selected) */}
                {isSelected && !previewMode && (
                  <div className="absolute -top-7 right-0 bg-[#020B5A] text-white text-[11px] font-mono font-semibold px-2 py-0.5 rounded shadow-lg flex items-center gap-1.5 whitespace-nowrap z-40 pointer-events-none border border-[#C8A84E]/40">
                    <Move className="w-3 h-3 text-[#C8A84E]" />
                    <span>{field.label || field.id}</span>
                    <span className="text-slate-300 border-l border-white/20 pl-1.5 text-[10px]">
                      {field.x},{field.y} ({field.w}×{field.h})
                    </span>
                    {field.isLocked && (
                      <span className="text-amber-400 text-[9px] font-bold border-l border-white/20 pl-1">
                        LOCKED
                      </span>
                    )}
                  </div>
                )}

                {/* 2. 8 MULTI-DIRECTIONAL RESIZE HANDLES (When Selected & Not Locked) */}
                {isSelected && !previewMode && !field.isLocked && (
                  <>
                    {/* Top-Left (NW) */}
                    <div
                      onMouseDown={(e) => handleResizeMouseDown(e, field, "nw")}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-[#C8A84E] border-2 border-white rounded-full cursor-nwse-resize shadow-md z-40 hover:scale-125 transition-transform"
                      title="Resize Top-Left"
                    />
                    {/* Top-Center (N) */}
                    <div
                      onMouseDown={(e) => handleResizeMouseDown(e, field, "n")}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#C8A84E] border-2 border-white rounded-full cursor-ns-resize shadow-md z-40 hover:scale-125 transition-transform"
                      title="Resize Height (Top)"
                    />
                    {/* Top-Right (NE) */}
                    <div
                      onMouseDown={(e) => handleResizeMouseDown(e, field, "ne")}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-[#C8A84E] border-2 border-white rounded-full cursor-nesw-resize shadow-md z-40 hover:scale-125 transition-transform"
                      title="Resize Top-Right"
                    />
                    {/* Middle-Right (E) */}
                    <div
                      onMouseDown={(e) => handleResizeMouseDown(e, field, "e")}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-[#C8A84E] border-2 border-white rounded-full cursor-ew-resize shadow-md z-40 hover:scale-125 transition-transform"
                      title="Resize Width (Right)"
                    />
                    {/* Bottom-Right (SE) */}
                    <div
                      onMouseDown={(e) => handleResizeMouseDown(e, field, "se")}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-[#C8A84E] border-2 border-white rounded-full cursor-nwse-resize shadow-md z-40 hover:scale-125 transition-transform ring-1 ring-black/40"
                      title="Resize Bottom-Right"
                    />
                    {/* Bottom-Center (S) */}
                    <div
                      onMouseDown={(e) => handleResizeMouseDown(e, field, "s")}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#C8A84E] border-2 border-white rounded-full cursor-ns-resize shadow-md z-40 hover:scale-125 transition-transform"
                      title="Resize Height (Bottom)"
                    />
                    {/* Bottom-Left (SW) */}
                    <div
                      onMouseDown={(e) => handleResizeMouseDown(e, field, "sw")}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-[#C8A84E] border-2 border-white rounded-full cursor-nesw-resize shadow-md z-40 hover:scale-125 transition-transform"
                      title="Resize Bottom-Left"
                    />
                    {/* Middle-Left (W) */}
                    <div
                      onMouseDown={(e) => handleResizeMouseDown(e, field, "w")}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-[#C8A84E] border-2 border-white rounded-full cursor-ew-resize shadow-md z-40 hover:scale-125 transition-transform"
                      title="Resize Width (Left)"
                    />
                  </>
                )}

                {/* 3. FIELD CONTENT RENDERING */}
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
                  ) : field.contentKey === "student_photo" ||
                    field.contentKey === "student_avatar" ? (
                    <div
                      style={{
                        borderRadius: field.borderRadius
                          ? `${field.borderRadius}px`
                          : undefined,
                      }}
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
                      !previewMode &&
                        !field.staticText &&
                        !displayContent &&
                        "text-slate-400 italic"
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
