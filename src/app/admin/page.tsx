import React from "react";
import Link from "next/link";
import {
  getCredentials,
  getStudents,
  getPrograms,
  getAuditLogs,
} from "@/lib/db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/utils";
import {
  Award,
  Users,
  GraduationCap,
  ShieldCheck,
  AlertTriangle,
  FileText,
  PlusCircle,
  ArrowRight,
  History,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const [credentials, students, programs, auditLogs] = await Promise.all([
    getCredentials(),
    getStudents(),
    getPrograms(),
    getAuditLogs(),
  ]);

  const activeCount = credentials.filter((c) => c.status === "active").length;
  const expiredCount = credentials.filter((c) => c.status === "expired").length;
  const revokedCount = credentials.filter((c) => c.status === "revoked").length;
  const suspendedCount = credentials.filter((c) => c.status === "suspended").length;

  const recentCredentials = credentials.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-cambria-navy tracking-tight">
            Institutional Registry Overview
          </h1>
          <p className="text-sm text-slate-500 pt-0.5">
            Operational metrics, credential lifecycle states, and recent administrative actions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/students/new">
            <Button variant="outline" size="sm" className="gap-1.5 border-slate-300">
              <Users className="w-4 h-4 text-cambria-academic" />
              Register Student
            </Button>
          </Link>
          <Link href="/admin/credentials/new">
            <Button size="sm" className="gap-1.5 bg-cambria-navy hover:bg-cambria-academic text-white">
              <PlusCircle className="w-4 h-4" />
              Issue Credential
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Total Credentials</span>
            <Award className="w-4 h-4 text-cambria-academic" />
          </div>
          <div className="text-3xl font-serif font-bold text-cambria-navy">
            {credentials.length}
          </div>
          <div className="text-xs text-emerald-700 flex items-center gap-1 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {activeCount} Active & Verified
          </div>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Registered Scholars</span>
            <Users className="w-4 h-4 text-cambria-academic" />
          </div>
          <div className="text-3xl font-serif font-bold text-cambria-navy">
            {students.length}
          </div>
          <div className="text-xs text-slate-500">
            Enrolled across all curricula
          </div>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Academic Programs</span>
            <GraduationCap className="w-4 h-4 text-cambria-academic" />
          </div>
          <div className="text-3xl font-serif font-bold text-cambria-navy">
            {programs.length}
          </div>
          <div className="text-xs text-slate-500">
            Master&apos;s, Diplomas, and Courses
          </div>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Lifecycle Exceptions</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-serif font-bold text-amber-900">
            {revokedCount + suspendedCount + expiredCount}
          </div>
          <div className="text-xs text-slate-500">
            {revokedCount} Revoked • {suspendedCount} Suspended • {expiredCount} Expired
          </div>
        </Card>
      </div>

      {/* Main Content Grid: Recent Issuances & Audit Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Credentials Table */}
        <div className="lg:col-span-8">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <CardTitle className="text-xl">Recent Credential Issuances</CardTitle>
                <CardDescription>
                  Credentials issued with unified serial and verification token.
                </CardDescription>
              </div>
              <Link href="/admin/credentials">
                <Button variant="ghost" size="sm" className="text-xs text-cambria-academic hover:bg-cambria-soft gap-1">
                  View All Registry <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-3">Credential ID</th>
                      <th className="px-6 py-3">Student Name</th>
                      <th className="px-6 py-3">Program</th>
                      <th className="px-6 py-3">Issue Date</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentCredentials.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-6 py-4 font-mono font-semibold text-cambria-navy">
                          {c.credential_number}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-slate-800 block">
                            {c.student?.full_name_en}
                          </span>
                          <span className="text-[11px] text-slate-400 font-arabic" dir="rtl">
                            {c.student?.full_name_ar}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 max-w-[200px] truncate">
                          {c.program?.name}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {formatDate(c.issue_date)}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={c.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link href={`/admin/credentials/${c.id}`}>
                            <Button size="sm" variant="outline" className="text-xs h-7 px-2.5">
                              Manage
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Live Audit Activity */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <CardTitle className="text-lg">Recent Audit Logs</CardTitle>
                <CardDescription>Immutable activity records.</CardDescription>
              </div>
              <Link href="/admin/audit-logs">
                <History className="w-4 h-4 text-slate-400 hover:text-cambria-navy" />
              </Link>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {auditLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="p-3 bg-slate-50 rounded-[4px] border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500 font-medium">
                    <span className="font-mono uppercase text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {log.action}
                    </span>
                    <span>{formatDate(log.created_at)}</span>
                  </div>
                  <p className="text-slate-800 font-medium pt-1">
                    {log.reason || "System state update"}
                  </p>
                  <div className="text-[11px] text-slate-400">
                    By: {log.actor_email}
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <Link href="/admin/audit-logs">
                  <Button variant="outline" size="sm" className="w-full text-xs justify-center">
                    View Full Audit Trail
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
