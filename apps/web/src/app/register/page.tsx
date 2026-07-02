import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata = {
  title: "Create account — QueueFlow",
};

export default function RegisterPage() {
  return (
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
            Start managing queues
            <br />
            <span className="gradient-text">in minutes.</span>
          </h2>
          <p className="text-muted leading-relaxed max-w-md">
            Whether you run one location or many branches, QueueFlow gives you
            a single place to monitor queues and serve customers faster.
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
            <h1 className="text-2xl font-bold tracking-tight mb-2">Create your account</h1>
            <p className="text-sm text-muted">
              Set up your workspace and first branch
            </p>
          </div>

          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
