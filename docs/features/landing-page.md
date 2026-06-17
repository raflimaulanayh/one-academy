# Fitur Landing Page & Pricing Tier

Landing Page utama One Academy dirancang sebagai halaman etalase publik untuk memperkenalkan solusi LMS modular kami serta menyajikan pricing/layanan tier sekolah.

## Struktur Komponen

Halaman utama (`src/app/[locale]/page.tsx`) menyusun komponen-komponen berikut dari folder `src/components/organisms/landing-page/`:

1.  **Hero Section (`HeroSection.tsx`)**:
    -   Menampilkan tagline pemasaran utama dengan animasi *fade-in-up*.
    -   Tombol CTA Utama ("Mulai Belajar") yang mengarah ke `/register`.
    -   Tombol CTA Sekunder ("Lihat Modul") dengan efek gulir (*scroll anchor*) ke section `#pricing`.
2.  **About Section (`AboutSection.tsx`)**:
    -   Poin-poin visual keunggulan platform (Modul Terstruktur, Presensi Digital, AI Tutor).
    -   Tombol selengkapnya mengarah ke halaman profil `/about`.
3.  **Pricing Section (`PricingSection.tsx`)**:
    -   Kartu pricing grid untuk 4 jenjang pendidikan: SD, SMP, SMA, dan Universitas.
    -   Aksi tombol CTA mengarah ke halaman pendaftaran dengan *query param* level aktif (misal: `/register?tier=sd`) untuk melakukan pengisian otomatis (*auto-fill*).
4.  **Events Section (`EventsSection.tsx`)**:
    -   Menampilkan jadwal mentoring live virtual terdekat lengkap dengan detail waktu, tanggal, dan nama mentor.
5.  **Projects Section (`ProjectsSection.tsx`)**:
    -   Menyediakan galeri portofolio hasil tugas siswa yang terintegrasi dengan filter kategori interaktif (Semua, Web, Mobile, IoT).
6.  **FAQ Section (`FAQSection.tsx`)**:
    -   Accordion interaktif berbasis *Radix UI* untuk menjawab pertanyaan umum pendaftaran dan platform.
7.  **CTA Banner (`CTASection.tsx`)**:
    -   Banner gradasi Navy-Orange linear untuk memotivasi pendaftaran siswa.

## Lokalisasi Bilingual (Bilingual Setup)

Semua teks pada Landing Page sepenuhnya menggunakan kamus lokalisasi `next-intl` (`id.json` dan `en.json`) dengan deteksi locale berbasis prefix URL `/en` untuk Bahasa Inggris dan default root untuk Bahasa Indonesia.
