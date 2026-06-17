'use client'

import { Link } from '@/i18n/routing'
import { BookOpenIcon, CheckCircleIcon, CpuIcon, IdentificationCardIcon } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/atoms/ui/button'
import { Container } from '@/components/templates/container'

export const AboutSection = () => {
  const t = useTranslations('About')

  const getIcon = (key: string) => {
    switch (key) {
      case '1':
        return <BookOpenIcon size={24} weight="duotone" className="text-secondary" />
      case '2':
        return <IdentificationCardIcon size={24} weight="duotone" className="text-primary dark:text-accent-blue" />
      case '3':
        return <CpuIcon size={24} weight="duotone" className="text-accent-cyan" />
      default:
        return <CheckCircleIcon size={24} weight="duotone" />
    }
  }

  return (
    <section id="about" className="bg-canvas py-20 dark:bg-canvas">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left Column: Title and Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-sm font-bold tracking-wider text-secondary uppercase">{t('subtitle')}</h2>
              <h3 className="text-3xl font-extrabold text-text-dark sm:text-4xl">{t('title')}</h3>
            </div>

            <p className="text-lg leading-relaxed text-text-muted">{t('description')}</p>

            <div className="pt-4">
              <Button
                asChild
                variant="outline"
                className="border-primary/20 hover:bg-primary/5 dark:border-border dark:hover:bg-white/5"
              >
                <Link href="/about" className="font-semibold text-text-dark">
                  {t('cta')}
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Right Column: Feature List Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-1"
          >
            {['1', '2', '3'].map((key) => (
              <div
                key={key}
                className="flex flex-col items-center gap-4 rounded-xl border border-border bg-bg-light p-5 transition-shadow duration-300 hover:shadow-lg lg:flex-row lg:items-start dark:bg-navy-dark"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-canvas shadow-sm dark:bg-canvas">
                  {getIcon(key)}
                </div>
                <div className="space-y-1 text-center lg:text-left">
                  <h4 className="text-base font-bold text-text-dark">{t(`points.${key}` as any)}</h4>
                  <p className="text-sm text-text-muted">
                    {key === '1' && 'Akses materi ajar modular yang disusun khusus untuk masing-masing tingkatan sekolah.'}
                    {key === '2' && 'Catat kehadiran kelas Anda secara digital dan lacak keaktifan belajar harian Anda.'}
                    {key === '3' && 'Dapatkan pendampingan tutor bertenaga AI untuk menjawab pertanyaan materi dan tugas.'}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
