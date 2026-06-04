import { prisma } from "@/lib/prisma";
import { createSoal, deleteSoal } from "@/app/actions/ujian";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function KelolaSoalPage({ params }: { params: { babId: string } }) {
  const bab = await prisma.bab.findUnique({
    where: { id: params.babId },
    include: {
      soal: true
    }
  });

  if (!bab) return notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/admin/bank-soal" className="text-gray-400 hover:text-gray-600">
          &larr; Kembali
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Kelola Soal: {bab.title}</h1>
          <p className="text-gray-500 mt-1">Total {bab.soal.length} soal tersimpan di bab ini.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Tambah Soal */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-foreground mb-4">Tambah Soal Baru</h2>
            <form action={createSoal} className="space-y-4">
              <input type="hidden" name="babId" value={bab.id} />
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Pertanyaan</label>
                <textarea name="questionText" required rows={3} className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary"></textarea>
              </div>
              
              <div className="space-y-3 pt-2">
                <label className="block text-sm font-medium text-gray-700">Pilihan Jawaban</label>
                
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-gray-500 w-6">A.</span>
                  <input type="text" name="optionA" required className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary" />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-gray-500 w-6">B.</span>
                  <input type="text" name="optionB" required className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary" />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-gray-500 w-6">C.</span>
                  <input type="text" name="optionC" required className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary" />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-gray-500 w-6">D.</span>
                  <input type="text" name="optionD" required className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Jawaban Benar</label>
                <select name="correctOption" required className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary">
                  <option value="A">Jawaban A</option>
                  <option value="B">Jawaban B</option>
                  <option value="C">Jawaban C</option>
                  <option value="D">Jawaban D</option>
                </select>
              </div>

              <button type="submit" className="w-full bg-primary text-white py-2 rounded-xl text-sm font-medium hover:bg-primary-hover transition-colors mt-4">
                Simpan Soal
              </button>
            </form>
          </div>
        </div>

        {/* Daftar Soal */}
        <div className="lg:col-span-2 space-y-4">
          {bab.soal.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center text-gray-500">
              Belum ada soal di bab ini. Silakan buat soal pertama di form samping.
            </div>
          ) : (
            bab.soal.map((soal, index) => (
              <div key={soal.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative group">
                <form action={async () => { "use server"; await deleteSoal(soal.id, bab.id); }} className="absolute top-4 right-4 hidden group-hover:block">
                  <button type="submit" onClick={() => confirm('Hapus soal ini?')} className="text-red-500 hover:text-red-700 text-sm font-medium">
                    Hapus
                  </button>
                </form>
                
                <h3 className="font-semibold text-gray-900 flex gap-2">
                  <span>{index + 1}.</span> <span>{soal.questionText}</span>
                </h3>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className={`p-3 rounded-lg border ${soal.correctOption === 'A' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-gray-50 border-gray-100 text-gray-600'}`}>
                    <span className="font-bold mr-2">A.</span> {soal.optionA}
                  </div>
                  <div className={`p-3 rounded-lg border ${soal.correctOption === 'B' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-gray-50 border-gray-100 text-gray-600'}`}>
                    <span className="font-bold mr-2">B.</span> {soal.optionB}
                  </div>
                  <div className={`p-3 rounded-lg border ${soal.correctOption === 'C' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-gray-50 border-gray-100 text-gray-600'}`}>
                    <span className="font-bold mr-2">C.</span> {soal.optionC}
                  </div>
                  <div className={`p-3 rounded-lg border ${soal.correctOption === 'D' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-gray-50 border-gray-100 text-gray-600'}`}>
                    <span className="font-bold mr-2">D.</span> {soal.optionD}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
