import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              GHS Portal
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="text-gray-600 hover:text-primary font-medium transition-colors">
              Beranda
            </Link>
            <Link href="#tentang" className="text-gray-600 hover:text-primary font-medium transition-colors">
              Tentang
            </Link>
            <Link href="#program" className="text-gray-600 hover:text-primary font-medium transition-colors">
              Program
            </Link>
            <Link href="#kontak" className="text-gray-600 hover:text-primary font-medium transition-colors">
              Kontak
            </Link>
          </div>

          {/* Call to Action */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/login" 
              className="text-primary font-medium hover:text-primary-hover transition-colors px-4 py-2"
            >
              Masuk
            </Link>
            <Link 
              href="/register" 
              className="bg-primary text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-hover hover-lift shadow-soft transition-all"
            >
              Daftar
            </Link>
          </div>

          {/* Mobile menu button (placeholder) */}
          <div className="md:hidden flex items-center">
            <button className="text-gray-600 hover:text-primary focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
