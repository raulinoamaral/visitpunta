import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import PageHero from '@/components/PageHero'
import MiniCard from '@/components/MiniCard'
import Reveal from '@/components/Reveal'
import styles from '@/styles/interior-page.module.css'
import pageStyles from './page.module.css'
import { notFound } from 'next/navigation'
import { isLocale, localePath, type Locale } from '@/i18n/config'
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

const renderCard = (locale: Locale) => (exp: any) => {
  return (
    <MiniCard
      key={exp.id}
      name={exp.title}
      image={(exp.heroImage as any)?.url || ''}
      href={localePath(locale, exp.slug)}
    />
  )
}

export default async function ExperienciasPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale).explore
  const card = renderCard(locale)
  const payload = await getPayload({ config })

  const { docs: experiences } = await payload.find({
    collection: 'experiences',
    locale,
    where: PUBLISHED,
    sort: 'order',
    depth: 1,
    limit: 100,
  })

  // Punta del Este: featured → "Para empezar", rest → 4+2+4 blocks
  const pdeExps = experiences.filter((e) => {
    const dest = typeof e.destination === 'object' ? e.destination : null
    return (dest as any)?.name === 'Punta del Este'
  })
  const pdeFeatured = pdeExps.filter((e) => e.featured)
  const pdeRest = pdeExps.filter((e) => !e.featured)

  // Other destinations: simple card grid
  const otherExps = experiences.filter((e) => {
    const dest = typeof e.destination === 'object' ? e.destination : null
    return (dest as any)?.name !== 'Punta del Este'
  })

  const grouped = new Map<string, { destName: string; items: typeof otherExps }>()

  for (const exp of otherExps) {
    const dest = typeof exp.destination === 'object' ? exp.destination : null
    const destName = dest?.name || t.others
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
        title={t.title}
        subtitle={t.subtitle}
      />

      <Reveal>
        <section className={styles.intro}>
          <p className={styles.introText}>{t.intro}</p>
        </section>
      </Reveal>

      {pdeFeatured.length > 0 && (
        <Reveal>
          <section className={styles.section}>
            <h2 className="section-title">{t.start}</h2>
            <div className={pageStyles.verticalGrid}>
              {pdeFeatured.slice(0, 3).map(card)}
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
                    {first4.map(card)}
                  </div>
                </section>
              </Reveal>
            )}

            {featured2.length > 0 && (
              <Reveal>
                <section className={styles.section}>
                  <div className={pageStyles.featuredGrid}>
                    {featured2.map(card)}
                  </div>
                </section>
              </Reveal>
            )}

            {last4.length > 0 && (
              <Reveal>
                <section className={styles.section}>
                  <div className={styles.destacadosGrid}>
                    {last4.map(card)}
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
              {items.map(card)}
            </div>
          </section>
        </Reveal>
      ))}
    </main>
  )
}
