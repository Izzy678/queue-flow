import { DashboardTopbar } from "@/components/dashboard/sidebar";
import { QueueManager } from "@/components/dashboard/queue-manager";

export const metadata = { title: "Queues — QueueFlow" };

export default function QueuesPage() {
  return (
    <>
      <DashboardTopbar title="Queues" description="Manage and monitor live queues" />
      <QueueManager />
    </>
  );
}
