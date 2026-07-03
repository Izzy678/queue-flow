"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ListOrdered, Loader2, Plus, Trash2 } from "lucide-react";
import type { Branch, Queue } from "@queueflow/shared";
import { UserRole } from "@queueflow/shared";
import {
  createQueue,
  deleteQueue,
  getBranches,
  getQueues,
} from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const COLOR_PRESETS = ["#6366f1", "#f59e0b", "#22c55e", "#8b5cf6", "#ec4899"];

export function QueueManager() {
  const { auth } = useAuth();
  const [queues, setQueues] = useState<Queue[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    branchId: "",
    name: "",
    prefix: "",
    color: COLOR_PRESETS[0],
  });

  const canManage =
    auth?.user.role === UserRole.OWNER || auth?.user.role === UserRole.ADMIN;

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [queueList, branchList] = await Promise.all([
        getQueues(branchFilter === "all" ? undefined : branchFilter),
        getBranches(),
      ]);
      setQueues(queueList);
      setBranches(branchList);
      if (!form.branchId && branchList[0]) {
        setForm((prev) => ({ ...prev, branchId: branchList[0].id }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load queues");
    } finally {
      setLoading(false);
    }
  }, [branchFilter, form.branchId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const queue = await createQueue({
        branchId: form.branchId,
        name: form.name.trim(),
        prefix: form.prefix.toUpperCase(),
        color: form.color,
      });
      setQueues((prev) => [...prev, queue]);
      setForm((prev) => ({ ...prev, name: "", prefix: "" }));
      setShowCreate(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create queue");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (queue: Queue) => {
    if (!confirm(`Delete queue "${queue.name}"?`)) return;
    setSaving(true);
    setError(null);
    try {
      await deleteQueue(queue.id);
      setQueues((prev) => prev.filter((q) => q.id !== queue.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete queue");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-muted" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="h-9 rounded-lg border border-border bg-surface px-3 text-sm"
          >
            <option value="all">All branches</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>
        {canManage && (
          <Button
            variant="gradient"
            size="sm"
            onClick={() => setShowCreate((v) => !v)}
            disabled={saving || branches.length === 0}
          >
            <Plus className="h-4 w-4" />
            Add queue
          </Button>
        )}
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      {showCreate && canManage && (
        <form
          onSubmit={handleCreate}
          className="mb-6 space-y-4 rounded-xl border border-border bg-surface-elevated p-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Branch</Label>
              <select
                value={form.branchId}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, branchId: e.target.value }))
                }
                className="flex h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm"
                required
              >
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="queue-name">Queue name</Label>
              <Input
                id="queue-name"
                placeholder="General"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="queue-prefix">Ticket prefix</Label>
              <Input
                id="queue-prefix"
                placeholder="A"
                value={form.prefix}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    prefix: e.target.value.toUpperCase().slice(0, 3),
                  }))
                }
                maxLength={3}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, color }))}
                    className={cn(
                      "h-8 w-8 rounded-full border-2 transition-transform",
                      form.color === color
                        ? "border-white scale-110"
                        : "border-transparent"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Creating..." : "Create queue"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreate(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {queues.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
          <ListOrdered className="mb-3 h-10 w-10 text-muted" />
          <p className="text-sm font-medium">No queues yet</p>
          <p className="mt-1 text-xs text-muted">
            Create a queue to start serving customers.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {queues.map((queue) => (
            <div
              key={queue.id}
              className="flex flex-col gap-4 rounded-xl border border-border bg-surface-elevated p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: queue.color }}
                  />
                  <h3 className="truncate text-sm font-semibold">{queue.name}</h3>
                  <Badge variant={queue.status === "active" ? "success" : "default"}>
                    {queue.status}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted">
                  {queue.branchName} · Prefix {queue.prefix} · {queue.waitingCount}{" "}
                  waiting · {queue.servingCount} serving
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/dashboard/queues/${queue.id}`}>
                  <Button size="sm" variant="gradient">
                    Open monitor
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Link href={`/dashboard/branches/${queue.branchId}/display`}>
                  <Button size="sm" variant="outline">
                    Lobby display
                  </Button>
                </Link>
                {canManage && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-400"
                    onClick={() => handleDelete(queue)}
                    disabled={saving}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
