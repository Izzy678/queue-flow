import { DashboardTopbar } from "@/components/dashboard/sidebar";
import { QueueMonitor } from "@/components/dashboard/queue-monitor";

export const metadata = { title: "Queue monitor — QueueFlow" };

export default async function QueueMonitorPage({
  params,
}: {
  params: Promise<{ queueId: string }>;
}) {
  const { queueId } = await params;

  return (
    <>
      <DashboardTopbar title="Queue monitor" description="Call and serve customers" />
      <QueueMonitor queueId={queueId} />
    </>
  );
}
