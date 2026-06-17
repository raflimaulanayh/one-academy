import { siteMetadata } from '@/constants/site-metadata'

const BASE_URL = siteMetadata.url

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&"']/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '&':
        return '&amp;'
      case '"':
        return '&quot;'
      case "'":
        return '&apos;'
      default:
        return c
    }
  })
}

export async function GET() {
  const urls: { loc: string; images: { loc: string; title: string; caption?: string }[] }[] = [
    {
      loc: BASE_URL,
      images: [
        {
          loc: `${BASE_URL}/banner-one-academy.png`,
          title: 'One Academy Platform',
          caption: 'Platform Learning Management System (LMS) modular, modern, dan terintegrasi One Academy'
        },
        { loc: `${BASE_URL}/logo.png`, title: 'Logo One Academy' }
      ]
    },
    {
      loc: `${BASE_URL}/tentang-kami`,
      images: [
        {
          loc: `${BASE_URL}/banner-one-academy.png`,
          title: 'Portal Belajar One Academy',
          caption: 'Tentang One Academy — Platform LMS Modern dan Terintegrasi'
        }
      ]
    }
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    ${url.images
      .map(
        (img) => `<image:image>
      <image:loc>${img.loc}</image:loc>
      <image:title>${img.title}</image:title>
      ${img.caption ? `<image:caption>${img.caption}</image:caption>` : ''}
    </image:image>`
      )
      .join('\n    ')}
  </url>`
  )
  .join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate'
    }
  })
}
