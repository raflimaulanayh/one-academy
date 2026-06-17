import { siteMetadata } from '@/constants/site-metadata'
import { type Metadata } from 'next'

import {
  HeroSection,
  AboutSection,
  PricingSection,
  EventsSection,
  ProjectsSection,
  FAQSection,
  CTASection
} from '@/components/organisms/landing-page'
import { GeneralLayout } from '@/components/templates/general-layout'

export const metadata: Metadata = {
  title: 'One Academy | Platform LMS Modern & Terintegrasi',
  description:
    'Platform Learning Management System (LMS) modular, modern, dan terintegrasi untuk seluruh jenjang pendidikan (SD, SMP, SMA, Perguruan Tinggi).',
  alternates: {
    canonical: siteMetadata.url
  },
  openGraph: {
    title: 'One Academy | Platform LMS Modern & Terintegrasi',
    description:
      'Platform Learning Management System (LMS) modular, modern, dan terintegrasi untuk seluruh jenjang pendidikan (SD, SMP, SMA, Perguruan Tinggi).',
    url: siteMetadata.url,
    type: 'website'
  }
}

export default async function HomePage() {
  return (
    <GeneralLayout>
      <HeroSection />
      <AboutSection />
      <PricingSection />
      <EventsSection />
      <ProjectsSection />
      <FAQSection />
      <CTASection />
    </GeneralLayout>
  )
}
