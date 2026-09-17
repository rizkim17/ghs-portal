<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:ghs-ui-design-rules -->
# Aturan Desain UI GHS Portal

Sebelum membuat atau mengedit komponen frontend, WAJIB baca `.agents/skills/ghs-ui-design/SKILL.md`. Aturan utama:

1. **Warna**: HANYA gunakan palet primary (`bg-primary` #0066FF, `text-primary`) + netral (`gray-*`, `white`). Warna lain (green, red, amber) HANYA untuk status. DILARANG: `purple-*`, `indigo-*`, `violet-*`, `orange-*`, `cyan-*`, `pink-*`, `teal-*`.
2. **Ikon**: DILARANG menggunakan emoji (🖥️ 📚 🔒 ✅ ❌ dll) di frontend. Gunakan inline SVG (Heroicons style).
3. **Tampilan**: Profesional, bersih, corporate. Hindari warna-warni berlebihan. Utamakan hierarki visual melalui font weight/size/opacity.
4. **Responsive WAJIB**: Setiap komponen HARUS rapi di HP (320px+), tablet (768px+), dan desktop. Gunakan mobile-first: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`. Padding lebih kecil di mobile (`p-4 md:p-6`). Flex stack di mobile (`flex-col sm:flex-row`).
<!-- END:ghs-ui-design-rules -->
