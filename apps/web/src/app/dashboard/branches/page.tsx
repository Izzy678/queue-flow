import { DashboardTopbar } from "@/components/dashboard/sidebar";

export const metadata = { title: "Branches — QueueFlow" };

export default function BranchesPage() {
  return (
    <>
      <DashboardTopbar title="Branches" description="Manage your locations" />
      <div className="flex flex-1 items-center justify-center p-6">
        <p className="text-sm text-muted">Branch management — coming in Phase 2</p>
      </div>
    </>
  );
}
