"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, PhoneCall, RefreshCw } from "lucide-react";
import type { QueueBoard, Ticket } from "@queueflow/shared";
import { TicketStatus } from "@queueflow/shared";
import {
  callNextTicket,
  cancelTicket,
  completeTicket,
  getQueueBoard,
  markTicketNoShow,
  serveTicket,
} from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const statusVariant = {
  waiting: "default",
  called: "warning",
  serving: "success",
  completed: "default",
  cancelled: "default",
  no_show: "default",
} as const;

export function QueueMonitor({ queueId }: { queueId: string }) {
  const [board, setBoard] = useState<QueueBoard | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBoard = useCallback(async () => {
    try {
      const data = await getQueueBoard(queueId);
      setBoard(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load queue");
    } finally {
      setLoading(false);
    }
  }, [queueId]);

  useEffect(() => {
    loadBoard();
    const interval = setInterval(loadBoard, 5000);
    return () => clearInterval(interval);
  }, [loadBoard]);

  const runAction = async (action: () => Promise<Ticket>) => {
    setActing(true);
    setError(null);
    try {
      await action();
      await loadBoard();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setActing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-muted" />
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <p className="text-sm text-muted">Queue not found</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/dashboard/queues"
            className="mb-3 inline-flex items-center gap-1 text-xs text-muted hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to queues
          </Link>
          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: board.queue.color }}
            />
            <h2 className="text-lg font-semibold">{board.queue.name}</h2>
          </div>
          <p className="text-sm text-muted">
            {board.queue.branchName} · {board.servedToday} served today
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadBoard()}
            disabled={acting}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button
            variant="gradient"
            onClick={() => runAction(() => callNextTicket(queueId))}
            disabled={acting || board.waiting.length === 0}
          >
            <PhoneCall className="h-4 w-4" />
            Call next
          </Button>
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <TicketColumn title="Waiting" tickets={board.waiting} />
        <TicketColumn
          title="Called"
          tickets={board.called}
          onServe={(id) => runAction(() => serveTicket(id))}
          onNoShow={(id) => runAction(() => markTicketNoShow(id))}
          onCancel={(id) => runAction(() => cancelTicket(id))}
          acting={acting}
        />
        <TicketColumn
          title="Serving"
          tickets={board.serving}
          onComplete={(id) => runAction(() => completeTicket(id))}
          onCancel={(id) => runAction(() => cancelTicket(id))}
          acting={acting}
        />
      </div>
    </div>
  );
}

function TicketColumn({
  title,
  tickets,
  onServe,
  onNoShow,
  onComplete,
  onCancel,
  acting,
}: {
  title: string;
  tickets: Ticket[];
  onServe?: (id: string) => void;
  onNoShow?: (id: string) => void;
  onComplete?: (id: string) => void;
  onCancel?: (id: string) => void;
  acting?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface-elevated">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold">
          {title}{" "}
          <span className="text-muted font-normal">({tickets.length})</span>
        </h3>
      </div>
      <div className="space-y-2 p-3">
        {tickets.length === 0 ? (
          <p className="px-2 py-6 text-center text-xs text-muted">Empty</p>
        ) : (
          tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="rounded-lg border border-border bg-surface/50 p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-mono text-sm font-bold">{ticket.ticketNumber}</p>
                  <p className="text-sm">{ticket.customerName}</p>
                  <p className="text-xs text-muted">
                    {ticket.position
                      ? `#${ticket.position} in line · `
                      : ""}
                    {ticket.waitMinutes} min
                  </p>
                </div>
                <Badge variant={statusVariant[ticket.status]}>{ticket.status}</Badge>
              </div>
              <div className={cn("mt-3 flex flex-wrap gap-2", !onServe && !onComplete && "hidden")}>
                {onServe && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={acting}
                    onClick={() => onServe(ticket.id)}
                  >
                    Start serving
                  </Button>
                )}
                {onComplete && (
                  <Button
                    size="sm"
                    variant="gradient"
                    disabled={acting}
                    onClick={() => onComplete(ticket.id)}
                  >
                    Complete
                  </Button>
                )}
                {onNoShow && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={acting}
                    onClick={() => onNoShow(ticket.id)}
                  >
                    No-show
                  </Button>
                )}
                {onCancel && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-400"
                    disabled={acting}
                    onClick={() => onCancel(ticket.id)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
