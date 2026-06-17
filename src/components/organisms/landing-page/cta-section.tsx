'use client'

import { Link } from '@/i18n/routing'
import { ArrowRightIcon, ChatIcon } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/atoms/ui/button'
import { Container } from '@/components/templates/container'

export const CTASection = () => {
  const t = useTranslations('CTA')

  return (
    <section className="bg-canvas py-16 dark:bg-canvas">
      <Container>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-primary to-navy-active p-8 text-center text-white shadow-2xl md:p-16 dark:from-navy-medium/60 dark:to-navy-dark"
        >
          {/* Background shapes */}
          <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-secondary/15 blur-2xl" />
          <div className="absolute -right-24 -bottom-24 h-48 w-48 rounded-full bg-accent-blue/20 blur-2xl" />

          <div className="relative mx-auto flex max-w-2xl flex-col items-center space-y-6">
            <h3 className="text-3xl leading-tight font-black md:text-4xl">{t('title')}</h3>
            <p className="text-lg leading-relaxed text-white/80">{t('description')}</p>

            <div className="flex w-full flex-col justify-center gap-4 pt-4 sm:w-auto sm:flex-row">
              <Button
                asChild
                className="group border-transparent bg-secondary font-semibold text-white shadow-md hover:bg-amber-400"
              >
                <Link href="/register" className="flex items-center justify-center gap-2">
                  {t('primaryButton')}
                  <ArrowRightIcon size={16} weight="bold" className="transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="border-white/30 text-white hover:bg-white/10 dark:border-white/20"
              >
                <Link href="/about" className="flex items-center justify-center gap-2 font-medium">
                  <ChatIcon size={16} weight="bold" />
                  {t('secondaryButton')}
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
