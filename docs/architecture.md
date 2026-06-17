# Arsitektur & Struktur Folder (Architecture)

Proyek ini menggunakan pola **Atomic Design** yang telah dimodifikasi untuk pengembangan antarmuka pengguna (UI) yang lebih efisien dan terstruktur dengan baik.

## Atomic Design

Terletak pada folder `src/components`, komponen dibagi menjadi 5 tingkatan utama:

1.  **Atoms (`src/components/atoms/`)**:
    - Unit dasar terkecil UI yang tidak bisa dipisah lagi.
    - Termasuk komponen dasar seperti `Button`, `Input`, `Loader`, dan komponen bawaan dari **Shadcn UI** yang diletakkan di `src/components/atoms/ui/`.
2.  **Molecules (`src/components/molecules/`)**:
    - Gabungan dari dua atau lebih komponen atom yang memiliki fungsionalitas tertentu.
    - Digunakan untuk potongan unit kecil yang dapat digunakan kembali antar halaman.
3.  **Organisms (`src/components/organisms/`)**:
    - Komponen yang lebih kompleks melalui penggabungan molecules dan atoms.
    - Seringkali membentuk bagian besar seperti Navigation Bar, Header, Leaderboard, atau Footer.
4.  **Templates (`src/components/templates/`)**:
    - Kerangka kerja tata letak (_layout skeleton_) yang menentukan struktur halaman dasar.
    - Fokus pada susunan layout tanpa peduli dengan konten akhirnya. Contoh: `GeneralLayout` atau `Container`.
5.  **Providers (`src/components/providers/`)**:
    - Kontainer untuk data global atau konteks seperti `SessionProvider` (NextAuth), `SWRConfig`, dan `ClientProvider`.

## Struktur Folder Luar

| Folder           | Kegunaan                                                                                        |
| ---------------- | ----------------------------------------------------------------------------------------------- |
| `src/app/`       | Struktur utama aplikasi Next.js (Pages, Routing, API, Layouts).                                 |
| `src/constants/` | Pusat penyimpanan data statis seperti data menu, metadata, informasi platform, dan konfigurasi. |
| `src/db/`        | Schema Drizzle ORM, konfigurasi database, dan migrasi.                                          |
| `src/hooks/`     | Menyimpan custom React hooks untuk logika yang dapat digunakan kembali ke banyak komponen.      |
| `src/services/`  | Tempat penanganan permintaan API (Axios/SWR) dan logika autentikasi (NextAuth + Supabase).      |
| `src/shared/`    | Aset global seperti file CSS (globals.css), tipografi, dan file CSS khusus lainnya.             |
| `src/utils/`     | Kumpulan fungsi pembantu (helper) untuk manipulasi data (format angka, tanggal, `cn`, dsb).     |
| `supabase/`      | Konfigurasi Supabase, seed data, dan migrasi database.                                          |
| `types/`         | Definisi tipe TypeScript global dan module augmentation (misalnya untuk NextAuth).              |

## Middleware & Proteksi (Role-Based Access Control)

Seluruh logika proteksi rute diatur dalam `src/proxy.ts`. Middleware ini berfungsi untuk:

- Melakukan verifikasi sesi login melalui `getToken` dari NextAuth.
- Menentukan rute yang diperbolehkan berdasarkan role pengguna (`ADMIN` atau `STUDENT`).
- Melakukan pengalihan (_redirection_) otomatis jika pengguna mencoba mengakses rute yang tidak sah atau jika profil mereka belum lengkap.

### Role & Akses

| Role        | Akses          | Deskripsi                                                         |
| ----------- | -------------- | ----------------------------------------------------------------- |
| **ADMIN**   | `/admin/*`     | Administrator platform — kelola modul, sekolah, dan database.     |
| **STUDENT** | `/dashboard/*` | Siswa/Mahasiswa — akses portal belajar, kehadiran kelas, dan LMS. |

## Lokalisasi Bilingual (Bilingual Setup)

Sistem lokalisasi dua bahasa (Bahasa Indonesia & Bahasa Inggris) diimplementasikan pada halaman publik menggunakan library `next-intl` dengan ketentuan sebagai berikut:

### Konfigurasi Routing

- **Bahasa Indonesia (Default)**: Menggunakan root URL secara langsung tanpa prefiks (contoh: `/` atau `/chatbot`). Diatur menggunakan `defaultLocale: 'id'` dan `localePrefix: 'as-needed'`.
- **Bahasa Inggris**: Menggunakan prefiks bahasa `/en` pada URL (contoh: `/en` atau `/en/chatbot`).
- **Pengecualian**: Halaman internal (`/admin/*` dan `/dashboard/*`) tidak mendukung bilingual dan tetap menggunakan satu bahasa saja (Bahasa Inggris).

### Navigasi dan Link

- Navigasi dalam aplikasi wajib menggunakan komponen `Link` yang diimpor dari `@/i18n/routing` sebagai pengganti `next/link`. Hal ini memastikan prefiks locale `/en` ditambahkan secara otomatis ketika pengguna berada dalam mode Bahasa Inggris.
- Untuk mengintegrasikan dengan komponen UI dasar (seperti `Button`), gunakan properti `asChild` pada `Button` dan letakkan `<Link>` dari `@/i18n/routing` di dalamnya untuk menghindari modifikasi komponen UI inti.

### File Terjemahan (Messages)

Seluruh pesan teks statis diletakkan di dalam folder `src/shared/jsons/messages/`:

- `id.json`: Berisi terjemahan untuk antarmuka dalam Bahasa Indonesia.
- `en.json`: Berisi terjemahan untuk antarmuka dalam Bahasa Inggris.

### Integrasi AI Chatbot

- Pada saat memanggil API `/api/chat`, sistem mendeteksi locale aktif dari URL (`/en` atau lainnya) lalu mengirimkan parameter `lang` (`id` atau `en`) ke API.
- Route API `/api/chat` secara dinamis memilih system prompt (`SYSTEM_PROMPT` untuk ID atau `SYSTEM_PROMPT_EN` untuk EN) serta menerjemahkan skema Zod untuk tool AI agar respons chatbot tetap konsisten sesuai bahasa halaman.

---

(c) 2026 One Academy — SATU University. Dokumentasi Arsitektur.
