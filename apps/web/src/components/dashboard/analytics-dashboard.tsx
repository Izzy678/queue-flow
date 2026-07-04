"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Clock,
  Loader2,
  TrendingUp,
  XCircle,
} from "lucide-react";
import type { AnalyticsReport, Branch } from "@queueflow/shared";
import { getAnalytics, getBranches } from "@/lib/api-client";
import { DashboardTopbar } from "@/components/dashboard/sidebar";
import { CountUp } from "@/components/motion/count-up";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

function formatDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

function defaultRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 6);
  return { from: formatDateInput(from), to: formatDateInput(to) };
}

export function AnalyticsDashboard() {
  const initialRange = useMemo(() => defaultRange(), []);
  const [from, setFrom] = useState(initialRange.from);
  const [to, setTo] = useState(initialRange.to);
  const [branchId, setBranchId] = useState("all");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [report, setReport] = useState<AnalyticsReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBranches()
      .then(setBranches)
      .catch(() => setBranches([]));
  }, []);

  const loadReport = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAnalytics({
        from,
        to,
        branchId: branchId === "all" ? undefined : branchId,
      });
      setReport(data);
    } catch (err) {
      setReport(null);
      setError(err instanceof Error ? err.message : "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, [from, to, branchId]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  return (
    <>
      <DashboardTopbar
        title="Analytics"
        description="Tickets served, wait times, and branch performance"
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="rounded-xl border border-border bg-surface-elevated p-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="analytics-from">From</Label>
              <Input
                id="analytics-from"
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="analytics-to">To</Label>
              <Input
                id="analytics-to"
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="analytics-branch">Branch</Label>
              <select
                id="analytics-branch"
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm"
              >
                <option value="all">All branches</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={loadReport} disabled={loading}>
                Apply filters
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {loading || !report ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted" />
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 border-t border-l border-border">
              <SummaryCard
                icon={TrendingUp}
                label="Tickets served"
                value={report.ticketsServed}
              />
              <SummaryCard
                icon={Clock}
                label="Avg wait"
                value={report.avgWaitMinutes ?? 0}
                suffix=" min"
                isPlaceholder={report.avgWaitMinutes === null}
              />
              <SummaryCard
                icon={AlertTriangle}
                label="No-shows"
                value={report.noShows}
              />
              <SummaryCard
                icon={XCircle}
                label="Cancelled"
                value={report.cancelled}
              />
            </div>

            <BreakdownTable
              title="By branch"
              description="Performance across your locations"
              emptyMessage="No branch activity in this period."
              rows={report.byBranch.map((row) => ({
                key: row.branchId,
                primary: row.branchName,
                secondary: null,
                ticketsServed: row.ticketsServed,
                noShows: row.noShows,
                avgWaitMinutes: row.avgWaitMinutes,
              }))}
            />

            <BreakdownTable
              title="By queue"
              description="Queue-level throughput and wait times"
              emptyMessage="No queue activity in this period."
              rows={report.byQueue.map((row) => ({
                key: row.queueId,
                primary: row.queueName,
                secondary: row.branchName,
                ticketsServed: row.ticketsServed,
                noShows: row.noShows,
                avgWaitMinutes: row.avgWaitMinutes,
              }))}
            />
          </>
        )}
      </div>
    </>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  suffix = "",
  isPlaceholder = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  suffix?: string;
  isPlaceholder?: boolean;
}) {
  return (
    <div className="border-r border-b border-border p-6 transition-colors hover:bg-surface-hover/50">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft">
          <Icon className="h-4 w-4 text-accent" />
        </div>
        <span className="text-xs font-medium uppercase tracking-wider text-muted">
          {label}
        </span>
      </div>
      <div className="text-3xl font-bold tracking-tight">
        {isPlaceholder && value === 0 ? (
          <span className="text-muted text-xl">—</span>
        ) : (
          <>
            <CountUp end={value} duration={1.2} />
            {suffix}
          </>
        )}
      </div>
    </div>
  );
}

function BreakdownTable({
  title,
  description,
  emptyMessage,
  rows,
}: {
  title: string;
  description: string;
  emptyMessage: string;
  rows: Array<{
    key: string;
    primary: string;
    secondary: string | null;
    ticketsServed: number;
    noShows: number;
    avgWaitMinutes: number | null;
  }>;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface-elevated overflow-hidden">
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-accent" />
          <h2 className="text-sm font-semibold">{title}</h2>
        </div>
        <p className="text-xs text-muted mt-1">{description}</p>
      </div>

      {rows.length === 0 ? (
        <p className="px-6 py-10 text-sm text-muted text-center">{emptyMessage}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-3 py-3 font-medium">Served</th>
                <th className="px-3 py-3 font-medium">No-shows</th>
                <th className="px-6 py-3 font-medium">Avg wait</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.key}
                  className={cn("border-b border-border last:border-0")}
                >
                  <td className="px-6 py-3">
                    <p className="font-medium">{row.primary}</p>
                    {row.secondary && (
                      <p className="text-xs text-muted">{row.secondary}</p>
                    )}
                  </td>
                  <td className="px-3 py-3">{row.ticketsServed}</td>
                  <td className="px-3 py-3">{row.noShows}</td>
                  <td className="px-6 py-3">
                    {row.avgWaitMinutes === null ? "—" : `${row.avgWaitMinutes} min`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
