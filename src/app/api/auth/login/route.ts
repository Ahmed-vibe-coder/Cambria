import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStaffUserByEmail, addAuditLog } from "@/lib/db";
import { verifyPassword } from "@/lib/crypto";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";
  const userAgent = req.headers.get("user-agent") || undefined;

  // 1. IP Rate Limiting (5 attempts per 5 minutes)
  const rateLimit = await checkRateLimit(ip, "api-admin-login", 5, 300);
  if (!rateLimit.success) {
    await addAuditLog({
      entity_type: "auth",
      entity_id: ip,
      action: "api_login_throttled",
      actor_email: "unknown",
      reason: "IP rate limit exceeded on administrative login endpoint",
      ip_address: ip,
      user_agent: userAgent,
    });

    return NextResponse.json(
      {
        success: false,
        error: "Too many failed login attempts. Access temporarily locked for 5 minutes.",
        remaining: 0,
        reset: rateLimit.reset,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.max(1, rateLimit.reset - Math.ceil(Date.now() / 1000))),
        },
      }
    );
  }

  const body = await req.json().catch(() => ({}));
  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";

  if (!email || !password) {
    return NextResponse.json(
      { success: false, error: "Invalid administrative credentials." },
      { status: 401 }
    );
  }

  // 2. Look up admin user from database
  const staffUser = await getStaffUserByEmail(email);

  // 3. Cryptographic password verification with per-user salted scrypt hash
  // Timing attack safe: always perform verification even if user doesn't exist
  const dummyHash =
    "scrypt:00000000000000000000000000000000:00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
  const hashToVerify = staffUser ? staffUser.password_hash : dummyHash;
  const isPasswordValid = verifyPassword(password, hashToVerify);

  if (!staffUser || !isPasswordValid) {
    await addAuditLog({
      entity_type: "auth",
      entity_id: email,
      action: "api_login_failed",
      actor_email: email,
      reason: "Invalid administrative credentials attempt",
      ip_address: ip,
      user_agent: userAgent,
    });

    return NextResponse.json(
      { success: false, error: "Invalid administrative credentials." },
      { status: 401 }
    );
  }

  // 4. Issue pending MFA challenge session cookie (valid for 5 minutes)
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

  await addAuditLog({
    entity_type: "auth",
    entity_id: staffUser.email,
    action: "api_password_authenticated",
    actor_email: staffUser.email,
    reason: "Step 1 password authenticated; MFA TOTP required",
    ip_address: ip,
    user_agent: userAgent,
  });

  return NextResponse.json({
    success: true,
    requireMfa: true,
    redirectTo: "/admin/mfa",
    mfaEnrolled: staffUser.mfa_enrolled,
    message: "Password authenticated. MFA TOTP challenge step required.",
  });
}
