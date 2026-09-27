"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Template, TemplateField, TemplateKind } from "@/types/database";
import { TemplateCanvas } from "./template-canvas";
import { FieldPropertiesPanel } from "./field-properties";
import { TemplateSettingsModal } from "./template-settings-modal";
import { AVAILABLE_FIELD_PRESETS, FieldPreset, SAMPLE_STUDENT_PREVIEW_DATA } from "./template-presets";
import { saveTemplateAction } from "@/actions/templates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Save,
  Plus,
  Settings2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Sparkles,
  ChevronDown,
  Sliders,
  Layers,
  Download,
} from "lucide-react";

interface TemplateBuilderProps {
  initialTemplate?: Template | null;
  defaultKind?: TemplateKind;
}

export function TemplateBuilder({
  initialTemplate,
  defaultKind = "certificate",
}: TemplateBuilderProps) {
  const router = useRouter();

  // Template Master State
  const [templateId, setTemplateId] = useState<string | undefined>(initialTemplate?.id);
  const [name, setName] = useState<string>(initialTemplate?.name || (defaultKind === "certificate" ? "New Custom Certificate" : "New Custom Student Card"));
  const [code, setCode] = useState<string>(initialTemplate?.code || "");
  const [templateKind, setTemplateKind] = useState<TemplateKind>(initialTemplate?.template_kind || defaultKind);
  const [width, setWidth] = useState<number>(initialTemplate?.width || (defaultKind === "certificate" ? 1600 : 600));
  const [height, setHeight] = useState<number>(initialTemplate?.height || (defaultKind === "certificate" ? 1131 : 900));
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null | undefined>(
    initialTemplate?.background_image_url || initialTemplate?.layout_schema?.background_image_url
  );
  const [backgroundColor, setBackgroundColor] = useState<string>(
    initialTemplate?.layout_schema?.background_color || (defaultKind === "certificate" ? "#FFFFFF" : "#020B5A")
  );
  const [isDefault, setIsDefault] = useState<boolean>(initialTemplate?.is_active ?? true);

  // Field List State
  const [fields, setFields] = useState<TemplateField[]>(
    initialTemplate?.layout_schema?.fields || []
  );
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  // Viewport & Editor UI State
  const [zoom, setZoom] = useState<number>(0.55);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isAddFieldOpen, setIsAddFieldOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Auto-calculate optimal fit zoom on mount
  useEffect(() => {
    const calcFitZoom = () => {
      const containerWidth = window.innerWidth - 440; // minus sidebars
      const targetZoom = Math.min(1.0, Math.max(0.25, (containerWidth * 0.9) / width));
      setZoom(Number(targetZoom.toFixed(2)));
    };
    calcFitZoom();
  }, [width]);

  // Selected Field Object
  const selectedField = fields.find((f) => f.id === selectedFieldId) || null;

  // Add a field from preset
  const handleAddFieldFromPreset = React.useCallback((preset: FieldPreset) => {
    const newField: TemplateField = {
      ...preset.field,
      id: `field_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };

    setFields((prev) => [...prev, newField]);
    setSelectedFieldId(newField.id);
    setIsAddFieldOpen(false);
    setIsSidebarOpen(true);
  }, []);

  // Update a field's attributes
  const handleUpdateField = React.useCallback((id: string, updates: Partial<TemplateField>) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  }, []);

  // Delete a field
  const handleDeleteField = React.useCallback((id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
    setSelectedFieldId((current) => (current === id ? null : current));
  }, []);

  // Duplicate a field
  const handleDuplicateField = React.useCallback((id: string) => {
    setFields((prev) => {
      const target = prev.find((f) => f.id === id);
      if (!target) return prev;

      const dupField: TemplateField = {
        ...target,
        id: `field_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        x: Math.min(width - target.w, target.x + 30),
        y: Math.min(height - target.h, target.y + 30),
        label: `${target.label || target.id} (Copy)`,
      };

      setSelectedFieldId(dupField.id);
      return [...prev, dupField];
    });
  }, [width, height]);

  // Export Mockup High-Resolution PNG
  const [isExporting, setIsExporting] = useState(false);
  const handleExportMockup = async () => {
    setIsExporting(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Draw background
      ctx.fillStyle = backgroundColor || (templateKind === "certificate" ? "#FFFFFF" : "#020B5A");
      ctx.fillRect(0, 0, width, height);

      // Draw background image if available
      if (backgroundImageUrl) {
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            ctx.drawImage(img, 0, 0, width, height);
            resolve();
          };
          img.onerror = () => resolve();
          img.src = backgroundImageUrl;
        });
      }

      // Draw placed fields
      for (const field of fields) {
        let text = field.label || field.staticText || field.contentKey || "";
        if (field.contentKey && (SAMPLE_STUDENT_PREVIEW_DATA as any)[field.contentKey]) {
          text = (SAMPLE_STUDENT_PREVIEW_DATA as any)[field.contentKey];
        } else if (field.staticText) {
          text = field.staticText;
        }
        if (field.staticPrefix) text = `${field.staticPrefix}${text}`;

        if (field.type === "qr") {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(field.x, field.y, field.w, field.h);
          ctx.strokeStyle = "#020B5A";
          ctx.lineWidth = 3;
          ctx.strokeRect(field.x, field.y, field.w, field.h);
          ctx.fillStyle = "#020B5A";
          ctx.font = "bold 14px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("QR VERIFY", field.x + field.w / 2, field.y + field.h / 2 + 5);
        } else if (field.type === "image") {
          ctx.strokeStyle = "#C8A84E";
          ctx.lineWidth = 2;
          ctx.strokeRect(field.x, field.y, field.w, field.h);
        } else {
          ctx.fillStyle = field.color || (templateKind === "certificate" ? "#020B5A" : "#FFFFFF");
          const fontSize = field.size || 18;
          const fontWeight = field.weight || 400;
          const fontStyle = field.fontStyle === "italic" ? "italic" : "normal";
          const fontFamily = field.font || "Inter";
          ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}", Inter, sans-serif`;

          const align = field.align || (field.direction === "rtl" ? "right" : "left");
          ctx.textAlign = align as CanvasTextAlign;

          let textX = field.x;
          if (align === "center") textX = field.x + field.w / 2;
          else if (align === "right") textX = field.x + field.w;

          const textY = field.y + field.h / 2 + fontSize / 3;
          ctx.fillText(text, textX, textY);
        }
      }

      // Trigger instant PNG download
      const link = document.createElement("a");
      link.download = `${name.replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, "_") || "template"}_mockup.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Export mockup failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  // Save Template Action
  const handleSave = async () => {
    setIsSaving(true);
    setStatusMessage(null);

    const layoutSchema = {
      template_kind: templateKind,
      width,
      height,
      background_image_url: backgroundImageUrl || null,
      background_color: backgroundColor,
      fields,
    };

    const res = await saveTemplateAction({
      id: templateId,
      name,
      code: code || undefined,
      template_kind: templateKind,
      width,
      height,
      background_image_url: backgroundImageUrl || null,
      layout_schema: layoutSchema,
      is_active: isDefault,
      is_default: isDefault,
    });

    setIsSaving(false);

    if (res.success && res.template) {
      setTemplateId(res.template.id);
      setCode(res.template.code);
      setStatusMessage({ type: "success", text: "Template saved successfully to database!" });
      setTimeout(() => {
        router.push("/admin/templates");
      }, 1200);
    } else {
      setStatusMessage({ type: "error", text: res.error || "Failed to save template" });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] -m-6 bg-slate-950 text-slate-100 overflow-hidden">
      {/* 1. TOP TOOLBAR */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/90 px-4 flex items-center justify-between gap-4 shrink-0 z-20">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/admin/templates">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2 min-w-0">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Template Name..."
              className="h-8 w-56 sm:w-64 bg-slate-950 border-slate-700 text-white font-semibold text-xs truncate"
            />
            <span className="hidden md:inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-[#C8A84E]/15 text-[#C8A84E] border border-[#C8A84E]/30">
              {templateKind === "certificate" ? "Certificate" : "Student Card"}
            </span>
            <span className="hidden lg:inline-block text-[11px] font-mono text-slate-400">
              {width}×{height}px
            </span>
          </div>
        </div>

        {/* Center: Add Field, Canvas Settings & Controls */}
        <div className="flex items-center gap-2">
          {/* Add Field Dropdown */}
          <div className="relative">
            <Button
              type="button"
              size="sm"
              onClick={() => setIsAddFieldOpen(!isAddFieldOpen)}
              className="h-8 bg-[#020B5A] hover:bg-cambria-academic text-white text-xs gap-1.5 font-semibold px-3"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Field</span>
              <ChevronDown className="w-3 h-3 text-slate-300" />
            </Button>

            {isAddFieldOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsAddFieldOpen(false)}
                />
                <div className="absolute top-10 left-0 w-72 max-h-96 overflow-y-auto bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-2 z-40 space-y-1 animate-in fade-in duration-100">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#C8A84E]">
                    Dynamic Student &amp; Academic Fields
                  </div>
                  {AVAILABLE_FIELD_PRESETS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => handleAddFieldFromPreset(p)}
                      className="w-full text-left p-2 rounded hover:bg-slate-800 text-xs flex flex-col gap-0.5 transition-colors group"
                    >
                      <span className="font-semibold text-white group-hover:text-[#C8A84E]">
                        {p.label}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {p.labelAr}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Canvas Settings Modal Trigger */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsSettingsOpen(true)}
            className="h-8 border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs gap-1.5"
          >
            <Settings2 className="w-3.5 h-3.5 text-[#C8A84E]" />
            <span className="hidden sm:inline">Canvas &amp; Background</span>
          </Button>

          {/* Zoom Controls */}
          <div className="hidden md:flex items-center rounded border border-slate-700 bg-slate-800 overflow-hidden h-8">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.2, Number((z - 0.05).toFixed(2))))}
              className="px-2 hover:bg-slate-700 text-slate-300 text-xs"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-[11px] font-mono text-slate-300 min-w-[45px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(1.5, Number((z + 0.05).toFixed(2))))}
              className="px-2 hover:bg-slate-700 text-slate-300 text-xs"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Toggle Grid */}
          <button
            type="button"
            onClick={() => setShowGrid(!showGrid)}
            className={`h-8 w-8 rounded flex items-center justify-center border ${showGrid ? "border-[#C8A84E] bg-[#C8A84E]/15 text-[#C8A84E]" : "border-slate-700 bg-slate-800 text-slate-400 hover:text-white"}`}
            title="Toggle Grid Snapping"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          {/* Toggle Preview Mode */}
          <Button
            type="button"
            variant={previewMode ? "default" : "outline"}
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
            className={`h-8 text-xs gap-1.5 ${previewMode ? "bg-amber-600 hover:bg-amber-500 text-white font-bold" : "border-slate-700 bg-slate-800 text-slate-200"}`}
          >
            {previewMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-[#C8A84E]" />}
            <span>{previewMode ? "Exit Preview" : "Live Preview"}</span>
          </Button>

          {/* Toggle Sidebar (Properties & Layers) */}
          {!previewMode && (
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`h-8 px-2.5 rounded flex items-center gap-1.5 border text-xs font-medium transition-colors ${
                isSidebarOpen
                  ? "border-[#C8A84E] bg-[#C8A84E]/15 text-[#C8A84E]"
                  : "border-slate-700 bg-slate-800 text-slate-400 hover:text-white"
              }`}
              title="Toggle Properties & Layers Sidebar"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Layers ({fields.length})</span>
            </button>
          )}
        </div>

        {/* Right: Save Button & Status */}
        <div className="flex items-center gap-2">
          {statusMessage && (
            <div
              className={`hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded ${statusMessage.type === "success" ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800" : "bg-rose-950/80 text-rose-400 border border-rose-800"}`}
            >
              {statusMessage.type === "success" ? (
                <Check className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportMockup}
            disabled={isExporting}
            className="h-8 border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs gap-1.5"
            title="Download full-resolution preview mockup PNG"
          >
            <Download className="w-3.5 h-3.5 text-[#C8A84E]" />
            <span className="hidden sm:inline">{isExporting ? "Exporting..." : "Export PNG"}</span>
          </Button>

          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="h-8 bg-[#C8A84E] hover:bg-[#B59438] text-slate-950 font-bold text-xs gap-1.5 shadow-md px-4"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? "Saving Template..." : "Save Template"}</span>
          </Button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE (Canvas + Properties Sidebar) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left / Center: Interactive Canvas */}
        <main className="flex-1 overflow-auto bg-slate-950 relative p-4 flex flex-col items-center justify-start">
          <TemplateCanvas
            width={width}
            height={height}
            backgroundImageUrl={backgroundImageUrl}
            backgroundColor={backgroundColor}
            templateKind={templateKind}
            fields={fields}
            selectedFieldId={selectedFieldId}
            onSelectField={(id) => {
              setSelectedFieldId(id);
              if (id) {
                setIsSidebarOpen(true);
              }
            }}
            onUpdateField={handleUpdateField}
            zoom={zoom}
            showGrid={showGrid}
            previewMode={previewMode}
          />
        </main>

        {/* Right: Properties Inspector Sidebar */}
        {!previewMode && isSidebarOpen && (
          <aside
            data-builder-sidebar="true"
            className="w-80 lg:w-96 border-l border-slate-800 bg-slate-900/95 overflow-y-auto shrink-0 shadow-2xl flex flex-col z-20"
          >
            <FieldPropertiesPanel
              field={selectedField}
              fields={fields}
              selectedFieldId={selectedFieldId}
              onSelectField={(id) => {
                setSelectedFieldId(id);
                if (id) {
                  setIsSidebarOpen(true);
                }
              }}
              canvasWidth={width}
              canvasHeight={height}
              onUpdateField={handleUpdateField}
              onDeleteField={handleDeleteField}
              onDuplicateField={handleDuplicateField}
              onAddFieldPreset={handleAddFieldFromPreset}
            />
          </aside>
        )}
      </div>

      {/* 3. CANVAS SETTINGS MODAL */}
      <TemplateSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        name={name}
        code={code}
        templateKind={templateKind}
        width={width}
        height={height}
        backgroundImageUrl={backgroundImageUrl}
        backgroundColor={backgroundColor}
        isDefault={isDefault}
        onUpdateSettings={(updates) => {
          if (updates.name !== undefined) setName(updates.name);
          if (updates.code !== undefined) setCode(updates.code);
          if (updates.templateKind !== undefined) setTemplateKind(updates.templateKind);
          if (updates.width !== undefined) setWidth(updates.width);
          if (updates.height !== undefined) setHeight(updates.height);
          if (updates.backgroundImageUrl !== undefined) setBackgroundImageUrl(updates.backgroundImageUrl);
          if (updates.backgroundColor !== undefined) setBackgroundColor(updates.backgroundColor);
          if (updates.isDefault !== undefined) setIsDefault(updates.isDefault);
        }}
      />
    </div>
  );
}
