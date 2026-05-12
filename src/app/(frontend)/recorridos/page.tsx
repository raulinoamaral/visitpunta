import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import PageHero from '@/components/PageHero'
import MiniCard from '@/components/MiniCard'
import Reveal from '@/components/Reveal'
import styles from '@/styles/interior-page.module.css'
import pageStyles from './page.module.css'

export const metadata: Metadata = {
  title: 'Qué hacer en Punta del Este: playas, recorridos y lugares clave',
  description: 'Playas, recorridos y lugares para visitar en Punta del Este. Una guía de experiencias que terminan armando el mapa del Este.',
  openGraph: {
    title: 'Qué hacer en Punta del Este: playas, recorridos y lugares clave',
    description: 'Playas, recorridos y lugares para visitar en Punta del Este. Una guía de experiencias que terminan armando el mapa del Este.',
    images: [{ url: '/images/que-hacer.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Qué hacer en Punta del Este: playas, recorridos y lugares clave',
    description: 'Playas, recorridos y lugares para visitar en Punta del Este. Una guía de experiencias que terminan armando el mapa del Este.',
    images: ['/images/que-hacer.jpg'],
  },
}

function renderCard(exp: any) {
  return (
    <MiniCard
      key={exp.id}
      name={exp.title}
      image={(exp.heroImage as any)?.url || ''}
      href={`/${exp.slug}`}
    />
  )
}

export default async function ExperienciasPage() {
  const payload = await getPayload({ config })

  const { docs: experiences } = await payload.find({
    collection: 'experiences',
    where: { published: { equals: true } },
    sort: 'order',
    depth: 1,
    limit: 100,
  })

  // Punta del Este: featured → "Para empezar", rest → 4+2+4 blocks
  const pdeExps = experiences.filter((e) => {
    const dest = typeof e.destination === 'object' ? e.destination : null
    return (dest as any)?.slug === 'punta-del-este'
  })
  const pdeFeatured = pdeExps.filter((e) => e.featured)
  const pdeRest = pdeExps.filter((e) => !e.featured)

  // Other destinations: simple card grid
  const otherExps = experiences.filter((e) => {
    const dest = typeof e.destination === 'object' ? e.destination : null
    return (dest as any)?.slug !== 'punta-del-este'
  })

  const grouped = new Map<string, { destName: string; items: typeof otherExps }>()

  for (const exp of otherExps) {
    const dest = typeof exp.destination === 'object' ? exp.destination : null
    const destName = dest?.name || 'Otros'
    const destId = dest?.id?.toString() || 'otros'

    if (!grouped.has(destId)) {
      grouped.set(destId, { destName, items: [] })
    }
    grouped.get(destId)!.items.push(exp)
  }

  return (
    <main>
      <PageHero
        image="/images/recorridos.jpg"
        title="Para recorrer"
        subtitle="Para ver y entender el ritmo del Este"
      />

      <Reveal>
        <section className={styles.intro}>
          <p className={styles.introText}>
            Playas y algunos lugares que, juntos, terminan armando el mapa del Este.
          </p>
        </section>
      </Reveal>

      {pdeFeatured.length > 0 && (
        <Reveal>
          <section className={styles.section}>
            <h2 className="section-title">Para empezar</h2>
            <div className={pageStyles.verticalGrid}>
              {pdeFeatured.slice(0, 3).map(renderCard)}
            </div>
          </section>
        </Reveal>
      )}

      {pdeRest.length > 0 && (() => {
        const first4 = pdeRest.slice(0, 4)
        const featured2 = pdeRest.slice(4, 6)
        const last4 = pdeRest.slice(6, 10)

        return (
          <>
            {first4.length > 0 && (
              <Reveal>
                <section className={styles.section}>
                  <h2 className="section-title">Punta del Este</h2>
                  <div className={styles.destacadosGrid}>
                    {first4.map(renderCard)}
                  </div>
                </section>
              </Reveal>
            )}

            {featured2.length > 0 && (
              <Reveal>
                <section className={styles.section}>
                  <div className={pageStyles.featuredGrid}>
                    {featured2.map(renderCard)}
                  </div>
                </section>
              </Reveal>
            )}

            {last4.length > 0 && (
              <Reveal>
                <section className={styles.section}>
                  <div className={styles.destacadosGrid}>
                    {last4.map(renderCard)}
                  </div>
                </section>
              </Reveal>
            )}
          </>
        )
      })()}

      {[...grouped.values()].map(({ destName, items }) => (
        <Reveal key={destName}>
          <section className={styles.section}>
            <h2 className="section-title">{destName}</h2>
            <div className={styles.destacadosGrid}>
              {items.map(renderCard)}
            </div>
          </section>
        </Reveal>
      ))}
    </main>
  )
}
