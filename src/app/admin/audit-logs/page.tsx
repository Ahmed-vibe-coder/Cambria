import { getAuditLogs } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { History, ShieldCheck, ArrowRight } from "lucide-react";

export default async function AdminAuditLogsPage() {
  const auditLogs = await getAuditLogs();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-cambria-navy tracking-tight">
            Institutional Audit Trail
          </h1>
          <p className="text-sm text-slate-500 pt-0.5">
            Tamper-evident chronological record of all administrative operations, status transitions, and document generations.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Immutable Audit Ledger Active</span>
        </div>
      </div>

      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-cambria-academic" />
            <CardTitle className="text-lg">Total Audit Entries: {auditLogs.length}</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3">Timestamp</th>
                  <th className="px-6 py-3">Action Type</th>
                  <th className="px-6 py-3">Entity Target</th>
                  <th className="px-6 py-3">State Transition</th>
                  <th className="px-6 py-3">Mandatory Reason / Justification</th>
                  <th className="px-6 py-3">Acting Officer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-500 whitespace-nowrap">
                      {formatDate(log.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-cambria-soft text-cambria-navy border border-blue-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-600">
                      {log.entity_type}: {log.entity_id.slice(0, 12)}...
                    </td>
                    <td className="px-6 py-4">
                      {log.from_state || log.to_state ? (
                        <span className="flex items-center gap-1.5 font-medium text-slate-700">
                          <span className="capitalize">{log.from_state || "initial"}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                          <span className="capitalize font-bold text-cambria-navy">{log.to_state}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-800 font-medium max-w-sm">
                      {log.reason || "Administrative operation"}
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono">
                      {log.actor_email || "System Service"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
