"use client";

import { useCallback, useEffect, useState } from "react";
import { Building2, Loader2 } from "lucide-react";
import { TenantType, UserRole } from "@queueflow/shared";
import { getTenant, updateTenant } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const tenantTypeLabels: Record<TenantType, string> = {
  [TenantType.ORGANIZATION]: "Multiple branches",
  [TenantType.STANDALONE_LOCATION]: "Single location",
};

export function OrganizationSettings() {
  const { auth, refresh } = useAuth();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState<TenantType | "">("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const canEdit = auth?.user.role === UserRole.OWNER;

  const loadTenant = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const tenant = await getTenant();
      setName(tenant.name);
      setSlug(tenant.slug);
      setType(tenant.type);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load organization");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTenant();
  }, [loadTenant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit || !name.trim()) return;

    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const tenant = await updateTenant({ name: name.trim() });
      setName(tenant.name);
      await refresh();
      setSuccess("Organization updated");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update organization");
    } finally {
      setSaving(false);
    }
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
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft">
          <Building2 className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-sm font-semibold">Organization</h2>
          <p className="text-xs text-muted">
            Workspace profile and account type
          </p>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}
      {success && (
        <p className="mb-4 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
          {success}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="org-name">Organization name</Label>
          <Input
            id="org-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!canEdit || saving}
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="org-slug">Workspace slug</Label>
            <Input id="org-slug" value={slug} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="org-type">Account type</Label>
            <Input
              id="org-type"
              value={type ? tenantTypeLabels[type] : ""}
              disabled
            />
          </div>
        </div>

        {canEdit ? (
          <Button type="submit" disabled={saving || !name.trim()}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        ) : (
          <p className="text-xs text-muted">
            Only the workspace owner can update organization settings.
          </p>
        )}
      </form>
    </section>
  );
}
