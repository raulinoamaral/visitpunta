import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import ScrollDrag from '@/components/ScrollDrag'
import Reveal from '@/components/Reveal'
import { ARTICLE_TYPE_LABELS } from '@/lib/constants'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Punta del Este y alrededores: guía curada de lugares que valen la pena',
  description: 'Una guía curada de Punta del Este, José Ignacio y La Barra: alojamientos, restaurantes, cafés y experiencias elegidas por su calidad y estilo.',
  openGraph: {
    title: 'Punta del Este y alrededores: guía curada de lugares que valen la pena',
    description: 'Una guía curada de Punta del Este, José Ignacio y La Barra: alojamientos, restaurantes, cafés y experiencias elegidas por su calidad y estilo.',
    images: [{ url: '/images/home-punta-del-este.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Punta del Este y alrededores: guía curada de lugares que valen la pena',
    description: 'Una guía curada de Punta del Este, José Ignacio y La Barra: alojamientos, restaurantes, cafés y experiencias elegidas por su calidad y estilo.',
    images: ['/images/home-punta-del-este.jpg'],
  },
}

export default async function Home() {
  const payload = await getPayload({ config })
  const { docs: allDestinations } = await payload.find({
    collection: 'destinations',
    sort: 'createdAt',
    depth: 1,
    limit: 10,
  })
  const pde = allDestinations.find((d: any) => d.slug === 'punta-del-este')
  const destinations = allDestinations.filter((d: any) => d.slug !== 'punta-del-este')

  const { docs: featuredArticles } = await payload.find({
    collection: 'articles',
    where: {
      and: [
        { published: { equals: true } },
        { featured: { equals: true } },
      ],
    },
    sort: 'order',
    depth: 1,
    limit: 3,
  })
  return (
    <main>
      <section className={styles.hero}>
        <Image
          src="/images/home-punta-del-este.jpg"
          alt="Punta del Este"
          fill
          className={styles.heroImage}
          priority
        />
        <div className={styles.heroOverlay} />
        <div className={`${styles.heroText} ${styles.heroAnimate}`}>
          <h1 className={styles.heroTitle}>Punta del Este<br /><span className={styles.heroSmall}>& alrededores</span></h1>
          <p className={styles.heroSubtitle}>Una guía curada del Este</p>
        </div>
        <a href="#contenido" className={styles.scrollIndicator}>
          <span className={styles.scrollLine} />
        </a>
      </section>

      <Reveal>
        <section id="contenido" className={styles.intro}>
          <p className={styles.introText}>
            Lugares elegidos con criterio. Hoteles donde da ganas de quedarse, restaurantes que dan ganas de volver, cafés que se vuelven rutina.
          </p>
        </section>
      </Reveal>

      {(pde || destinations.length > 0) && (
        <section className={styles.zonas}>
          <Reveal>
            <h2 className="section-title">El Este, zona por zona</h2>
          </Reveal>
          {pde && (
            <Reveal delay={0.1}>
              <Link href={`/${(pde as any).slug}`} className={styles.zonaCardFull}>
                <Image
                  src={((pde as any).heroImage as any)?.url || ''}
                  alt={(pde as any).name}
                  fill
                  className={styles.zonaCardImage}
                />
                <div className={styles.zonaCardOverlay} />
                <div className={styles.zonaCardText}>
                  <span className={styles.zonaCardLabel}>Guía</span>
                  <h2 className={styles.zonaCardName}>{(pde as any).name}</h2>
                  {(pde as any).tagline && <p className={styles.zonaCardTagline}>{(pde as any).tagline}</p>}
                </div>
              </Link>
            </Reveal>
          )}
          <Reveal delay={0.2}>
            <ScrollDrag className={styles.zonasGrid}>
              {destinations.map((dest: any) => (
                <Link key={dest.id} href={`/${dest.slug}`} className={styles.zonaCard}>
                  <Image
                    src={(dest.heroImage as any)?.url || ''}
                    alt={dest.name}
                    fill
                    className={styles.zonaCardImage}
                  />
                  <div className={styles.zonaCardOverlay} />
                  <div className={styles.zonaCardText}>
                    <span className={styles.zonaCardLabel}>Guía</span>
                    <h2 className={styles.zonaCardName}>{dest.name}</h2>
                    {dest.tagline && <p className={styles.zonaCardTagline}>{dest.tagline}</p>}
                  </div>
                </Link>
              ))}
            </ScrollDrag>
          </Reveal>
        </section>
      )}

      <section className={styles.destacados}>
        <Reveal>
          <h2 className="section-title">Para disfrutarlo bien</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <ScrollDrag className={styles.destacadosGrid}>
            {[
              { title: 'Refugios', subtitle: 'Hoteles, villas y lugares para quedarse', href: '/alojamientos', img: '/images/dormir.jpg' },
              { title: 'Mesa & café', subtitle: 'Restaurantes, beach clubs y specialty coffee', href: '/gastronomia', img: '/images/comer-en-punta.jpg' },
              { title: 'Recorridos', subtitle: 'Playas, planes y spots para descubrir', href: '/recorridos', img: '/images/que-hacer.jpg' },
            ].map(({ title, subtitle, href, img }) => (
              <Link key={title} href={href} className={styles.destacadoCard}>
                <Image
                  src={img}
                  alt={title}
                  fill
                  className={styles.destacadoImage}
                />
                <div className={styles.destacadoOverlay} />
                <div className={styles.destacadoText}>
                  <h2 className={styles.destacadoTitle}>{title}</h2>
                  <p className={styles.destacadoSubtitle}>{subtitle}</p>
                </div>
              </Link>
            ))}
          </ScrollDrag>
        </Reveal>
      </section>

      {featuredArticles.length > 0 && (
        <section className={styles.explorar}>
          <Reveal>
            <h2 className="section-title">Para explorar ahora</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className={styles.explorarGrid}>
              {featuredArticles[0] && (
                <Link href={`/${featuredArticles[0].slug}`} className={styles.explorarMain}>
                  {(featuredArticles[0].heroImage as any)?.url && (
                    <div className={styles.explorarMainImage}>
                      <Image
                        src={(featuredArticles[0].heroImage as any).url}
                        alt={featuredArticles[0].title}
                        fill
                        className={styles.explorarImg}
                      />
                    </div>
                  )}
                  <div className={styles.explorarMainText}>
                    {featuredArticles[0].type && (
                      <span className={styles.explorarType}>{ARTICLE_TYPE_LABELS[featuredArticles[0].type] || featuredArticles[0].type}</span>
                    )}
                    <h3 className={styles.explorarMainName}>{featuredArticles[0].title}</h3>
                    {featuredArticles[0].tagline && (
                      <p className={styles.explorarMainTagline}>{featuredArticles[0].tagline}</p>
                    )}
                  </div>
                </Link>
              )}
              <div className={styles.explorarSide}>
                {featuredArticles.slice(1, 3).map((article: any) => (
                  <Link key={article.id} href={`/${article.slug}`} className={styles.explorarSecondary}>
                    {(article.heroImage as any)?.url && (
                      <div className={styles.explorarSecondaryImage}>
                        <Image
                          src={(article.heroImage as any).url}
                          alt={article.title}
                          fill
                          className={styles.explorarImg}
                        />
                      </div>
                    )}
                    <div className={styles.explorarSecondaryText}>
                      {article.type && (
                        <span className={styles.explorarType}>{ARTICLE_TYPE_LABELS[article.type] || article.type}</span>
                      )}
                      <h3 className={styles.explorarSecondaryName}>{article.title}</h3>
                      {article.tagline && (
                        <p className={styles.explorarSecondaryTagline}>{article.tagline}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        </section>
      )}
    </main>
  )
}
