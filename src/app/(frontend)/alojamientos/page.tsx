import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import PageHero from '@/components/PageHero'
import ExpandableGrid from '@/components/ExpandableGrid'
import Reveal from '@/components/Reveal'
import styles from '@/styles/interior-page.module.css'
import { PLACE_TYPES } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Alojamientos en Punta del Este: hoteles y lugares para quedarse',
  description: 'Una selección de alojamientos en Punta del Este, José Ignacio y La Barra: hoteles, posadas y lugares para quedarse según el tipo de viaje.',
  openGraph: {
    title: 'Alojamientos en Punta del Este: hoteles y lugares para quedarse',
    description: 'Una selección de alojamientos en Punta del Este, José Ignacio y La Barra: hoteles, posadas y lugares para quedarse según el tipo de viaje.',
    images: [{ url: '/images/dormir.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alojamientos en Punta del Este: hoteles y lugares para quedarse',
    description: 'Una selección de alojamientos en Punta del Este, José Ignacio y La Barra: hoteles, posadas y lugares para quedarse según el tipo de viaje.',
    images: ['/images/dormir.jpg'],
  },
}


export default async function DormirPage() {
  const payload = await getPayload({ config })
  const sections = [
    { tagLabel: 'Para desconectar', title: 'Para desconectar' },
    { tagLabel: 'Cerca de todo', title: 'Cerca de todo' },
    { tagLabel: 'Con más diseño', title: 'Con más diseño' },
  ]

  const tagSections = await Promise.all(
    sections.map(async ({ tagLabel, title }) => {
      const { docs: tags } = await payload.find({
        collection: 'tags',
        where: {
          and: [
            { type: { equals: PLACE_TYPES.DORMIR } },
            { label: { equals: tagLabel } },
          ],
        },
        limit: 1,
      })
      const tag = tags[0]
      if (!tag) return { title, featured: [], rest: [] }

      const { docs: featuredPlaces } = await payload.find({
        collection: 'places',
        where: {
          and: [
            { type: { equals: PLACE_TYPES.DORMIR } },
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
            { type: { equals: PLACE_TYPES.DORMIR } },
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
        image="/images/alojamientos.jpg"
        title="Alojamientos"
        subtitle="Lugares que realmente valen la pena"
      />

      <Reveal>
        <section className={styles.intro}>
          <p className={styles.introText}>
            Una selección curada de lugares donde dan ganas de quedarse en el Este, pensados para bajar el ritmo y disfrutar el entorno.
          </p>
        </section>
      </Reveal>

      {tagSections.map(({ title, featured, rest }) =>
        (featured.length > 0 || rest.length > 0) ? (
          <Reveal key={title}>
            <section className={styles.section}>
              <h2 className="section-title">{title}</h2>
              <ExpandableGrid
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
