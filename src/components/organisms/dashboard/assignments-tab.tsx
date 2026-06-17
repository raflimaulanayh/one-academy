'use client'

import { useDashboard } from '@/context/dashboard-context'
import { CloudArrowUpIcon, EyeIcon, EyeSlashIcon } from '@phosphor-icons/react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/atoms/ui/button'

import { cn } from '@/utils'

import type { Assignment } from './types'

type Props = {
  assignments: Assignment[]
  onUpload: (id: number) => void
}

export function AssignmentsTab({ assignments, onUpload }: Props) {
  const t = useTranslations('Dashboard')
  const { userData, showGrades, toggleGradesVisibility } = useDashboard()

  const formatGrade = (score?: number) => {
    if (!score) return '-'
    const isUniv = userData?.tier === 'univ'
    if (isUniv) {
      if (score >= 95) return 'A (4.00)'
      if (score >= 90) return 'A- (3.67)'
      if (score >= 85) return 'B+ (3.33)'
      if (score >= 80) return 'B (3.00)'
      if (score >= 75) return 'B- (2.67)'
      if (score >= 70) return 'C+ (2.33)'
      if (score >= 60) return 'C (2.00)'

      return 'D (1.00)'
    } else {
      let letter = 'D'
      if (score >= 95) letter = 'A+'
      else if (score >= 90) letter = 'A'
      else if (score >= 85) letter = 'A-'
      else if (score >= 80) letter = 'B+'
      else if (score >= 75) letter = 'B'
      else if (score >= 70) letter = 'B-'
      else if (score >= 60) letter = 'C'

      return `${score} / 100 (${letter})`
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-extrabold text-text-dark">{t('assignmentsTitle')}</h3>
        <p className="text-xs text-text-muted">{t('assignmentsSubtitle')}</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#2e2e2e] dark:bg-[#1e1e1e]">
        <table className="w-full border-collapse text-left text-sm text-text-muted">
          <thead className="bg-[#fafafa] text-xs font-bold text-text-dark uppercase dark:bg-[#1a1a1a]">
            <tr>
              <th className="p-4">{t('colName')}</th>
              <th className="p-4">{t('colDeadline')}</th>
              <th className="p-4">{t('colStatus')}</th>
              <th className="p-4">
                <div className="flex items-center gap-1.5">
                  <span>{t('colGrade')}</span>
                  <button
                    onClick={() => toggleGradesVisibility()}
                    className="rounded p-0.5 text-text-muted hover:bg-slate-100 hover:text-text-dark focus:outline-none dark:hover:bg-neutral-800"
                    title={showGrades ? 'Sembunyikan Nilai' : 'Tampilkan Nilai'}
                  >
                    {showGrades ? <EyeIcon size={13} weight="bold" /> : <EyeSlashIcon size={13} weight="bold" />}
                  </button>
                </div>
              </th>
              <th className="p-4 text-right">{t('colAction')}</th>
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
                      {t('statusSubmitted')}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-0.5 text-xs font-bold text-orange-500">
                      {t('statusPending')}
                    </span>
                  )}
                </td>
                <td className="p-4 font-black text-text-dark">
                  <span className={cn('transition-all duration-300', !showGrades && 'blur-sm select-none')}>
                    {formatGrade(asg.score)}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {asg.status === 'submitted' ? (
                    <Button
                      disabled
                      className="bg-slate-100 px-3 py-1.5 text-xs text-slate-400 dark:bg-navy-dark/30 dark:text-slate-500"
                    >
                      {t('done')}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => onUpload(asg.id)}
                      className="ml-auto flex items-center justify-center gap-1.5 bg-secondary px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-500"
                    >
                      <CloudArrowUpIcon size={14} weight="bold" />
                      {t('upload')}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
