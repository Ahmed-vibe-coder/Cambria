import { NextRequest, NextResponse } from "next/server";
import { getStudents, getPrograms } from "@/lib/db";

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type");

  if (type === "students") {
    const students = await getStudents();
    return NextResponse.json(students);
  }

  if (type === "programs") {
    const programs = await getPrograms();
    return NextResponse.json(programs);
  }

  return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
}
