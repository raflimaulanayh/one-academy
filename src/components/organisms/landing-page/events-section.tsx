'use client'

import { Link } from '@/i18n/routing'
import { CalendarBlankIcon, ClockIcon, UserIcon } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/atoms/ui/button'
import { Container } from '@/components/templates/container'

export const EventsSection = () => {
  const t = useTranslations('Events')

  const events = [
    {
      id: 1,
      titleKey: 'event1_title',
      descKey: 'event1_desc',
      date: '25 Juni 2026',
      time: '14:00 - 15:30 WIB',
      mentor: 'Tim Produk One Academy',
      badge: 'Demo Produk'
    },
    {
      id: 2,
      titleKey: 'event2_title',
      descKey: 'event2_desc',
      date: '30 Juni 2026',
      time: '19:00 - 20:30 WIB',
      mentor: 'Rafli Maulana (Founder One Academy)',
      badge: 'Workshop'
    },
    {
      id: 3,
      titleKey: 'event3_title',
      descKey: 'event3_desc',
      date: '4 Juli 2026',
      time: '10:00 - 11:30 WIB',
      mentor: 'Dr. Aisyah Fadilah (EdTech Specialist)',
      badge: 'Seminar'
    }
  ]

  return (
    <section id="events" className="bg-canvas py-20 dark:bg-canvas">
      <Container>
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl space-y-4 text-center">
          <h2 className="text-sm font-bold tracking-wider text-secondary uppercase">Jadwal Sesi & Acara</h2>
          <h3 className="text-3xl font-extrabold text-text-dark sm:text-4xl">{t('title')}</h3>
          <p className="text-lg text-text-muted">{t('subtitle')}</p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col justify-between rounded-2xl border border-border bg-bg-light p-6 transition-all duration-300 hover:shadow-lg dark:bg-navy-dark"
            >
              <div className="space-y-4">
                {/* Badge */}
                <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary dark:bg-secondary/15 dark:text-secondary">
                  {event.badge}
                </span>

                {/* Title & Description */}
                <div className="space-y-2">
                  <h4 className="text-lg leading-snug font-extrabold text-text-dark">{t(event.titleKey as any)}</h4>
                  <p className="text-sm leading-relaxed text-text-muted">{t(event.descKey as any)}</p>
                </div>

                {/* Details */}
                <div className="space-y-2.5 border-t border-border pt-4 text-xs text-text-muted">
                  <div className="flex items-center gap-2">
                    <CalendarBlankIcon size={16} weight="duotone" className="shrink-0 text-secondary" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon size={16} weight="duotone" className="shrink-0 text-secondary" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserIcon size={16} weight="duotone" className="shrink-0 text-secondary" />
                    <span>{event.mentor}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6">
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-primary/20 hover:bg-primary/5 dark:border-border dark:hover:bg-white/5"
                >
                  <Link href="/register" className="flex items-center justify-center gap-2 font-semibold text-text-dark">
                    {t('cta')}
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
