import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import Intro from '@/components/sections/Intro'
import PageCover from '@/components/sections/PageCover'
import { toSectionItems, zonesOf } from '@/lib/sectionItems'
import StayList, { type StaySection } from './StayList'
import { notFound } from 'next/navigation'
import { PLACE_TYPES } from '@/lib/constants'
import { isLocale } from '@/i18n/config'
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
  const t = getDictionary(locale).stay
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: alternatesMetadata(staticAlternates('stay'), locale),
    openGraph: { title: t.metaTitle, description: t.metaDescription, images: [{ url: '/images/dormir.jpg' }] },
    twitter: { card: 'summary_large_image', title: t.metaTitle, description: t.metaDescription, images: ['/images/dormir.jpg'] },
  }
}


export default async function DormirPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dictionary = getDictionary(locale)
  const t = dictionary.stay
  const payload = await getPayload({ config })

  // Sections are the Spanish tag labels in Payload; every hotel shows, the featured ones first
  const sections: StaySection[] = await Promise.all(
    ['Para desconectar', 'Cerca de todo', 'Con más diseño'].map(async (tagLabel) => {
      const title = t.sections[tagLabel] || tagLabel
      const line = t.lines[tagLabel]
      const { docs: tags } = await payload.find({
        collection: 'tags',
        locale: 'es',
        where: { and: [{ type: { equals: PLACE_TYPES.DORMIR } }, { label: { equals: tagLabel } }] },
        limit: 1,
      })
      if (!tags[0]) return { title, line, items: [] }
      const { docs } = await payload.find({
        collection: 'places',
        locale,
        where: { and: [PUBLISHED, { type: { equals: PLACE_TYPES.DORMIR } }, { tags: { in: [tags[0].id] } }] },
        depth: 1,
        limit: 100,
        sort: '-featured,name',
      })
      return { title, line, items: toSectionItems(docs, locale) }
    }),
  )

  return (
    <main>
      <PageCover image="/images/alojamientos.jpg" alt={t.heading} title={t.heading} line={t.subtitle} />
      <Intro text={t.intro} />
      <StayList
        sections={sections}
        zones={zonesOf(sections.flatMap((section) => section.items))}
        labels={{ all: dictionary.common.allZones, zones: dictionary.common.zones, booking: t.booking }}
      />
    </main>
  )
}
