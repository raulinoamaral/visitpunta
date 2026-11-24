import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import HomeHero from '@/components/HomeHero'
import JsonLd from '@/components/JsonLd'
import Reveal from '@/components/Reveal'
import ScrollDrag from '@/components/ScrollDrag'
import { isLocale, localePath } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { sectionHref } from '@/i18n/routes'
import { alternatesMetadata, staticAlternates } from '@/lib/alternates'
import { getHomeContent } from '@/lib/home'
import { IMAGE_SIZES } from '@/lib/imageSizes'
import { homeSchema } from '@/lib/structuredData'
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
  const labels = t.home
  const payload = await getPayload({ config })
  const { heroCaption, spotlightQuote, season, stay, spotlight, eat, coffee, todo, zones, notes } = await getHomeContent(payload, locale)

  const Head = ({ title, line, href, link }: { title: string; line?: string; href?: string; link?: string }) => (
    <Reveal>
      <header className={styles.head}>
        <div className={styles.headRow}>
          <h2 className={styles.headTitle}>{title}</h2>
          {href && link && (
            <Link href={href} className={styles.more}>
              {link}
            </Link>
          )}
        </div>
        {line && <p className={styles.headLine}>{line}</p>}
      </header>
    </Reveal>
  )

  return (
    <main>
      <JsonLd data={homeSchema(locale, t.meta.homeDescription)} />
      <HomeHero
        image="/images/home-punta-del-este.jpg"
        alt="Punta del Este"
        title="Punta del Este"
        small={t.home.heroSmall}
        line={t.home.heroSubtitle}
        caption={heroCaption}
      />

      <Reveal>
        <p className={styles.intro}>{t.home.intro}</p>
      </Reveal>

      {season.length > 0 && (
        <section className={styles.section}>
          <Head title={labels.season} />
          <div className={styles.season}>
            <Reveal>
              <Link href={season[0].href} className={styles.seasonImage}>
                <Image src={season[0].heroImage} alt={season[0].alt} fill sizes={IMAGE_SIZES.twoThirds} className={styles.cover} />
              </Link>
            </Reveal>
            <ol className={styles.seasonIndex}>
              {season.map((item, index) => (
                <li key={item.key}>
                  <Reveal delay={0.05 * index}>
                    <Link href={item.href} className={`${styles.seasonEntry} ${index === 0 ? styles.seasonLead : ''}`}>
                      <span className={styles.label}>{item.eyebrow}</span>
                      <span className={styles.seasonTitle}>{item.title}</span>
                      {index === 0 && item.text && <span className={styles.seasonText}>{item.text}</span>}
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {stay.length > 0 && (
        <section className={`${styles.section} ${styles.bleedRight}`}>
          <Head title={labels.stay} line={labels.stayLine} href={sectionHref('stay', locale)} link={labels.seeAll} />
          <Reveal delay={0.1}>
            <ScrollDrag className={styles.stayRow}>
              {stay.map((item) => (
                <Link key={item.key} href={item.href} className={styles.stayCard}>
                  <div className={styles.stayImage}>
                    <Image src={item.image} alt={item.alt} fill sizes="(max-width: 768px) 85vw, 520px" className={styles.cover} />
                  </div>
                  <span className={styles.label}>{item.eyebrow}</span>
                  <h3 className={styles.stayName}>{item.title}</h3>
                  <p className={styles.stayText}>{item.text}</p>
                </Link>
              ))}
            </ScrollDrag>
          </Reveal>
        </section>
      )}

      {spotlight && (
        <Link href={spotlight.href} className={styles.spotlight}>
          <Image src={spotlight.heroImage} alt={spotlight.alt} fill sizes={IMAGE_SIZES.full} className={styles.cover} />
          <div className={styles.spotlightShade} />
          <div className={styles.spotlightText}>
            <span className={styles.spotlightLabel}>{spotlight.eyebrow}</span>
            <h2 className={styles.spotlightTitle}>{spotlight.title}</h2>
            {spotlightQuote && <p className={styles.spotlightQuote}>{spotlightQuote}</p>}
          </div>
        </Link>
      )}

      {eat.length > 0 && (
        <section className={styles.section}>
          <Head title={labels.eat} line={labels.eatLine} href={sectionHref('eat', locale)} link={labels.seeAll} />
          <ul className={styles.eatList}>
            {eat.map((item, index) => (
              <li key={item.key}>
                <Reveal delay={0.05 * index}>
                  <Link href={item.href} className={styles.eatEntry}>
                    <div className={styles.eatImage}>
                      <Image src={item.image} alt={item.alt} fill sizes="(max-width: 768px) 30vw, 160px" className={styles.cover} />
                    </div>
                    <div>
                      <span className={styles.label}>{item.eyebrow}</span>
                      <h3 className={styles.eatName}>{item.title}</h3>
                      <p className={styles.eatText}>{item.text}</p>
                    </div>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>

          {coffee.length > 0 && (
            <div className={styles.coffee}>
              <h3 className={styles.coffeeTitle}>{labels.coffee}</h3>
              <Reveal delay={0.1}>
                <ScrollDrag className={styles.coffeeRow}>
                  {coffee.map((item) => (
                    <Link key={item.key} href={item.href} className={styles.coffeeCard}>
                      <div className={styles.coffeeImage}>
                        <Image src={item.image} alt={item.alt} fill sizes="(max-width: 768px) 40vw, 180px" className={styles.cover} />
                      </div>
                      <span className={styles.coffeeName}>{item.title}</span>
                      <span className={styles.coffeeZone}>{item.eyebrow}</span>
                    </Link>
                  ))}
                </ScrollDrag>
              </Reveal>
            </div>
          )}
        </section>
      )}

      {todo.length > 0 && (
        <section className={`${styles.section} ${styles.bleedRight}`}>
          <Head title={labels.todo} />
          <Reveal delay={0.1}>
            <ScrollDrag className={styles.todoRow}>
              {todo.map((item) => (
                <Link key={item.key} href={item.href} className={styles.todoCard}>
                  <Image src={item.image} alt={item.alt} fill sizes={IMAGE_SIZES.slide} className={styles.cover} />
                  <div className={styles.todoShade} />
                  <h3 className={styles.todoTitle}>{item.title}</h3>
                </Link>
              ))}
            </ScrollDrag>
          </Reveal>
        </section>
      )}

      {zones.length > 0 && (
        <section className={styles.section}>
          <Head title={labels.zones} />
          <ul className={styles.zones}>
            {zones.map((zone: any) => (
              <li key={zone.id}>
                <Link href={localePath(locale, zone.slug)} className={styles.zone}>
                  <span className={styles.zoneName}>{zone.name}</span>
                  {zone.tagline && <span className={styles.zoneTagline}>{zone.tagline}</span>}
                  <span className={styles.zoneArrow} aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {notes.length > 0 && (
        <section className={`${styles.section} ${styles.last}`}>
          <Head title={labels.notes} href={sectionHref('notes', locale)} link={labels.seeAllNotes} />
          <div className={styles.notes}>
            {notes.map((item, index) => (
              <Reveal key={item.key} delay={0.05 * index}>
                <Link href={item.href} className={styles.noteCard}>
                  <div className={styles.noteImage}>
                    <Image src={item.image} alt={item.alt} fill sizes={IMAGE_SIZES.card4} className={styles.cover} />
                  </div>
                  <span className={styles.label}>{item.eyebrow}</span>
                  <h3 className={styles.noteTitle}>{item.title}</h3>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
