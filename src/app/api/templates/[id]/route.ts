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
    const sessionCookie = req.cookies.get("cambria_staff_session");
    const mfaCookie = req.cookies.get("cambria_staff_mfa_verified");
    const supabaseCookie =
      req.cookies.get("sb-access-token") ||
      req.cookies.get("supabase-auth-token") ||
      req.cookies.getAll().find((c) => c.name.includes("-auth-token"));

    const hasSession = Boolean(sessionCookie?.value || supabaseCookie?.value);
    const requireMfa = process.env.REQUIRE_ADMIN_MFA === "true" || process.env.MFA_REQUIRED === "true";
    const hasMfa = requireMfa ? (mfaCookie?.value === "true") : true;

    if (!hasSession || !hasMfa) {
      return NextResponse.json(
        { error: "Unauthorized: Active administrative session required to update templates." },
        { status: 401 }
      );
    }

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
    const sessionCookie = req.cookies.get("cambria_staff_session");
    const mfaCookie = req.cookies.get("cambria_staff_mfa_verified");
    const supabaseCookie =
      req.cookies.get("sb-access-token") ||
      req.cookies.get("supabase-auth-token") ||
      req.cookies.getAll().find((c) => c.name.includes("-auth-token"));

    const hasSession = Boolean(sessionCookie?.value || supabaseCookie?.value);
    const requireMfa = process.env.REQUIRE_ADMIN_MFA === "true" || process.env.MFA_REQUIRED === "true";
    const hasMfa = requireMfa ? (mfaCookie?.value === "true") : true;

    if (!hasSession || !hasMfa) {
      return NextResponse.json(
        { error: "Unauthorized: Active administrative session required to delete templates." },
        { status: 401 }
      );
    }

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
