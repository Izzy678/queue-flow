import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { GuestGuard } from "@/components/auth/guest-guard";

export const metadata = {
  title: "Sign in — QueueFlow",
};

export default function LoginPage() {
  return (
    <Suspense>
      <GuestGuard>
        <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col justify-between border-r border-border bg-surface p-10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <span className="text-sm font-bold text-white">Q</span>
          </div>
          <span className="text-lg font-semibold tracking-tight">QueueFlow</span>
        </Link>

        <div>
          <h2 className="text-3xl font-bold tracking-tight leading-tight mb-4">
            Manage every queue
            <br />
            <span className="gradient-text">from one place.</span>
          </h2>
          <p className="text-muted leading-relaxed max-w-md">
            Monitor live queues, call the next customer, and track performance
            across all your branches in real time.
          </p>
        </div>

        <p className="text-xs text-muted">
          &copy; {new Date().getFullYear()} QueueFlow
        </p>
      </div>

      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2.5 mb-8">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                <span className="text-sm font-bold text-white">Q</span>
              </div>
              <span className="text-lg font-semibold tracking-tight">QueueFlow</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight mb-2">Welcome back</h1>
            <p className="text-sm text-muted">
              Sign in to your staff dashboard
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
        </div>
      </GuestGuard>
    </Suspense>
  );
}
