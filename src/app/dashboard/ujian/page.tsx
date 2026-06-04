import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DaftarUjianPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const userId = (session.user as any).id;

  const babs = await prisma.bab.findMany({
    orderBy: { order: 'asc' },
    include: {
      _count: { select: { soal: true } },
      nilaiUjian: {
        where: { userId }
      }
    }
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Daftar Ujian Bahasa Jepang</h1>
        <p className="text-gray-500 mt-1">Uji kemampuan Anda dari bab awal hingga mahir.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {babs.map((bab, index) => {
          const isPassed = bab.nilaiUjian[0]?.isPassed;
          const score = bab.nilaiUjian[0]?.score;
          const hasAttempted = bab.nilaiUjian.length > 0;
          
          // Logika sederhana: Bab bisa diakses jika bab sebelumnya sudah lulus, atau jika ini bab pertama
          let isLocked = false;
          if (index > 0) {
            const prevBabPassed = babs[index - 1].nilaiUjian[0]?.isPassed;
            if (!prevBabPassed) isLocked = true;
          }

          // Jika bab tidak punya soal, kita anggap "Belum Tersedia"
          const isAvailable = bab._count.soal > 0;

          return (
            <div key={bab.id} className={`relative bg-white p-6 rounded-3xl shadow-sm border ${isLocked ? 'border-gray-200 opacity-60 bg-gray-50' : isPassed ? 'border-green-200' : 'border-gray-100'} transition-all hover:shadow-md`}>
              
              {isLocked && (
                <div className="absolute top-4 right-4 text-gray-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
              )}

              <h2 className="text-xl font-bold text-gray-900 pr-8">{bab.title}</h2>
              <p className="text-sm text-gray-500 mt-1 h-10 line-clamp-2">{bab.description}</p>
              
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                  {bab._count.soal} Soal Total
                </span>

                {hasAttempted && (
                  <span className={`text-sm font-bold ${isPassed ? 'text-green-600' : 'text-red-500'}`}>
                    Skor Terakhir: {score}
                  </span>
                )}
              </div>

              <div className="mt-6">
                {!isAvailable ? (
                  <button disabled className="w-full bg-gray-200 text-gray-500 py-3 rounded-xl text-sm font-medium cursor-not-allowed">
                    Ujian Belum Tersedia
                  </button>
                ) : isLocked ? (
                  <button disabled className="w-full bg-gray-200 text-gray-500 py-3 rounded-xl text-sm font-medium cursor-not-allowed">
                    Selesaikan Bab Sebelumnya
                  </button>
                ) : (
                  <Link href={`/dashboard/ujian/${bab.id}`} className={`block text-center w-full py-3 rounded-xl text-sm font-medium transition-colors ${hasAttempted && !isPassed ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-primary hover:bg-primary-hover text-white'}`}>
                    {hasAttempted && !isPassed ? "Remidi Ujian" : "Mulai Ujian (20 Soal Acak)"}
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
