import { DashboardTopbar } from "@/components/dashboard/sidebar";
import { BranchManager } from "@/components/dashboard/branch-manager";

export const metadata = { title: "Branches — QueueFlow" };

export default function BranchesPage() {
  return (
    <>
      <DashboardTopbar title="Branches" description="Manage your locations" />
      <BranchManager />
    </>
  );
}
