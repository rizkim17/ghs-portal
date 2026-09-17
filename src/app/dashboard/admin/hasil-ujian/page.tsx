import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-guard";

export default async function HasilUjianPage() {
  await requireRole("SUPERADMIN", "GURU");

  const results = await prisma.nilaiUjian.findMany({
    include: {
      user: { select: { name: true, email: true, nik: true } },
      bab: { select: { title: true, order: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Hasil Ujian Siswa</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">Pantau progress dan nilai ujian seluruh siswa.</p>
      </div>

      {results.length === 0 ? (
        <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </div>
          <p className="text-gray-500 font-medium">Belum ada siswa yang mengerjakan ujian.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Siswa</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Bab Ujian</th>
                  <th className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Nilai</th>
                  <th className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Waktu</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{r.user.name}</div>
                      <div className="text-xs text-gray-500">{r.user.email || r.user.nik}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{r.bab.title}</td>
                    <td className="px-4 sm:px-6 py-4 text-center whitespace-nowrap">
                      <span className={`text-xl sm:text-2xl font-bold ${r.score >= 70 ? 'text-green-700' : 'text-red-600'}`}>
                        {r.score}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center whitespace-nowrap">
                      {r.isPassed ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                          ✓ Lulus
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-600">
                          ✗ Belum Lulus
                        </span>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right text-xs text-gray-400 whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
