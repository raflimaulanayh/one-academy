'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/atoms/ui/accordion'
import { Container } from '@/components/templates/container'

export const FAQSection = () => {
  const t = useTranslations('FAQ')

  const faqs = [
    { id: '1', q: 'q1', a: 'a1' },
    { id: '2', q: 'q2', a: 'a2' },
    { id: '3', q: 'q3', a: 'a3' },
    { id: '4', q: 'q4', a: 'a4' },
    { id: '5', q: 'q5', a: 'a5' }
  ]

  return (
    <section id="faq" className="bg-canvas py-20 dark:bg-canvas">
      <Container className="max-w-4xl">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl space-y-4 text-center">
          <h2 className="text-sm font-bold tracking-wider text-secondary uppercase">FAQ</h2>
          <h3 className="text-3xl font-extrabold text-text-dark sm:text-4xl">{t('title')}</h3>
          <p className="text-lg text-text-muted">{t('subtitle')}</p>
        </div>

        {/* Accordion List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-border bg-bg-light/50 p-6 dark:bg-navy-medium/10"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={`item-${faq.id}`} className="border-border">
                <AccordionTrigger className="py-4 text-base font-bold text-text-dark hover:no-underline">
                  {t(faq.q as any)}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm leading-relaxed text-text-muted">
                  {t(faq.a as any)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </Container>
    </section>
  )
}
