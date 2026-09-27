"use server";

import { revalidatePath } from "next/cache";
import {
  createTemplate,
  updateTemplate,
  deleteTemplate,
  setDefaultTemplate,
  getTemplateById,
} from "@/lib/db";
import { Template, TemplateKind } from "@/types/database";

export async function saveTemplateAction(templateData: {
  id?: string;
  code?: string;
  name: string;
  template_kind: TemplateKind;
  width: number;
  height: number;
  background_image_url?: string | null;
  layout_schema: any;
  is_active?: boolean;
  is_default?: boolean;
}): Promise<{ success: boolean; template?: Template; error?: string }> {
  try {
    if (!templateData.name || !templateData.template_kind) {
      return { success: false, error: "Template name and kind are required." };
    }

    let savedTemplate: Template;

    if (templateData.id) {
      const existing = await getTemplateById(templateData.id);
      if (existing) {
        const updated = await updateTemplate(templateData.id, {
          name: templateData.name,
          code: templateData.code || existing.code,
          template_kind: templateData.template_kind,
          width: Number(templateData.width),
          height: Number(templateData.height),
          background_image_url: templateData.background_image_url || null,
          layout_schema: templateData.layout_schema,
          is_active: Boolean(templateData.is_active ?? true),
        });
        savedTemplate = updated!;
      } else {
        savedTemplate = await createTemplate({
          id: templateData.id,
          code:
            templateData.code ||
            `${templateData.template_kind.toUpperCase()}_${Date.now().toString(36).toUpperCase()}`,
          name: templateData.name,
          template_kind: templateData.template_kind,
          width: Number(templateData.width),
          height: Number(templateData.height),
          background_image_url: templateData.background_image_url || null,
          layout_schema: templateData.layout_schema,
          is_active: Boolean(templateData.is_active ?? true),
        });
      }
    } else {
      savedTemplate = await createTemplate({
        id: crypto.randomUUID(),
        code:
          templateData.code ||
          `${templateData.template_kind.toUpperCase()}_${Date.now().toString(36).toUpperCase()}`,
        name: templateData.name,
        template_kind: templateData.template_kind,
        width: Number(templateData.width),
        height: Number(templateData.height),
        background_image_url: templateData.background_image_url || null,
        layout_schema: templateData.layout_schema,
        is_active: Boolean(templateData.is_active ?? true),
      });
    }

    if (templateData.is_default) {
      await setDefaultTemplate(savedTemplate.id, savedTemplate.template_kind);
    }

    revalidatePath("/admin/templates");
    revalidatePath("/admin/credentials/new");
    return { success: true, template: savedTemplate };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to save template" };
  }
}

export async function deleteTemplateAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const ok = await deleteTemplate(id);
    revalidatePath("/admin/templates");
    revalidatePath("/admin/credentials/new");
    return { success: ok };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to delete template" };
  }
}

export async function setDefaultTemplateAction(
  id: string,
  kind: TemplateKind
): Promise<{ success: boolean; error?: string }> {
  try {
    const ok = await setDefaultTemplate(id, kind);
    revalidatePath("/admin/templates");
    revalidatePath("/admin/credentials/new");
    return { success: ok };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to set default template" };
  }
}
