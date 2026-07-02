import { DashboardTopbar } from "@/components/dashboard/sidebar";
import { OverviewStats } from "@/components/dashboard/overview-stats";
import { BranchGrid } from "@/components/dashboard/branch-grid";
import { QueueActivityPanel, ThroughputPanel } from "@/components/dashboard/queue-activity";

export const metadata = {
  title: "Dashboard — QueueFlow",
};

export default function DashboardPage() {
  return (
    <>
      <DashboardTopbar
        title="Overview"
        description="Friday, Jun 26 · All branches"
      />

      <div className="flex-1 overflow-y-auto">
        <OverviewStats />

        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-sm font-semibold mb-1">Branches</h2>
            <p className="text-xs text-muted mb-4">
              Performance across your locations
            </p>
            <BranchGrid />
          </div>

          <div>
            <h2 className="text-sm font-semibold mb-1">Queue activity</h2>
            <p className="text-xs text-muted mb-4">
              Live queues and recent tickets
            </p>
            <QueueActivityPanel />
          </div>

          <div>
            <h2 className="text-sm font-semibold mb-1">Throughput</h2>
            <p className="text-xs text-muted mb-4">
              Hourly customers served
            </p>
            <ThroughputPanel />
          </div>
        </div>
      </div>
    </>
  );
}
