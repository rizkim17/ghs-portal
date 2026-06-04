import { prisma } from "@/lib/prisma";
import { createBab, deleteBab } from "@/app/actions/ujian";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

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
                <label className="block text-sm font-medium text-gray-700">Judul Bab</label>
                <input type="text" name="title" required placeholder="Bab 1: Dasar Hiragana" className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Deskripsi Singkat</label>
                <textarea name="description" rows={2} className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Urutan (Level)</label>
                <input type="number" name="order" required defaultValue={babs.length + 1} className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary" />
              </div>
              <button type="submit" className="w-full bg-primary text-white py-2 rounded-xl text-sm font-medium hover:bg-primary-hover transition-colors">
                Simpan Bab
              </button>
            </form>
          </div>
        </div>

        {/* Daftar Bab */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bab</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total Soal</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {babs.map((bab) => (
                  <tr key={bab.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{bab.title}</div>
                      <div className="text-sm text-gray-500">{bab.description}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {bab._count.soal} Soal
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium space-x-3">
                      <Link href={`/dashboard/admin/bank-soal/${bab.id}`} className="text-primary hover:text-primary-hover">
                        Kelola Soal
                      </Link>
                      <form action={async () => { "use server"; await deleteBab(bab.id); }} className="inline-block">
                        <button type="submit" className="text-red-600 hover:text-red-900" onClick={() => confirm('Hapus bab ini?')}>Hapus</button>
                      </form>
                    </td>
                  </tr>
                ))}
                {babs.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500 text-sm">
                      Belum ada Bab yang dibuat.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
