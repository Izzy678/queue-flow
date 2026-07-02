"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { AuthBranch } from "@queueflow/shared";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function BranchGrid({
  branches,
  className,
}: {
  branches: AuthBranch[];
  className?: string;
}) {
  if (branches.length === 0) {
    return (
      <div
        className={cn(
          "rounded-xl border border-dashed border-border px-6 py-10 text-center",
          className
        )}
      >
        <p className="text-sm text-muted">No branches yet.</p>
        <Link
          href="/dashboard/branches"
          className="mt-2 inline-block text-sm text-accent hover:underline"
        >
          Add your first branch
        </Link>
      </div>
    );
  }

  return (
    <div className={cn("grid sm:grid-cols-2 border-t border-l border-border", className)}>
      {branches.map((branch) => (
        <Link
          key={branch.id}
          href="/dashboard/branches"
          className="group border-r border-b border-border p-6 transition-colors hover:bg-surface-hover/50"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold group-hover:text-accent transition-colors">
                {branch.name}
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Queue stats available once queues are set up
              </p>
            </div>
            <Badge variant={branch.status === "active" ? "success" : "default"}>
              {branch.status}
            </Badge>
          </div>

          <div className="mt-4 flex items-center gap-1 text-xs text-muted group-hover:text-accent transition-colors">
            Manage branch
            <ArrowRight className="h-3 w-3" />
          </div>
        </Link>
      ))}
    </div>
  );
}
