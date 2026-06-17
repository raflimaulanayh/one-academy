'use client'

import { Link } from '@/i18n/routing'
import { CheckIcon } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/atoms/ui/button'
import { Container } from '@/components/templates/container'

export const PricingSection = () => {
  const t = useTranslations('Pricing')

  const tiers = [
    {
      id: 'sd',
      titleKey: 'sdTitle',
      priceKey: 'sdPrice',
      periodKey: 'sdPeriod',
      descKey: 'sdDesc',
      feats: ['sdFeat1', 'sdFeat2', 'sdFeat3'],
      popular: false
    },
    {
      id: 'smp',
      titleKey: 'smpTitle',
      priceKey: 'smpPrice',
      periodKey: 'smpPeriod',
      descKey: 'smpDesc',
      feats: ['smpFeat1', 'smpFeat2', 'smpFeat3'],
      popular: false
    },
    {
      id: 'sma',
      titleKey: 'smaTitle',
      priceKey: 'smaPrice',
      periodKey: 'smaPeriod',
      descKey: 'smaDesc',
      feats: ['smaFeat1', 'smaFeat2', 'smaFeat3'],
      popular: true
    },
    {
      id: 'univ',
      titleKey: 'univTitle',
      priceKey: 'univPrice',
      periodKey: 'univPeriod',
      descKey: 'univDesc',
      feats: ['univFeat1', 'univFeat2', 'univFeat3'],
      popular: false
    }
  ]

  return (
    <section id="pricing" className="border-y border-border bg-bg-light py-20 dark:bg-navy-dark/40">
      <Container>
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl space-y-4 text-center">
          <h2 className="text-sm font-bold tracking-wider text-secondary uppercase">{t('title')}</h2>
          <p className="text-3xl font-extrabold text-text-dark sm:text-4xl">Layanan LMS Modular Setiap Jenjang</p>
          <p className="text-lg text-text-muted">{t('subtitle')}</p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex flex-col justify-between rounded-2xl border bg-canvas p-6 transition-all duration-300 ${
                tier.popular
                  ? 'z-10 scale-105 border-secondary shadow-xl dark:bg-navy-medium/30'
                  : 'border-border shadow-md hover:-translate-y-1 hover:shadow-lg dark:bg-navy-medium/10'
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-secondary px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase shadow-sm">
                  Rekomendasi
                </span>
              )}

              <div className="space-y-6">
                {/* Header */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-text-dark">{t(tier.titleKey as any)}</h3>
                  <p className="min-h-[48px] text-xs leading-relaxed text-text-muted">{t(tier.descKey as any)}</p>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-text-dark">{t(tier.priceKey as any)}</span>
                  <span className="text-xs text-text-muted">/ {t(tier.periodKey as any)}</span>
                </div>

                {/* Features */}
                <ul className="space-y-3 border-t border-border pt-6">
                  {tier.feats.map((featKey) => (
                    <li key={featKey} className="flex items-start gap-2 text-sm text-text-muted">
                      <CheckIcon size={16} weight="bold" className="mt-0.5 shrink-0 text-secondary" />
                      <span>{t(featKey as any)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action */}
              <div className="mt-8">
                <Button
                  asChild
                  className={`w-full font-semibold ${
                    tier.popular
                      ? 'bg-secondary text-white hover:bg-amber-500'
                      : 'bg-primary text-white hover:bg-navy-active dark:bg-white/10 dark:text-white dark:hover:bg-white/20'
                  }`}
                >
                  <Link href={`/register?tier=${tier.id}`}>{t('cta')}</Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
