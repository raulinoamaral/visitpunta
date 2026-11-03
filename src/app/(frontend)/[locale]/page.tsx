import type { Metadata } from 'next'
import { IMAGE_SIZES } from '@/lib/imageSizes'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import ScrollDrag from '@/components/ScrollDrag'
import Reveal from '@/components/Reveal'
import { isLocale, localePath } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { sectionHref } from '@/i18n/routes'
import { alternatesMetadata, staticAlternates } from '@/lib/alternates'
import { PUBLISHED } from '@/lib/published'
import styles from './page.module.css'

// Rebuilt in the background at most every 5 minutes, so edits and new translations show up without a deploy
export const revalidate = 300

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale)
  return {
    title: t.meta.homeTitle,
    description: t.meta.homeDescription,
    alternates: alternatesMetadata(staticAlternates(), locale),
    openGraph: {
      title: t.meta.homeTitle,
      description: t.meta.homeDescription,
      images: [{ url: '/images/home-punta-del-este.jpg' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t.meta.homeTitle,
      description: t.meta.homeDescription,
      images: ['/images/home-punta-del-este.jpg'],
    },
  }
}

export default async function Home({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale)
  const payload = await getPayload({ config })
  const { docs: allDestinations } = await payload.find({
    collection: 'destinations',
    locale,
    where: PUBLISHED,
    sort: 'createdAt',
    depth: 1,
    limit: 10,
  })
  // Punta del Este leads by name: its slug may differ per language
  const pde = allDestinations.find((d: any) => d.name === 'Punta del Este')
  const destinations = allDestinations.filter((d: any) => d.name !== 'Punta del Este')

  const { docs: featuredArticles } = await payload.find({
    collection: 'articles',
    locale,
    where: {
      and: [
        PUBLISHED,
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
          fill sizes={IMAGE_SIZES.full}
          className={styles.heroImage}
          priority
        />
        <div className={styles.heroOverlay} />
        <div className={`${styles.heroText} ${styles.heroAnimate}`}>
          <h1 className={styles.heroTitle}>Punta del Este<br /><span className={styles.heroSmall}>{t.home.heroSmall}</span></h1>
          <p className={styles.heroSubtitle}>{t.home.heroSubtitle}</p>
        </div>
        <a href="#contenido" className={styles.scrollIndicator}>
          <span className={styles.scrollLine} />
        </a>
      </section>

      <Reveal>
        <section id="contenido" className={styles.intro}>
          <p className={styles.introText}>{t.home.intro}</p>
        </section>
      </Reveal>

      {(pde || destinations.length > 0) && (
        <section className={styles.zonas}>
          <Reveal>
            <h2 className="section-title">{t.home.zonesTitle}</h2>
          </Reveal>
          {pde && (
            <Reveal delay={0.1}>
              <Link href={localePath(locale, (pde as any).slug)} className={styles.zonaCardFull}>
                <Image
                  src={((pde as any).heroImage as any)?.url || ''}
                  alt={(pde as any).name}
                  fill sizes={IMAGE_SIZES.full}
                  className={styles.zonaCardImage}
                />
                <div className={styles.zonaCardOverlay} />
                <div className={styles.zonaCardText}>
                  <span className={styles.zonaCardLabel}>{t.home.guideLabel}</span>
                  <h2 className={styles.zonaCardName}>{(pde as any).name}</h2>
                  {(pde as any).tagline && <p className={styles.zonaCardTagline}>{(pde as any).tagline}</p>}
                </div>
              </Link>
            </Reveal>
          )}
          <Reveal delay={0.2}>
            <ScrollDrag className={styles.zonasGrid}>
              {destinations.map((dest: any) => (
                <Link key={dest.id} href={localePath(locale, dest.slug)} className={styles.zonaCard}>
                  <Image
                    src={(dest.heroImage as any)?.url || ''}
                    alt={dest.name}
                    fill sizes={IMAGE_SIZES.card3}
                    className={styles.zonaCardImage}
                  />
                  <div className={styles.zonaCardOverlay} />
                  <div className={styles.zonaCardText}>
                    <span className={styles.zonaCardLabel}>{t.home.guideLabel}</span>
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
          <h2 className="section-title">{t.home.enjoyTitle}</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <ScrollDrag className={styles.destacadosGrid}>
            {[
              { ...t.home.enjoy.stay, href: sectionHref('stay', locale), img: '/images/dormir.jpg' },
              { ...t.home.enjoy.eat, href: sectionHref('eat', locale), img: '/images/comer-en-punta.jpg' },
              { ...t.home.enjoy.explore, href: sectionHref('explore', locale), img: '/images/que-hacer.jpg' },
            ].map(({ title, subtitle, href, img }) => (
              <Link key={title} href={href} className={styles.destacadoCard}>
                <Image
                  src={img}
                  alt={title}
                  fill sizes={IMAGE_SIZES.card3}
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
            <h2 className="section-title">{t.home.exploreTitle}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className={styles.explorarGrid}>
              {featuredArticles[0] && (
                <Link href={localePath(locale, featuredArticles[0].slug)} className={styles.explorarMain}>
                  {(featuredArticles[0].heroImage as any)?.url && (
                    <div className={styles.explorarMainImage}>
                      <Image
                        src={(featuredArticles[0].heroImage as any).url}
                        alt={featuredArticles[0].title}
                        fill sizes={IMAGE_SIZES.twoThirds}
                        className={styles.explorarImg}
                      />
                    </div>
                  )}
                  <div className={styles.explorarMainText}>
                    {featuredArticles[0].type && (
                      <span className={styles.explorarType}>{t.article.types[featuredArticles[0].type] || featuredArticles[0].type}</span>
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
                  <Link key={article.id} href={localePath(locale, article.slug)} className={styles.explorarSecondary}>
                    {(article.heroImage as any)?.url && (
                      <div className={styles.explorarSecondaryImage}>
                        <Image
                          src={(article.heroImage as any).url}
                          alt={article.title}
                          fill sizes={IMAGE_SIZES.card3}
                          className={styles.explorarImg}
                        />
                      </div>
                    )}
                    <div className={styles.explorarSecondaryText}>
                      {article.type && (
                        <span className={styles.explorarType}>{t.article.types[article.type] || article.type}</span>
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
