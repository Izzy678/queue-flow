"use client";

import { Users, Clock, Hash, TrendingUp } from "lucide-react";
import { CountUp } from "@/components/motion/count-up";
import { MiniChart } from "@/components/dashboard/mini-chart";
import { Badge } from "@/components/ui/badge";
import { dashboardStats } from "@/lib/landing-data";
import { cn } from "@/lib/utils";

interface DashboardMockProps {
  className?: string;
}

const queues = [
  { name: "General", waiting: 12, serving: 3, color: "#6366f1" },
  { name: "Priority", waiting: 4, serving: 1, color: "#f59e0b" },
  { name: "Express", waiting: 8, serving: 2, color: "#22c55e" },
  { name: "Returns", waiting: 6, serving: 1, color: "#8b5cf6" },
];

export function DashboardMock({ className }: DashboardMockProps) {
  return (
    <div
      className={cn(
        "glass-strong rounded-2xl p-5 shadow-2xl shadow-black/30 gradient-border",
        className
      )}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold">Live Dashboard</h3>
          <p className="text-xs text-muted">Downtown Branch</p>
        </div>
        <Badge variant="success" className="gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          Live
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatCard
          icon={Users}
          label="Active queues"
          value={dashboardStats.activeQueues}
        />
        <StatCard
          icon={Clock}
          label="Avg wait"
          value={dashboardStats.avgWaitTime}
          suffix=" min"
        />
        <StatCard
          icon={Hash}
          label="Current ticket"
          value={dashboardStats.currentTicket}
          isText
        />
        <StatCard
          icon={TrendingUp}
          label="Served today"
          value={dashboardStats.customersServed}
        />
      </div>

      <div className="space-y-2 mb-4">
        {queues.map((queue) => (
          <div
            key={queue.name}
            className="flex items-center justify-between rounded-lg bg-surface/50 px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: queue.color }}
              />
              <span className="text-xs font-medium">{queue.name}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted">
              <span>
                <span className="text-foreground font-medium">{queue.waiting}</span>{" "}
                waiting
              </span>
              <span>
                <span className="text-foreground font-medium">{queue.serving}</span>{" "}
                serving
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-surface/50 p-3">
        <p className="text-xs text-muted mb-2">Throughput (last 12h)</p>
        <div className="h-12">
          <MiniChart type="area" />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix = "",
  isText = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  suffix?: string;
  isText?: boolean;
}) {
  return (
    <div className="rounded-lg bg-surface/50 p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="h-3 w-3 text-muted" />
        <span className="text-[10px] text-muted uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="text-lg font-bold tracking-tight">
        {isText ? (
          value
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
