'use client'

import { useDashboard } from '@/context/dashboard-context'
import {
  BookOpenIcon,
  CaretDownIcon,
  CalendarCheckIcon,
  ChatCircleDotsIcon,
  FileTextIcon,
  DownloadSimpleIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  PlusIcon,
  UsersIcon,
  ArrowRightIcon,
  CheckIcon,
  ShieldCheckIcon,
  UserIcon,
  QrCodeIcon,
  FloppyDiskIcon,
  PencilSimpleIcon
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'
import { toast } from 'sonner'

import { cn } from '@/utils'

import type { CourseModule } from './types'

type Props = {
  activeModules: CourseModule[]
}

interface Instructor {
  name: string
  code: string
  role: string
}

const INSTRUCTORS: Record<string, Instructor> = {
  ISYS6014005: {
    name: 'DIO RINALDO PUTRAWAN PRATAMA, S.Tr.Kom., M.Kom.',
    code: 'SF25110',
    role: 'Primary Instructor'
  },
  ISYS6016005: {
    name: 'BUDI UTOMO, S.Kom., M.T.',
    code: 'SF22341',
    role: 'Primary Instructor'
  },
  ISYS6013005: {
    name: 'DR. DIANA KUSUMA, M.T.',
    code: 'SF21098',
    role: 'Primary Instructor'
  },
  CHAR6002003: {
    name: 'PROF. DR. IR. H. SUPARMAN, M.B.A.',
    code: 'SF19876',
    role: 'Primary Instructor'
  },
  ISYS6015005: {
    name: 'RINA ADITAMA, M.B.A.',
    code: 'SF24102',
    role: 'Primary Instructor'
  }
}

interface ForumThread {
  id: number
  title: string
  author: string
  date: string
  replies: number
  category: string
}

const INITIAL_THREADS: Record<string, ForumThread[]> = {
  ISYS6014005: [
    {
      id: 1,
      title: 'Tanya mengenai rumus VLOOKUP vs INDEX MATCH di Excel',
      author: 'Rian Hidayat',
      date: '18 Jun 2026, 08:30 GMT+7',
      replies: 2,
      category: 'Tanya Jawab'
    },
    {
      id: 2,
      title: 'Kumpulan shortcut penting Microsoft Excel untuk efisiensi kerja',
      author: 'Siti Rahmawati',
      date: '17 Jun 2026, 14:15 GMT+7',
      replies: 5,
      category: 'Tips & Trik'
    }
  ],
  ISYS6016005: [
    {
      id: 1,
      title: 'Mengapa Flexbox collapse di Safari versi lama ya?',
      author: 'Budi Saputra',
      date: '18 Jun 2026, 09:00 GMT+7',
      replies: 1,
      category: 'Bug & Troubleshooting'
    }
  ]
}

const SLIDES: Record<string, { title: string; subtitle: string; content: string[] }[]> = {
  ISYS6014005: [
    {
      title: 'WHAT-IF ANALYSIS',
      subtitle: 'SESSION 12 - 13',
      content: [
        'Pengantar Analisis Skenario Bisnis',
        'Definisi What-If Analysis di Microsoft Excel',
        'Mengambil keputusan berbasis data variabel ganda'
      ]
    },
    {
      title: 'DATA TABLE',
      subtitle: 'TABEL DATA',
      content: [
        'Menganalisis hasil dengan mengubah satu atau dua variabel input',
        'Membuat tabel simulasi sensitivitas harga vs permintaan',
        'Formula Array {=TABLE()} pada Excel'
      ]
    },
    {
      title: 'GOAL SEEK',
      subtitle: 'PENCARIAN SASARAN',
      content: [
        'Menentukan nilai input yang diperlukan untuk mencapai target output',
        'Contoh: Menghitung persentase bunga minimal untuk profit target',
        'Maksimal iterasi pencarian data numerik'
      ]
    },
    {
      title: 'SCENARIO MANAGER',
      subtitle: 'PENGELOLA SKENARIO',
      content: [
        'Menyimpan dan beralih di antara berbagai kelompok nilai input',
        'Membuat ringkasan skenario (Scenario Summary Report)',
        'Skenario Optimis, Realistis, dan Pesimis dalam perencanaan anggaran'
      ]
    }
  ],
  ISYS6016005: [
    {
      title: 'MODERN CSS LAYOUTS',
      subtitle: 'SESSION 12 - 13',
      content: [
        'Mengapa Layout Mengalami Evolusi?',
        'Dari Float, Table, hingga Flexbox & Grid',
        'Prinsip Responsive Web Design (RWD)'
      ]
    },
    {
      title: 'CSS FLEXBOX',
      subtitle: 'FLEXIBLE BOX LAYOUT',
      content: [
        'Konsep Main Axis dan Cross Axis',
        'Properti Flex Container: flex-direction, justify-content, align-items',
        'Properti Flex Items: flex-grow, flex-shrink, flex-basis'
      ]
    },
    {
      title: 'CSS GRID LAYOUT',
      subtitle: 'GRID 2-DIMENSI',
      content: [
        'Grid Tracks, Grid Areas, dan Grid Lines',
        'Grid Template Columns & Rows: grid-template-columns: repeat(3, 1fr)',
        'Gap & Grid Alignment untuk layout kompleks 2-Dimensi'
      ]
    }
  ]
}

export function LmsTab({ activeModules }: Props) {
  // Integrate the secure QR attendance states and methods from global dashboard context
  const { hasAttendedToday, attendanceCount, handleAttendanceSecure, activeQRToken, qrCountdown, resetAttendance } =
    useDashboard()

  const [currentView, setCurrentView] = useState<'list' | 'detail' | 'document'>('list')
  const [selectedCourse, setSelectedCourse] = useState<CourseModule | null>(null)
  const [activeTab, setActiveTab] = useState<
    'session' | 'syllabus' | 'forum' | 'assessment' | 'assessment-rubric' | 'people' | 'attendance'
  >('session')

  const [runningPeriod, setRunningPeriod] = useState('2025-even')
  const [activeGroupTab, setActiveGroupTab] = useState<'LAB' | 'LEC'>('LAB')

  const [activeSession, setActiveSession] = useState<number>(12)
  const [activeForumSession, setActiveForumSession] = useState<number>(4)
  const [forumSubTab, setForumSubTab] = useState<'class' | 'group'>('class')

  // Forum state
  const [forumThreads, setForumThreads] = useState<Record<string, ForumThread[]>>(INITIAL_THREADS)
  const [isCreatingThread, setIsCreatingThread] = useState(false)
  const [newThreadTitle, setNewThreadTitle] = useState('')
  const [newThreadCategory, setNewThreadCategory] = useState('Tanya Jawab')

  // Slide state
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  // People sub-tab states (Class vs Group)
  const [peopleSubTab, setPeopleSubTab] = useState<'class' | 'group'>('class')
  const [isEditingGroup, setIsEditingGroup] = useState(false)
  const [groupName, setGroupName] = useState('Kelompok 3 - Automasi Bisnis')
  const [groupProject, setGroupProject] = useState('Sistem Manajemen Inventaris Toko Retail')
  const [selectedGroupMembers, setSelectedGroupMembers] = useState<string[]>([
    'Siti Rahmawati',
    'Rian Hidayat',
    'Siswa Teladan'
  ])
  const [tempGroupName, setTempGroupName] = useState('')
  const [tempGroupProject, setTempGroupProject] = useState('')
  const [tempGroupMembers, setTempGroupMembers] = useState<string[]>([])

  const handlePdfDownload = (courseTitle: string, session: string) => {
    toast.success(`Mengunduh file PDF materi: ${courseTitle} - ${session}`)
  }

  const handleOpenCourse = (course: CourseModule) => {
    setSelectedCourse(course)
    setCurrentView('detail')
    setActiveTab('session')
    setActiveSession(12)
    // Preset mock group info depending on which course is selected
    if (course.code === 'ISYS6016005') {
      setGroupName('Kelompok 2 - Flexbox Masters')
      setGroupProject('Redesign Portal Akademik Satu University')
    } else {
      setGroupName('Kelompok 3 - Automasi Bisnis')
      setGroupProject('Sistem Manajemen Inventaris Toko Retail')
    }
  }

  const handleOpenDocument = () => {
    setCurrentSlideIndex(0)
    setCurrentView('document')
  }

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newThreadTitle.trim() || !selectedCourse) return

    const newThread: ForumThread = {
      id: Date.now(),
      title: newThreadTitle,
      author: 'Siswa Teladan',
      date: 'Baru saja',
      replies: 0,
      category: newThreadCategory
    }

    setForumThreads((prev) => ({
      ...prev,
      [selectedCourse.code]: [newThread, ...(prev[selectedCourse.code] || [])]
    }))

    setNewThreadTitle('')
    setIsCreatingThread(false)
    toast.success('Thread baru berhasil dibuat di Forum Kelas!')
  }

  // Handle editing group info
  const handleStartEditGroup = () => {
    setTempGroupName(groupName)
    setTempGroupProject(groupProject)
    setTempGroupMembers([...selectedGroupMembers])
    setIsEditingGroup(true)
  }

  const handleSaveGroup = (e: React.FormEvent) => {
    e.preventDefault()
    if (!tempGroupName.trim() || !tempGroupProject.trim()) {
      toast.error('Nama kelompok dan projek tidak boleh kosong!')

      return
    }
    setGroupName(tempGroupName)
    setGroupProject(tempGroupProject)
    setSelectedGroupMembers(tempGroupMembers)
    setIsEditingGroup(false)
    toast.success('Informasi kelompok belajar berhasil disimpan!')
  }

  const toggleMemberSelection = (memberName: string) => {
    if (tempGroupMembers.includes(memberName)) {
      if (memberName === 'Siswa Teladan') {
        toast.error('Anda tidak bisa mengeluarkan diri Anda sendiri dari kelompok!')

        return
      }
      setTempGroupMembers((prev) => prev.filter((m) => m !== memberName))
    } else {
      setTempGroupMembers((prev) => [...prev, memberName])
    }
  }

  const isUniv = activeModules.some((m) => m.code.startsWith('ISYS') || m.code.startsWith('CHAR'))
  const filteredCourses = isUniv
    ? activeModules.filter((course) => {
        const isLabCode = ['ISYS6014005', 'ISYS6016005'].includes(course.code)

        return activeGroupTab === 'LAB' ? isLabCode : !isLabCode
      })
    : activeModules

  const courseProgresses: Record<string, number> = {
    ISYS6014005: 37,
    ISYS6016005: 22,
    CHAR6002003: 75,
    ISYS6013005: 50,
    ISYS6015005: 15
  }

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {/* ─── 1. MY COURSES LIST VIEW ─── */}
        {currentView === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Header row */}
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800/60">
              <div>
                <h3 className="text-xl font-black tracking-tight text-[#333] sm:text-2xl dark:text-white">My Courses</h3>
                <p className="mt-1 text-xs text-text-muted">Kelola dan pelajari modul perkuliahan Anda</p>
              </div>

              {/* Running Period Selection */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Running Period</span>
                <div className="relative">
                  <select
                    value={runningPeriod}
                    onChange={(e) => setRunningPeriod(e.target.value)}
                    className="appearance-none rounded border border-slate-200 bg-white py-2 pr-8 pl-3.5 text-xs font-bold text-text-dark shadow-sm transition-all outline-none focus:border-[#ff9d00] dark:border-neutral-800 dark:bg-[#1a1a1a] dark:text-white"
                  >
                    <option value="2025-even">2025, Even Semester</option>
                    <option value="2025-odd">2025, Odd Semester</option>
                  </select>
                  <div className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-slate-500">
                    <CaretDownIcon size={14} weight="bold" />
                  </div>
                </div>
              </div>
            </div>

            {/* LAB vs LEC Tabs (only for University Tier) */}
            {isUniv && (
              <div className="border-slate-150 flex border-b dark:border-neutral-800/60">
                <button
                  onClick={() => setActiveGroupTab('LAB')}
                  className={cn(
                    'border-b-2 px-5 py-2.5 text-xs font-black tracking-wider uppercase transition-all focus:outline-none',
                    activeGroupTab === 'LAB'
                      ? 'border-[#ff9d00] text-[#ff9d00]'
                      : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-white'
                  )}
                >
                  LAB
                </button>
                <button
                  onClick={() => setActiveGroupTab('LEC')}
                  className={cn(
                    'border-b-2 px-5 py-2.5 text-xs font-black tracking-wider uppercase transition-all focus:outline-none',
                    activeGroupTab === 'LEC'
                      ? 'border-[#ff9d00] text-[#ff9d00]'
                      : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-white'
                  )}
                >
                  LEC
                </button>
              </div>
            )}

            {/* Courses Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => {
                const progress = courseProgresses[course.code] || 0

                return (
                  <div
                    key={course.id}
                    onClick={() => handleOpenCourse(course)}
                    className="group dark:border-neutral-850 relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#ff9d00]/40 hover:shadow-md dark:bg-[#1e1e1e] dark:hover:border-[#ff9d00]/45"
                  >
                    <div className="space-y-4">
                      {/* Code, Class Name */}
                      <div className="space-y-2">
                        <h4 className="text-sm leading-snug font-bold text-slate-800 transition-colors group-hover:text-[#ff9d00] dark:text-white dark:group-hover:text-[#ff9d00]">
                          {course.title}
                        </h4>

                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 dark:text-neutral-400">
                            <FileTextIcon size={14} className="text-slate-400" />
                            <span>{course.code}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 dark:text-neutral-400">
                            <UsersIcon size={14} className="text-slate-400" />
                            <span>BA05</span>
                          </div>
                        </div>
                      </div>

                      {/* Small Chevron Down Centered */}
                      <div className="flex justify-center pt-1 text-slate-300 dark:text-neutral-700">
                        <CaretDownIcon size={14} className="transition-transform group-hover:translate-y-0.5" />
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4 border-t border-slate-100 pt-4 dark:border-neutral-800">
                      <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-500 dark:text-neutral-400">
                        <span>Class progress:</span>
                        <span className="text-slate-800 dark:text-white">{progress}%</span>
                      </div>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-neutral-800">
                        <div className="h-full rounded-full bg-[#ff9d00] transition-all" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* ─── 2. COURSE DETAIL VIEW ─── */}
        {currentView === 'detail' && selectedCourse && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Header: Back & Metadata */}
            <div className="border-slate-150 flex flex-col gap-4 border-b pb-5 dark:border-neutral-800">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => setCurrentView('list')}
                  className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                >
                  <ArrowLeftIcon size={16} weight="bold" />
                </button>
                <div>
                  <h3 className="text-lg leading-tight font-bold text-slate-800 sm:text-xl dark:text-white">
                    {selectedCourse.title}
                  </h3>

                  {/* Metadata labels row with icons */}
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] font-bold text-slate-500 dark:text-neutral-400">
                    <div className="flex items-center gap-1.5">
                      <FileTextIcon size={14} className="text-slate-400" />
                      <span>{selectedCourse.code}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheckIcon size={14} className="text-slate-400" />
                      <span>Credit {selectedCourse.credits}/2</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <UsersIcon size={14} className="text-slate-400" />
                      <span>BA05 - {isUniv && activeGroupTab === 'LAB' ? 'LAB' : 'LEC'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructor profile block */}
              {INSTRUCTORS[selectedCourse.code] && (
                <div className="dark:border-neutral-850 flex items-center gap-3.5 rounded-xl border border-slate-100 bg-[#fafafa] p-4 dark:bg-[#1a1a1a]">
                  <div className="dark:text-neutral-450 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-500 dark:bg-neutral-800">
                    <UserIcon size={18} weight="fill" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-white">
                      {INSTRUCTORS[selectedCourse.code].name}
                    </p>
                    <p className="mt-0.5 text-[9px] font-bold tracking-wide text-slate-400 uppercase">
                      {INSTRUCTORS[selectedCourse.code].code} - {INSTRUCTORS[selectedCourse.code].role}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Course Detail Navigation Tabs */}
            <div className="border-slate-150 dark:border-neutral-850 flex flex-wrap border-b">
              {(
                [
                  { key: 'session', label: 'Session' },
                  { key: 'syllabus', label: 'Syllabus' },
                  { key: 'forum', label: 'Forum' },
                  { key: 'assessment', label: 'Assessment' },
                  { key: 'assessment-rubric', label: 'Assessment Rubric' },
                  { key: 'people', label: 'People' },
                  { key: 'attendance', label: 'Attendance' }
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    'border-b-2 px-4 py-2.5 text-xs font-bold transition-all focus:outline-none',
                    activeTab === tab.key
                      ? 'border-[#ff9d00] text-[#ff9d00]'
                      : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-white'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENTS */}
            <div className="py-2">
              {/* ─── 2.1 SESSION TAB ─── */}
              {activeTab === 'session' && (
                <div className="space-y-6">
                  {/* Session horizontal tabs selector */}
                  <div className="scrollbar-thin scrollbar-thumb-slate-200 -mx-4 flex overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6">
                    <div className="flex items-center gap-2 pt-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
                        const isCompleted = [1, 2, 3, 5].includes(num)
                        const isActive = activeSession === num

                        return (
                          <button
                            key={num}
                            onClick={() => setActiveSession(num)}
                            className={cn(
                              'relative flex h-10 min-w-[95px] flex-col items-center justify-center rounded border px-4 py-2 text-xs font-bold transition-all outline-none',
                              isActive
                                ? 'border-[#ff9d00] bg-[#ff9d00] text-white'
                                : 'border-slate-150 bg-white text-slate-500 hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400'
                            )}
                          >
                            {/* Dot indicator aligned above button text */}
                            <span
                              className={cn(
                                'absolute top-1 h-1.5 w-1.5 rounded-full',
                                isCompleted ? 'bg-green-500' : 'bg-[#ff9d00]'
                              )}
                            />
                            <span className="mt-1.5">Session {num}</span>
                          </button>
                        )
                      })}

                      {/* Interactive Session Dropdown - Fix: Click is now active */}
                      <div className="relative">
                        <select
                          value={activeSession > 12 ? activeSession : ''}
                          onChange={(e) => {
                            const val = e.target.value
                            if (val) setActiveSession(Number(val))
                          }}
                          className="border-slate-155 h-10 cursor-pointer appearance-none rounded border border-[#ff9d00] bg-white py-2.5 pr-8 pl-3.5 text-xs font-bold text-[#ff9d00] shadow-sm transition-all outline-none hover:bg-amber-500/5 dark:border-neutral-800 dark:bg-[#1a1a1a]"
                        >
                          <option value="" className="text-slate-500">
                            More...
                          </option>
                          <option value="13" className="text-slate-700 dark:text-white">
                            Session 13
                          </option>
                          <option value="14" className="text-slate-700 dark:text-white">
                            Session 14
                          </option>
                        </select>
                        <div className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-[#ff9d00]">
                          <CaretDownIcon size={12} weight="bold" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Session Content */}
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left details */}
                    <div className="space-y-5 lg:col-span-2">
                      <div className="dark:border-neutral-850 rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:bg-[#1e1e1e]">
                        <h4 className="text-base font-bold text-slate-800 dark:text-white">
                          {activeSession === 12
                            ? '12 13 What-if Analysis [L]'
                            : activeSession === 13
                              ? '13 Pengenalan Excel Lanjutan [L]'
                              : activeSession === 14
                                ? '14 Review Materi & Ujian Akhir [L]'
                                : `0${activeSession} Topik Pembelajaran Sesi`}
                        </h4>

                        {/* Learning outcome */}
                        <div className="mt-5 space-y-2">
                          <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Learning Outcome</p>
                          <div className="text-slate-650 flex items-start gap-2 text-xs dark:text-neutral-300">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                            <p>
                              {activeSession === 12
                                ? 'CPMK 4: Menganalisis kumpulan data besar dan menggunakan alat pengambilan keputusan'
                                : activeSession === 13
                                  ? 'CPMK 4: Menganalisis skenario bisnis menggunakan fungsi finansial lanjutan'
                                  : activeSession === 14
                                    ? 'CPMK 5: Menyelesaikan studi kasus integrasi data perkantoran secara mandiri'
                                    : 'CPMK 2: Menyusun alur kerja terotomatisasi secara kolaboratif dalam tim'}
                            </p>
                          </div>
                        </div>

                        {/* Subtopics */}
                        <div className="mt-5 space-y-2">
                          <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Sub Topic</p>
                          <div className="text-slate-650 space-y-2 text-xs dark:text-neutral-300">
                            {activeSession === 12 ? (
                              <>
                                <div className="flex items-center gap-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                  <span>Data Table</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                  <span>Goal Seek</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                  <span>Scenario Manager</span>
                                </div>
                              </>
                            ) : activeSession === 13 ? (
                              <>
                                <div className="flex items-center gap-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                  <span>VLOOKUP & HLOOKUP</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                  <span>Pivot Table & Charts</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                  <span>Pengantar Macro & VBA Excel</span>
                                </div>
                              </>
                            ) : activeSession === 14 ? (
                              <>
                                <div className="flex items-center gap-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                  <span>Review Kisi-Kisi Penilaian Akhir</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                  <span>Tanya Jawab Projek Praktikum</span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex items-center gap-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                  <span>Tinjauan Topik Pembelajaran Sesi</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                  <span>Studi Kasus & Pembahasan Latihan</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Learning outcome repeated exactly like screenshot */}
                        <div className="mt-5 space-y-2">
                          <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Learning Outcome</p>
                          <div className="text-slate-650 flex items-start gap-2 text-xs dark:text-neutral-300">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                            <p>
                              {activeSession === 12
                                ? 'CPMK 4: Menganalisis kumpulan data besar dan menggunakan alat pengambilan keputusan'
                                : activeSession === 13
                                  ? 'CPMK 4: Menganalisis skenario bisnis menggunakan fungsi finansial lanjutan'
                                  : activeSession === 14
                                    ? 'CPMK 5: Menyelesaikan studi kasus integrasi data perkantoran secara mandiri'
                                    : 'CPMK 2: Menyusun alur kerja terotomatisasi secara kolaboratif dalam tim'}
                            </p>
                          </div>
                        </div>

                        {/* Metadata breakdown stacked exactly like screenshot */}
                        <div className="mt-6 space-y-4 border-t border-slate-100 pt-5 text-xs dark:border-neutral-800">
                          <div>
                            <div className="mb-0.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-neutral-500">
                              Start
                            </div>
                            <div className="font-medium text-slate-700 dark:text-neutral-300">
                              {activeSession === 12
                                ? '11 Jun 2026, 15:20 GMT+7'
                                : activeSession === 13
                                  ? '18 Jun 2026, 15:20 GMT+7'
                                  : '25 Jun 2026, 15:20 GMT+7'}
                            </div>
                          </div>
                          <div>
                            <div className="mb-0.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-neutral-500">
                              End
                            </div>
                            <div className="font-medium text-slate-700 dark:text-neutral-300">
                              {activeSession === 12
                                ? '11 Jun 2026, 17:00 GMT+7'
                                : activeSession === 13
                                  ? '18 Jun 2026, 17:00 GMT+7'
                                  : '25 Jun 2026, 17:00 GMT+7'}
                            </div>
                          </div>
                          <div>
                            <div className="mb-0.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:text-neutral-500">
                              Delivery Mode
                            </div>
                            <div className="font-bold text-[#ff9d00] dark:text-[#ff9d00]">Onsite - F2F</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Things To Do Column - styled with orange background container */}
                    <div className="space-y-4">
                      <div className="rounded-xl bg-[#d48000] p-5 text-white shadow-sm dark:bg-[#bf7400]">
                        <h4 className="text-[10px] font-bold tracking-wider text-white/80 uppercase">
                          Things to do in this session
                        </h4>

                        {/* Tasks Box */}
                        <div className="mt-4 space-y-3">
                          {/* Item 1: Wifi Attendance */}
                          <div className="flex items-center gap-3.5 rounded-xl border border-white/10 bg-white/10 p-3 text-white">
                            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded bg-white text-slate-700">
                              {/* Overlay check badge if user completed attendance in context */}
                              <div
                                className={cn(
                                  'absolute -top-1.5 -left-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full border border-white text-white',
                                  hasAttendedToday ? 'bg-green-500' : 'bg-red-500'
                                )}
                              >
                                {hasAttendedToday ? (
                                  <CheckIcon size={9} weight="bold" />
                                ) : (
                                  <span className="text-[9px] font-black">!</span>
                                )}
                              </div>
                              <CalendarCheckIcon size={18} weight="fill" className="text-[#d48000]" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs leading-tight font-bold">Wifi Attendance</p>
                              <p className="mt-0.5 text-[10px] text-white/70">
                                {hasAttendedToday ? 'Hadir • Tepat Waktu' : 'Belum Melakukan Absensi'}
                              </p>
                            </div>
                          </div>

                          {/* Item 2: Tugas Presentasi */}
                          <div className="flex items-center gap-3.5 rounded-xl border border-white/10 bg-white/10 p-3 text-white">
                            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded bg-white text-slate-700">
                              {/* Green check badge overlay on top left */}
                              <div className="absolute -top-1.5 -left-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full border border-white bg-green-500 text-white">
                                <CheckIcon size={9} weight="bold" />
                              </div>
                              <FileTextIcon size={18} weight="fill" className="text-[#d48000]" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs leading-tight font-bold">
                                {selectedCourse.code === 'ISYS6016005'
                                  ? 'Tugas Coding Front-End'
                                  : 'Tugas presentasi dan demo Microsoft Excel'}
                              </p>
                              <p className="mt-0.5 text-[10px] font-medium text-white/70">Completed On Time</p>
                            </div>
                          </div>

                          {/* Item 3: Slides Material Link */}
                          <div
                            onClick={handleOpenDocument}
                            className="flex cursor-pointer items-center gap-3.5 rounded-xl border border-white/15 bg-white/10 p-3 text-white transition-all hover:bg-white/15"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-white text-[#d48000]">
                              <BookOpenIcon size={18} weight="bold" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs leading-tight font-bold">
                                {activeSession === 12 ? '12 13 What-if Analysis [L]' : 'Slide Pelajaran Sesi'}
                              </p>
                              <p className="mt-0.5 text-[10px] text-white/70">10m</p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handlePdfDownload(selectedCourse.title, `Sesi ${activeSession}`)
                              }}
                              className="shrink-0 p-1 text-white hover:text-yellow-200"
                            >
                              <DownloadSimpleIcon size={18} weight="bold" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── 2.2 SYLLABUS TAB ─── */}
              {activeTab === 'syllabus' && (
                <div className="dark:border-neutral-850 space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:bg-[#1e1e1e]">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-neutral-800">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white">Silabus Rencana Pembelajaran</h4>
                    <button
                      onClick={() => handlePdfDownload(selectedCourse.title, 'Silabus Kurikulum')}
                      className="flex items-center gap-1.5 rounded-full bg-[#ff9d00]/10 px-4 py-1.5 text-xs font-bold text-[#ff9d00] transition-all hover:bg-[#ff9d00]/15"
                    >
                      <DownloadSimpleIcon size={14} weight="bold" />
                      <span>Download Silabus (PDF)</span>
                    </button>
                  </div>
                  <div className="text-slate-650 dark:text-neutral-350 space-y-4 text-xs">
                    <p className="leading-relaxed">
                      Silabus ini memuat deskripsi lengkap mengenai tujuan pembelajaran kelas, kredit akademik, bobot
                      penilaian kuis dan tugas, serta alur rencana mingguan yang disetujui secara institusional oleh instansi
                      One Academy.
                    </p>
                    <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
                      <div className="rounded-lg bg-slate-50 p-4 dark:bg-neutral-900/50">
                        <p className="text-xs font-bold text-slate-800 dark:text-white">Sasaran Kurikulum</p>
                        <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">
                          Mahasiswa diharapkan dapat menguasai aspek kognitif, motorik, dan afektif di bidang terkait secara
                          modular.
                        </p>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-4 dark:bg-neutral-900/50">
                        <p className="text-xs font-bold text-slate-800 dark:text-white">Bobot Kelulusan</p>
                        <ul className="mt-1.5 list-inside list-disc space-y-1 text-[11px] text-slate-500">
                          <li>Kehadiran: 10%</li>
                          <li>Tugas Mandiri: 30%</li>
                          <li>Ujian Tengah Semester: 30%</li>
                          <li>Ujian Akhir Semester: 30%</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── 2.3 FORUM TAB ─── */}
              {activeTab === 'forum' && (
                <div className="space-y-5">
                  {/* Session Horizontal bar */}
                  <div className="scrollbar-thin -mx-4 flex overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6">
                    <div className="flex items-center gap-2 pt-2">
                      {[4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((num) => (
                        <button
                          key={num}
                          onClick={() => setActiveForumSession(num)}
                          className={cn(
                            'relative flex h-10 min-w-[95px] flex-col items-center justify-center rounded border px-4 py-2 text-xs font-bold transition-all outline-none',
                            activeForumSession === num
                              ? 'border-[#ff9d00] bg-[#ff9d00] text-white'
                              : 'border-slate-150 bg-white text-slate-500 hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400'
                          )}
                        >
                          <span className="absolute top-1 h-1.5 w-1.5 rounded-full bg-[#ff9d00]" />
                          <span className="mt-1.5">Session {num}</span>
                        </button>
                      ))}

                      {/* Interactive Forum Session Dropdown - Fix: Click is now active */}
                      <div className="relative">
                        <select
                          value={activeForumSession > 13 ? activeForumSession : ''}
                          onChange={(e) => {
                            const val = e.target.value
                            if (val) setActiveForumSession(Number(val))
                          }}
                          className="border-slate-155 dark:border-neutral-850 h-10 cursor-pointer appearance-none rounded border border-[#ff9d00] bg-white py-2.5 pr-8 pl-3.5 text-xs font-bold text-[#ff9d00] shadow-sm transition-all outline-none hover:bg-amber-500/5 dark:bg-[#1a1a1a]"
                        >
                          <option value="" className="text-slate-500">
                            More...
                          </option>
                          <option value="1" className="text-slate-700 dark:text-white">
                            Session 1
                          </option>
                          <option value="2" className="text-slate-700 dark:text-white">
                            Session 2
                          </option>
                          <option value="3" className="text-slate-700 dark:text-white">
                            Session 3
                          </option>
                          <option value="14" className="text-slate-700 dark:text-white">
                            Session 14
                          </option>
                        </select>
                        <div className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-[#ff9d00]">
                          <CaretDownIcon size={12} weight="bold" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Forum Header Info */}
                  <div className="dark:border-neutral-850 rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:bg-[#1e1e1e]">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h4 className="text-base font-bold text-slate-800 dark:text-white">
                          0{activeForumSession}{' '}
                          {activeForumSession === 4 ? 'Excel Introduction [L]' : 'Topik Diskusi Kelas Sesi'}
                        </h4>
                        <div className="text-slate-450 mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-bold">
                          <span>Mulai: 05 Mar 2026, 00:00 GMT+7</span>
                          <span>Batas: 05 Mar 2026, 23:59 GMT+7</span>
                          <span>Total Post: {(forumThreads[selectedCourse.code] || []).length}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setIsCreatingThread(!isCreatingThread)}
                        className="flex shrink-0 items-center gap-1.5 self-start rounded bg-[#ff9d00] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#ff9d00]/90 active:scale-95 sm:self-auto"
                      >
                        <PlusIcon size={14} weight="bold" />
                        <span>CREATE NEW THREAD</span>
                      </button>
                    </div>

                    {/* Sub tabs: Class vs Group */}
                    <div className="mt-5 flex border-b border-slate-100 dark:border-neutral-800">
                      <button
                        onClick={() => setForumSubTab('class')}
                        className={cn(
                          'border-b-2 px-4 py-2 text-xs font-bold transition-all',
                          forumSubTab === 'class'
                            ? 'border-[#ff9d00] text-[#ff9d00]'
                            : 'border-transparent text-slate-400 hover:text-slate-600'
                        )}
                      >
                        Class
                      </button>
                      <button
                        onClick={() => setForumSubTab('group')}
                        className={cn(
                          'border-b-2 px-4 py-2 text-xs font-bold transition-all',
                          forumSubTab === 'group'
                            ? 'border-[#ff9d00] text-[#ff9d00]'
                            : 'border-transparent text-slate-400 hover:text-slate-600'
                        )}
                      >
                        Group
                      </button>
                    </div>

                    {/* Thread Creator Form */}
                    {isCreatingThread && (
                      <form
                        onSubmit={handleCreateThread}
                        className="mt-5 space-y-4 rounded-xl border border-dashed border-[#ff9d00]/30 bg-amber-50/5 p-4"
                      >
                        <h5 className="text-slate-850 text-xs font-bold uppercase dark:text-white">
                          Buat Thread Diskusi Baru
                        </h5>
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Judul Thread / Pertanyaan Anda..."
                            value={newThreadTitle}
                            onChange={(e) => setNewThreadTitle(e.target.value)}
                            className="w-full rounded border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-[#ff9d00] dark:border-neutral-800 dark:bg-neutral-900"
                            required
                          />
                          <select
                            value={newThreadCategory}
                            onChange={(e) => setNewThreadCategory(e.target.value)}
                            className="rounded border border-slate-200 bg-white p-2 text-xs outline-none dark:border-neutral-800 dark:bg-neutral-900"
                          >
                            <option value="Tanya Jawab">Tanya Jawab</option>
                            <option value="Tips & Trik">Tips & Trik</option>
                            <option value="Bug & Troubleshooting">Bug & Troubleshooting</option>
                          </select>
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setIsCreatingThread(false)}
                            className="rounded bg-slate-100 px-4 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 dark:bg-neutral-800 dark:text-neutral-300"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="rounded bg-[#ff9d00] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#ff9d00]/95"
                          >
                            Kirim Thread
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Threads list */}
                    <div className="mt-5">
                      {(forumThreads[selectedCourse.code] || []).length > 0 ? (
                        <div className="divide-y divide-slate-100 dark:divide-neutral-800/60">
                          {(forumThreads[selectedCourse.code] || []).map((thread) => (
                            <div
                              key={thread.id}
                              className="flex items-center justify-between gap-4 py-3.5 hover:bg-slate-50/20"
                            >
                              <div className="min-w-0 flex-1">
                                <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[8px] font-bold text-[#ff9d00] dark:bg-amber-500/20">
                                  {thread.category}
                                </span>
                                <h5 className="mt-1 truncate text-xs font-bold text-slate-800 dark:text-white">
                                  {thread.title}
                                </h5>
                                <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                                  Oleh {thread.author} • {thread.date}
                                </p>
                              </div>
                              <div className="dark:bg-neutral-850 flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1">
                                <ChatCircleDotsIcon size={14} className="text-slate-400" />
                                <span className="text-[10px] font-extrabold text-slate-600 dark:text-neutral-300">
                                  {thread.replies} Balasan
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        /* Empty state illustration */
                        <div className="flex flex-col items-center py-12 text-center">
                          <div className="dark:bg-neutral-850 relative mb-5 flex h-28 w-28 items-center justify-center rounded-full bg-amber-50">
                            <span className="animate-bounce text-4xl">❓</span>
                          </div>
                          <h5 className="text-sm font-bold text-slate-800 dark:text-white">Belum Ada Diskusi di Sesi Ini</h5>
                          <p className="mt-1.5 max-w-sm text-xs text-text-muted">
                            Jadilah yang pertama untuk memulai tanya jawab tentang materi pelajaran dengan Dosen dan teman
                            sekelas!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ─── 2.4 ASSESSMENT TAB ─── */}
              {activeTab === 'assessment' && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Card 1: LAB Assignment */}
                  <div className="dark:border-neutral-850 flex h-44 flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:bg-[#1e1e1e]">
                    <div>
                      <h4 className="text-sm font-bold tracking-wide text-slate-800 uppercase dark:text-white">
                        LAB: ASSIGNMENT
                      </h4>
                      <div className="mt-2.5 flex items-center gap-1.5 text-xs font-bold text-slate-500">
                        <FileTextIcon size={16} className="text-slate-400" />
                        <span>{selectedCourse.code === 'ISYS6016005' ? '4 assessments' : '5 assessments'}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-neutral-800">
                      <span className="flex items-center gap-1 text-xs font-bold text-green-500">
                        <CheckCircleIcon size={16} weight="fill" />
                        All done
                      </span>
                      <button
                        onClick={() => toast.info('Membuka rekap tugas praktikum...')}
                        className="rounded bg-[#ff9d00]/10 px-3.5 py-1.5 text-[10px] font-bold text-[#ff9d00] hover:bg-[#ff9d00]/15"
                      >
                        Detail
                      </button>
                    </div>
                  </div>

                  {/* Card 2: LAB Final Exam */}
                  <div className="dark:border-neutral-850 flex h-44 flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:bg-[#1e1e1e]">
                    <div>
                      <h4 className="text-sm font-bold tracking-wide text-slate-800 uppercase dark:text-white">
                        LAB: FINAL EXAM
                      </h4>
                      <div className="mt-2.5 flex items-center gap-1.5 text-xs font-bold text-slate-400">
                        <FileTextIcon size={16} className="text-slate-400" />
                        <span>0 assessment</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-neutral-800">
                      <span className="text-[11px] font-medium text-slate-400">There is no assessment to be done</span>
                      <button
                        disabled
                        className="dark:bg-neutral-850 cursor-not-allowed rounded bg-slate-100 px-3.5 py-1.5 text-[10px] font-bold text-slate-400 opacity-40"
                      >
                        Detail
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── 2.4.1 ASSESSMENT RUBRIC TAB ─── */}
              {activeTab === 'assessment-rubric' && (
                <div className="dark:border-neutral-850 space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:bg-[#1e1e1e]">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">Rubrik Penilaian Kelas</h4>
                  <p className="text-xs leading-relaxed text-slate-500">
                    Setiap tugas dan kuis dinilai berdasarkan kesesuaian solusi, kebersihan kode (untuk praktikum coding),
                    serta analisis skenario bisnis yang mendalam (untuk modul automasi kantor).
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-[10px] font-bold tracking-wider text-slate-400 uppercase dark:border-neutral-800">
                          <th className="py-2.5">Kategori</th>
                          <th className="py-2.5">Bobot</th>
                          <th className="py-2.5">Indikator Kelulusan</th>
                        </tr>
                      </thead>
                      <tbody className="dark:divide-neutral-850 divide-y divide-slate-100 text-slate-600 dark:text-neutral-300">
                        <tr>
                          <td className="text-slate-850 py-3 font-bold dark:text-white">Assignment</td>
                          <td className="py-3 font-bold text-[#ff9d00]">40%</td>
                          <td className="py-3">Kebenaran fungsionalitas program dan kelengkapan fitur laporan.</td>
                        </tr>
                        <tr>
                          <td className="text-slate-850 py-3 font-bold dark:text-white">Quiz & Forum</td>
                          <td className="py-3 font-bold text-[#ff9d00]">20%</td>
                          <td className="py-3">Keaktifan berdiskusi di forum kelas dan hasil kuis mingguan.</td>
                        </tr>
                        <tr>
                          <td className="text-slate-850 py-3 font-bold dark:text-white">Final Exam</td>
                          <td className="py-3 font-bold text-[#ff9d00]">40%</td>
                          <td className="py-3">Ujian komprehensif teori dan studi kasus langsung.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ─── 2.5 PEOPLE TAB - Group Integration Added ─── */}
              {activeTab === 'people' && (
                <div className="dark:border-neutral-850 space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:bg-[#1e1e1e]">
                  <div className="flex flex-col gap-4 border-b border-slate-100 pb-3 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800">
                    <h4 className="text-sm font-bold tracking-wider text-slate-800 uppercase dark:text-white">
                      Daftar Anggota
                    </h4>

                    {/* Sub-tabs: Kelas vs Kelompok */}
                    <div className="dark:bg-neutral-850 flex self-start rounded-lg bg-slate-100 p-1 sm:self-auto">
                      <button
                        onClick={() => {
                          setPeopleSubTab('class')
                          setIsEditingGroup(false)
                        }}
                        className={cn(
                          'rounded-md px-3.5 py-1 text-xs font-bold transition-all focus:outline-none',
                          peopleSubTab === 'class'
                            ? 'bg-[#ff9d00] text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 dark:text-neutral-400 dark:hover:text-white'
                        )}
                      >
                        Kelas (Class)
                      </button>
                      <button
                        onClick={() => setPeopleSubTab('group')}
                        className={cn(
                          'rounded-md px-3.5 py-1 text-xs font-bold transition-all focus:outline-none',
                          peopleSubTab === 'group'
                            ? 'bg-[#ff9d00] text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 dark:text-neutral-400 dark:hover:text-white'
                        )}
                      >
                        Kelompok (Group)
                      </button>
                    </div>
                  </div>

                  {/* Class Members List */}
                  {peopleSubTab === 'class' && (
                    <div className="divide-y divide-slate-100 dark:divide-neutral-800/60">
                      {/* Teacher */}
                      {INSTRUCTORS[selectedCourse.code] && (
                        <div className="flex items-center justify-between py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ff9d00]/10 text-[11px] font-bold text-[#ff9d00]">
                              IN
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-800 dark:text-white">
                                {INSTRUCTORS[selectedCourse.code].name}
                              </p>
                              <p className="text-[9px] font-bold text-slate-400">{INSTRUCTORS[selectedCourse.code].code}</p>
                            </div>
                          </div>
                          <span className="rounded bg-[#ff9d00]/10 px-2 py-0.5 text-[8px] font-bold text-[#ff9d00] uppercase">
                            Dosen
                          </span>
                        </div>
                      )}

                      {/* Classmates */}
                      {[
                        { name: 'Siti Rahmawati', role: 'Mahasiswa' },
                        { name: 'Budi Saputra', role: 'Mahasiswa' },
                        { name: 'Rian Hidayat', role: 'Mahasiswa' },
                        { name: 'Siswa Teladan', role: 'Mahasiswa (Anda)' }
                      ].map((member, idx) => (
                        <div key={idx} className="flex items-center justify-between py-3">
                          <div className="flex items-center gap-3">
                            <div className="text-slate-650 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold dark:bg-neutral-800 dark:text-neutral-300">
                              {member.name.substring(0, 2).toUpperCase()}
                            </div>
                            <p className="text-xs font-bold text-slate-800 dark:text-white">{member.name}</p>
                          </div>
                          <span className="text-[10px] font-medium text-slate-400">{member.role}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Group Members List & Group Creator/Editor */}
                  {peopleSubTab === 'group' && (
                    <div className="space-y-4">
                      {!isEditingGroup ? (
                        <div className="space-y-4 rounded-xl bg-slate-50 p-5 dark:bg-neutral-900/40">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h5 className="text-slate-850 text-sm font-bold dark:text-white">{groupName}</h5>
                              <p className="mt-1 text-xs font-bold text-[#ff9d00]">{groupProject}</p>
                            </div>
                            <button
                              onClick={handleStartEditGroup}
                              className="flex items-center gap-1 rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition-all hover:border-[#ff9d00] hover:text-[#ff9d00] dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
                            >
                              <PencilSimpleIcon size={14} />
                              <span>Kelola Kelompok</span>
                            </button>
                          </div>

                          <div className="space-y-2.5 border-t border-slate-200/60 pt-3 dark:border-neutral-800/60">
                            <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                              Anggota Kelompok ({selectedGroupMembers.length})
                            </p>
                            <div className="divide-y divide-slate-100 dark:divide-neutral-800/40">
                              {selectedGroupMembers.map((name, idx) => {
                                const isLeader = name === 'Siti Rahmawati'

                                return (
                                  <div key={idx} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ff9d00]/10 text-[10px] font-bold text-[#ff9d00]">
                                        {name.substring(0, 2).toUpperCase()}
                                      </div>
                                      <p className="text-xs font-bold text-slate-800 dark:text-white">{name}</p>
                                    </div>
                                    <span
                                      className={cn(
                                        'rounded-full px-2 py-0.5 text-[9px] font-bold',
                                        isLeader
                                          ? 'bg-[#ff9d00]/10 text-[#ff9d00]'
                                          : 'bg-slate-100 text-slate-400 dark:bg-neutral-800'
                                      )}
                                    >
                                      {isLeader ? 'Ketua' : 'Anggota'}
                                    </span>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Edit Group Form */
                        <form
                          onSubmit={handleSaveGroup}
                          className="space-y-4 rounded-xl border border-dashed border-[#ff9d00]/30 bg-amber-50/5 p-5"
                        >
                          <h5 className="text-slate-850 flex items-center gap-2 text-xs font-bold uppercase dark:text-white">
                            <PencilSimpleIcon size={14} className="text-[#ff9d00]" />
                            <span>Edit Informasi Kelompok</span>
                          </h5>

                          <div className="space-y-3.5 text-xs">
                            <div className="space-y-1">
                              <label className="text-slate-450 text-[9px] font-bold tracking-wider uppercase">
                                Nama Kelompok
                              </label>
                              <input
                                type="text"
                                value={tempGroupName}
                                onChange={(e) => setTempGroupName(e.target.value)}
                                className="w-full rounded border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-[#ff9d00] dark:border-neutral-800 dark:bg-neutral-900"
                                placeholder="Masukkan nama kelompok..."
                                required
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-slate-450 text-[9px] font-bold tracking-wider uppercase">
                                Nama Projek Kelompok
                              </label>
                              <input
                                type="text"
                                value={tempGroupProject}
                                onChange={(e) => setTempGroupProject(e.target.value)}
                                className="w-full rounded border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-[#ff9d00] dark:border-neutral-800 dark:bg-neutral-900"
                                placeholder="Masukkan judul projek..."
                                required
                              />
                            </div>

                            <div className="space-y-2 pt-1">
                              <label className="text-slate-455 block text-[9px] font-bold tracking-wider uppercase">
                                Pilih Anggota Kelompok
                              </label>
                              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {['Siti Rahmawati', 'Budi Saputra', 'Rian Hidayat', 'Siswa Teladan'].map((name) => {
                                  const isSelected = tempGroupMembers.includes(name)
                                  const isSelf = name === 'Siswa Teladan'

                                  return (
                                    <div
                                      key={name}
                                      onClick={() => toggleMemberSelection(name)}
                                      className={cn(
                                        'flex cursor-pointer items-center gap-2.5 rounded-lg border p-2.5 transition-all select-none',
                                        isSelected
                                          ? 'border-[#ff9d00] bg-amber-500/5 text-[#ff9d00]'
                                          : 'border-slate-150 hover:bg-slate-50 dark:border-neutral-800 dark:hover:bg-neutral-900'
                                      )}
                                    >
                                      <div
                                        className={cn(
                                          'flex h-4 w-4 shrink-0 items-center justify-center rounded border text-white',
                                          isSelected
                                            ? 'border-[#ff9d00] bg-[#ff9d00]'
                                            : 'border-slate-300 dark:border-neutral-700'
                                        )}
                                      >
                                        {isSelected && <CheckIcon size={12} weight="bold" />}
                                      </div>
                                      <div className="min-w-0">
                                        <p className="truncate font-bold text-slate-800 dark:text-white">{name}</p>
                                        {isSelf && <p className="text-[8px] text-slate-400">Anggota Utama (Wajib)</p>}
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          </div>

                          <div className="dark:border-neutral-850 flex justify-end gap-2.5 border-t border-slate-100 pt-3">
                            <button
                              type="button"
                              onClick={() => setIsEditingGroup(false)}
                              className="rounded bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 dark:bg-neutral-800 dark:text-neutral-300"
                            >
                              Batal
                            </button>
                            <button
                              type="submit"
                              className="flex items-center gap-1.5 rounded bg-[#ff9d00] px-4 py-2 text-xs font-bold text-white hover:bg-[#ff9d00]/95"
                            >
                              <FloppyDiskIcon size={14} />
                              <span>Simpan</span>
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ─── 2.6 ATTENDANCE TAB - Secure QR Attendance Integrated ─── */}
              {activeTab === 'attendance' && (
                <div className="space-y-6">
                  {/* secure check-in screen if not yet checked in */}
                  {!hasAttendedToday ? (
                    <div className="dark:border-neutral-850 space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:bg-[#1e1e1e]">
                      <div className="flex items-start gap-3 border-b border-slate-100 pb-4 dark:border-neutral-800">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-[#ff9d00]">
                          <QrCodeIcon size={20} weight="bold" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                            Presensi Sesi Hari Ini (Sesi 13)
                          </h4>
                          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-2 py-0.5 text-[9px] font-bold text-[#ff9d00] uppercase">
                            Belum Hadir
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
                        {/* Info details */}
                        <div className="space-y-4">
                          <p className="dark:text-neutral-450 text-xs leading-relaxed font-medium text-slate-500">
                            Arahkan kamera aplikasi One Academy di perangkat mobile Anda ke QR Code di samping, atau tekan
                            tombol simulasi di bawah ini untuk menandai kehadiran Anda secara instan di dalam ruang kelas.
                          </p>

                          <button
                            onClick={() => {
                              handleAttendanceSecure(activeQRToken)
                              toast.success('Kehadiran Anda di Sesi 13 telah berhasil dicatat!')
                            }}
                            className="flex w-full items-center justify-center gap-2 rounded bg-[#ff9d00] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#ff9d00]/90 active:scale-95"
                          >
                            <QrCodeIcon size={16} />
                            <span>Simulasi Pindai QR via Mobile</span>
                          </button>
                        </div>

                        {/* Interactive Projector QR Code Visual */}
                        <div className="border-slate-150 flex flex-col items-center justify-center rounded-xl border bg-slate-50 p-4.5 dark:border-neutral-800/80 dark:bg-neutral-900/50">
                          <p className="mb-3.5 text-[8px] font-bold tracking-widest text-slate-400 uppercase">
                            MODE PROYEKTOR KELAS
                          </p>

                          {/* Progress Circle Wrapper */}
                          <div className="relative">
                            <svg className="absolute -inset-3 -rotate-90" width="176" height="176" viewBox="0 0 176 176">
                              <circle
                                cx="88"
                                cy="88"
                                r="84"
                                fill="none"
                                stroke="#e2e8f0"
                                strokeWidth="2.5"
                                className="dark:stroke-neutral-800"
                              />
                              <circle
                                cx="88"
                                cy="88"
                                r="84"
                                fill="none"
                                stroke="#ff9d00"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 84}`}
                                strokeDashoffset={`${2 * Math.PI * 84 * (1 - qrCountdown / 10)}`}
                                style={{ transition: 'stroke-dashoffset 1s linear' }}
                              />
                            </svg>
                            <div className="relative flex h-38 w-38 items-center justify-center rounded bg-white p-2.5 shadow shadow-slate-100">
                              <QRCodeSVG
                                value={`oneacademy://attend?token=${activeQRToken}&class=${selectedCourse.code}`}
                                size={132}
                                bgColor="#ffffff"
                                fgColor="#333333"
                                level="M"
                              />
                            </div>
                            <div className="absolute -right-1.5 -bottom-1.5 flex h-8 w-8 flex-col items-center justify-center rounded-full bg-[#ff9d00] font-black text-white shadow">
                              <span className="text-[10px] leading-none">{qrCountdown}</span>
                              <span className="mt-0.5 text-[6px] leading-none opacity-80">det</span>
                            </div>
                          </div>

                          <div className="mt-5 space-y-0.5 text-center font-mono">
                            <span className="block text-[9px] font-bold tracking-widest text-slate-400 uppercase dark:text-neutral-500">
                              Token Aktif
                            </span>
                            <span className="block text-sm font-bold tracking-wider text-slate-800 dark:text-white">
                              {activeQRToken}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Show success attendance panel */
                    <div className="space-y-4 rounded-xl border border-green-200/50 bg-green-50/5 p-5 shadow-xs dark:border-green-800/20 dark:bg-green-950/5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-500 text-white">
                          <CheckCircleIcon size={20} weight="fill" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 dark:text-white">Presensi Berhasil Terdaftar!</h4>
                          <p className="dark:text-neutral-450 mt-0.5 text-xs text-slate-500">
                            Kehadiran Anda di Sesi 13 hari ini telah dicatat menggunakan Wifi Secure Check-in.
                          </p>
                        </div>
                      </div>

                      <div className="dark:border-neutral-850 flex flex-wrap items-center justify-between gap-2.5 border-t border-slate-100 pt-3.5">
                        <span className="text-slate-450 text-xs font-bold">Demo Kehadiran Aktif</span>
                        <button
                          onClick={() => {
                            resetAttendance()
                            toast.info('Demo kehadiran berhasil direset.')
                          }}
                          className="text-slate-550 rounded border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold hover:bg-slate-50 dark:border-neutral-800 dark:bg-[#1a1a1a] dark:text-neutral-300"
                        >
                          Reset Kehadiran (Demo)
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Attendance Log Stats */}
                  <div className="dark:border-neutral-850 space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:bg-[#1e1e1e]">
                    <h4 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Rekap Kehadiran Siswa</h4>
                    <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-4 text-center dark:border-neutral-800">
                      <div className="rounded-lg bg-slate-50 p-3 dark:bg-neutral-900/40">
                        <p className="text-slate-450 text-[10px] font-bold uppercase">Hadir</p>
                        <p className="text-lg font-black text-green-500">
                          {hasAttendedToday ? attendanceCount + 1 : attendanceCount} Sesi
                        </p>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3 dark:bg-neutral-900/40">
                        <p className="text-slate-455 text-[10px] font-bold uppercase">Absen</p>
                        <p className="text-lg font-black text-rose-500">0 Sesi</p>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3 dark:bg-neutral-900/40">
                        <p className="text-slate-450 text-[10px] font-bold uppercase">Persentase</p>
                        <p className="text-lg font-black text-[#ff9d00]">{hasAttendedToday ? '100%' : '92.3%'}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        Log Presensi Sesi Terbaru
                      </p>
                      <div className="space-y-2.5">
                        {hasAttendedToday && (
                          <div className="dark:border-neutral-850 flex items-center justify-between border-b border-slate-50 py-2 text-xs font-medium last:border-0">
                            <div>
                              <p className="font-bold text-slate-800 dark:text-white">Sesi 13</p>
                              <p className="text-slate-450 mt-0.5 text-[10px]">Hari ini, 09:12 GMT+7</p>
                            </div>
                            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-600 dark:bg-emerald-500/20">
                              Wifi Secure Check-in
                            </span>
                          </div>
                        )}
                        {[
                          { session: 'Sesi 12', time: '11 Jun 2026, 15:21 GMT+7', method: 'Wifi Secure Check-in' },
                          { session: 'Sesi 11', time: '04 Jun 2026, 15:25 GMT+7', method: 'Wifi Secure Check-in' },
                          { session: 'Sesi 10', time: '28 May 2026, 15:20 GMT+7', method: 'Wifi Secure Check-in' }
                        ].map((log, idx) => (
                          <div
                            key={idx}
                            className="dark:border-neutral-850 flex items-center justify-between border-b border-slate-50 py-2.5 text-xs last:border-0"
                          >
                            <div>
                              <p className="font-bold text-slate-800 dark:text-white">{log.session}</p>
                              <p className="text-slate-450 mt-0.5 text-[10px]">{log.time}</p>
                            </div>
                            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-600 dark:bg-emerald-500/20">
                              {log.method}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ─── 3. PDF / DOCUMENT SLIDESHOW VIEWER ─── */}
        {currentView === 'document' && selectedCourse && (
          <motion.div
            key="document"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-6"
          >
            {/* Header: Title & Download */}
            <div className="border-slate-150 flex items-center justify-between border-b pb-4 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentView('detail')}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                >
                  <ArrowLeftIcon size={16} weight="bold" />
                </button>
                <div>
                  <h3 className="text-[10px] leading-none font-bold tracking-wider text-slate-400 uppercase">
                    Session {activeSession}
                  </h3>
                  <h4 className="mt-1.5 text-sm font-bold text-slate-800 dark:text-white">
                    {activeSession === 12
                      ? '12 13 What-if Analysis [L]'
                      : activeSession === 13
                        ? '13 Pengenalan Excel Lanjutan [L]'
                        : '14 Review Materi & Ujian Akhir [L]'}
                  </h4>
                </div>
              </div>

              <button
                onClick={() => handlePdfDownload(selectedCourse.title, `Sesi ${activeSession}`)}
                className="flex shrink-0 items-center gap-1.5 rounded bg-[#ff9d00] px-4.5 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#ff9d00]/95 active:scale-95"
              >
                <DownloadSimpleIcon size={14} weight="bold" />
                <span>DOWNLOAD</span>
              </button>
            </div>

            {/* Simulated Interactive PDF Slide Deck Frame */}
            <div className="border-slate-250 overflow-hidden rounded-xl border bg-slate-900 shadow-md dark:border-neutral-800">
              {/* Active Slide Screen - Dark Red Theme from Satu University */}
              <div className="relative flex aspect-[16/9] w-full flex-col items-center justify-center bg-[#5c1c1c] p-8 text-white md:p-16">
                {/* Simulated University Watermark */}
                <div className="absolute top-4 left-6 flex items-center gap-1.5 opacity-80">
                  <div className="h-2 w-2 rounded-full bg-yellow-400" />
                  <span className="text-[10px] font-black tracking-wider text-white uppercase">SATU University</span>
                </div>

                <div className="absolute top-4 right-6 text-[8px] font-bold tracking-wider text-white/50 uppercase">
                  Subject Matter Expert
                </div>

                {/* Dynamic Slide Content */}
                <div className="max-w-2xl space-y-6 text-center">
                  <h2 className="text-xl leading-snug font-bold tracking-tight uppercase drop-shadow-sm md:text-3xl">
                    {(SLIDES[selectedCourse.code]?.[currentSlideIndex] || { title: 'Slide Pelajaran' }).title}
                  </h2>
                  <div className="mx-auto h-0.5 w-16 bg-yellow-400" />
                  <p className="text-xs font-bold tracking-wider text-yellow-300 uppercase">
                    {(SLIDES[selectedCourse.code]?.[currentSlideIndex] || { subtitle: '' }).subtitle}
                  </p>
                  <ul className="mx-auto max-w-lg space-y-3 pt-2 text-left text-sm font-medium text-white/90">
                    {(SLIDES[selectedCourse.code]?.[currentSlideIndex] || { content: [] }).content.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-400" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Deck control bar */}
              <div className="flex items-center justify-between bg-slate-800 px-4 py-3 text-white dark:bg-neutral-900">
                <div className="text-xs font-semibold text-white/60">
                  {selectedCourse.code === 'ISYS6016005' ? 'CSS Layout' : 'What-If.pdf'}
                </div>

                {/* Slides navigation */}
                <div className="flex items-center gap-4">
                  <button
                    disabled={currentSlideIndex === 0}
                    onClick={() => setCurrentSlideIndex((prev) => prev - 1)}
                    className="flex h-7 w-7 items-center justify-center rounded bg-white/10 transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ArrowLeftIcon size={14} weight="bold" />
                  </button>
                  <span className="text-[10px] font-bold tracking-wider uppercase">
                    SLIDE {currentSlideIndex + 1} OF {(SLIDES[selectedCourse.code] || []).length || 4}
                  </span>
                  <button
                    disabled={currentSlideIndex >= (SLIDES[selectedCourse.code] || []).length - 1}
                    onClick={() => setCurrentSlideIndex((prev) => prev + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded bg-white/10 transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ArrowRightIcon size={14} weight="bold" />
                  </button>
                </div>

                <div className="hidden text-[10px] font-bold text-white/40 sm:block">Zoom: 100%</div>
              </div>
            </div>

            {/* Bottom Status line */}
            <div className="text-right text-[10px] font-bold text-slate-400 dark:text-neutral-500">
              Last Updated: 18 Jun 2026, 09:04 GMT+7
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
