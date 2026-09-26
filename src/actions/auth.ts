"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { checkRateLimit } from "@/lib/rate-limit";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getStaffUserByEmail } from "@/lib/db";
import { verifyPassword, decryptSecret } from "@/lib/crypto";
import { verifyTotpToken } from "@/lib/totp";

const loginSchema = z.object({
  email: z.string().email("Please provide a valid institutional email address"),
  password: z.string().min(8, "Password must contain at least 8 characters"),
});

const mfaSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "MFA code must be exactly 6 digits"),
});

export async function loginAction(prevState: any, formData: FormData) {
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

  // 2. Rate Limiting (5 attempts per 15 minutes)
  const rateLimit = await checkRateLimit(email, "admin-login", 5, 900);
  if (!rateLimit.success) {
    return {
      success: false,
      error: "Too many login attempts. Your IP has been temporarily throttled.",
    };
  }

  // 3. Supabase Auth if cloud configured, else PostgreSQL staff_users verification
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl && supabaseUrl.includes(".supabase.co")) {
    try {
      const supabase = await createServerSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error: "Invalid staff credentials or unapproved account.",
        };
      }
    } catch {
      return { success: false, error: "Authentication system error." };
    }
  } else {
    // Verified against real PostgreSQL staff_users table with salted scrypt hashing
    const staffUser = await getStaffUserByEmail(email);
    if (!staffUser) {
      return {
        success: false,
        error: "Invalid staff credentials or unapproved account.",
      };
    }

    const isPasswordValid = verifyPassword(password, staffUser.password_hash);
    if (!isPasswordValid) {
      return {
        success: false,
        error: "Invalid staff credentials or unapproved account.",
      };
    }
  }

  // Password matched -> DO NOT grant access directly! Issue temporary MFA challenge session
  const cookieStore = await cookies();
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
  const code = (formData.get("code") as string)?.trim();
  const validated = mfaSchema.safeParse({ code });

  if (!validated.success) {
    return {
      success: false,
      error: "Please enter a valid 6-digit TOTP verification code.",
    };
  }

  const cookieStore = await cookies();
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
    return {
      success: false,
      error: "Invalid or expired TOTP verification code. Cryptographic verification rejected.",
    };
  }

  // MFA verified successfully! Clear pending challenge and establish authenticated staff session
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
  const cookieStore = await cookies();
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
