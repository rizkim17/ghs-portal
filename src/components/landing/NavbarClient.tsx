"use client";

import Link from "next/link";
import { useState } from "react";

const WA_NUMBER = "6281234567890";
const WA_MESSAGE = encodeURIComponent("Halo, saya ingin mendaftar di LPK GHS. Mohon informasinya.");

export default function NavbarClient({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" onClick={closeMenu} className="text-xl sm:text-2xl font-bold text-primary">
              GHS Portal
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 lg:space-x-8 items-center">
            <Link href="/" className="text-gray-600 hover:text-primary font-medium text-sm lg:text-base transition-colors">
              Beranda
            </Link>
            <Link href="#tentang" className="text-gray-600 hover:text-primary font-medium text-sm lg:text-base transition-colors">
              Tentang
            </Link>
            <Link href="#program" className="text-gray-600 hover:text-primary font-medium text-sm lg:text-base transition-colors">
              Program
            </Link>
            <Link href="#kontak" className="text-gray-600 hover:text-primary font-medium text-sm lg:text-base transition-colors">
              Kontak
            </Link>
          </div>

          {/* Desktop Call to Action */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="bg-primary text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-primary-hover hover-lift shadow-soft transition-all"
              >
                Ke Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-primary font-medium text-sm hover:text-primary-hover transition-colors px-3 py-2"
                >
                  Masuk
                </Link>
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white px-4 lg:px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-green-700 hover-lift shadow-soft transition-all flex items-center space-x-2"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>Daftar via WA</span>
                </a>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg animate-fadeIn">
          <div className="flex flex-col space-y-2">
            <Link
              href="/"
              onClick={closeMenu}
              className="px-3 py-2.5 rounded-xl text-gray-700 hover:bg-primary/5 hover:text-primary font-medium text-sm transition-colors"
            >
              Beranda
            </Link>
            <Link
              href="#tentang"
              onClick={closeMenu}
              className="px-3 py-2.5 rounded-xl text-gray-700 hover:bg-primary/5 hover:text-primary font-medium text-sm transition-colors"
            >
              Tentang
            </Link>
            <Link
              href="#program"
              onClick={closeMenu}
              className="px-3 py-2.5 rounded-xl text-gray-700 hover:bg-primary/5 hover:text-primary font-medium text-sm transition-colors"
            >
              Program
            </Link>
            <Link
              href="#kontak"
              onClick={closeMenu}
              className="px-3 py-2.5 rounded-xl text-gray-700 hover:bg-primary/5 hover:text-primary font-medium text-sm transition-colors"
            >
              Kontak
            </Link>
          </div>

          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                onClick={closeMenu}
                className="w-full text-center bg-primary text-white py-2.5 rounded-xl font-medium text-sm hover:bg-primary-hover shadow-soft transition-all"
              >
                Ke Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="w-full text-center border border-gray-200 text-primary py-2.5 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors"
                >
                  Masuk
                </Link>
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="w-full text-center bg-green-600 text-white py-2.5 rounded-xl font-medium text-sm hover:bg-green-700 shadow-soft transition-all flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>Daftar via WA</span>
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
