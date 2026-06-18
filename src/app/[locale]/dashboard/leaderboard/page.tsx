'use client'

import { useDashboard } from '@/context/dashboard-context'
import {
  TrophyIcon,
  FlameIcon,
  SparkleIcon,
  BookOpenIcon,
  ChatCircleDotsIcon,
  CalendarCheckIcon,
  CaretUpIcon,
  CaretDownIcon,
  MinusIcon
} from '@phosphor-icons/react'
import { useState } from 'react'

import { cn } from '@/utils'

// Mock Leaderboard Data per Course
interface StudentRank {
  rank: number
  name: string
  xp: number
  level: number
  badges: string[]
  streak: number
  stats: {
    attendance: number // XP from attendance
    forum: number // XP from forum keaktifan
    assignments: number // XP from tasks/assignments
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
      name: 'Siswa Teladan', // Will be dynamic if matches user name
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

export default function LeaderboardPage() {
  const { userData, currentLang } = useDashboard()

  const [activeTab, setActiveTab] = useState<'monthly' | 'alltime'>('monthly')
  const [activeCourse, setActiveCourse] = useState<'all' | 'char'>('all')

  if (!userData) return null

  // Ensure current user is mapped correctly in our mock dataset
  const rawData = MOCK_LEADERBOARD_DATA[activeCourse] || MOCK_LEADERBOARD_DATA.all
  const ranks = rawData.map((rank) => {
    if (rank.name === 'Siswa Teladan') {
      return { ...rank, name: userData.name }
    }

    return rank
  })

  // Top 3 for Podium
  const top1 = ranks.find((r) => r.rank === 1)
  const top2 = ranks.find((r) => r.rank === 2)
  const top3 = ranks.find((r) => r.rank === 3)

  // Remaining ranks (4+)
  const listRanks = ranks.filter((r) => r.rank > 3)

  // Current user's statistics details
  const myRankInfo = ranks.find((r) => r.name.toLowerCase() === userData.name.toLowerCase())

  // Mock available courses
  const courseOptions = [
    { key: 'all', label: currentLang === 'id' ? 'Semua Mata Kuliah' : 'All Courses' },
    { key: 'char', label: 'Character Building (CHAR6002)' }
  ]

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800/60">
        <div>
          <h1 className="text-xl font-black tracking-tight text-[#333] sm:text-2xl dark:text-white">
            {currentLang === 'id' ? 'Papan Peringkat Kelas' : 'Class Leaderboard'}
          </h1>
          <p className="mt-1 text-xs text-text-muted">
            {currentLang === 'id'
              ? 'Tingkatkan keaktifan belajar Anda dan raih peringkat teratas di kelas!'
              : 'Boost your learning activity and reach the top spot in class!'}
          </p>
        </div>

        {/* Tab & Course Toggles */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Course Selector */}
          <select
            value={activeCourse}
            onChange={(e) => setActiveCourse(e.target.value as 'all' | 'char')}
            className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-text-dark shadow-sm transition-all outline-none focus:border-primary dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
          >
            {courseOptions.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Timeframe Toggle */}
          <div className="flex rounded-full bg-slate-100 p-0.5 dark:bg-neutral-800">
            <button
              onClick={() => setActiveTab('monthly')}
              className={cn(
                'rounded-full px-3.5 py-1 text-xs font-bold transition-all',
                activeTab === 'monthly'
                  ? 'bg-white text-text-dark shadow-xs dark:bg-neutral-700 dark:text-white'
                  : 'text-text-muted hover:text-text-dark dark:hover:text-white'
              )}
            >
              {currentLang === 'id' ? 'Bulan Ini' : 'Monthly'}
            </button>
            <button
              onClick={() => setActiveTab('alltime')}
              className={cn(
                'rounded-full px-3.5 py-1 text-xs font-bold transition-all',
                activeTab === 'alltime'
                  ? 'bg-white text-text-dark shadow-xs dark:bg-neutral-700 dark:text-white'
                  : 'text-text-muted hover:text-text-dark dark:hover:text-white'
              )}
            >
              {currentLang === 'id' ? 'Semua' : 'All-Time'}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Top 3 Podium Cards ─── */}
      <div className="grid grid-cols-1 items-end gap-5 sm:grid-cols-3">
        {/* Rank 2 (Silver) */}
        {top2 && (
          <div className="order-2 flex flex-col items-center sm:order-1">
            <div className="relative flex w-full flex-col items-center rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition-all hover:shadow-md dark:border-neutral-800/60 dark:bg-[#1e1e1e]">
              {/* Silver Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-100 px-3 py-0.5 text-[10px] font-black text-slate-500 ring-4 ring-white dark:bg-neutral-800 dark:ring-[#1e1e1e]">
                RANK 2
              </div>
              <div className="mt-2 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 ring-2 ring-slate-300 dark:bg-neutral-800 dark:ring-neutral-600">
                <span className="text-lg font-black text-slate-500">{top2.name.substring(0, 2).toUpperCase()}</span>
              </div>
              <h3 className="mt-3 text-sm font-black text-slate-800 dark:text-white">{top2.name}</h3>
              <p className="text-[10px] text-slate-400">Level {top2.level}</p>

              {/* Streak */}
              {top2.streak > 0 && (
                <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-0.5 text-[9px] font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                  <FlameIcon size={12} weight="fill" />
                  <span>{top2.streak} Harian</span>
                </div>
              )}

              {/* XP Pill */}
              <div className="mt-4 rounded-full bg-slate-50 px-4 py-1 text-xs font-black text-slate-600 dark:bg-neutral-900/50 dark:text-neutral-300">
                {top2.xp} XP
              </div>
            </div>
            {/* Virtual Silver Podium block */}
            <div className="hidden h-16 w-full rounded-t-xl bg-slate-100 sm:block dark:bg-neutral-900/60" />
          </div>
        )}

        {/* Rank 1 (Gold - Central Highlight) */}
        {top1 && (
          <div className="order-1 flex flex-col items-center sm:order-2">
            <div className="relative flex w-full flex-col items-center rounded-2xl border-2 border-yellow-400 bg-gradient-to-b from-yellow-50/20 to-white p-6 text-center shadow-md transition-all hover:shadow-lg dark:from-yellow-500/5 dark:to-[#1e1e1e]">
              {/* Crown Icon */}
              <div className="absolute -top-7 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 text-yellow-950 shadow-md ring-4 ring-white dark:ring-[#121212]">
                <TrophyIcon size={20} weight="fill" />
              </div>
              <div className="absolute top-4 right-4 animate-pulse text-yellow-600">
                <SparkleIcon size={18} weight="fill" />
              </div>

              {/* Gold Badge */}
              <div className="mt-1 rounded-full bg-yellow-400/15 px-3 py-0.5 text-[10px] font-black text-yellow-700 dark:text-yellow-400">
                CHAMPION
              </div>

              <div className="mt-4 flex h-18 w-18 items-center justify-center rounded-full bg-yellow-100 ring-4 ring-yellow-400 dark:bg-yellow-950/30">
                <span className="text-xl font-black text-yellow-600 dark:text-yellow-400">
                  {top1.name.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <h3 className="mt-3 text-base font-black text-slate-800 dark:text-white">{top1.name}</h3>
              <p className="text-[10px] text-slate-400">Level {top1.level}</p>

              {/* Streak */}
              {top1.streak > 0 && (
                <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-0.5 text-[9px] font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                  <FlameIcon size={12} weight="fill" />
                  <span>{top1.streak} Hari Streak</span>
                </div>
              )}

              {/* XP Pill */}
              <div className="mt-4 rounded-full bg-yellow-400/20 px-5 py-1.5 text-xs font-black text-yellow-700 dark:text-yellow-400">
                {top1.xp} XP
              </div>
            </div>
            {/* Virtual Gold Podium block */}
            <div className="hidden h-24 w-full rounded-t-xl bg-yellow-400/10 sm:block dark:bg-yellow-400/5" />
          </div>
        )}

        {/* Rank 3 (Bronze) */}
        {top3 && (
          <div className="order-3 flex flex-col items-center">
            <div className="relative flex w-full flex-col items-center rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition-all hover:shadow-md dark:border-neutral-800/60 dark:bg-[#1e1e1e]">
              {/* Bronze Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#f6ebdd] px-3 py-0.5 text-[10px] font-black text-[#a05a2c] ring-4 ring-white dark:bg-[#382618] dark:ring-[#1e1e1e]">
                RANK 3
              </div>
              <div className="mt-2 flex h-14 w-14 items-center justify-center rounded-full bg-[#f6ebdd]/45 ring-2 ring-[#c084fc]/30 dark:bg-[#382618]/20 dark:ring-amber-800/40">
                <span className="text-lg font-black text-[#a05a2c]">{top3.name.substring(0, 2).toUpperCase()}</span>
              </div>
              <h3 className="mt-3 text-sm font-black text-slate-800 dark:text-white">{top3.name}</h3>
              <p className="text-[10px] text-slate-400">Level {top3.level}</p>

              {/* Streak */}
              {top3.streak > 0 && (
                <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-0.5 text-[9px] font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                  <FlameIcon size={12} weight="fill" />
                  <span>{top3.streak} Harian</span>
                </div>
              )}

              {/* XP Pill */}
              <div className="mt-4 rounded-full bg-slate-50 px-4 py-1 text-xs font-black text-slate-600 dark:bg-neutral-900/50 dark:text-neutral-300">
                {top3.xp} XP
              </div>
            </div>
            {/* Virtual Bronze Podium block */}
            <div className="hidden h-10 w-full rounded-t-xl bg-slate-100/50 sm:block dark:bg-neutral-900/40" />
          </div>
        )}
      </div>

      {/* ─── Grid: Leaderboard List & Badge Showcase ─── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Ranks 4+ List */}
        <div className="space-y-3 lg:col-span-2">
          <h2 className="text-xs font-black tracking-wider text-slate-400 uppercase dark:text-neutral-500">
            {currentLang === 'id' ? 'Daftar Peringkat' : 'Leaderboard Standings'}
          </h2>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-neutral-800/60 dark:bg-[#1e1e1e]">
            <div className="divide-y divide-slate-100 dark:divide-neutral-800/60">
              {listRanks.map((student) => {
                const isCurrentUser = student.name.toLowerCase() === userData.name.toLowerCase()

                return (
                  <div
                    key={student.rank}
                    className={cn(
                      'flex items-center justify-between gap-4 px-4 py-3.5 transition-colors',
                      isCurrentUser
                        ? 'border-l-4 border-primary bg-primary/[0.02] dark:border-secondary dark:bg-secondary/[0.02]'
                        : 'hover:bg-slate-50/40 dark:hover:bg-neutral-800/20'
                    )}
                  >
                    {/* Rank & Indicator */}
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 text-center text-xs font-extrabold text-slate-400 dark:text-neutral-500">
                        #{student.rank}
                      </span>
                      {/* Rank Change Indicator */}
                      <span className="flex items-center">
                        {student.rankChange === 'up' && <CaretUpIcon size={12} weight="bold" className="text-emerald-500" />}
                        {student.rankChange === 'down' && (
                          <CaretDownIcon size={12} weight="bold" className="text-rose-500" />
                        )}
                        {student.rankChange === 'stable' && (
                          <MinusIcon size={12} weight="bold" className="text-slate-300 dark:text-neutral-600" />
                        )}
                      </span>
                    </div>

                    {/* Student Info */}
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[11px] font-black text-slate-600 dark:bg-neutral-800 dark:text-neutral-300">
                        {student.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-xs font-black text-slate-800 dark:text-white">{student.name}</p>
                          {isCurrentUser && (
                            <span className="rounded bg-primary/10 px-1.5 py-px text-[7px] font-bold text-primary dark:bg-secondary/15 dark:text-secondary">
                              Anda
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[9px] text-slate-400">
                          <span>Lvl {student.level}</span>
                          <span>•</span>
                          <span className="truncate">
                            {student.badges.slice(0, 1).join(', ')}
                            {student.badges.length > 1 && ` +${student.badges.length - 1}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats breakdowns (Desktop/Large Screen) */}
                    <div className="hidden items-center gap-6 sm:flex">
                      {/* Attendance XP */}
                      <div className="flex flex-col items-center text-center">
                        <span className="flex items-center gap-0.5 text-[9px] font-semibold text-slate-400 uppercase">
                          <CalendarCheckIcon size={10} />
                          Hadir
                        </span>
                        <span className="text-[11px] font-extrabold text-slate-600 dark:text-neutral-300">
                          {student.stats.attendance}
                        </span>
                      </div>

                      {/* Forum XP */}
                      <div className="flex flex-col items-center text-center">
                        <span className="flex items-center gap-0.5 text-[9px] font-semibold text-slate-400 uppercase">
                          <ChatCircleDotsIcon size={10} />
                          Forum
                        </span>
                        <span className="text-[11px] font-extrabold text-slate-600 dark:text-neutral-300">
                          {student.stats.forum}
                        </span>
                      </div>

                      {/* Assignments XP */}
                      <div className="flex flex-col items-center text-center">
                        <span className="flex items-center gap-0.5 text-[9px] font-semibold text-slate-400 uppercase">
                          <BookOpenIcon size={10} />
                          Tugas
                        </span>
                        <span className="text-[11px] font-extrabold text-slate-600 dark:text-neutral-300">
                          {student.stats.assignments}
                        </span>
                      </div>
                    </div>

                    {/* Total XP Score */}
                    <div className="text-right">
                      <p className="text-xs font-black text-slate-800 dark:text-white">{student.xp}</p>
                      <p className="text-[8px] font-extrabold tracking-wider text-slate-400 uppercase">XP</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Gamified Achievements / Badges Panel */}
        <div className="space-y-4">
          {/* My Stats Card */}
          {myRankInfo && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-neutral-800/60 dark:bg-[#1e1e1e]">
              <h3 className="text-xs font-black tracking-wider text-slate-400 uppercase dark:text-neutral-500">
                {currentLang === 'id' ? 'Status Keaktifan Saya' : 'My Activity Status'}
              </h3>

              <div className="mt-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent-blue text-white">
                  <TrophyIcon size={24} weight="fill" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Peringkat Kelas</p>
                  <p className="text-lg font-black text-slate-800 dark:text-white">#{myRankInfo.rank}</p>
                </div>
              </div>

              {/* Progress bar to next level */}
              <div className="mt-5 space-y-1.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-slate-500 dark:text-neutral-400">Level {myRankInfo.level}</span>
                  <span className="text-text-muted">{myRankInfo.xp} / 1100 XP</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-neutral-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent-blue transition-all"
                    style={{ width: `${(myRankInfo.xp / 1100) * 100}%` }}
                  />
                </div>
                <p className="text-[9px] text-slate-400 dark:text-neutral-500">
                  {currentLang === 'id'
                    ? `Butuh ${1100 - myRankInfo.xp} XP lagi untuk naik ke Level ${myRankInfo.level + 1}`
                    : `Need ${1100 - myRankInfo.xp} more XP to reach Level ${myRankInfo.level + 1}`}
                </p>
              </div>

              {/* XP Breakdown list */}
              <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-4 dark:border-neutral-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-500 dark:text-neutral-400">
                    <CalendarCheckIcon size={14} className="text-green-500" />
                    {currentLang === 'id' ? 'Presensi Mandiri' : 'Self-Attendance'}
                  </span>
                  <span className="font-extrabold text-slate-800 dark:text-white">+{myRankInfo.stats.attendance} XP</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-500 dark:text-neutral-400">
                    <ChatCircleDotsIcon size={14} className="text-primary dark:text-secondary" />
                    {currentLang === 'id' ? 'Keaktifan Forum' : 'Forum Discussion'}
                  </span>
                  <span className="font-extrabold text-slate-800 dark:text-white">+{myRankInfo.stats.forum} XP</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-500 dark:text-neutral-400">
                    <BookOpenIcon size={14} className="text-amber-500" />
                    {currentLang === 'id' ? 'Penyelesaian Modul' : 'Module Completions'}
                  </span>
                  <span className="font-extrabold text-slate-800 dark:text-white">+{myRankInfo.stats.assignments} XP</span>
                </div>
              </div>
            </div>
          )}

          {/* Badges Cabinet */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-neutral-800/60 dark:bg-[#1e1e1e]">
            <h3 className="text-xs font-black tracking-wider text-slate-400 uppercase dark:text-neutral-500">
              {currentLang === 'id' ? 'Kabinet Lencana Saya' : 'My Badges'}
            </h3>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {/* Badge 1 */}
              <div className="flex flex-col items-center rounded-xl bg-slate-50 p-2 text-center dark:bg-neutral-900/50">
                <span className="text-xl">📅</span>
                <span className="mt-1 text-[8px] leading-tight font-black text-slate-800 dark:text-white">Absensi Emas</span>
                <span className="mt-0.5 text-[7px] text-slate-400">Streak 5 hari</span>
              </div>

              {/* Badge 2 */}
              <div className="flex flex-col items-center rounded-xl bg-slate-50 p-2 text-center dark:bg-neutral-900/50">
                <span className="text-xl">🎓</span>
                <span className="mt-1 text-[8px] leading-tight font-black text-slate-800 dark:text-white">
                  Homework Hero
                </span>
                <span className="mt-0.5 text-[7px] text-slate-400">Tepat waktu</span>
              </div>

              {/* Badge 3 (Locked) */}
              <div className="dark:border-neutral-850 flex flex-col items-center rounded-xl border border-dashed border-slate-200 bg-white p-2 text-center opacity-40 dark:bg-[#1e1e1e]">
                <span className="text-xl">💬</span>
                <span className="mt-1 text-[8px] leading-tight font-black text-slate-400">Tutor Sebaya</span>
                <span className="mt-0.5 text-[7px] text-slate-400">Terkunci</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
