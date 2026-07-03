"use client";

import { Users, Clock, Hash, TrendingUp } from "lucide-react";
import type { DashboardStats } from "@queueflow/shared";
import { CountUp } from "@/components/motion/count-up";
import { cn } from "@/lib/utils";

export function OverviewStats({
  stats,
  className,
}: {
  stats: DashboardStats;
  className?: string;
}) {
  return (
    <div className={cn("grid sm:grid-cols-2 xl:grid-cols-4 border-t border-l border-border", className)}>
      <StatCard icon={Users} label="Active queues" value={stats.activeQueues} />
      <StatCard
        icon={Clock}
        label="Avg wait"
        value={stats.avgWaitMinutes ?? 0}
        suffix=" min"
        isPlaceholder={stats.avgWaitMinutes === null}
      />
      <StatCard
        icon={Hash}
        label="Current ticket"
        value={stats.currentTicket ?? "—"}
        isText
      />
      <StatCard icon={TrendingUp} label="Served today" value={stats.servedToday} />
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix = "",
  isText = false,
  isPlaceholder = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  suffix?: string;
  isText?: boolean;
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
        {isText ? (
          <span className="font-mono">{value}</span>
        ) : isPlaceholder && value === 0 ? (
          <span className="text-muted text-xl">—</span>
        ) : (
          <>
            <CountUp end={value as number} duration={1.5} />
            {suffix}
          </>
        )}
      </div>
    </div>
  );
}
