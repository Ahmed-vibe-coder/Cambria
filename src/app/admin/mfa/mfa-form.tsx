"use client";

import React, { useActionState } from "react";
import { verifyMfaAction } from "@/actions/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, AlertCircle, Lock } from "lucide-react";

export function MfaVerifyForm({ email }: { email: string }) {
  const [state, formAction, isPending] = useActionState(verifyMfaAction, null);

  return (
    <Card className="p-6 sm:p-8 shadow-2xl border-white/10 bg-white">
      <CardHeader className="p-0 pb-6 text-center">
        <CardTitle className="font-serif text-2xl font-bold text-cambria-navy">
          Enter 6-Digit TOTP Code
        </CardTitle>
        <p className="text-xs text-slate-500 pt-1">
          Enter the dynamic time-based passcode from your authenticator device for{" "}
          <span className="font-semibold text-slate-700">{email}</span>.
        </p>
      </CardHeader>

      <CardContent className="p-0">
        {state?.error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-[4px] text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
            <span>{state.error}</span>
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block text-center">
              Security Passcode (6 Digits)
            </label>
            <Input
              name="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              autoFocus
              placeholder="000000"
              className="rounded-[4px] border-slate-300 text-center tracking-[0.5em] font-mono text-xl font-bold py-3"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-cambria-navy hover:bg-cambria-academic text-white font-semibold py-2.5 rounded-[4px] gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              {isPending ? "Validating Passcode..." : "Verify & Authorize Session"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
