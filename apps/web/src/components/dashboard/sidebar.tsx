"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/branches", label: "Branches", icon: Building2 },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { auth, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
          <span className="text-sm font-bold text-white">Q</span>
        </div>
        <span className="text-sm font-semibold tracking-tight">QueueFlow</span>
      </div>

      <nav className="flex-1 space-y-0.5 p-3">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent-soft text-foreground"
                  : "text-muted hover:bg-surface-hover hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <div className="mb-3 rounded-lg border border-border bg-surface-elevated px-3 py-2.5">
          <p className="text-xs text-muted">Signed in as</p>
          <p className="truncate text-sm font-medium">
            {auth?.user.email ?? "Loading..."}
          </p>
          <p className="truncate text-xs text-muted">
            {auth?.tenant.name ?? ""}
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}

export function DashboardTopbar({ title, description }: { title: string; description?: string }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-6">
      <div>
        <h1 className="text-sm font-semibold">{title}</h1>
        {description && (
          <p className="text-xs text-muted">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-elevated px-3 py-1.5 text-xs">
        <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
        <span className="text-muted">All systems live</span>
        <ChevronRight className="h-3 w-3 text-muted" />
      </div>
    </header>
  );
}
