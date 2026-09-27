import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CambriaSeal } from "@/components/ui/cambria-seal";
import {
  getAccountTotpQrCodeDataUri,
  getAccountOtpAuthUri,
  generatePerAccountSecret,
} from "@/lib/totp";
import { getStaffUserByEmail, updateStaffUserMfa } from "@/lib/db";
import { decryptSecret, encryptSecret } from "@/lib/crypto";
import { MfaVerifyForm } from "./mfa-form";
import { Smartphone, Shield, KeyRound, AlertTriangle } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface AdminMfaPageProps {
  searchParams?: Promise<{ setup?: string; re_enroll?: string }>;
}

export default async function AdminMfaPage({ searchParams }: AdminMfaPageProps) {
  const cookieStore = await cookies();
  const pendingCookie = cookieStore.get("cambria_mfa_pending");

  // If user hasn't passed password authentication, send back to login
  if (!pendingCookie?.value) {
    redirect("/admin/login");
  }

  let email = "admin@cambria.edu";
  try {
    const data = JSON.parse(pendingCookie.value);
    if (data.email) email = data.email;
  } catch {}

  const staffUser = await getStaffUserByEmail(email);
  if (!staffUser) {
    redirect("/admin/login");
  }

  const resolvedParams = searchParams ? await searchParams : {};
  const isExplicitSetup =
    resolvedParams.setup === "true" ||
    resolvedParams.setup === "1" ||
    resolvedParams.re_enroll === "true";

  const isEnrolled = Boolean(staffUser.mfa_enrolled && staffUser.mfa_secret && !isExplicitSetup);

  // If NOT enrolled OR explicitly requested setup: prepare QR code & otpauth link
  let qrDataUri: string | null = null;
  let plainSecret: string | null = null;
  let otpauthUri: string | null = null;

  if (!isEnrolled || isExplicitSetup) {
    if (staffUser.mfa_secret) {
      try {
        plainSecret = decryptSecret(staffUser.mfa_secret);
      } catch {
        plainSecret = generatePerAccountSecret();
        const encrypted = encryptSecret(plainSecret);
        await updateStaffUserMfa(staffUser.email, encrypted, false);
      }
    } else {
      plainSecret = generatePerAccountSecret();
      const encrypted = encryptSecret(plainSecret);
      await updateStaffUserMfa(staffUser.email, encrypted, false);
    }

    qrDataUri = await getAccountTotpQrCodeDataUri(staffUser.email, plainSecret);
    otpauthUri = getAccountOtpAuthUri(staffUser.email, plainSecret);
  }

  const showSetupBlock = (!isEnrolled || isExplicitSetup) && Boolean(qrDataUri && plainSecret);

  return (
    <div className="min-h-screen bg-cambria-deep flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Seal Watermark */}
      <div
        className="absolute -right-24 -bottom-24 pointer-events-none opacity-[0.035]"
        aria-hidden="true"
      >
        <CambriaSeal size={600} variant="white" />
      </div>

      <div className="w-full max-w-lg relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block group">
            <div className="p-3 bg-white/10 rounded-full border border-white/20 inline-block transition-transform group-hover:scale-105">
              <CambriaSeal size={56} variant="white" />
            </div>
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-bold text-white tracking-tight">
              {showSetupBlock ? "Initial Authenticator Setup" : "Two-Factor Authentication"}
            </h1>
            <span className="text-xs uppercase tracking-[0.2em] text-[#C8A84E] font-semibold block mt-0.5">
              {showSetupBlock ? "One-Time MFA Device Enrollment" : "Time-Based One-Time Password (TOTP)"}
            </span>
          </div>
        </div>

        {/* STEP 1: ONLY displayed during initial enrollment or dedicated re-enrollment */}
        {showSetupBlock && qrDataUri && plainSecret && (
          <div className="bg-white/95 rounded-lg border border-amber-300 p-5 shadow-xl text-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-cambria-navy font-semibold">
              <KeyRound className="w-4 h-4 text-[#C8A84E]" />
              <span>Step 1: Scan QR Code with Authenticator App ({staffUser.email})</span>
            </div>

            <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Instructions:</strong> Open <strong>Google Authenticator</strong> (or Microsoft Authenticator/1Password) on your mobile phone, tap <strong>(+)</strong> &rarr; <strong>Scan a QR code</strong>, and point your camera at the QR code below.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="flex flex-col items-center p-3 bg-slate-50 border border-slate-200 rounded">
                <img
                  src={qrDataUri}
                  alt={`Authenticator QR Code for ${staffUser.email}`}
                  className="w-40 h-40 border border-slate-200 rounded shadow-sm bg-white p-1"
                />
                <span className="text-[10px] text-slate-500 mt-2 text-center font-medium">
                  Scan using Google Authenticator camera
                </span>
                {otpauthUri && (
                  <a
                    href={otpauthUri}
                    className="mt-2 text-[11px] text-cambria-navy font-semibold underline hover:text-[#C8A84E] inline-flex items-center gap-1"
                  >
                    <Smartphone className="w-3 h-3" />
                    Open directly in App (Mobile)
                  </a>
                )}
              </div>

              <div className="space-y-3 text-[11px] text-slate-600">
                <div className="space-y-1">
                  <span className="font-semibold text-slate-800 block">Manual Configuration Key:</span>
                  <code className="font-mono bg-slate-100 p-2 rounded text-cambria-navy block break-all text-xs tracking-wider border border-slate-200 font-bold select-all">
                    {plainSecret}
                  </code>
                  <span className="text-[10px] text-slate-400 block">
                    Only type manually if you cannot scan the QR code.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Verification Form Component */}
        <MfaVerifyForm email={email} isEnrollment={showSetupBlock} />

        <div className="text-center text-xs text-slate-400 space-y-2">
          {!showSetupBlock && (
            <div>
              <Link
                href="/admin/mfa?setup=true"
                className="text-xs text-[#C8A84E] hover:underline hover:text-amber-300 inline-flex items-center gap-1"
              >
                <Smartphone className="w-3.5 h-3.5" />
                Need to scan the QR code again or configure your authenticator app? Click here
              </Link>
            </div>
          )}
          {showSetupBlock && isExplicitSetup && (
            <div>
              <Link
                href="/admin/mfa"
                className="text-xs text-slate-300 hover:underline"
              >
                &larr; Back to standard verification
              </Link>
            </div>
          )}
          <div>
            <Link href="/admin/login" className="hover:text-white underline underline-offset-4">
              Cancel & Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
