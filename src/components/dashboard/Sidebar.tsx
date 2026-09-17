"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

type SidebarProps = {
  role: string;
  userName: string;
};

export default function Sidebar({ role, userName }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const roleLabel =
    role === "SUPERADMIN" ? "Super Admin" : role === "GURU" ? "Guru / Staf" : "Siswa";

  const closeDrawer = () => setIsOpen(false);

  const navContent = (
    <>
      <Link
        href="/dashboard"
        onClick={closeDrawer}
        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
          pathname === "/dashboard"
            ? "bg-primary/10 text-primary font-semibold"
            : "text-gray-700 hover:bg-primary/5 hover:text-primary"
        }`}
      >
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span>Dashboard</span>
      </Link>

      {/* SUPERADMIN */}
      {role === "SUPERADMIN" && (
        <>
          <div className="pt-4 pb-2">
            <p className="px-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Super Admin
            </p>
          </div>
          <Link
            href="/dashboard/admin/users"
            onClick={closeDrawer}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
              pathname?.startsWith("/dashboard/admin/users")
                ? "bg-primary/10 text-primary font-semibold"
                : "text-gray-700 hover:bg-primary/5 hover:text-primary"
            }`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Kelola Akun</span>
          </Link>
          <Link
            href="/dashboard/admin/bank-soal"
            onClick={closeDrawer}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
              pathname?.startsWith("/dashboard/admin/bank-soal")
                ? "bg-primary/10 text-primary font-semibold"
                : "text-gray-700 hover:bg-primary/5 hover:text-primary"
            }`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>Bank Soal</span>
          </Link>
          <Link
            href="/dashboard/admin/hasil-ujian"
            onClick={closeDrawer}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
              pathname?.startsWith("/dashboard/admin/hasil-ujian")
                ? "bg-primary/10 text-primary font-semibold"
                : "text-gray-700 hover:bg-primary/5 hover:text-primary"
            }`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Hasil Ujian</span>
          </Link>
          <Link
            href="/dashboard/admin/cv"
            onClick={closeDrawer}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
              pathname?.startsWith("/dashboard/admin/cv")
                ? "bg-primary/10 text-primary font-semibold"
                : "text-gray-700 hover:bg-primary/5 hover:text-primary"
            }`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>
            <span>Data CV Siswa</span>
          </Link>
        </>
      )}

      {/* GURU / STAF */}
      {role === "GURU" && (
        <>
          <div className="pt-4 pb-2">
            <p className="px-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Menu Pengajar
            </p>
          </div>
          <Link
            href="/dashboard/admin/bank-soal"
            onClick={closeDrawer}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
              pathname?.startsWith("/dashboard/admin/bank-soal")
                ? "bg-primary/10 text-primary font-semibold"
                : "text-gray-700 hover:bg-primary/5 hover:text-primary"
            }`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>Bank Soal</span>
          </Link>
          <Link
            href="/dashboard/admin/hasil-ujian"
            onClick={closeDrawer}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
              pathname?.startsWith("/dashboard/admin/hasil-ujian")
                ? "bg-primary/10 text-primary font-semibold"
                : "text-gray-700 hover:bg-primary/5 hover:text-primary"
            }`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Hasil Ujian</span>
          </Link>
          <Link
            href="/dashboard/admin/cv"
            onClick={closeDrawer}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
              pathname?.startsWith("/dashboard/admin/cv")
                ? "bg-primary/10 text-primary font-semibold"
                : "text-gray-700 hover:bg-primary/5 hover:text-primary"
            }`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>
            <span>Data CV Siswa</span>
          </Link>
        </>
      )}

      {/* SISWA */}
      {role === "SISWA" && (
        <>
          <div className="pt-4 pb-2">
            <p className="px-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Menu Siswa
            </p>
          </div>
          <Link
            href="/dashboard/ujian"
            onClick={closeDrawer}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
              pathname?.startsWith("/dashboard/ujian")
                ? "bg-primary/10 text-primary font-semibold"
                : "text-gray-700 hover:bg-primary/5 hover:text-primary"
            }`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span>Ujian Online</span>
          </Link>
          <Link
            href="/dashboard/biodata"
            onClick={closeDrawer}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
              pathname?.startsWith("/dashboard/biodata")
                ? "bg-primary/10 text-primary font-semibold"
                : "text-gray-700 hover:bg-primary/5 hover:text-primary"
            }`}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Data Diri</span>
          </Link>
        </>
      )}
    </>
  );

  const footerContent = (
    <div className="p-4 border-t border-gray-100">
      <div className="px-4 py-3 bg-gray-50 rounded-xl mb-2">
        <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
        <p className="text-xs text-gray-500 mt-0.5">{roleLabel}</p>
      </div>
      <Link
        href="/api/auth/signout"
        className="block w-full text-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
      >
        Keluar
      </Link>
    </div>
  );

  return (
    <>
      {/* ── Mobile Top Header Bar (lg:hidden) ── */}
      <header className="lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Buka menu navigasi"
            className="p-2 -ml-1 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <Link href="/dashboard" className="text-lg font-bold text-foreground">
            Portal <span className="text-primary">GHS</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
            {roleLabel}
          </span>
        </div>
      </header>

      {/* ── Mobile Drawer Overlay (lg:hidden) ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={closeDrawer}
        />
      )}

      {/* ── Mobile Slide-over Drawer (lg:hidden) ── */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <Link href="/dashboard" onClick={closeDrawer} className="text-xl font-bold text-foreground">
              Portal <span className="text-primary">GHS</span>
            </Link>
            <p className="text-xs text-gray-400">Lembaga Pelatihan Kerja</p>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Tutup menu"
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navContent}
        </nav>

        {footerContent}
      </div>

      {/* ── Desktop Permanent Sidebar (hidden on mobile, flex on lg+) ── */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-100 flex-col min-h-screen sticky top-0 flex-shrink-0">
        <div className="p-6 border-b border-gray-100">
          <Link href="/dashboard" className="text-2xl font-bold text-foreground">
            Portal <span className="text-primary">GHS</span>
          </Link>
          <p className="text-xs text-gray-400 mt-1">Lembaga Pelatihan Kerja</p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navContent}
        </nav>

        {footerContent}
      </aside>
    </>
  );
}
