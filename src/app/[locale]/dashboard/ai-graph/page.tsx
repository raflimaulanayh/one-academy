'use client'

import { useDashboard } from '@/context/dashboard-context'
import { Link } from '@/i18n/routing'
import {
  BrainIcon,
  TrashIcon,
  XIcon,
  PlusIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  ArrowsOutIcon,
  CaretDownIcon,
  CpuIcon
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

import { cn } from '@/utils'

// ─── Interfaces ──────────────────────────────────────────────────────────────

interface TopicNode {
  id: string
  name: string
  score: number
  x: number
  y: number
  courseId: string
  description: string
}

interface CourseNode {
  id: string
  code: string
  name: string
  x: number
  y: number
  classCode?: string
  attendance?: string
}

interface SemesterData {
  courses: CourseNode[]
  topics: TopicNode[]
}

// ─── Default Position Constants ──────────────────────────────────────────────

const CENTRAL_HUB_X = 450
const CENTRAL_HUB_Y = 225

// ─── Pre-populated Academic Curriculum Mock Data per Level ────────────────────

const TIER_MOCK_DATA: Record<string, Record<string, SemesterData>> = {
  univ: {
    'sem-1': {
      courses: [
        { id: 'u-c1-s1', code: 'ISYS101', name: 'Introduction to IT Systems', x: 250, y: 225 },
        { id: 'u-c2-s1', code: 'MATH101', name: 'Discrete Mathematics', x: 650, y: 225 }
      ],
      topics: [
        {
          id: 'u-t1-s1',
          name: 'Komponen Hardware & CPU',
          score: 92,
          x: 100,
          y: 100,
          courseId: 'u-c1-s1',
          description: 'Memahami dasar interaksi mikroprosesor, register, dan cache L1/L2/L3.'
        },
        {
          id: 'u-t2-s1',
          name: 'Sistem Operasi Dasar',
          score: 86,
          x: 80,
          y: 185,
          courseId: 'u-c1-s1',
          description: 'Konsep proses, thread, kernel space, user space, dan sinkronisasi.'
        },
        {
          id: 'u-t3-s1',
          name: 'Alur Algoritma Logika',
          score: 78,
          x: 80,
          y: 265,
          courseId: 'u-c1-s1',
          description: 'Dasar penalaran pemrograman sekuensial, percabangan, dan perulangan.'
        },
        {
          id: 'u-t4-s1',
          name: 'Dasar Networking TCP/IP',
          score: 55,
          x: 100,
          y: 350,
          courseId: 'u-c1-s1',
          description: 'Pemahaman IP addressing, subnetting, model OSI, dan routing.'
        },
        {
          id: 'u-t5-s1',
          name: 'Teori Himpunan & Relasi',
          score: 88,
          x: 800,
          y: 100,
          courseId: 'u-c2-s1',
          description: 'Dasar aljabar himpunan, diagram Venn, dan relasi ekuivalen.'
        },
        {
          id: 'u-t6-s1',
          name: 'Logika Proposisi & Bukti',
          score: 71,
          x: 820,
          y: 185,
          courseId: 'u-c2-s1',
          description: 'Metode pembuktian kontradiksi, induksi matematika, dan tabel kebenaran.'
        },
        {
          id: 'u-t7-s1',
          name: 'Graf & Pohon Biner',
          score: 50,
          x: 820,
          y: 265,
          courseId: 'u-c2-s1',
          description: 'Karakteristik path, cycle, spanning tree, dan representasi matriks graf.'
        },
        {
          id: 'u-t8-s1',
          name: 'Teori Kombinatorika',
          score: 40,
          x: 800,
          y: 350,
          courseId: 'u-c2-s1',
          description: 'Perhitungan permutasi, kombinasi, pigeonhole principle, dan probabilitas.'
        }
      ]
    },
    'sem-2': {
      courses: [
        {
          id: 'u-c1-s2',
          code: 'CHAR6002003',
          name: 'Character Building: Kewarganegaraan',
          classCode: 'LA03',
          attendance: '12 / 13',
          x: 250,
          y: 100
        },
        {
          id: 'u-c2-s2',
          code: 'ISYS6013005',
          name: 'Data and Information Management',
          classCode: 'LA05',
          attendance: '26 / 26',
          x: 650,
          y: 100
        },
        {
          id: 'u-c3-s2',
          code: 'ISYS6014005',
          name: 'Office Automation Industri Kreatif',
          classCode: 'LA05',
          attendance: '13 / 13',
          x: 200,
          y: 260
        },
        {
          id: 'u-c4-s2',
          code: 'ISYS6016005',
          name: 'Pemrograman Front-End Web',
          classCode: 'LA05',
          attendance: '26 / 26',
          x: 700,
          y: 260
        },
        {
          id: 'u-c5-s2',
          code: 'ISYS6015005',
          name: 'Social Media Marketing & Analytics',
          classCode: 'LA05',
          attendance: '24 / 26',
          x: 450,
          y: 390
        }
      ],
      topics: [
        {
          id: 'u-t1-s2',
          name: 'Identitas Nasional & Integrasi',
          score: 82,
          x: 100,
          y: 60,
          courseId: 'u-c1-s2',
          description: 'Memahami jati diri bangsa dan pilar integrasi nasional.'
        },
        {
          id: 'u-t2-s2',
          name: 'Hak & Kewajiban Warga Negara',
          score: 78,
          x: 80,
          y: 120,
          courseId: 'u-c1-s2',
          description: 'Konsepsi hak asasi manusia dan tanggung jawab konstitusional warga negara.'
        },
        {
          id: 'u-t3-s2',
          name: 'Konstitusi & UUD 1945',
          score: 48,
          x: 200,
          y: 20,
          courseId: 'u-c1-s2',
          description: 'Sejarah perumusan, amandemen, dan pasal-pasal fundamental UUD 1945.'
        },
        {
          id: 'u-t4-s2',
          name: 'Entity Relationship Diagram (ERD)',
          score: 94,
          x: 750,
          y: 60,
          courseId: 'u-c2-s2',
          description: 'Perancangan basis data konseptual menggunakan entitas, atribut, dan relasi.'
        },
        {
          id: 'u-t5-s2',
          name: 'Normalisasi Database',
          score: 88,
          x: 820,
          y: 120,
          courseId: 'u-c2-s2',
          description: 'Menghindari anomali modifikasi data dengan bentuk normal 1NF, 2NF, dan 3NF.'
        },
        {
          id: 'u-t6-s2',
          name: 'Structured Query Language (SQL)',
          score: 92,
          x: 700,
          y: 20,
          courseId: 'u-c2-s2',
          description: 'Penulisan kueri DDL dan DML kompleks, subquery, join, dan agregasi.'
        },
        {
          id: 'u-t7-s2',
          name: 'Pengolah Kata & Spreadsheets',
          score: 89,
          x: 60,
          y: 220,
          courseId: 'u-c3-s2',
          description: 'Pemanfaatan formula tingkat lanjut, pivot table, dan otomasi dokumen bisnis.'
        },
        {
          id: 'u-t8-s2',
          name: 'Presentasi Multimedia Kreatif',
          score: 95,
          x: 80,
          y: 290,
          courseId: 'u-c3-s2',
          description: 'Desain deck presentasi interaktif dengan prinsip-prinsip komunikasi visual modern.'
        },
        {
          id: 'u-t9-s2',
          name: 'Integrasi Data Office',
          score: 78,
          x: 100,
          y: 360,
          courseId: 'u-c3-s2',
          description: 'Menghubungkan sumber data eksternal ke dalam word processor dan spreadsheets.'
        },
        {
          id: 'u-t10-s2',
          name: 'HTML5 & Elemen Semantik',
          score: 96,
          x: 840,
          y: 220,
          courseId: 'u-c4-s2',
          description: 'Penggunaan markup standar modern demi meningkatkan SEO dan aksesibilitas (A11y).'
        },
        {
          id: 'u-t11-s2',
          name: 'Layout CSS Modern (Flexbox/Grid)',
          score: 90,
          x: 820,
          y: 290,
          courseId: 'u-c4-s2',
          description: 'Pembuatan desain halaman web responsif yang dinamis tanpa framework tambahan.'
        },
        {
          id: 'u-t12-s2',
          name: 'Manipulasi DOM JavaScript',
          score: 72,
          x: 800,
          y: 360,
          courseId: 'u-c4-s2',
          description: 'Interaksi dinamis halaman web dengan event listeners dan query selectors.'
        },
        {
          id: 'u-t13-s2',
          name: 'Komponen & Hooks React',
          score: 54,
          x: 720,
          y: 410,
          courseId: 'u-c4-s2',
          description: 'Arsitektur komponen React 19, functional state (useState), dan siklus efek (useEffect).'
        },
        {
          id: 'u-t14-s2',
          name: 'Content Strategy & Planning',
          score: 80,
          x: 320,
          y: 460,
          courseId: 'u-c5-s2',
          description: 'Perancangan pilar konten, riset audiens target, dan kalender editorial media sosial.'
        },
        {
          id: 'u-t15-s2',
          name: 'Metrik Pemasaran & ROI',
          score: 45,
          x: 450,
          y: 520,
          courseId: 'u-c5-s2',
          description: 'Kalkulasi Return on Investment (ROI), metrik konversi, CPC, CTR, dan CAC iklan digital.'
        },
        {
          id: 'u-t16-s2',
          name: 'SEO & Search Engine Marketing',
          score: 70,
          x: 580,
          y: 460,
          courseId: 'u-c5-s2',
          description: 'Riset kata kunci potensial, optimasi halaman on-page/off-page, dan kampanye berbayar SEM.'
        }
      ]
    },
    'sem-3': {
      courses: [
        { id: 'u-c1-s3', code: 'ISYS301', name: 'Database Systems', x: 250, y: 225 },
        { id: 'u-c2-s3', code: 'COMP302', name: 'Operating Systems', x: 650, y: 225 }
      ],
      topics: [
        {
          id: 'u-t1-s3',
          name: 'Normalisasi Relasional (1NF-3NF)',
          score: 85,
          x: 100,
          y: 100,
          courseId: 'u-c1-s3',
          description: 'Menghindari anomali modifikasi dengan pemisahan tabel terstruktur.'
        },
        {
          id: 'u-t2-s3',
          name: 'Query Optimization & Indexing',
          score: 72,
          x: 80,
          y: 185,
          courseId: 'u-c1-s3',
          description: 'Penggunaan indeks B-Tree untuk mempercepat pencarian data besar.'
        },
        {
          id: 'u-t3-s3',
          name: 'Transaksi ACID',
          score: 60,
          x: 80,
          y: 265,
          courseId: 'u-c1-s3',
          description: 'Konsep Atomicity, Consistency, Isolation, dan Durability dalam DBMS.'
        },
        {
          id: 'u-t4-s3',
          name: 'NoSQL & MongoDB',
          score: 90,
          x: 100,
          y: 350,
          courseId: 'u-c1-s3',
          description: 'Arsitektur dokumen dinamis dan skalabilitas horizontal database non-relasional.'
        },
        {
          id: 'u-t5-s3',
          name: 'CPU Scheduling Algorithms',
          score: 81,
          x: 800,
          y: 100,
          courseId: 'u-c2-s3',
          description: 'Algoritma Round Robin, Shortest Job First, dan Multi-level Queue.'
        },
        {
          id: 'u-t6-s3',
          name: 'Virtual Memory & Paging',
          score: 68,
          x: 820,
          y: 185,
          courseId: 'u-c2-s3',
          description: 'Manajemen memori menggunakan page tables, frame, dan page replacement.'
        },
        {
          id: 'u-t7-s3',
          name: 'Deadlock Detection & Prevention',
          score: 48,
          x: 820,
          y: 265,
          courseId: 'u-c2-s3',
          description: 'Kondisi Mutual Exclusion, Hold and Wait, No Preemption, dan Circular Wait.'
        },
        {
          id: 'u-t8-s3',
          name: 'File Systems & I/O',
          score: 77,
          x: 800,
          y: 350,
          courseId: 'u-c2-s3',
          description: 'Arsitektur penyimpanan disk, inode, FAT, NTFS, dan buffering device.'
        }
      ]
    }
  },
  sma: {
    'sem-1': {
      courses: [
        { id: 'm-c1-s1', code: 'MAT301', name: 'Matematika Aljabar & Fungsi', x: 250, y: 225 },
        { id: 'm-c2-s1', code: 'FIS301', name: 'Fisika Kinematika & Dinamika', x: 650, y: 225 }
      ],
      topics: [
        {
          id: 'm-t1-s1',
          name: 'Fungsi Kuadrat & Grafik',
          score: 94,
          x: 100,
          y: 100,
          courseId: 'm-c1-s1',
          description: 'Mencari titik puncak, sumbu simetri, dan akar-akar persamaan kuadrat.'
        },
        {
          id: 'm-t2-s1',
          name: 'Sistem Persamaan Linear',
          score: 87,
          x: 80,
          y: 185,
          courseId: 'm-c1-s1',
          description: 'Penyelesaian SPLDV dan SPLTV menggunakan substitusi, eliminasi, dan matriks.'
        },
        {
          id: 'm-t3-s1',
          name: 'Polinomial & Suku Banyak',
          score: 65,
          x: 80,
          y: 265,
          courseId: 'm-c1-s1',
          description: 'Pembagian suku banyak, teorema sisa, dan pencarian faktor polinomial.'
        },
        {
          id: 'm-t4-s1',
          name: 'Matriks & Transformasi',
          score: 45,
          x: 100,
          y: 350,
          courseId: 'm-c1-s1',
          description: 'Operasi matriks, determinan, invers, dan aplikasi refleksi/rotasi geometri.'
        },
        {
          id: 'm-t5-s1',
          name: 'Gerak Lurus (GLB & GLBB)',
          score: 90,
          x: 800,
          y: 100,
          courseId: 'm-c2-s1',
          description: 'Analisis kecepatan, percepatan, jarak tempuh, dan grafik gerak benda.'
        },
        {
          id: 'm-t6-s1',
          name: 'Hukum Newton tentang Gerak',
          score: 76,
          x: 820,
          y: 185,
          courseId: 'm-c2-s1',
          description: 'Hukum Newton I, II, III, gaya gesek, gaya berat, dan analisis diagram bebas.'
        },
        {
          id: 'm-t7-s1',
          name: 'Usaha, Energi, & Daya',
          score: 58,
          x: 820,
          y: 265,
          courseId: 'm-c2-s1',
          description: 'Konsep energi kinetik, energi potensial, hukum kekekalan energi mekanik.'
        },
        {
          id: 'm-t8-s1',
          name: 'Momentum & Impuls',
          score: 48,
          x: 800,
          y: 350,
          courseId: 'm-c2-s1',
          description: 'Tumbukan lenting sempurna, sebagian, tidak lenting, serta hukum momentum.'
        }
      ]
    },
    'sem-2': {
      courses: [
        { id: 'm-c1-s2', code: 'SMA301', name: 'Kalkulus Dasar & Limit', x: 250, y: 225 },
        { id: 'm-c2-s2', code: 'SMA302', name: 'Fisika Optik & Gelombang', x: 650, y: 225 }
      ],
      topics: [
        {
          id: 'm-t1-s2',
          name: 'Limit Fungsi Aljabar',
          score: 85,
          x: 100,
          y: 100,
          courseId: 'm-c1-s2',
          description: 'Pemahaman limit kiri/kanan, limit tak tentu, dan pemfaktoran aljabar.'
        },
        {
          id: 'm-t2-s2',
          name: 'Turunan Fungsi Pertama',
          score: 79,
          x: 80,
          y: 185,
          courseId: 'm-c1-s2',
          description: 'Rumus dasar turunan, aturan rantai, dan laju perubahan fungsi.'
        },
        {
          id: 'm-t3-s2',
          name: 'Aplikasi Turunan (Optimum)',
          score: 62,
          x: 80,
          y: 265,
          courseId: 'm-c1-s2',
          description: 'Mencari nilai maksimum/minimum, titik stasioner, dan kemiringan garis.'
        },
        {
          id: 'm-t4-s2',
          name: 'Pengenalan Integral Dasar',
          score: 48,
          x: 100,
          y: 350,
          courseId: 'm-c1-s2',
          description: 'Integral tak tentu, rumus dasar pengintegralan suku aljabar, anti-turunan.'
        },
        {
          id: 'm-t5-s2',
          name: 'Optik Geometri: Cermin',
          score: 89,
          x: 800,
          y: 100,
          courseId: 'm-c2-s2',
          description: 'Pembentukan bayangan pada cermin cekung/cembung dan persamaan lensa.'
        },
        {
          id: 'm-t6-s2',
          name: 'Interferensi & Difraksi',
          score: 72,
          x: 820,
          y: 185,
          courseId: 'm-c2-s2',
          description: 'Gelombang cahaya melewati celah ganda Young, kisi difraksi, dan dispersi.'
        },
        {
          id: 'm-t7-s2',
          name: 'Gelombang Bunyi & Efek Doppler',
          score: 55,
          x: 820,
          y: 265,
          courseId: 'm-c2-s2',
          description: 'Perubahan frekuensi bunyi akibat gerak relatif sumber bunyi dan pendengar.'
        },
        {
          id: 'm-t8-s2',
          name: 'Alat Optik (Mikroskop)',
          score: 78,
          x: 800,
          y: 350,
          courseId: 'm-c2-s2',
          description: 'Prinsip lup, mikroskop, teropong bintang, dan perbesaran sudut bayangan.'
        }
      ]
    }
  },
  smp: {
    'sem-1': {
      courses: [
        { id: 'j-c1-s1', code: 'MAT201', name: 'Matematika Bilangan & Himpunan', x: 250, y: 225 },
        { id: 'j-c2-s1', code: 'IPA201', name: 'IPA Biologi & Klasifikasi', x: 650, y: 225 }
      ],
      topics: [
        {
          id: 'j-t1-s1',
          name: 'Operasi Bilangan Bulat',
          score: 95,
          x: 100,
          y: 100,
          courseId: 'j-c1-s1',
          description: 'Penjumlahan, pengurangan, perkalian, pembagian, FPB, KPK.'
        },
        {
          id: 'j-t2-s1',
          name: 'Pecahan & Perbandingan',
          score: 88,
          x: 80,
          y: 185,
          courseId: 'j-c1-s1',
          description: 'Pecahan biasa, desimal, persen, perbandingan senilai, perbandingan balik nilai.'
        },
        {
          id: 'j-t3-s1',
          name: 'Pengertian Himpunan',
          score: 73,
          x: 80,
          y: 265,
          courseId: 'j-c1-s1',
          description: 'Notasi himpunan, kardinalitas, komplemen, himpunan bagian.'
        },
        {
          id: 'j-t4-s1',
          name: 'Diagram Venn & Operasi',
          score: 52,
          x: 100,
          y: 350,
          courseId: 'j-c1-s1',
          description: 'Irisan (intersection), gabungan (union), selisih himpunan dalam diagram.'
        },
        {
          id: 'j-t5-s1',
          name: 'Makhluk Hidup & Ciri',
          score: 92,
          x: 800,
          y: 100,
          courseId: 'j-c2-s1',
          description: 'Ciri-ciri bernapas, bergerak, peka terhadap rangsang, ekskresi.'
        },
        {
          id: 'j-t6-s1',
          name: 'Kunci Determinasi & Takson',
          score: 70,
          x: 820,
          y: 185,
          courseId: 'j-c2-s1',
          description: 'Sistem tata nama ganda, kunci dikotom, tingkatan taksonomi.'
        },
        {
          id: 'j-t7-s1',
          name: 'Kingdom Monera & Protista',
          score: 61,
          x: 820,
          y: 265,
          courseId: 'j-c2-s1',
          description: 'Struktur bakteri, ganggang biru, protozoa, amuba, paramecium.'
        },
        {
          id: 'j-t8-s1',
          name: 'Kingdom Plantae & Animalia',
          score: 79,
          x: 800,
          y: 350,
          courseId: 'j-c2-s1',
          description: 'Tumbuhan lumut, paku, berbiji, hewan avertebrata dan vertebrata.'
        }
      ]
    },
    'sem-2': {
      courses: [
        { id: 'j-c1-s2', code: 'SMP201', name: 'Aljabar Dasar & Himpunan', x: 250, y: 225 },
        { id: 'j-c2-s2', code: 'SMP202', name: 'Struktur Sel & Ekosistem', x: 650, y: 225 }
      ],
      topics: [
        {
          id: 'j-t1-s2',
          name: 'Mengenal Variabel & Konstanta',
          score: 82,
          x: 100,
          y: 100,
          courseId: 'j-c1-s2',
          description: 'Memahami konsep koefisien, variabel, konstanta, dan suku aljabar.'
        },
        {
          id: 'j-t2-s2',
          name: 'Operasi Aljabar Satu Variabel',
          score: 74,
          x: 80,
          y: 185,
          courseId: 'j-c1-s2',
          description: 'Operasi pertambahan, perkalian distribusi, penyederhanaan bentuk aljabar.'
        },
        {
          id: 'j-t3-s2',
          name: 'Persamaan Linear Satu Variabel',
          score: 55,
          x: 80,
          y: 265,
          courseId: 'j-c1-s2',
          description: 'Mencari nilai x yang memuaskan persamaan linear matematika dasar.'
        },
        {
          id: 'j-t4-s2',
          name: 'Pertidaksamaan Linear',
          score: 44,
          x: 100,
          y: 350,
          courseId: 'j-c1-s2',
          description: 'Himpunan penyelesaian pertidaksamaan linear, lambang kurang/lebih dari.'
        },
        {
          id: 'j-t5-s2',
          name: 'Sel Hewan vs Tumbuhan',
          score: 91,
          x: 800,
          y: 100,
          courseId: 'j-c2-s2',
          description: 'Mengenal nukleus, dinding sel, mitokondria, kloroplas, dan sitoplasma.'
        },
        {
          id: 'j-t6-s2',
          name: 'Jaringan & Organ Tubuh',
          score: 78,
          x: 820,
          y: 185,
          courseId: 'j-c2-s2',
          description: 'Jaringan epitel, otot, saraf, struktur daun, batang, akar tumbuhan.'
        },
        {
          id: 'j-t7-s2',
          name: 'Rantai Makanan & Simbiosis',
          score: 67,
          x: 820,
          y: 265,
          courseId: 'j-c2-s2',
          description: 'Aliran energi produsen-konsumen, simbiosis mutualisme, komensalisme, parasitisme.'
        },
        {
          id: 'j-t8-s2',
          name: 'Pencemaran Lingkungan',
          score: 85,
          x: 800,
          y: 350,
          courseId: 'j-c2-s2',
          description: 'Dampak limbah industri, efek rumah kaca, global warming, dan daur ulang.'
        }
      ]
    }
  },
  sd: {
    'sem-1': {
      courses: [
        { id: 'e-c1-s1', code: 'MAT101', name: 'Matematika Dasar & Angka', x: 250, y: 225 },
        { id: 'e-c2-s1', code: 'BI101', name: 'Bahasa Indonesia & Membaca', x: 650, y: 225 }
      ],
      topics: [
        {
          id: 'e-t1-s1',
          name: 'Mengenal Angka 1-10',
          score: 98,
          x: 100,
          y: 100,
          courseId: 'e-c1-s1',
          description: 'Menulis angka, menghitung jumlah jari, urutan angka terkecil-terbesar.'
        },
        {
          id: 'e-t2-s1',
          name: 'Penjumlahan Gambar Ceria',
          score: 91,
          x: 80,
          y: 185,
          courseId: 'e-c1-s1',
          description: 'Menambah buah apel, jeruk, kelinci secara visual bergambar.'
        },
        {
          id: 'e-t3-s1',
          name: 'Pengurangan Benda Dasar',
          score: 79,
          x: 80,
          y: 265,
          courseId: 'e-c1-s1',
          description: 'Mengurangi balon terbang, kelereng pecah, pengurangan sederhana.'
        },
        {
          id: 'e-t4-s1',
          name: 'Bentuk Geometri Sederhana',
          score: 65,
          x: 100,
          y: 350,
          courseId: 'e-c1-s1',
          description: 'Mengenal bentuk lingkaran, segitiga, persegi, persegi panjang.'
        },
        {
          id: 'e-t5-s1',
          name: 'Mengeja Suku Kata',
          score: 96,
          x: 800,
          y: 100,
          courseId: 'e-c2-s1',
          description: 'Ejaan kata sederhana: b-a ba, p-a-k pak (bapak), i-b-u (ibu).'
        },
        {
          id: 'e-t6-s1',
          name: 'Membaca Dongeng Pendek',
          score: 85,
          x: 820,
          y: 185,
          courseId: 'e-c2-s1',
          description: 'Membaca cerita kancil mencuri ketimun, kura-kura lambat.'
        },
        {
          id: 'e-t7-s1',
          name: 'Menulis Huruf Tegak',
          score: 70,
          x: 820,
          y: 265,
          courseId: 'e-c2-s1',
          description: 'Latihan menulis halus, menyambung huruf latin a-z dengan rapi.'
        },
        {
          id: 'e-t8-s1',
          name: 'Menyusun Kalimat SPOK',
          score: 55,
          x: 800,
          y: 350,
          courseId: 'e-c2-s1',
          description: 'Struktur dasar subjek, predikat, objek: Saya makan nasi.'
        }
      ]
    },
    'sem-2': {
      courses: [
        { id: 'e-c1-s2', code: 'SD101', name: 'Mengenal Angka & Berhitung', x: 250, y: 225 },
        { id: 'e-c2-s2', code: 'SD102', name: 'Flora & Fauna Sekitar Kita', x: 650, y: 225 }
      ],
      topics: [
        {
          id: 'e-t1-s2',
          name: 'Penjumlahan 10-20',
          score: 88,
          x: 100,
          y: 100,
          courseId: 'e-c1-s2',
          description: 'Latihan menjumlahkan angka puluhan dengan jari tangan.'
        },
        {
          id: 'e-t2-s2',
          name: 'Pengurangan Puluhan',
          score: 79,
          x: 80,
          y: 185,
          courseId: 'e-c1-s2',
          description: 'Pengurangan angka puluhan, coret gambar, hitung mundur.'
        },
        {
          id: 'e-t3-s2',
          name: 'Game Matematika Interaktif',
          score: 91,
          x: 80,
          y: 265,
          courseId: 'e-c1-s2',
          description: 'Latihan cepat tebak angka penjumlahan via kuis interaktif.'
        },
        {
          id: 'e-t4-s2',
          name: 'Pembagian & Perkalian Dasar',
          score: 45,
          x: 100,
          y: 350,
          courseId: 'e-c1-s2',
          description: 'Konsep dasar kelipatan angka dan pembagian apel secara merata.'
        },
        {
          id: 'e-t5-s2',
          name: 'Hewan Jinak & Liar',
          score: 93,
          x: 800,
          y: 100,
          courseId: 'e-c2-s2',
          description: 'Mengelompokkan kucing, ayam (jinak) vs singa, harimau (liar).'
        },
        {
          id: 'e-t6-s2',
          name: 'Bagian Tubuh Tumbuhan',
          score: 81,
          x: 820,
          y: 185,
          courseId: 'e-c2-s2',
          description: 'Mengenal fungsi daun memasak makanan, akar menyerap air, bunga.'
        },
        {
          id: 'e-t7-s2',
          name: 'Menjaga Kebersihan Lingkungan',
          score: 76,
          x: 820,
          y: 265,
          courseId: 'e-c2-s2',
          description: 'Cara membuang sampah di tongnya, merawat bunga, menyapu halaman.'
        },
        {
          id: 'e-t8-s2',
          name: 'Metamorfosis Kupu-Kupu',
          score: 62,
          x: 800,
          y: 350,
          courseId: 'e-c2-s2',
          description: 'Daur hidup ulat menjadi kepompong, lalu tumbuh sayap kupu-kupu indah.'
        }
      ]
    }
  }
}

export default function MasteryGraphPage() {
  const { userData, currentLang } = useDashboard()

  const tier = userData?.tier || 'univ'
  const userId = userData?.email || 'guest'
  const localStorageKey = `one_academy_mastery_${userId}_${tier}`

  // Prepopulated mock semesters list
  const semestersList = [
    { value: 'sem-1', label: currentLang === 'id' ? 'Semester 1' : 'Semester 1' },
    { value: 'sem-2', label: currentLang === 'id' ? 'Semester 2 (Aktif)' : 'Semester 2 (Active)' },
    { value: 'sem-3', label: currentLang === 'id' ? 'Semester 3' : 'Semester 3' }
  ]

  const [selectedSem, setSelectedSem] = useState('sem-2')
  const [semesterData, setSemesterData] = useState<Record<string, SemesterData>>({})
  const [selectedNode, setSelectedNode] = useState<TopicNode | null>(null)
  const [mobileTab, setMobileTab] = useState<'detector' | 'graph'>('detector')

  // Zoom & Pan state
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1.0)
  const [isPanning, setIsPanning] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })

  // Node drag state
  const [draggedNode, setDraggedNode] = useState<{ id: string; type: 'course' | 'topic' } | null>(null)
  const [nodeDragStart, setNodeDragStart] = useState({ x: 0, y: 0 })
  const [nodeInitialPos, setNodeInitialPos] = useState({ x: 0, y: 0 })

  // Create Topic Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newTopicName, setNewTopicName] = useState('')
  const [newTopicScore, setNewTopicScore] = useState(75)
  const [newTopicCourseId, setNewTopicCourseId] = useState('')

  const svgRef = useRef<SVGSVGElement>(null)

  // ─── Data Initialization & Syncing ────────────────────────────────────────

  useEffect(() => {
    // Load from local storage
    const saved = localStorage.getItem(localStorageKey)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Migration: If user had old courses like ISYS601 on univ, clear and reload defaults
        const hasOldCourses = parsed['sem-2']?.courses?.some((c: any) => c.code === 'ISYS601')
        if (hasOldCourses && tier === 'univ') {
          const defaults = TIER_MOCK_DATA[tier] || TIER_MOCK_DATA.univ
          setSemesterData(defaults)
          localStorage.setItem(localStorageKey, JSON.stringify(defaults))
        } else {
          setSemesterData(parsed)
        }
      } catch (e) {
        console.error(e)
        // Fallback to initial mock data matching active tier
        const defaults = TIER_MOCK_DATA[tier] || TIER_MOCK_DATA.univ
        setSemesterData(defaults)
      }
    } else {
      const defaults = TIER_MOCK_DATA[tier] || TIER_MOCK_DATA.univ
      setSemesterData(defaults)
      localStorage.setItem(localStorageKey, JSON.stringify(defaults))
    }
  }, [localStorageKey, tier])

  const saveToStorage = (updatedData: Record<string, SemesterData>) => {
    setSemesterData(updatedData)
    localStorage.setItem(localStorageKey, JSON.stringify(updatedData))
  }

  // ─── Active Semester Data Derivation ──────────────────────────────────────

  const activeSemData = semesterData[selectedSem] || { courses: [], topics: [] }
  const activeCourses = activeSemData.courses
  const activeTopics = activeSemData.topics

  // ─── Zoom & Pan Handlers ──────────────────────────────────────────────────

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault()
    if (!svgRef.current) return

    const rect = svgRef.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // Calculate map coordinates before zoom
    const mapX = (mouseX - pan.x) / scale
    const mapY = (mouseY - pan.y) / scale

    const zoomIntensity = 0.08
    const zoomFactor = e.deltaY < 0 ? 1 + zoomIntensity : 1 - zoomIntensity
    const newScale = Math.min(Math.max(scale * zoomFactor, 0.4), 2.5)

    // Adjust pan coordinates to keep mouse focused on same spot
    const newPanX = mouseX - mapX * newScale
    const newPanY = mouseY - mapY * newScale

    setScale(newScale)
    setPan({ x: newPanX, y: newPanY })
  }

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    // Clicked background or not dragging a node
    const target = e.target as SVGElement
    const isNode = target.closest('.mindmap-node')
    if (isNode) return

    setIsPanning(true)
    setDragStart({ x: e.clientX, y: e.clientY })
    setPanStart({ ...pan })
  }

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isPanning) {
      const dx = e.clientX - dragStart.x
      const dy = e.clientY - dragStart.y
      setPan({ x: panStart.x + dx, y: panStart.y + dy })
    } else if (draggedNode) {
      // Delta adjustment divided by scale is critical to sync coordinates under zoomed state
      const dx = (e.clientX - nodeDragStart.x) / scale
      const dy = (e.clientY - nodeDragStart.y) / scale

      const updatedSemData = { ...semesterData }
      const activeSem = { ...updatedSemData[selectedSem] }

      if (draggedNode.type === 'course') {
        activeSem.courses = activeSem.courses.map((c) =>
          c.id === draggedNode.id ? { ...c, x: nodeInitialPos.x + dx, y: nodeInitialPos.y + dy } : c
        )
      } else {
        activeSem.topics = activeSem.topics.map((t) =>
          t.id === draggedNode.id ? { ...t, x: nodeInitialPos.x + dx, y: nodeInitialPos.y + dy } : t
        )

        // Sync local selected node details
        if (selectedNode && selectedNode.id === draggedNode.id) {
          setSelectedNode((prev) => (prev ? { ...prev, x: nodeInitialPos.x + dx, y: nodeInitialPos.y + dy } : null))
        }
      }

      updatedSemData[selectedSem] = activeSem
      setSemesterData(updatedSemData)
    }
  }

  const handleMouseUp = () => {
    if (isPanning) {
      setIsPanning(false)
    }
    if (draggedNode) {
      setDraggedNode(null)
      // Persist new dragged coordinates
      saveToStorage(semesterData)
    }
  }

  const resetPanZoom = () => {
    setPan({ x: 0, y: 0 })
    setScale(1.0)
  }

  // ─── Node Drag Handlers ───────────────────────────────────────────────────

  const startNodeDrag = (e: React.MouseEvent, type: 'course' | 'topic', id: string, initialX: number, initialY: number) => {
    e.stopPropagation()
    setDraggedNode({ id, type })
    setNodeDragStart({ x: e.clientX, y: e.clientY })
    setNodeInitialPos({ x: initialX, y: initialY })
  }

  // ─── Node Color Decider ───────────────────────────────────────────────────

  const getScoreColor = (score: number, bg = false) => {
    if (score >= 80) return bg ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400' : '#10b981'
    if (score >= 50) return bg ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400' : '#f59e0b'

    return bg ? 'bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400' : '#f43f5e'
  }

  // ─── AI Diagnostics Advice Generator ─────────────────────────────────────

  const getAIDiagnosticText = (score: number, name: string) => {
    if (score >= 80) {
      return currentLang === 'id'
        ? `Luar biasa! AI mendiagnosis bahwa penguasaan Anda pada "${name}" berada pada level Mahir (${score}/100). Anda memiliki fondasi kuat pada bagian ini. AI merekomendasikan untuk menantang diri Anda dengan topik tingkat lanjut.`
        : `Splendid! The AI diagnostics report shows your mastery in "${name}" is at Advanced level (${score}/100). You hold a robust grasp here. AI recommends pushing further with complex projects.`
    }
    if (score >= 50) {
      return currentLang === 'id'
        ? `Pemahaman memadai. Skor Anda (${score}/100) menunjukkan pemahaman konsep dasar yang cukup pada "${name}". AI merekomendasikan untuk memperbanyak latihan soal kuis dan mereview materi LMS sub-bab ini untuk memperkuat memori.`
        : `Fair understanding. Your score (${score}/100) indicates decent baseline comprehension of "${name}". AI suggests attempting supplementary quiz practices and reviewing LMS sub-modules to solidify retention.`
    }

    return currentLang === 'id'
      ? `Perhatian Khusus! Penguasaan pada "${name}" berada pada zona Kritis (${score}/100). AI mendeteksi celah pemahaman yang signifikan. Sangat direkomendasikan untuk menanyakan AI Tutor tentang konsep dasar atau menjadwalkan mentoring tatap muka.`
      : `Critical Alert! Concept mastery in "${name}" is low (${score}/100). AI flags major structural understanding gaps. It is highly recommended to consult the 24/7 AI Tutor or request a mentor revision session.`
  }

  // ─── Drawer Update Handlers ───────────────────────────────────────────────

  const updateSelectedTopic = (fields: Partial<TopicNode>) => {
    if (!selectedNode) return

    const updated = { ...selectedNode, ...fields }
    setSelectedNode(updated)

    const updatedSemData = { ...semesterData }
    const activeSem = { ...updatedSemData[selectedSem] }

    activeSem.topics = activeSem.topics.map((t) => (t.id === selectedNode.id ? updated : t))
    updatedSemData[selectedSem] = activeSem
    saveToStorage(updatedSemData)
  }

  const deleteTopic = (id: string) => {
    const updatedSemData = { ...semesterData }
    const activeSem = { ...updatedSemData[selectedSem] }

    activeSem.topics = activeSem.topics.filter((t) => t.id !== id)
    updatedSemData[selectedSem] = activeSem

    setSelectedNode(null)
    saveToStorage(updatedSemData)
  }

  // ─── Add Custom Topic Handlers ────────────────────────────────────────────

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTopicName.trim() || !newTopicCourseId) return

    const selectedCourse = activeCourses.find((c) => c.id === newTopicCourseId)
    if (!selectedCourse) return

    // Position new node slightly offset to the right/left of the parent course
    const angle = Math.random() * Math.PI * 2
    const radius = 120
    const x = Math.round(selectedCourse.x + Math.cos(angle) * radius)
    const y = Math.round(selectedCourse.y + Math.sin(angle) * radius)

    const newTopic: TopicNode = {
      id: `custom-topic-${Date.now()}`,
      name: newTopicName,
      score: newTopicScore,
      x,
      y,
      courseId: newTopicCourseId,
      description:
        currentLang === 'id' ? 'Topik belajar tambahan yang dibuat siswa.' : 'Additional custom-added student topic.'
    }

    const updatedSemData = { ...semesterData }
    const activeSem = { ...updatedSemData[selectedSem] }

    activeSem.topics = [...activeSem.topics, newTopic]
    updatedSemData[selectedSem] = activeSem

    saveToStorage(updatedSemData)

    // Reset Form
    setNewTopicName('')
    setNewTopicScore(75)
    setIsAddModalOpen(false)
  }

  // ─── Connection Path Generator (Curved Bezier) ───────────────────────────

  const getBezierPath = (x1: number, y1: number, x2: number, y2: number) => {
    const dx = Math.abs(x2 - x1) * 0.5

    return `M ${x1} ${y1} C ${x1 + (x2 > x1 ? dx : -dx)} ${y1}, ${x2 - (x2 > x1 ? dx : -dx)} ${y2}, ${x2} ${y2}`
  }

  return (
    <div className="relative flex h-[calc(100vh-176px)] flex-col gap-5 overflow-hidden md:h-[calc(100vh-110px)]">
      {/* ─── Control Header ─── */}
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800/60">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-black tracking-tight text-[#333] sm:text-2xl dark:text-white">
            <BrainIcon size={26} className="text-primary" />{' '}
            {currentLang === 'id' ? 'Peta Belajar Kompetensi AI' : 'AI Mastery Competence Graph'}
          </h1>
          <p className="mt-1 text-xs text-text-muted">
            {currentLang === 'id'
              ? 'Analisis visual penguasaan akademik Anda terintegrasi asisten AI.'
              : 'Visual map of your academic strengths diagnosed by AI.'}
          </p>
        </div>

        {/* Toolbar & Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Semester Selector */}
          <div className="relative">
            <select
              value={selectedSem}
              onChange={(e) => {
                setSelectedSem(e.target.value)
                setSelectedNode(null)
              }}
              className="appearance-none rounded-full border border-slate-200 bg-white py-1.5 pr-10 pl-4 text-xs font-bold text-text-dark shadow-sm focus:ring-1 focus:ring-primary focus:outline-none dark:border-neutral-800 dark:bg-neutral-900"
            >
              {semestersList.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute top-2.5 right-3.5 text-text-muted">
              <CaretDownIcon size={12} weight="bold" />
            </div>
          </div>

          {/* Reset Zoom Pan */}
          <button
            onClick={resetPanZoom}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-text-muted shadow-sm hover:text-text-dark dark:border-neutral-800 dark:bg-neutral-900"
            title="Reset Zoom & Pan"
          >
            <ArrowsOutIcon size={16} weight="bold" />
          </button>

          {/* Zoom In */}
          <button
            onClick={() => setScale((prev) => Math.min(prev + 0.1, 2.5))}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-text-muted shadow-sm hover:text-text-dark dark:border-neutral-800 dark:bg-neutral-900"
            title="Zoom In"
          >
            <MagnifyingGlassPlusIcon size={16} weight="bold" />
          </button>

          {/* Zoom Out */}
          <button
            onClick={() => setScale((prev) => Math.max(prev - 0.1, 0.4))}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-text-muted shadow-sm hover:text-text-dark dark:border-neutral-800 dark:bg-neutral-900"
            title="Zoom Out"
          >
            <MagnifyingGlassMinusIcon size={16} weight="bold" />
          </button>

          {/* Add Custom Topic Button */}
          <button
            onClick={() => {
              if (activeCourses.length > 0) {
                setNewTopicCourseId(activeCourses[0].id)
                setIsAddModalOpen(true)
              }
            }}
            className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-white shadow hover:opacity-90"
          >
            <PlusIcon size={14} weight="bold" />
            <span>{currentLang === 'id' ? 'Tambah Topik' : 'Add Topic'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Selector */}
      <div className="flex rounded-xl bg-slate-100 p-1 lg:hidden dark:bg-neutral-900">
        <button
          onClick={() => setMobileTab('detector')}
          className={cn(
            'flex-1 rounded-lg py-2 text-center text-xs font-black transition-all',
            mobileTab === 'detector'
              ? 'bg-white text-text-dark shadow-sm dark:bg-neutral-800 dark:text-white'
              : 'text-text-muted hover:text-text-dark'
          )}
        >
          {currentLang === 'id' ? 'Detektor Kelemahan' : 'AI Diagnostics'}
        </button>
        <button
          onClick={() => setMobileTab('graph')}
          className={cn(
            'flex-1 rounded-lg py-2 text-center text-xs font-black transition-all',
            mobileTab === 'graph'
              ? 'bg-white text-text-dark shadow-sm dark:bg-neutral-800 dark:text-white'
              : 'text-text-muted hover:text-text-dark'
          )}
        >
          {currentLang === 'id' ? 'Peta Kompetensi' : 'Competency Graph'}
        </button>
      </div>

      {/* ─── Main Split Panel Layout ─── */}
      <div className="flex flex-1 flex-col gap-5 overflow-hidden lg:flex-row">
        {/* ─── Left Column: AI Diagnostics Dashboard Panel ─── */}
        <div
          data-lenis-prevent
          className={cn(
            'flex min-h-0 w-full flex-1 flex-col gap-4 overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 lg:w-80 lg:flex-none lg:shrink-0 dark:border-neutral-800/60 dark:bg-[#1e1e1e]',
            mobileTab !== 'detector' && 'hidden lg:flex'
          )}
        >
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-neutral-800/80">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
              <CpuIcon size={16} weight="bold" />
            </div>
            <div>
              <h2 className="text-xs font-black tracking-wider text-text-dark uppercase dark:text-white">
                {currentLang === 'id' ? 'Detektor Kelemahan AI' : 'AI Weakness Detector'}
              </h2>
              <span className="text-[9px] font-bold text-text-muted">
                {currentLang === 'id' ? 'Analisis Track Record Siswa' : 'Student Performance Audit'}
              </span>
            </div>
          </div>

          {/* Student Track Record Insights */}
          <div className="space-y-2.5">
            <h3 className="text-[10px] font-extrabold tracking-wider text-text-muted uppercase">
              {currentLang === 'id' ? 'Audit Keaktifan & Kelas' : 'Class Engagement Logs'}
            </h3>
            <div className="space-y-1.5">
              {activeCourses.map((c) => {
                const hasWarning = c.attendance && (c.code === 'CHAR6002003' || c.code === 'ISYS6015005')

                return (
                  <div
                    key={c.id}
                    className={cn(
                      'flex items-center justify-between rounded-xl border p-2.5 transition-all duration-200',
                      hasWarning
                        ? 'border-amber-100 bg-amber-50/30 dark:border-amber-900/20 dark:bg-amber-950/10'
                        : 'border-slate-50 bg-slate-50/50 dark:border-neutral-800/60 dark:bg-neutral-900/40'
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="truncate text-[9.5px] leading-none font-bold text-text-dark dark:text-white">
                          {c.name}
                        </span>
                        {hasWarning && (
                          <span
                            className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[8.5px] font-black text-white"
                            title="Attendance Warning"
                          >
                            !
                          </span>
                        )}
                      </div>
                      <span className="text-[8.5px] text-text-muted">
                        {c.code} • Kelas {c.classCode || 'LA05'}
                      </span>
                    </div>
                    <span
                      className={cn(
                        'shrink-0 pl-2 text-right text-[9.5px] font-black',
                        hasWarning ? 'text-amber-500' : 'text-emerald-500'
                      )}
                    >
                      {c.attendance || '100%'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Detected Weaknesses List */}
          <div className="flex-1 space-y-3">
            <h3 className="text-[10px] font-extrabold tracking-wider text-text-muted uppercase">
              {currentLang === 'id' ? 'Kompetensi Kritis (Skor < 60)' : 'Critical Gaps (Score < 60)'}
            </h3>
            <div className="space-y-2">
              {activeTopics.filter((t) => t.score < 60).length === 0 ? (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-3 text-center dark:border-emerald-950/20 dark:bg-emerald-950/10">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    {currentLang === 'id' ? '✓ Semua Kompetensi Aman!' : '✓ All Competencies Clear!'}
                  </span>
                </div>
              ) : (
                activeTopics
                  .filter((t) => t.score < 60)
                  .map((wt) => {
                    const parentCourse = activeCourses.find((c) => c.id === wt.courseId)

                    return (
                      <div
                        key={wt.id}
                        onClick={() => setSelectedNode(wt)}
                        className="group cursor-pointer rounded-xl border border-slate-100 bg-white p-2.5 shadow-sm transition-all hover:border-rose-200 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-rose-900/40"
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <span className="text-[10.5px] leading-tight font-extrabold text-text-dark group-hover:text-rose-500 dark:text-white dark:group-hover:text-rose-400">
                            {wt.name}
                          </span>
                          <span className="shrink-0 rounded bg-rose-500/10 px-1 py-0.5 text-[9px] font-black text-rose-500">
                            {wt.score}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[8px] text-text-muted">
                          <span>{parentCourse ? parentCourse.code : ''}</span>
                          <span className="group-hover:text-primary-dark font-bold text-primary underline">
                            {currentLang === 'id' ? 'Lihat Peta' : 'View Node'}
                          </span>
                        </div>
                      </div>
                    )
                  })
              )}
            </div>
          </div>

          {/* AI Tutor Consultation CTA */}
          {activeTopics.filter((t) => t.score < 60).length > 0 && (
            <div className="mt-auto border-t border-slate-100 pt-3 dark:border-neutral-800/80">
              {(() => {
                const lowestTopic = activeTopics
                  .filter((t) => t.score < 60)
                  .reduce((min, t) => (t.score < min.score ? t : min), activeTopics.filter((t) => t.score < 60)[0])
                const parentCourse = activeCourses.find((c) => c.id === lowestTopic.courseId)
                const prefilledPrompt =
                  currentLang === 'id'
                    ? `Halo AI Tutor, saya butuh bantuan memahami materi "${lowestTopic.name}" dari mata kuliah "${parentCourse?.name}". AI mendiagnosis pemahaman saya di topik ini masih rendah (${lowestTopic.score}/100).`
                    : `Hello AI Tutor, I need help understanding "${lowestTopic.name}" from "${parentCourse?.name}". The AI diagnostic flagged this as my core weakness (score: ${lowestTopic.score}/100).`

                return (
                  <Link
                    href={`/dashboard/ai?prompt=${encodeURIComponent(prefilledPrompt)}`}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-2.5 text-xs font-black text-white shadow-md shadow-purple-500/20 transition-all duration-200 hover:scale-[0.98] hover:shadow-lg hover:shadow-purple-500/30 active:scale-[0.96]"
                  >
                    <CpuIcon size={14} weight="bold" />
                    <span>{currentLang === 'id' ? 'Tanya AI Tutor' : 'Ask AI Tutor'}</span>
                  </Link>
                )
              })()}
            </div>
          )}
        </div>

        {/* ─── Right Column: Interactive SVG Canvas ─── */}
        <div
          className={cn(
            'relative flex-1 overflow-hidden rounded-3xl border border-slate-200 bg-[#fbfcfd] dark:border-neutral-800/60 dark:bg-[#151515]',
            mobileTab !== 'graph' && 'hidden lg:block'
          )}
        >
          <svg
            ref={svgRef}
            className={cn('h-full w-full outline-none select-none', isPanning ? 'cursor-grabbing' : 'cursor-grab')}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* repeated dot pattern grid for sleek visualization feedback */}
            <defs>
              <pattern id="dot-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.2" fill="#cbd5e1" className="opacity-60 dark:fill-neutral-800 dark:opacity-100" />
              </pattern>
              {/* dynamic flows flow line styling */}
              <linearGradient id="central-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--color-primary)" />
                <stop offset="100%" stopColor="var(--color-secondary)" />
              </linearGradient>
              {/* Soft SVG Drop Shadow Filter for nodes */}
              <filter id="node-shadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#000000" floodOpacity="0.08" />
                <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000000" floodOpacity="0.04" />
              </filter>
            </defs>

            {/* Grid Background Pattern */}
            <rect width="100%" height="100%" fill="url(#dot-grid)" />

            {/* Infinite zoom group */}
            <g transform={`translate(${pan.x}, ${pan.y}) scale(${scale})`}>
              {/* ─── Connections Flow lines (drawn behind nodes) ─── */}

              {/* Hub to Courses connections */}
              {activeCourses.map((course) => (
                <path
                  key={`flow-${course.id}`}
                  d={getBezierPath(CENTRAL_HUB_X, CENTRAL_HUB_Y, course.x, course.y)}
                  fill="none"
                  stroke="url(#central-gradient)"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                  className="[animation:flow-lines_1.2s_linear_infinite] opacity-80"
                />
              ))}

              {/* Courses to Topics connections */}
              {activeTopics.map((topic) => {
                const parentCourse = activeCourses.find((c) => c.id === topic.courseId)
                if (!parentCourse) return null
                const strokeColor = getScoreColor(topic.score)

                return (
                  <path
                    key={`flow-${topic.id}`}
                    d={getBezierPath(parentCourse.x, parentCourse.y, topic.x, topic.y)}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="1.5"
                    strokeDasharray="5 5"
                    className="[animation:flow-lines_2s_linear_infinite] opacity-70"
                  />
                )
              })}

              {/* ─── Nodes Render ─── */}

              {/* Central Brain Hub */}
              <g transform={`translate(${CENTRAL_HUB_X}, ${CENTRAL_HUB_Y})`} className="mindmap-node cursor-default">
                <circle
                  r="38"
                  fill="var(--color-primary)"
                  className="stroke-white dark:stroke-neutral-800"
                  strokeWidth="3.5"
                  filter="url(#node-shadow)"
                />
                <circle
                  r="38"
                  fill="none"
                  stroke="var(--color-secondary)"
                  strokeWidth="1.5"
                  className="animate-ping opacity-30"
                />
                <foreignObject x="-30" y="-30" width="60" height="60" className="pointer-events-none">
                  <div className="flex h-full w-full flex-col items-center justify-center text-center text-white">
                    <BrainIcon size={26} weight="fill" />
                    <span className="mt-0.5 text-[7px] font-black tracking-widest uppercase">OTAK AI</span>
                  </div>
                </foreignObject>
              </g>

              {/* Course Nodes */}
              {activeCourses.map((course) => {
                const courseTopics = activeTopics.filter((t) => t.courseId === course.id)
                const avgScore =
                  courseTopics.length > 0
                    ? Math.round(courseTopics.reduce((s, t) => s + t.score, 0) / courseTopics.length)
                    : 0
                const hasWarning = course.code === 'CHAR6002003' || course.code === 'ISYS6015005'

                return (
                  <g
                    key={course.id}
                    transform={`translate(${course.x}, ${course.y})`}
                    className="mindmap-node group cursor-grab active:cursor-grabbing"
                    onMouseDown={(e) => startNodeDrag(e, 'course', course.id, course.x, course.y)}
                  >
                    <rect
                      x="-80"
                      y="-29"
                      width="160"
                      height="58"
                      rx="14"
                      fill="#ffffff"
                      stroke="var(--color-primary)"
                      strokeWidth="2.5"
                      filter="url(#node-shadow)"
                      className="transition-all duration-200 dark:fill-[#1e1e1e]"
                    />

                    {/* Attendance warning badge on top-left of Course Node */}
                    {hasWarning && (
                      <g transform="translate(-80, -29)">
                        <circle r="7.5" fill="#f59e0b" className="stroke-white dark:stroke-neutral-800" strokeWidth="1.5" />
                        <text y="2.5" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="black">
                          !
                        </text>
                      </g>
                    )}

                    <foreignObject x="-80" y="-29" width="160" height="58" className="pointer-events-none">
                      <div className="flex h-full w-full flex-col justify-between px-3 py-1.5">
                        <div className="flex items-center justify-between leading-none">
                          <span className="text-[6.5px] font-extrabold tracking-wider text-text-muted uppercase">
                            {course.code}
                          </span>
                          {course.classCode && (
                            <span className="rounded bg-slate-100 px-1 py-0.5 text-[6px] font-black text-text-dark dark:bg-neutral-800 dark:text-neutral-300">
                              {course.classCode}
                            </span>
                          )}
                        </div>
                        <span className="line-clamp-2 text-[7.5px] leading-tight font-black text-text-dark dark:text-white">
                          {course.name}
                        </span>
                        {/* Progress Bar */}
                        <div className="flex items-center gap-1.5 leading-none">
                          <div className="relative h-1 flex-1 rounded-full bg-slate-100 dark:bg-neutral-800">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${avgScore}%` }} />
                          </div>
                          <span className="text-[6px] font-black text-text-muted">{avgScore}%</span>
                        </div>
                      </div>
                    </foreignObject>
                  </g>
                )
              })}

              {/* Topic Nodes */}
              {activeTopics.map((topic) => {
                const borderCol = getScoreColor(topic.score)
                const isSelected = selectedNode && selectedNode.id === topic.id
                const isWeak = topic.score < 60

                return (
                  <g
                    key={topic.id}
                    transform={`translate(${topic.x}, ${topic.y})`}
                    className="mindmap-node group cursor-grab active:cursor-grabbing"
                    onMouseDown={(e) => startNodeDrag(e, 'topic', topic.id, topic.x, topic.y)}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedNode(topic)
                    }}
                  >
                    {/* Selector Ring */}
                    {isSelected && (
                      <circle
                        r="28"
                        fill="none"
                        stroke={borderCol}
                        strokeWidth="2"
                        strokeDasharray="4 2"
                        className="animate-[spin_12s_linear_infinite]"
                      />
                    )}

                    {/* Weak node pulsating glow ring */}
                    {isWeak && (
                      <circle r="27" fill="none" stroke="#f43f5e" strokeWidth="2" className="animate-ping opacity-40" />
                    )}

                    <circle
                      r="22"
                      fill="#ffffff"
                      stroke={borderCol}
                      strokeWidth={isSelected ? '3.5' : '2'}
                      filter="url(#node-shadow)"
                      className="transition-all duration-200 group-hover:scale-105 dark:fill-[#222]"
                    />

                    {/* Exclamation badge on top-left of Topic Node if weak */}
                    {isWeak && (
                      <g transform="translate(-16, -16)">
                        <circle r="6" fill="#f59e0b" className="dark:stroke-neutral-850 stroke-white" strokeWidth="1.5" />
                        <text y="2.5" textAnchor="middle" fill="#ffffff" fontSize="7.5" fontWeight="black">
                          !
                        </text>
                      </g>
                    )}

                    {/* Small inner score badge */}
                    <circle
                      cx="15"
                      cy="-15"
                      r="9.5"
                      fill={borderCol}
                      className="stroke-white dark:stroke-neutral-800"
                      strokeWidth="1.5"
                    />
                    {/* Score text */}
                    <text
                      x="15"
                      y="-12"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="7.5"
                      fontWeight="black"
                      className="pointer-events-none"
                    >
                      {topic.score}
                    </text>
                    <foreignObject x="-20" y="-14" width="40" height="28" className="pointer-events-none">
                      <div className="flex h-full w-full items-center justify-center text-center leading-none">
                        <span className="line-clamp-3 text-[7px] font-bold text-text-dark dark:text-white">
                          {topic.name}
                        </span>
                      </div>
                    </foreignObject>
                  </g>
                )
              })}
            </g>
          </svg>

          {/* Floating Pan Reset Legend */}
          <div className="pointer-events-none absolute bottom-4 left-4 flex flex-col gap-1.5">
            <div className="pointer-events-auto flex items-center gap-4.5 rounded-xl border border-slate-200 bg-white/90 p-3 shadow-md backdrop-blur-md dark:border-neutral-800 dark:bg-[#1a1a1a]/95">
              <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span>≥80 {currentLang === 'id' ? 'Mahir' : 'Advanced'}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted">
                <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                <span>≥50 {currentLang === 'id' ? 'Cukup' : 'Competent'}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted">
                <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                <span>&lt;50 {currentLang === 'id' ? 'Kritis' : 'Critical'}</span>
              </div>
            </div>
          </div>

          {/* ─── CRUD Side Drawer Panel ─── */}
          <AnimatePresence>
            {selectedNode && (
              <>
                {/* Backdrop on mobile to focus on drawer */}
                <div
                  onClick={() => setSelectedNode(null)}
                  className="absolute inset-0 z-30 bg-black/40 backdrop-blur-xs lg:hidden"
                />
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                  className="absolute top-0 right-0 z-40 h-full w-full border-l border-slate-200 bg-white shadow-2xl sm:w-80 lg:rounded-r-3xl dark:border-neutral-800 dark:bg-[#1e1e1e]"
                >
                  <div data-lenis-prevent className="flex h-full flex-col overflow-y-auto p-5">
                    {/* Drawer Header */}
                    <div className="flex items-start justify-between border-b border-slate-100 pb-3 dark:border-neutral-800/80">
                      <div>
                        <h3 className="text-xs font-bold tracking-wider text-primary uppercase">
                          {currentLang === 'id' ? 'Analisis Penguasaan' : 'Topic Diagnosis'}
                        </h3>
                        <h4 className="mt-0.5 line-clamp-1 text-sm font-black text-text-dark dark:text-white">
                          {selectedNode.name}
                        </h4>
                      </div>
                      <button
                        onClick={() => setSelectedNode(null)}
                        className="rounded-lg p-1 text-text-muted hover:bg-slate-100 hover:text-text-dark dark:hover:bg-neutral-800"
                      >
                        <XIcon size={16} weight="bold" />
                      </button>
                    </div>

                    {/* Drawer Content */}
                    <div className="mt-4 flex-1 space-y-5">
                      {/* Topic Rename */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-muted uppercase">
                          {currentLang === 'id' ? 'Nama Topik' : 'Topic Name'}
                        </label>
                        <input
                          type="text"
                          value={selectedNode.name}
                          onChange={(e) => updateSelectedTopic({ name: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-text-dark focus:ring-1 focus:ring-primary focus:outline-none dark:border-neutral-800 dark:bg-neutral-900"
                        />
                      </div>

                      {/* Score Slider */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold text-text-muted uppercase">
                            {currentLang === 'id' ? 'Tingkat Pemahaman' : 'Comprehension Level'}
                          </label>
                          <span
                            className={cn(
                              'rounded px-1.5 py-0.5 text-[10px] font-black',
                              getScoreColor(selectedNode.score, true)
                            )}
                          >
                            {selectedNode.score} / 100
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={selectedNode.score}
                          onChange={(e) => updateSelectedTopic({ score: Number(e.target.value) })}
                          className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-primary dark:bg-neutral-800"
                        />
                      </div>

                      {/* AI Diagnostics Text Area */}
                      <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 dark:border-neutral-800/60 dark:bg-[#151515]">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-purple-600 dark:text-purple-400">
                          <CpuIcon size={14} weight="bold" />
                          <span>DIAGNOSTIK ASISTEN AI</span>
                        </div>
                        <p className="mt-2 text-[10.5px] leading-relaxed text-text-muted">
                          {getAIDiagnosticText(selectedNode.score, selectedNode.name)}
                        </p>
                      </div>

                      {/* Topic Description details */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-muted uppercase">
                          {currentLang === 'id' ? 'Fokus Silabus & Materi' : 'Syllabus Focus'}
                        </label>
                        <p className="text-[11px] leading-relaxed text-[#555] dark:text-neutral-400">
                          {selectedNode.description || 'Deskripsi silabus akademik untuk topik pembelajaran ini.'}
                        </p>
                      </div>
                    </div>

                    {/* Delete button (bottom aligned) */}
                    <div className="border-t border-slate-100 pt-3 dark:border-neutral-800/80">
                      <button
                        onClick={() => deleteTopic(selectedNode.id)}
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-rose-500/10 py-2 text-xs font-bold text-rose-500 hover:bg-rose-500 hover:text-white"
                      >
                        <TrashIcon size={14} weight="bold" />
                        <span>{currentLang === 'id' ? 'Hapus Topik' : 'Delete Topic'}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── TAMBAH TOPIK MODAL ─── */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="dark:border-neutral-850 relative w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:bg-[#1a1a1a]"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-neutral-800">
                <h3 className="text-sm font-black text-text-dark dark:text-white">
                  {currentLang === 'id' ? 'Tambah Topik Kompetensi Baru' : 'Add New Competency Topic'}
                </h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-text-muted hover:text-text-dark">
                  <XIcon size={16} weight="bold" />
                </button>
              </div>

              <form onSubmit={handleAddTopic} className="mt-4 space-y-4">
                {/* Attached Course Select */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-muted uppercase">
                    {currentLang === 'id' ? 'Hubungkan ke Pelajaran' : 'Link to Course'}
                  </label>
                  <div className="relative">
                    <select
                      value={newTopicCourseId}
                      onChange={(e) => setNewTopicCourseId(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2 pr-10 pl-3.5 text-xs font-bold text-text-dark focus:ring-1 focus:ring-primary focus:outline-none dark:border-neutral-800 dark:bg-neutral-900"
                    >
                      {activeCourses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.code} - {course.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute top-2.5 right-3.5 text-text-muted">
                      <CaretDownIcon size={12} weight="bold" />
                    </div>
                  </div>
                </div>

                {/* Topic Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-muted uppercase">
                    {currentLang === 'id' ? 'Nama Topik Baru' : 'Topic Title'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={currentLang === 'id' ? 'Contoh: Metode Algoritma K-Means' : 'e.g. K-Means Clustering'}
                    value={newTopicName}
                    onChange={(e) => setNewTopicName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-text-dark focus:ring-1 focus:ring-primary focus:outline-none dark:border-neutral-800 dark:bg-neutral-900"
                  />
                </div>

                {/* Initial Score Slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-text-muted uppercase">
                      {currentLang === 'id' ? 'Skor Awal' : 'Initial Mastery Score'}
                    </label>
                    <span className={cn('rounded px-1.5 py-0.5 text-[9px] font-black', getScoreColor(newTopicScore, true))}>
                      {newTopicScore} / 100
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={newTopicScore}
                    onChange={(e) => setNewTopicScore(Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-primary dark:bg-neutral-800"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full rounded-xl bg-primary py-2.5 text-xs font-black text-white shadow hover:opacity-90"
                >
                  {currentLang === 'id' ? 'Tambahkan ke Peta' : 'Add to Graph'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Connection Flow dash CSS animation styles */}
      <style>{`
        @keyframes flow-lines {
          to {
            stroke-dashoffset: -20;
          }
        }
      `}</style>
    </div>
  )
}
