import { getRequiredSession } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getRequiredSession();
  const role = (session.user as any)?.role;

  // Statistik umum
  const totalUsers = await prisma.user.count();
  const totalSiswa = await prisma.user.count({ where: { role: "SISWA" } });
  const totalBab = await prisma.bab.count();
  const totalSoal = await prisma.soal.count();

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Selamat Datang, <span className="text-primary">{session?.user?.name}</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">
          {role === "SUPERADMIN" && "Anda login sebagai Super Admin. Kelola seluruh sistem dari sini."}
          {role === "GURU" && "Anda login sebagai Guru/Staf. Kelola soal ujian dan pantau progress siswa."}
          {role === "SISWA" && "Portal belajar bahasa Jepang Anda. Kerjakan ujian dan isi data diri."}
        </p>
      </div>

      {/* ══════════ DASHBOARD SUPERADMIN ══════════ */}
      {role === "SUPERADMIN" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-xs sm:text-sm font-medium text-gray-500">Total Pengguna</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground mt-2">{totalUsers}</p>
            </div>
            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-xs sm:text-sm font-medium text-gray-500">Jumlah Siswa</p>
              <p className="text-2xl sm:text-3xl font-bold text-primary mt-2">{totalSiswa}</p>
            </div>
            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-xs sm:text-sm font-medium text-gray-500">Total Bab Ujian</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground mt-2">{totalBab}</p>
            </div>
            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-xs sm:text-sm font-medium text-gray-500">Total Soal</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground mt-2">{totalSoal}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <Link href="/dashboard/admin/users" className="group bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              </div>
              <h3 className="font-bold text-gray-900">Kelola Akun</h3>
              <p className="text-sm text-gray-500 mt-1">Buat dan kelola akun siswa, guru, dan admin.</p>
            </Link>
            <Link href="/dashboard/admin/bank-soal" className="group bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
              </div>
              <h3 className="font-bold text-gray-900">Bank Soal</h3>
              <p className="text-sm text-gray-500 mt-1">Input dan kelola soal ujian per bab.</p>
            </Link>
            <Link href="/dashboard/admin/hasil-ujian" className="group bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <h3 className="font-bold text-gray-900">Hasil Ujian</h3>
              <p className="text-sm text-gray-500 mt-1">Pantau nilai dan progress siswa.</p>
            </Link>
          </div>
        </>
      )}

      {/* ══════════ DASHBOARD GURU ══════════ */}
      {role === "GURU" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-xs sm:text-sm font-medium text-gray-500">Jumlah Siswa</p>
              <p className="text-2xl sm:text-3xl font-bold text-primary mt-2">{totalSiswa}</p>
            </div>
            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-xs sm:text-sm font-medium text-gray-500">Total Bab Ujian</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground mt-2">{totalBab}</p>
            </div>
            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-xs sm:text-sm font-medium text-gray-500">Total Soal</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground mt-2">{totalSoal}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Link href="/dashboard/admin/bank-soal" className="group bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
              </div>
              <h3 className="font-bold text-gray-900">Input & Kelola Soal</h3>
              <p className="text-sm text-gray-500 mt-1">Buat bab baru dan tambahkan soal ujian.</p>
            </Link>
            <Link href="/dashboard/admin/hasil-ujian" className="group bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <h3 className="font-bold text-gray-900">Lihat Hasil Ujian</h3>
              <p className="text-sm text-gray-500 mt-1">Pantau nilai dan progress siswa.</p>
            </Link>
          </div>
        </>
      )}

      {/* ══════════ DASHBOARD SISWA ══════════ */}
      {role === "SISWA" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <Link href="/dashboard/ujian" className="group bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all">
            <div className="w-12 sm:w-14 h-12 sm:h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <svg className="w-6 sm:w-7 h-6 sm:h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Ujian Online</h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">Kerjakan ujian bahasa Jepang dari bab awal hingga mahir. Selesaikan setiap bab untuk membuka bab berikutnya.</p>
            <span className="inline-block mt-4 text-sm text-primary font-semibold">Mulai Ujian →</span>
          </Link>
          <Link href="/dashboard/biodata" className="group bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all">
            <div className="w-12 sm:w-14 h-12 sm:h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-gray-200 transition-colors">
              <svg className="w-6 sm:w-7 h-6 sm:h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Data Diri</h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">Lengkapi data diri Anda untuk keperluan pembuatan Rirekisho (CV Jepang) dan dokumen magang.</p>
            <span className="inline-block mt-4 text-sm text-gray-700 font-semibold">Isi Data Diri →</span>
          </Link>
        </div>
      )}
    </div>
  );
}
