import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { HTML_LANG, localePath, LOCALES, type Locale } from '@/i18n/config'
import { SECTION_SLUGS, type SectionKey } from '@/i18n/routes'

type LocalizedDoc = {
  slug?: Record<string, string | null | undefined>
  published?: Record<string, boolean | null | undefined>
}

/** URL of a document in every language where it is published. */
export async function documentAlternates(
  collection: 'articles' | 'experiences' | 'places' | 'destinations',
  id: number,
): Promise<Partial<Record<Locale, string>>> {
  const payload = await getPayload({ config })
  const doc = (await payload.findByID({ collection, id, locale: 'all', depth: 0 })) as unknown as LocalizedDoc
  return Object.fromEntries(
    LOCALES.filter((code) => doc.published?.[code] && doc.slug?.[code]).map((code) => [
      code,
      localePath(code, doc.slug![code]!),
    ]),
  )
}

/** URL of the homepage or a fixed section page in every language. */
export function staticAlternates(section?: SectionKey): Record<Locale, string> {
  return Object.fromEntries(
    LOCALES.map((code) => [code, localePath(code, section ? SECTION_SLUGS[section][code] : '')]),
  ) as Record<Locale, string>
}

/** Next.js `alternates` (canonical + hreflang) from a map of localized URLs. */
export function alternatesMetadata(urls: Partial<Record<Locale, string>>, locale: Locale): Metadata['alternates'] {
  const languages: Record<string, string> = {}
  for (const code of LOCALES) {
    if (urls[code]) languages[HTML_LANG[code]] = urls[code]!
  }
  if (urls.es) languages['x-default'] = urls.es
  return { canonical: urls[locale], languages }
}
