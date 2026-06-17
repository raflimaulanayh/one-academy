# Teknologi & Framework (Tech Stack)

Proyek ini menggunakan kombinasi teknologi modern untuk performa maksimal, skalabilitas, dan pengalaman developer yang optimal.

## Framework Utama

- **[Next.js 16.2.1 (App Router)](https://nextjs.org/)**: Framework React terbaru untuk performa tinggi, SEO optimal, dan dukungan **Turbopack (bun dev:turbo)** untuk kecepatan build yang sangat cepat.
- **[React 19.2.4](https://react.dev/)**: Menggunakan versi React terbaru dengan fitur-fitur modern seperti `use` dan integrasi Server Components yang lebih baik.

## UI & Styling

- **[Tailwind CSS 4.0](https://tailwindcss.com/)**: Generasi terbaru dari Tailwind CSS dengan integrasi native ke CSS tanpa konfigurasi yang rumit.
- **[Shadcn UI](https://ui.shadcn.com/)**: Koleksi komponen UI yang modular dan dapat dikustomisasi, terpasang di folder `src/components/atoms/ui`.
- **[Lucide React](https://lucide.dev/) / [React Icons](https://react-icons.github.io/)**: Library ikon vektor berkualitas tinggi.
- **[Framer Motion](https://www.framer.com/motion/)**: Untuk animasi UI yang kompleks dan interaktif.
- **[GSAP](https://gsap.com/)**: Khusus untuk animasi performa tinggi dan manipulasi DOM tingkat lanjut.

## Backend & Database

- **[Supabase](https://supabase.com/)**: Backend-as-a-Service berbasis PostgreSQL. Digunakan untuk autentikasi, database, storage, dan real-time subscriptions.
- **[Drizzle ORM](https://orm.drizzle.team/)**: ORM TypeScript-first yang ringan dan type-safe. Digunakan untuk mendefinisikan schema, menjalankan query, dan mengelola migrasi database.

## State & Data Management

- **[Zustand](https://zustand-demo.pmnd.rs/)**: State management ringan namun powerful untuk skala aplikasi besar.
- **[SWR](https://swr.vercel.app/)**: Untuk penanganan data fetching dari server dengan caching, revalidation, dan _optimistic update_.
- **[Axios](https://axios-http.com/)**: HTTP Client untuk interaksi ke API/backend.
- **[React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)**: Untuk manajemen form yang responsif dengan validasi skema yang ketat.

## Autentikasi

- **[NextAuth.js v4](https://next-auth.js.org/)**: Digunakan untuk mengelola sesi user melalui provider _Credentials_ yang terhubung ke Supabase.

## AI Integration

- **[Vercel AI SDK](https://sdk.vercel.ai/)**: Framework untuk integrasi AI ke aplikasi Next.js.
- **[Google Gemini](https://ai.google.dev/)**: Model AI untuk chatbot asisten akademik.

## Progressive Web App

- **[next-pwa](https://github.com/shadowwalker/next-pwa)**: Plugin Next.js untuk mengaktifkan fitur Progressive Web App — memungkinkan instalasi di perangkat mobile dan akses offline.

## Utilitas Tambahan

- **[Moment.js](https://momentjs.com/) / [Moment Timezone](https://momentjs.com/timezone/)**: Penanganan format tanggal dan waktu berdasarkan zona waktu Indonesia.
- **[XLSX](https://github.com/SheetJS/sheetjs)**: Digunakan untuk ekspor/impor data Excel ke sistem.
- **[Papa Parse](https://www.papaparse.com/)**: Untuk memproses file CSV dengan cepat.
- **[Clsx](https://github.com/lukeed/clsx) & [Tailwind Merge](https://github.com/dcastil/tailwind-merge)**: Untuk manajemen class CSS dinamis.

---

(c) 2026 One Academy — SATU University. Dokumentasi Teknis.
