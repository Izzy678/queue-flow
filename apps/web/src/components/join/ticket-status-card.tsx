"use client";

import { CheckCircle2, Ticket } from "lucide-react";
import type { PublicTicketStatus } from "@queueflow/shared";
import { TicketStatus } from "@queueflow/shared";
import { Badge } from "@/components/ui/badge";

export function TicketStatusCard({ ticket }: { ticket: PublicTicketStatus }) {
  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-surface-elevated p-8 shadow-xl text-center space-y-4">
      <div className="rounded-xl border border-accent/30 bg-accent-soft p-6">
        <Ticket className="mx-auto mb-3 h-8 w-8 text-accent" />
        <p className="text-xs uppercase tracking-wider text-muted mb-1">Your ticket</p>
        <p className="font-mono text-4xl font-bold">{ticket.ticketNumber}</p>
      </div>
      <p className="text-sm text-muted">
        {ticket.queueName} · {ticket.branchName}
      </p>
      <Badge
        variant={
          ticket.status === TicketStatus.SERVING ||
          ticket.status === TicketStatus.CALLED
            ? "success"
            : "default"
        }
      >
        {ticket.status}
      </Badge>
      {ticket.position && (
        <p className="text-sm text-muted">
          You are <span className="text-foreground font-medium">#{ticket.position}</span> in
          line
        </p>
      )}
      <p className="text-xs text-muted leading-relaxed">
        Tip: We&apos;ll email you when it&apos;s your turn. You can also screenshot your ticket
        for verification at the counter.
      </p>
      {(ticket.status === TicketStatus.CALLED ||
        ticket.status === TicketStatus.SERVING) && (
        <div className="flex items-center justify-center gap-2 text-success text-sm">
          <CheckCircle2 className="h-4 w-4" />
          Please proceed to the counter
        </div>
      )}
    </div>
  );
}
