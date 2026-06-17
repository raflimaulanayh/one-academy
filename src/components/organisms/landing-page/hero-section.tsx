'use client'

import { Link } from '@/i18n/routing'
import { ArrowRightIcon, BookOpenIcon } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

import { Button } from '@/components/atoms/ui/button'
import { Container } from '@/components/templates/container'

export const HeroSection = () => {
  const t = useTranslations('Home')

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-bg-light via-canvas to-canvas py-24 md:py-32 dark:from-navy-dark dark:to-canvas">
      {/* Decorative Ornaments */}
      <div className="absolute top-1/4 left-0 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
      <div className="absolute right-0 bottom-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl dark:bg-accent-blue/10" />

      <Container className="relative grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
        {/* Left Column: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-start space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/10 px-4 py-1.5 text-xs font-semibold text-primary dark:text-secondary">
            <span className="flex h-2 w-2 animate-pulse rounded-full bg-secondary" />
            LMS Modular Terintegrasi
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-text-dark sm:text-5xl md:text-6xl lg:leading-[1.15]">
            {t('heroTitle')}
          </h1>

          <p className="text-lg text-text-muted md:max-w-xl">{t('heroDescription')}</p>

          <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
            <Button
              asChild
              className="group bg-primary text-white hover:bg-navy-active dark:bg-secondary dark:text-navy-dark dark:hover:bg-amber-400"
            >
              <Link href="/register" className="flex items-center justify-center gap-2 font-semibold">
                {t('heroCtaPrimary')}
                <ArrowRightIcon size={16} weight="bold" className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="border-primary/20 hover:bg-primary/5 dark:border-border dark:hover:bg-white/5"
            >
              <a href="#pricing" className="flex items-center justify-center gap-2 font-medium text-text-dark">
                <BookOpenIcon size={16} weight="bold" />
                {t('heroCtaSecondary')}
              </a>
            </Button>
          </div>
        </motion.div>

        {/* Right Column: Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-lg lg:max-w-none"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-canvas shadow-2xl dark:bg-navy-medium/30">
            <Image
              src="/static/images/hero-banner.png"
              alt="One Academy Portal"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
