'use client'

import { useDashboard } from '@/context/dashboard-context'
import { ChartBarIcon, CaretDownIcon } from '@phosphor-icons/react'
import { useTranslations } from 'next-intl'
import { RefObject } from 'react'

import { cn } from '@/utils'

import type { CourseModule } from './types'

type ProgressData = { class: number; student: number }

type Props = {
  activeModules: CourseModule[]
  selectedSemester: string
  setSelectedSemester: (val: string) => void
  selectedSession: string
  setSelectedSession: (val: string) => void
  isSemDropdownOpen: boolean
  setIsSemDropdownOpen: (val: boolean) => void
  isSesDropdownOpen: boolean
  setIsSesDropdownOpen: (val: boolean) => void
  semRef: RefObject<HTMLDivElement | null>
  sesRef: RefObject<HTMLDivElement | null>
  mockProgressMap: Record<number, ProgressData>
}

export function ProgressCard({
  activeModules,
  selectedSemester,
  setSelectedSemester,
  selectedSession,
  setSelectedSession,
  isSemDropdownOpen,
  setIsSemDropdownOpen,
  isSesDropdownOpen,
  setIsSesDropdownOpen,
  semRef,
  sesRef,
  mockProgressMap
}: Props) {
  const t = useTranslations('Dashboard')
  const { userData } = useDashboard()
  const tier = userData?.tier || 'univ'
  const isUniv = tier === 'univ'

  const getSessionLabel = (opt: string) => {
    if (opt === 'all') return t('sessionsAll')
    if (opt === 'lectures') {
      return isUniv ? t('sessionsLectures') : t('sessionsLectures').replace('Lectures', 'Theory')
    }
    // opt === 'labs'

    return isUniv
      ? t('sessionsLabs')
      : t('sessionsLabs').replace('Labs Only', 'Practical Only').replace('Hanya Praktikum', 'Hanya Praktik')
  }

  const filtered = activeModules.filter((course) => {
    if (selectedSession === 'all') return true
    if (selectedSession === 'lectures') return course.credits >= 4
    if (selectedSession === 'labs') return course.credits < 4

    return true
  })

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_4px_12px_rgba(0,48,87,0.04)] sm:p-5 dark:border-[#2e2e2e] dark:bg-[#1e1e1e]">
      <div className="mb-4 flex flex-col justify-between gap-3 border-b border-border pb-4 sm:flex-row sm:items-center dark:border-[#2e2e2e]">
        <h2 className="flex items-center gap-2 text-sm font-bold text-[#333] sm:text-base dark:text-white">
          <ChartBarIcon size={20} className="text-primary" /> {t('myProgress')}
        </h2>

        <div className="flex flex-wrap gap-2">
          {/* Semester Dropdown */}
          <div className="relative" ref={semRef}>
            <button
              onClick={() => {
                setIsSemDropdownOpen(!isSemDropdownOpen)
                setIsSesDropdownOpen(false)
              }}
              className="flex items-center justify-between gap-2 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-text-dark hover:border-primary dark:border-[#2e2e2e] dark:bg-[#1e1e1e] dark:text-[#e0e0e0] dark:hover:border-primary"
            >
              <span>{selectedSemester === '2025-even' ? t('semesterEven') : t('semesterOdd')}</span>
              <CaretDownIcon size={12} className={cn('transition-transform', isSemDropdownOpen && 'rotate-180')} />
            </button>
            {isSemDropdownOpen && (
              <div className="absolute left-0 z-50 mt-1 w-44 overflow-hidden rounded-lg border border-border bg-white shadow-lg dark:border-[#2e2e2e] dark:bg-[#1e1e1e]">
                <button
                  onClick={() => {
                    setSelectedSemester('2025-even')
                    setIsSemDropdownOpen(false)
                  }}
                  className="w-full px-3 py-2 text-left text-xs hover:bg-bg-light dark:hover:bg-neutral-800"
                >
                  {t('semesterEven')}
                </button>
                <button
                  onClick={() => {
                    setSelectedSemester('2025-odd')
                    setIsSemDropdownOpen(false)
                  }}
                  className="w-full px-3 py-2 text-left text-xs hover:bg-bg-light dark:hover:bg-neutral-800"
                >
                  {t('semesterOdd')}
                </button>
              </div>
            )}
          </div>

          {/* Session Dropdown */}
          <div className="relative" ref={sesRef}>
            <button
              onClick={() => {
                setIsSesDropdownOpen(!isSesDropdownOpen)
                setIsSemDropdownOpen(false)
              }}
              className="flex items-center justify-between gap-2 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-text-dark hover:border-primary dark:border-[#2e2e2e] dark:bg-[#1e1e1e] dark:text-[#e0e0e0] dark:hover:border-primary"
            >
              <span>{getSessionLabel(selectedSession)}</span>
              <CaretDownIcon size={12} className={cn('transition-transform', isSesDropdownOpen && 'rotate-180')} />
            </button>
            {isSesDropdownOpen && (
              <div className="absolute left-0 z-50 mt-1 w-40 overflow-hidden rounded-lg border border-border bg-white shadow-lg dark:border-[#2e2e2e] dark:bg-[#1e1e1e]">
                {['all', 'lectures', 'labs'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSelectedSession(opt)
                      setIsSesDropdownOpen(false)
                    }}
                    className="w-full px-3 py-2 text-left text-xs hover:bg-bg-light dark:hover:bg-neutral-800"
                  >
                    {getSessionLabel(opt)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Scale */}
      <div className="px-1">
        <div className="mb-4 flex border-b border-border pb-1.5 text-[10px] font-bold text-text-muted dark:border-[#2e2e2e]">
          <span className="flex-1">0%</span>
          <span className="flex-1 text-center">25%</span>
          <span className="flex-1 text-center">50%</span>
          <span className="flex-1 text-center">75%</span>
          <span className="flex-1 text-right">100%</span>
        </div>

        <div className="flex flex-col gap-5">
          {filtered.map((course) => {
            const progress = mockProgressMap[course.id] || { class: 35, student: 40 }
            const creditsLabel = isUniv ? 'SKS' : 'JP'
            const courseType = course.credits >= 4 ? (isUniv ? 'LEC' : 'Teori') : isUniv ? 'LAB' : 'Praktik'

            return (
              <div key={course.id} className="flex flex-col gap-2">
                <div className="flex flex-col justify-between gap-1 text-xs sm:flex-row sm:items-center">
                  <span className="leading-tight font-bold text-[#333] dark:text-neutral-300">
                    {course.title}{' '}
                    <span className="text-[10px] font-normal text-text-muted">
                      ({course.code} - {courseType})
                    </span>
                  </span>
                  <span className="flex-shrink-0 text-[10px] font-medium text-text-muted">
                    {course.schedule} | {course.credits} {creditsLabel}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 rounded-lg border border-border bg-[#fafafa] p-3 dark:border-[#2e2e2e] dark:bg-[#1a1a1a]">
                  <div className="flex items-center gap-3">
                    <span className="w-24 flex-shrink-0 text-[9px] font-bold text-text-muted uppercase">
                      {t('classProgress')}
                    </span>
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                      <div
                        className="h-full rounded-full bg-[#cccccc] transition-all duration-500 dark:bg-neutral-600"
                        style={{ width: `${progress.class}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-[10px] font-bold text-text-muted">{progress.class}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-24 flex-shrink-0 text-[9px] font-bold text-text-muted uppercase">
                      {t('yourProgress')}
                    </span>
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${progress.student}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-[10px] font-bold text-primary">{progress.student}%</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-5 flex items-center justify-center gap-6 text-xs text-text-muted">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-4 rounded bg-[#cccccc] dark:bg-neutral-600"></span>
            <span>{t('classProgress')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-4 rounded bg-primary"></span>
            <span>{t('yourProgress')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
