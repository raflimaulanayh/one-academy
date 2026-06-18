# PRESENTATION NOTES — One Academy

> Catatan presentasi untuk demo One Academy (~20 menit)
> Bahasa: Santai & percaya diri. Jangan baca slide, ceritakan!

---

## TIMELINE PRESENTASI

| Waktu       | Durasi | Bagian                                     |
| ----------- | ------ | ------------------------------------------ |
| 00:00–01:30 | 1.5m   | Opening & Konteks Masalah                  |
| 01:30–03:00 | 1.5m   | Splash Screen & Intro Brand                |
| 03:00–06:00 | 3m     | Landing Page (Hero → Projects → Pricing)   |
| 06:00–07:30 | 1.5m   | Chatbot AI & Registrasi                    |
| 07:30–09:00 | 1.5m   | Login & Dashboard Overview                 |
| 09:00–11:00 | 2m     | LMS Modular & Materi Pembelajaran          |
| 11:00–12:30 | 1.5m   | Assignments & Jadwal                       |
| 12:30–14:00 | 1.5m   | Nilai & Transkrip Akademik                 |
| 14:00–15:30 | 1.5m   | Leaderboard & SAT Point                    |
| 15:30–17:00 | 1.5m   | Pembayaran UKT/SPP                         |
| 17:00–18:30 | 1.5m   | AI Assistant, Knowledge Graph & Chat       |
| 18:30–19:30 | 1m     | Settings, Dark Mode, Responsive            |
| 19:30–20:00 | 0.5m   | Penutup & Q&A                              |

---

## 1. OPENING & KONTEKS MASALAH (0:00 – 1:30)

**Buka dengan masalah nyata:**

- "Halo semuanya! Sebelum saya tunjukin proyeknya, coba bayangin dulu — sebagai mahasiswa, kalian pasti pernah dong harus buka 3-4 platform berbeda cuma buat cek jadwal, lihat nilai, download materi, dan bayar UKT? Ribet banget kan?"
- "Nah, dari masalah itu, saya membangun **One Academy** — satu platform LMS terintegrasi yang bisa menangani semua kebutuhan akademik, dari level SD sampai Universitas."
- Sebut tech stack secara singkat: "Dibangun pakai **Next.js 16**, **React 19**, **Tailwind CSS 4**, **Supabase** sebagai backend, dan sudah support **PWA** jadi bisa dipakai kayak native app."

> Jangan terlalu teknis di sini. Fokus ke masalah dan solusi.

---

## 2. SPLASH SCREEN & INTRO BRAND (1:30 – 3:00)

**Buka browser, akses `localhost:3000`**

- Ketika loading, akan muncul **Splash Screen** dengan animasi logo One Academy
- "Ini splash screen nya, dibuat pakai **GSAP** supaya terasa premium dan smooth — bukan cuma loading biasa."
- Tunggu sampai landing page muncul

**Poin yang perlu disebutkan:**
- Logo animasi brand yang custom
- Transisi smooth menuju halaman utama
- Kesan pertama yang profesional

---

## 3. LANDING PAGE (3:00 – 6:00)

### 3a. Hero Section
- "Ini halaman utama kita — Hero Section. Ada headline utama yang menjelaskan platform, CTA button untuk mulai, dan visual yang eye-catching."
- Tunjukin animasi scroll yang smooth
- "Desainnya pakai glassmorphism dan gradient yang konsisten dengan branding"
- Tunjukin juga **Navbar** di atas: ada logo, navigasi, **bilingual popover** (switch ID/EN), dan **dark/light mode toggle**

### 3b. About Section
- Scroll pelan ke bawah
- "Di sini kita jelasin tentang One Academy, fitur utamanya, kenapa platform ini beda dari yang lain"

### 3c. Pricing Section
- "Kita juga punya tiers pricing — untuk level SD, SMP, SMA, dan Universitas, masing-masing punya fitur yang disesuaikan"
- Tunjukin card pricing yang interaktif
- "Dari sini calon siswa bisa langsung klik daftar dan otomatis ter-direct ke halaman registrasi dengan jenjang yang sudah terpilih"

### 3d. Events Section
- "Ini section kegiatan/acara — menampilkan event-event yang tersedia di platform"

### 3e. Projects Section
- "Showcase proyek-proyek mahasiswa/siswa, ini penting banget buat portofolio mereka"
- Tunjukin card-card proyek dengan hover effect

### 3f. FAQ Section
- "FAQ section untuk menjawab pertanyaan umum, accordion-style supaya rapi"

### 3g. CTA Section
- "Dan ditutup dengan Call-to-Action untuk pendaftaran"

### 3h. Footer
- "Footer berisi informasi kontak, link penting, dan social media"

**Tips presentasi:**
- Scroll pelan-pelan, jangan buru-buru
- Pause sebentar di setiap section biar audiens bisa lihat
- Tunjukin hover effects di beberapa elemen

---

## 4. CHATBOT AI & REGISTRASI (6:00 – 7:30)

### 4a. AI Chatbot
- "Satu fitur menarik di landing page ini adalah **AI Chatbot**"
- Klik icon chat di pojok bawah
- "Ini chatbot yang powered by **Google Gemini AI** lewat Vercel AI SDK"
- Coba tanya sesuatu yang relevan, misal: "Apa saja fitur One Academy?"
- "Jadi calon siswa bisa tanya-tanya dulu sebelum daftar, tanpa harus kontak admin manual"

**Poin penting:**
- Real-time AI response
- Konteks chatbot sudah di-set untuk menjawab tentang One Academy
- Bisa digunakan pengunjung tanpa login

### 4b. Registrasi Siswa
- Klik CTA "Daftar Sekarang" dari landing page atau navigasi ke `/register`
- "Halaman registrasi ini desainnya split-screen: sebelah kiri branding, sebelah kanan form"
- Tunjukin form-nya: **Nama, Email, Password, Pilihan Jenjang** (SD/SMP/SMA/Universitas)
- "Form-nya pakai **Zod validation** dan **React Hook Form** untuk validasi real-time"
- "Setelah registrasi, user di-redirect ke halaman **detail profil** untuk melengkapi data"
- "Flow ini mensimulasikan proses pendaftaran batch per angkatan"

---

## 5. LOGIN & DASHBOARD OVERVIEW (7:30 – 9:00)

**Navigasi ke halaman login:**
- "Sekarang kita masuk ke sisi student portal"
- Login dengan akun demo
- "Setelah login, kita langsung masuk ke **Dashboard** utama"

**Tunjukin Header terlebih dahulu:**
- Logo One Academy + label "Learning Management System"
- **Bell Icon (Notifikasi)** — klik untuk buka dropdown notifikasi akademik
  - "Ada 3 notifikasi mock: tugas baru, pengumuman mentoring, presensi otomatis"
  - "Bisa tandai semua sudah dibaca"
- **Profile Avatar** — klik untuk buka dropdown profil
  - Menampilkan nama, email, dan tier badge
  - Shortcut ke **Pembayaran UKT/SPP** (ini cara hidden access payment)
  - Tombol **Keluar Sesi**

**Tunjukin Dashboard Home:**
- "Ini dashboard utamanya. Di sini langsung terlihat beberapa informasi penting:"
  - **3 Stat Cards** di atas: Kehadiran (x/14 sesi), Tugas (submitted/total), IPK/Nilai Rata-rata
  - **Privacy Toggle (Eye icon)** di stat IPK — klik untuk blur/show nilai
  - **Warning Banner** pembayaran UKT jika belum bayar (merah, attention-grabbing)
  - **Tier Switcher** — dropdown di pojok kanan atas untuk demo switch jenjang (SD/SMP/SMA/Univ)
    - "Ini fitur demo — semua data berubah sesuai jenjang yang dipilih"

**Tunjukin komponen desktop:**
- **Progress Card** — grafik progres modul per semester
- **Info Card** — informasi akademik
- **Upcoming Class Card** — kelas mendatang + aksi presensi
- **Todo List Card** — tab upcoming & outdated tasks
- **Forum Card** — shortcut diskusi

**Tunjukin Sidebar:**
- "Sidebar kita didesain dengan warna **Navy Blue** (#003057) supaya terasa premium"
- "Ada 10 menu: Beranda, LMS, Tugas, Jadwal, Nilai, AI Asisten, AI Graph, Chat, Leaderboard, dan Settings"
- Klik **toggle sidebar** (DotsNine icon) untuk collapse/expand
- "Di mobile nanti sidebar ini berubah jadi **floating bottom dock** dengan 5 menu utama"

**BONUS — Tunjukin Sistem Presensi QR Code:**
- "Ini fitur yang cukup canggih — sistem presensi berbasis QR Code"
- Klik "Simulasi Mode Proyektor" di Upcoming Class card
- **Modal Proyektor** muncul:
  - QR Code yang tampil di layar kelas (pakai `qrcode.react`)
  - **Token auto-rotate setiap 10 detik** dengan countdown ring animasi
  - "Jadi mahasiswa harus scan tepat waktu, tidak bisa screenshot dan pakai nanti"
- Tutup modal, lalu klik "Pindai QR Proyektor" (di mobile view)
- **Scanner modal** muncul dengan:
  - Simulasi kamera viewfinder + animasi scan line
  - **Device Binding** — cek apakah perangkat yang dipakai adalah perangkat yang terdaftar
  - **WiFi Location** — verifikasi siswa berada di dalam kampus
  - Tombol **"Simulasikan Kecurangan"** — ganti perangkat untuk demo anti-fraud
    - "Kalau HP-nya beda dari yang terdaftar, status jadi 'Tidak Sah' dan presensi ditolak"
  - Klik scan → sukses → counter attendance bertambah
- "Jadi 3 layer keamanan: QR token yang selalu berubah, device binding, dan lokasi WiFi"

---

## 6. LMS MODULAR (9:00 – 11:00)

**Klik menu "LMS" di sidebar**

- "Ini jantungnya One Academy — **LMS Modular**"
- "Modul pembelajaran disesuaikan berdasarkan jenjang pendidikan:"
  - SD: Matematika Ceria, Flora & Fauna, dll
  - SMP: Aljabar, Struktur Sel, Grammar Inggris
  - SMA: Kalkulus, Fisika Optik, Tryout UTBK
  - Universitas: Front-End Web, Data Management, OOP, dll

**Poin yang perlu di-highlight:**
- Setiap modul punya **progress bar** yang menunjukkan seberapa jauh siswa sudah belajar
- Ada **video materi**, **dokumen PDF**, dan **quiz interaktif** di dalam setiap modul
- Sistem **lock/unlock** — modul selanjutnya baru terbuka setelah modul sebelumnya selesai
- "Jadi learning path-nya terstruktur, bukan asal belajar random"

**Klik salah satu modul untuk buka detail:**
- Tunjukin isi modul: video, reading material, quiz
- "Semuanya responsive — bisa diakses dari laptop maupun HP"

---

## 7. ASSIGNMENTS & JADWAL (11:00 – 12:30)

### 7a. Assignments (Tugas)
**Klik menu "Tugas"**

- "Halaman tugas menampilkan semua assignment yang diberikan dosen/guru"
- Tunjukin filter: Semua, Pending, Submitted, Graded
- "Siswa bisa lihat deadline, upload tugas, dan lihat nilai yang sudah di-grade"
- "Ada badge status: Menunggu, Selesai, Terlambat"
- Klik salah satu tugas untuk buka detail

### 7b. Schedule (Jadwal)
**Klik menu "Jadwal"**

- "Ini jadwal kelas dan kegiatan akademik"
- "Ada view calendar/list untuk melihat jadwal per hari, minggu, atau bulan"
- "Setiap event punya badge: apakah itu kelas reguler, ujian onsite, atau kegiatan lain"
- Tunjukin jadwal yang ada hari ini
- "Siswa bisa langsung tahu jam berapa harus masuk kelas"

---

## 8. NILAI & TRANSKRIP (12:30 – 14:00)

**Klik menu "Nilai & Transkrip"**

- "Nah ini fitur yang penting banget — halaman **Nilai & Transkrip Akademik**"

**Tunjukin berurutan:**

1. **Stat Cards di atas:**
   - "IPK Kumulatif / Rata-rata Nilai"
   - "IPS Semester / Predikat Nilai"
   - "SKS yang sudah ditempuh"

2. **Grafik Progres Akademik:**
   - "Ini SVG chart yang menunjukkan tren IPK/nilai dari semester ke semester"
   - "Bisa dilihat, nilainya naik terus — bagus nih!"

3. **Fitur Privacy Toggle (Eye Icon):**
   - Klik tombol "Samarkan Nilai"
   - "Kalau lagi di tempat umum dan gak mau orang lain lihat nilai kita, tinggal klik ini — semua angka jadi blur"
   - Klik lagi untuk show

4. **Tabel Detail Nilai:**
   - "Ini breakdown lengkap per mata kuliah/pelajaran"
   - "Komponen nilainya detail: Absensi (10%), Tugas (20%), UTS (30%), UAS (40%)"
   - Tunjukin semester dropdown selector

5. **Fitur Sanggah Nilai (Appeal):**
   - Klik tombol "Sanggah" di salah satu mata kuliah
   - "Kalau mahasiswa merasa nilainya salah, bisa langsung ajukan sanggahan lewat sini"
   - Tunjukin modal drawer yang muncul dari kanan
   - "Ada form alasan, upload bukti, dan info proses verifikasi"

6. **Download Transkrip PDF:**
   - Klik tombol "Unduh Transkrip"
   - "Ada animasi loading step-by-step: connecting, aggregating, generating PDF"
   - "Kesan profesionalnya dapet banget"

---

## 9. LEADERBOARD & SAT POINT (14:00 – 15:30)

**Klik menu "Leaderboard"**

- "Ini fitur yang terinspirasi dari SAT (Student Activity Transcript)"
- "Jadi siswa bisa mengumpulkan poin dari keaktifan — ikut seminar, workshop, volunteer, dll"

**Tunjukin:**
- **Leaderboard ranking** — siapa yang paling aktif di kelas dan di sekolah/kampus
- "Ada dua tab: leaderboard per kelas dan per sekolah/kampus"
- **SAT Point Claim Form:**
  - "Untuk mendapatkan poin, siswa harus ajukan bukti kegiatan"
  - "Isi form: nama kegiatan, kategori, tanggal, upload sertifikat"
  - "Nanti admin/dosen yang verifikasi dan approve poinnya"
- "Gamification kayak gini bikin siswa lebih termotivasi untuk aktif"

---

## 10. PEMBAYARAN UKT/SPP (15:30 – 17:00)

**Navigasi ke halaman Payment (dari dashboard CTA atau header profile)**

- "Fitur pembayaran UKT untuk universitas, atau SPP untuk sekolah"
- "Ini fitur yang sengaja kita hidden — tidak ada di sidebar utama, tapi bisa diakses dari alert banner di dashboard atau dari profile menu"

**Tunjukin:**
- **Invoice/billing card** — total tagihan, jatuh tempo, status pembayaran
- "Nominal otomatis menyesuaikan tier: Universitas Rp8.500.000, SD/SMP/SMA lebih murah"
- **Metode pembayaran** — Virtual Account, Transfer Bank, QRIS
- Klik "Lakukan Pembayaran"
- **Simulasi flow pembayaran:**
  - Modal detail pembayaran muncul
  - Klik bayar → loading animasi → sukses!
- "Setelah bayar, status berubah jadi 'Lunas' dan banner warning di dashboard hilang"
- Balik ke dashboard untuk buktiin banner-nya hilang

---

## 11. AI ASSISTANT, KNOWLEDGE GRAPH & CHAT (17:00 – 18:30)

### 11a. AI Assistant
**Klik menu "AI Asisten"**

- "One Academy punya AI Assistant yang bisa bantu siswa belajar"
- "Powered by Google Gemini — bisa tanya materi, minta penjelasan, atau bantuan tugas"
- Coba ketik pertanyaan: "Jelaskan konsep OOP dalam pemrograman"
- "Responnya real-time dan kontekstual"

### 11b. AI Knowledge Graph
**Klik menu "AI Graph"**

- "Ini fitur yang cukup unik — **Knowledge Graph** berbasis AI"
- "Visualisasi hubungan antar topik pembelajaran dalam bentuk graph/mind-map"
- "Siswa bisa lihat bagaimana satu materi berkaitan dengan materi lain"

### 11c. Chat / Forum
**Klik menu "Chat"**

- "Ada juga fitur chat/forum untuk diskusi antar siswa"
- "Bisa tanya jawab, sharing materi, atau diskusi tugas kelompok"

---

## 12. SETTINGS, DARK MODE & RESPONSIVE (18:30 – 19:30)

### 12a. Settings
**Klik menu "Settings"**

- "Halaman settings dibagi jadi 3 section:"

1. **Profil Akademik** (Read-only)
   - Nama, Email, Institusi, Jenjang Pendidikan
   - "Data ini diambil dari akun yang terdaftar"

2. **Preferensi Aplikasi**
   - **Theme Toggle** — segmented control Light/Dark
   - **Language Switcher** — segmented control ID/EN dengan flag icon
   - "Ini pakai `next-intl` untuk internasionalisasi"

3. **Pengaturan Notifikasi**
   - Toggle: Email notification, Push notification, Task reminder
   - "Masing-masing toggle interaktif dengan toast feedback"
   - Demo klik satu toggle untuk tunjukin toast-nya

### 12b. Dark Mode
- Toggle dark mode dari settings
- "Full support dark mode — semua halaman sudah di-optimize"
- "Sidebar navy blue, cards, tabel, modal, chart — semuanya konsisten di dark mode"
- Tunjukin beberapa halaman di dark mode: Dashboard, Grades, LMS

### 12c. Responsive Demo
- **Resize browser ke ukuran mobile** (atau buka DevTools responsive)
- "Sekarang kita lihat tampilan mobile-nya"
- "Sidebar berubah jadi **floating bottom dock** — 5 menu utama yang paling sering dipakai"
- Tunjukin fitur mobile-only:
  - **Quick Menu Icons** — grid 5 shortcut (LMS, AI Tutor, Tugas, Peringkat, Setelan)
  - **Upcoming Class card** dengan aksi presensi mobile
  - **Pemberitahuan Akademik** — card mail/alerts (3 notif mock)
- Tunjukin beberapa halaman di mobile:
  - Dashboard home (compact, card-based)
  - LMS modules
  - Grades table (scroll horizontal)
  - Schedule
- "Semua pixel-perfect dan enak dipakai di layar kecil"

### 12d. Multi-bahasa
- "Oh iya, One Academy juga support **2 bahasa**: Indonesia dan English"
- "Semua teks UI otomatis berubah sesuai locale — pakai `next-intl`"
- Tunjukin switch bahasa dari Settings (segmented ID/EN)
- "Coba perhatiin semua label, button, dan placeholder berubah"

---

## 13. PENUTUP & Q&A (19:30 – 20:00)

**Rangkum secara singkat:**

- "Jadi untuk merangkum, **One Academy** ini adalah platform LMS SaaS yang:"
  1. Support **multi-jenjang**: SD, SMP, SMA, Universitas — dengan **tier switcher** demo
  2. Punya **LMS modular** dengan learning path terstruktur
  3. Dilengkapi **AI Assistant** berbasis Google Gemini + Knowledge Graph
  4. Sistem presensi **QR Code anti-fraud** (token rotation + device binding + WiFi check)
  5. Fitur lengkap: **Jadwal, Nilai, Tugas, Leaderboard SAT, Pembayaran UKT/SPP**
  6. **Registrasi siswa** dengan validasi Zod dan flow multi-step
  7. Notifikasi akademik, sanggah nilai, dan download transkrip PDF
  8. **Dark mode**, **responsive/PWA**, dan **multi-bahasa** (ID/EN)
  9. Dibangun dengan tech stack modern: **Next.js 16 + React 19 + Supabase + Drizzle ORM**

- "Untuk pengembangan ke depan, kita masih bisa tambahkan: dashboard admin/dosen, real-time notification, video conference integration, dan masih banyak lagi."

- "Sekian presentasi dari saya. Ada pertanyaan?"

---

## TIPS PRESENTASI

- Jangan baca notes ini mentah-mentah — jadikan panduan, bukan script
- Kalau ada yang error/loading lama, stay cool dan bilang "ini demo environment ya"
- Bawa air minum
- Eye contact sama audiens, jangan terus lihat layar
- Kalau ada fitur yang bikin audiens "wah", pause sebentar biar mereka appreciate
- Siapkan fallback: kalau internet mati, bisa pake screenshot atau recording

---

## PERTANYAAN YANG MUNGKIN DITANYA

| Pertanyaan | Jawaban Singkat |
| --- | --- |
| "Kenapa pakai Next.js, bukan Laravel?" | "Next.js 16 support SSR, React Server Components, dan ecosystem JavaScript yang sangat luas. Cocok untuk SPA yang butuh SEO dan performa tinggi." |
| "Database-nya apa?" | "Pakai Supabase (PostgreSQL) dengan Drizzle ORM untuk type-safe queries." |
| "Bisa deploy ke production?" | "Bisa. Support Vercel, Railway, atau self-hosted. Sudah PWA-ready juga." |
| "AI-nya pakai apa?" | "Google Gemini via Vercel AI SDK. Support streaming response." |
| "Bedanya sama Google Classroom?" | "One Academy lebih modular, support multi-jenjang, ada fitur pembayaran, leaderboard SAT, dan AI assistant bawaan." |
| "Kenapa fitur payment tidak di sidebar?" | "Design decision — payment bukan fitur yang diakses setiap hari, jadi di-akses via alert banner atau profile menu supaya sidebar tetap clean." |
