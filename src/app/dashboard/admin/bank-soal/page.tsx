import { requireRole } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import { EXAM_TYPE_LABELS, EXAM_TYPE_COLORS, PUBLISH_STATUS_LABELS, PUBLISH_STATUS_COLORS } from '@/constants/exam';
import { createPelajaran } from '@/actions/pelajaran';
import Link from 'next/link';

export default async function BankSoalPage() {
  await requireRole('SUPERADMIN', 'GURU');

  const pelajarans = await prisma.pelajaran.findMany({
    include: {
      _count: {
        select: { babs: true }
      }
    },
    orderBy: { order: 'asc' }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Bank Soal</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">Kelola pelajaran, simulasi ujian, dan bank soal.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {pelajarans.map((p) => {
          const typeColor = EXAM_TYPE_COLORS[p.type] || 'bg-gray-100 text-gray-800';
          const typeLabel = EXAM_TYPE_LABELS[p.type] || p.type;
          
          return (
            <Link 
              key={p.id} 
              href={`/dashboard/admin/bank-soal/${p.id}`}
              className="block p-5 sm:p-6 rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:border-primary/30"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                </div>
                {!p.isDefault && p.status && (
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${PUBLISH_STATUS_COLORS[p.status]}`}>
                    {PUBLISH_STATUS_LABELS[p.status]}
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-bold mb-2 text-gray-900">{p.name}</h2>
              {p.description && (
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{p.description}</p>
              )}
              <div className="flex justify-between items-center text-xs font-semibold pt-2 border-t border-gray-50">
                <span className={`px-2.5 py-1 rounded-full ${typeColor}`}>
                  {typeLabel}
                </span>
                <span className="text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">
                  {p._count.babs} Ujian/Bab
                </span>
              </div>
            </Link>
          );
        })}

        {/* Tambah Pelajaran Baru Card */}
        <div className="p-5 sm:p-6 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 flex flex-col justify-center">
          <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Tambah Pelajaran Baru
          </h2>
          <form action={createPelajaran} className="space-y-3">
            <input type="hidden" name="type" value="BAB" />
            <input 
              type="text" 
              name="name" 
              placeholder="Nama Pelajaran (mis. N4 Choukai)"
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-primary bg-white"
            />
            <input 
              type="text" 
              name="description" 
              placeholder="Deskripsi singkat"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-primary focus:ring-primary bg-white"
            />
            <button 
              type="submit"
              className="w-full py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-hover transition-colors"
            >
              Tambah Pelajaran
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
