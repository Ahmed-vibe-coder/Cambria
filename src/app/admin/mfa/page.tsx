import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CambriaSeal } from "@/components/ui/cambria-seal";
import {
  getAccountTotpQrCodeDataUri,
  generateTotpToken,
  generatePerAccountSecret,
} from "@/lib/totp";
import { getStaffUserByEmail, updateStaffUserMfa } from "@/lib/db";
import { decryptSecret, encryptSecret } from "@/lib/crypto";
import { MfaVerifyForm } from "./mfa-form";
import { Smartphone } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminMfaPage() {
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

  let plainSecret = "";
  if (staffUser.mfa_secret) {
    try {
      plainSecret = decryptSecret(staffUser.mfa_secret);
    } catch {
      plainSecret = generatePerAccountSecret();
      const encrypted = encryptSecret(plainSecret);
      await updateStaffUserMfa(staffUser.email, encrypted, true);
    }
  } else {
    // Brand-new admin account enrollment: generate account-specific secret
    plainSecret = generatePerAccountSecret();
    const encrypted = encryptSecret(plainSecret);
    await updateStaffUserMfa(staffUser.email, encrypted, true);
  }

  const qrDataUri = await getAccountTotpQrCodeDataUri(staffUser.email, plainSecret);
  const currentToken = generateTotpToken(plainSecret);

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
              Two-Factor Authentication
            </h1>
            <span className="text-xs uppercase tracking-[0.2em] text-[#C8A84E] font-semibold block mt-0.5">
              Time-Based One-Time Password (TOTP)
            </span>
          </div>
        </div>

        {/* Verification Form Component */}
        <MfaVerifyForm email={email} />

        {/* Per-Account TOTP Enrollment Card */}
        <div className="bg-white/95 rounded-lg border border-white/20 p-5 shadow-xl text-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-cambria-navy font-semibold">
            <Smartphone className="w-4 h-4 text-cambria-academic" />
            <span>Account-Specific Authenticator Enrollment ({staffUser.email})</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="flex flex-col items-center p-3 bg-slate-50 border border-slate-200 rounded">
              <img
                src={qrDataUri}
                alt={`Authenticator QR Code for ${staffUser.email}`}
                className="w-36 h-36 border border-slate-200 rounded"
              />
              <span className="text-[10px] text-slate-500 mt-2 text-center">
                Scan with Google Authenticator, 1Password, or Microsoft Authenticator
              </span>
            </div>

            <div className="space-y-2 text-[11px] text-slate-600">
              <div>
                <span className="font-semibold text-slate-800 block">Unique Account Secret:</span>
                <code className="font-mono bg-slate-100 px-2 py-0.5 rounded text-cambria-navy block break-all text-[10px]">
                  {plainSecret}
                </code>
              </div>

              <div>
                <span className="font-semibold text-slate-800 block">Current Cryptographic TOTP Code:</span>
                <span className="font-mono text-base font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 inline-block tracking-widest">
                  {currentToken}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  (Changes every 30 seconds per RFC 6238)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400">
          <Link href="/admin/login" className="hover:text-white underline underline-offset-4">
            Cancel & Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
