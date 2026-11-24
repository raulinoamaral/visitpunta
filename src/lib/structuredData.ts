import { HTML_LANG, localePath, type Locale } from '@/i18n/config'

// schema.org JSON-LD helpers shared by the home and the [slug] pages
export const SITE_URL = 'https://visitpunta.com'
export const SITE_NAME = 'Visit Punta'
// One Instagram account per language: Portuguese pages point to the Brazilian account
const INSTAGRAM_HANDLES: Record<Locale, string> = { es: 'visitpunta', pt: 'visitpunta.br' }

export function instagramHandle(locale: Locale): string {
  return INSTAGRAM_HANDLES[locale]
}

export function instagramUrl(locale: Locale): string {
  return `https://www.instagram.com/${instagramHandle(locale)}`
}
const LOGO_URL = `${SITE_URL}/favicon/web-app-manifest-512x512.png`
const ORGANIZATION_ID = `${SITE_URL}/#organization`
const WEBSITE_ID = `${SITE_URL}/#website`

/** Media URLs already come absolute from DO Spaces; only relative paths get the site in front */
export function absoluteUrl(url: string): string {
  return /^https?:\/\//.test(url) ? url : `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`
}

export function pageUrl(locale: Locale, slug = ''): string {
  return `${SITE_URL}${localePath(locale, slug)}`
}

export function organizationSchema() {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: { '@type': 'ImageObject', url: LOGO_URL, width: 512, height: 512 },
    sameAs: Object.values(INSTAGRAM_HANDLES).map((handle) => `https://www.instagram.com/${handle}`),
  }
}

/** Short reference to the organization, for publisher fields */
export function publisherRef() {
  return { '@type': 'Organization', '@id': ORGANIZATION_ID, name: SITE_NAME, logo: { '@type': 'ImageObject', url: LOGO_URL } }
}

export function homeSchema(locale: Locale, description: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        name: SITE_NAME,
        url: pageUrl(locale),
        description,
        inLanguage: HTML_LANG[locale],
        publisher: { '@id': ORGANIZATION_ID },
      },
      organizationSchema(),
    ],
  }
}

/** Home › (zone) › page. Items without a slug are skipped */
export function breadcrumbSchema(locale: Locale, items: { name: string; slug: string | null | undefined }[]) {
  const crumbs = [{ name: SITE_NAME, url: pageUrl(locale) }].concat(
    items.filter((item) => item.slug && item.name).map((item) => ({ name: item.name, url: pageUrl(locale, item.slug as string) })),
  )
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({ '@type': 'ListItem', position: i + 1, name: crumb.name, item: crumb.url })),
  }
}
