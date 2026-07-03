"use client";

import type { DashboardStats } from "@queueflow/shared";
import { Badge } from "@/components/ui/badge";
import { MiniChart } from "@/components/dashboard/mini-chart";
import { cn } from "@/lib/utils";

const statusVariant = {
  waiting: "default",
  called: "warning",
  serving: "success",
  completed: "default",
  cancelled: "default",
  no_show: "default",
} as const;

export function QueueActivityPanel({
  stats,
  className,
}: {
  stats: DashboardStats;
  className?: string;
}) {
  return (
    <div className={cn("grid lg:grid-cols-2 border-t border-l border-border", className)}>
      <div className="border-r border-b border-border p-6">
        <h3 className="text-sm font-semibold mb-1">Active queues</h3>
        <p className="text-xs text-muted mb-4">Live status across branches</p>
        {stats.queueSummaries.length === 0 ? (
          <p className="text-sm text-muted">No active queues yet.</p>
        ) : (
          <div className="space-y-2">
            {stats.queueSummaries.map((queue) => (
              <div
                key={queue.id}
                className="flex items-center justify-between rounded-lg border border-border bg-surface/50 px-3 py-2.5"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: queue.color }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{queue.name}</p>
                    <p className="text-xs text-muted truncate">{queue.branchName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted shrink-0">
                  <span>
                    <span className="text-foreground font-medium">{queue.waitingCount}</span> waiting
                  </span>
                  <span>
                    <span className="text-foreground font-medium">{queue.servingCount}</span> serving
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-r border-b border-border p-6">
        <h3 className="text-sm font-semibold mb-1">Recent tickets</h3>
        <p className="text-xs text-muted mb-4">Latest activity in your queues</p>
        {stats.recentTickets.length === 0 ? (
          <p className="text-sm text-muted">No ticket activity yet.</p>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface/50">
                  <th className="text-left px-3 py-2 text-xs font-medium text-muted">Ticket</th>
                  <th className="text-left px-3 py-2 text-xs font-medium text-muted hidden sm:table-cell">Customer</th>
                  <th className="text-left px-3 py-2 text-xs font-medium text-muted">Wait</th>
                  <th className="text-left px-3 py-2 text-xs font-medium text-muted">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentTickets.map((row) => (
                  <tr key={row.id} className="border-b border-border last:border-0">
                    <td className="px-3 py-2 font-mono text-xs font-medium">{row.ticketNumber}</td>
                    <td className="px-3 py-2 text-xs hidden sm:table-cell">{row.customerName}</td>
                    <td className="px-3 py-2 text-xs text-muted">{row.waitMinutes} min</td>
                    <td className="px-3 py-2">
                      <Badge variant={statusVariant[row.status]}>{row.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export function ThroughputPanel({
  stats,
  className,
}: {
  stats: DashboardStats;
  className?: string;
}) {
  return (
    <div className={cn("border-t border-l border-border", className)}>
      <div className="border-r border-b border-border p-6">
        <h3 className="text-sm font-semibold mb-1">Throughput</h3>
        <p className="text-xs text-muted mb-4">Customers served in the last 12 hours</p>
        <div className="h-32">
          <MiniChart type="area" data={stats.throughput} />
        </div>
      </div>
    </div>
  );
}
