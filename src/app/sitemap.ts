import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { HTML_LANG, localePath, LOCALES, type Locale } from '@/i18n/config'
import { SECTION_SLUGS } from '@/i18n/routes'

// Rebuilt in the background at most every 5 minutes, so edits and new translations show up without a deploy
export const revalidate = 300

const BASE_URL = 'https://visitpunta.com'

type Collection = 'destinations' | 'places' | 'experiences' | 'articles'

const PRIORITY: Record<Collection, number> = {
  destinations: 0.9,
  places: 0.8,
  experiences: 0.8,
  articles: 0.7,
}

type LocalizedDoc = {
  updatedAt: string
  slug?: Record<string, string | null | undefined>
  published?: Record<string, boolean | null | undefined>
}

/** One entry per language a page exists in, each listing all its language versions. */
function entries(urls: Partial<Record<Locale, string>>, lastModified: Date, priority: number, changeFrequency: 'weekly' | 'monthly') {
  const languages = Object.fromEntries(
    Object.entries(urls).map(([code, path]) => [HTML_LANG[code as Locale], `${BASE_URL}${path}`]),
  )
  return Object.values(urls).map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages },
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })
  const now = new Date()

  const staticPages = [
    ...entries(Object.fromEntries(LOCALES.map((l) => [l, localePath(l)])), now, 1, 'weekly'),
    ...Object.values(SECTION_SLUGS).flatMap((slugs) =>
      entries(Object.fromEntries(LOCALES.map((l) => [l, localePath(l, slugs[l])])), now, 0.9, 'weekly'),
    ),
  ]

  const collections: Collection[] = ['destinations', 'places', 'experiences', 'articles']
  const documentPages = await Promise.all(
    collections.map(async (collection) => {
      const { docs } = await payload.find({ collection, locale: 'all', limit: 500, depth: 0, pagination: false })
      return (docs as unknown as LocalizedDoc[]).flatMap((doc) => {
        const urls = Object.fromEntries(
          LOCALES.filter((l) => doc.published?.[l] && doc.slug?.[l]).map((l) => [l, localePath(l, doc.slug![l]!)]),
        ) as Partial<Record<Locale, string>>
        return entries(urls, new Date(doc.updatedAt), PRIORITY[collection], 'monthly')
      })
    }),
  )

  return [...staticPages, ...documentPages.flat()]
}
