"use server";

import { z } from "zod";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { checkRateLimit } from "@/lib/rate-limit";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getStaffUserByEmail, addAuditLog } from "@/lib/db";
import { verifyPassword, decryptSecret } from "@/lib/crypto";
import { verifyTotpToken } from "@/lib/totp";

const loginSchema = z.object({
  email: z.string().email("Please provide a valid institutional email address"),
  password: z.string().min(8, "Password must contain at least 8 characters"),
});

const mfaSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "MFA code must be exactly 6 digits"),
});

async function getSafeHeaders() {
  try {
    const headerStore = await headers();
    const ip =
      headerStore.get("x-forwarded-for")?.split(",")[0].trim() ||
      headerStore.get("x-real-ip") ||
      "127.0.0.1";
    const userAgent = headerStore.get("user-agent") || undefined;
    return { ip, userAgent };
  } catch {
    return { ip: "127.0.0.1", userAgent: undefined };
  }
}

async function getSafeCookies() {
  try {
    return await cookies();
  } catch {
    return {
      get: (_name: string) => undefined,
      set: (_name: string, _value: string, _opts?: any) => {},
      delete: (_name: string) => {},
    } as any;
  }
}

export async function loginAction(prevState: any, formData: FormData) {
  const { ip, userAgent } = await getSafeHeaders();

  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  // 1. Zod Validation
  const validated = loginSchema.safeParse({ email, password });
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.errors[0].message,
    };
  }

  // 2. IP Rate Limiting (5 attempts per 5 minutes)
  const rateLimit = await checkRateLimit(ip, "admin-login", 5, 300);
  if (!rateLimit.success) {
    await addAuditLog({
      entity_type: "auth",
      entity_id: ip,
      action: "login_throttled",
      actor_email: email || "unknown",
      reason: "Too many login attempts; IP temporarily locked",
      ip_address: ip,
      user_agent: userAgent,
    });

    return {
      success: false,
      error: "Too many login attempts. Access is temporarily locked. Please wait 5 minutes.",
    };
  }

  // 3. Look up administrative staff user from database (Supabase staff_users table or fallback)
  const staffUser = await getStaffUserByEmail(email);

  // Constant-time check pattern to avoid timing enumeration
  const dummyHash =
    "scrypt:00000000000000000000000000000000:00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
  const hashToVerify = staffUser ? staffUser.password_hash : dummyHash;
  const isPasswordValid = verifyPassword(password, hashToVerify);

  if (!staffUser || !isPasswordValid) {
    await addAuditLog({
      entity_type: "auth",
      entity_id: email,
      action: "login_failed",
      actor_email: email,
      reason: "Invalid staff credentials attempt",
      ip_address: ip,
      user_agent: userAgent,
    });

    return {
      success: false,
      error: "Invalid staff credentials or unapproved account.",
    };
  }

  // Password matched -> Issue temporary MFA challenge session & audit log
  await addAuditLog({
    entity_type: "auth",
    entity_id: email,
    action: "password_authenticated",
    actor_email: email,
    reason: "Step 1 password authenticated; MFA challenge issued",
    ip_address: ip,
    user_agent: userAgent,
  });

  const cookieStore = await getSafeCookies();
  cookieStore.set(
    "cambria_mfa_pending",
    JSON.stringify({ email, timestamp: Date.now() }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 300, // 5 minutes challenge window
    }
  );

  // Strictly redirect to MFA challenge verification step
  redirect("/admin/mfa");
}

export async function verifyMfaAction(prevState: any, formData: FormData) {
  const { ip, userAgent } = await getSafeHeaders();

  const code = (formData.get("code") as string)?.trim();
  const validated = mfaSchema.safeParse({ code });

  if (!validated.success) {
    return {
      success: false,
      error: "Please enter a valid 6-digit TOTP verification code.",
    };
  }

  const cookieStore = await getSafeCookies();
  const pendingCookie = cookieStore.get("cambria_mfa_pending");

  if (!pendingCookie?.value) {
    return {
      success: false,
      error: "MFA challenge session expired or missing. Please log in again.",
    };
  }

  let pendingData: { email: string; timestamp: number };
  try {
    pendingData = JSON.parse(pendingCookie.value);
  } catch {
    return {
      success: false,
      error: "Invalid MFA session state. Please restart login.",
    };
  }

  // 1. Look up specific admin user from PostgreSQL database
  const staffUser = await getStaffUserByEmail(pendingData.email);
  if (!staffUser || !staffUser.mfa_secret) {
    return {
      success: false,
      error: "MFA credentials not configured for this account. Please contact system administrator.",
    };
  }

  // 2. Decrypt user's per-account secret stored at rest
  let plainSecret: string;
  try {
    plainSecret = decryptSecret(staffUser.mfa_secret);
  } catch {
    return {
      success: false,
      error: "Failed to decrypt administrative security tokens.",
    };
  }

  // 3. REAL CRYPTOGRAPHIC TOTP TIME-BASED VERIFICATION against account-specific secret
  const isTotpValid = verifyTotpToken(code, plainSecret);

  if (!isTotpValid) {
    await addAuditLog({
      entity_type: "auth",
      entity_id: staffUser.email,
      action: "mfa_failed",
      actor_email: staffUser.email,
      reason: "Invalid or expired TOTP security code",
      ip_address: ip,
      user_agent: userAgent,
    });

    return {
      success: false,
      error: "Invalid or expired TOTP verification code. Cryptographic verification rejected.",
    };
  }

  // MFA verified successfully! Clear pending challenge, record audit log, and establish session
  await addAuditLog({
    entity_type: "auth",
    entity_id: staffUser.email,
    action: "login_success",
    actor_email: staffUser.email,
    reason: "Two-factor authentication established successfully",
    ip_address: ip,
    user_agent: userAgent,
  });

  cookieStore.delete("cambria_mfa_pending");

  cookieStore.set(
    "cambria_staff_session",
    JSON.stringify({ email: staffUser.email, role: staffUser.role, timestamp: Date.now() }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12, // 12 hours
    }
  );

  cookieStore.set("cambria_staff_mfa_verified", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await getSafeCookies();
  cookieStore.delete("cambria_mfa_pending");
  cookieStore.delete("cambria_staff_session");
  cookieStore.delete("cambria_staff_mfa_verified");
  cookieStore.delete("sb-access-token");

  try {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
  } catch {}

  redirect("/admin/login");
}
