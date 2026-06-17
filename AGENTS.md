# Agent System Instructions: One Academy Project

You are an expert full-stack developer assistant specialized in Next.js 16 and modern React patterns.

---

## Project Overview

- **Name:** One Academy
- **Type:** LMS SaaS (Learning Management System as a Service) — Modular LMS supporting SD, SMP, SMA, and Universities
- **Backend:** Supabase (PostgreSQL) with Drizzle ORM
- **Language:** Indonesian (Bahasa Indonesia) — all user-facing UI copy must be in Indonesian.

### Platform Purpose

**One Academy** adalah platform LMS (Learning Management System) SaaS yang dirancang khusus untuk mendukung seluruh jenjang pendidikan mulai dari Sekolah Dasar (SD), Sekolah Menengah Pertama (SMP), Sekolah Menengah Atas (SMA), hingga Perguruan Tinggi (Universitas).

Tujuan utama sistem ini adalah menyediakan lingkungan belajar modular yang terintegrasi untuk siswa/mahasiswa dan pengajar:

1. **Landing Page & Profile (Public):** Pengenalan platform, pendaftaran siswa per batch, artikel edukasi, dan asisten belajar AI.
2. **Student Member Portal (Active):** Portal utama bagi siswa/mahasiswa untuk melacak kehadiran, mengakses materi LMS modular, mengerjakan tugas, dan memantau nilai akademik.
3. **Lecturer & Admin Dashboard (Deferred):** CMS manajemen modul, monitoring keaktifan siswa, dan rekapitulasi data akademik.

### Core Features

| No  | Feature                 | Description                                                                  |
| --- | ----------------------- | ---------------------------------------------------------------------------- |
| 1   | **Landing Page**        | Public website: informasi platform, showcase modul belajar, artikel, chatbot |
| 2   | **Pendaftaran Siswa**   | Sistem registrasi siswa per batch/angkatan                                   |
| 3   | **Attendance System**   | Pencatatan kehadiran siswa di setiap kelas/kegiatan belajar                  |
| 4   | **Modular LMS**         | Platform modul pembelajaran (LMS) modular sesuai tingkat pendidikan          |
| 5   | **Notifikasi Akademik** | Pemberitahuan tugas dan pengumuman dari pengajar                             |

### Student Role Flow

1. **Registrasi:** Calon siswa/mahasiswa mengisi formulir pendaftaran.
2. **Verifikasi:** Admin memverifikasi dan menyetujui akun pendaftaran.
3. **Akses Portal:** Siswa masuk ke Dashboard Portal untuk mengikuti kegiatan belajar kelas yang aktif.
4. **Pembelajaran:** Siswa mengakses materi LMS modular, mencatatkan presensi kelas, dan berinteraksi dengan asisten belajar AI.

### User Roles & Flow

| Role            | Access         | Description                                                                                        |
| --------------- | -------------- | -------------------------------------------------------------------------------------------------- |
| **STUDENT**     | `/dashboard/*` | **(PRIMARY ACTIVE)** Siswa/Mahasiswa aktif — Akses portal belajar, presensi kelas, dan materi LMS. |
| **SUPER_ADMIN** | `/admin/*`     | _(DEFERRED)_ Kontrol penuh sistem dan database (Level 100).                                        |
| **ADMIN**       | `/admin/*`     | _(DEFERRED)_ Pengelola instansi/sekolah — Manajemen kelas dan modul LMS (Level 80).                |
| **TEACHER**     | `/admin/*`     | _(DEFERRED)_ Guru/Dosen/Mentor — Menginput tugas, materi, dan menilai siswa (Level 60).            |
| **CANDIDATE**   | `/register/*`  | Calon siswa baru — Mengisi formulir pendaftaran (Level 20).                                        |

**Authentication Flow:**

1. User login via credentials yang diverifikasi terhadap Supabase.
2. JWT token menyimpan `role` dan `accountComplete` flag.
3. Jika `accountComplete === false`, user diredirect ke `/register/detail` untuk melengkapi profil siswa.
4. Middleware (`src/proxy.ts`) mengontrol akses rute berdasarkan role (hanya STUDENT yang aktif dalam demo ini).

---

## Technical Stack (STRICT ADHERENCE REQUIRED)

| Category             | Technology                                              |
| -------------------- | ------------------------------------------------------- |
| **Framework**        | Next.js 16.2.1 (App Router + Turbopack)                 |
| **Runtime**          | Bun (always prefer `bun` over `npm`/`yarn`)             |
| **Language**         | TypeScript 5 (strict mode)                              |
| **UI Library**       | React 19                                                |
| **Styling**          | Tailwind CSS 4.0 (with native CSS variables via @theme) |
| **UI Components**    | Shadcn UI (in `src/components/atoms/ui/`)               |
| **State Management** | Zustand (global state), SWR (server state/fetching)     |
| **HTTP Client**      | Axios                                                   |
| **Forms**            | React Hook Form + Zod                                   |
| **Auth**             | NextAuth.js v4 (Credentials provider, JWT strategy)     |
| **Animation**        | Framer Motion, GSAP                                     |
| **Icons**            | React Icons, Phosphor Icons                             |
| **AI Integration**   | Vercel AI SDK + Google Gemini                           |
| **Backend**          | Supabase (PostgreSQL)                                   |
| **ORM**              | Drizzle ORM                                             |
| **PWA**              | next-pwa (Progressive Web App)                          |

---

## Design System & Style Guide

The project uses a custom design system defined in `src/shared/styles/globals.css`:

```css
--color-primary: #008ae3; /* LMS Primary Blue */
--color-secondary: #00b0ff; /* LMS Secondary Accent */
--color-navy-dark: #003057; /* Navy Dark (Layout/Sidebar) */
--color-navy-medium: #004d80; /* Navy Medium */
--color-navy-active: #006eb5; /* Navy Active */
```

**Key rules:**

- Use these CSS variables for all theming — do not introduce arbitrary colors.
- CTA gradients use `.bg-cta-gradient` (a linear gradient from primary to secondary).
- All interactive elements (`button`, `a`) have `hover:scale-[0.98]` by default.
- Use `cn()` from `@/utils` for conditional Tailwind class merging (powered by `clsx` + `tailwind-merge`).`+`tailwind-merge`).

---

## Architecture & Coding Conventions

### Atomic Design (STRICT)

Components in `src/components/` follow Atomic Design methodology:

| Layer         | Path                        | Description                                     |
| ------------- | --------------------------- | ----------------------------------------------- |
| **Atoms**     | `src/components/atoms/`     | Smallest UI units (Button, Input, Badge).       |
| **Molecules** | `src/components/molecules/` | Combinations of atoms (SearchBar, FormField).   |
| **Organisms** | `src/components/organisms/` | Complex sections (Navbar, Sidebar, MemberCard). |
| **Templates** | `src/components/templates/` | Page-level layouts (GeneralLayout, Container).  |
| **Providers** | `src/components/providers/` | Context/Session providers (ClientProvider).     |

### Folder Structure

```
src/
├── app/            # Next.js App Router (Pages, API Routes, Layouts)
├── components/     # UI Components (Atomic Design)
├── constants/      # Static data, menu configs, site metadata
├── context/        # React Context providers
├── db/             # Drizzle ORM schema definitions & migrations
├── hooks/          # Custom React hooks
├── restapi/        # REST API endpoint definitions (generated via Plop)
├── services/       # API integration & auth config
├── shared/         # Global styles, typography, custom CSS
├── stores/         # Zustand state stores
├── utils/          # Helper functions (formatNumber, cn, etc.)
└── proxy.ts        # Middleware for RBAC route protection
```

### Import Aliases

Always use absolute path aliases — never use relative paths like `../../`:

```typescript
import { Button } from '@/components/atoms/ui/button'
import { cn } from '@/utils'
import { EMAIL_CONTACT } from '@/constants/general-data'
```

Available aliases: `@/components`, `@/utils`, `@/services`, `@/constants`, `@/hooks`, `@/types`, `@/stores`, `@/context`, `@/restapi`, `@/db`.

---

## Backend & Database Architecture (Supabase + Drizzle ORM)

This project uses **Supabase** (hosted PostgreSQL) as the backend database, with **Drizzle ORM** for type-safe schema management and queries.

### Core Implementation Rules

1. **Schema-First Development**:
   - Define all table schemas in `src/db/schema/` using Drizzle ORM.
   - Use `drizzle-kit` for migrations (`bun drizzle-kit generate`, `bun drizzle-kit push`).
   - Every table MUST have `createdAt` and `updatedAt` timestamp columns.

2. **Supabase Integration**:
   - Use Supabase client for auth operations and real-time subscriptions.
   - Use Drizzle ORM for all database queries (not Supabase JS client for CRUD).
   - Row Level Security (RLS) policies MUST be configured for sensitive tables.

3. **API Design**:
   - All database operations go through Next.js Route Handlers (`/app/api/...`).
   - Never expose Supabase credentials in client-side code.
   - Use Next.js Server Actions where appropriate for mutations.

4. **Key Database Tables** (planned):
   - `members` — data anggota komunitas
   - `batches` — batch/angkatan pendaftaran
   - `events` — kegiatan komunitas
   - `attendances` — kehadiran anggota per kegiatan
   - `materials` — materi LMS
   - `articles` — artikel yang dipublikasikan
   - `projects` — showcase project komunitas
   - `notifications` — notifikasi dari pengurus

5. **Performance**:
   - Implement proper pagination using cursor-based or offset pagination.
   - Use database indexes for frequently queried columns.
   - Leverage Supabase real-time for live updates (attendance, notifications).

---

## Development Workflow

| Command                   | Description                                |
| ------------------------- | ------------------------------------------ |
| `bun dev:turbo`           | Start dev server with Turbopack            |
| `bun run build`           | Production build                           |
| `bun run lint:fix`        | Auto-fix linting errors                    |
| `bun run typecheck`       | Run TypeScript type checking               |
| `bun run prettier:format` | Format all code with Prettier              |
| `bun generate`            | Create new components/API folders via Plop |

---

## Critical Rules

1. **NEVER** downgrade libraries or suggest code that uses Next.js `pages/` directory patterns.
2. **NEVER** ignore the `accountComplete` flag in authentication flows.
3. **NEVER** modify Shadcn UI base components in `src/components/atoms/ui/` unless explicitly asked.
4. **ALWAYS** use Indonesian (Bahasa Indonesia) for all user-facing text (buttons, labels, messages, placeholders).
5. **ALWAYS** check `src/constants/` before hardcoding any strings, URLs, or data.
6. **ALWAYS** use `cn()` for conditional class merging instead of template literals.
7. **ALWAYS** use Drizzle ORM for database queries — never raw SQL in application code.
8. **ALWAYS** implement RLS policies for user-specific data in Supabase.
9. **DOCUMENT COMPLEX LOGIC**: Jika membuat fitur dengan logika bisnis yang kompleks, **WAJIB** membuat dokumentasi teknis di folder `docs/` agar sistem mudah dipelihara.
10. **PREFER CLEAN CODE & LOGS**: DILARANG menggunakan ikon/emoji dalam komentar kode, f-string, atau console log. Gunakan teks yang lugas dan profesional.
11. **NAMING CONVENTION**: Nama variabel, fungsi, atau class **MAKSIMAL 3 KATA** (contoh: `getUserData`, `calculateScore`). Jangan terlalu panjang.
12. **NO UNNECESSARY COMMENTS**: Jangan membuat komentar yang hanya menjelaskan baris kodingan yang sudah jelas. Komentar hanya untuk logika bisnis yang kompleks.
13. **PHOSPHOR ICONS**: Saat menggunakan ikon dari `@phosphor-icons/react`, **SELALU** gunakan versi dengan akhiran `Icon` (contoh: `InstagramLogoIcon`, BUKAN `InstagramLogo`) untuk menghindari deprecated imports.

---
