import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import ExamEngine from "@/components/ExamEngine";

export default async function UjianBabPage({ params }: { params: Promise<{ babId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const userId = (session.user as any).id;

  const { babId } = await params;

  const bab = await prisma.bab.findUnique({
    where: { id: babId }
  });

  if (!bab) return notFound();

  // Ambil semua soal untuk bab ini (TANPA correctOption demi keamanan)
  const allSoal = await prisma.soal.findMany({
    where: { babId },
    select: {
      id: true,
      questionText: true,
      optionA: true,
      optionB: true,
      optionC: true,
      optionD: true,
    }
  });

  // Sistem Acak & Ambil maksimal 20 Soal (Fisher-Yates Shuffle)
  for (let i = allSoal.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allSoal[i], allSoal[j]] = [allSoal[j], allSoal[i]];
  }

  const selectedSoal = allSoal.slice(0, 20);

  if (selectedSoal.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-500">Soal belum tersedia untuk bab ini.</h2>
        <p className="text-gray-400 mt-2">Hubungi pengajar Anda untuk informasi lebih lanjut.</p>
      </div>
    );
  }

  return (
    <ExamEngine 
      babId={bab.id} 
      babTitle={bab.title} 
      userId={userId} 
      soalList={selectedSoal} 
    />
  );
}
