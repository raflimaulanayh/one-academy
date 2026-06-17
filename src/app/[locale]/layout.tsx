import '@/styles/globals.css'

import { siteMetadata } from '@/constants/site-metadata'
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import { Analytics } from '@vercel/analytics/react'
import { Metadata, Viewport } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { Plus_Jakarta_Sans } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import React from 'react'

import { Toaster } from '@/components/atoms/ui/sonner'
import { ClientProvider } from '@/components/providers/client-provider'

import { cn } from '@/utils/cn'

export const metadata: Metadata = {
  applicationName: 'One Academy',
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.name}`
  },
  description: siteMetadata.description,
  alternates: {
    canonical: siteMetadata.url
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  keywords: [
    'One Academy',
    'LMS SaaS',
    'Learning Management System',
    'SATU University',
    'BINUS Higher Education',
    'Portal Belajar Siswa',
    'LMS Modular',
    'Pendidikan SD SMP SMA Universitas'
  ],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png'
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: siteMetadata.url,
    title: siteMetadata.title,
    description: siteMetadata.description,
    siteName: 'One Academy',
    images: [
      {
        url: `${siteMetadata.url}/banner-one-academy.png`,
        width: 1200,
        height: 630,
        alt: siteMetadata.name
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: [`${siteMetadata.url}/banner-one-academy.png`]
  },
  verification: {
    google: 'Dd8NZMnRNoFjXW5ksQHhL2GgE3WXtXKJKElBvkD7pmA'
  },
  metadataBase: new URL(siteMetadata.url)
}

export const viewport: Viewport = {
  width: 'device-width',
  themeColor: '#0f2854',
  colorScheme: 'light',
  initialScale: 1,
  minimumScale: 1,
  viewportFit: 'cover'
}

const jakartaSans = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans'
})

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <GoogleTagManager gtmId="GTM-KWH2VKXZ" />
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebSite',
                  '@id': `${siteMetadata.url}/#website`,
                  url: siteMetadata.url,
                  name: 'One Academy',
                  publisher: {
                    '@id': `${siteMetadata.url}/#organization`
                  }
                },
                {
                  '@type': 'Organization',
                  '@id': `${siteMetadata.url}/#organization`,
                  name: siteMetadata.name,
                  alternateName: 'OneAcademy',
                  url: siteMetadata.url,
                  logo: {
                    '@type': 'ImageObject',
                    url: `${siteMetadata.url}/logo.png`
                  },
                  image: `${siteMetadata.url}/banner-one-academy.png`,
                  description: siteMetadata.description,
                  email: 'info@oneacademy.id',
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'Bandung',
                    addressRegion: 'Jawa Barat',
                    addressCountry: 'ID'
                  },
                  parentOrganization: {
                    '@type': 'CollegeOrUniversity',
                    name: 'SATU University',
                    url: 'https://satu.ac.id',
                    parentOrganization: {
                      '@type': 'CollegeOrUniversity',
                      name: 'BINUS Higher Education',
                      url: 'https://binus.ac.id'
                    }
                  },
                  sameAs: ['https://www.instagram.com/oneacademy.id', 'https://www.linkedin.com/company/one-academy/'],
                  founder: [
                    {
                      '@type': 'Person',
                      name: 'Rafli Maulana',
                      jobTitle: 'Founder & Ketua',
                      url: 'https://www.linkedin.com/in/raflimaulanayh'
                    }
                  ]
                },
                {
                  '@type': 'FAQPage',
                  '@id': `${siteMetadata.url}/#faq`,
                  mainEntity: [
                    {
                      '@type': 'Question',
                      name: 'Apa itu One Academy?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'One Academy adalah platform Learning Management System (LMS) modular, modern, dan terintegrasi untuk seluruh jenjang pendidikan (SD, SMP, SMA, Perguruan Tinggi).'
                      }
                    },
                    {
                      '@type': 'Question',
                      name: 'Bagaimana cara mendaftar di One Academy?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Kamu bisa mendaftar melalui halaman pendaftaran di website One Academy. Setelah akun Anda diverifikasi oleh administrator, Anda akan mendapatkan akses penuh ke portal siswa.'
                      }
                    },
                    {
                      '@type': 'Question',
                      name: 'Tingkat pendidikan apa saja yang didukung oleh One Academy?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'One Academy dirancang secara modular untuk mendukung seluruh jenjang pendidikan mulai dari Sekolah Dasar (SD), Sekolah Menengah Pertama (SMP), Sekolah Menengah Atas (SMA), hingga Perguruan Tinggi (Universitas).'
                      }
                    },
                    {
                      '@type': 'Question',
                      name: 'Apa saja fitur utama di portal belajar One Academy?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Fitur utama meliputi akses modul pembelajaran modular (LMS), sistem pencatatan kehadiran kelas, pengumpulan tugas, pemantauan nilai akademik, dan asisten belajar AI tutor.'
                      }
                    }
                  ]
                }
              ]
            })
          }}
        />

        <GoogleAnalytics gaId="G-EJ95DS4WT5" />
      </head>

      <body suppressHydrationWarning className={cn('min-h-screen bg-white font-sans antialiased', jakartaSans.variable)}>
        <NextTopLoader color="#ff9d00" showSpinner={false} />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientProvider>{children}</ClientProvider>
        </NextIntlClientProvider>
        <Toaster richColors position="top-right" closeButton theme="light" />
        <Analytics />
      </body>
    </html>
  )
}
