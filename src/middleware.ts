import { NextResponse, type NextRequest } from 'next/server'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/i18n/config'
import { SECTION_SLUGS } from '@/i18n/routes'

// Paths the locale rewrite never touches: the CMS, the API, Next internals, static folders and files
const PASSTHROUGH = /^\/(admin|api|_next|images|favicon)(\/|$)|\.[^/]+$/

// Section folders use the Spanish slug: map each language's public slug onto it
const SECTION_FOLDER: Record<string, Record<string, string>> = Object.fromEntries(
  LOCALES.map((locale) => [
    locale,
    Object.fromEntries(Object.values(SECTION_SLUGS).map((slugs) => [slugs[locale], slugs[DEFAULT_LOCALE]])),
  ]),
)
const SECTION_PUBLIC: Record<string, Record<string, string>> = Object.fromEntries(
  LOCALES.map((locale) => [
    locale,
    Object.fromEntries(Object.values(SECTION_SLUGS).map((slugs) => [slugs[DEFAULT_LOCALE], slugs[locale]])),
  ]),
)

function rewrite(request: NextRequest, locale: Locale, rest: string) {
  const [first, ...others] = rest.split('/')
  const folder = SECTION_FOLDER[locale][first] ?? first
  const url = request.nextUrl.clone()
  url.pathname = ['', locale, folder, ...others].filter((part, i) => i === 0 || part).join('/') || `/${locale}`
  return NextResponse.rewrite(url)
}

/**
 * Spanish is served at the root ("/la-huella") and Portuguese under "/pt/…".
 * Internally every frontend route lives under app/(frontend)/[locale], so root
 * paths are rewritten to "/es/…". "/es/…" itself redirects to the root to avoid
 * duplicate URLs, and a section reached by another language's slug redirects
 * to its own (e.g. "/pt/alojamientos" → "/pt/hospedagem").
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (PASSTHROUGH.test(pathname)) return NextResponse.next()

  if (pathname === `/${DEFAULT_LOCALE}` || pathname.startsWith(`/${DEFAULT_LOCALE}/`)) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(DEFAULT_LOCALE.length + 1) || '/'
    return NextResponse.redirect(url, 308)
  }

  for (const locale of LOCALES) {
    if (locale === DEFAULT_LOCALE) continue
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      const rest = pathname.slice(locale.length + 2)
      const first = rest.split('/')[0]
      const publicSlug = SECTION_PUBLIC[locale][first]
      if (publicSlug && publicSlug !== first) {
        const url = request.nextUrl.clone()
        url.pathname = `/${locale}/${[publicSlug, ...rest.split('/').slice(1)].join('/')}`
        return NextResponse.redirect(url, 308)
      }
      return rewrite(request, locale, rest)
    }
  }

  return rewrite(request, DEFAULT_LOCALE, pathname.slice(1))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
