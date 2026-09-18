import { requireRole } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
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
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-gray-100">
        <p className="text-gray-600 font-medium">Bab / Ujian tidak ditemukan.</p>
        <Link href={`/dashboard/admin/bank-soal/${pelajaranId}`} className="mt-3 inline-flex text-primary hover:underline text-sm font-semibold">
          &larr; Kembali ke Pelajaran
        </Link>
      </div>
    );
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
      {/* Header & Aksi Tambah Soal */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link href={`/dashboard/admin/bank-soal/${pelajaranId}`} className="text-primary hover:underline mb-2 inline-flex items-center gap-1.5 text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke {pelajaran.name}
          </Link>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {bab.title}
            </h1>
            <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
              {soals.length} Soal
            </span>
          </div>
        </div>

        <div>
          <Link
            href={`/dashboard/admin/bank-soal/${pelajaranId}/${babId}/tambah`}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Tambah Soal</span>
          </Link>
        </div>
      </div>

      {/* Daftar Soal Full-Width */}
      <div className="space-y-6">
        {soals.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-3xl p-10 sm:p-14 text-center shadow-sm">
            <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Belum Ada Soal</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
              Ujian ini belum memiliki butir soal. Klik tombol di bawah untuk membuat dan mengunggah soal beserta media ke VPS.
            </p>
            <Link
              href={`/dashboard/admin/bank-soal/${pelajaranId}/${babId}/tambah`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Tambah Soal Pertama</span>
            </Link>
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
  );
}

function SoalCard({ soal, index, babId, pelajaranType }: { soal: any, index: number, babId: string, pelajaranType: string }) {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
      <div className="flex justify-between items-start gap-4 mb-3">
        <div className="flex gap-3 sm:gap-4 items-start flex-1 min-w-0">
          <span className="bg-gray-800 text-white w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl font-bold text-xs sm:text-sm shrink-0 mt-0.5">
            {index}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-gray-900 font-medium text-sm sm:text-base whitespace-pre-wrap break-words leading-relaxed">{soal.questionText}</p>
            
            <div className="flex flex-wrap gap-2 mt-2.5">
              {soal.imageUrl && (
                <span className="inline-flex items-center gap-1 bg-primary/5 text-primary px-2.5 py-0.5 rounded-md text-xs font-medium">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> Gambar
                </span>
              )}
              {soal.audioUrl && (
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-md text-xs font-medium">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg> Audio
                </span>
              )}
            </div>

            {soal.imageUrl && (
              <div className="mt-3 max-w-sm sm:max-w-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={soal.imageUrl} alt="Gambar soal" className="max-h-52 rounded-xl border border-gray-200 object-contain bg-gray-50" />
              </div>
            )}

            {soal.audioUrl && (
              <div className="mt-3 max-w-md">
                <audio controls className="w-full h-8">
                  <source src={soal.audioUrl} />
                </audio>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <EditSoalModal soal={soal} pelajaranType={pelajaranType} />
          <DeleteSoalButton soalId={soal.id} babId={babId} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4 ml-0 sm:ml-11">
        {['A', 'B', 'C', 'D'].map((opt) => {
          const optText = soal[`option${opt}`];
          const optImage = soal[`option${opt}Image`];
          if (!optText && !optImage) return null;

          return (
            <div 
              key={opt} 
              className={`p-2.5 sm:p-3 rounded-xl border text-xs sm:text-sm flex gap-2.5 items-center ${
                soal.correctOption === opt 
                  ? 'bg-green-50 border-green-400 text-green-900 font-medium' 
                  : 'bg-gray-50 border-gray-100 text-gray-700'
              }`}
            >
              <span className="font-bold w-4 text-center shrink-0">{opt}.</span>
              {optImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={optImage}
                  alt={`Gambar pilihan ${opt}`}
                  className="w-12 h-12 object-cover rounded-lg border border-gray-200 bg-white shrink-0"
                />
              )}
              {optText && <span className="flex-1 break-words">{optText}</span>}
              {soal.correctOption === opt && (
                <svg className="w-4 h-4 ml-auto text-green-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          );
        })}
      </div>

      {soal.explanation && (
        <div className="mt-3 ml-0 sm:ml-11 bg-gray-50 border border-gray-100 p-3.5 rounded-xl text-xs sm:text-sm text-gray-700">
          <strong className="text-gray-900">Penjelasan:</strong> {soal.explanation}
        </div>
      )}
    </div>
  );
}
