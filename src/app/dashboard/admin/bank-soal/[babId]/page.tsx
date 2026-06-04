import { prisma } from "@/lib/prisma";
import { createSoal } from "@/app/actions/ujian";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DeleteSoalButton from "@/components/DeleteSoalButton";

export default async function KelolaSoalPage({ params }: { params: Promise<{ babId: string }> }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (role !== "ADMIN" && role !== "GURU") redirect("/dashboard");

  const { babId } = await params;

  const bab = await prisma.bab.findUnique({
    where: { id: babId },
    include: {
      soal: {
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  if (!bab) return notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/admin/bank-soal" className="text-gray-400 hover:text-gray-600 text-xl">
          &larr;
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Kelola Soal: {bab.title}</h1>
          <p className="text-gray-500 mt-1">Total {bab.soal.length} soal tersimpan di bab ini.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Tambah Soal */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Tambah Soal Baru</h2>
            <form action={createSoal} className="space-y-4">
              <input type="hidden" name="babId" value={bab.id} />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pertanyaan</label>
                <textarea name="questionText" required rows={3} className="block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary" placeholder="Tulis pertanyaan di sini..."></textarea>
              </div>
              
              <div className="space-y-3 pt-2">
                <label className="block text-sm font-medium text-gray-700">Pilihan Jawaban</label>
                
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-gray-500 w-6 text-sm">A.</span>
                  <input type="text" name="optionA" required placeholder="Jawaban A" className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary" />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-gray-500 w-6 text-sm">B.</span>
                  <input type="text" name="optionB" required placeholder="Jawaban B" className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary" />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-gray-500 w-6 text-sm">C.</span>
                  <input type="text" name="optionC" required placeholder="Jawaban C" className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary" />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-gray-500 w-6 text-sm">D.</span>
                  <input type="text" name="optionD" required placeholder="Jawaban D" className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jawaban Benar</label>
                <select name="correctOption" required className="block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary">
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>

              <button type="submit" className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-medium hover:bg-primary-hover transition-colors mt-2">
                + Simpan Soal
              </button>
            </form>
          </div>
        </div>

        {/* Daftar Soal */}
        <div className="lg:col-span-2 space-y-4">
          {bab.soal.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              </div>
              <p className="text-gray-500 font-medium">Belum ada soal di bab ini.</p>
              <p className="text-gray-400 text-sm mt-1">Silakan buat soal pertama di form sebelah kiri.</p>
            </div>
          ) : (
            bab.soal.map((soal, index) => (
              <div key={soal.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative group">
                <DeleteSoalButton soalId={soal.id} babId={bab.id} />
                
                <h3 className="font-semibold text-gray-900 flex gap-2 pr-16">
                  <span className="text-gray-400">{index + 1}.</span> <span>{soal.questionText}</span>
                </h3>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className={`p-3 rounded-lg border ${soal.correctOption === 'A' ? 'bg-green-50 border-green-200 text-green-800 font-medium' : 'bg-gray-50 border-gray-100 text-gray-600'}`}>
                    <span className="font-bold mr-2">A.</span> {soal.optionA}
                  </div>
                  <div className={`p-3 rounded-lg border ${soal.correctOption === 'B' ? 'bg-green-50 border-green-200 text-green-800 font-medium' : 'bg-gray-50 border-gray-100 text-gray-600'}`}>
                    <span className="font-bold mr-2">B.</span> {soal.optionB}
                  </div>
                  <div className={`p-3 rounded-lg border ${soal.correctOption === 'C' ? 'bg-green-50 border-green-200 text-green-800 font-medium' : 'bg-gray-50 border-gray-100 text-gray-600'}`}>
                    <span className="font-bold mr-2">C.</span> {soal.optionC}
                  </div>
                  <div className={`p-3 rounded-lg border ${soal.correctOption === 'D' ? 'bg-green-50 border-green-200 text-green-800 font-medium' : 'bg-gray-50 border-gray-100 text-gray-600'}`}>
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
