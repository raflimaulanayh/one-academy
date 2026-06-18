'use client'

import { useDashboard } from '@/context/dashboard-context'
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  InfoIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CaretDownIcon,
  SlidersHorizontalIcon,
  UserIcon
} from '@phosphor-icons/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

import { cn } from '@/utils'

export interface ScheduleEvent {
  id: string
  code: string
  title: string
  mode: 'F2F' | 'FIN' | 'OL'
  type: string
  time: string
  location: string
  seat?: string
  badge: 'class' | 'exam'
}

const MOCK_EVENTS: Record<string, ScheduleEvent[]> = {
  '2026-06-18': [
    {
      id: 'e1',
      code: 'BA05 - LAB',
      title: 'Pemrograman Front-End Web',
      mode: 'F2F',
      type: 'Session 13',
      time: '13:20 - 15:00 GMT+7',
      location: 'Kampus Utama Universitas Satu - B302',
      badge: 'class'
    },
    {
      id: 'e2',
      code: 'BA05 - LAB',
      title: 'Office Automation Industri Kreatif',
      mode: 'F2F',
      type: 'Session 13',
      time: '15:20 - 17:00 GMT+7',
      location: 'Kampus Utama Universitas Satu - B204',
      badge: 'class'
    }
  ],
  '2026-06-22': [
    {
      id: 'e3',
      code: 'BA05 - LEC',
      title: 'Pemrograman Front-End Web',
      mode: 'F2F',
      type: 'Session 14',
      time: '09:00 - 10:40 GMT+7',
      location: 'Kampus Utama Universitas Satu - B302',
      badge: 'class'
    }
  ],
  '2026-06-23': [
    {
      id: 'e4',
      code: 'BA05 - LAB',
      title: 'Basis Data',
      mode: 'F2F',
      type: 'Session 13',
      time: '11:00 - 12:40 GMT+7',
      location: 'Kampus Utama Universitas Satu - B203',
      badge: 'class'
    }
  ],
  '2026-06-24': [
    {
      id: 'e5',
      code: 'BA05 - LEC',
      title: 'Basis Data',
      mode: 'F2F',
      type: 'Session 14',
      time: '13:20 - 15:00 GMT+7',
      location: 'Kampus Utama Universitas Satu - B304',
      badge: 'class'
    }
  ],
  '2026-06-25': [
    {
      id: 'e6',
      code: 'LA05 - LEC',
      title: 'Office Automation Industri Kreatif',
      mode: 'FIN',
      type: 'THEORY: FINAL EXAM',
      time: '15:00 - 16:40 GMT+7',
      location: '1BNDUNG - B201',
      seat: 'Seat 6',
      badge: 'exam'
    }
  ],
  '2026-06-26': [
    {
      id: 'e7',
      code: 'LA05 - LEC',
      title: 'Pemrograman Front-End Web',
      mode: 'FIN',
      type: 'THEORY: FINAL EXAM',
      time: '13:20 - 15:00 GMT+7',
      location: '1BNDUNG - B201',
      seat: 'Seat 6',
      badge: 'exam'
    }
  ],
  '2026-06-29': [
    {
      id: 'e8',
      code: 'LA05 - LEC',
      title: 'Basis Data',
      mode: 'FIN',
      type: 'THEORY: FINAL EXAM',
      time: '09:00 - 10:40 GMT+7',
      location: '1BNDUNG - B202',
      seat: 'Seat 12',
      badge: 'exam'
    }
  ],
  '2026-06-30': [
    {
      id: 'e9',
      code: 'LA05 - LEC',
      title: 'Character Building: Kewarganegaraan',
      mode: 'FIN',
      type: 'THEORY: FINAL EXAM',
      time: '11:00 - 12:40 GMT+7',
      location: '1BNDUNG - B203',
      seat: 'Seat 18',
      badge: 'exam'
    }
  ]
}

const MONTH_NAMES_ID = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember'
]

const MONTH_NAMES_EN = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

const DAY_NAMES_SHORT_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAY_NAMES_SHORT_ID = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

export function ScheduleTab() {
  const t = useTranslations('Dashboard')
  const { currentLang } = useDashboard()

  const isIndo = currentLang === 'id'
  const months = isIndo ? MONTH_NAMES_ID : MONTH_NAMES_EN
  const daysShort = isIndo ? DAY_NAMES_SHORT_ID : DAY_NAMES_SHORT_EN

  // Default initial date: Thursday, June 18, 2026
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 5, 18))
  const [viewDate, setViewDate] = useState<Date>(new Date(2026, 5, 1))
  const [isSyncing, setIsSyncing] = useState(false)
  const [isSynced, setIsSynced] = useState(true) // Start synced as "Unsync Outlook" is visible in mock
  const [filterType, setFilterType] = useState<'all' | 'class' | 'exam'>('all')
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false)

  const todayDate = new Date(2026, 5, 18) // Simulated Today

  const currentYear = viewDate.getFullYear()
  const currentMonth = viewDate.getMonth()

  // Helper to format date key: YYYY-MM-DD
  const formatDateKey = (date: Date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')

    return `${y}-${m}-${d}`
  }

  // Get active events for selected date
  const dateKey = formatDateKey(selectedDate)
  const allEventsForDate = MOCK_EVENTS[dateKey] || []
  const filteredEvents = allEventsForDate.filter((e) => {
    if (filterType === 'class') return e.badge === 'class'
    if (filterType === 'exam') return e.badge === 'exam'

    return true
  })

  // Generate calendar days
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
  const getStartDayOfWeek = (year: number, month: number) => new Date(year, month, 1).getDay()

  const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth)
  const daysInPrevMonth = getDaysInMonth(currentYear, currentMonth - 1)
  const startDayOfWeek = getStartDayOfWeek(currentYear, currentMonth)

  const calendarCells: { date: Date; isCurrentMonth: boolean }[] = []

  // Prev month padding
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i
    const d = new Date(currentYear, currentMonth - 1, day)
    calendarCells.push({ date: d, isCurrentMonth: false })
  }

  // Current month days
  for (let i = 1; i <= daysInCurrentMonth; i++) {
    const d = new Date(currentYear, currentMonth, i)
    calendarCells.push({ date: d, isCurrentMonth: true })
  }

  // Next month padding (fill up to 35 or 42 cells depending on layout size)
  const totalCellsNeeded = calendarCells.length > 35 ? 42 : 35
  const nextMonthDaysCount = totalCellsNeeded - calendarCells.length
  for (let i = 1; i <= nextMonthDaysCount; i++) {
    const d = new Date(currentYear, currentMonth + 1, i)
    calendarCells.push({ date: d, isCurrentMonth: false })
  }

  const handlePrevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1))
  }

  const handleNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1))
  }

  const handleToday = () => {
    setSelectedDate(todayDate)
    setViewDate(new Date(todayDate.getFullYear(), todayDate.getMonth(), 1))
  }

  const handleSyncToggle = () => {
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
      setIsSynced(!isSynced)
      toast.success(
        !isSynced
          ? isIndo
            ? 'Sinkronisasi Outlook berhasil diaktifkan!'
            : 'Outlook sync successfully enabled!'
          : isIndo
            ? 'Sinkronisasi Outlook berhasil dihapus!'
            : 'Outlook sync successfully removed!'
      )
    }, 1000)
  }

  const getDayString = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const daysId = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

    return isIndo ? daysId[date.getDay()] : days[date.getDay()]
  }

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-neutral-100">{t('scheduleTitle')}</h1>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <button
            onClick={() => toast.info(isIndo ? 'Membuka Kalender Akademik...' : 'Opening Academic Calendar...')}
            className="text-slate-500 hover:text-primary hover:underline dark:text-neutral-400 dark:hover:text-secondary"
          >
            {t('viewAcademicCalendar')}
          </button>
          <span className="h-3.5 w-[1px] bg-slate-300 dark:bg-neutral-800" />
          <button
            onClick={handleSyncToggle}
            disabled={isSyncing}
            className="text-[#008ae3] hover:text-[#006eb5] hover:underline disabled:opacity-50 dark:text-secondary dark:hover:text-[#00b0ff]"
          >
            {isSyncing ? (
              <span className="inline-block animate-pulse">Processing...</span>
            ) : isSynced ? (
              t('unsyncOutlook')
            ) : (
              t('syncOutlook')
            )}
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left column: Daily Schedule Events List (Col-span 8) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-8 dark:border-neutral-800/60 dark:bg-[#1e1e1e]">
          {/* Controls Bar */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              {/* Today Button */}
              <button
                onClick={handleToday}
                className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200 active:scale-98 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              >
                {t('scheduleToday')}
              </button>

              {/* Prev / Next Arrows */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    const prevDay = new Date(selectedDate)
                    prevDay.setDate(prevDay.getDate() - 1)
                    setSelectedDate(prevDay)
                    setViewDate(new Date(prevDay.getFullYear(), prevDay.getMonth(), 1))
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200 active:scale-95 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                >
                  <CaretLeftIcon size={14} weight="bold" />
                </button>
                <button
                  onClick={() => {
                    const nextDay = new Date(selectedDate)
                    nextDay.setDate(nextDay.getDate() + 1)
                    setSelectedDate(nextDay)
                    setViewDate(new Date(nextDay.getFullYear(), nextDay.getMonth(), 1))
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200 active:scale-95 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                >
                  <CaretRightIcon size={14} weight="bold" />
                </button>
              </div>

              {/* Current Month Name Dropdown Trigger */}
              <div className="flex items-center gap-1 text-sm font-bold text-slate-800 dark:text-neutral-200">
                <span>
                  {months[currentMonth]} {currentYear}
                </span>
                <CaretDownIcon size={14} className="text-slate-500" />
              </div>
            </div>

            {/* Filter Toggle */}
            <div className="relative">
              <button
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
              >
                <SlidersHorizontalIcon size={18} />
              </button>

              {isFilterDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsFilterDropdownOpen(false)} />
                  <div className="absolute right-0 z-20 mt-2 w-44 rounded-xl border border-slate-100 bg-white p-1.5 shadow-lg dark:border-neutral-800/80 dark:bg-[#181818]">
                    <button
                      onClick={() => {
                        setFilterType('all')
                        setIsFilterDropdownOpen(false)
                      }}
                      className={cn(
                        'w-full rounded-lg px-3 py-2 text-left text-xs font-bold transition-colors',
                        filterType === 'all'
                          ? 'bg-primary/10 text-primary dark:bg-secondary/15 dark:text-secondary'
                          : 'text-slate-600 hover:bg-slate-50 dark:text-neutral-400 dark:hover:bg-neutral-800/60'
                      )}
                    >
                      {isIndo ? 'Semua Jadwal' : 'All Schedules'}
                    </button>
                    <button
                      onClick={() => {
                        setFilterType('class')
                        setIsFilterDropdownOpen(false)
                      }}
                      className={cn(
                        'w-full rounded-lg px-3 py-2 text-left text-xs font-bold transition-colors',
                        filterType === 'class'
                          ? 'bg-primary/10 text-primary dark:bg-secondary/15 dark:text-secondary'
                          : 'text-slate-600 hover:bg-slate-50 dark:text-neutral-400 dark:hover:bg-neutral-800/60'
                      )}
                    >
                      {isIndo ? 'Hanya Kelas' : 'Classes Only'}
                    </button>
                    <button
                      onClick={() => {
                        setFilterType('exam')
                        setIsFilterDropdownOpen(false)
                      }}
                      className={cn(
                        'w-full rounded-lg px-3 py-2 text-left text-xs font-bold transition-colors',
                        filterType === 'exam'
                          ? 'bg-primary/10 text-primary dark:bg-secondary/15 dark:text-secondary'
                          : 'text-slate-600 hover:bg-slate-50 dark:text-neutral-400 dark:hover:bg-neutral-800/60'
                      )}
                    >
                      {isIndo ? 'Hanya Ujian' : 'Exams Only'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Schedule List */}
          <div className="space-y-6">
            {filteredEvents.length > 0 ? (
              <div className="flex gap-6">
                {/* Left Side: Day & Date Badge */}
                <div className="flex shrink-0 flex-col items-center pt-1">
                  <span className="text-xs font-bold tracking-wide text-slate-400 uppercase">
                    {getDayString(selectedDate)}
                  </span>
                  <span className="text-3xl font-black text-slate-800 dark:text-neutral-100">{selectedDate.getDate()}</span>
                  {filteredEvents.length > 1 && <div className="mt-4 w-[1.5px] flex-1 bg-slate-100 dark:bg-neutral-800" />}
                </div>

                {/* Right Side: List of sessions for this day */}
                <div className="flex-1 space-y-6">
                  {filteredEvents.map((event, idx) => (
                    <div
                      key={event.id}
                      className={cn(
                        'relative flex flex-col justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-5 transition-all hover:shadow-sm md:flex-row md:items-center dark:border-neutral-800/40 dark:bg-[#1a1a1a]/60',
                        idx > 0 && 'border-t border-slate-100 pt-6 dark:border-neutral-800/50'
                      )}
                    >
                      <div className="space-y-3.5">
                        {/* Course Header */}
                        <div>
                          <span className="text-xs font-extrabold tracking-wider text-slate-500 uppercase dark:text-neutral-400">
                            {event.code}
                          </span>
                          <h3 className="mt-0.5 text-base font-black text-slate-800 dark:text-neutral-100">{event.title}</h3>
                        </div>

                        {/* Meeting Metadata Grid */}
                        <div className="grid grid-cols-1 gap-2.5 text-xs font-semibold text-slate-500 sm:grid-cols-2 dark:text-neutral-400">
                          {/* Delivery Mode (F2F/FIN) */}
                          <div className="flex items-center gap-2">
                            <InfoIcon size={16} className="text-slate-400" />
                            <span>{event.mode}</span>
                          </div>

                          {/* Session Info / Exam Type */}
                          <div className="flex items-center gap-2">
                            {event.badge === 'exam' ? (
                              <div className="flex h-4 w-4 items-center justify-center rounded-full border border-slate-400 text-[9px] font-black text-slate-400 uppercase">
                                T
                              </div>
                            ) : (
                              <ClockIcon size={16} className="text-slate-400" />
                            )}
                            <span className="capitalize">{event.type}</span>
                          </div>

                          {/* Timing */}
                          <div className="flex items-center gap-2">
                            <ClockIcon size={16} className="text-slate-400" />
                            <span>{event.time}</span>
                          </div>

                          {/* Classroom Location */}
                          <div className="flex items-center gap-2">
                            <MapPinIcon size={16} className="text-slate-400" />
                            <span className="truncate">{event.location}</span>
                          </div>

                          {/* Seat No (Only for Exam) */}
                          {event.seat && (
                            <div className="flex items-center gap-2 sm:col-span-2">
                              <UserIcon size={16} className="text-slate-400" />
                              <span>{isIndo ? `Kursi ${event.seat.replace('Seat ', '')}` : event.seat}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Onsite Badge Pill */}
                      <div className="shrink-0 self-start md:self-center">
                        <span
                          className={cn(
                            'inline-block rounded-full px-4 py-1.5 text-xs font-black tracking-wide',
                            event.badge === 'exam'
                              ? 'border border-red-500/30 bg-red-500/5 text-red-500 dark:border-red-500/40'
                              : 'border border-slate-400 bg-slate-100 text-slate-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                          )}
                        >
                          {event.badge === 'exam' ? t('onsiteExam') : t('onsiteClass')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-slate-400 dark:bg-neutral-800/40 dark:text-neutral-500">
                  <CalendarIcon size={28} />
                </div>
                <p className="max-w-xs text-xs font-bold text-slate-500 dark:text-neutral-400">{t('noSchedule')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Interactive Monthly Calendar Card (Col-span 4) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-4 dark:border-neutral-800/60 dark:bg-[#1e1e1e]">
          {/* Calendar Header */}
          <div className="mb-4 flex items-center justify-between px-1">
            <h2 className="text-sm font-black text-slate-800 dark:text-neutral-200">
              {months[currentMonth]} {currentYear}
            </h2>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                className="flex h-7 w-7 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
              >
                <CaretLeftIcon size={14} weight="bold" />
              </button>
              <button
                onClick={handleNextMonth}
                className="flex h-7 w-7 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
              >
                <CaretRightIcon size={14} weight="bold" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div>
            {/* Weekday Names */}
            <div className="mb-2 grid grid-cols-7 text-center text-[10px] font-black tracking-wider text-slate-400 uppercase">
              {daysShort.map((day) => (
                <div key={day} className="py-1">
                  {day[0]}
                </div>
              ))}
            </div>

            {/* Days Cells */}
            <div className="grid grid-cols-7 gap-y-1 text-center">
              {calendarCells.map(({ date, isCurrentMonth }, idx) => {
                const dateKey = formatDateKey(date)
                const hasEvents = !!MOCK_EVENTS[dateKey]
                const isSelected = formatDateKey(selectedDate) === dateKey
                const isToday = formatDateKey(todayDate) === dateKey

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedDate(date)
                      if (date.getMonth() !== currentMonth) {
                        setViewDate(new Date(date.getFullYear(), date.getMonth(), 1))
                      }
                    }}
                    className="group relative flex flex-col items-center justify-center py-2 focus:outline-none"
                  >
                    <div
                      className={cn(
                        'relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all',
                        // Selection style (solid primary theme circle)
                        isSelected
                          ? 'bg-primary text-white shadow-sm dark:bg-[#008ae3]'
                          : isToday
                            ? 'bg-slate-100 font-extrabold text-slate-900 dark:bg-neutral-800 dark:text-white'
                            : isCurrentMonth
                              ? 'text-slate-800 hover:bg-slate-50 dark:text-neutral-200 dark:hover:bg-neutral-800/50'
                              : 'text-slate-300 hover:bg-slate-50/50 dark:text-neutral-600 dark:hover:bg-neutral-800/20'
                      )}
                    >
                      {date.getDate()}
                    </div>

                    {/* Dot indicators underneath the day number */}
                    {hasEvents && (
                      <div className="absolute bottom-0.5 left-1/2 z-20 flex -translate-x-1/2 items-center justify-center">
                        <span
                          className={cn(
                            'h-[4px] w-[4px] rounded-full',
                            isToday
                              ? 'bg-green-500' // Today event green dot
                              : isSelected
                                ? 'bg-white' // Selected event white dot
                                : 'bg-red-500' // Standard event red dot
                          )}
                        />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
