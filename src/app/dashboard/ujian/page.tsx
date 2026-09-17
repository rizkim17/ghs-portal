import { prisma } from "@/lib/prisma";
import { getRequiredSession } from "@/lib/auth-guard";
import Link from "next/link";
import { EXAM_TYPE_LABELS, SSW_SECTOR_LABELS } from "@/constants/exam";

export default async function DaftarUjianPage() {
  const session = await getRequiredSession();
  const userId = (session.user as any).id;

  // Ambil semua pelajaran yang PUBLISHED beserta bab-babnya
  const pelajaranList = await prisma.pelajaran.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { order: "asc" },
    include: {
      babs: {
        where: { status: "PUBLISHED" },
        orderBy: { order: "asc" },
        include: {
          _count: { select: { soal: true } },
          nilaiUjian: {
            where: { userId },
            select: { score: true, isPassed: true },
          },
        },
      },
    },
  });

  // Pisahkan CBT (JFT/SSW) dan BAB
  const cbtPelajaran = pelajaranList.filter((p) => p.type === "JFT" || p.type === "SSW");
  const babPelajaran = pelajaranList.filter((p) => p.type === "BAB");

  // Progressive gating per pelajaran BAB
  const isUnlocked = (index: number, babs: typeof pelajaranList[0]["babs"]) => {
    if (index === 0) return true;
    return babs[index - 1].nilaiUjian[0]?.isPassed === true;
  };

  const hasContent = pelajaranList.some((p) => p.babs.length > 0);

  if (!hasContent) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Ujian Online</h1>
        <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500">Belum ada ujian yang tersedia saat ini.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Ujian Online</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">Pilih jenis ujian yang ingin dikerjakan.</p>
      </div>

      {/* ══════════ SECTION A: SIMULASI UJIAN CBT ══════════ */}
      {cbtPelajaran.some((p) => p.babs.length > 0) && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <svg className="w-5 sm:w-6 h-5 sm:h-6 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              Simulasi Ujian CBT
            </h2>
            <span className="text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-semibold">Prometric Style</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {cbtPelajaran.flatMap((pel) =>
              pel.babs.map((bab) => {
                const result = bab.nilaiUjian[0];
                const hasSoal = bab._count.soal > 0;
                const isJFT = pel.type === "JFT";

                return (
                  <div key={bab.id} className={`bg-white rounded-2xl shadow-sm border p-5 sm:p-6 transition-all ${
                    result?.isPassed ? "border-green-200 bg-green-50/20" : "border-gray-100 hover:border-primary/30 hover:shadow-md"
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                        {isJFT ? "JFT-Basic" : "SSW"}
                      </span>
                      {result?.isPassed && (
                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-green-200">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                          Lulus
                        </span>
                      )}
                      {result && !result.isPassed && (
                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-xs font-bold px-2.5 py-0.5 rounded-full border border-red-100">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                          Belum Lulus
                        </span>
                      )}
                    </div>

                    {bab.sswSector !== "NONE" && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-600 mb-2">
                        {SSW_SECTOR_LABELS[bab.sswSector] || bab.sswSector}
                      </span>
                    )}

                    <h3 className="font-bold text-gray-900 mb-1 text-base sm:text-lg">{bab.title}</h3>
                    {bab.description && <p className="text-xs text-gray-500 mb-4 line-clamp-2">{bab.description}</p>}

                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="bg-gray-50 rounded-xl p-2 sm:p-2.5 text-center">
                        <p className="text-base sm:text-lg font-bold text-gray-800">{bab._count.soal}</p>
                        <p className="text-[10px] text-gray-400">Soal</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-2 sm:p-2.5 text-center">
                        <p className="text-base sm:text-lg font-bold text-gray-800">{bab.durationMinutes}</p>
                        <p className="text-[10px] text-gray-400">Menit</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-2 sm:p-2.5 text-center">
                        <p className="text-base sm:text-lg font-bold text-gray-800">{bab.passingScore}<span className="text-[10px] text-gray-400">/{bab.maxScore}</span></p>
                        <p className="text-[10px] text-gray-400">Batas Lulus</p>
                      </div>
                    </div>

                    {result && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">Skor terakhir</span>
                          <span className="font-bold text-gray-700">{result.score}/{bab.maxScore}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className={`h-2 rounded-full ${result.isPassed ? "bg-green-600" : "bg-red-500"}`} style={{ width: `${Math.min(100, (result.score / bab.maxScore) * 100)}%` }} />
                        </div>
                      </div>
                    )}

                    {hasSoal ? (
                      <Link href={`/dashboard/ujian/${bab.id}`} className="block w-full text-center bg-primary text-white py-2.5 sm:py-3 rounded-xl text-sm font-bold hover:bg-primary-hover transition-colors">
                        {result ? "Coba Lagi" : "Mulai Simulasi"}
                      </Link>
                    ) : (
                      <p className="text-center text-xs text-gray-400 py-3">Soal belum tersedia</p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ══════════ SECTION B: LATIHAN PER BAB ══════════ */}
      {babPelajaran.some((p) => p.babs.length > 0) && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <svg className="w-5 sm:w-6 h-5 sm:h-6 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
              Latihan Per Bab
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Kerjakan ujian bertahap. Lulus bab sebelumnya untuk membuka bab berikutnya.</p>
          </div>

          {babPelajaran.map((pel) => {
            if (pel.babs.length === 0) return null;
            return (
              <div key={pel.id} className="space-y-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                    {pel.name}
                  </span>
                  <span className="text-xs text-gray-400">{pel.babs.length} bab</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {pel.babs.map((bab, index) => {
                    const result = bab.nilaiUjian[0];
                    const unlocked = isUnlocked(index, pel.babs);
                    const hasSoal = bab._count.soal > 0;
                    const canStart = unlocked && hasSoal;

                    return (
                      <div key={bab.id} className={`bg-white rounded-2xl shadow-sm border p-4 transition-all ${
                        !unlocked ? "opacity-50 border-gray-200" :
                        result?.isPassed ? "border-green-200 bg-green-50/20" :
                        "border-gray-100 hover:shadow-md hover:-translate-y-0.5"
                      }`}>
                        <div className="flex items-start justify-between mb-2">
                          <span className="inline-flex items-center justify-center w-7 h-7 bg-primary/10 text-primary rounded-lg text-xs font-bold">{bab.order}</span>
                          {!unlocked && <span className="text-gray-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg></span>}
                          {result?.isPassed && (
                            <span className="inline-flex items-center gap-0.5 bg-green-50 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-200">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                              Lulus
                            </span>
                          )}
                          {result && !result.isPassed && (
                            <span className="inline-flex items-center gap-0.5 bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-100">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                              Gagal
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1 text-sm">{bab.title}</h3>
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray-400 mb-3">
                          <span>{bab._count.soal} soal</span><span>•</span>
                          <span>Tampil: {bab.maxSoalShown}</span><span>•</span>
                          <span>Lulus: {bab.passingScore}</span>
                        </div>
                        {result && (
                          <div className="mb-3">
                            <div className="flex justify-between text-[11px] mb-1">
                              <span className="text-gray-500">Skor</span>
                              <span className="font-bold text-gray-700">{result.score}/{bab.maxScore}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div className={`h-1.5 rounded-full ${result.isPassed ? "bg-green-600" : "bg-red-500"}`} style={{ width: `${Math.min(100, (result.score / bab.maxScore) * 100)}%` }} />
                            </div>
                          </div>
                        )}
                        {canStart ? (
                          <Link href={`/dashboard/ujian/${bab.id}`} className="block w-full text-center bg-primary text-white py-2 rounded-xl text-xs font-medium hover:bg-primary-hover transition-colors">
                            {result ? "Coba Lagi" : "Mulai Ujian"}
                          </Link>
                        ) : !hasSoal ? (
                          <p className="text-center text-[11px] text-gray-400 py-2">Soal belum tersedia</p>
                        ) : (
                          <p className="flex items-center justify-center gap-1 text-center text-[11px] text-gray-400 py-2">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                            Selesaikan bab sebelumnya
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
