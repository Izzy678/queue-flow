import { TicketStatusPage } from "@/components/join/ticket-status-page";

export const metadata = { title: "Your ticket — QueueFlow" };

export default async function TicketPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;
  return <TicketStatusPage ticketId={ticketId} />;
}
