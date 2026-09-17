import { getRequiredSession } from "@/lib/auth-guard";
import Sidebar from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getRequiredSession();
  const role = (session.user as any)?.role;

  return (
    <div className="min-h-screen bg-surface-muted flex flex-col lg:flex-row">
      <Sidebar role={role} userName={session.user?.name || ""} />

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
