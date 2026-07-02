import { DashboardTopbar } from "@/components/dashboard/sidebar";
import { OrganizationSettings } from "@/components/dashboard/organization-settings";
import { TeamManager } from "@/components/dashboard/team-manager";

export const metadata = { title: "Settings — QueueFlow" };

export default function SettingsPage() {
  return (
    <>
      <DashboardTopbar
        title="Settings"
        description="Organization profile and team management"
      />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <OrganizationSettings />
        <TeamManager />
      </div>
    </>
  );
}
