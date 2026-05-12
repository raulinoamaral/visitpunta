import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import PageHero from '@/components/PageHero'
import ExpandableGastroGrid from '@/components/ExpandableGastroGrid'
import Reveal from '@/components/Reveal'
import styles from '@/styles/interior-page.module.css'
import { PLACE_TYPES } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Dónde comer en Punta del Este: restaurantes, cafés y paradores',
  description: 'Restaurantes, cafés y paradores en Punta del Este y alrededores. Lugares para comer frente al mar, sin apuro o con café de especialidad.',
  openGraph: {
    title: 'Dónde comer en Punta del Este: restaurantes, cafés y paradores',
    description: 'Restaurantes, cafés y paradores en Punta del Este y alrededores. Lugares para comer frente al mar, sin apuro o con café de especialidad.',
    images: [{ url: '/images/comer-en-punta.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dónde comer en Punta del Este: restaurantes, cafés y paradores',
    description: 'Restaurantes, cafés y paradores en Punta del Este y alrededores. Lugares para comer frente al mar, sin apuro o con café de especialidad.',
    images: ['/images/comer-en-punta.jpg'],
  },
}

const sections = [
  { tagLabel: 'Restaurant', title: 'Para sentarse sin apuro' },
  { tagLabel: 'Café', title: 'Café de especialidad' },
  { tagLabel: 'Parador', title: 'Frente al mar' },
]

export default async function ComerPage() {
  const payload = await getPayload({ config })

  const tagSections = await Promise.all(
    sections.map(async ({ tagLabel, title }) => {
      const { docs: tags } = await payload.find({
        collection: 'tags',
        where: {
          and: [
            { type: { equals: PLACE_TYPES.COMER } },
            { label: { equals: tagLabel } },
          ],
        },
        limit: 1,
      })
      const tag = tags[0]
      if (!tag) return { title, places: [] }

      const { docs: featuredPlaces } = await payload.find({
        collection: 'places',
        where: {
          and: [
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
        where: {
          and: [
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
        title="Restaurantes y cafés"
        subtitle="Para comer, tomar algo y quedarse un rato más de lo planeado"
      />

      <Reveal>
        <section className={styles.intro}>
          <p className={styles.introText}>
            Restaurantes frente al mar y beach clubs para alargar el día hasta el atardecer. Cafés de especialidad donde todo está cuidado.
          </p>
        </section>
      </Reveal>

      {tagSections.map(({ title, featured, rest }) =>
        (featured.length > 0 || rest.length > 0) ? (
          <Reveal key={title}>
            <section className={styles.section}>
              <h2 className="section-title">{title}</h2>
              <ExpandableGastroGrid
                featured={featured.map((p) => ({
                  id: String(p.id),
                  name: p.name,
                  destination: (p.destination as any)?.name || '',
                  description: p.summary || '',
                  image: (p.cardImage as any)?.url || (p.heroImage as any)?.url || '',
                  href: `/${p.slug}`,
                }))}
                rest={rest.map((p) => ({
                  id: String(p.id),
                  name: p.name,
                  destination: (p.destination as any)?.name || '',
                  description: p.summary || '',
                  image: (p.cardImage as any)?.url || (p.heroImage as any)?.url || '',
                  href: `/${p.slug}`,
                }))}
              />
            </section>
          </Reveal>
        ) : null
      )}

    </main>
  )
}
