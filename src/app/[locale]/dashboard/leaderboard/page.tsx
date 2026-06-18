'use client'

import { useDashboard } from '@/context/dashboard-context'
import {
  TrophyIcon,
  BookOpenIcon,
  ChatCircleDotsIcon,
  CalendarCheckIcon,
  PlusIcon,
  UploadSimpleIcon,
  CheckCircleIcon,
  GraduationCapIcon
} from '@phosphor-icons/react'
import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

import { cn } from '@/utils'

// Mock Class Leaderboard Data per Course
interface StudentRank {
  rank: number
  name: string
  xp: number
  level: number
  badges: string[]
  streak: number
  stats: {
    attendance: number
    forum: number
    assignments: number
  }
  rankChange: 'up' | 'down' | 'stable'
  rankChangeAmount?: number
}

const MOCK_LEADERBOARD_DATA: Record<string, StudentRank[]> = {
  all: [
    {
      rank: 1,
      name: 'Siti Rahmawati',
      xp: 1450,
      level: 12,
      badges: ['⚡ Fast Learner', '🏆 Top Contributor', '📅 Absensi Emas'],
      streak: 15,
      stats: { attendance: 400, forum: 600, assignments: 450 },
      rankChange: 'stable'
    },
    {
      rank: 2,
      name: 'Budi Saputra',
      xp: 1280,
      level: 10,
      badges: ['🏆 Top Contributor', '🎓 Homework Hero'],
      streak: 8,
      stats: { attendance: 350, forum: 480, assignments: 450 },
      rankChange: 'up',
      rankChangeAmount: 1
    },
    {
      rank: 3,
      name: 'Roni Wijaya',
      xp: 1150,
      level: 9,
      badges: ['⚡ Fast Learner', '📅 Absensi Emas'],
      streak: 12,
      stats: { attendance: 400, forum: 300, assignments: 450 },
      rankChange: 'down',
      rankChangeAmount: 1
    },
    {
      rank: 4,
      name: 'Siswa Teladan',
      xp: 980,
      level: 8,
      badges: ['📅 Absensi Emas', '🎓 Homework Hero'],
      streak: 5,
      stats: { attendance: 380, forum: 250, assignments: 350 },
      rankChange: 'up',
      rankChangeAmount: 2
    },
    {
      rank: 5,
      name: 'Rian Hidayat',
      xp: 910,
      level: 7,
      badges: ['⚡ Fast Learner'],
      streak: 4,
      stats: { attendance: 320, forum: 290, assignments: 300 },
      rankChange: 'down',
      rankChangeAmount: 1
    },
    {
      rank: 6,
      name: 'Adi Pratama',
      xp: 850,
      level: 7,
      badges: ['📅 Absensi Emas'],
      streak: 10,
      stats: { attendance: 400, forum: 150, assignments: 300 },
      rankChange: 'stable'
    },
    {
      rank: 7,
      name: 'Lani Lestari',
      xp: 790,
      level: 6,
      badges: ['🎓 Homework Hero'],
      streak: 3,
      stats: { attendance: 300, forum: 140, assignments: 350 },
      rankChange: 'stable'
    },
    {
      rank: 8,
      name: 'Dewa Putu',
      xp: 710,
      level: 6,
      badges: [],
      streak: 0,
      stats: { attendance: 250, forum: 160, assignments: 300 },
      rankChange: 'up',
      rankChangeAmount: 1
    },
    {
      rank: 9,
      name: 'Fitri Handayani',
      xp: 680,
      level: 5,
      badges: ['📅 Absensi Emas'],
      streak: 9,
      stats: { attendance: 380, forum: 100, assignments: 200 },
      rankChange: 'down',
      rankChangeAmount: 1
    },
    {
      rank: 10,
      name: 'Gede Bagus',
      xp: 620,
      level: 5,
      badges: [],
      streak: 2,
      stats: { attendance: 280, forum: 90, assignments: 250 },
      rankChange: 'stable'
    }
  ],
  char: [
    {
      rank: 1,
      name: 'Siti Rahmawati',
      xp: 520,
      level: 12,
      badges: ['🏆 Top Contributor', '⚡ Fast Learner'],
      streak: 15,
      stats: { attendance: 150, forum: 250, assignments: 120 },
      rankChange: 'stable'
    },
    {
      rank: 2,
      name: 'Budi Saputra',
      xp: 490,
      level: 10,
      badges: ['🏆 Top Contributor'],
      streak: 8,
      stats: { attendance: 120, forum: 220, assignments: 150 },
      rankChange: 'up',
      rankChangeAmount: 1
    },
    {
      rank: 3,
      name: 'Siswa Teladan',
      xp: 450,
      level: 8,
      badges: ['📅 Absensi Emas', '🎓 Homework Hero'],
      streak: 5,
      stats: { attendance: 150, forum: 150, assignments: 150 },
      rankChange: 'down',
      rankChangeAmount: 1
    },
    {
      rank: 4,
      name: 'Rian Hidayat',
      xp: 380,
      level: 7,
      badges: [],
      streak: 4,
      stats: { attendance: 100, forum: 180, assignments: 100 },
      rankChange: 'stable'
    },
    {
      rank: 5,
      name: 'Roni Wijaya',
      xp: 320,
      level: 9,
      badges: ['📅 Absensi Emas'],
      streak: 12,
      stats: { attendance: 150, forum: 70, assignments: 100 },
      rankChange: 'stable'
    }
  ]
}

// Mock Campus Leaderboard Data based on SAT (Student Activity Transcript) points
interface CampusRank {
  rank: number
  name: string
  sat: number
  level: number
  stats: {
    seminar: number
    workshop: number
    volunteer: number
    organisasi: number
  }
  rankChange: 'up' | 'down' | 'stable'
  rankChangeAmount?: number
}

const MOCK_CAMPUS_LEADERBOARD: CampusRank[] = [
  {
    rank: 1,
    name: 'Siti Rahmawati',
    sat: 210,
    level: 15,
    stats: { seminar: 8, workshop: 5, volunteer: 3, organisasi: 2 },
    rankChange: 'stable'
  },
  {
    rank: 2,
    name: 'Budi Saputra',
    sat: 185,
    level: 13,
    stats: { seminar: 6, workshop: 4, volunteer: 2, organisasi: 2 },
    rankChange: 'up',
    rankChangeAmount: 1
  },
  {
    rank: 3,
    name: 'Dewa Putu',
    sat: 160,
    level: 12,
    stats: { seminar: 5, workshop: 3, volunteer: 3, organisasi: 1 },
    rankChange: 'down',
    rankChangeAmount: 1
  },
  {
    rank: 4,
    name: 'Siswa Teladan', // User
    sat: 145, // Will dynamically sum approved claims + base
    level: 11,
    stats: { seminar: 4, workshop: 3, volunteer: 2, organisasi: 1 },
    rankChange: 'up',
    rankChangeAmount: 1
  },
  {
    rank: 5,
    name: 'Roni Wijaya',
    sat: 130,
    level: 10,
    stats: { seminar: 5, workshop: 2, volunteer: 1, organisasi: 1 },
    rankChange: 'down',
    rankChangeAmount: 1
  },
  {
    rank: 6,
    name: 'Rian Hidayat',
    sat: 110,
    level: 9,
    stats: { seminar: 3, workshop: 2, volunteer: 2, organisasi: 0 },
    rankChange: 'stable'
  },
  {
    rank: 7,
    name: 'Lani Lestari',
    sat: 95,
    level: 8,
    stats: { seminar: 2, workshop: 2, volunteer: 1, organisasi: 1 },
    rankChange: 'stable'
  },
  {
    rank: 8,
    name: 'Adi Pratama',
    sat: 80,
    level: 7,
    stats: { seminar: 3, workshop: 1, volunteer: 1, organisasi: 0 },
    rankChange: 'stable'
  }
]

// Mock SAT Claim Structure
interface SatClaim {
  id: string
  activityName: string
  category: 'Seminar' | 'Workshop' | 'Volunteer' | 'Organisasi' | 'Lomba'
  organizer: string
  date: string
  points: number
  proofName: string
  status: 'approved' | 'pending' | 'rejected'
}

const INITIAL_CLAIMS: SatClaim[] = [
  {
    id: 'c1',
    activityName: 'Seminar Nasional Keamanan Siber & Cloud Computing',
    category: 'Seminar',
    organizer: 'Himpunan Mahasiswa Informatika',
    date: '2026-05-12',
    points: 10,
    proofName: 'sertifikat_seminar_siber.pdf',
    status: 'approved'
  },
  {
    id: 'c2',
    activityName: 'Workshop UI/UX Design Fundamentals',
    category: 'Workshop',
    organizer: 'Satu Academy',
    date: '2026-05-20',
    points: 15,
    proofName: 'sertifikat_workshop_uiux.pdf',
    status: 'approved'
  },
  {
    id: 'c3',
    activityName: 'Relawan Mengajar Anak Jalanan',
    category: 'Volunteer',
    organizer: 'Yayasan Kasih Bangsa',
    date: '2026-06-01',
    points: 20,
    proofName: 'sertifikat_relawan_mengajar.pdf',
    status: 'approved'
  },
  {
    id: 'c4',
    activityName: 'Pengurus Himpunan Mahasiswa Informatika (Sekretaris)',
    category: 'Organisasi',
    organizer: 'Universitas Satu',
    date: '2026-06-10',
    points: 30,
    proofName: 'sk_pengurus_hima.pdf',
    status: 'pending'
  }
]

export default function LeaderboardPage() {
  const t = useTranslations('Dashboard')
  const { userData, currentLang } = useDashboard()

  const isIndo = currentLang === 'id'

  // Segment Navigation
  const [mainTab, setMainTab] = useState<'class' | 'campus' | 'sat'>('class')

  // Sub-states for Class Leaderboard
  const [activeTimeframe, setActiveTimeframe] = useState<'monthly' | 'alltime'>('monthly')
  const [activeCourse, setActiveCourse] = useState<'all' | 'char'>('all')

  // SAT Claims Store state
  const [satClaims, setSatClaims] = useState<SatClaim[]>(INITIAL_CLAIMS)

  // SAT Claim Form fields
  const [actName, setActName] = useState('')
  const [actCategory, setActCategory] = useState<'Seminar' | 'Workshop' | 'Volunteer' | 'Organisasi' | 'Lomba'>('Seminar')
  const [actOrganizer, setActOrganizer] = useState('')
  const [actDate, setActDate] = useState('')
  const [actFile, setActFile] = useState<string | null>(null)

  // Calculate total approved SAT points dynamically
  const approvedSatPoints = satClaims.filter((c) => c.status === 'approved').reduce((sum, c) => sum + c.points, 0)

  // Auto-verify simulation: if a claim is added, approve it after 4 seconds to show reactive bar updates
  useEffect(() => {
    const pendingClaim = satClaims.find((c) => c.status === 'pending' && c.id.startsWith('user-'))
    if (pendingClaim) {
      const timer = setTimeout(() => {
        setSatClaims((prev) => prev.map((c) => (c.id === pendingClaim.id ? { ...c, status: 'approved' } : c)))
        toast.success(
          isIndo
            ? `Pengajuan SAT '${pendingClaim.activityName}' telah disetujui! +${pendingClaim.points} Poin SAT.`
            : `SAT Claim '${pendingClaim.activityName}' approved! +${pendingClaim.points} SAT points.`
        )
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [satClaims, isIndo])

  if (!userData) return null

  // Define Category Points Matrix
  const getPointsByCategory = (cat: string) => {
    switch (cat) {
      case 'Seminar':
        return 10
      case 'Workshop':
        return 15
      case 'Volunteer':
        return 20
      case 'Lomba':
        return 25
      case 'Organisasi':
        return 30
      default:
        return 5
    }
  }

  // Handle new Claim submission
  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!actName || !actOrganizer || !actDate || !actFile) {
      toast.error(
        isIndo ? 'Harap lengkapi semua kolom dan unggah sertifikat!' : 'Please complete all fields and upload certificate!'
      )

      return
    }

    const newClaim: SatClaim = {
      id: `user-${Date.now()}`,
      activityName: actName,
      category: actCategory,
      organizer: actOrganizer,
      date: actDate,
      points: getPointsByCategory(actCategory),
      proofName: actFile,
      status: 'pending'
    }

    setSatClaims((prev) => [newClaim, ...prev])
    toast.success(
      isIndo ? 'Klaim poin SAT dikirim! Menunggu verifikasi admin...' : 'SAT claim submitted! Awaiting admin verification...'
    )

    // Reset Form
    setActName('')
    setActOrganizer('')
    setActDate('')
    setActFile(null)
  }

  // ─── 1. Class Leaderboard Calculations ───
  const rawClassData = MOCK_LEADERBOARD_DATA[activeCourse] || MOCK_LEADERBOARD_DATA.all
  const classRanks = rawClassData.map((rank) => {
    if (rank.name === 'Siswa Teladan') {
      return { ...rank, name: userData.name }
    }

    return rank
  })
  const classTop1 = classRanks.find((r) => r.rank === 1)
  const classTop2 = classRanks.find((r) => r.rank === 2)
  const classTop3 = classRanks.find((r) => r.rank === 3)
  const classListRanks = classRanks.filter((r) => r.rank > 3)
  const myClassRankInfo = classRanks.find((r) => r.name.toLowerCase() === userData.name.toLowerCase())

  // ─── 2. Campus Leaderboard Calculations ───
  // Adjust Siswa Teladan's SAT dynamically based on state
  const campusRanks = MOCK_CAMPUS_LEADERBOARD.map((rank) => {
    if (rank.name === 'Siswa Teladan') {
      return {
        ...rank,
        name: userData.name,
        // Base SAT is 100 + approved points
        sat: 100 + approvedSatPoints
      }
    }

    return rank
  }).sort((a, b) => b.sat - a.sat)

  // Re-map ranks after sorting
  const updatedCampusRanks = campusRanks.map((r, i) => ({ ...r, rank: i + 1 }))

  const campusTop1 = updatedCampusRanks.find((r) => r.rank === 1)
  const campusTop2 = updatedCampusRanks.find((r) => r.rank === 2)
  const campusTop3 = updatedCampusRanks.find((r) => r.rank === 3)
  const campusListRanks = updatedCampusRanks.filter((r) => r.rank > 3)
  const myCampusRankInfo = updatedCampusRanks.find((r) => r.name.toLowerCase() === userData.name.toLowerCase())

  // Mock available courses
  const courseOptions = [
    { key: 'all', label: isIndo ? 'Semua Mata Kuliah' : 'All Courses' },
    { key: 'char', label: 'Character Building (CHAR6002)' }
  ]

  return (
    <div className="space-y-6">
      {/* ─── Top Main Tabs / Segment Navigation ─── */}
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800/60">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-800 sm:text-2xl dark:text-white">
            {isIndo ? 'Papan Peringkat & Transkrip SAT' : 'Leaderboard & SAT Transcript'}
          </h1>
          <p className="mt-1 text-xs text-text-muted">
            {isIndo
              ? 'Pantau pencapaian akademik kelas dan ajukan poin transkrip aktivitas mahasiswa.'
              : 'Track class academic rankings and submit student activity transcript points.'}
          </p>
        </div>

        {/* Navigation Segments */}
        <div className="dark:bg-neutral-850 flex rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setMainTab('class')}
            className={cn(
              'rounded-lg px-4 py-2 text-xs font-black tracking-wide uppercase transition-all',
              mainTab === 'class'
                ? 'bg-white text-text-dark shadow-xs dark:bg-neutral-800 dark:text-white'
                : 'text-text-muted hover:text-text-dark dark:hover:text-neutral-300'
            )}
          >
            {isIndo ? 'Peringkat Kelas' : 'Class Ranks'}
          </button>
          <button
            onClick={() => setMainTab('campus')}
            className={cn(
              'rounded-lg px-4 py-2 text-xs font-black tracking-wide uppercase transition-all',
              mainTab === 'campus'
                ? 'bg-white text-text-dark shadow-xs dark:bg-neutral-800 dark:text-white'
                : 'text-text-muted hover:text-text-dark dark:hover:text-neutral-300'
            )}
          >
            {isIndo ? 'Peringkat Kampus' : 'Campus Ranks'}
          </button>
          <button
            onClick={() => setMainTab('sat')}
            className={cn(
              'rounded-lg px-4 py-2 text-xs font-black tracking-wide uppercase transition-all',
              mainTab === 'sat'
                ? 'bg-white text-text-dark shadow-xs dark:bg-neutral-800 dark:text-white'
                : 'text-text-muted hover:text-text-dark dark:hover:text-neutral-300'
            )}
          >
            {isIndo ? 'Transkrip SAT' : 'SAT Transcript'}
          </button>
        </div>
      </div>

      {/* ─── TAB 1: Class Leaderboard View ─── */}
      {mainTab === 'class' && (
        <div className="space-y-6">
          {/* Sub-Filters */}
          <div className="flex items-center justify-end gap-3">
            <select
              value={activeCourse}
              onChange={(e) => setActiveCourse(e.target.value as 'all' | 'char')}
              className="dark:border-neutral-850 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-text-dark shadow-sm transition-all outline-none focus:border-primary dark:bg-neutral-900 dark:text-white"
            >
              {courseOptions.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>

            <div className="flex rounded-full bg-slate-100 p-0.5 dark:bg-neutral-800">
              <button
                onClick={() => setActiveTimeframe('monthly')}
                className={cn(
                  'rounded-full px-3.5 py-1 text-xs font-bold transition-all',
                  activeTimeframe === 'monthly'
                    ? 'bg-white text-text-dark shadow-xs dark:bg-neutral-700 dark:text-white'
                    : 'text-text-muted hover:text-text-dark dark:hover:text-white'
                )}
              >
                {isIndo ? 'Bulan Ini' : 'Monthly'}
              </button>
              <button
                onClick={() => setActiveTimeframe('alltime')}
                className={cn(
                  'rounded-full px-3.5 py-1 text-xs font-bold transition-all',
                  activeTimeframe === 'alltime'
                    ? 'bg-white text-text-dark shadow-xs dark:bg-neutral-700 dark:text-white'
                    : 'text-text-muted hover:text-text-dark dark:hover:text-white'
                )}
              >
                {isIndo ? 'Semua' : 'All-Time'}
              </button>
            </div>
          </div>

          {/* Podium Grid */}
          <div className="grid grid-cols-1 items-end gap-5 sm:grid-cols-3">
            {/* Rank 2 Podium */}
            {classTop2 && (
              <div className="order-2 flex flex-col items-center sm:order-1">
                <div className="relative flex w-full flex-col items-center rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm hover:shadow-md dark:border-neutral-800/60 dark:bg-[#1e1e1e]">
                  <div className="absolute -top-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-300 font-black text-slate-800 shadow-xs">
                    2
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 font-black text-slate-400 dark:bg-neutral-800">
                    {classTop2.name.substring(0, 2).toUpperCase()}
                  </div>
                  <h3 className="mt-2.5 text-xs font-black text-slate-800 dark:text-white">{classTop2.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400">Level {classTop2.level}</p>
                  <div className="mt-4 flex w-full justify-around border-t border-slate-100 pt-3 text-[9px] font-bold text-slate-400 dark:border-neutral-800">
                    <span className="flex items-center gap-0.5">
                      <CalendarCheckIcon size={10} className="text-green-500" />
                      {classTop2.stats.attendance}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <ChatCircleDotsIcon size={10} className="text-primary dark:text-secondary" />
                      {classTop2.stats.forum}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <BookOpenIcon size={10} className="text-amber-500" />
                      {classTop2.stats.assignments}
                    </span>
                  </div>
                  <span className="mt-3 text-[10px] font-black text-primary dark:text-secondary">{classTop2.xp} XP</span>
                </div>
              </div>
            )}

            {/* Rank 1 Podium */}
            {classTop1 && (
              <div className="order-1 flex flex-col items-center sm:order-2">
                <div className="relative flex w-full flex-col items-center rounded-2xl border-2 border-primary/20 bg-white p-6 text-center shadow-md hover:shadow-lg dark:border-secondary/20 dark:bg-[#1e1e1e]">
                  <div className="absolute -top-4 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 font-black text-white shadow-sm ring-4 ring-amber-100 dark:ring-amber-950/40">
                    👑
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 font-black text-primary dark:bg-secondary/15 dark:text-secondary">
                    {classTop1.name.substring(0, 2).toUpperCase()}
                  </div>
                  <h3 className="mt-3 text-sm font-black text-slate-800 dark:text-white">{classTop1.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400">Level {classTop1.level}</p>
                  <div className="mt-4 flex w-full justify-around border-t border-slate-100 pt-3 text-[9px] font-bold text-slate-400 dark:border-neutral-800">
                    <span className="flex items-center gap-0.5">
                      <CalendarCheckIcon size={10} className="text-green-500" />
                      {classTop1.stats.attendance}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <ChatCircleDotsIcon size={10} className="text-primary dark:text-secondary" />
                      {classTop1.stats.forum}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <BookOpenIcon size={10} className="text-amber-500" />
                      {classTop1.stats.assignments}
                    </span>
                  </div>
                  <span className="mt-3 text-xs font-black text-primary dark:text-secondary">{classTop1.xp} XP</span>
                </div>
              </div>
            )}

            {/* Rank 3 Podium */}
            {classTop3 && (
              <div className="order-3 flex flex-col items-center">
                <div className="relative flex w-full flex-col items-center rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm hover:shadow-md dark:border-neutral-800/60 dark:bg-[#1e1e1e]">
                  <div className="absolute -top-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-amber-700 font-black text-white shadow-xs">
                    3
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 font-black text-slate-400 dark:bg-neutral-800">
                    {classTop3.name.substring(0, 2).toUpperCase()}
                  </div>
                  <h3 className="mt-2.5 text-xs font-black text-slate-800 dark:text-white">{classTop3.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400">Level {classTop3.level}</p>
                  <div className="mt-4 flex w-full justify-around border-t border-slate-100 pt-3 text-[9px] font-bold text-slate-400 dark:border-neutral-800">
                    <span className="flex items-center gap-0.5">
                      <CalendarCheckIcon size={10} className="text-green-500" />
                      {classTop3.stats.attendance}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <ChatCircleDotsIcon size={10} className="text-primary dark:text-secondary" />
                      {classTop3.stats.forum}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <BookOpenIcon size={10} className="text-amber-500" />
                      {classTop3.stats.assignments}
                    </span>
                  </div>
                  <span className="mt-3 text-[10px] font-black text-primary dark:text-secondary">{classTop3.xp} XP</span>
                </div>
              </div>
            )}
          </div>

          {/* Table List & Sidebar Statistics */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Leaderboard Table (Col-span 8) */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-8 dark:border-neutral-800/60 dark:bg-[#1e1e1e]">
              <div className="border-b border-slate-100 px-5 py-4 dark:border-neutral-800">
                <h3 className="text-xs font-black tracking-wider text-slate-400 uppercase">
                  {isIndo ? 'Daftar Peringkat' : 'Leaderboard Standings'}
                </h3>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-neutral-800">
                {classListRanks.map((student) => {
                  const isMe = student.name.toLowerCase() === userData.name.toLowerCase()

                  return (
                    <div
                      key={student.rank}
                      className={cn(
                        'flex items-center justify-between px-5 py-4 transition-colors hover:bg-slate-50/50 dark:hover:bg-neutral-800/30',
                        isMe && 'border-l-2 border-primary bg-primary/5 dark:border-secondary dark:bg-[#008ae3]/5'
                      )}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="w-5 text-center text-xs font-bold text-slate-400">#{student.rank}</span>
                        <div className="dark:bg-neutral-850 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 font-bold text-slate-500 dark:text-neutral-400">
                          {student.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-800 dark:text-white">
                            {student.name}{' '}
                            {isMe && (
                              <span className="ml-1 text-[8px] font-black text-primary dark:text-secondary">(Saya)</span>
                            )}
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-neutral-500">
                            Level {student.level} • {student.streak} 🔥
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="hidden items-center gap-4 text-[10px] font-bold text-slate-400 sm:flex">
                          <span className="flex items-center gap-0.5">
                            <CalendarCheckIcon size={10} className="text-green-500" />
                            {student.stats.attendance}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <ChatCircleDotsIcon size={10} className="text-primary dark:text-secondary" />
                            {student.stats.forum}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <BookOpenIcon size={10} className="text-amber-500" />
                            {student.stats.assignments}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black text-slate-800 dark:text-white">{student.xp}</p>
                          <p className="text-[8px] font-extrabold text-slate-400 uppercase">XP</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Sidebar Cabinet (Col-span 4) */}
            <div className="space-y-4 lg:col-span-4">
              {myClassRankInfo && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-neutral-800/60 dark:bg-[#1e1e1e]">
                  <h3 className="text-xs font-black tracking-wider text-slate-400 uppercase dark:text-neutral-500">
                    {isIndo ? 'Status Keaktifan Saya' : 'My Activity Status'}
                  </h3>

                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[#00b0ff] text-white">
                      <TrophyIcon size={24} weight="fill" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Peringkat Kelas</p>
                      <p className="text-lg font-black text-slate-800 dark:text-white">#{myClassRankInfo.rank}</p>
                    </div>
                  </div>

                  {/* Progress bar to next level */}
                  <div className="mt-5 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-slate-500 dark:text-neutral-400">Level {myClassRankInfo.level}</span>
                      <span className="text-text-muted">{myClassRankInfo.xp} / 1100 XP</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-neutral-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-[#00b0ff] transition-all"
                        style={{ width: `${(myClassRankInfo.xp / 1100) * 100}%` }}
                      />
                    </div>
                    <p className="text-[9px] text-slate-400 dark:text-neutral-500">
                      {isIndo
                        ? `Butuh ${1100 - myClassRankInfo.xp} XP lagi untuk naik ke Level ${myClassRankInfo.level + 1}`
                        : `Need ${1100 - myClassRankInfo.xp} more XP to reach Level ${myClassRankInfo.level + 1}`}
                    </p>
                  </div>
                </div>
              )}

              {/* Badges Cabinet */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-neutral-800/60 dark:bg-[#1e1e1e]">
                <h3 className="text-xs font-black tracking-wider text-slate-400 uppercase dark:text-neutral-500">
                  {isIndo ? 'Kabinet Lencana Saya' : 'My Badges'}
                </h3>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="flex flex-col items-center rounded-xl bg-slate-50 p-2 text-center dark:bg-neutral-900/50">
                    <span className="text-xl">📅</span>
                    <span className="mt-1 text-[8px] leading-tight font-black text-slate-800 dark:text-white">
                      Absensi Emas
                    </span>
                  </div>
                  <div className="flex flex-col items-center rounded-xl bg-slate-50 p-2 text-center dark:bg-neutral-900/50">
                    <span className="text-xl">🎓</span>
                    <span className="mt-1 text-[8px] leading-tight font-black text-slate-800 dark:text-white">
                      Homework Hero
                    </span>
                  </div>
                  <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-200 bg-white p-2 text-center opacity-40 dark:border-neutral-800/40 dark:bg-[#1e1e1e]">
                    <span className="text-xl">💬</span>
                    <span className="mt-1 text-[8px] leading-tight font-black text-slate-400">Tutor Sebaya</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: Campus Leaderboard View (SAT points based) ─── */}
      {mainTab === 'campus' && (
        <div className="space-y-6">
          {/* Podium Grid (SAT themed) */}
          <div className="grid grid-cols-1 items-end gap-5 sm:grid-cols-3">
            {/* Rank 2 Podium */}
            {campusTop2 && (
              <div className="order-2 flex flex-col items-center sm:order-1">
                <div className="relative flex w-full flex-col items-center rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm hover:shadow-md dark:border-neutral-800/60 dark:bg-[#1e1e1e]">
                  <div className="absolute -top-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-300 font-black text-slate-800 shadow-xs">
                    2
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 font-black text-slate-400 dark:bg-neutral-800">
                    {campusTop2.name.substring(0, 2).toUpperCase()}
                  </div>
                  <h3 className="mt-2.5 text-xs font-black text-slate-800 dark:text-white">{campusTop2.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400">Level {campusTop2.level}</p>
                  <div className="mt-4 flex w-full justify-around border-t border-slate-100 pt-3 text-[9px] font-bold text-slate-400 dark:border-neutral-800">
                    <span className="flex items-center gap-0.5" title="Seminar">
                      🏫 {campusTop2.stats.seminar}
                    </span>
                    <span className="flex items-center gap-0.5" title="Workshop">
                      🛠️ {campusTop2.stats.workshop}
                    </span>
                    <span className="flex items-center gap-0.5" title="Volunteer">
                      🤝 {campusTop2.stats.volunteer}
                    </span>
                    <span className="flex items-center gap-0.5" title="Organisasi">
                      👥 {campusTop2.stats.organisasi}
                    </span>
                  </div>
                  <span className="mt-3 text-[10px] font-black text-[#ff9d00]">{campusTop2.sat} SAT</span>
                </div>
              </div>
            )}

            {/* Rank 1 Podium */}
            {campusTop1 && (
              <div className="order-1 flex flex-col items-center sm:order-2">
                <div className="relative flex w-full flex-col items-center rounded-2xl border-2 border-[#ff9d00]/20 bg-white p-6 text-center shadow-md hover:shadow-lg dark:border-[#ff9d00]/30 dark:bg-[#1e1e1e]">
                  <div className="absolute -top-4 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 font-black text-white shadow-sm ring-4 ring-amber-100 dark:ring-amber-950/40">
                    👑
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 font-black text-amber-500 dark:bg-amber-950/30">
                    {campusTop1.name.substring(0, 2).toUpperCase()}
                  </div>
                  <h3 className="mt-3 text-sm font-black text-slate-800 dark:text-white">{campusTop1.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400">Level {campusTop1.level}</p>
                  <div className="mt-4 flex w-full justify-around border-t border-slate-100 pt-3 text-[9px] font-bold text-slate-400 dark:border-neutral-800">
                    <span className="flex items-center gap-0.5" title="Seminar">
                      🏫 {campusTop1.stats.seminar}
                    </span>
                    <span className="flex items-center gap-0.5" title="Workshop">
                      🛠️ {campusTop1.stats.workshop}
                    </span>
                    <span className="flex items-center gap-0.5" title="Volunteer">
                      🤝 {campusTop1.stats.volunteer}
                    </span>
                    <span className="flex items-center gap-0.5" title="Organisasi">
                      👥 {campusTop1.stats.organisasi}
                    </span>
                  </div>
                  <span className="mt-3 text-xs font-black text-[#ff9d00]">{campusTop1.sat} SAT</span>
                </div>
              </div>
            )}

            {/* Rank 3 Podium */}
            {campusTop3 && (
              <div className="order-3 flex flex-col items-center">
                <div className="relative flex w-full flex-col items-center rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm hover:shadow-md dark:border-neutral-800/60 dark:bg-[#1e1e1e]">
                  <div className="absolute -top-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-amber-700 font-black text-white shadow-xs">
                    3
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 font-black text-slate-400 dark:bg-neutral-800">
                    {campusTop3.name.substring(0, 2).toUpperCase()}
                  </div>
                  <h3 className="mt-2.5 text-xs font-black text-slate-800 dark:text-white">{campusTop3.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400">Level {campusTop3.level}</p>
                  <div className="mt-4 flex w-full justify-around border-t border-slate-100 pt-3 text-[9px] font-bold text-slate-400 dark:border-neutral-800">
                    <span className="flex items-center gap-0.5" title="Seminar">
                      🏫 {campusTop3.stats.seminar}
                    </span>
                    <span className="flex items-center gap-0.5" title="Workshop">
                      🛠️ {campusTop3.stats.workshop}
                    </span>
                    <span className="flex items-center gap-0.5" title="Volunteer">
                      🤝 {campusTop3.stats.volunteer}
                    </span>
                    <span className="flex items-center gap-0.5" title="Organisasi">
                      👥 {campusTop3.stats.organisasi}
                    </span>
                  </div>
                  <span className="mt-3 text-[10px] font-black text-[#ff9d00]">{campusTop3.sat} SAT</span>
                </div>
              </div>
            )}
          </div>

          {/* List & Stats */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Campus Leaderboard Standing (Col-span 8) */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-8 dark:border-neutral-800/60 dark:bg-[#1e1e1e]">
              <div className="border-b border-slate-100 px-5 py-4 dark:border-neutral-800">
                <h3 className="text-xs font-black tracking-wider text-slate-400 uppercase">
                  {isIndo ? 'Daftar Peringkat Universitas Satu' : 'Universitas Satu Standings'}
                </h3>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-neutral-800">
                {campusListRanks.map((student) => {
                  const isMe = student.name.toLowerCase() === userData.name.toLowerCase()

                  return (
                    <div
                      key={student.rank}
                      className={cn(
                        'flex items-center justify-between px-5 py-4 transition-colors hover:bg-slate-50/50 dark:hover:bg-neutral-800/30',
                        isMe && 'border-l-2 border-[#ff9d00] bg-[#ff9d00]/5'
                      )}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="w-5 text-center text-xs font-bold text-slate-400">#{student.rank}</span>
                        <div className="dark:bg-neutral-850 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 font-bold text-slate-500 dark:text-neutral-400">
                          {student.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-800 dark:text-white">
                            {student.name}{' '}
                            {isMe && <span className="ml-1 text-[8px] font-black text-[#ff9d00]">(Saya)</span>}
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-neutral-500">
                            Level {student.level} • Universitas Satu
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="hidden items-center gap-4 text-[10px] font-bold text-slate-400 sm:flex">
                          <span className="flex items-center gap-0.5">🏫 {student.stats.seminar}</span>
                          <span className="flex items-center gap-0.5">🛠️ {student.stats.workshop}</span>
                          <span className="flex items-center gap-0.5">🤝 {student.stats.volunteer}</span>
                          <span className="flex items-center gap-0.5">👥 {student.stats.organisasi}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black text-[#ff9d00]">{student.sat}</p>
                          <p className="text-[8px] font-extrabold text-slate-400 uppercase">SAT</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Sidebar SAT Target (Col-span 4) */}
            <div className="lg:col-span-4">
              {myCampusRankInfo && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-neutral-800/60 dark:bg-[#1e1e1e]">
                  <h3 className="text-xs font-black tracking-wider text-slate-400 uppercase dark:text-neutral-500">
                    {isIndo ? 'Status Transkrip SAT Saya' : 'My SAT Transcript Status'}
                  </h3>

                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff9d00] to-amber-500 text-white">
                      <GraduationCapIcon size={24} weight="fill" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">
                        {isIndo ? 'Total Poin SAT' : 'Total SAT Points'}
                      </p>
                      <p className="text-lg font-black text-slate-800 dark:text-white">{myCampusRankInfo.sat} SAT</p>
                    </div>
                  </div>

                  {/* Target Completion (120 SAT target) */}
                  <div className="mt-5 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-slate-500 dark:text-neutral-400">
                        {isIndo ? 'Syarat Kelulusan' : 'Graduation Requirement'}
                      </span>
                      <span className="text-text-muted">{myCampusRankInfo.sat} / 120 SAT</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-neutral-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#ff9d00] to-amber-500 transition-all"
                        style={{ width: `${Math.min((myCampusRankInfo.sat / 120) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-[9px] font-bold text-slate-400 dark:text-neutral-500">
                      {myCampusRankInfo.sat >= 120
                        ? isIndo
                          ? '✅ Syarat kelulusan SAT terpenuhi!'
                          : '✅ SAT graduation requirement met!'
                        : isIndo
                          ? `Butuh ${120 - myCampusRankInfo.sat} SAT lagi untuk memenuhi syarat kelulusan.`
                          : `Need ${120 - myCampusRankInfo.sat} more SAT to satisfy graduation criteria.`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: SAT Points Claim & Transcript ─── */}
      {mainTab === 'sat' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Transcript List History (Col-span 8) */}
          <div className="space-y-6 lg:col-span-8">
            {/* Status Progress Header */}
            <div className="dark:border-neutral-850 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:bg-[#1e1e1e]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-white">
                    {isIndo ? 'Kemajuan Transkrip Aktivitas Siswa' : 'Student Activity Transcript Progress'}
                  </h3>
                  <p className="mt-0.5 text-[10px] text-slate-400 dark:text-neutral-500">
                    {isIndo
                      ? 'Poin SAT diakumulasikan dari keikutsertaan kegiatan di luar jam kuliah'
                      : 'SAT Points accumulated from extracurricular activity participations'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-[#ff9d00]">{approvedSatPoints}</span>
                  <span className="text-xs font-bold text-slate-400"> / 120 SAT</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-neutral-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent-blue transition-all duration-500"
                  style={{ width: `${Math.min((approvedSatPoints / 120) * 100, 100)}%` }}
                />
              </div>

              <p className="mt-2 text-[10px] font-bold text-slate-400 dark:text-neutral-500">
                {approvedSatPoints >= 120
                  ? isIndo
                    ? '🎉 Syarat kelulusan SAT terpenuhi!'
                    : '🎉 SAT graduation requirement met!'
                  : isIndo
                    ? `Kurang ${120 - approvedSatPoints} SAT lagi untuk mencapai target kelulusan.`
                    : `Short of ${120 - approvedSatPoints} SAT points to satisfy graduation.`}
              </p>
            </div>

            {/* Claims History Table */}
            <div className="dark:border-neutral-850 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:bg-[#1e1e1e]">
              <div className="border-b border-slate-100 px-5 py-4 dark:border-neutral-800">
                <h3 className="text-xs font-black tracking-wider text-slate-400 uppercase">
                  {isIndo ? 'Riwayat Pengajuan Poin SAT' : 'SAT Points Claim History'}
                </h3>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-neutral-800">
                {satClaims.map((claim) => (
                  <div
                    key={claim.id}
                    className="flex flex-col gap-3 px-5 py-4 hover:bg-slate-50/30 sm:flex-row sm:items-center sm:justify-between dark:hover:bg-neutral-800/10"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'rounded-md px-2 py-0.5 text-[9px] font-black tracking-wider uppercase',
                            claim.category === 'Seminar' && 'bg-blue-500/10 text-blue-500',
                            claim.category === 'Workshop' && 'bg-emerald-500/10 text-emerald-500',
                            claim.category === 'Volunteer' && 'bg-purple-500/10 text-purple-500',
                            claim.category === 'Organisasi' && 'bg-orange-500/10 text-orange-500',
                            claim.category === 'Lomba' && 'bg-rose-500/10 text-rose-500'
                          )}
                        >
                          {claim.category}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">{claim.date}</span>
                      </div>
                      <p className="text-xs leading-snug font-black text-slate-800 dark:text-neutral-100">
                        {claim.activityName}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-neutral-500">
                        {isIndo ? 'Penyelenggara:' : 'Organizer:'} {claim.organizer}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-5 sm:justify-end">
                      {/* Document Proof Icon */}
                      <div
                        title={claim.proofName}
                        className="flex cursor-pointer items-center gap-1 rounded bg-slate-50 px-2 py-1 text-[10px] font-bold text-slate-400 hover:bg-slate-100 dark:bg-neutral-900/60 dark:hover:bg-neutral-800"
                        onClick={() => toast.info(`${isIndo ? 'Membuka berkas' : 'Opening document'} ${claim.proofName}`)}
                      >
                        <BookOpenIcon size={12} />
                        <span className="max-w-[100px] truncate">{claim.proofName}</span>
                      </div>

                      {/* Points Display */}
                      <div className="w-14 text-center">
                        <span className="block text-sm font-black text-[#ff9d00]">+{claim.points}</span>
                        <span className="text-[7px] font-black tracking-wider text-slate-400 uppercase">SAT</span>
                      </div>

                      {/* Status Badge */}
                      <div className="w-24 text-right">
                        <span
                          className={cn(
                            'inline-block rounded-full px-2.5 py-0.5 text-[9px] font-black tracking-wide uppercase',
                            claim.status === 'approved' && 'border border-green-500/20 bg-green-500/10 text-green-500',
                            claim.status === 'pending' &&
                              'animate-pulse border border-amber-500/20 bg-amber-500/10 text-amber-500',
                            claim.status === 'rejected' && 'border border-red-500/20 bg-red-500/10 text-red-500'
                          )}
                        >
                          {claim.status === 'approved'
                            ? t('satApproved')
                            : claim.status === 'pending'
                              ? t('satPending')
                              : 'Rejected'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submission Form Portal (Col-span 4) */}
          <div className="lg:col-span-4">
            <div className="dark:border-neutral-850 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:bg-[#1e1e1e]">
              <h3 className="mb-4 text-xs font-black tracking-wider text-slate-400 uppercase dark:text-neutral-500">
                {t('satClaimTitle')}
              </h3>

              <form onSubmit={handleClaimSubmit} className="space-y-4 text-xs">
                {/* Activity Name */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-600 dark:text-neutral-300">{t('satActivityName')}</label>
                  <input
                    type="text"
                    required
                    value={actName}
                    onChange={(e) => setActName(e.target.value)}
                    placeholder={isIndo ? 'Contoh: Pelatihan Web Dev' : 'e.g., Web Dev Training'}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none focus:border-primary dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                  />
                </div>

                {/* Category Selection */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-600 dark:text-neutral-300">
                    {isIndo ? 'Kategori Kegiatan' : 'Activity Category'}
                  </label>
                  <select
                    value={actCategory}
                    onChange={(e) =>
                      setActCategory(e.target.value as 'Seminar' | 'Workshop' | 'Volunteer' | 'Organisasi' | 'Lomba')
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none focus:border-primary dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                  >
                    <option value="Seminar">{isIndo ? 'Seminar (+10 SAT)' : 'Seminar (+10 SAT)'}</option>
                    <option value="Workshop">{isIndo ? 'Workshop (+15 SAT)' : 'Workshop (+15 SAT)'}</option>
                    <option value="Volunteer">{isIndo ? 'Volunteer (+20 SAT)' : 'Volunteer (+20 SAT)'}</option>
                    <option value="Lomba">{isIndo ? 'Lomba / Kompetisi (+25 SAT)' : 'Competition (+25 SAT)'}</option>
                    <option value="Organisasi">
                      {isIndo ? 'Organisasi / Kepanitiaan (+30 SAT)' : 'Organization Committee (+30 SAT)'}
                    </option>
                  </select>
                </div>

                {/* Organizer */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-600 dark:text-neutral-300">
                    {isIndo ? 'Penyelenggara' : 'Organizer'}
                  </label>
                  <input
                    type="text"
                    required
                    value={actOrganizer}
                    onChange={(e) => setActOrganizer(e.target.value)}
                    placeholder={isIndo ? 'Contoh: Himpunan Mahasiswa' : 'e.g., Student Association'}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none focus:border-primary dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                  />
                </div>

                {/* Date */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-600 dark:text-neutral-300">
                    {isIndo ? 'Tanggal Kegiatan' : 'Activity Date'}
                  </label>
                  <input
                    type="date"
                    required
                    value={actDate}
                    onChange={(e) => setActDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none focus:border-primary dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                  />
                </div>

                {/* File proof simulated */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-600 dark:text-neutral-300">{t('satUploadProof')}</label>
                  <div
                    onClick={() => {
                      const name = prompt(
                        isIndo ? 'Masukkan nama file sertifikat Anda:' : 'Enter your certificate filename:',
                        'sertifikat_kegiatan.pdf'
                      )
                      if (name) setActFile(name)
                    }}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 py-6 transition hover:bg-slate-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
                  >
                    {actFile ? (
                      <div className="space-y-1 text-center">
                        <CheckCircleIcon size={24} className="mx-auto text-green-500" />
                        <p className="max-w-[180px] truncate font-bold text-slate-700 dark:text-white">{actFile}</p>
                        <p className="text-[9px] text-slate-400">{isIndo ? 'Klik untuk mengganti' : 'Click to change'}</p>
                      </div>
                    ) : (
                      <div className="text-center text-slate-400">
                        <UploadSimpleIcon size={24} className="mx-auto mb-1 text-slate-300" />
                        <p className="font-bold">{isIndo ? 'Klik untuk Pilih Berkas' : 'Click to Select File'}</p>
                        <p className="mt-0.5 text-[9px] text-slate-400">PDF/JPG max 5MB</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Point Estimate Preview */}
                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 font-bold dark:bg-neutral-900/60">
                  <span className="text-slate-500 dark:text-neutral-400">{t('satEstimatedPoints')}</span>
                  <span className="text-base font-black text-[#ff9d00]">+{getPointsByCategory(actCategory)} SAT</span>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full rounded-xl bg-primary px-4 py-2.5 text-center font-black tracking-wide text-white uppercase shadow-md transition hover:scale-[0.99] hover:to-amber-500 focus:outline-none"
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <PlusIcon size={14} weight="bold" />
                    {isIndo ? 'Ajukan Pengajuan' : 'Submit Claim'}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
