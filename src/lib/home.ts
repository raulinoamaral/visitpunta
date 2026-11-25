import type { Payload } from 'payload'
import { localePath, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getPlacements, type Placed } from '@/lib/placements'
import { PUBLISHED } from '@/lib/published'

/**
 * Everything the home shows. What goes in each section comes from Admin → Ubicaciones;
 * the texts (cover caption, spotlight quote) from Admin → Home. An empty section is not shown,
 * except the notes, which fall back to the latest four.
 */

export type HomeItem = {
  key: string
  href: string
  title: string
  text: string
  eyebrow: string
  image: string
  heroImage: string
  alt: string
}

export async function getHomeContent(payload: Payload, locale: Locale) {
  const t = getDictionary(locale)

  const toItem = ({ collection, doc }: Placed): HomeItem | null => {
    const card = doc.cardImage?.url ? doc.cardImage : doc.heroImage
    if (!doc?.slug || !card?.url) return null
    return {
      key: `${collection}-${doc.id}`,
      href: localePath(locale, doc.slug),
      title: doc.name ?? doc.title,
      text: doc.summary ?? doc.tagline ?? '',
      eyebrow:
        collection === 'articles'
          ? t.article.types[doc.type] || ''
          : (doc.destination?.name ?? doc.destinations?.[0]?.name ?? ''),
      image: card.url,
      heroImage: doc.heroImage?.url ?? card.url,
      alt: card.alt || doc.name || doc.title,
    }
  }
  const items = (placed: Placed[] = []) => placed.map(toItem).filter((item): item is HomeItem => Boolean(item))

  const [home, placed, latestNotes, zones] = await Promise.all([
    payload.findGlobal({ slug: 'home', locale, depth: 0 }),
    getPlacements(payload, locale, ['home.season', 'home.stay', 'home.spotlight', 'home.eat', 'home.coffee', 'home.todo', 'home.notes']),
    payload.find({ collection: 'articles', locale, where: PUBLISHED, depth: 1, limit: 12, sort: '-createdAt' }),
    payload.find({ collection: 'destinations', locale, where: PUBLISHED, sort: 'createdAt', depth: 0, limit: 10 }).then(({ docs }) => docs),
  ])

  const chosenNotes = items(placed['home.notes'])
  const notes =
    chosenNotes.length > 0
      ? chosenNotes
      : items(latestNotes.docs.map((doc) => ({ collection: 'articles' as const, doc }))).slice(0, 4)

  return {
    // Text is never borrowed from Spanish: an empty caption uses this language's default
    heroCaption: (home.heroCaption as string | null) || t.home.heroCaption,
    spotlightQuote: (home.spotlightQuote as string | null) || '',
    season: items(placed['home.season']).slice(0, 5),
    stay: items(placed['home.stay']),
    eat: items(placed['home.eat']),
    coffee: items(placed['home.coffee']),
    todo: items(placed['home.todo']),
    notes,
    spotlight: items(placed['home.spotlight'])[0] ?? null,
    zones,
  }
}
