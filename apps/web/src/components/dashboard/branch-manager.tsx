"use client";

import { useCallback, useEffect, useState } from "react";
import { Building2, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import type { Branch } from "@queueflow/shared";
import { BranchStatus, UserRole } from "@queueflow/shared";
import {
  createBranch,
  deleteBranch,
  getBranches,
  updateBranch,
} from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

function statusVariant(status: string) {
  return status === "active" ? "success" : "default";
}

export function BranchManager() {
  const { auth, refresh } = useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const canManage =
    auth?.user.role === UserRole.OWNER || auth?.user.role === UserRole.ADMIN;

  const loadBranches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBranches();
      setBranches(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load branches");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBranches();
  }, [loadBranches]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setSaving(true);
    setError(null);
    try {
      const branch = await createBranch({ name: newName.trim() });
      setBranches((prev) => [...prev, branch]);
      setNewName("");
      setShowCreate(false);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create branch");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateName = async (id: string) => {
    if (!editName.trim()) return;

    setSaving(true);
    setError(null);
    try {
      const updated = await updateBranch(id, { name: editName.trim() });
      setBranches((prev) => prev.map((b) => (b.id === id ? updated : b)));
      setEditingId(null);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update branch");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (branch: Branch) => {
    const nextStatus =
      branch.status === BranchStatus.ACTIVE
        ? BranchStatus.INACTIVE
        : BranchStatus.ACTIVE;

    setSaving(true);
    setError(null);
    try {
      const updated = await updateBranch(branch.id, { status: nextStatus });
      setBranches((prev) =>
        prev.map((b) => (b.id === branch.id ? updated : b))
      );
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (branch: Branch) => {
    if (!confirm(`Delete "${branch.name}"? This cannot be undone.`)) return;

    setSaving(true);
    setError(null);
    try {
      await deleteBranch(branch.id);
      setBranches((prev) => prev.filter((b) => b.id !== branch.id));
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete branch");
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
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted">
            {branches.length} location{branches.length === 1 ? "" : "s"}
          </p>
        </div>
        {canManage && (
          <Button
            variant="gradient"
            size="sm"
            onClick={() => setShowCreate((v) => !v)}
            disabled={saving}
          >
            <Plus className="h-4 w-4" />
            Add branch
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
          className="mb-6 rounded-xl border border-border bg-surface-elevated p-4"
        >
          <Label htmlFor="new-branch-name" className="mb-2 block">
            Branch name
          </Label>
          <div className="flex gap-2">
            <Input
              id="new-branch-name"
              placeholder="e.g. Downtown Clinic"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              disabled={saving}
            />
            <Button type="submit" disabled={saving || !newName.trim()}>
              {saving ? "Saving..." : "Create"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowCreate(false);
                setNewName("");
              }}
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {branches.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
          <Building2 className="mb-3 h-10 w-10 text-muted" />
          <p className="text-sm font-medium">No branches yet</p>
          <p className="mt-1 text-xs text-muted">
            Add your first location to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="flex flex-col gap-4 rounded-xl border border-border bg-surface-elevated p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                {editingId === branch.id ? (
                  <div className="flex gap-2">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      disabled={saving}
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={() => handleUpdateName(branch.id)}
                      disabled={saving || !editName.trim()}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingId(null)}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-semibold">
                        {branch.name}
                      </h3>
                      <Badge variant={statusVariant(branch.status)}>
                        {branch.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted">
                      Added {new Date(branch.createdAt).toLocaleDateString()}
                    </p>
                  </>
                )}
              </div>

              {canManage && editingId !== branch.id && (
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingId(branch.id);
                      setEditName(branch.name);
                    }}
                    disabled={saving}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Rename
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleStatus(branch)}
                    disabled={saving}
                  >
                    {branch.status === "active" ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={cn(
                      "text-red-400 hover:text-red-300",
                      branches.length <= 1 && "hidden"
                    )}
                    onClick={() => handleDelete(branch)}
                    disabled={saving || branches.length <= 1}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
