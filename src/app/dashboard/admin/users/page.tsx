import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";
import CreateUserForm from "@/components/admin/CreateUserForm";
import UserTable from "@/components/admin/UserTable";

export default async function ManageUsersPage() {
  const session = await requireRole("SUPERADMIN");
  const currentUserId = (session.user as any)?.id;

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      nik: true,
      role: true,
      createdAt: true,
    }
  });

  // Serialize date for client component
  const serializedUsers = users.map(u => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Manajemen Akun Pengguna</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">Buat, hapus, dan kelola akun siswa, guru, serta admin.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CreateUserForm />
        </div>

        <div className="lg:col-span-2">
          <UserTable users={serializedUsers} currentUserId={currentUserId} />
        </div>
      </div>
    </div>
  );
}
