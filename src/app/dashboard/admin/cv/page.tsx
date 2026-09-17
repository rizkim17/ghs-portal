import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";

export default async function AdminCVPage() {
  await requireRole("SUPERADMIN", "GURU");

  // Ambil semua data user (hanya siswa) beserta biodata mereka
  const students = await prisma.user.findMany({
    where: { role: "SISWA" },
    include: { biodata: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Data CV Siswa</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">Kelola data rirekisho (CV Jepang) seluruh siswa.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Siswa</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status Biodata</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">L/P</th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => {
                const hasBiodata = !!student.biodata;
                return (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      <div className="text-xs text-gray-500">{student.email || student.nik}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {hasBiodata ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                          Sudah Diisi
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                          Belum Diisi
                        </span>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {hasBiodata ? student.biodata?.gender || "-" : "-"}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                      {hasBiodata ? (
                        <span className="text-primary hover:text-primary-hover font-semibold cursor-pointer">
                          Export Rirekisho (PDF)
                        </span>
                      ) : (
                        <span className="text-gray-300">Belum bisa diexport</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {students.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500 text-sm">
                    Belum ada siswa yang terdaftar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
