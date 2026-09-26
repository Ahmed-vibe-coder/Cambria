import React from "react";
import Link from "next/link";
import { CambriaSeal } from "@/components/ui/cambria-seal";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/actions/auth";
import { cookies } from "next/headers";
import { AdminSidebarNav } from "@/components/admin/admin-sidebar-nav";
import {
  LogOut,
  ShieldCheck,
  PlusCircle,
  ExternalLink,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cambria_staff_session");
  const mfaCookie = cookieStore.get("cambria_staff_mfa_verified");
  const isAuthenticated = Boolean(sessionCookie?.value && mfaCookie?.value === "true");

  // Pre-authentication views (login, mfa) render directly without dashboard chrome
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* 1. SIDEBAR */}
      <aside className="w-full md:w-64 bg-cambria-deep text-white flex-shrink-0 flex flex-col justify-between border-r border-white/10">
        <div>
          {/* Logo / Brand Header */}
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <CambriaSeal size={40} variant="white" />
            <div>
              <span className="font-serif text-lg font-bold text-white block leading-none">
                CAMBRIA
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#C8A84E] font-semibold mt-0.5 block">
                Staff Registry Admin
              </span>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="p-4 border-b border-white/10">
            <Link href="/admin/credentials/new">
              <Button className="w-full bg-[#C8A84E] hover:bg-[#B89840] text-cambria-deep font-semibold text-xs py-2 gap-2 shadow-subtle justify-center">
                <PlusCircle className="w-4 h-4" />
                Issue New Credential
              </Button>
            </Link>
          </div>

          {/* Navigation Links */}
          <AdminSidebarNav />
        </div>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Registry System Active</span>
            </div>
            <Link
              href="/"
              target="_blank"
              className="hover:text-white flex items-center gap-1 text-[11px]"
              title="View Public Site"
            >
              Public <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <div className="truncate pr-2">
              <span className="block text-xs font-semibold text-white truncate">
                Admin Staff Officer
              </span>
              <span className="text-[10px] text-slate-400 block truncate">
                admin@cambria.edu
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Link
                href="/admin/settings"
                className="p-1.5 rounded-[4px] text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Account Security & Trusted Devices"
              >
                <ShieldCheck className="w-4 h-4" />
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="p-1.5 rounded-[4px] text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Sign out of Admin"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between shadow-subtle shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">
              Cambria Academic Ledger
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-600 font-medium bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
              Institutional Administration
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link href="/verify" target="_blank" className="text-cambria-academic hover:underline flex items-center gap-1.5 font-medium">
              <span>Public Verification Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-6 sm:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
