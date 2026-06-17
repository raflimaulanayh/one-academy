'use client'

import {
  SignOutIcon,
  HouseIcon,
  BookOpenIcon,
  FileTextIcon,
  CpuIcon,
  CalendarBlankIcon,
  CloudArrowUpIcon,
  CheckIcon,
  UserCircleIcon
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import Cookies from 'js-cookie'
import { signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/atoms/ui/button'
import { ThemeToggle } from '@/components/atoms/ui/theme-toggle'
import { ChabotSection } from '@/components/organisms/chatbot'

type CourseModule = {
  id: number
  title: string
  lessons: string[]
  pdfUrl: string
}

type Assignment = {
  id: number
  title: string
  deadline: string
  status: 'pending' | 'submitted'
  score?: number
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'home' | 'lms' | 'assignments' | 'ai'>('home')
  const [userData, setUserData] = useState<any>(null)

  // States untuk mockup interaktif (LocalStorage)
  const [attendanceCount, setAttendanceCount] = useState(12)
  const [hasAttendedToday, setHasAttendedToday] = useState(false)
  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: 1, title: 'Tugas 1: Pengenalan Platform & Navigasi Belajar', deadline: '22 Juni 2026', status: 'pending' },
    { id: 2, title: 'Tugas 2: Studi Kasus Berpikir Komputasional', deadline: '29 Juni 2026', status: 'pending' }
  ])
  const [selectedCourse, setSelectedCourse] = useState<CourseModule | null>(null)

  // Baca cookie data pendaftaran saat mount
  useEffect(() => {
    const mockUserCookie = Cookies.get('mock_user_data')
    if (mockUserCookie) {
      try {
        const parsed = JSON.parse(mockUserCookie)
        setUserData(parsed)
      } catch (e) {
        console.error(e)
      }
    } else {
      // Fallback jika masuk lewat default session NextAuth
      setUserData({
        name: 'Siswa Teladan',
        email: 'student@oneacademy.id',
        tier: 'univ',
        school: 'SATU University'
      })
    }

    // Load mock states dari localStorage
    const savedAttendance = localStorage.getItem('mock_attendance_today')
    if (savedAttendance === 'true') {
      setHasAttendedToday(true)
      setAttendanceCount(13)
    }

    const savedAssignments = localStorage.getItem('mock_assignments')
    if (savedAssignments) {
      try {
        setAssignments(JSON.parse(savedAssignments))
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  if (!userData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="animate-pulse font-medium text-text-muted">Memuat Portal Siswa...</p>
      </div>
    )
  }

  // Label Pendidikan
  const tierLabels: Record<string, string> = {
    sd: 'Sekolah Dasar (SD)',
    smp: 'Sekolah Menengah Pertama (SMP)',
    sma: 'Sekolah Menengah Atas (SMA)',
    univ: 'Perguruan Tinggi (Universitas)'
  }

  // Modul Pembelajaran sesuai tier
  const courseModules: Record<string, CourseModule[]> = {
    sd: [
      {
        id: 1,
        title: 'Bab 1: Mengenal Angka & Berhitung Ceria',
        lessons: ['Mengenal Angka 1-10', 'Penjumlahan Gambar', 'Game Matematika Dasar'],
        pdfUrl: '#'
      },
      {
        id: 2,
        title: 'Bab 2: Mengenal Flora & Fauna Sekitar Kita',
        lessons: ['Hewan Jinak & Liar', 'Bagian Tubuh Tumbuhan', 'Menjaga Kebersihan Lingkungan'],
        pdfUrl: '#'
      },
      {
        id: 3,
        title: 'Bab 3: Keterampilan Bahasa & Bercerita',
        lessons: ['Mengeja Suku Kata', 'Membaca Dongeng Anak', 'Menulis Huruf Tegak Bersambung'],
        pdfUrl: '#'
      }
    ],
    smp: [
      {
        id: 1,
        title: 'Aljabar Dasar & Himpunan Matematika',
        lessons: ['Mengenal Variabel & Konstanta', 'Operasi Aljabar Satu Variabel', 'Diagram Venn & Himpunan'],
        pdfUrl: '#'
      },
      {
        id: 2,
        title: 'Struktur Organisme Sel & Ekosistem',
        lessons: ['Sel Hewan vs Sel Tumbuhan', 'Rantai Makanan & Simbiosis', 'Klasifikasi Makhluk Hidup'],
        pdfUrl: '#'
      },
      {
        id: 3,
        title: 'Grammar Dasar & Tenses Bahasa Inggris',
        lessons: ['Simple Present Tense', 'Vocabulary in Daily Activities', 'Basic Conversation Practice'],
        pdfUrl: '#'
      }
    ],
    sma: [
      {
        id: 1,
        title: 'Kalkulus Dasar: Teori Limit & Turunan',
        lessons: ['Konsep Limit Fungsi Aljabar', 'Rumus Turunan Fungsi', 'Penerapan Turunan dalam Fisika'],
        pdfUrl: '#'
      },
      {
        id: 2,
        title: 'Fisika Optik, Gelombang, & Cahaya',
        lessons: [
          'Gelombang Mekanik & Elektromagnetik',
          'Optik Geometris: Cermin & Lensa',
          'Interferensi & Difraksi Cahaya'
        ],
        pdfUrl: '#'
      },
      {
        id: 3,
        title: 'Persiapan Tryout UTBK & Skolastik',
        lessons: ['Latihan Soal Penalaran Umum', 'Pemahaman Bacaan & Menulis', 'Pengetahuan Kuantitatif Sukses'],
        pdfUrl: '#'
      }
    ],
    univ: [
      {
        id: 1,
        title: 'Modern Software Engineering & Agile',
        lessons: ['Agile & Scrum Framework', 'Git Version Control & Collaboration', 'Software Design Patterns'],
        pdfUrl: '#'
      },
      {
        id: 2,
        title: 'Struktur Data Lanjut & Kompleksitas',
        lessons: ['Tree & Graph Traversals', 'Sorting Algorithms Analysis', 'Big O Notation & Optimization'],
        pdfUrl: '#'
      },
      {
        id: 3,
        title: 'IoT & Hardware Integration Lab',
        lessons: ['Arduino & Sensor Interfacing', 'WiFi Protocol (ESP32) Integration', 'Cloud MQTT Data Streams'],
        pdfUrl: '#'
      }
    ]
  }

  const activeModules = courseModules[userData.tier] || courseModules['univ']

  // Handler Absensi
  const handleAttendance = () => {
    setHasAttendedToday(true)
    setAttendanceCount((prev) => prev + 1)
    localStorage.setItem('mock_attendance_today', 'true')
    toast.success('Presensi berhasil dicatat untuk hari ini!')
  }

  // Handler Pengumpulan Tugas
  const handleFileUpload = (id: number) => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.onchange = (e: any) => {
      const file = e.target.files[0]
      if (file) {
        const updated = assignments.map((asg) => {
          if (asg.id === id) {
            return { ...asg, status: 'submitted' as const, score: 95 }
          }

          return asg
        })
        setAssignments(updated)
        localStorage.setItem('mock_assignments', JSON.stringify(updated))
        toast.success(`Tugas "${file.name}" berhasil diunggah dan dinilai!`)
      }
    }
    fileInput.click()
  }

  // Handler Logout
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar - Desktop */}
      <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-border/10 bg-primary p-6 text-white md:flex dark:bg-navy-dark">
        <div className="space-y-8">
          <div>
            <h1 className="text-xl font-black tracking-tight">ONE ACADEMY</h1>
            <p className="text-[10px] text-white/60">STUDENT PORTAL</p>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'home' ? 'bg-secondary text-white' : 'hover:bg-white/10'
              }`}
            >
              <HouseIcon size={18} weight="bold" />
              Beranda
            </button>
            <button
              onClick={() => setActiveTab('lms')}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'lms' ? 'bg-secondary text-white' : 'hover:bg-white/10'
              }`}
            >
              <BookOpenIcon size={18} weight="bold" />
              Modul LMS
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'assignments' ? 'bg-secondary text-white' : 'hover:bg-white/10'
              }`}
            >
              <FileTextIcon size={18} weight="bold" />
              Tugas & Nilai
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'ai' ? 'bg-secondary text-white' : 'hover:bg-white/10'
              }`}
            >
              <CpuIcon size={18} weight="bold" />
              AI Tutor
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-4 border-t border-white/10 pt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-secondary/40 bg-secondary/20 text-secondary">
              <UserCircleIcon size={28} weight="duotone" />
            </div>
            <div className="overflow-hidden">
              <h4 className="truncate text-xs font-bold">{userData.name}</h4>
              <p className="truncate text-[10px] text-white/60">{userData.school || 'Siswa'}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-semibold text-red-200 transition-colors hover:bg-red-500/20"
          >
            <SignOutIcon size={16} weight="bold" />
            Keluar Sesi
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-canvas px-6 dark:bg-canvas-muted">
          <div className="flex items-center gap-4">
            <h2 className="text-base font-bold text-text-dark md:hidden">ONE ACADEMY</h2>
            <span className="hidden rounded-full border border-secondary/30 bg-secondary/15 px-3 py-1 text-xs font-semibold text-secondary md:inline-flex">
              {tierLabels[userData.tier] || tierLabels['univ']}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={handleLogout}
                className="rounded-lg p-2 text-text-muted hover:bg-slate-100 hover:text-red-500 dark:hover:bg-white/5"
                title="Keluar"
              >
                <SignOutIcon size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Navigation bar */}
        <nav className="flex shrink-0 justify-around border-b border-border bg-canvas py-2 md:hidden">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'home' ? 'text-secondary' : 'text-text-muted'}`}
          >
            <HouseIcon size={20} />
            <span className="text-[9px] font-bold">Beranda</span>
          </button>
          <button
            onClick={() => setActiveTab('lms')}
            className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'lms' ? 'text-secondary' : 'text-text-muted'}`}
          >
            <BookOpenIcon size={20} />
            <span className="text-[9px] font-bold">LMS</span>
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'assignments' ? 'text-secondary' : 'text-text-muted'}`}
          >
            <FileTextIcon size={20} />
            <span className="text-[9px] font-bold">Tugas</span>
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'ai' ? 'text-secondary' : 'text-text-muted'}`}
          >
            <CpuIcon size={20} />
            <span className="text-[9px] font-bold">AI Tutor</span>
          </button>
        </nav>

        {/* Dynamic Tab Panel Container */}
        <div className="flex-1 overflow-y-auto bg-bg-light dark:bg-canvas">
          {activeTab === 'home' && (
            <div className="max-w-5xl space-y-6 p-6">
              {/* Welcome Banner */}
              <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/5 bg-gradient-to-r from-primary to-navy-active p-6 text-white md:flex-row md:items-center md:p-8 dark:from-navy-medium/50 dark:to-navy-dark">
                <div className="space-y-2">
                  <h3 className="text-xl font-black md:text-2xl">Selamat Belajar, {userData.name}!</h3>
                  <p className="text-xs text-white/80 md:text-sm">
                    Lanjutkan progres belajarmu hari ini untuk meraih nilai terbaik.
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-xs">
                  <span className="font-bold">Instansi:</span> {userData.school || '-'}
                </div>
              </div>

              {/* Statistics Row */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="space-y-2 rounded-2xl border border-border bg-canvas p-5 shadow-sm dark:bg-navy-medium/10">
                  <h4 className="text-xs font-bold tracking-wider text-text-muted uppercase">Kehadiran Kelas</h4>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-text-dark">{attendanceCount} Pertemuan</span>
                    <span className="text-xs font-bold text-green-500">94%</span>
                  </div>
                </div>
                <div className="space-y-2 rounded-2xl border border-border bg-canvas p-5 shadow-sm dark:bg-navy-medium/10">
                  <h4 className="text-xs font-bold tracking-wider text-text-muted uppercase">Tugas Dikumpul</h4>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-text-dark">
                      {assignments.filter((a) => a.status === 'submitted').length} / {assignments.length}
                    </span>
                    <span className="text-xs font-bold text-secondary">Evaluasi</span>
                  </div>
                </div>
                <div className="space-y-2 rounded-2xl border border-border bg-canvas p-5 shadow-sm dark:bg-navy-medium/10">
                  <h4 className="text-xs font-bold tracking-wider text-text-muted uppercase">Rata-rata Nilai</h4>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-text-dark">95.0</span>
                    <span className="text-xs font-bold text-green-500">A</span>
                  </div>
                </div>
              </div>

              {/* Attendance & Interactive Panel */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Attendance Tracker */}
                <div className="space-y-4 rounded-2xl border border-border bg-canvas p-6 shadow-sm lg:col-span-2 dark:bg-navy-medium/10">
                  <h4 className="flex items-center gap-2 text-base font-extrabold text-text-dark">
                    <CalendarBlankIcon size={20} className="text-secondary" />
                    Sesi Belajar & Presensi Hari Ini
                  </h4>
                  <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-border bg-bg-light/60 p-4 sm:flex-row sm:items-center dark:bg-navy-dark/40">
                    <div className="space-y-1">
                      <p className="text-xs text-text-muted">KELAS AKTIF</p>
                      <p className="text-sm font-bold text-text-dark">Sesi Mentoring Live & Review Modul Utama</p>
                      <p className="text-xs text-text-muted">19:30 - 21:00 WIB (Hari ini)</p>
                    </div>
                    {hasAttendedToday ? (
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs font-bold text-green-500">
                        <CheckIcon size={14} weight="bold" />
                        Sudah Hadir
                      </span>
                    ) : (
                      <Button
                        onClick={handleAttendance}
                        className="bg-secondary px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-amber-500"
                      >
                        Presensi Sekarang
                      </Button>
                    )}
                  </div>
                </div>

                {/* AI Tutor Card Info */}
                <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-gradient-to-br from-secondary/10 to-primary/5 p-6 shadow-sm dark:from-navy-medium/10 dark:to-navy-dark/40">
                  <div className="space-y-2">
                    <h4 className="flex items-center gap-2 text-base font-extrabold text-text-dark">
                      <CpuIcon size={20} className="text-secondary" />
                      Asisten Belajar AI
                    </h4>
                    <p className="text-xs leading-relaxed text-text-muted">
                      Butuh bantuan memahami pelajaran? Tanyakan langsung ke asisten AI One Academy yang siap 24/7
                      mendampingimu.
                    </p>
                  </div>
                  <Button onClick={() => setActiveTab('ai')} className="w-full text-xs font-bold">
                    Tanya AI Sekarang
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'lms' && (
            <div className="max-w-5xl space-y-6 p-6">
              <div>
                <h3 className="text-xl font-extrabold text-text-dark">Materi Pembelajaran</h3>
                <p className="text-xs text-text-muted">
                  Modul kurikulum modular yang disesuaikan dengan jenjang pendidikan Anda.
                </p>
              </div>

              {/* Course Modules Grid */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {activeModules.map((course) => (
                  <div
                    key={course.id}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-canvas p-5 shadow-sm dark:bg-navy-medium/10"
                  >
                    <div className="space-y-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-secondary/15 dark:text-secondary">
                        <BookOpenIcon size={20} weight="bold" />
                      </div>
                      <h4 className="text-base leading-snug font-extrabold text-text-dark">{course.title}</h4>

                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-text-muted uppercase">Topik Materi:</p>
                        <ul className="list-inside list-disc space-y-1 text-xs text-text-muted">
                          {course.lessons.map((lesson, idx) => (
                            <li key={idx} className="truncate">
                              {lesson}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-2 border-t border-border pt-4">
                      <Button onClick={() => setSelectedCourse(course)} className="flex-1 text-xs font-bold">
                        Buka Modul
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => toast.success('Mengunduh file PDF ringkasan modul...')}
                        className="border-border text-xs"
                      >
                        PDF
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Course Detail Modal Mockup */}
              {selectedCourse && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative w-full max-w-2xl space-y-4 rounded-3xl border border-border bg-canvas p-6 shadow-2xl dark:bg-navy-medium/95"
                  >
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <h4 className="text-lg font-extrabold text-text-dark">{selectedCourse.title}</h4>
                      <button
                        onClick={() => setSelectedCourse(null)}
                        className="text-sm font-bold text-text-muted hover:text-text-dark"
                      >
                        Tutup
                      </button>
                    </div>

                    {/* Mock Video Frame */}
                    <div className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-slate-900">
                      <p className="text-xs text-white/60">Pemutar Video Pelajaran (Mock Frame)</p>
                      <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/80 to-transparent p-4">
                        <span className="rounded bg-secondary px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                          LIVE
                        </span>
                        <span className="text-[10px] text-white/80">00:00 / 45:00</span>
                      </div>
                    </div>

                    {/* Lesson lists */}
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-text-dark uppercase">Daftar Sub-Bab:</p>
                      <div className="max-h-36 space-y-1.5 overflow-y-auto pr-2">
                        {selectedCourse.lessons.map((lesson, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between rounded-lg bg-bg-light p-2 text-xs dark:bg-navy-dark/40"
                          >
                            <span className="font-semibold text-text-dark">
                              {index + 1}. {lesson}
                            </span>
                            <span className="text-[10px] font-bold text-green-500">Selesai Ditonton</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'assignments' && (
            <div className="max-w-5xl space-y-6 p-6">
              <div>
                <h3 className="text-xl font-extrabold text-text-dark">Tugas & Penilaian</h3>
                <p className="text-xs text-text-muted">
                  Kumpulkan tugas Anda tepat waktu dan pantau feedback penilaian akademik.
                </p>
              </div>

              {/* Assignments List */}
              <div className="overflow-hidden rounded-2xl border border-border bg-canvas shadow-sm dark:bg-navy-medium/10">
                <table className="w-full border-collapse text-left text-sm text-text-muted">
                  <thead className="bg-bg-light text-xs font-bold text-text-dark uppercase dark:bg-navy-dark/40">
                    <tr>
                      <th className="p-4">Nama Tugas</th>
                      <th className="p-4">Batas Pengumpulan</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Nilai</th>
                      <th className="p-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {assignments.map((asg) => (
                      <tr key={asg.id} className="hover:bg-slate-50/50 dark:hover:bg-navy-medium/5">
                        <td className="p-4 font-bold text-text-dark">{asg.title}</td>
                        <td className="p-4 text-xs">{asg.deadline}</td>
                        <td className="p-4">
                          {asg.status === 'submitted' ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-0.5 text-xs font-bold text-green-500">
                              Sudah Dikumpul
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-0.5 text-xs font-bold text-orange-500">
                              Belum Dikumpul
                            </span>
                          )}
                        </td>
                        <td className="p-4 font-black text-text-dark">{asg.score ? `${asg.score} / 100` : '-'}</td>
                        <td className="p-4 text-right">
                          {asg.status === 'submitted' ? (
                            <Button
                              disabled
                              className="bg-slate-100 px-3 py-1.5 text-xs text-slate-400 dark:bg-navy-dark/30 dark:text-slate-500"
                            >
                              Selesai
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleFileUpload(asg.id)}
                              className="ml-auto flex items-center justify-center gap-1.5 bg-secondary px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-500"
                            >
                              <CloudArrowUpIcon size={14} weight="bold" />
                              Unggah File
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="flex h-[calc(100vh-4rem)] flex-col bg-slate-50 dark:bg-navy-dark/20">
              <ChabotSection />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
