import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import ExamEngine from "@/components/ExamEngine";

export default async function UjianBabPage({ params }: { params: { babId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const userId = (session.user as any).id;

  const bab = await prisma.bab.findUnique({
    where: { id: params.babId }
  });

  if (!bab) return notFound();

  // Ambil semua soal untuk bab ini
  const allSoal = await prisma.soal.findMany({
    where: { babId: params.babId },
    select: {
      id: true,
      questionText: true,
      optionA: true,
      optionB: true,
      optionC: true,
      optionD: true,
      // Jangan mengirimkan correctOption ke client (karena bisa dicontek di browser devtools!)
    }
  });

  // Sistem Acak & Ambil maksimal 20 Soal
  // Menggunakan algoritma Fisher-Yates untuk mengacak array
  for (let i = allSoal.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allSoal[i], allSoal[j]] = [allSoal[j], allSoal[i]];
  }

  const selectedSoal = allSoal.slice(0, 20);

  if (selectedSoal.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-500">Soal belum tersedia untuk bab ini.</h2>
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
