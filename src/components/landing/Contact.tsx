export default function Contact() {
  return (
    <section id="kontak" className="py-16 sm:py-20 bg-secondary px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-card overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-6 sm:p-8 lg:p-12 bg-primary text-white">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Hubungi Kami</h2>
            <p className="text-primary-100 text-sm sm:text-base mb-8 sm:mb-12 leading-relaxed">
              Punya pertanyaan mengenai program atau pendaftaran? Tim kami siap membantu Anda mewujudkan mimpi ke Jepang.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 sm:w-6 h-5 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base mb-1">Alamat Kantor</h4>
                  <p className="text-primary-100 text-xs sm:text-sm">Jl. Contoh Alamat LPK No. 123, Kota, Provinsi, 12345</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 sm:w-6 h-5 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base mb-1">Telepon / WhatsApp</h4>
                  <p className="text-primary-100 text-xs sm:text-sm">+62 812-3456-7890</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 sm:p-8 lg:p-12">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-6 sm:mb-8">Kirim Pesan</h3>
            <form className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="Masukkan nama Anda" />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Nomor WhatsApp</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="08xx-xxxx-xxxx" />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">Pesan</label>
                <textarea rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="Tuliskan pertanyaan Anda..."></textarea>
              </div>
              <button type="button" className="w-full bg-primary text-white py-3 sm:py-3.5 rounded-xl font-medium hover-lift shadow-card text-sm sm:text-base">
                Kirim Pesan
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
