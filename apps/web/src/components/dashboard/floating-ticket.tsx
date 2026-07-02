"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface FloatingTicketProps {
  ticketNumber: string;
  status: "waiting" | "called" | "serving";
  service?: string;
  waitTime?: string;
  className?: string;
}

const statusConfig = {
  waiting: { label: "Waiting", variant: "default" as const },
  called: { label: "Called", variant: "warning" as const },
  serving: { label: "Serving", variant: "success" as const },
};

export function FloatingTicket({
  ticketNumber,
  status,
  service = "General",
  waitTime,
  className,
}: FloatingTicketProps) {
  const config = statusConfig[status];

  return (
    <div
      className={cn(
        "glass-strong rounded-xl p-4 shadow-xl shadow-black/20 w-[180px]",
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted font-medium uppercase tracking-wider">
          Ticket
        </span>
        <Badge variant={config.variant}>{config.label}</Badge>
      </div>
      <div className="text-2xl font-bold tracking-tight mb-1">{ticketNumber}</div>
      <div className="text-xs text-muted">{service}</div>
      {waitTime && (
        <div className="mt-2 pt-2 border-t border-border text-xs text-muted">
          Est. wait: <span className="text-foreground font-medium">{waitTime}</span>
        </div>
      )}
    </div>
  );
}
