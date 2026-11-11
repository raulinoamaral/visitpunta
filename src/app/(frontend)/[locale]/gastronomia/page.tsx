import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import PageHero from '@/components/PageHero'
import ExpandableGastroGrid from '@/components/ExpandableGastroGrid'
import Reveal from '@/components/Reveal'
import styles from '@/styles/interior-page.module.css'
import { notFound } from 'next/navigation'
import { PLACE_TYPES } from '@/lib/constants'
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
  const t = getDictionary(locale).eat
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: alternatesMetadata(staticAlternates('eat'), locale),
    openGraph: { title: t.metaTitle, description: t.metaDescription, images: [{ url: '/images/comer-en-punta.jpg' }] },
    twitter: { card: 'summary_large_image', title: t.metaTitle, description: t.metaDescription, images: ['/images/comer-en-punta.jpg'] },
  }
}

const sections = [
  { tagLabel: 'Restaurant' },
  { tagLabel: 'Café' },
  { tagLabel: 'Parador' },
]

export default async function ComerPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale).eat
  const payload = await getPayload({ config })

  const tagSections = await Promise.all(
    sections.map(async ({ tagLabel }) => {
      const title = t.sections[tagLabel] || tagLabel
      const { docs: tags } = await payload.find({
        collection: 'tags',
        // Sections are defined by the Spanish tag label
        locale: 'es',
        where: {
          and: [
            { type: { equals: PLACE_TYPES.COMER } },
            { label: { equals: tagLabel } },
          ],
        },
        limit: 1,
      })
      const tag = tags[0]
      if (!tag) return { title, featured: [], rest: [] }

      const { docs: featuredPlaces } = await payload.find({
        collection: 'places',
        locale,
        where: {
          and: [
            PUBLISHED,
            { type: { equals: PLACE_TYPES.COMER } },
            { tags: { in: [tag.id] } },
            { featured: { equals: true } },
          ],
        },
        depth: 1,
        limit: 6,
      })
      const { docs: otherPlaces } = await payload.find({
        collection: 'places',
        locale,
        where: {
          and: [
            PUBLISHED,
            { type: { equals: PLACE_TYPES.COMER } },
            { tags: { in: [tag.id] } },
            { featured: { not_equals: true } },
          ],
        },
        depth: 1,
      })
      return { title, featured: featuredPlaces, rest: otherPlaces }
    })
  )

  return (
    <main>
      <PageHero
        image="/images/gastronomia.jpg"
        title={t.title}
        subtitle={t.subtitle}
      />

      <Reveal>
        <section className={styles.intro}>
          <p className={styles.introText}>{t.intro}</p>
        </section>
      </Reveal>

      {tagSections.map(({ title, featured, rest }) =>
        (featured.length > 0 || rest.length > 0) ? (
          <Reveal key={title}>
            <section className={styles.section}>
              <h2 className="section-title">{title}</h2>
              <ExpandableGastroGrid
                moreLabel={getDictionary(locale).common.more}
                featured={featured.map((p) => ({
                  id: String(p.id),
                  name: p.name,
                  destination: (p.destination as any)?.name || '',
                  description: p.summary || '',
                  image: (p.cardImage as any)?.url || (p.heroImage as any)?.url || '',
                  href: localePath(locale, p.slug),
                }))}
                rest={rest.map((p) => ({
                  id: String(p.id),
                  name: p.name,
                  destination: (p.destination as any)?.name || '',
                  description: p.summary || '',
                  image: (p.cardImage as any)?.url || (p.heroImage as any)?.url || '',
                  href: localePath(locale, p.slug),
                }))}
              />
            </section>
          </Reveal>
        ) : null
      )}

    </main>
  )
}
