import React from "react";
import Link from "next/link";
import { getTemplates, setDefaultTemplate, deleteTemplate } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Layers,
  Plus,
  FileText,
  CreditCard,
  Edit,
  Trash2,
  CheckCircle,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function AdminTemplatesPage() {
  const templates = await getTemplates();

  const handleSetDefault = async (formData: FormData) => {
    "use server";
    const id = formData.get("id") as string;
    const kind = formData.get("kind") as "certificate" | "student_card";
    await setDefaultTemplate(id, kind);
    revalidatePath("/admin/templates");
  };

  const handleDelete = async (formData: FormData) => {
    "use server";
    const id = formData.get("id") as string;
    await deleteTemplate(id);
    revalidatePath("/admin/templates");
  };

  const certificates = templates.filter((t) => t.template_kind === "certificate");
  const studentCards = templates.filter((t) => t.template_kind === "student_card");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#C8A84E] font-bold">
            <Layers className="w-4 h-4" />
            <span>Dynamic Certificate &amp; Student Card Engine</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-cambria-navy tracking-tight mt-1">
            Design Templates Studio (إدارة وتصميم القوالب)
          </h1>
          <p className="text-sm text-slate-500 pt-0.5">
            Create, customize, and visually position dynamic student fields on any blank certificate or ID card image.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/templates/new?kind=certificate">
            <Button className="bg-cambria-navy hover:bg-cambria-academic text-white text-xs gap-1.5 font-semibold h-10">
              <Plus className="w-3.5 h-3.5" />
              <span>New Certificate Template</span>
            </Button>
          </Link>
          <Link href="/admin/templates/new?kind=student_card">
            <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100 text-xs gap-1.5 font-semibold h-10">
              <CreditCard className="w-3.5 h-3.5 text-[#C8A84E]" />
              <span>New ID Card Template</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 1. Official Certificates Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2 text-cambria-navy font-serif text-xl font-bold">
            <FileText className="w-5 h-5 text-[#C8A84E]" />
            <span>Academic Certificates &amp; Diplomas ({certificates.length})</span>
          </div>
          <span className="text-xs text-slate-500">
            A4 Landscape format (1600 × 1131 px default)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((tpl) => {
            const fieldCount = tpl.layout_schema?.fields?.length || 0;
            const hasCustomBg = Boolean(tpl.background_image_url);

            return (
              <Card
                key={tpl.id}
                className="overflow-hidden shadow-sm hover:shadow-md transition-shadow border-slate-200 flex flex-col justify-between"
              >
                <div>
                  {/* Visual Preview Banner */}
                  <div
                    style={{
                      backgroundColor: tpl.layout_schema?.background_color || "#FFFFFF",
                      backgroundImage: tpl.background_image_url ? `url('${tpl.background_image_url}')` : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    className="h-44 w-full relative border-b border-slate-200 flex items-center justify-center p-4 overflow-hidden"
                  >
                    {!hasCustomBg && (
                      <div className="absolute inset-2 border-2 border-[#020B5A] rounded flex flex-col items-center justify-center bg-white/90">
                        <div className="w-8 h-8 rounded-full border border-[#C8A84E] mb-1 flex items-center justify-center text-[#C8A84E] font-bold text-[8px]">
                          SEAL
                        </div>
                        <span className="text-[11px] font-serif font-bold text-[#020B5A] text-center px-4 line-clamp-1">
                          {tpl.name}
                        </span>
                        <span className="text-[9px] text-[#C8A84E] uppercase tracking-wider font-semibold">
                          Cambria Standard Certificate
                        </span>
                      </div>
                    )}

                    {hasCustomBg && (
                      <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur text-white text-[10px] px-2 py-0.5 rounded font-mono">
                        Custom Design
                      </div>
                    )}

                    {tpl.is_active && (
                      <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Default Active
                      </div>
                    )}
                  </div>

                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-sm font-bold text-slate-800 line-clamp-1">
                          {tpl.name}
                        </CardTitle>
                        <span className="font-mono text-[11px] text-slate-500 block mt-0.5">
                          {tpl.code}
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 pt-1 text-xs text-slate-600 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Dimensions:</span>
                      <span className="font-mono font-medium">{tpl.width} × {tpl.height} px</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Configured Fields:</span>
                      <span className="font-semibold text-cambria-navy">{fieldCount} dynamic elements</span>
                    </div>
                  </CardContent>
                </div>

                <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between gap-2 bg-slate-50/50">
                  <Link href={`/admin/templates/${tpl.id}`} className="flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs h-8 gap-1.5 font-semibold text-cambria-navy border-slate-300 hover:bg-white"
                    >
                      <Edit className="w-3 h-3 text-[#C8A84E]" />
                      Edit in Builder
                    </Button>
                  </Link>

                  {!tpl.is_active && (
                    <form action={handleSetDefault}>
                      <input type="hidden" name="id" value={tpl.id} />
                      <input type="hidden" name="kind" value={tpl.template_kind} />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        className="text-xs h-8 text-slate-600 hover:text-slate-900"
                        title="Set as Default Active Template"
                      >
                        Set Default
                      </Button>
                    </form>
                  )}

                  {certificates.length > 1 && (
                    <form action={handleDelete}>
                      <input type="hidden" name="id" value={tpl.id} />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        className="text-rose-600 hover:bg-rose-50 h-8 w-8 p-0"
                        title="Delete Template"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </form>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 2. Official Student ID Cards Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2 text-cambria-navy font-serif text-xl font-bold">
            <CreditCard className="w-5 h-5 text-[#C8A84E]" />
            <span>Student Identification Cards ({studentCards.length})</span>
          </div>
          <span className="text-xs text-slate-500">
            CR80 Format (600 × 900 px default)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studentCards.map((tpl) => {
            const fieldCount = tpl.layout_schema?.fields?.length || 0;
            const hasCustomBg = Boolean(tpl.background_image_url);

            return (
              <Card
                key={tpl.id}
                className="overflow-hidden shadow-sm hover:shadow-md transition-shadow border-slate-200 flex flex-col justify-between"
              >
                <div>
                  {/* Visual Preview Banner */}
                  <div
                    style={{
                      backgroundColor: tpl.layout_schema?.background_color || "#020B5A",
                      backgroundImage: tpl.background_image_url ? `url('${tpl.background_image_url}')` : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    className="h-44 w-full relative border-b border-slate-200 flex items-center justify-center p-4 overflow-hidden"
                  >
                    {!hasCustomBg && (
                      <div className="absolute inset-3 border border-[#C8A84E]/40 rounded-lg flex flex-col items-center justify-center bg-gradient-to-b from-[#020B5A] to-[#07133F] text-white">
                        <div className="w-10 h-12 border border-[#C8A84E] rounded mb-1 flex items-center justify-center text-[9px] text-[#C8A84E]">
                          PHOTO
                        </div>
                        <span className="text-[11px] font-bold text-center px-4 line-clamp-1">
                          {tpl.name}
                        </span>
                        <span className="text-[8px] text-[#C8A84E] uppercase tracking-wider font-semibold">
                          Official Student Card
                        </span>
                      </div>
                    )}

                    {hasCustomBg && (
                      <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur text-white text-[10px] px-2 py-0.5 rounded font-mono">
                        Custom Design
                      </div>
                    )}

                    {tpl.is_active && (
                      <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Default Active
                      </div>
                    )}
                  </div>

                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-sm font-bold text-slate-800 line-clamp-1">
                          {tpl.name}
                        </CardTitle>
                        <span className="font-mono text-[11px] text-slate-500 block mt-0.5">
                          {tpl.code}
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 pt-1 text-xs text-slate-600 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Dimensions:</span>
                      <span className="font-mono font-medium">{tpl.width} × {tpl.height} px</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Configured Fields:</span>
                      <span className="font-semibold text-cambria-navy">{fieldCount} dynamic elements</span>
                    </div>
                  </CardContent>
                </div>

                <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between gap-2 bg-slate-50/50">
                  <Link href={`/admin/templates/${tpl.id}`} className="flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs h-8 gap-1.5 font-semibold text-cambria-navy border-slate-300 hover:bg-white"
                    >
                      <Edit className="w-3 h-3 text-[#C8A84E]" />
                      Edit in Builder
                    </Button>
                  </Link>

                  {!tpl.is_active && (
                    <form action={handleSetDefault}>
                      <input type="hidden" name="id" value={tpl.id} />
                      <input type="hidden" name="kind" value={tpl.template_kind} />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        className="text-xs h-8 text-slate-600 hover:text-slate-900"
                        title="Set as Default Active Template"
                      >
                        Set Default
                      </Button>
                    </form>
                  )}

                  {studentCards.length > 1 && (
                    <form action={handleDelete}>
                      <input type="hidden" name="id" value={tpl.id} />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        className="text-rose-600 hover:bg-rose-50 h-8 w-8 p-0"
                        title="Delete Template"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </form>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
