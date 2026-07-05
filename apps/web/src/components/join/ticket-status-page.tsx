"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import type { PublicTicketStatus } from "@queueflow/shared";
import { getPublicTicket } from "@/lib/api-client";
import { TicketStatusCard } from "@/components/join/ticket-status-card";

export function TicketStatusPage({ ticketId }: { ticketId: string }) {
  const [ticket, setTicket] = useState<PublicTicketStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTicket = useCallback(async () => {
    try {
      const data = await getPublicTicket(ticketId);
      setTicket(data);
      setError(null);
    } catch (err) {
      setTicket(null);
      setError(err instanceof Error ? err.message : "Ticket not found");
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    loadTicket();
  }, [loadTicket]);

  useEffect(() => {
    if (!ticket?.id) return;

    const interval = setInterval(async () => {
      try {
        const updated = await getPublicTicket(ticket.id);
        setTicket(updated);
      } catch {
        // ignore polling errors
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [ticket?.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted" />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <p className="text-sm text-muted">{error ?? "Ticket not found"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <TicketStatusCard ticket={ticket} />
    </div>
  );
}
