'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useState } from 'react'

import { Button } from '@/components/atoms/ui/button'
import { Container } from '@/components/templates/container'

export const ProjectsSection = () => {
  const t = useTranslations('Projects')
  const [filter, setFilter] = useState<'all' | 'web' | 'mobile' | 'iot'>('all')

  const projects = [
    {
      id: 1,
      titleKey: 'project1_title',
      descKey: 'project1_desc',
      category: 'web',
      image: '/static/images/projects/project-1.png',
      difficulty: 'Menengah',
      tech: 'React, Next.js, Tailwind'
    },
    {
      id: 2,
      titleKey: 'project2_title',
      descKey: 'project2_desc',
      category: 'mobile',
      image: '/static/images/projects/project-2.png',
      difficulty: 'Pemula',
      tech: 'React Native, Expo'
    },
    {
      id: 3,
      titleKey: 'project3_title',
      descKey: 'project3_desc',
      category: 'web',
      image: '/static/images/projects/project-3.png',
      difficulty: 'Sulit',
      tech: 'Next.js, Node.js, PostgreSQL'
    },
    {
      id: 4,
      titleKey: 'project4_title',
      descKey: 'project4_desc',
      category: 'web',
      image: '/static/images/projects/project-4.png',
      difficulty: 'Menengah',
      tech: 'Next.js, Tailwind CSS, Vercel AI'
    },
    {
      id: 5,
      titleKey: 'project5_title',
      descKey: 'project5_desc',
      category: 'iot',
      image: '/static/images/projects/project-5.png',
      difficulty: 'Pemula',
      tech: 'Arduino, ESP32, C++'
    },
    {
      id: 6,
      titleKey: 'project6_title',
      descKey: 'project6_desc',
      category: 'web',
      image: '/static/images/projects/project-6.png',
      difficulty: 'Menengah',
      tech: 'Vue.js, Express, MongoDB'
    }
  ]

  const filteredProjects = filter === 'all' ? projects : projects.filter((p) => p.category === filter)

  return (
    <section id="projects" className="border-y border-border bg-bg-light py-20 dark:bg-navy-dark/40">
      <Container>
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-3xl space-y-4 text-center">
          <h2 className="text-sm font-bold tracking-wider text-secondary uppercase">Showcase Hasil Karya</h2>
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
          <Button
            variant={filter === 'iot' ? 'default' : 'outline'}
            onClick={() => setFilter('iot')}
            className="font-semibold"
          >
            {t('filterIoT')}
          </Button>
        </div>

        {/* Projects Grid */}
        <motion.div layout className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col overflow-hidden rounded-2xl border border-border bg-canvas shadow-md transition-shadow duration-300 hover:shadow-xl dark:bg-navy-medium/10"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border bg-slate-100">
                  <Image
                    src={project.image}
                    alt={t(project.titleKey as any)}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <span className="absolute top-3 right-3 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase backdrop-blur-sm">
                    {project.difficulty}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between space-y-4 p-5">
                  <div className="space-y-2">
                    <h4 className="text-lg leading-snug font-extrabold text-text-dark">{t(project.titleKey as any)}</h4>
                    <p className="text-sm leading-relaxed text-text-muted">{t(project.descKey as any)}</p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-text-muted">
                      <span className="font-semibold text-text-dark">Tech:</span>
                      <span className="rounded border border-border/40 bg-bg-light px-2 py-0.5 text-text-muted dark:bg-navy-medium/30">
                        {project.tech}
                      </span>
                    </div>
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
