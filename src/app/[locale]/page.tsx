import { siteMetadata } from '@/constants/site-metadata'
import { type Metadata } from 'next'

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
      <h1>One Academy</h1>
    </GeneralLayout>
  )
}
