---
name: ghs-ui-design
description: >-
  Aturan desain UI GHS Portal. Wajib dibaca sebelum membuat atau mengedit
  komponen frontend. Mengatur warna, tipografi, ikon, dan pola komponen.
---

# GHS Portal — Aturan Desain UI

## Prinsip Utama

1. **Profesional & bersih** — Tampilan harus terasa corporate/enterprise, bukan AI-generated. Hindari elemen dekoratif berlebihan.
2. **Warna konsisten** — Gunakan HANYA palet warna yang sudah didefinisikan. Tidak boleh ada warna acak.
3. **Tanpa emoji** — DILARANG menggunakan emoji (🖥️ 📚 ✅ ❌ dll) sebagai ikon di frontend. Gunakan SVG icons atau Tailwind class saja.
4. **Hierarki visual** — Bedakan tingkat kepentingan melalui weight, size, dan opacity — bukan melalui warna mencolok.
5. **Responsive wajib** — Setiap komponen HARUS tampil rapi di semua ukuran layar: HP (320px+), tablet (768px+), dan desktop (1024px+). Gunakan pendekatan mobile-first.

---

## Responsive Design

### Breakpoint Tailwind (Wajib digunakan)

| Prefix | Min Width | Target Device |
|:-------|:----------|:--------------|
| *(tanpa prefix)* | 0px | HP / Mobile (default) |
| `sm:` | 640px | HP landscape / HP besar |
| `md:` | 768px | Tablet portrait |
| `lg:` | 1024px | Tablet landscape / Laptop |
| `xl:` | 1280px | Desktop |

### Pendekatan: Mobile-First

Selalu tulis style untuk mobile DULU, lalu tambahkan override untuk layar lebih besar:

```tsx
// ✓ BENAR — mobile first
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// ✗ SALAH — desktop first tanpa responsive
<div className="grid grid-cols-3 gap-4">
```

### Aturan Layout Responsive

#### Grid & Kolom

```tsx
// Card grid: 1 kolom di HP, 2 di tablet, 3 di desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Form layout: full-width di HP, sidebar di desktop
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-1">{/* form */}</div>
  <div className="lg:col-span-2">{/* list */}</div>
</div>

// 2 kolom form fields: stack di HP, side-by-side di tablet+
<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
```

#### Flex & Wrap

```tsx
// Toolbar/action bar: stack vertikal di HP, horizontal di tablet+
<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">

// Badge row: wrap di HP
<div className="flex flex-wrap gap-2">
```

#### Padding & Spacing

```tsx
// Container padding: lebih kecil di HP
<div className="p-4 md:p-6 lg:p-8">

// Card padding
<div className="p-4 md:p-6">
```

#### Tipografi Responsive

```tsx
// Heading: lebih kecil di HP
<h1 className="text-2xl md:text-3xl font-bold">
<h2 className="text-lg md:text-xl font-bold">
```

#### Sidebar / Navigation

```tsx
// Sidebar: hidden di HP, tampil di desktop
<aside className="hidden lg:block w-64">
// Mobile menu: tampil di HP, hidden di desktop
<button className="lg:hidden">Menu</button>
```

#### Tabel

```tsx
// Tabel: horizontal scroll di HP
<div className="overflow-x-auto">
  <table className="min-w-full">...</table>
</div>

// Atau konversi ke card di HP:
<div className="hidden md:block">{/* tabel desktop */}</div>
<div className="md:hidden space-y-3">{/* card list mobile */}</div>
```

#### Gambar & Media

```tsx
// Gambar responsive
<img className="w-full h-auto rounded-xl" />

// Aspect ratio terjaga
<div className="aspect-video rounded-xl overflow-hidden">
  <img className="w-full h-full object-cover" />
</div>
```

### Pola Komponen Responsive

#### Card Responsive

```tsx
<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-5">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
    <div className="min-w-0">
      <h3 className="font-semibold text-gray-900 text-sm truncate">{title}</h3>
      <p className="text-xs text-gray-400 mt-0.5">{description}</p>
    </div>
    <div className="flex items-center gap-2 flex-shrink-0">
      <Link className="..." href={url}>Kelola</Link>
    </div>
  </div>
</div>
```

#### Button Group Responsive

```tsx
<div className="flex flex-col sm:flex-row gap-2">
  <button className="w-full sm:w-auto bg-primary text-white py-2.5 px-4 rounded-xl text-sm font-medium">
    Aksi Utama
  </button>
  <button className="w-full sm:w-auto border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl text-sm font-medium">
    Aksi Sekunder
  </button>
</div>
```

#### Form Responsive

```tsx
<form className="space-y-4">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Field 1</label>
      <input className="block w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Field 2</label>
      <input className="block w-full rounded-xl border border-gray-200 px-3 py-2 text-sm" />
    </div>
  </div>
  <button className="w-full bg-primary text-white py-2.5 rounded-xl text-sm font-medium">
    Simpan
  </button>
</form>
```

### Checklist Responsive (WAJIB dicek sebelum submit)

- [ ] Grid menggunakan `grid-cols-1` sebagai default, lalu `md:grid-cols-2` / `lg:grid-cols-3`
- [ ] Teks tidak overflow — gunakan `truncate`, `line-clamp-*`, atau `break-words`
- [ ] Button full-width di mobile (`w-full sm:w-auto`)
- [ ] Padding lebih kecil di mobile (`p-4 md:p-6`)
- [ ] Flex items wrap/stack di mobile (`flex-col sm:flex-row`)
- [ ] Tabel punya `overflow-x-auto` wrapper
- [ ] Tidak ada fixed width yang melebihi layar HP (min 320px)
- [ ] Font size readable di HP (min `text-xs` = 12px)

## Palet Warna

### Warna Utama (Primary)

Semua warna utama sudah didefinisikan di `globals.css`:

```
Primary:       #0066FF (bg-primary, text-primary)
Primary Hover: #0052CC (bg-primary-hover)
Secondary:     #f0f7ff (bg-secondary) — biru sangat muda untuk background
```

### Warna Netral

```
Background:    #FFFFFF (bg-white, bg-background)
Surface:       #FFFFFF (bg-surface)
Surface Muted: #f8fafc (bg-surface-muted)
Foreground:    #171717 (text-foreground)
```

### Penggunaan Tailwind — Yang Diperbolehkan

| Kebutuhan | Class yang digunakan | DILARANG |
|:----------|:--------------------|:---------|
| Teks utama | `text-foreground`, `text-gray-900` | `text-indigo-*`, `text-violet-*` |
| Teks sekunder | `text-gray-600`, `text-gray-500` | `text-amber-*`, `text-cyan-*` |
| Teks muted | `text-gray-400` | Warna lain |
| Background utama | `bg-white`, `bg-surface` | |
| Background section | `bg-gray-50`, `bg-surface-muted` | `bg-yellow-*`, `bg-pink-*` |
| Aksen/CTA | `bg-primary`, `text-primary` | `bg-indigo-*`, `bg-violet-*` |
| Aksen hover | `bg-primary/5`, `bg-primary/10` | |
| Border | `border-gray-100`, `border-gray-200` | `border-indigo-*` |
| Sukses | `bg-green-50 text-green-700`, `border-green-200` | |
| Error/Gagal | `bg-red-50 text-red-600` | |
| Warning | `bg-amber-50 text-amber-700` (hemat, hanya bila perlu) | |

### Warna Status — Aturan Ketat

Warna di luar palet netral dan primary HANYA boleh digunakan untuk **status/state**:

- **Hijau** (`green-*`) → Lulus, berhasil, aktif, published
- **Merah** (`red-*`) → Gagal, error, hapus
- **Amber** (`amber-*`) → Warning, draft, perlu perhatian

**DILARANG** menggunakan: `purple-*`, `indigo-*`, `violet-*`, `orange-*`, `cyan-*`, `pink-*`, `teal-*` kecuali sudah ada di palet yang didefinisikan.

---

## Ikon

### DILARANG

```
❌ Emoji sebagai ikon: 🖥️ 📚 🏗️ ✅ ❌ 🔒 🚀 🔄 💡 📝
❌ Emoji dalam badge, button, heading, card
❌ Emoji dalam teks deskriptif
```

### Yang Digunakan

Gunakan **inline SVG** dengan class Tailwind. Contoh pola yang sudah ada di Sidebar:

```tsx
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="..." />
</svg>
```

Atau gunakan **teks karakter** sederhana untuk indikator status kecil:

```tsx
// Status badges - boleh
<span className="text-green-700 font-bold">✓</span>  // checkmark karakter
<span className="text-red-600 font-bold">✗</span>    // x karakter
```

### SVG Icon Reference (Heroicons Outline style)

Simpan pola-pola ini untuk reuse:

- **Buku/Pelajaran**: `M12 6.253v13m0-13C10.832...` (book-open)
- **Soal/Ujian**: `M9 5H7a2 2 0 00-2 2v12...` (clipboard-check)
- **User**: `M16 7a4 4 0 11-8 0...` (user)
- **Chart/Hasil**: `M9 17v-2m3 2v-4m3 4v-6...` (chart-bar)
- **Lock**: `M12 15v2m-6 4h12a2 2 0 002-2v-6...` (lock-closed)
- **Clock/Timer**: `M12 8v4l3 3m6-3a9 9 0 11-18 0...` (clock)
- **Plus/Tambah**: `M12 4v16m8-8H4` (plus)
- **Arrow left**: `M10 19l-7-7m0 0l7-7m-7 7h18` (arrow-left)
- **Trash/Hapus**: `M19 7l-.867 12.142A2 2 0 0116.138 21H7.862...` (trash)

---

## Tipografi

- **Font**: Inter (sudah dikonfigurasi di layout.tsx)
- **Heading halaman**: `text-2xl font-bold text-foreground` atau `text-3xl font-bold text-foreground`
- **Sub-heading**: `text-lg font-semibold text-gray-900`
- **Card title**: `text-sm font-semibold text-gray-900`
- **Label form**: `text-sm font-medium text-gray-700`
- **Teks bantu/deskripsi**: `text-sm text-gray-500` atau `text-xs text-gray-400`
- **Badge/tag**: `text-xs font-semibold`

---

## Pola Komponen

### Card

```tsx
<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
  {/* konten */}
</div>
```

### Button Primary

```tsx
<button className="bg-primary text-white py-2.5 px-4 rounded-xl text-sm font-medium hover:bg-primary-hover transition-colors">
  Label
</button>
```

### Button Danger

```tsx
<button className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors">
  Hapus
</button>
```

### Badge Status

```tsx
// Published
<span className="bg-green-50 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">Published</span>

// Draft
<span className="bg-gray-100 text-gray-500 text-xs font-semibold px-2 py-0.5 rounded-full">Draft</span>

// Lulus
<span className="bg-green-50 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">Lulus</span>

// Gagal
<span className="bg-red-50 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">Belum Lulus</span>
```

### Form Input

```tsx
<input className="block w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:ring-primary" />
```

### Empty State

```tsx
<div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
  <p className="text-gray-500">Pesan kosong.</p>
</div>
```

---

## Contoh yang SALAH vs BENAR

### ❌ SALAH (AI Slop)

```tsx
// Warna acak, emoji, terlalu banyak variasi warna
<span className="bg-orange-100 text-orange-800">🖥️ JFT-Basic</span>
<span className="bg-purple-100 text-purple-800">🏗️ SSW</span>
<span className="bg-violet-50 text-violet-600">4 Seksi Berurutan</span>
<span className="bg-amber-50 text-amber-600">🔊 Audio Maks 2x</span>
<h2>🖥️ Simulasi Ujian CBT</h2>
<button>🚀 Mulai Simulasi</button>
```

### ✓ BENAR (Profesional)

```tsx
// Konsisten primary + netral, tanpa emoji, hierarki jelas
<span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-full">JFT-Basic</span>
<span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded-full">SSW</span>
<span className="text-xs text-gray-500">4 Seksi · 60 menit</span>
<h2 className="text-xl font-bold text-foreground">Simulasi Ujian CBT</h2>
<button className="bg-primary text-white ...">Mulai Simulasi</button>
```
