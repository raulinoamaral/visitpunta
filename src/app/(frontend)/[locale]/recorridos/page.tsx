import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import Intro from '@/components/sections/Intro'
import PageCover from '@/components/sections/PageCover'
import type { IndexEntry } from '@/components/sections/TextIndex'
import { getPlacements } from '@/lib/placements'
import { ZONE_ORDER, isBeach, toSectionItem, withoutBeachWord, zonesOf } from '@/lib/sectionItems'
import ExploreList, { type ExploreNote } from './ExploreList'
import { notFound } from 'next/navigation'
import { isLocale, localePath } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { alternatesMetadata, staticAlternates } from '@/lib/alternates'
import { PUBLISHED } from '@/lib/published'

// Rebuilt in the background at most every 5 minutes, so edits and new translations show up without a deploy
export const revalidate = 300

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale).explore
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: alternatesMetadata(staticAlternates('explore'), locale),
    openGraph: { title: t.metaTitle, description: t.metaDescription, images: [{ url: '/images/que-hacer.jpg' }] },
    twitter: { card: 'summary_large_image', title: t.metaTitle, description: t.metaDescription, images: ['/images/que-hacer.jpg'] },
  }
}

export default async function ExperienciasPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dictionary = getDictionary(locale)
  const t = dictionary.explore
  const payload = await getPayload({ config })

  const [{ docs: experiences }, placed] = await Promise.all([
    payload.find({ collection: 'experiences', locale, where: PUBLISHED, sort: 'order', depth: 1, limit: 100 }),
    getPlacements(payload, locale, ['explore.start', 'explore.bandNote', 'explore.guides']),
  ])

  const zoneRank = (doc: any) => {
    const rank = ZONE_ORDER.indexOf(doc.destination?.name)
    return rank === -1 ? ZONE_ORDER.length : rank
  }
  // "Para empezar" comes from the site map; those experiences leave the lists below
  const startDocs = placed['explore.start'].map((entry) => entry.doc)
  const startIds = new Set(placed['explore.start'].filter((entry) => entry.collection === 'experiences').map((entry) => entry.doc.id))
  const beachDocs = experiences.filter((doc) => isBeach(doc.title)).sort((a, b) => zoneRank(a) - zoneRank(b))
  const placeDocs = experiences.filter((doc) => !isBeach(doc.title) && !startIds.has(doc.id))

  const items = (docs: any[], plainBeachNames = false) =>
    docs
      .map((doc) => toSectionItem(doc, locale))
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .map((item) => (plainBeachNames ? { ...item, title: withoutBeachWord(item.title) } : item))
  const start = items(startDocs)
  const beaches = items(beachDocs, true)
  const places = items(placeDocs)

  const breakDoc: any = placed['explore.bandNote'][0]?.doc
  const breakNote: ExploreNote | null =
    breakDoc?.slug && breakDoc.heroImage?.url
      ? { href: localePath(locale, breakDoc.slug), image: breakDoc.heroImage.url, alt: breakDoc.heroImage.alt || breakDoc.title, title: breakDoc.title, text: breakDoc.tagline }
      : null
  const guides: IndexEntry[] = placed['explore.guides']
    .map((entry) => entry.doc)
    .filter((doc) => doc?.slug)
    .map((doc) => ({ id: String(doc.id), href: localePath(locale, doc.slug), title: doc.title, text: doc.tagline }))

  return (
    <main>
      <PageCover image="/images/recorridos.jpg" alt={t.heading} title={t.heading} line={t.subtitle} />
      <Intro text={t.intro} />
      <ExploreList
        start={start}
        beaches={beaches}
        places={places}
        breakNote={breakNote}
        guides={guides}
        zones={zonesOf([...start, ...beaches, ...places])}
        labels={{
          all: dictionary.common.allZones,
          zones: dictionary.common.zones,
          start: t.start,
          startLine: t.startLine,
          beaches: t.beaches,
          beachesLine: t.beachesLine,
          places: t.places,
          placesLine: t.placesLine,
          guides: t.guides,
          guidesLine: t.guidesLine,
          guideLabel: t.guideLabel,
          readGuide: t.readGuide,
        }}
      />
    </main>
  )
}
