import { getPayload } from 'payload'
import config from '@payload-config'
import JsonLd from '@/components/JsonLd'
import CardGrid from '@/components/sections/CardGrid'
import CoffeeGrid from '@/components/sections/CoffeeGrid'
import Intro from '@/components/sections/Intro'
import NoteBand from '@/components/sections/NoteBand'
import PageCover from '@/components/sections/PageCover'
import Section from '@/components/sections/Section'
import SectionHead from '@/components/sections/SectionHead'
import SlideRow from '@/components/sections/SlideRow'
import Spotlight from '@/components/sections/Spotlight'
import TextIndex from '@/components/sections/TextIndex'
import { localePath, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { PLACE_TYPES } from '@/lib/constants'
import { firstThenByName, getPlacements } from '@/lib/placements'
import { PUBLISHED } from '@/lib/published'
import { coffeeTagIds, isOnlyCoffee, toSectionItem, toSectionItems } from '@/lib/sectionItems'
import { absoluteUrl, breadcrumbSchema, pageUrl } from '@/lib/structuredData'

type Props = { dest: any; locale: Locale }

/**
 * A zone: a small home for one place. Its guide first, where to stay, a pause,
 * what to do, where to eat (coffee apart) and the notes, as a text index.
 */
export default async function ZonePage({ dest, locale }: Props) {
  const t = getDictionary(locale)
  const payload = await getPayload({ config })
  const inZone = { destination: { equals: dest.id } }

  const [stayDocs, eatDocs, expDocs, articleDocs, coffeeIds, placed] = await Promise.all([
    payload.find({
      collection: 'places',
      locale,
      where: { and: [PUBLISHED, inZone, { type: { equals: PLACE_TYPES.DORMIR } }] },
      depth: 1,
      limit: 60,
      sort: 'name',
    }),
    payload.find({
      collection: 'places',
      locale,
      where: { and: [PUBLISHED, inZone, { type: { equals: PLACE_TYPES.COMER } }] },
      depth: 1,
      limit: 60,
      sort: 'name',
    }),
    payload.find({ collection: 'experiences', locale, where: { and: [PUBLISHED, inZone] }, depth: 1, limit: 40, sort: 'order' }),
    payload.find({
      collection: 'articles',
      locale,
      where: { and: [PUBLISHED, { destinations: { in: [dest.id] } }] },
      depth: 1,
      limit: 20,
      sort: '-createdAt',
    }),
    coffeeTagIds(payload),
    getPlacements(payload, locale, ['zone.guide', 'zone.spotlight', 'zone.stayFirst', 'zone.eatFirst'], dest.id),
  ])

  // The zone's guide: chosen in the site map, or the most recent guide written about this zone
  const guide: any = placed['zone.guide'][0]?.doc ?? articleDocs.docs.find((doc) => doc.type === 'guide')
  const notes = articleDocs.docs.filter((doc) => doc.id !== guide?.id)

  // The pause: chosen in the site map; without it there is no pause
  const spotlightEntry = placed['zone.spotlight'][0]
  const spotlight: any = spotlightEntry?.doc ?? null

  const stay = toSectionItems(firstThenByName(stayDocs.docs, placed['zone.stayFirst']), locale, () => undefined)
  const eatOrdered = firstThenByName(eatDocs.docs, placed['zone.eatFirst'])
  const restaurants = toSectionItems(
    eatOrdered.filter((doc) => !isOnlyCoffee(doc, coffeeIds)),
    locale,
    () => undefined,
  )
  const coffee = toSectionItems(
    eatOrdered.filter((doc) => isOnlyCoffee(doc, coffeeIds)),
    locale,
    () => undefined,
  )
  const todo = toSectionItems(
    expDocs.docs.filter((doc) => !(spotlightEntry?.collection === 'experiences' && doc.id === spotlight?.id)),
    locale,
    () => undefined,
  )
  const spotlightItem = spotlight ? toSectionItem(spotlight, locale) : null
  const heroUrl = dest.heroImage?.url as string | undefined

  const destinationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: dest.name,
    description: dest.summary || dest.tagline || '',
    url: pageUrl(locale, dest.slug),
    ...(heroUrl && { image: absoluteUrl(heroUrl) }),
    containedInPlace: { '@type': 'Country', name: 'Uruguay' },
  }

  const sections = [stay.length > 0, todo.length > 0, restaurants.length + coffee.length > 0, notes.length > 0]
  const lastIndex = sections.lastIndexOf(true)

  return (
    <main>
      <JsonLd data={destinationSchema} />
      <JsonLd data={breadcrumbSchema(locale, [{ name: dest.name, slug: dest.slug }])} />

      {heroUrl && (
        <PageCover image={heroUrl} alt={dest.heroImage?.alt || dest.name} title={dest.name} line={dest.summary} caption={dest.heroCaption} tall />
      )}

      {dest.description && <Intro text={dest.description} />}

      {guide?.slug && guide.heroImage?.url && (
        <NoteBand
          href={localePath(locale, guide.slug)}
          image={guide.heroImage.url}
          alt={guide.heroImage.alt || guide.title}
          label={t.destination.guideLabel}
          title={guide.title}
          text={guide.tagline}
          readLabel={t.destination.readGuide}
        />
      )}

      {stay.length > 0 && (
        <Section last={lastIndex === 0}>
          <SectionHead title={t.destination.stay} line={t.destination.stayLine} />
          <CardGrid items={stay} variant="wide" bookingLabel={t.stay.booking} />
        </Section>
      )}

      {spotlightItem && (
        <Spotlight href={spotlightItem.href} image={spotlight.heroImage?.url ?? spotlightItem.image} alt={spotlightItem.alt} title={spotlightItem.title} line={spotlightItem.summary} />
      )}

      {todo.length > 0 && (
        <Section bleed last={lastIndex === 1}>
          <SectionHead title={t.destination.todo} />
          <SlideRow items={todo} variant="tall" />
        </Section>
      )}

      {restaurants.length + coffee.length > 0 && (
        <Section last={lastIndex === 2}>
          <SectionHead title={t.destination.eat} line={t.destination.eatLine} />
          {restaurants.length > 0 && <CardGrid items={restaurants} variant="tall" />}
          {coffee.length > 0 && <CoffeeGrid items={coffee} title={t.destination.coffee} />}
        </Section>
      )}

      {notes.length > 0 && (
        <Section last>
          <SectionHead title={t.destination.notes} />
          <TextIndex
            entries={notes.map((doc: any) => ({
              id: String(doc.id),
              href: localePath(locale, doc.slug),
              title: doc.title,
              label: t.article.types[doc.type] || '',
              text: doc.tagline,
            }))}
          />
        </Section>
      )}
    </main>
  )
}
