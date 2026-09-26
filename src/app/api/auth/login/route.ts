import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStaffUserByEmail } from "@/lib/db";
import { verifyPassword } from "@/lib/crypto";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";

  if (!email || !password) {
    return NextResponse.json(
      { success: false, error: "Email and password are required." },
      { status: 400 }
    );
  }

  // 1. Look up admin user from PostgreSQL database
  const staffUser = await getStaffUserByEmail(email);
  if (!staffUser) {
    return NextResponse.json(
      { success: false, error: "Invalid administrative credentials." },
      { status: 401 }
    );
  }

  // 2. Cryptographic password verification with per-user salted scrypt hash
  const isPasswordValid = verifyPassword(password, staffUser.password_hash);
  if (!isPasswordValid) {
    return NextResponse.json(
      { success: false, error: "Invalid administrative credentials." },
      { status: 401 }
    );
  }

  // 3. Issue pending MFA challenge session cookie (valid for 5 minutes)
  const cookieStore = await cookies();
  cookieStore.set(
    "cambria_mfa_pending",
    JSON.stringify({
      userId: staffUser.id,
      email: staffUser.email,
      role: staffUser.role,
      mfaEnrolled: staffUser.mfa_enrolled,
      timestamp: Date.now(),
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 300,
    }
  );

  return NextResponse.json({
    success: true,
    requireMfa: true,
    redirectTo: "/admin/mfa",
    mfaEnrolled: staffUser.mfa_enrolled,
    message: "Password authenticated. MFA TOTP challenge step required.",
  });
}
