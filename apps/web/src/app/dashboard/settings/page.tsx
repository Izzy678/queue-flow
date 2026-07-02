import { DashboardTopbar } from "@/components/dashboard/sidebar";

export const metadata = { title: "Settings — QueueFlow" };

export default function SettingsPage() {
  return (
    <>
      <DashboardTopbar title="Settings" description="Organization preferences" />
      <div className="flex flex-1 items-center justify-center p-6">
        <p className="text-sm text-muted">Settings — coming soon</p>
      </div>
    </>
  );
}
