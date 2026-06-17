import { routing } from '@/i18n/routing'
import createMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const nextIntlProxy = createMiddleware(routing)

function getLocaleFromRequest(request: NextRequest): string {
  const cookieName =
    routing.localeCookie && typeof routing.localeCookie !== 'boolean'
      ? routing.localeCookie.name || 'NEXT_LOCALE'
      : 'NEXT_LOCALE'

  const cookieLocale = request.cookies.get(cookieName)?.value
  if (cookieLocale && (routing.locales as readonly string[]).includes(cookieLocale)) {
    return cookieLocale
  }

  const acceptLanguage = request.headers.get('accept-language') || ''
  if (acceptLanguage.includes('id')) return 'id'

  return routing.defaultLocale
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl?.pathname ?? new URL(request.url).pathname

  const pathnameHasLocale = routing.locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`))

  if (!pathnameHasLocale) {
    const locale = getLocaleFromRequest(request)

    if (String(routing.localePrefix) === 'always' || locale !== routing.defaultLocale) {
      const url = request.nextUrl?.clone() ?? new URL(request.url)
      url.pathname = `/${locale}${pathname}`

      return NextResponse.redirect(url)
    }
  }

  return nextIntlProxy(request)
}

export const config = {
  matcher: ['/', '/((?!api|_next|_vercel|.*\\..*).*)']
}
