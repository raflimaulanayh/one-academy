import { siteMetadata } from '@/constants/site-metadata'
import { type MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteMetadata.url
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1
    },
    {
      url: `${baseUrl}/chatbot`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7
    }
  ]

  return [...staticPages]
}
