'use client'

import { BookOpenIcon } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

import { Button } from '@/components/atoms/ui/button'

import { cn } from '@/utils/cn'

interface HeroSectionProps {
  className?: string
}

export function HeroSection({ className }: HeroSectionProps) {
  const t = useTranslations('Home')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] as const } }
  }

  return (
    <section
      className={cn(
        'group relative flex w-full flex-col items-center justify-start overflow-hidden bg-canvas pt-32 lg:pt-40',
        className
      )}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-4 text-center sm:px-6 lg:px-8"
      >
        <motion.h1
          variants={itemVariants}
          className="mb-6 max-w-4xl text-3xl leading-tight font-semibold tracking-tight text-text-dark md:text-7xl"
        >
          {t('heroTitle')}
        </motion.h1>

        <motion.p variants={itemVariants} className="mb-10 max-w-xl tracking-tight text-text-muted md:text-xl">
          {t('heroDescription')}
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Button variant="default" rounded="full" size="lg" url="/register" className="w-full sm:w-auto">
            {t('heroCtaPrimary')}
          </Button>
          <Button variant="outline-primary" rounded="full" size="lg" url="#pricing" className="w-full gap-2 sm:w-auto">
            <BookOpenIcon weight="regular" className="h-5 w-5" />
            <span>{t('heroCtaSecondary')}</span>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
        className="relative z-10 mt-16 flex w-full justify-center"
      >
        <Image
          src="/static/images/hero-banner.png"
          alt="Community Members"
          width={1200}
          height={600}
          className="mx-auto h-auto w-full min-w-[500px] object-contain drop-shadow-sm"
          unoptimized
          priority
        />
      </motion.div>
    </section>
  )
}
