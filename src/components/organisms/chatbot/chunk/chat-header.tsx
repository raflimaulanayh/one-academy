'use client'

import { Link } from '@/i18n/routing'
import { HouseIcon } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

import { buttonVariants } from '@/components/atoms/ui/button'
import { Container } from '@/components/templates/container'

import { cn } from '@/utils'

export const ChatHeader = () => {
  const t = useTranslations('Chatbot')

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative z-10 border-b border-white/50 bg-white/80 shadow-sm backdrop-blur-xl"
    >
      <Container className="mx-auto flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="relative flex h-12 w-12 items-center justify-center rounded-lg border bg-white"
          >
            <Image src="/favicon.png" alt={t('title')} width={32} height={32} className="rounded-full object-contain" />
            <div className="absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full bg-green-500 ring-2 ring-white" />
          </motion.div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 md:text-xl">{t('title')}</h1>
            <p className="flex items-center gap-1.5 text-xs tracking-wider text-green-600">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-green-500"></span>
              </span>
              {t('status')}
            </p>
          </div>
        </div>
        <Link href="/" className={cn(buttonVariants({ variant: 'outline' }), 'text-sm')}>
          <HouseIcon size={18} />
          <span>{t('homeButton')}</span>
        </Link>
      </Container>
    </motion.div>
  )
}
