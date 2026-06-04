import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import BiodataForm from "@/components/BiodataForm";

export default async function BiodataPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const userId = (session.user as any).id;

  const biodata = await prisma.biodata.findUnique({
    where: { userId }
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Data Diri (CV Jepang)</h1>
        <p className="text-gray-500 mt-1">Lengkapi data diri Anda untuk keperluan pembuatan rirekisho.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <BiodataForm initialData={biodata} />
      </div>
    </div>
  );
}
