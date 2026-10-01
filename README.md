# SisaBerapa? 💸 — Catatan Keuangan Mahasiswa Anti-Bokek

Aplikasi web modern, santai, dan responsif untuk membantu mahasiswa mencatat pemasukan dan pengeluaran harian, menghitung sisa saldo aman, serta mengestimasi jatah jajan harian agar tidak kehabisan uang saku di akhir bulan.

## Fitur Utama
- **Sisa Saldo Aman**: Menghitung sisa saldo, total duit masuk, dan total duit keluar secara otomatis.
- **Jatah Jajan Aman Hari Ini**: Estimasi jatah belanja harian agar tidak boncos sebelum akhir bulan.
- **Kategori Mahasiswa**: Makan di warteg/kantin, bayar kosan, fotokopi diktat kuliah, paket data, nongkrong, dll.
- **Quick Amount Chips**: Tombol cepat untuk nominal (`+10 rb`, `+20 rb`, `+50 rb`, `+100 rb`, `+500 rb`).
- **Lucide Icons**: Integrasi ikon modern pada seluruh tombol, kartu statistik, dan item transaksi.
- **Micro-Interactions**: Animasi transisi halus hover (`transform: translateY(-2px)`) dan notifikasi toast 3 detik di pojok kanan atas.
- **3 Sampel Data Bawaan**: Layar langsung terisi saat pertama kali dibuka dengan contoh pengeluaran dan pemasukan realistis mahasiswa.
- **Filter & Pencarian**: Filter kategori transaksi, pencarian keterangan, dan pengurutan data.
- **Ekspor CSV**: Mengunduh seluruh catatan transaksi ke dalam format Excel/CSV.
- **Desain Modern Slate & Violet**: Palet warna Slate (`#0f172a`), aksen Violet (`#8b5cf6`), border tipis (`1px solid rgba(255,255,255,0.1)`), dan bayangan lembut.
- **Penyimpanan Lokal**: Otomatis tersimpan di peramban menggunakan `localStorage`.

## Teknologi
- HTML5 & Google Fonts (*Plus Jakarta Sans*)
- Vanilla CSS3 (Custom Properties, Glassmorphism, Micro-Interactions)
- Vanilla JavaScript (ES6+, LocalStorage, CSV Generation)
- Lucide Icons (CDN)

## Deploy ke Vercel
Aplikasi ini berbasis file statis murni sehingga dapat langsung di-deploy ke Vercel tanpa perlu build step apa pun.
