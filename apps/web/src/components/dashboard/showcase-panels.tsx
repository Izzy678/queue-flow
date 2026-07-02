"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Building2, BarChart3, Users } from "lucide-react";
import { MiniChart } from "@/components/dashboard/mini-chart";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "monitoring", label: "Queue Monitoring", icon: Users },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "branches", label: "Branch Management", icon: Building2 },
] as const;

type TabId = (typeof tabs)[number]["id"];

const branchData = [
  { name: "Downtown", queues: 4, served: 234, wait: "8 min", status: "active" },
  { name: "Westside", queues: 3, served: 189, wait: "12 min", status: "active" },
  { name: "Airport", queues: 6, served: 412, wait: "15 min", status: "busy" },
  { name: "Mall", queues: 2, served: 156, wait: "5 min", status: "active" },
];

const queueRows = [
  { ticket: "A-041", customer: "Maria L.", service: "General", wait: "3 min", status: "serving" },
  { ticket: "A-042", customer: "James K.", service: "General", wait: "5 min", status: "waiting" },
  { ticket: "B-018", customer: "Sarah T.", service: "Priority", wait: "1 min", status: "called" },
  { ticket: "A-043", customer: "David R.", service: "General", wait: "8 min", status: "waiting" },
  { ticket: "C-007", customer: "Emma W.", service: "Express", wait: "2 min", status: "waiting" },
];

export function ShowcasePanels({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = useState<TabId>("monitoring");

  return (
    <div className={cn("glass-strong rounded-2xl overflow-hidden gradient-border", className)}>
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors relative",
              activeTab === tab.id
                ? "text-foreground"
                : "text-muted hover:text-foreground"
            )}
          >
            <tab.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
              />
            )}
          </button>
        ))}
      </div>

      <div className="p-6 min-h-[320px]">
        <AnimatePresence mode="wait">
          {activeTab === "monitoring" && (
            <MonitoringPanel key="monitoring" />
          )}
          {activeTab === "analytics" && (
            <AnalyticsPanel key="analytics" />
          )}
          {activeTab === "branches" && (
            <BranchesPanel key="branches" />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function MonitoringPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold">Active Queue — Downtown</h4>
        <Badge variant="success" className="gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          5 in queue
        </Badge>
      </div>
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface/50">
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted">Ticket</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted hidden sm:table-cell">Customer</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted hidden md:table-cell">Service</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted">Wait</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-muted">Status</th>
            </tr>
          </thead>
          <tbody>
            {queueRows.map((row) => (
              <tr key={row.ticket} className="border-b border-border last:border-0">
                <td className="px-4 py-2.5 font-mono text-xs font-medium">{row.ticket}</td>
                <td className="px-4 py-2.5 text-xs hidden sm:table-cell">{row.customer}</td>
                <td className="px-4 py-2.5 text-xs text-muted hidden md:table-cell">{row.service}</td>
                <td className="px-4 py-2.5 text-xs">{row.wait}</td>
                <td className="px-4 py-2.5">
                  <Badge
                    variant={
                      row.status === "serving"
                        ? "success"
                        : row.status === "called"
                          ? "warning"
                          : "default"
                    }
                  >
                    {row.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function AnalyticsPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Avg wait time", value: "8.2 min", change: "-23%" },
          { label: "Tickets served", value: "847", change: "+12%" },
          { label: "Satisfaction", value: "4.8/5", change: "+0.3" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg bg-surface/50 p-4">
            <p className="text-xs text-muted mb-1">{stat.label}</p>
            <p className="text-xl font-bold">{stat.value}</p>
            <p className="text-xs text-success mt-1">{stat.change}</p>
          </div>
        ))}
      </div>
      <div className="rounded-lg bg-surface/50 p-4">
        <p className="text-xs text-muted mb-3">Daily throughput</p>
        <div className="h-32">
          <MiniChart type="bar" data={[30, 45, 38, 62, 55, 78, 65, 82, 70, 90, 85, 95]} />
        </div>
      </div>
    </motion.div>
  );
}

function BranchesPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid sm:grid-cols-2 gap-3">
        {branchData.map((branch) => (
          <div
            key={branch.name}
            className="rounded-lg border border-border bg-surface/50 p-4 hover:border-border-strong transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold">{branch.name}</h4>
              <Badge variant={branch.status === "busy" ? "warning" : "success"}>
                {branch.status}
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-bold">{branch.queues}</p>
                <p className="text-[10px] text-muted">Queues</p>
              </div>
              <div>
                <p className="text-lg font-bold">{branch.served}</p>
                <p className="text-[10px] text-muted">Served</p>
              </div>
              <div>
                <p className="text-lg font-bold">{branch.wait}</p>
                <p className="text-[10px] text-muted">Avg wait</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
