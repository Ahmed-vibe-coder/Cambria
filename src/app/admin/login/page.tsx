"use client";

import React, { useActionState } from "react";
import { loginAction } from "@/actions/auth";
import { CambriaSeal } from "@/components/ui/cambria-seal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShieldCheck, Lock, AlertCircle, Info } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [email, setEmail] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);

  React.useEffect(() => {
    try {
      const savedEmail = localStorage.getItem("cambria_staff_remember_email");
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    } catch {}
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    try {
      if (rememberMe && email) {
        localStorage.setItem("cambria_staff_remember_email", email);
      } else {
        localStorage.removeItem("cambria_staff_remember_email");
      }
    } catch {}
  };

  return (
    <div className="min-h-screen bg-cambria-deep flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Seal Watermark */}
      <div
        className="absolute -right-24 -bottom-24 pointer-events-none opacity-[0.035]"
        aria-hidden="true"
      >
        <CambriaSeal size={600} variant="white" />
      </div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block group">
            <div className="p-3 bg-white/10 rounded-full border border-white/20 inline-block transition-transform group-hover:scale-105">
              <CambriaSeal size={64} variant="white" />
            </div>
          </Link>
          <div>
            <h1 className="font-serif text-3xl font-bold text-white tracking-tight">
              CAMBRIA
            </h1>
            <span className="text-xs uppercase tracking-[0.25em] text-[#C8A84E] font-semibold block mt-0.5">
              Administrative Staff Portal
            </span>
          </div>
        </div>

        {/* Login Card */}
        <Card className="p-6 sm:p-8 shadow-2xl border-white/10 bg-white">
          <CardHeader className="p-0 pb-6 text-center">
            <CardTitle className="font-serif text-2xl font-bold text-cambria-navy">
              Staff Authentication
            </CardTitle>
            <p className="text-xs text-slate-500 pt-1">
              Authorized personnel only. Sessions are monitored and audit-logged.
            </p>
          </CardHeader>

          <CardContent className="p-0">
            {state?.error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-[4px] text-xs text-rose-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                <span>{state.error}</span>
              </div>
            )}

            <form action={formAction} onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Institutional Email
                </label>
                <Input
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@cambria.edu"
                  className="rounded-[4px] border-slate-300"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Account Password
                </label>
                <Input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••••••"
                  className="rounded-[4px] border-slate-300"
                />
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none group">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    value="true"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-cambria-navy focus:ring-cambria-academic accent-cambria-navy cursor-pointer transition-colors"
                  />
                  <span className="text-xs text-slate-600 group-hover:text-slate-900 transition-colors font-medium">
                    Remember me / تذكر هذا الجهاز
                  </span>
                </label>
                <span className="text-[11px] text-slate-400">
                  30-day session
                </span>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-cambria-navy hover:bg-cambria-academic text-white font-semibold py-2.5 rounded-[4px] gap-2"
                >
                  <Lock className="w-4 h-4" />
                  {isPending ? "Authenticating Session..." : "Secure Staff Login"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="text-center text-xs text-slate-400 space-y-1">
          <p className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C8A84E]" />
            <span>Encrypted Session • TOTP MFA Enforced</span>
          </p>
          <p>
            <Link href="/" className="hover:text-white transition-colors underline underline-offset-4">
              Return to Public Academic Portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
