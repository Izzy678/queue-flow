import { DashboardTopbar } from "@/components/dashboard/sidebar";

export const metadata = { title: "Analytics — QueueFlow" };

export default function AnalyticsPage() {
  return (
    <>
      <DashboardTopbar title="Analytics" description="Performance insights" />
      <div className="flex flex-1 items-center justify-center p-6">
        <p className="text-sm text-muted">Analytics — coming in Phase 4</p>
      </div>
    </>
  );
}
