# Dokumentasi Halaman Community

Halaman **Community** dirancang untuk menampilkan wajah dari platform **One Academy**, mulai dari pengurus (BPH), koordinator, anggota, hingga penghargaan (awards) dan papan peringkat (leaderboard).

## 1. Struktur Data (Mock Data)
Data komunitas dikelola dalam file `src/constants/community-data/index.ts`. 
Berikut adalah entitas utama yang ada di dalam sistem:

- **BPH (Badan Pengurus Harian)**: Para pemimpin eksekutif komunitas (Ketua, Wakil, Sekretaris, Bendahara). Ditampilkan paling atas pada halaman.
- **Coordinators**: Kepala divisi (Technology, Design, dll.). Ditampilkan dalam format baris (row layout) yang lebih ringkas.
- **Members**: Semua anggota aktif. Ditampilkan dalam bentuk grid dengan filter berdasarkan *Batch* (angkatan).
- **Awards**: Penghargaan untuk anggota, seperti "Member of the Month", "Most Active Contributor", "Best Project Pitch", dsb.
- **Leaderboard**: Sistem poin yang melacak kontribusi anggota (Kehadiran, Poin Project, Poin Event, dll.). 

## 2. Struktur Komponen (Atomic Design)
Sesuai dengan arsitektur proyek, komponen untuk halaman Community berada di `src/components/organisms/community/`:

- `CommunityHero`: Section hero dengan background mega-mendung dan efek transisi.
- `OrgStructure`: Section untuk menampilkan BPH (Card layout besar) dan Koordinator (List/Compact Card).
- `MemberAwards`: Menampilkan "Member of the Month" (Highlight Card) dan grid penghargaan lainnya.
- `Leaderboard`: Tabel dan Card (untuk mobile) yang menampilkan peringkat anggota berdasarkan perolehan poin. Poin dibagi menjadi *Attendance*, *Project*, dan *Event*.
- `MemberGrid`: Grid semua anggota yang dilengkapi dengan fitur filter (Select) berdasarkan batch/angkatan.

## 3. Sistem Poin & Leaderboard (Rencana Logika Bisnis)
Saat ini poin menggunakan *mock data*. Namun, ke depannya logika sistem perhitungan poin akan didapatkan dari:
- **Attendance System**: Kehadiran di pertemuan rutin atau workshop (+10 poin/kehadiran).
- **Project Contribution**: Keterlibatan dalam project (misal: open source, internal project) (+50 poin).
- **Event Participation**: Mengikuti lomba/hackathon membawa nama komunitas (+100 poin).
- Semua data ini akan di-query dari tabel `attendances`, `projects`, dan `events` di database Supabase.

## 4. Lokalisasi (i18n)
Halaman ini sudah didukung oleh `next-intl`. String seperti judul hero, struktur organisasi, leaderboard, dan keterangan penghargaan sudah disimpan di dalam `src/shared/jsons/messages/id.json` dan `en.json`.
