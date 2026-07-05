"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { TicketStatusCard } from "@/components/join/ticket-status-card";
import type { PublicQueueInfo, PublicTicketStatus } from "@queueflow/shared";
import { getPublicQueue, getPublicTicket, joinPublicQueue } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function JoinQueuePage({
  queueId,
  joinToken,
}: {
  queueId: string;
  joinToken: string;
}) {
  const [queue, setQueue] = useState<PublicQueueInfo | null>(null);
  const [ticket, setTicket] = useState<PublicTicketStatus | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadQueue = useCallback(async () => {
    try {
      const data = await getPublicQueue(queueId);
      setQueue(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Queue unavailable");
    } finally {
      setLoading(false);
    }
  }, [queueId]);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  useEffect(() => {
    if (!ticket?.id) return;

    const poll = async () => {
      try {
        const updated = await getPublicTicket(ticket.id);
        setTicket(updated);
      } catch {
        // ignore polling errors
      }
    };

    poll();
    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, [ticket?.id]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const created = await joinPublicQueue(queueId, {
        customerName: name.trim(),
        customerEmail: email.trim(),
        customerPhone: phone.trim() || undefined,
        joinToken,
      });
      setTicket({
        id: created.id,
        ticketNumber: created.ticketNumber,
        queueName: created.queueName,
        branchName: created.branchName,
        status: created.status,
        position: created.position,
        waitMinutes: created.waitMinutes,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join queue");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted" />
      </div>
    );
  }

  if (!queue) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <p className="text-sm text-muted">{error ?? "Queue not found"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface-elevated p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
            <span className="text-lg font-bold text-white">Q</span>
          </div>
          <h1 className="text-xl font-bold">{queue.name}</h1>
          <p className="mt-1 text-sm text-muted">{queue.branchName}</p>
          {!ticket && (
            <p className="mt-3 text-xs text-muted">
              {queue.waitingCount} people waiting
            </p>
          )}
        </div>

        {error && (
          <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {ticket ? (
          <TicketStatusCard ticket={ticket} />
        ) : (
          <form onSubmit={handleJoin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customer-name">Your name</Label>
              <Input
                id="customer-name"
                placeholder="Jane Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer-email">Email</Label>
              <Input
                id="customer-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer-phone">Phone (optional)</Label>
              <Input
                id="customer-phone"
                type="tel"
                placeholder="+1 555 000 0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              variant="gradient"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? "Joining..." : "Join queue"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
