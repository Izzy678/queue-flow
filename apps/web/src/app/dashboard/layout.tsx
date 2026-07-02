import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-background">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
      </div>
    </AuthGuard>
  );
}
