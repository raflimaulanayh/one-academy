# One Academy

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase)
![Bun](https://img.shields.io/badge/Bun-Ready-f9f9f9?style=for-the-badge&logo=bun)
![Version](https://img.shields.io/badge/version-0.1.0-blue?style=for-the-badge)

**Platform Learning Management System (LMS) modular, modern, dan terintegrasi untuk seluruh jenjang pendidikan (SD, SMP, SMA, Perguruan Tinggi).**

[Dokumentasi](docs/index.md) · [Figma Design](https://www.figma.com/design)

</div>

---

## Tentang One Academy

**One Academy** adalah platform Learning Management System (LMS) modular, modern, dan terintegrasi yang dirancang untuk melayani seluruh jenjang pendidikan: SD, SMP, SMA, dan Perguruan Tinggi (Universitas). 

Untuk kebutuhan presentasi klien saat ini, platform berfokus secara eksklusif pada peran **Siswa/Student/Mahasiswa** untuk mengakses materi pembelajaran, melacak kehadiran kelas, dan berinteraksi dengan AI tutor.

### Pilar Utama Platform

- **Modular LMS** — modul terstruktur sesuai jenjang pendidikan.
- **Presensi & Aktivitas** — pencatatan presensi kelas dan pelacakan progress belajar.
- **Asisten AI** — navigasi materi belajar dan FAQ seputar portal.

---

## Fitur Platform

### Publik (Community Profile)

- **Landing Page** — halaman perkenalan, visi-misi, dan informasi portal.
- **Leaderboard** — peringkat siswa/mahasiswa paling aktif dan rajin.
- **Showcase Project** — portofolio project hasil karya siswa/mahasiswa.
- **Artikel** — publikasi artikel, tutorial, dan insight akademik.
- **AI Chatbot** — asisten cerdas untuk menjawab pertanyaan seputar materi dan kelas.

### Member Portal (Authenticated)

- **Dashboard** — ringkasan aktivitas, kehadiran, dan pemberitahuan.
- **Pendaftaran Siswa** — sistem registrasi per batch/angkatan setiap tahun.
- **Attendance System** — pencatatan kehadiran di setiap kegiatan.
- **Simple LMS** — akses materi pembelajaran dan edukasi.
- **Notifikasi** — informasi penting dari pengurus ke anggota.

### Admin Panel (Pengurus)

- **CMS Dashboard** — manajemen konten website (artikel, project, halaman).
- **Manajemen Anggota** — kelola data anggota, verifikasi pendaftaran, batch.
- **Manajemen Kegiatan** — buat dan kelola jadwal kegiatan, attendance.
- **Materi LMS** — upload dan atur materi pembelajaran.
- **Statistik** — pantau metrik akademik secara real-time.

---

## Tech Stack

| Kategori      | Teknologi                      |
| ------------- | ------------------------------ |
| **Framework** | Next.js 16 (App Router)        |
| **Language**  | TypeScript 5                   |
| **UI**        | React 19, Tailwind CSS 4       |
| **Backend**   | Supabase (PostgreSQL)          |
| **ORM**       | Drizzle ORM                    |
| **State**     | Zustand, SWR                   |
| **Auth**      | NextAuth.js (JWT + Supabase)   |
| **Forms**     | React Hook Form + Zod          |
| **Animation** | Framer Motion, GSAP            |
| **Icons**     | React Icons, Phosphor Icons    |
| **AI**        | Vercel AI SDK + Google Gemini  |
| **PWA**       | next-pwa (Progressive Web App) |

---

## Struktur Proyek

```bash
one-academy/
├── src/
│   ├── app/                    # Next.js App Router (Pages, API, Layouts)
│   ├── components/             # Komponen UI (Atomic Design)
│   │   ├── atoms/              # Elemen dasar (Button, Input, UI)
│   │   ├── molecules/          # Gabungan komponen atom
│   │   ├── organisms/          # Bagian kompleks (Navbar, Sidebar)
│   │   ├── templates/          # Layout halaman
│   │   └── providers/          # Provider Context & Client
│   ├── constants/              # Data statis & konfigurasi
│   ├── context/                # React Context global
│   ├── db/                     # Drizzle ORM schema & migrations
│   ├── hooks/                  # Custom React hooks
│   ├── restapi/                # REST API endpoint definitions
│   ├── services/               # Integrasi API & Autentikasi
│   ├── shared/                 # Global styles & assets
│   ├── stores/                 # State management (Zustand)
│   ├── utils/                  # Helper functions (formatNumber, cn)
│   └── proxy.ts                # Middleware/Proxy untuk RBAC
├── supabase/                   # Supabase config & migrations
└── docs/                       # Dokumentasi teknis terpusat
```

---

## Langkah Awal (Getting Started)

### Prasyarat

- Node.js 18+
- [Bun](https://bun.sh/) (Sangat direkomendasikan) atau npm
- Akun [Supabase](https://supabase.com/) (gratis untuk development)

### Instalasi

1. **Clone repositori**

   ```bash
    git clone https://github.com/one-academy/one-academy.git
    cd one-academy
   ```

2. **Instalasi dependensi**

   ```bash
   bun install
   ```

3. **Pengaturan `.env`**

   ```bash
   cp .env.example .env
   ```

   _Isi variabel Supabase (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`) dan konfigurasi NextAuth._

4. **Jalankan development server**
   ```bash
   bun dev:turbo
   ```

### Versi & Rilis

Gunakan perintah berikut untuk mengupdate versi proyek:

- `bun version patch` : Untuk perbaikan bug (0.2.0 -> 0.2.1)
- `bun version minor` : Untuk fitur baru (0.2.0 -> 0.3.0)
- `bun version major` : Untuk perubahan besar (0.2.0 -> 1.0.0)

---

## Dokumentasi Detail

Dokumentasi sistem yang lebih mendalam tersedia di folder **[docs/](docs/index.md)**:

- **[Tech Stack](docs/tech-stack.md)**: Detail library dan versi.
- **[Arsitektur](docs/architecture.md)**: Detail Atomic Design dan RBAC.

---

## Skrip Tersedia

| Perintah                  | Deskripsi                     |
| ------------------------- | ----------------------------- |
| `bun dev:turbo`           | Jalan mode dev dengan Turbo   |
| `bun run build`           | Build untuk produksi          |
| `bun run lint:fix`        | Perbaiki error lint otomatis  |
| `bun run typecheck`       | Jalankan pengecekan tipe      |
| `bun run prettier:format` | Format kode dengan Prettier   |
| `bun generate`            | Generate komponen/file (Plop) |

---

<div align="center">

Made by [One Academy](https://oneacademy.id) — SATU University

</div>
