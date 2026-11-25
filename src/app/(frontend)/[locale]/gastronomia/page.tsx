import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { PLACE_TYPES } from '@/lib/constants'
import { isLocale, localePath } from '@/i18n/config'
import Intro from '@/components/sections/Intro'
import PageCover from '@/components/sections/PageCover'
import { PICKS, toSectionItems, zonesOf } from '@/lib/sectionItems'
import EatList, { type EatNote } from './EatList'
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
  const t = getDictionary(locale).eat
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: alternatesMetadata(staticAlternates('eat'), locale),
    openGraph: { title: t.metaTitle, description: t.metaDescription, images: [{ url: '/images/comer-en-punta.jpg' }] },
    twitter: { card: 'summary_large_image', title: t.metaTitle, description: t.metaDescription, images: ['/images/comer-en-punta.jpg'] },
  }
}

export default async function ComerPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dictionary = getDictionary(locale)
  const t = dictionary.eat
  const payload = await getPayload({ config })

  // Each kind of place is a Spanish tag label in Payload; every place shows, the featured ones first
  const byTag = async (tagLabel: string) => {
    const { docs: tags } = await payload.find({
      collection: 'tags',
      locale: 'es',
      where: { and: [{ type: { equals: PLACE_TYPES.COMER } }, { label: { equals: tagLabel } }] },
      limit: 1,
    })
    if (!tags[0]) return []
    const { docs } = await payload.find({
      collection: 'places',
      locale,
      where: { and: [PUBLISHED, { type: { equals: PLACE_TYPES.COMER } }, { tags: { in: [tags[0].id] } }] },
      depth: 1,
      limit: 100,
      sort: '-featured,name',
    })
    return toSectionItems(docs, locale)
  }

  const note = async (id: number): Promise<EatNote | null> => {
    const { docs } = await payload.find({
      collection: 'articles',
      locale,
      where: { and: [PUBLISHED, { id: { equals: id } }] },
      depth: 1,
      limit: 1,
    })
    const doc: any = docs[0]
    if (!doc?.slug || !doc.heroImage?.url) return null
    return { href: localePath(locale, doc.slug), image: doc.heroImage.url, alt: doc.heroImage.alt || doc.title, title: doc.title, text: doc.tagline }
  }

  const [restaurants, beach, coffee, beachNote, coffeeNote] = await Promise.all([
    byTag('Restaurant'),
    byTag('Parador'),
    byTag('Café'),
    note(PICKS.eatBeachNote),
    note(PICKS.eatCoffeeNote),
  ])

  return (
    <main>
      <PageCover image="/images/gastronomia.jpg" alt={t.heading} title={t.heading} line={t.subtitle} />
      <Intro text={t.intro} />
      <EatList
        restaurants={{ title: t.restaurants, line: t.restaurantsLine, items: restaurants }}
        beach={{ title: t.beach, line: t.beachLine, items: beach }}
        coffee={{ title: t.coffee, line: t.coffeeLine, items: coffee }}
        beachNote={beachNote}
        coffeeNote={coffeeNote}
        zones={zonesOf([...restaurants, ...beach, ...coffee])}
        labels={{ all: dictionary.common.allZones, zones: dictionary.common.zones, noteLabel: t.noteLabel, readNote: t.readNote }}
      />
    </main>
  )
}
