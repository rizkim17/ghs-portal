import { prisma } from "@/lib/prisma";
import { createBab } from "@/app/actions/ujian";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DeleteBabButton from "@/components/DeleteBabButton";

export default async function BankSoalPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (role !== "ADMIN" && role !== "GURU") {
    redirect("/dashboard");
  }

  const babs = await prisma.bab.findMany({
    orderBy: { order: 'asc' },
    include: {
      _count: {
        select: { soal: true }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manajemen Bank Soal</h1>
          <p className="text-gray-500 mt-1">Kelola Bab materi dan daftar pertanyaan untuk ujian.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Tambah Bab Baru */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-foreground mb-4">Tambah Bab Baru</h2>
            <form action={createBab} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Bab</label>
                <input type="text" name="title" required placeholder="Bab 1: Dasar Hiragana" className="block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat</label>
                <textarea name="description" rows={2} placeholder="Deskripsi singkat isi bab..." className="block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Urutan (Level)</label>
                <input type="number" name="order" required defaultValue={babs.length + 1} className="block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary" />
              </div>
              <button type="submit" className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-medium hover:bg-primary-hover transition-colors">
                + Simpan Bab
              </button>
            </form>
          </div>
        </div>

        {/* Daftar Bab */}
        <div className="lg:col-span-2">
          {babs.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
              </div>
              <p className="text-gray-500 font-medium">Belum ada Bab yang dibuat.</p>
              <p className="text-gray-400 text-sm mt-1">Buat bab pertama menggunakan form di sebelah kiri.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urutan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bab</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total Soal</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {babs.map((bab) => (
                    <tr key={bab.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-lg text-sm font-bold">
                          {bab.order}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{bab.title}</div>
                        <div className="text-sm text-gray-500">{bab.description}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bab._count.soal > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'}`}>
                          {bab._count.soal} Soal
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium space-x-3">
                        <Link href={`/dashboard/admin/bank-soal/${bab.id}`} className="text-primary hover:text-primary-hover font-semibold">
                          Kelola Soal →
                        </Link>
                        <DeleteBabButton babId={bab.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
