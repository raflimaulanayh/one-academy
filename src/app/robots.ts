import { siteMetadata } from '@/constants/site-metadata'
import { type MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/api/auth/session'],
      disallow: ['/admin/', '/dashboard/', '/api/']
    },
    sitemap: [`${siteMetadata.url}/sitemap.xml`, `${siteMetadata.url}/sitemap-images.xml`]
  }
}
