import { NextRequest, NextResponse } from "next/server";
import {
  getTemplateById,
  updateTemplate,
  deleteTemplate,
  setDefaultTemplate,
} from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const template = await getTemplateById(params.id);

  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  return NextResponse.json(template);
}

export async function PUT(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const body = await req.json();
    const { is_default, ...templateData } = body;

    const updated = await updateTemplate(params.id, templateData);
    if (!updated) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    if (is_default) {
      await setDefaultTemplate(params.id, updated.template_kind);
    }

    return NextResponse.json({ success: true, template: updated });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to update template" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const deleted = await deleteTemplate(params.id);
    return NextResponse.json({ success: deleted });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to delete template" },
      { status: 500 }
    );
  }
}
