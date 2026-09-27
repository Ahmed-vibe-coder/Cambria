import { NextRequest, NextResponse } from "next/server";
import { getStudents, getPrograms, getTemplates } from "@/lib/db";

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get("cambria_staff_session");
  const supabaseCookie =
    req.cookies.get("sb-access-token") ||
    req.cookies.get("supabase-auth-token") ||
    req.cookies.getAll().find((c) => c.name.includes("-auth-token"));

  const hasSession = Boolean(sessionCookie?.value || supabaseCookie?.value);
  if (!hasSession) {
    return NextResponse.json(
      { error: "Unauthorized: Administrator session required." },
      { status: 401 }
    );
  }

  const type = req.nextUrl.searchParams.get("type");

  if (type === "students") {
    const students = await getStudents();
    return NextResponse.json(students);
  }

  if (type === "programs") {
    const programs = await getPrograms();
    return NextResponse.json(programs);
  }

  if (type === "templates") {
    const templates = await getTemplates();
    return NextResponse.json(templates);
  }

  return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
}
