import { requireRole } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import { createBab } from '@/actions/bab';
import { EXAM_TYPE_LABELS, SSW_SECTOR_LABELS, PUBLISH_STATUS_LABELS, PUBLISH_STATUS_COLORS } from '@/constants/exam';
import Link from 'next/link';
import DeleteBabButton from '@/components/admin/DeleteBabButton';
import EditBabModal from '@/components/admin/EditBabModal';
import EditPelajaranModal from '@/components/admin/EditPelajaranModal';

export default async function BabUjianPage({ params }: { params: Promise<{ pelajaranId: string }> }) {
  await requireRole('SUPERADMIN', 'GURU');
  const { pelajaranId } = await params;

  const pelajaran = await prisma.pelajaran.findUnique({
    where: { id: pelajaranId },
    include: {
      babs: {
        include: {
          _count: {
            select: { soal: true }
          }
        },
        orderBy: { order: 'asc' }
      }
    }
  });

  if (!pelajaran) {
    return <div>Pelajaran tidak ditemukan</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/admin/bank-soal" className="text-primary hover:underline mb-2 inline-flex items-center gap-1 text-sm font-medium">
          &larr; Kembali ke Bank Soal
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {pelajaran.name}
            </h1>
            <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
              {EXAM_TYPE_LABELS[pelajaran.type] || pelajaran.type}
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${PUBLISH_STATUS_COLORS[pelajaran.status]}`}>
              {PUBLISH_STATUS_LABELS[pelajaran.status]}
            </span>
          </div>

          <div>
            <EditPelajaranModal
              buttonStyle="button"
              pelajaran={{
                id: pelajaran.id,
                name: pelajaran.name,
                description: pelajaran.description,
                status: pelajaran.status as any,
                order: pelajaran.order,
              }}
            />
          </div>
        </div>
        {pelajaran.description && <p className="text-sm sm:text-base text-gray-500 mt-1">{pelajaran.description}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        {/* Form Tambah Bab */}
        <div className="lg:col-span-1">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-6">
            <h2 className="text-lg font-bold mb-4 text-gray-900">
              Tambah {pelajaran.type === 'BAB' ? 'Bab' : 'Ujian'} Baru
            </h2>
            <form action={createBab} className="space-y-4">
              <input type="hidden" name="pelajaranId" value={pelajaran.id} />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Judul / Nama {pelajaran.type === 'BAB' ? 'Bab' : 'Ujian'} *
                </label>
                <input type="text" name="title" required className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-primary" placeholder={pelajaran.type === 'JFT' ? 'JFT 2026' : 'Bab 1'} />
              </div>

              {pelajaran.type === 'SSW' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sektor SSW *</label>
                  <select name="sswSector" required className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-primary bg-white">
                    {Object.entries(SSW_SECTOR_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
              )}

              {pelajaran.type === 'BAB' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Urutan *</label>
                  <input type="number" name="order" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-primary" defaultValue={pelajaran.babs.length + 1} />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(pelajaran.type === 'JFT' || pelajaran.type === 'SSW') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Durasi (Menit)</label>
                      <input type="number" name="durationMinutes" required className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-primary" defaultValue={60} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Skor Maksimal</label>
                      <input type="number" name="maxScore" required className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-primary" defaultValue={pelajaran.type === 'JFT' ? 250 : 100} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Passing Score</label>
                      <input type="number" name="passingScore" required className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-primary" defaultValue={pelajaran.type === 'JFT' ? 200 : 60} />
                    </div>
                  </>
                )}
                <div className={(pelajaran.type === 'JFT' || pelajaran.type === 'SSW') ? '' : 'sm:col-span-2'}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {pelajaran.type === 'JFT' ? 'Soal per Seksi' : 'Maksimal Soal Ditampilkan'}
                  </label>
                  <input type="number" name="maxSoalShown" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-primary" defaultValue={pelajaran.type === 'JFT' ? 15 : pelajaran.type === 'SSW' ? 40 : 20} />
                </div>
              </div>

              <button type="submit" className="w-full py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-hover transition-colors">
                Simpan
              </button>
            </form>
          </div>
        </div>

        {/* List Bab */}
        <div className="lg:col-span-2 space-y-4">
          {pelajaran.babs.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center text-gray-500 shadow-sm">
              Belum ada data. Silakan tambah baru.
            </div>
          ) : (
            pelajaran.babs.map((bab, index) => (
              <div key={bab.id} className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded">#{bab.order ?? (index + 1)}</span>
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 truncate">{bab.title}</h3>
                    {bab.status && (
                      <span className={`text-[10px] px-2 py-0.2 rounded-full font-semibold ${PUBLISH_STATUS_COLORS[bab.status]}`}>
                        {PUBLISH_STATUS_LABELS[bab.status]}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                      {bab._count.soal} Soal
                    </span>
                    {pelajaran.type === 'SSW' && bab.sswSector && (
                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                        {SSW_SECTOR_LABELS[bab.sswSector]}
                      </span>
                    )}
                    {(pelajaran.type === 'JFT' || pelajaran.type === 'SSW') && (
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {bab.durationMinutes}m
                      </span>
                    )}
                    <span className="text-gray-400">
                      Passing: {bab.passingScore}/{bab.maxScore}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0 flex-wrap justify-end">
                  <EditBabModal
                    bab={{
                      id: bab.id,
                      title: bab.title,
                      description: bab.description,
                      order: bab.order,
                      maxSoalShown: bab.maxSoalShown,
                      durationMinutes: bab.durationMinutes,
                      passingScore: bab.passingScore,
                      maxScore: bab.maxScore,
                      sswSector: bab.sswSector,
                      status: bab.status as any,
                    }}
                    pelajaranType={pelajaran.type}
                  />
                  <Link 
                    href={`/dashboard/admin/bank-soal/${pelajaran.id}/${bab.id}`}
                    className="flex-1 sm:flex-none text-center px-3.5 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Kelola Soal &rarr;
                  </Link>
                  <DeleteBabButton babId={bab.id} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
