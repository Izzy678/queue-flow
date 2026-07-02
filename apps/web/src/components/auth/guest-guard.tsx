"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export function GuestGuard({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/dashboard";

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(redirect);
    }
  }, [isLoading, isAuthenticated, redirect, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return children;
}
