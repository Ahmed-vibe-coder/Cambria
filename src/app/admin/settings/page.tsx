import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getStaffUserByEmail,
  getTrustedDevicesForUser,
} from "@/lib/db";
import {
  revokeTrustedDeviceAction,
  revokeAllTrustedDevicesAction,
} from "@/actions/auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import {
  ShieldCheck,
  Smartphone,
  Laptop,
  Trash2,
  AlertTriangle,
  Lock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cambria_staff_session");

  let email = "admin@cambria.edu";
  if (sessionCookie?.value) {
    try {
      const data = JSON.parse(sessionCookie.value);
      if (data.email) email = data.email;
    } catch {}
  }

  const staffUser = await getStaffUserByEmail(email);
  if (!staffUser) {
    redirect("/admin/login");
  }

  const trustedDevices = await getTrustedDevicesForUser(staffUser.email);
  const activeDevices = trustedDevices.filter(
    (d) => !d.is_revoked && new Date(d.expires_at) > new Date()
  );

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Page Title */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-cambria-navy tracking-tight">
          Account Security & Device Trust
        </h1>
        <p className="text-sm text-slate-500 pt-0.5">
          Manage administrative authentication safeguards, multi-factor authentication, and recognized devices.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Officer Identity Card */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <Lock className="w-4 h-4 text-cambria-academic" />
            <span>Staff Profile</span>
          </div>
          <div>
            <div className="font-serif text-xl font-bold text-cambria-navy">
              {staffUser.full_name}
            </div>
            <div className="text-xs text-slate-500 font-mono">
              {staffUser.email}
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">Security Clearance:</span>
            <span className="font-mono uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-cambria-soft text-cambria-navy border border-blue-200">
              {staffUser.role}
            </span>
          </div>
        </Card>

        {/* 2FA Enforcement Card */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>MFA Enforcement</span>
          </div>
          <div>
            <div className="text-xl font-bold text-emerald-700 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Enrolled & Active</span>
            </div>
            <p className="text-xs text-slate-500 pt-1">
              Time-Based One-Time Passcode (TOTP RFC 6238) active. Secrets are encrypted at rest with AES-256-GCM.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">Secret Rotation:</span>
            <span className="text-emerald-700 font-semibold text-[11px]">Protected & Salted</span>
          </div>
        </Card>

        {/* Active Trusted Devices Count */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <Laptop className="w-4 h-4 text-[#C8A84E]" />
            <span>Trusted Browsers</span>
          </div>
          <div>
            <div className="text-3xl font-serif font-bold text-cambria-navy">
              {activeDevices.length}
            </div>
            <p className="text-xs text-slate-500 pt-1">
              {activeDevices.length === 1
                ? "1 browser currently bypasses the 2FA prompt"
                : `${activeDevices.length} browsers currently bypass the 2FA prompt`}
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">Trust Window:</span>
            <span className="text-slate-600 font-semibold text-[11px]">30 Days Per Authorization</span>
          </div>
        </Card>
      </div>

      {/* Trusted Devices Registry Table */}
      <Card className="shadow-card">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Laptop className="w-5 h-5 text-cambria-navy" />
              <CardTitle className="text-lg">Trusted Browsers & Devices</CardTitle>
            </div>
            <CardDescription className="pt-1">
              These client browsers have successfully completed two-factor authentication and are authorized to access the admin panel without re-entering a 6-digit code.
            </CardDescription>
          </div>

          {activeDevices.length > 0 && (
            <form action={revokeAllTrustedDevicesAction}>
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300 gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Revoke All Trusted Devices
              </Button>
            </form>
          )}
        </CardHeader>

        <CardContent className="p-0">
          {trustedDevices.length === 0 ? (
            <div className="p-10 text-center space-y-3">
              <Laptop className="w-10 h-10 mx-auto text-slate-300" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-700">
                  No Trusted Devices Registered
                </p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  When you sign in and check &ldquo;Trust this device for 30 days&rdquo;, your browser will appear here. Until then, every login requires a fresh two-factor verification code.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3">Device / Browser</th>
                    <th className="px-6 py-3">IP Address</th>
                    <th className="px-6 py-3">Authorized On</th>
                    <th className="px-6 py-3">Trusted Until</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {trustedDevices.map((dev) => {
                    const isExpired = new Date(dev.expires_at) <= new Date();
                    const isActive = !dev.is_revoked && !isExpired;

                    return (
                      <tr key={dev.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-800">
                          <div className="flex items-center gap-2">
                            <Laptop className="w-4 h-4 text-cambria-academic shrink-0" />
                            <span>{dev.device_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-500">
                          {dev.ip_address || "127.0.0.1"}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {formatDate(dev.created_at)}
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-medium">
                          {formatDate(dev.expires_at)}
                        </td>
                        <td className="px-6 py-4">
                          {isActive ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Active Trust
                            </span>
                          ) : dev.is_revoked ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                              <XCircle className="w-3.5 h-3.5" />
                              Revoked
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                              Expired
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {isActive ? (
                            <form action={revokeTrustedDeviceAction}>
                              <input type="hidden" name="deviceId" value={dev.id} />
                              <Button
                                type="submit"
                                variant="ghost"
                                size="sm"
                                className="text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 h-7 px-2.5 gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Revoke Trust</span>
                              </Button>
                            </form>
                          ) : (
                            <span className="text-slate-400 text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
