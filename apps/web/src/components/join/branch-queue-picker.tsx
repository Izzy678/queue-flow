"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, Ticket } from "lucide-react";
import type { PublicBranchLanding, PublicTicketStatus } from "@queueflow/shared";
import { TicketStatus } from "@queueflow/shared";
import {
  getPublicBranchLanding,
  getPublicTicket,
  joinPublicQueue,
} from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function BranchQueuePicker({
  tenantSlug,
  branchSlug,
}: {
  tenantSlug: string;
  branchSlug: string;
}) {
  const searchParams = useSearchParams();
  const token = searchParams.get("t") ?? "";

  const [landing, setLanding] = useState<PublicBranchLanding | null>(null);
  const [selectedQueueId, setSelectedQueueId] = useState<string | null>(null);
  const [ticket, setTicket] = useState<PublicTicketStatus | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLanding = useCallback(async () => {
    if (!token) {
      setError("Invalid link. Please scan the QR code at the branch.");
      setLoading(false);
      return;
    }

    try {
      const data = await getPublicBranchLanding(tenantSlug, branchSlug, token);
      setLanding(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "This QR code has expired. Please scan the code on the screen at the branch."
      );
    } finally {
      setLoading(false);
    }
  }, [tenantSlug, branchSlug, token]);

  useEffect(() => {
    loadLanding();
  }, [loadLanding]);

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
    if (!selectedQueueId || !token) return;

    setSubmitting(true);
    setError(null);
    try {
      const created = await joinPublicQueue(selectedQueueId, {
        customerName: name.trim(),
        customerEmail: email.trim(),
        customerPhone: phone.trim() || undefined,
        joinToken: token,
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
      setSelectedQueueId(null);
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

  if (ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12">
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
              You are <span className="text-foreground font-medium">#{ticket.position}</span> in line
            </p>
          )}
          <p className="text-xs text-muted leading-relaxed">
            Tip: Take a screenshot of your ticket — staff may ask to see it for verification at the counter.
          </p>
          {(ticket.status === TicketStatus.CALLED ||
            ticket.status === TicketStatus.SERVING) && (
            <div className="flex items-center justify-center gap-2 text-success text-sm">
              <CheckCircle2 className="h-4 w-4" />
              Please proceed to the counter
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-surface-elevated p-8 shadow-xl">
        {error && !landing ? (
          <div className="text-center space-y-3">
            <p className="text-sm text-red-400">{error}</p>
            <p className="text-xs text-muted">
              Scan the QR code displayed on the screen at the branch to join a queue.
            </p>
          </div>
        ) : landing ? (
          <>
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                <span className="text-lg font-bold text-white">Q</span>
              </div>
              <h1 className="text-xl font-bold">{landing.tenantName}</h1>
              <p className="mt-1 text-sm text-muted">{landing.branchName}</p>
              <p className="mt-2 text-xs text-muted">Choose a queue to join</p>
            </div>

            {error && (
              <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </p>
            )}

            {selectedQueueId ? (
              <form onSubmit={handleJoin} className="space-y-4">
                <p className="text-sm font-medium">
                  Joining:{" "}
                  {landing.queues.find((q) => q.id === selectedQueueId)?.name}
                </p>
                <div className="space-y-2">
                  <Label htmlFor="customer-name">Your name</Label>
                  <Input
                    id="customer-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-email">Email</Label>
                  <Input
                    id="customer-email"
                    type="email"
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
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" variant="gradient" disabled={submitting}>
                    {submitting ? "Joining..." : "Get ticket"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedQueueId(null)}
                  >
                    Back
                  </Button>
                </div>
              </form>
            ) : landing.queues.length === 0 ? (
              <p className="text-center text-sm text-muted">
                No active queues at this branch right now.
              </p>
            ) : (
              <div className="space-y-3">
                {landing.queues.map((queue) => (
                  <button
                    key={queue.id}
                    type="button"
                    onClick={() => setSelectedQueueId(queue.id)}
                    className="flex w-full items-center justify-between rounded-xl border border-border bg-surface/50 p-4 text-left transition-colors hover:border-accent/50 hover:bg-surface-hover"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-3 w-3 rounded-full shrink-0"
                        style={{ backgroundColor: queue.color }}
                      />
                      <div>
                        <p className="text-sm font-semibold">{queue.name}</p>
                        <p className="text-xs text-muted">
                          {queue.waitingCount} waiting · {queue.servingCount} being served
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-accent">Join</span>
                  </button>
                ))}
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
