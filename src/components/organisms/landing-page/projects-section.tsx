'use client'

import { BookOpenIcon, DeviceMobileIcon, CalendarCheckIcon, CpuIcon, TrophyIcon, ChartBarIcon } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Button } from '@/components/atoms/ui/button'
import { Container } from '@/components/templates/container'

const getProjectIcon = (id: number, className?: string) => {
  const iconSize = 24
  const iconWeight = 'duotone'

  switch (id) {
    case 1:
      return <BookOpenIcon size={iconSize} weight={iconWeight} className={className} />
    case 2:
      return <DeviceMobileIcon size={iconSize} weight={iconWeight} className={className} />
    case 3:
      return <CalendarCheckIcon size={iconSize} weight={iconWeight} className={className} />
    case 4:
      return <CpuIcon size={iconSize} weight={iconWeight} className={className} />
    case 5:
      return <TrophyIcon size={iconSize} weight={iconWeight} className={className} />
    case 6:
      return <ChartBarIcon size={iconSize} weight={iconWeight} className={className} />
    default:
      return <BookOpenIcon size={iconSize} weight={iconWeight} className={className} />
  }
}

export const ProjectsSection = () => {
  const t = useTranslations('Projects')
  const [filter, setFilter] = useState<'all' | 'web' | 'mobile'>('all')

  const projects = [
    {
      id: 1,
      titleKey: 'project1_title',
      descKey: 'project1_desc',
      category: 'web',
      difficulty: 'SISWA & GURU',
      tech: 'Materi, Video, PDF',
      gradientClass: 'from-blue-500/5 to-indigo-500/10 dark:from-blue-950/20 dark:to-indigo-950/30',
      glowClass: 'shadow-[0_0_15px_rgba(59,130,246,0.1)] border-blue-500/20 dark:border-blue-500/10',
      iconClass: 'text-blue-600 dark:text-blue-400'
    },
    {
      id: 2,
      titleKey: 'project2_title',
      descKey: 'project2_desc',
      category: 'web',
      difficulty: 'SISWA',
      tech: 'PWA, Offline Cache',
      gradientClass: 'from-emerald-500/5 to-teal-500/10 dark:from-emerald-950/20 dark:to-teal-950/30',
      glowClass: 'shadow-[0_0_15px_rgba(16,185,129,0.1)] border-emerald-500/20 dark:border-emerald-500/10',
      iconClass: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      id: 3,
      titleKey: 'project3_title',
      descKey: 'project3_desc',
      category: 'mobile',
      difficulty: 'SISWA & GURU',
      tech: 'Presensi Digital, Live',
      gradientClass: 'from-purple-500/5 to-pink-500/10 dark:from-purple-950/20 dark:to-pink-950/30',
      glowClass: 'shadow-[0_0_15px_rgba(168,85,247,0.1)] border-purple-500/20 dark:border-purple-500/10',
      iconClass: 'text-purple-600 dark:text-purple-400'
    },
    {
      id: 4,
      titleKey: 'project4_title',
      descKey: 'project4_desc',
      category: 'web',
      difficulty: 'SISWA',
      tech: 'Gemini AI, Respon 24/7',
      gradientClass: 'from-cyan-500/5 to-blue-500/10 dark:from-cyan-950/20 dark:to-blue-950/30',
      glowClass: 'shadow-[0_0_15px_rgba(6,182,212,0.1)] border-cyan-500/20 dark:border-cyan-500/10',
      iconClass: 'text-cyan-600 dark:text-cyan-400'
    },
    {
      id: 5,
      titleKey: 'project5_title',
      descKey: 'project5_desc',
      category: 'web',
      difficulty: 'SISWA',
      tech: 'Poin, Papan Peringkat',
      gradientClass: 'from-amber-500/5 to-orange-500/10 dark:from-amber-950/20 dark:to-orange-950/30',
      glowClass: 'shadow-[0_0_15px_rgba(245,158,11,0.1)] border-amber-500/20 dark:border-amber-500/10',
      iconClass: 'text-amber-500 dark:text-amber-400'
    },
    {
      id: 6,
      titleKey: 'project6_title',
      descKey: 'project6_desc',
      category: 'mobile',
      difficulty: 'GURU & ADMIN',
      tech: 'Laporan, Rekap Guru',
      gradientClass: 'from-rose-500/5 to-orange-500/10 dark:from-rose-950/20 dark:to-rose-950/30',
      glowClass: 'shadow-[0_0_15px_rgba(244,63,94,0.1)] border-rose-500/20 dark:border-rose-500/10',
      iconClass: 'text-rose-600 dark:text-rose-400'
    }
  ]

  const filteredProjects = filter === 'all' ? projects : projects.filter((p) => p.category === filter)

  return (
    <section id="projects" className="border-y border-border bg-bg-light py-20 dark:bg-navy-dark">
      <Container>
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-3xl space-y-4 text-center">
          <h2 className="text-sm font-bold tracking-wider text-secondary uppercase">Fitur Sistem</h2>
          <h3 className="text-3xl font-extrabold text-text-dark sm:text-4xl">{t('title')}</h3>
          <p className="text-lg text-text-muted">{t('subtitle')}</p>
        </div>

        {/* Filter Buttons */}
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className="font-semibold"
          >
            {t('filterAll')}
          </Button>
          <Button
            variant={filter === 'web' ? 'default' : 'outline'}
            onClick={() => setFilter('web')}
            className="font-semibold"
          >
            {t('filterWeb')}
          </Button>
          <Button
            variant={filter === 'mobile' ? 'default' : 'outline'}
            onClick={() => setFilter('mobile')}
            className="font-semibold"
          >
            {t('filterMobile')}
          </Button>
        </div>

        {/* Projects Grid */}
        <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group flex flex-col gap-4 rounded-2xl border border-border bg-canvas p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg sm:flex-row sm:items-start dark:bg-canvas"
              >
                {/* Icon Container */}
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border bg-gradient-to-br transition-all duration-500 group-hover:scale-105 group-hover:rotate-3 ${project.gradientClass} ${project.glowClass}`}
                >
                  {getProjectIcon(project.id, project.iconClass)}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between space-y-3">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-base leading-snug font-extrabold text-text-dark transition-colors duration-300 group-hover:text-primary dark:group-hover:text-secondary">
                        {t(project.titleKey as any)}
                      </h4>
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[9px] font-bold tracking-wider text-primary uppercase dark:bg-secondary/15 dark:text-secondary">
                        {project.difficulty}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-text-muted">{t(project.descKey as any)}</p>
                  </div>

                  <div className="flex items-center gap-1.5 border-t border-border/40 pt-2 text-[10px] text-text-muted">
                    <span className="font-semibold text-text-dark">{t('techStack')}:</span>
                    <span className="rounded border border-border/40 bg-bg-light px-2 py-0.5 text-text-muted dark:bg-navy-dark">
                      {project.tech}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </Container>
    </section>
  )
}
