'use client'

import { BookOpenIcon } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/atoms/ui/button'

import type { CourseModule } from './types'

type Props = {
  activeModules: CourseModule[]
}

export function LmsTab({ activeModules }: Props) {
  const t = useTranslations('Dashboard')
  const [selectedCourse, setSelectedCourse] = useState<CourseModule | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-extrabold text-text-dark">{t('lmsTitle')}</h3>
        <p className="text-xs text-text-muted">{t('lmsSubtitle')}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {activeModules.map((course) => (
          <div
            key={course.id}
            className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-[0_4px_12px_rgba(0,48,87,0.04)] dark:border-[#2e2e2e] dark:bg-[#1e1e1e]"
          >
            <div className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-secondary/15 dark:text-secondary">
                <BookOpenIcon size={20} weight="bold" />
              </div>
              <h4 className="text-base leading-snug font-extrabold text-text-dark">{course.title}</h4>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-text-muted uppercase">{t('topics')}</p>
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
                {t('openModule')}
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

      {/* Module Modal */}
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
                {t('closeModal')}
              </button>
            </div>
            <div className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-slate-900">
              <p className="text-xs text-white/60">Pemutar Video Pelajaran (Mock Frame)</p>
              <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/80 to-transparent p-4">
                <span className="rounded bg-secondary px-2 py-0.5 text-[10px] font-bold text-white uppercase">LIVE</span>
                <span className="text-[10px] text-white/80">00:00 / 45:00</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-text-dark uppercase">{t('sublesson')}</p>
              <div className="max-h-36 space-y-1.5 overflow-y-auto pr-2">
                {selectedCourse.lessons.map((lesson, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-bg-light p-2 text-xs dark:bg-navy-dark/40"
                  >
                    <span className="font-semibold text-text-dark">
                      {index + 1}. {lesson}
                    </span>
                    <span className="text-[10px] font-bold text-green-500">{t('finishedWatching')}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
