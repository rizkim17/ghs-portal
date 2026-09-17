import { requireRole } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import { createSoal } from '@/actions/soal';
import { SECTION_TYPE_LABELS } from '@/constants/exam';
import Link from 'next/link';
import DeleteSoalButton from '@/components/admin/DeleteSoalButton';
import EditSoalModal from '@/components/admin/EditSoalModal';

export default async function KelolaSoalPage({ params }: { params: Promise<{ pelajaranId: string; babId: string }> }) {
  await requireRole('SUPERADMIN', 'GURU');
  const { pelajaranId, babId } = await params;

  const bab = await prisma.bab.findUnique({
    where: { id: babId },
    include: {
      pelajaran: true,
      soal: {
        orderBy: { id: 'asc' }
      }
    }
  });

  if (!bab) {
    return <div>Bab/Ujian tidak ditemukan</div>;
  }

  const { pelajaran, soal: soals } = bab;
  
  // Group soals for JFT
  const groupedSoal = pelajaran.type === 'JFT' ? soals.reduce((acc, soal) => {
    const section = soal.section || 'GENERAL';
    if (!acc[section]) acc[section] = [];
    acc[section].push(soal);
    return acc;
  }, {} as Record<string, typeof soals>) : null;

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/dashboard/admin/bank-soal/${pelajaranId}`} className="text-primary hover:underline mb-2 inline-flex items-center gap-1 text-sm font-medium">
          &larr; Kembali ke {pelajaran.name}
        </Link>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {bab.title}
          </h1>
          <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
            Kelola Soal ({soals.length})
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        {/* Form Tambah Soal */}
        <div className="lg:col-span-1 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-6">
          <h2 className="text-lg font-bold mb-4 text-gray-900">Tambah Soal Baru</h2>
          <form action={createSoal} className="space-y-4">
            <input type="hidden" name="babId" value={bab.id} />

            {pelajaran.type === 'JFT' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Seksi (Section) *</label>
                <select name="section" required className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:border-primary focus:ring-primary text-sm">
                  <option value="">Pilih Seksi...</option>
                  {Object.entries(SECTION_TYPE_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pertanyaan / Teks Soal *</label>
              <textarea name="questionText" required rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-primary" placeholder="Ketik pertanyaan di sini..."></textarea>
            </div>

            {(pelajaran.type === 'JFT' || pelajaran.type === 'SSW') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Gambar (Opsional)</label>
                <input type="url" name="imageUrl" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-primary" placeholder="https://..." />
              </div>
            )}

            {pelajaran.type === 'JFT' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Audio (Opsional, untuk Choukai)</label>
                <input type="url" name="audioUrl" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-primary" placeholder="https://..." />
              </div>
            )}

            <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-gray-500">Pilihan Jawaban</h3>
              {['A', 'B', 'C', 'D'].map((opt) => (
                <div key={opt} className="flex gap-2 items-center">
                  <span className="font-bold text-xs w-5 text-gray-600">{opt}.</span>
                  <input type="text" name={`option${opt}`} required className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:border-primary focus:ring-primary" placeholder={`Opsi ${opt}`} />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kunci Jawaban Benar *</label>
              <select name="correctOption" required className="w-full px-3 py-2 border border-green-200 rounded-xl bg-green-50 text-green-900 font-bold text-sm focus:ring-2 focus:ring-green-500">
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>

            {(pelajaran.type === 'JFT' || pelajaran.type === 'SSW' || pelajaran.type === 'BAB') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Penjelasan (Opsional)</label>
                <textarea name="explanation" rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-primary" placeholder="Penjelasan jawaban benar..."></textarea>
              </div>
            )}

            <button type="submit" className="w-full py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-hover shadow-xs transition-colors">
              Simpan Soal
            </button>
          </form>
        </div>

        {/* Daftar Soal */}
        <div className="lg:col-span-2 space-y-6">
          {soals.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center text-gray-500 shadow-sm">
              Belum ada soal untuk ujian ini.
            </div>
          ) : (
            pelajaran.type === 'JFT' && groupedSoal ? (
              Object.entries(SECTION_TYPE_LABELS).map(([sectionKey, sectionLabel]) => {
                const sectionSoals = groupedSoal[sectionKey] || [];
                if (sectionSoals.length === 0) return null;
                
                return (
                  <div key={sectionKey} className="mb-8">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground border-b border-gray-100 pb-2">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                        {sectionLabel}
                      </span>
                      <span className="text-xs text-gray-400 font-normal">({sectionSoals.length} soal)</span>
                    </h3>
                    <div className="space-y-4">
                      {sectionSoals.map((soal, index) => (
                        <SoalCard key={soal.id} soal={soal} index={index + 1} babId={bab.id} pelajaranType={pelajaran.type} />
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="space-y-4">
                {soals.map((soal, index) => (
                  <SoalCard key={soal.id} soal={soal} index={index + 1} babId={bab.id} pelajaranType={pelajaran.type} />
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function SoalCard({ soal, index, babId, pelajaranType }: { soal: any, index: number, babId: string, pelajaranType: string }) {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-start gap-3 mb-3">
        <div className="flex gap-2.5 sm:gap-3 items-start flex-1 min-w-0">
          <span className="bg-gray-800 text-white w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-lg font-bold text-xs sm:text-sm shrink-0 mt-0.5">
            {index}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-gray-900 font-medium text-sm sm:text-base whitespace-pre-wrap break-words">{soal.questionText}</p>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {soal.imageUrl && (
                <span className="inline-flex items-center gap-1 bg-primary/5 text-primary px-2 py-0.5 rounded-md text-xs">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> Gambar
                </span>
              )}
              {soal.audioUrl && (
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-xs">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg> Audio
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <EditSoalModal soal={soal} pelajaranType={pelajaranType} />
          <DeleteSoalButton soalId={soal.id} babId={babId} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 ml-0 sm:ml-9">
        {['A', 'B', 'C', 'D'].map((opt) => (
          <div 
            key={opt} 
            className={`p-2 sm:p-2.5 rounded-xl border text-xs sm:text-sm flex gap-2 items-center ${
              soal.correctOption === opt 
                ? 'bg-green-50 border-green-400 text-green-900 font-medium' 
                : 'bg-gray-50 border-gray-100 text-gray-700'
            }`}
          >
            <span className="font-bold w-4">{opt}.</span>
            <span className="flex-1 break-words">{soal[`option${opt}`]}</span>
            {soal.correctOption === opt && (
              <svg className="w-4 h-4 ml-auto text-green-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        ))}
      </div>

      {soal.explanation && (
        <div className="mt-3 ml-0 sm:ml-9 bg-gray-50 border border-gray-100 p-3 rounded-xl text-xs sm:text-sm text-gray-700">
          <strong className="text-gray-900">Penjelasan:</strong> {soal.explanation}
        </div>
      )}
    </div>
  );
}
