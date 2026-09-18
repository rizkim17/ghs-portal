import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import TambahSoalForm from "@/components/admin/TambahSoalForm";
import { EXAM_TYPE_LABELS } from "@/constants/exam";

export default async function TambahSoalPage({
  params,
}: {
  params: Promise<{ pelajaranId: string; babId: string }>;
}) {
  await requireRole("SUPERADMIN", "GURU");
  const { pelajaranId, babId } = await params;

  const bab = await prisma.bab.findUnique({
    where: { id: babId },
    include: {
      pelajaran: true,
      _count: {
        select: { soal: true },
      },
    },
  });

  if (!bab) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-gray-100">
        <p className="text-gray-600 font-medium">Bab / Ujian tidak ditemukan.</p>
        <Link
          href={`/dashboard/admin/bank-soal/${pelajaranId}`}
          className="mt-3 inline-flex text-primary hover:underline text-sm font-semibold"
        >
          &larr; Kembali ke Pelajaran
        </Link>
      </div>
    );
  }

  const { pelajaran } = bab;

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* Header & Navigasi Kembali */}
      <div>
        <Link
          href={`/dashboard/admin/bank-soal/${pelajaranId}/${babId}`}
          className="text-primary hover:underline mb-2 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Daftar Soal ({bab.title})
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Tambah Soal Baru
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {pelajaran.name} &bull; {bab.title} &bull; Total saat ini: {bab._count.soal} soal
            </p>
          </div>

          <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1.5 rounded-full">
            {EXAM_TYPE_LABELS[pelajaran.type] || pelajaran.type}
          </span>
        </div>
      </div>

      {/* Formulir Input Soal */}
      <div className="bg-white p-5 sm:p-7 rounded-2xl border border-gray-100 shadow-sm">
        <TambahSoalForm
          babId={bab.id}
          pelajaranId={pelajaranId}
          pelajaranType={pelajaran.type}
        />
      </div>
    </div>
  );
}
