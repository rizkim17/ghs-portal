import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const role = (session.user as any)?.role;

  return (
    <div className="min-h-screen bg-surface-muted flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-6">
          <Link href="/dashboard" className="text-2xl font-bold text-foreground">
            Portal <span className="text-primary">Siswa</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <Link href="/dashboard" className="block px-4 py-3 rounded-xl hover:bg-primary/5 text-gray-700 hover:text-primary transition-colors font-medium">
            Dashboard Utama
          </Link>

          {/* Menu Khusus Admin / Guru */}
          {(role === "ADMIN" || role === "GURU") && (
            <>
              <div className="pt-4 pb-2">
                <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu Pengajar</p>
              </div>
              <Link href="/dashboard/admin/bank-soal" className="block px-4 py-3 rounded-xl hover:bg-primary/5 text-gray-700 hover:text-primary transition-colors font-medium">
                Manajemen Ujian
              </Link>
            </>
          )}

          {/* Menu Khusus Siswa */}
          {role === "SISWA" && (
            <>
              <div className="pt-4 pb-2">
                <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu Siswa</p>
              </div>
              <Link href="/dashboard/ujian" className="block px-4 py-3 rounded-xl hover:bg-primary/5 text-gray-700 hover:text-primary transition-colors font-medium">
                Ujian Online
              </Link>
              <Link href="/dashboard/biodata" className="block px-4 py-3 rounded-xl hover:bg-primary/5 text-gray-700 hover:text-primary transition-colors font-medium">
                Data CV Jepang
              </Link>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="px-4 py-3 bg-gray-50 rounded-xl">
            <p className="text-sm font-medium text-gray-900 truncate">{session.user?.name}</p>
            <p className="text-xs text-gray-500">{role}</p>
          </div>
          <Link href="/api/auth/signout" className="mt-2 block w-full text-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium">
            Keluar
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
