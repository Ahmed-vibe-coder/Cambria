import { NextRequest, NextResponse } from "next/server";
import { getTemplates, createTemplate, setDefaultTemplate } from "@/lib/db";
import { TemplateKind } from "@/types/database";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const templates = await getTemplates();
    return NextResponse.json(templates);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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
        { error: "Unauthorized: Active administrative session required to create templates." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      name,
      code,
      template_kind,
      width,
      height,
      background_image_url,
      layout_schema,
      is_active,
      is_default,
    } = body;

    if (!name || !template_kind || !width || !height) {
      return NextResponse.json(
        { error: "Name, template kind, width, and height are required." },
        { status: 400 }
      );
    }

    const templateCode =
      code ||
      `${template_kind.toUpperCase()}_${Date.now().toString(36).toUpperCase()}`;

    const created = await createTemplate({
      id: crypto.randomUUID(),
      code: templateCode,
      name,
      template_kind: template_kind as TemplateKind,
      width: Number(width),
      height: Number(height),
      background_image_url: background_image_url || null,
      layout_schema: layout_schema || {
        template_kind,
        width: Number(width),
        height: Number(height),
        background_image_url: background_image_url || null,
        fields: [],
      },
      is_active: Boolean(is_active ?? true),
    });

    if (is_default) {
      await setDefaultTemplate(created.id, created.template_kind);
    }

    return NextResponse.json({ success: true, template: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to create template" },
      { status: 500 }
    );
  }
}
