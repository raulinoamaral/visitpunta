import type { Payload } from 'payload'
import { localePath, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { PLACE_TYPES } from '@/lib/constants'
import { PUBLISHED } from '@/lib/published'

/**
 * Everything the home shows, in the order chosen in Admin → Home.
 * Empty lists fall back: Portuguese to the Spanish choice, Spanish to the featured items.
 */

type Collection = 'articles' | 'places' | 'experiences'
type Ref = { relationTo: Collection; value: number | { id: number } }

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

const MAX_SEASON = 5
const TIME_ZONE = 'America/Montevideo'

const idOf = (value: unknown): number | null => {
  if (typeof value === 'number') return value
  if (value && typeof value === 'object' && 'id' in value) return (value as { id: number }).id
  return null
}


// Day of the year (1–366) for a "d/m" text, on a leap year so 29/2 is valid
function dayOfYear(dayMonth: string): number | null {
  const [day, month] = dayMonth.split('/').map(Number)
  if (!day || !month) return null
  const date = Date.UTC(2024, month - 1, day)
  return Math.round((date - Date.UTC(2024, 0, 1)) / 86400000) + 1
}

function todayOfYear(): number {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, day: 'numeric', month: 'numeric' }).formatToParts(new Date())
  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? '1'
  return dayOfYear(`${value('day')}/${value('month')}`) ?? 1
}

/** Days since the range started, or null when today is outside it (ranges may cross New Year) */
function daysIntoRange(from: string, to: string, today: number): number | null {
  const start = dayOfYear(from)
  const end = dayOfYear(to)
  if (start === null || end === null) return null
  const inside = start <= end ? today >= start && today <= end : today >= start || today <= end
  if (!inside) return null
  return (today - start + 366) % 366
}

export async function getHomeContent(payload: Payload, locale: Locale) {
  const t = getDictionary(locale)
  const [home, homeEs] = await Promise.all([
    payload.findGlobal({ slug: 'home', locale, depth: 0 }),
    locale === 'es' ? null : payload.findGlobal({ slug: 'home', locale: 'es', depth: 0 }),
  ])

  // Portuguese lists that were left empty use the Spanish choice
  const pick = <K extends keyof typeof home>(key: K) => {
    const own = home[key] as unknown[] | null | undefined
    if (own && (!Array.isArray(own) || own.length > 0)) return own
    return (homeEs?.[key] as unknown[] | null | undefined) ?? null
  }

  const toItem = (collection: Collection, doc: any): HomeItem | null => {
    if (!doc?.slug || doc.published !== true) return null
    const card = doc.cardImage?.url ? doc.cardImage : doc.heroImage
    if (!card?.url) return null
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

  // Loads documents by id and keeps the given order
  const byIds = async (collection: Collection, ids: number[]) => {
    if (ids.length === 0) return []
    const { docs } = await payload.find({
      collection,
      locale,
      where: { and: [PUBLISHED, { id: { in: ids } }] },
      depth: 1,
      limit: ids.length,
    })
    const found = new Map(docs.map((doc: any) => [doc.id, doc]))
    return ids.map((id) => toItem(collection, found.get(id))).filter((item): item is HomeItem => Boolean(item))
  }
  const fromRefs = async (refs: Ref[]) => {
    const ids = (collection: Collection) =>
      refs.filter((ref) => ref.relationTo === collection).map((ref) => idOf(ref.value)).filter((id): id is number => id !== null)
    const loaded = (await Promise.all((['articles', 'places', 'experiences'] as Collection[]).map((c) => byIds(c, ids(c))))).flat()
    const byKey = new Map(loaded.map((item) => [item.key, item]))
    return refs
      .map((ref) => byKey.get(`${ref.relationTo}-${idOf(ref.value)}`))
      .filter((item): item is HomeItem => Boolean(item))
  }
  const list = async (collection: Collection, value: unknown) =>
    byIds(collection, ((value as unknown[] | null) ?? []).map(idOf).filter((id): id is number => id !== null))

  // Coffee places are told apart by their tag; labels are per language, so the ids come from Spanish
  const coffeeTagIds = new Set(
    (await payload.find({ collection: 'tags', locale: 'es', where: { label: { like: 'caf' } }, depth: 0, limit: 10 })).docs.map(
      (tag) => tag.id,
    ),
  )
  const isCoffee = (doc: any) => (doc.tags ?? []).some((tag: unknown) => coffeeTagIds.has(idOf(tag) as number))

  // Fallback lists ask for more than they show: entries without a photo are skipped
  const latest = async (collection: Collection, where: object, limit: number, sort: string) => {
    const { docs } = await payload.find({ collection, locale, where: where as any, depth: 1, limit: limit * 3, sort })
    return docs
      .map((doc) => toItem(collection, doc))
      .filter((item): item is HomeItem => Boolean(item))
      .slice(0, limit)
  }

  const featuredPlaces = async (type: string, limit: number, coffee: boolean) => {
    const { docs } = await payload.find({
      collection: 'places',
      locale,
      where: { and: [PUBLISHED, { type: { equals: type } }, { featured: { equals: true } }] },
      depth: 1,
      limit: 50,
      sort: 'name',
    })
    return docs
      .filter((doc: any) => (type === PLACE_TYPES.COMER ? isCoffee(doc) === coffee : true))
      .slice(0, limit)
      .map((doc) => toItem('places', doc))
      .filter((item): item is HomeItem => Boolean(item))
  }

  // Estos días en Punta: chosen by hand, or whatever is in season today (the most recent start first)
  const loadSeason = async () => {
    const chosen = pick('season') as Ref[] | null
    if (chosen?.length) return fromRefs(chosen)
    const today = todayOfYear()
    const inSeason = (
      await Promise.all(
        (['articles', 'places', 'experiences'] as Collection[]).map(async (collection) => {
          const { docs } = await payload.find({
            collection,
            locale,
            where: { and: [PUBLISHED, { 'homeSeason.from': { exists: true } }, { 'homeSeason.to': { exists: true } }] },
            depth: 1,
            limit: 50,
          })
          return docs.map((doc: any) => ({ collection, doc, days: daysIntoRange(doc.homeSeason.from, doc.homeSeason.to, today) }))
        }),
      )
    )
      .flat()
      .filter((entry) => entry.days !== null)
      .sort((a, b) => (a.days as number) - (b.days as number))
    return inSeason
      .map((entry) => toItem(entry.collection, entry.doc))
      .filter((item): item is HomeItem => Boolean(item))
      .slice(0, MAX_SEASON)
  }

  const loadSpotlight = async () => {
    const ref = pick('spotlight') as unknown as Ref | null
    if (!ref?.relationTo) return null
    return (await fromRefs([ref]))[0] ?? null
  }

  const stayIds = pick('stay')
  const eatIds = pick('eat')
  const coffeeIds = pick('coffee')
  const todoIds = pick('todo')
  const noteIds = pick('notes')

  const [season, stay, eat, coffee, todo, notes, spotlight, zones] = await Promise.all([
    loadSeason(),
    stayIds?.length ? list('places', stayIds) : featuredPlaces(PLACE_TYPES.DORMIR, 5, false),
    eatIds?.length ? list('places', eatIds) : featuredPlaces(PLACE_TYPES.COMER, 4, false),
    coffeeIds?.length ? list('places', coffeeIds) : featuredPlaces(PLACE_TYPES.COMER, 6, true),
    todoIds?.length
      ? list('experiences', todoIds)
      : latest('experiences', { and: [PUBLISHED, { featured: { equals: true } }] }, 8, 'createdAt'),
    noteIds?.length ? list('articles', noteIds) : latest('articles', PUBLISHED, 4, '-createdAt'),
    loadSpotlight(),
    payload.find({ collection: 'destinations', locale, where: PUBLISHED, sort: 'createdAt', depth: 0, limit: 10 }).then(({ docs }) => docs),
  ])

  return {
    // Text is never borrowed from Spanish: an empty caption uses this language's default
    heroCaption: (home.heroCaption as string | null) || t.home.heroCaption,
    spotlightQuote: (home.spotlightQuote as string | null) || '',
    season,
    stay,
    eat,
    coffee,
    todo,
    notes,
    spotlight,
    zones,
  }
}
