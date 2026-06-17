import { Link } from '@/i18n/routing'
import fs from 'fs'
import { type Metadata } from 'next'
import path from 'path'
import ReactMarkdown from 'react-markdown'

import { ThemeToggle } from '@/components/atoms/ui/theme-toggle'

type Params = Promise<{
  locale: string
  slug?: string[]
}>

export async function generateMetadata(props: { params: Params }): Promise<Metadata> {
  const params = await props.params
  const slugTitle = params.slug ? params.slug[params.slug.length - 1] : 'Dokumentasi'
  const formattedTitle = slugTitle.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())

  return {
    title: `Docs: ${formattedTitle} | One Academy`,
    description: 'Dokumentasi teknis fitur, arsitektur, dan teknologi One Academy.'
  }
}

export default async function DocsPage(props: { params: Params }) {
  const params = await props.params
  const slug = params.slug || []

  // Tentukan file markdown yang akan dibaca
  let relativeFilePath = ''
  if (slug.length === 0) {
    relativeFilePath = 'index.md'
  } else {
    relativeFilePath = `${slug.join('/')}.md`
  }

  const absoluteFilePath = path.join(process.cwd(), 'docs', relativeFilePath)
  let markdownContent = ''
  let fileExists = false

  try {
    if (fs.existsSync(absoluteFilePath)) {
      markdownContent = fs.readFileSync(absoluteFilePath, 'utf8')
      fileExists = true
    } else {
      markdownContent =
        '# 404: Dokumen Tidak Ditemukan\nMaaf, berkas dokumentasi yang Anda cari tidak ada atau telah dipindahkan.'
    }
  } catch (err) {
    console.error('Error reading markdown file:', err)
    markdownContent = '# 500: Gagal Membaca Dokumen\nTerjadi kesalahan server saat mencoba membaca dokumen.'
  }

  // Navigasi menu dokumentasi
  const navGroups = [
    {
      title: 'Panduan Umum',
      items: [
        { label: 'Beranda Dokumentasi', path: '/docs' },
        { label: 'Teknologi & Stack', path: '/docs/tech-stack' },
        { label: 'Arsitektur & RBAC', path: '/docs/architecture' }
      ]
    },
    {
      title: 'Fitur Baru (Modul 1)',
      items: [
        { label: 'Landing Page & Pricing', path: '/docs/features/landing-page' },
        { label: 'Sistem Mock Autentikasi', path: '/docs/features/mock-auth' },
        { label: 'Student Portal Dashboard', path: '/docs/features/student-dashboard' }
      ]
    }
  ]

  const activePath = slug.length === 0 ? '/docs' : `/docs/${slug.join('/')}`

  return (
    <div className="flex min-h-screen flex-col bg-bg-light text-foreground dark:bg-canvas">
      {/* Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-canvas/80 px-6 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-text-muted transition-colors hover:text-text-dark"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali
          </Link>
          <span className="text-border">|</span>
          <div className="flex items-center gap-1.5 font-black text-primary dark:text-secondary">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span>ONE ACADEMY DOCS</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </header>

      {/* Docs Body Layout */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar Nav */}
        <aside className="w-full shrink-0 space-y-6 border-b border-border bg-canvas p-6 md:w-64 md:border-r md:border-b-0">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-2">
              <h4 className="text-xs font-bold tracking-wider text-text-muted uppercase">{group.title}</h4>
              <nav className="flex flex-col gap-1">
                {group.items.map((item, iIdx) => {
                  const isActive = activePath === item.path

                  return (
                    <Link
                      key={iIdx}
                      href={item.path}
                      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                        isActive ? 'bg-secondary/15 text-secondary' : 'text-text-dark hover:bg-bg-light'
                      }`}
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            </div>
          ))}
        </aside>

        {/* Content Body */}
        <main className="max-w-4xl flex-1 p-6 md:p-12">
          <article className="prose max-w-none rounded-3xl border border-border bg-canvas p-6 shadow-sm prose-slate md:p-10 dark:bg-navy-medium/10 dark:prose-invert">
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
          </article>
        </main>
      </div>
    </div>
  )
}
