import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getStaffUserByEmail,
  addAuditLog,
  createTrustedDevice,
  updateStaffUserMfa,
} from "@/lib/db";
import { decryptSecret } from "@/lib/crypto";
import { verifyTotpToken } from "@/lib/totp";
import { parseDeviceName } from "@/lib/device-helper";

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";
  const userAgent = req.headers.get("user-agent") || undefined;

  const body = await req.json().catch(() => ({}));
  const code = (body.code || "").trim();
  const explicitEmail = body.email ? body.email.trim().toLowerCase() : null;
  const trustDevice = Boolean(body.trustDevice !== false); // default to true if not explicitly false

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

  // 1. Fetch user from database
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
    await addAuditLog({
      entity_type: "auth",
      entity_id: staffUser.email,
      action: "api_mfa_failed",
      actor_email: staffUser.email,
      reason: "Invalid or expired 6-digit TOTP security code",
      ip_address: ip,
      user_agent: userAgent,
    });

    return NextResponse.json(
      { success: false, error: "Invalid or expired 6-digit TOTP security code." },
      { status: 401 }
    );
  }

  // Mark enrolled on first successful code verification
  if (!staffUser.mfa_enrolled) {
    await updateStaffUserMfa(staffUser.email, staffUser.mfa_secret, true);
  }

  // 4. Handle "Trust this device"
  if (trustDevice) {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const deviceName = parseDeviceName(userAgent);

    await createTrustedDevice({
      user_email: staffUser.email,
      token: rawToken,
      device_name: deviceName,
      ip_address: ip,
      days: 30,
    });

    cookieStore.set(
      "cambria_trusted_device",
      JSON.stringify({ email: staffUser.email, token: rawToken }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      }
    );
  }

  // 5. Clear pending challenge and issue authorized session
  cookieStore.delete("cambria_mfa_pending");

  cookieStore.set(
    "cambria_staff_session",
    JSON.stringify({ email: staffUser.email, role: staffUser.role, timestamp: Date.now() }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    }
  );

  cookieStore.set("cambria_staff_mfa_verified", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  await addAuditLog({
    entity_type: "auth",
    entity_id: staffUser.email,
    action: "api_login_success",
    actor_email: staffUser.email,
    reason: `API MFA verification completed successfully${trustDevice ? " (device trusted for 30 days)" : ""}`,
    ip_address: ip,
    user_agent: userAgent,
  });

  return NextResponse.json({
    success: true,
    redirectTo: "/admin",
    trustedDevice: trustDevice,
    user: {
      email: staffUser.email,
      fullName: staffUser.full_name,
      role: staffUser.role,
    },
    message: "TOTP verified. Administrative session established.",
  });
}
