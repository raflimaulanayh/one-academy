import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import { siteMetadata } from './src/constants/site-metadata'

const withNextIntl = createNextIntlPlugin()

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com https://*.googletagmanager.com https://*.google-analytics.com https://ssl.google-analytics.com https://*.google.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https: blob: https://*.google-analytics.com https://*.googletagmanager.com https://*.google.com https://*.gstatic.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https://generativelanguage.googleapis.com https://va.vercel-scripts.com https://*.google-analytics.com https://*.analytics.google.com https://*.g.doubleclick.net",
      "frame-src 'self' https://www.googletagmanager.com https://td.doubleclick.net",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ')
  }
]

const nextConfig: NextConfig = {
  allowedDevOrigins: ['http://localhost:3000', siteMetadata.url, '192.168.18.10', 'localhost:3000'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders
      }
    ]
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ibb.co.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'products.aspose.app' },
      { protocol: 'https', hostname: 'res.cloudinary.com' }
    ],
    dangerouslyAllowSVG: true,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
  },
  env: {
    SITE_NAME: siteMetadata.name,
    APP_URL: siteMetadata.url,
    BASE_URL: siteMetadata.url,
    API_URL: `${siteMetadata.url}/api`
  }
}

export default withNextIntl(nextConfig)
