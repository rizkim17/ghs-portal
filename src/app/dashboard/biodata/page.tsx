import { prisma } from "@/lib/prisma";
import { getRequiredSession } from "@/lib/auth-guard";
import BiodataForm from "@/components/biodata/BiodataForm";

export default async function BiodataPage() {
  const session = await getRequiredSession();
  const userId = (session.user as any).id;

  const biodata = await prisma.biodata.findUnique({
    where: { userId }
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Data Diri (CV Jepang)</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">Lengkapi data diri Anda untuk keperluan pembuatan rirekisho.</p>
      </div>

      <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100">
        <BiodataForm initialData={biodata} />
      </div>
    </div>
  );
}
