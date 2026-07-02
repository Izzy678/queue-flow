"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Trash2, Users } from "lucide-react";
import type { Branch, TeamMember } from "@queueflow/shared";
import { UserRole } from "@queueflow/shared";
import {
  createTeamMember,
  deleteTeamMember,
  getBranches,
  getTeamMembers,
  updateTeamMember,
} from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { cn } from "@/lib/utils";

function roleLabel(role: UserRole) {
  switch (role) {
    case UserRole.OWNER:
      return "Owner";
    case UserRole.ADMIN:
      return "Admin";
    default:
      return "Staff";
  }
}

function roleVariant(role: UserRole) {
  switch (role) {
    case UserRole.OWNER:
      return "accent";
    case UserRole.ADMIN:
      return "warning";
    default:
      return "default";
  }
}

export function TeamManager() {
  const { auth } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    password: "",
    role: UserRole.STAFF as UserRole.ADMIN | UserRole.STAFF,
    branchIds: [] as string[],
  });

  const [editForm, setEditForm] = useState({
    name: "",
    role: UserRole.STAFF as UserRole.ADMIN | UserRole.STAFF,
    branchIds: [] as string[],
  });

  const isOwner = auth?.user.role === UserRole.OWNER;
  const canManage =
    auth?.user.role === UserRole.OWNER || auth?.user.role === UserRole.ADMIN;

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [team, branchList] = await Promise.all([
        getTeamMembers(),
        getBranches(),
      ]);
      setMembers(team);
      setBranches(branchList);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load team");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const branchName = (id: string) =>
    branches.find((branch) => branch.id === id)?.name ?? "Unknown";

  const toggleBranch = (
    branchId: string,
    selected: string[],
    setter: (ids: string[]) => void
  ) => {
    if (selected.includes(branchId)) {
      setter(selected.filter((id) => id !== branchId));
    } else {
      setter([...selected, branchId]);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const member = await createTeamMember({
        ...createForm,
        branchIds:
          createForm.branchIds.length > 0 ? createForm.branchIds : undefined,
      });
      setMembers((prev) => [...prev, member]);
      setCreateForm({
        name: "",
        email: "",
        password: "",
        role: UserRole.STAFF,
        branchIds: [],
      });
      setShowCreate(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add team member");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setEditForm({
      name: member.name,
      role:
        member.role === UserRole.ADMIN ? UserRole.ADMIN : UserRole.STAFF,
      branchIds: member.branchIds ?? [],
    });
  };

  const handleUpdate = async (id: string) => {
    setSaving(true);
    setError(null);
    try {
      const updated = await updateTeamMember(id, {
        name: editForm.name.trim(),
        role: editForm.role,
        branchIds: editForm.branchIds,
      });
      setMembers((prev) => prev.map((m) => (m.id === id ? updated : m)));
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update member");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (member: TeamMember) => {
    if (!confirm(`Remove ${member.name} from the team?`)) return;

    setSaving(true);
    setError(null);
    try {
      await deleteTeamMember(member.id);
      setMembers((prev) => prev.filter((m) => m.id !== member.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove member");
    } finally {
      setSaving(false);
    }
  };

  const canModifyMember = (member: TeamMember) => {
    if (!canManage) return false;
    if (member.role === UserRole.OWNER) return false;
    if (member.id === auth?.user.id) return false;
    if (!isOwner && member.role === UserRole.ADMIN) return false;
    return true;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-5 w-5 animate-spin text-muted" />
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-border bg-surface-elevated p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft">
            <Users className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">Team</h2>
            <p className="text-xs text-muted">
              {members.length} member{members.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
        {canManage && (
          <Button
            variant="gradient"
            size="sm"
            onClick={() => setShowCreate((v) => !v)}
            disabled={saving}
          >
            <Plus className="h-4 w-4" />
            Add member
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
          className="mb-6 space-y-4 rounded-lg border border-border p-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="member-name">Name</Label>
              <Input
                id="member-name"
                value={createForm.name}
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, name: e.target.value }))
                }
                required
                disabled={saving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="member-email">Email</Label>
              <Input
                id="member-email"
                type="email"
                value={createForm.email}
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, email: e.target.value }))
                }
                required
                disabled={saving}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="member-password">Temporary password</Label>
              <PasswordInput
                id="member-password"
                value={createForm.password}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                minLength={8}
                required
                disabled={saving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="member-role">Role</Label>
              <select
                id="member-role"
                value={createForm.role}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    role: e.target.value as UserRole.ADMIN | UserRole.STAFF,
                  }))
                }
                disabled={saving || !isOwner}
                className="flex h-10 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              >
                <option value={UserRole.STAFF}>Staff</option>
                {isOwner && <option value={UserRole.ADMIN}>Admin</option>}
              </select>
            </div>
          </div>

          {branches.length > 0 && (
            <div className="space-y-2">
              <Label>Assigned branches</Label>
              <div className="flex flex-wrap gap-2">
                {branches.map((branch) => (
                  <button
                    key={branch.id}
                    type="button"
                    disabled={saving}
                    onClick={() =>
                      toggleBranch(
                        branch.id,
                        createForm.branchIds,
                        (branchIds) =>
                          setCreateForm((prev) => ({ ...prev, branchIds }))
                      )
                    }
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs transition-colors",
                      createForm.branchIds.includes(branch.id)
                        ? "border-accent bg-accent-soft text-foreground"
                        : "border-border text-muted hover:border-border-strong"
                    )}
                  >
                    {branch.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Adding..." : "Add member"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreate(false)}
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="rounded-lg border border-border p-4"
          >
            {editingId === member.id ? (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      disabled={saving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <select
                      value={editForm.role}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          role: e.target.value as UserRole.ADMIN | UserRole.STAFF,
                        }))
                      }
                      disabled={saving || !isOwner}
                      className="flex h-10 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                    >
                      <option value={UserRole.STAFF}>Staff</option>
                      {isOwner && (
                        <option value={UserRole.ADMIN}>Admin</option>
                      )}
                    </select>
                  </div>
                </div>

                {branches.length > 0 && (
                  <div className="space-y-2">
                    <Label>Assigned branches</Label>
                    <div className="flex flex-wrap gap-2">
                      {branches.map((branch) => (
                        <button
                          key={branch.id}
                          type="button"
                          disabled={saving}
                          onClick={() =>
                            toggleBranch(
                              branch.id,
                              editForm.branchIds,
                              (branchIds) =>
                                setEditForm((prev) => ({ ...prev, branchIds }))
                            )
                          }
                          className={cn(
                            "rounded-full border px-3 py-1 text-xs transition-colors",
                            editForm.branchIds.includes(branch.id)
                              ? "border-accent bg-accent-soft text-foreground"
                              : "border-border text-muted hover:border-border-strong"
                          )}
                        >
                          {branch.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleUpdate(member.id)}
                    disabled={saving || !editForm.name.trim()}
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
              </div>
            ) : (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{member.name}</p>
                    <Badge variant={roleVariant(member.role)}>
                      {roleLabel(member.role)}
                    </Badge>
                    {member.id === auth?.user.id && (
                      <Badge variant="default">You</Badge>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted">{member.email}</p>
                  {member.branchIds && member.branchIds.length > 0 ? (
                    <p className="mt-2 text-xs text-muted">
                      Branches:{" "}
                      {member.branchIds.map(branchName).join(", ")}
                    </p>
                  ) : (
                    <p className="mt-2 text-xs text-muted">
                      All branches (no restriction)
                    </p>
                  )}
                </div>

                {canModifyMember(member) && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(member)}
                      disabled={saving}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-400 hover:text-red-300"
                      onClick={() => handleDelete(member)}
                      disabled={saving}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
