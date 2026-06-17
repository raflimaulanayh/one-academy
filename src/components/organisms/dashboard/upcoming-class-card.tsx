'use client'

import { useDashboard } from '@/context/dashboard-context'
import { InfoIcon, TagIcon, MapPinIcon, ClockIcon, UserIcon, CheckIcon, CaretRightIcon } from '@phosphor-icons/react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/atoms/ui/button'

import type { CourseModule, UserData } from './types'

type Props = {
  userData: UserData
  activeModules: CourseModule[]
  hasAttendedToday: boolean
  attendanceCount: number
  onAttend: () => void
  onResetAttendance?: () => void
  onOpenProjector?: () => void
}

export function UpcomingClassCard({
  userData,
  activeModules,
  hasAttendedToday,
  attendanceCount,
  onAttend,
  onResetAttendance,
  onOpenProjector
}: Props) {
  const t = useTranslations('Dashboard')
  const { currentLang } = useDashboard()

  const classRoom =
    userData.tier === 'sd' ? 'KLS-1' : userData.tier === 'smp' ? 'KLS-7' : userData.tier === 'sma' ? 'KLS-10' : 'BA05 - LAB'

  const teacherName =
    userData.tier === 'sd' || userData.tier === 'smp'
      ? 'Ibu Guru Ani, S.Pd.'
      : userData.tier === 'sma'
        ? 'Pak Budi, M.Si.'
        : 'Hendy Djaya S.T., M.Kom.'

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_4px_12px_rgba(0,48,87,0.04)] sm:p-5 dark:border-[#2e2e2e] dark:bg-[#1e1e1e]">
      <div className="flex items-center justify-between">
        <span className="rounded-full border border-neutral-300 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-neutral-500 uppercase dark:border-neutral-700 dark:text-neutral-400">
          {t('onsiteClass')}
        </span>
        <span className="flex items-center gap-1 text-xs font-medium text-text-muted">
          <ClockIcon size={14} /> 1h 17m
        </span>
      </div>

      <div className="mt-3">
        <p className="text-[10px] font-bold tracking-wide text-text-muted uppercase">{classRoom}</p>
        <h3 className="mt-0.5 text-sm leading-snug font-bold text-[#333] sm:text-base dark:text-white">
          {activeModules[0]?.title}
        </h3>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-200 text-text-muted dark:bg-neutral-700">
            <UserIcon size={12} />
          </div>
          <span className="text-xs text-text-muted">
            {teacherName} <span className="text-[10px] opacity-75">({userData.tier === 'univ' ? 'Dosen' : 'Guru'})</span>
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 border-t border-border pt-3 dark:border-[#2e2e2e]">
        <div className="flex items-center gap-2.5 text-xs text-text-muted">
          <InfoIcon size={16} className="text-primary" />
          <span className="font-medium text-[#333] dark:text-neutral-300">{t('faceToFace')}</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-text-muted">
          <TagIcon size={16} className="text-primary" />
          <span className="font-medium text-[#333] dark:text-neutral-300">{activeModules[0]?.code}</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-text-muted">
          <MapPinIcon size={16} className="text-primary" />
          <span className="leading-tight font-medium text-[#333] dark:text-neutral-300">
            {userData.tier === 'univ' ? t('mainCampus') : t('mainClassroom')}
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-text-muted">
          <ClockIcon size={16} className="text-primary" />
          <span className="font-medium text-[#333] dark:text-neutral-300">13:20 - 15:00 GMT+7</span>
        </div>
      </div>

      {/* Attendance Button */}
      <div className="mt-4">
        {hasAttendedToday ? (
          <div className="flex flex-col gap-1.5">
            <span className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-2.5 text-xs font-bold text-green-500">
              <CheckIcon size={14} weight="bold" />
              {t('alreadyPresent')} ({t('attendanceMeetings', { count: attendanceCount })})
            </span>
            {onResetAttendance && (
              <button
                onClick={onResetAttendance}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-1.5 text-[10px] font-bold text-text-muted transition-all hover:bg-slate-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
              >
                {currentLang === 'id' ? 'Reset Demo Presensi' : 'Reset Attendance Demo'}
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Mobile View: Active Scan QR Button */}
            <div className="md:hidden">
              <Button
                onClick={onAttend}
                className="inline-flex w-full items-center justify-between rounded-lg bg-gradient-to-r from-navy-active to-primary px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-95"
              >
                <span>{t('attendNow')}</span>
                <CaretRightIcon size={16} />
              </Button>
            </div>

            {/* Desktop View: Locked Button + Projector Simulator Trigger */}
            <div className="hidden flex-col gap-2 md:flex">
              <span className="dark:border-neutral-850 inline-flex w-full cursor-not-allowed items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-text-muted dark:bg-neutral-900/50">
                <CheckIcon size={14} className="opacity-40" />
                <span>{currentLang === 'id' ? 'Lakukan Presensi via Mobile' : 'Mark Attendance via Mobile'}</span>
              </span>
              {onOpenProjector && (
                <button
                  onClick={onOpenProjector}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-black text-primary transition-all hover:bg-primary/10 active:scale-[0.98] dark:border-secondary/20 dark:bg-secondary/5 dark:text-secondary dark:hover:bg-secondary/10"
                >
                  <span>{currentLang === 'id' ? 'Simulasi Mode Proyektor' : 'Simulate Projector Mode'}</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <div className="mt-3 border-t border-border pt-3 dark:border-[#2e2e2e]">
        <div className="mb-1 flex items-center justify-between text-[11px] font-bold text-text-muted">
          <span>{t('courseProgress')}</span>
          <span className="text-primary">20%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: '20%' }}></div>
        </div>
      </div>
    </div>
  )
}
