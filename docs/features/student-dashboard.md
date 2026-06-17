# Fitur Student Portal Dashboard

Student Portal Dashboard (`/dashboard`) dirancang khusus sebagai pusat ruang belajar siswa aktif yang disesuaikan secara dinamis berdasarkan paket tingkatan pendidikan (SD, SMP, SMA, Universitas).

## Komponen & Fitur Interaktif

### 1. Statistik Progres Belajar
-   **Kehadiran Kelas:** Melacak total pertemuan kelas yang dihadiri oleh siswa.
-   **Tugas Dikumpul:** Menyajikan perbandingan jumlah tugas yang telah dikumpulkan terhadap total tugas aktif.
-   **Rata-rata Nilai:** Nilai akumulasi dari tugas-tugas yang telah dinilai.

### 2. Presensi Kelas Interaktif (Mockup)
-   Menampilkan sesi kelas mentoring yang aktif hari ini.
-   Tombol **"Presensi Sekarang"** akan mencatatkan kehadiran siswa ke `localStorage` (mencegah klik ganda) dan menaikkan persentase kehadiran secara instan pada tampilan dashboard.

### 3. Modular LMS
-   Memuat daftar modul pelajaran yang disesuaikan secara otomatis berdasarkan jenjang pendidikan yang dipilih saat registrasi:
    -   **SD:** Pengenalan Angka & Flora Fauna dengan visual interaktif.
    -   **SMP:** Teori Aljabar, Sel Organisme, dan Grammar Bahasa Inggris dasar.
    -   **SMA:** Kalkulus, Fisika Optik, dan Persiapan Tryout UTBK.
    -   **Universitas:** Software Engineering, Struktur Data Lanjut, dan Praktek IoT.
-   Tombol **"Buka Modul"** menampilkan modal detail pelajaran berisi video pembelajaran interaktif (mock frame) dan daftar sub-bab pelajaran.
-   Tombol **"PDF"** mensimulasikan proses pengunduhan dokumen rangkuman materi ringkas.

### 4. Pengumpulan Tugas Interaktif
-   Siswa dapat mengunggah file mockup tugas mereka pada list tabel Tugas.
-   Klik **"Unggah File"** membuka input file lokal browser. Setelah file dipilih, status tugas di-update menjadi **"Sudah Dikumpul"** dengan skor nilai otomatis (misal: 95/100) dan disimpan ke `localStorage`.

### 5. Chatbot Asisten Belajar AI
-   Mengintegrasikan `ChabotSection` yang ditenagai oleh model *Gemini* melalui Vercel AI SDK di tab khusus "AI Tutor".
-   Menjawab pertanyaan akademis, membantu mencarikan topik materi, serta memberikan penjelasan tugas.
