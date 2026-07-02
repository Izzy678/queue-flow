import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { dashboardBranches } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

export function BranchGrid({ className }: { className?: string }) {
  return (
    <div className={cn("grid sm:grid-cols-2 border-t border-l border-border", className)}>
      {dashboardBranches.map((branch) => (
        <Link
          key={branch.id}
          href={`/dashboard/branches`}
          className="group border-r border-b border-border p-6 transition-colors hover:bg-surface-hover/50"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold group-hover:text-accent transition-colors">
                {branch.name}
              </h3>
              <p className="text-xs text-muted mt-0.5">
                {branch.queues} queues · {branch.waiting} waiting
              </p>
            </div>
            <Badge variant={branch.status === "busy" ? "warning" : "success"}>
              {branch.status}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-lg font-bold">{branch.queues}</p>
              <p className="text-[10px] text-muted uppercase tracking-wider">Queues</p>
            </div>
            <div>
              <p className="text-lg font-bold">{branch.served}</p>
              <p className="text-[10px] text-muted uppercase tracking-wider">Served</p>
            </div>
            <div>
              <p className="text-lg font-bold">{branch.avgWait}</p>
              <p className="text-[10px] text-muted uppercase tracking-wider">Avg wait</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1 text-xs text-muted group-hover:text-accent transition-colors">
            View branch
            <ArrowRight className="h-3 w-3" />
          </div>
        </Link>
      ))}
    </div>
  );
}
