"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import type { DashboardStats } from "@queueflow/shared";
import { DashboardTopbar } from "@/components/dashboard/sidebar";
import { OverviewStats } from "@/components/dashboard/overview-stats";
import { BranchGrid } from "@/components/dashboard/branch-grid";
import { QueueActivityPanel, ThroughputPanel } from "@/components/dashboard/queue-activity";
import { getDashboardStats } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";

export function DashboardOverview() {
  const { auth } = useAuth();
  const branches = auth?.branches ?? [];
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch {
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 10000);
    return () => clearInterval(interval);
  }, [loadStats]);

  return (
    <>
      <DashboardTopbar
        title="Overview"
        description={`${auth?.tenant.name ?? "Your workspace"} · ${branches.length} branch${branches.length === 1 ? "" : "es"}`}
      />

      <div className="flex-1 overflow-y-auto">
        {loading || !stats ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted" />
          </div>
        ) : (
          <>
            <OverviewStats stats={stats} />

            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-sm font-semibold mb-1">Branches</h2>
                <p className="text-xs text-muted mb-4">
                  Your locations across the organization
                </p>
                <BranchGrid branches={branches} />
              </div>

              <div>
                <h2 className="text-sm font-semibold mb-1">Queue activity</h2>
                <p className="text-xs text-muted mb-4">
                  Live queues and recent tickets
                </p>
                <QueueActivityPanel stats={stats} />
              </div>

              <div>
                <h2 className="text-sm font-semibold mb-1">Throughput</h2>
                <p className="text-xs text-muted mb-4">
                  Hourly customers served
                </p>
                <ThroughputPanel stats={stats} />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
