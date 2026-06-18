'use client'

import { useDashboard } from '@/context/dashboard-context'
import { Link } from '@/i18n/routing'
import {
  BookOpenIcon,
  CaretDownIcon,
  ClockIcon,
  CpuIcon,
  FileTextIcon,
  GearIcon,
  MapPinIcon,
  CalendarCheckIcon,
  TrophyIcon,
  EyeIcon,
  EyeSlashIcon,
  XIcon,
  CheckCircleIcon,
  CheckIcon,
  ShieldCheckIcon,
  DeviceMobileIcon,
  WifiHighIcon,
  WarningIcon
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { QRCodeSVG } from 'qrcode.react'
import { useState, useEffect, useRef } from 'react'

import { ForumCard, InfoCard, ProgressCard, TodoListCard, UpcomingClassCard } from '@/components/organisms/dashboard'

import { cn } from '@/utils'

const MOCK_PROGRESS: Record<number, { class: number; student: number }> = {
  1: { class: 42, student: 55 },
  2: { class: 30, student: 30 },
  3: { class: 60, student: 72 }
}

export default function DashboardPage() {
  const t = useTranslations('Dashboard')
  const {
    userData,
    activeModules,
    hasAttendedToday,
    attendanceCount,
    handleAttendanceSecure,
    activeQRToken,
    qrCountdown,
    deviceBindingID,
    currentClientDeviceID,
    setCurrentClientDeviceID,
    resetAttendance,
    currentTodos,
    updateUserTier,
    tierLabels,
    currentLang,
    assignments,
    showGrades,
    toggleGradesVisibility,
    isPaid
  } = useDashboard()

  // Progress filters local state
  const [selectedSemester, setSelectedSemester] = useState('2025-even')
  const [selectedSession, setSelectedSession] = useState('all')
  const [isSemDropdownOpen, setIsSemDropdownOpen] = useState(false)
  const [isSesDropdownOpen, setIsSesDropdownOpen] = useState(false)

  // Mobile Tier Switcher dropdown state
  const [isTierDropdownOpen, setIsTierDropdownOpen] = useState(false)

  // Todo list selection state
  const [todoTab, setTodoTab] = useState<'upcoming' | 'outdated'>('upcoming')

  // Attendance simulation states
  const [isProjectorModalOpen, setIsProjectorModalOpen] = useState(false)
  const [isMobileScannerOpen, setIsMobileScannerOpen] = useState(false)

  // Click-outside dropdown references
  const semRef = useRef<HTMLDivElement>(null)
  const sesRef = useRef<HTMLDivElement>(null)
  const tierDropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (semRef.current && !semRef.current.contains(e.target as Node)) {
        setIsSemDropdownOpen(false)
      }
      if (sesRef.current && !sesRef.current.contains(e.target as Node)) {
        setIsSesDropdownOpen(false)
      }
      if (tierDropRef.current && !tierDropRef.current.contains(e.target as Node)) {
        setIsTierDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!userData) return null

  const activeClassRoom = userData.tier === 'univ' ? 'B302 - LAB' : 'R. Belajar 3A'
  const activeClassLocation =
    userData.tier === 'univ' ? 'Kampus Utama Universitas Satu - Gedung B' : 'Gedung Utama One Academy - Lantai 2'

  // Count pending tasks
  const pendingAssignmentsCount = assignments.filter((a) => a.status === 'pending').length
  const nextAssignment = assignments.find((a) => a.status === 'pending')

  return (
    <div className="space-y-6">
      {/* ─── Unified Header & Tier Switcher ─── */}
      <div className="flex flex-col gap-3.5 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800/60">
        <div>
          <h1 className="text-xl font-black tracking-tight text-[#333] sm:text-2xl dark:text-white">{t('dashboard')}</h1>
          <p className="mt-1 text-xs text-text-muted">{t('welcomeBack', { name: userData.name })}</p>
        </div>
        {/* Tier Selector Dropdown */}
        <div className="relative self-start sm:self-auto" ref={tierDropRef}>
          <button
            onClick={() => setIsTierDropdownOpen(!isTierDropdownOpen)}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-text-dark shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <span className="text-primary dark:text-secondary">Jenjang:</span>{' '}
            {tierLabels[userData.tier] || tierLabels['univ']}
            <CaretDownIcon size={14} weight="bold" />
          </button>
          {isTierDropdownOpen && (
            <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
              {(['sd', 'smp', 'sma', 'univ'] as const).map((tierKey) => (
                <button
                  key={tierKey}
                  onClick={() => {
                    updateUserTier(tierKey)
                    setIsTierDropdownOpen(false)
                  }}
                  className={cn(
                    'w-full rounded-lg px-3 py-2 text-left text-xs font-bold transition-colors hover:bg-slate-50 dark:hover:bg-neutral-800',
                    userData.tier === tierKey && 'bg-primary/10 text-primary dark:bg-secondary/15 dark:text-secondary'
                  )}
                >
                  {tierLabels[tierKey]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── Urgent Tuition Alert Banner ─── */}
      {!isPaid && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 rounded-2xl border border-red-200/60 bg-red-500/5 p-4 text-xs text-red-950 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-red-900/30 dark:bg-red-950/10 dark:text-red-200"
        >
          <div className="flex items-start gap-3.5 sm:items-center">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
              <WarningIcon size={18} weight="bold" />
            </div>
            <div>
              <p className="text-[13px] font-extrabold tracking-tight text-red-900 dark:text-red-300">
                {currentLang === 'id'
                  ? 'Tagihan Biaya Pendidikan Aktif Belum Terbayar!'
                  : 'Outstanding Tuition Bill Unpaid!'}
              </p>
              <p className="mt-0.5 font-medium text-slate-600 dark:text-neutral-400">
                {currentLang === 'id'
                  ? `Tagihan ${userData.tier === 'univ' ? 'UKT Semester Ganjil 2026/2027' : 'SPP bulan Juli 2026'} sebesar ${userData.tier === 'univ' ? 'Rp8.500.000' : 'Rp550.000'} jatuh tempo pada 30 Juni 2026.`
                  : `${userData.tier === 'univ' ? 'UKT Tuition for Odd Semester 2026/2027' : 'SPP Tuition for July 2026'} of ${userData.tier === 'univ' ? 'Rp8,500,000' : 'Rp550,000'} is due on June 30, 2026.`}
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/payment"
            className="inline-flex shrink-0 items-center justify-center gap-1 self-start rounded-xl bg-red-600 px-4 py-2.5 font-black text-white shadow-xs transition-all hover:scale-[0.99] hover:bg-red-700 active:scale-95 sm:self-auto dark:bg-red-800 dark:hover:bg-red-700"
          >
            <span>{currentLang === 'id' ? 'Bayar Sekarang' : 'Pay Now'}</span>
          </Link>
        </motion.div>
      )}

      {/* ─── Academic Stats Grid ─── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Attendance Card */}
        <div className="flex items-center gap-4.5 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_12px_rgba(0,48,87,0.02)] transition-all hover:shadow-md dark:border-neutral-800/60 dark:bg-[#1e1e1e]">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-secondary/10 dark:text-secondary">
            <CalendarCheckIcon size={22} weight="bold" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-wider text-text-muted uppercase">{t('statAttendance')}</span>
            <div className="mt-0.5 flex items-baseline gap-1">
              <span className="text-lg font-black text-text-dark dark:text-white">{attendanceCount}</span>
              <span className="text-[10px] text-text-muted">/ 14 {currentLang === 'id' ? 'Sesi' : 'Sessions'}</span>
            </div>
          </div>
        </div>

        {/* Assignments Card */}
        <div className="flex items-center gap-4.5 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_12px_rgba(0,48,87,0.02)] transition-all hover:shadow-md dark:border-neutral-800/60 dark:bg-[#1e1e1e]">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 dark:bg-amber-500/20">
            <FileTextIcon size={22} weight="bold" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-wider text-text-muted uppercase">{t('statAssignment')}</span>
            <div className="mt-0.5 flex items-baseline gap-1">
              <span className="text-lg font-black text-text-dark dark:text-white">
                {assignments.filter((a) => a.status === 'submitted').length}
              </span>
              <span className="text-[10px] text-text-muted">
                / {assignments.length} {currentLang === 'id' ? 'Tugas' : 'Tasks'}
              </span>
            </div>
          </div>
        </div>

        {/* GPA / Average Grade Card */}
        <div className="group relative flex items-center gap-4.5 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_12px_rgba(0,48,87,0.02)] transition-all hover:shadow-md dark:border-neutral-800/60 dark:bg-[#1e1e1e]">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 dark:bg-purple-500/20">
            <TrophyIcon size={22} weight="bold" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <Link
                href="/dashboard/grades"
                className="text-[10px] font-bold tracking-wider text-text-muted uppercase transition-colors hover:text-primary dark:hover:text-secondary"
              >
                {t('statAverage')}
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  toggleGradesVisibility()
                }}
                className="relative z-10 rounded p-1 text-text-muted hover:bg-slate-100 hover:text-text-dark focus:outline-none dark:hover:bg-neutral-800"
                title={showGrades ? 'Sembunyikan Nilai' : 'Tampilkan Nilai'}
              >
                {showGrades ? <EyeIcon size={14} weight="bold" /> : <EyeSlashIcon size={14} weight="bold" />}
              </button>
            </div>
            <Link href="/dashboard/grades" className="block focus:outline-none">
              <div
                className={cn(
                  'mt-0.5 flex items-center gap-1.5 transition-all duration-300',
                  !showGrades && 'blur-md select-none'
                )}
              >
                {userData.tier === 'univ' ? (
                  <>
                    <span className="text-lg font-black text-text-dark dark:text-white">3.85</span>
                    <span className="text-[10px] text-text-muted">/ 4.00</span>
                    <span className="ml-1 rounded-md bg-purple-500/10 px-2 py-0.5 text-[8px] font-black text-purple-500 uppercase">
                      IPK
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-lg font-black text-text-dark dark:text-white">
                      {userData.tier === 'sd' ? '92.5' : userData.tier === 'smp' ? '88.2' : '85.0'}
                    </span>
                    <span className="text-[10px] text-text-muted">/ 100</span>
                    <span className="ml-1 rounded-md bg-primary/10 px-2 py-0.5 text-[9px] font-black text-primary dark:bg-secondary/15 dark:text-secondary">
                      {userData.tier === 'sd' ? 'A' : userData.tier === 'smp' ? 'A-' : 'B+'}
                    </span>
                  </>
                )}
              </div>
              <div className="mt-1 text-[9px] font-bold text-primary opacity-80 transition-opacity group-hover:opacity-100 dark:text-secondary">
                {currentLang === 'id' ? 'Lihat Detail Transkrip →' : 'View Detailed Transcript →'}
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* ─── MOBILE VIEW (lg:hidden) ─── */}
      <div className="block space-y-5 pb-12 lg:hidden">
        {/* Quick Menu Icons Card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-neutral-800/60 dark:bg-[#1e1e1e]">
          <div className="grid grid-cols-5 gap-1 text-center">
            <Link href="/dashboard/lms" className="flex flex-col items-center gap-1.5 focus:outline-none">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500/10 text-primary dark:bg-primary/20">
                <BookOpenIcon size={22} weight="bold" />
              </div>
              <span className="text-[10px] font-extrabold text-[#333] dark:text-white">LMS</span>
            </Link>

            <Link href="/dashboard/ai" className="relative flex flex-col items-center gap-1.5 focus:outline-none">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-500/10 text-purple-500 dark:bg-purple-500/20">
                <CpuIcon size={22} weight="bold" />
              </div>
              <span className="absolute -top-1 right-2 rounded-full bg-red-500 px-1 py-0.5 text-[7px] font-black text-white uppercase">
                NEW
              </span>
              <span className="text-[10px] font-extrabold text-[#333] dark:text-white">AI Tutor</span>
            </Link>

            <Link href="/dashboard/assignments" className="flex flex-col items-center gap-1.5 focus:outline-none">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 dark:bg-amber-500/20">
                <FileTextIcon size={22} weight="bold" />
              </div>
              <span className="text-[10px] font-extrabold text-[#333] dark:text-white">Tugas</span>
            </Link>

            <Link href="/dashboard/leaderboard" className="flex flex-col items-center gap-1.5 focus:outline-none">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-500">
                <TrophyIcon size={22} weight="bold" />
              </div>
              <span className="text-[10px] font-extrabold text-[#333] dark:text-white">
                {currentLang === 'id' ? 'Peringkat' : 'Rank'}
              </span>
            </Link>

            <Link href="/dashboard/settings" className="flex flex-col items-center gap-1.5 focus:outline-none">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-500/10 text-slate-500 dark:bg-slate-500/20">
                <GearIcon size={22} weight="bold" />
              </div>
              <span className="text-[10px] font-extrabold text-[#333] dark:text-white">Setelan</span>
            </Link>
          </div>
        </div>

        {/* Dynamic Class Card (UPCOMING CLASS) */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#2e2e2e] dark:bg-[#1e1e1e]">
          <div className="flex items-center justify-between bg-slate-700 px-4 py-2 text-[10px] font-extrabold tracking-wider text-white uppercase dark:bg-neutral-800">
            <span>
              {currentLang === 'id' ? 'Sesi Kelas Mendatang' : 'Upcoming Onsite Class'}: {activeModules[0]?.code || 'CLASS'}
            </span>
            <span className="text-secondary">9h 21m</span>
          </div>
          <div className="p-4">
            <h4 className="text-sm font-black text-[#333] dark:text-white">
              {activeModules[0]?.title || 'Sesi Mentoring & Review'}
            </h4>
            <div className="mt-3.5 space-y-2 text-[11px] text-text-muted">
              <div className="flex items-center gap-2">
                <ClockIcon size={14} className="text-primary" />
                <span>{activeModules[0]?.schedule || 'Hari ini, 19:30 - 21:00 WIB'}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPinIcon size={14} className="mt-0.5 text-primary" />
                <span>
                  {activeClassLocation} - {activeClassRoom}
                </span>
              </div>
            </div>

            {/* Attendance Check-in Action */}
            <div className="mt-4 border-t border-slate-50 pt-4 dark:border-neutral-800">
              {hasAttendedToday ? (
                <div className="space-y-2">
                  <button
                    disabled
                    className="flex w-full cursor-default items-center justify-center gap-1.5 rounded-xl bg-green-500/15 py-2.5 text-xs font-black text-green-500"
                  >
                    {t('alreadyPresent')} ({attendanceCount})
                  </button>
                  <button
                    onClick={resetAttendance}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-[10px] font-bold text-text-muted transition-all hover:bg-slate-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
                  >
                    {currentLang === 'id' ? 'Reset Demo Presensi' : 'Reset Attendance Demo'}
                  </button>
                </div>
              ) : (
                <>
                  {/* Mobile active action */}
                  <div className="md:hidden">
                    <button
                      onClick={() => setIsMobileScannerOpen(true)}
                      className="bg-cta-gradient flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-black text-white shadow-md transition-all active:scale-95"
                    >
                      {t('attendNow')}
                    </button>
                  </div>
                  {/* Desktop lock & projector simulation */}
                  <div className="hidden flex-col gap-2 md:flex">
                    <span className="inline-flex w-full cursor-not-allowed items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-text-muted dark:border-neutral-800 dark:bg-neutral-900/50">
                      <CheckIcon size={14} className="opacity-40" />
                      <span>{currentLang === 'id' ? 'Lakukan Presensi via Mobile' : 'Mark Attendance via Mobile'}</span>
                    </span>
                    <button
                      onClick={() => setIsProjectorModalOpen(true)}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-primary/20 bg-primary/5 py-2 text-xs font-black text-primary transition-all hover:bg-primary/10 active:scale-[0.98] dark:border-secondary/20 dark:bg-secondary/5 dark:text-secondary dark:hover:bg-secondary/10"
                    >
                      <span>{currentLang === 'id' ? 'Simulasi Mode Proyektor' : 'Simulate Projector Mode'}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Grid: My Courses & Assessment */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* Courses Shortcut */}
          <Link
            href="/dashboard/lms"
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-primary/50 dark:border-[#2e2e2e] dark:bg-[#1e1e1e]"
          >
            <div>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                <BookOpenIcon size={18} weight="bold" />
              </div>
              <h5 className="mt-3 text-[10px] font-black tracking-wider text-text-dark uppercase">
                {currentLang === 'id' ? 'MODUL SAYA' : 'MY COURSES'}
              </h5>
            </div>
            <p className="mt-1 text-[9px] leading-tight text-text-muted">
              {currentLang === 'id' ? 'Ketuk untuk membuka materi LMS.' : 'Tap to open modular LMS modules.'}
            </p>
          </Link>

          {/* Assessment Shortcut */}
          <Link
            href="/dashboard/assignments"
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-primary/50 dark:border-[#2e2e2e] dark:bg-[#1e1e1e]"
          >
            <div>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                <FileTextIcon size={18} weight="bold" />
              </div>
              <h5 className="mt-3 text-[10px] font-black tracking-wider text-text-dark uppercase">
                {currentLang === 'id' ? 'PENILAIAN' : 'ASSESSMENT'}
              </h5>
              <div className="mt-1 text-[11px] font-bold text-indigo-500">
                {pendingAssignmentsCount} {currentLang === 'id' ? 'belum dikumpul' : 'upcoming'}
              </div>
            </div>
            <p className="mt-1 truncate text-[8px] text-text-muted">
              {nextAssignment ? nextAssignment.title : currentLang === 'id' ? 'Semua tugas selesai' : 'All tasks completed'}
            </p>
          </Link>
        </div>

        {/* Outlook-like Mock Academic Mail/Alerts Card */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#2e2e2e] dark:bg-[#1e1e1e]">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-neutral-800">
            <span className="text-[10px] font-extrabold tracking-wider text-text-dark uppercase">
              {currentLang === 'id' ? 'Pemberitahuan Akademik' : 'Academic Mail / Alerts'}
            </span>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[8px] font-black text-text-muted dark:bg-neutral-800">
              3 Alerts
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs dark:divide-neutral-800/60">
            <div className="flex flex-col p-3.5 hover:bg-slate-50/50 dark:hover:bg-neutral-800/30">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[#333] dark:text-white">Admin LMS</span>
                <span className="text-[8px] text-text-muted">Hari ini</span>
              </div>
              <p className="mt-1 truncate text-[10px] font-medium text-text-muted">
                {currentLang === 'id'
                  ? 'Buku panduan kurikulum modular One Academy berhasil dirilis.'
                  : 'Modular curriculum guides for One Academy have been published.'}
              </p>
            </div>

            <div className="flex flex-col p-3.5 hover:bg-slate-50/50 dark:hover:bg-neutral-800/30">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[#333] dark:text-white">Sistem Absensi</span>
                <span className="text-[8px] text-text-muted">Kemarin</span>
              </div>
              <p className="mt-1 truncate text-[10px] font-medium text-text-muted">
                {currentLang === 'id'
                  ? 'Kehadiran Anda di kelas BA05 telah tercatat secara otomatis via Wifi.'
                  : 'Your class attendance for BA05 has been registered automatically via Wifi.'}
              </p>
            </div>

            <div className="flex flex-col p-3.5 hover:bg-slate-50/50 dark:hover:bg-neutral-800/30">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[#333] dark:text-white">Pengajar Tutor AI</span>
                <span className="text-[8px] text-text-muted">16 Jun</span>
              </div>
              <p className="mt-1 truncate text-[10px] font-medium text-text-muted">
                {currentLang === 'id'
                  ? 'Jangan ragu berdiskusi dengan AI Tutor 24/7 kami tentang Bab Aljabar.'
                  : 'Feel free to consult with our 24/7 AI tutor regarding the Algebra chapter.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── DESKTOP VIEW (lg:grid) ─── */}
      <div className="hidden lg:grid lg:grid-cols-3 lg:gap-5">
        {/* Left column (Progress & Info) */}
        <div className="flex flex-col gap-5 lg:col-span-2">
          <ProgressCard
            activeModules={activeModules}
            selectedSemester={selectedSemester}
            setSelectedSemester={setSelectedSemester}
            selectedSession={selectedSession}
            setSelectedSession={setSelectedSession}
            isSemDropdownOpen={isSemDropdownOpen}
            setIsSemDropdownOpen={setIsSemDropdownOpen}
            isSesDropdownOpen={isSesDropdownOpen}
            setIsSesDropdownOpen={setIsSesDropdownOpen}
            semRef={semRef}
            sesRef={sesRef}
            mockProgressMap={MOCK_PROGRESS}
          />
          <InfoCard />
        </div>

        {/* Right column (Tasks, Forum, and Class Card) */}
        <div className="flex flex-col gap-5">
          <UpcomingClassCard
            userData={userData}
            activeModules={activeModules}
            hasAttendedToday={hasAttendedToday}
            attendanceCount={attendanceCount}
            onAttend={() => setIsMobileScannerOpen(true)}
            onResetAttendance={resetAttendance}
            onOpenProjector={() => setIsProjectorModalOpen(true)}
          />
          <TodoListCard todos={currentTodos} activeTab={todoTab} setActiveTab={setTodoTab} />
          <ForumCard />
        </div>
      </div>

      {/* ─── SIMULASI MODE PROYEKTOR MODAL ─── */}
      {isProjectorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-[#141414]">
            {/* Header */}
            <div className="bg-[#003057] px-5 py-4 dark:bg-[#0a0a0a]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                    <CalendarCheckIcon size={16} weight="bold" className="text-white" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold tracking-widest text-white/50 uppercase">
                      {currentLang === 'id' ? 'MODE PROYEKTOR KELAS' : 'CLASS PROJECTOR MODE'}
                    </p>
                    <p className="text-xs font-black text-white">
                      {activeModules[0]?.code} — {activeModules[0]?.title?.split(':')[0]}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsProjectorModalOpen(false)}
                  className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
                >
                  <XIcon size={16} weight="bold" />
                </button>
              </div>
            </div>

            {/* QR Code area */}
            <div className="flex flex-col items-center px-6 py-6">
              <p className="mb-5 text-[10px] font-bold tracking-widest text-text-muted uppercase">
                {currentLang === 'id' ? 'Arahkan kamera aplikasi ke QR Code ini' : 'Point your app camera at this QR Code'}
              </p>

              {/* Ring + QR */}
              <div className="relative">
                <svg className="absolute -inset-3 -rotate-90" width="232" height="232" viewBox="0 0 232 232">
                  <circle cx="116" cy="116" r="110" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                  <circle
                    cx="116"
                    cy="116"
                    r="110"
                    fill="none"
                    stroke="#008ae3"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 110}`}
                    strokeDashoffset={`${2 * Math.PI * 110 * (1 - qrCountdown / 10)}`}
                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                  />
                </svg>
                <div className="relative flex h-52 w-52 items-center justify-center rounded-2xl bg-white p-4 shadow-lg ring-1 ring-slate-100 dark:ring-neutral-700">
                  <QRCodeSVG
                    value={`oneacademy://attend?token=${activeQRToken}&class=${activeModules[0]?.code || 'CLASS'}`}
                    size={176}
                    bgColor="#ffffff"
                    fgColor="#003057"
                    level="M"
                  />
                  <div className="absolute flex h-8 w-8 items-center justify-center rounded-md bg-[#003057] text-[9px] font-black text-white shadow">
                    OA
                  </div>
                </div>
                <div className="absolute -right-2 -bottom-2 flex h-10 w-10 flex-col items-center justify-center rounded-full bg-primary text-white shadow-lg">
                  <span className="text-sm leading-none font-black">{qrCountdown}</span>
                  <span className="text-[7px] leading-none font-bold opacity-80">det</span>
                </div>
              </div>

              {/* Token bar */}
              <div className="mt-8 flex w-full items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-neutral-900">
                <div>
                  <p className="text-[9px] font-bold tracking-widest text-text-muted uppercase">Token Aktif</p>
                  <p className="mt-0.5 font-mono text-base font-black tracking-wider text-[#003057] dark:text-white">
                    {activeQRToken}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold tracking-widest text-text-muted uppercase">Rotasi dalam</p>
                  <p className="mt-0.5 font-mono text-base font-black text-primary dark:text-secondary">{qrCountdown}s</p>
                </div>
              </div>

              <p className="mt-4 text-center text-[10px] leading-relaxed text-text-muted">
                {currentLang === 'id'
                  ? 'Token diperbarui setiap 10 detik. Mahasiswa wajib berada di dalam ruangan untuk dapat memindai.'
                  : 'Token rotates every 10 seconds. Students must be inside the classroom to scan.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── MOBILE SCANNER & DEVICE BINDING MOCK MODAL ─── */}
      {isMobileScannerOpen && (
        <div className="fixed inset-0 -bottom-8 z-50 flex flex-col items-center justify-end bg-black/60 backdrop-blur-sm sm:justify-center sm:p-4">
          <div
            className="relative w-full max-w-sm translate-y-[1px] overflow-hidden rounded-t-3xl rounded-b-none bg-white shadow-2xl sm:translate-y-0 sm:rounded-3xl dark:bg-[#141414]"
            style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))' }}
          >
            {/* Camera viewfinder */}
            <div className="relative flex h-56 w-full flex-col items-center justify-center overflow-hidden border-b border-slate-100 bg-slate-50 dark:border-neutral-800/60 dark:bg-neutral-900/40">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,138,227,0.04)_0%,transparent_70%)]" />
              <div className="absolute top-5 left-5 h-7 w-7 rounded-tl-md border-t-[3px] border-l-[3px] border-primary/50 dark:border-primary" />
              <div className="absolute top-5 right-5 h-7 w-7 rounded-tr-md border-t-[3px] border-r-[3px] border-primary/50 dark:border-primary" />
              <div className="absolute bottom-5 left-5 h-7 w-7 rounded-bl-md border-b-[3px] border-l-[3px] border-primary/50 dark:border-primary" />
              <div className="absolute right-5 bottom-5 h-7 w-7 rounded-br-md border-r-[3px] border-b-[3px] border-primary/50 dark:border-primary" />
              <div
                className="absolute inset-x-8 h-[2px] rounded-full bg-primary/70 shadow-[0_0_10px_2px_rgba(0,138,227,0.4)] dark:bg-primary"
                style={{ animation: 'scanLine 2.5s ease-in-out infinite' }}
              />
              <div className="relative z-10 flex flex-col items-center gap-2 select-none">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-primary/5 dark:border-primary/30 dark:bg-primary/10">
                  <DeviceMobileIcon size={20} weight="duotone" className="text-primary" />
                </div>
                <p className="animate-pulse text-[10px] font-bold tracking-widest text-slate-400 uppercase dark:text-neutral-500">
                  {currentLang === 'id' ? 'Mencari QR Code...' : 'Scanning for QR Code...'}
                </p>
              </div>
            </div>

            {/* Bottom sheet */}
            <div className="space-y-4 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[9px] font-bold tracking-widest text-primary uppercase dark:text-secondary">
                    {currentLang === 'id' ? 'Presensi Kelas' : 'Class Attendance'}
                  </p>
                  <h4 className="mt-0.5 text-sm leading-tight font-black text-slate-800 dark:text-white">
                    {activeModules[0]?.title}
                  </h4>
                </div>
                <button
                  onClick={() => setIsMobileScannerOpen(false)}
                  className="dark:hover:bg-neutral-850 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-neutral-500 dark:hover:text-neutral-300"
                >
                  <XIcon size={16} weight="bold" />
                </button>
              </div>

              {/* Status chips */}
              <div className="grid grid-cols-2 gap-2">
                <div
                  className={cn(
                    'flex items-center gap-2 rounded-xl border px-3 py-2.5 transition-colors duration-200',
                    currentClientDeviceID === deviceBindingID
                      ? 'border-emerald-100 bg-emerald-50/50 text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400'
                      : 'border-rose-100 bg-rose-50/50 text-rose-800 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400'
                  )}
                >
                  <ShieldCheckIcon
                    size={16}
                    weight="fill"
                    className={cn(
                      'shrink-0',
                      currentClientDeviceID === deviceBindingID
                        ? 'text-emerald-500 dark:text-emerald-400'
                        : 'text-rose-500 dark:text-rose-400'
                    )}
                  />
                  <div className="min-w-0">
                    <p className="text-[8px] leading-none font-bold text-slate-400 uppercase dark:text-neutral-500">
                      {currentLang === 'id' ? 'Perangkat' : 'Device'}
                    </p>
                    <p className="mt-0.5 truncate text-[10px] leading-tight font-black">
                      {currentClientDeviceID === deviceBindingID ? 'iPhone 15 Pro' : 'Tidak Sah'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/50 px-3 py-2.5 text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <WifiHighIcon size={16} weight="fill" className="shrink-0 text-emerald-500 dark:text-emerald-400" />
                  <div>
                    <p className="text-[8px] leading-none font-bold text-slate-400 uppercase dark:text-neutral-500">
                      {currentLang === 'id' ? 'Lokasi' : 'Location'}
                    </p>
                    <p className="mt-0.5 text-[10px] leading-tight font-black">
                      {currentLang === 'id' ? 'Dalam Kampus' : 'On Campus'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2.5">
                <button
                  onClick={() => {
                    const success = handleAttendanceSecure(activeQRToken)
                    if (success) {
                      setIsMobileScannerOpen(false)
                    }
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-black text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/95 active:scale-[0.98]"
                >
                  <CheckCircleIcon size={18} weight="fill" />
                  <span>{currentLang === 'id' ? 'Pindai QR Proyektor' : 'Scan QR Code'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const newID =
                      currentClientDeviceID === deviceBindingID ? 'device-samsung-s24-hack' : 'device-iphone-15-pro'
                    setCurrentClientDeviceID(newID)
                  }}
                  className={cn(
                    'flex w-full items-center justify-center gap-2 rounded-2xl border py-3 text-xs font-bold transition-all active:scale-[0.98]',
                    currentClientDeviceID !== deviceBindingID
                      ? 'border-emerald-200 bg-emerald-50/80 text-emerald-700 hover:bg-emerald-100/80 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-rose-400 dark:hover:bg-rose-500/10'
                  )}
                >
                  <WarningIcon
                    size={15}
                    weight="fill"
                    className={cn(
                      currentClientDeviceID === deviceBindingID
                        ? 'text-slate-500 dark:text-rose-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    )}
                  />
                  <span>
                    {currentClientDeviceID === deviceBindingID
                      ? currentLang === 'id'
                        ? 'Simulasikan Kecurangan (Ganti HP)'
                        : 'Simulate Fraud (Switch Device)'
                      : currentLang === 'id'
                        ? 'Kembalikan ke HP Asli (iPhone 15)'
                        : 'Restore Original Device (iPhone 15)'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scanLine {
          0%   { top: 20%; }
          50%  { top: 75%; }
          100% { top: 20%; }
        }
      `}</style>
    </div>
  )
}
