import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStaffUserByEmail } from "@/lib/db";
import { decryptSecret } from "@/lib/crypto";
import { verifyTotpToken } from "@/lib/totp";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const code = (body.code || "").trim();
  const explicitEmail = body.email ? body.email.trim().toLowerCase() : null;

  const cookieStore = await cookies();
  const pendingCookie = cookieStore.get("cambria_mfa_pending");

  let email = explicitEmail;
  if (!email && pendingCookie?.value) {
    try {
      const parsed = JSON.parse(pendingCookie.value);
      email = parsed.email;
    } catch {}
  }

  if (!email) {
    return NextResponse.json(
      { success: false, error: "MFA challenge session missing or expired. Please log in again." },
      { status: 401 }
    );
  }

  // 1. Fetch user from PostgreSQL
  const staffUser = await getStaffUserByEmail(email);
  if (!staffUser || !staffUser.mfa_secret) {
    return NextResponse.json(
      { success: false, error: "Administrative user not found or MFA not configured." },
      { status: 404 }
    );
  }

  // 2. Decrypt user's per-account secret at rest
  let plainSecret: string;
  try {
    plainSecret = decryptSecret(staffUser.mfa_secret);
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to decrypt account MFA credentials." },
      { status: 500 }
    );
  }

  // 3. Cryptographic RFC 6238 time-step verification against THIS user's specific secret
  const isValid = verifyTotpToken(code, plainSecret);

  if (!isValid) {
    return NextResponse.json(
      { success: false, error: "Invalid or expired 6-digit TOTP security code." },
      { status: 401 }
    );
  }

  // 4. Clear pending challenge and issue authorized session
  cookieStore.delete("cambria_mfa_pending");

  cookieStore.set(
    "cambria_staff_session",
    JSON.stringify({ email: staffUser.email, role: staffUser.role, timestamp: Date.now() }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    }
  );

  cookieStore.set("cambria_staff_mfa_verified", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return NextResponse.json({
    success: true,
    redirectTo: "/admin",
    user: {
      email: staffUser.email,
      fullName: staffUser.full_name,
      role: staffUser.role,
    },
    message: "TOTP verified. Administrative session established.",
  });
}
