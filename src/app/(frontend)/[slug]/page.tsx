import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import PageHero from '@/components/PageHero'
import ArticleHero from '@/components/ArticleHero'
import RenderTextBlock from '@/components/blocks/RenderTextBlock'
import RenderMediaBlock from '@/components/blocks/RenderMediaBlock'
import RenderQuoteBlock from '@/components/blocks/RenderQuoteBlock'
import RenderPlaceBlock from '@/components/blocks/RenderPlaceBlock'
import RenderSocialCarousel from '@/components/blocks/RenderSocialCarousel'
import RenderSocialVideo from '@/components/blocks/RenderSocialVideo'
import RenderSocialGallery from '@/components/blocks/RenderSocialGallery'
import { PLACE_TYPES, ARTICLE_TYPE_LABELS } from '@/lib/constants'
import GallerySingle from '@/components/gallery/GallerySingle'
import GalleryDuo from '@/components/gallery/GalleryDuo'
import GalleryGrid from '@/components/gallery/GalleryGrid'
import GalleryFeaturedBottom from '@/components/gallery/GalleryFeaturedBottom'
import GalleryFeaturedSide from '@/components/gallery/GalleryFeaturedSide'
import PlaceCard from '@/components/PlaceCard'
import TrackedLink from '@/components/TrackedLink'
import JsonLd from '@/components/JsonLd'
import ArticleCard2 from '@/components/ArticleCard2'
import MiniCard from '@/components/MiniCard'
import ExpandableGrid from '@/components/ExpandableGrid'
import ExpandableGastroGrid from '@/components/ExpandableGastroGrid'
import ScrollDrag from '@/components/ScrollDrag'
import Reveal from '@/components/Reveal'
import Image from 'next/image'
import styles from './page.module.css'
import articleStyles from './article.module.css'
import destStyles from './destination.module.css'
import expStyles from './experience.module.css'

const highlightsTitle: Record<string, string> = {
  [PLACE_TYPES.DORMIR]: 'Por qué alojarse aquí',
  [PLACE_TYPES.COMER]: 'Tené en cuenta',
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })

  function buildMeta(title: string, description?: string, imageUrl?: string) {
    const meta: Metadata = { title, description }
    if (imageUrl) {
      meta.openGraph = { title, description, images: [{ url: imageUrl }] }
      meta.twitter = { card: 'summary_large_image', title, description, images: [imageUrl] }
    }
    return meta
  }

  const { docs: places } = await payload.find({
    collection: 'places',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })
  if (places[0]) {
    const title = `${places[0].seoTitle || places[0].name} — Visit Punta`
    const description = places[0].seoDescription || places[0].summary || undefined
    const image = (places[0].heroImage as any)?.url
    return buildMeta(title, description, image)
  }

  const { docs: articles } = await payload.find({
    collection: 'articles',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })
  if (articles[0]) {
    const title = `${articles[0].seoTitle || articles[0].title} — Visit Punta`
    const description = articles[0].seoDescription || articles[0].tagline || undefined
    const image = (articles[0].heroImage as any)?.url
    return buildMeta(title, description, image)
  }

  const { docs: experiences } = await payload.find({
    collection: 'experiences',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })
  if (experiences[0]) {
    const title = `${experiences[0].seoTitle || experiences[0].title} — Visit Punta`
    const description = experiences[0].seoDescription || experiences[0].summary || undefined
    const image = (experiences[0].heroImage as any)?.url
    return buildMeta(title, description, image)
  }

  const { docs: destinations } = await payload.find({
    collection: 'destinations',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })
  if (destinations[0]) {
    const title = `${destinations[0].seoTitle || destinations[0].name} — Visit Punta`
    const description = destinations[0].seoDescription || destinations[0].summary || undefined
    const image = (destinations[0].heroImage as any)?.url
    return buildMeta(title, description, image)
  }

  return {}
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config })

  // ── Try place first ───────────────────────────────────────
  const { docs: placeDocs } = await payload.find({
    collection: 'places',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })

  if (!placeDocs[0]) {
    // ── Try article ─────────────────────────────────────────
    const { docs: articleDocs } = await payload.find({
      collection: 'articles',
      where: { slug: { equals: slug } },
      depth: 3,
      limit: 1,
    })
    const article = articleDocs[0]

    if (!article) {
      // ── Try experience ───────────────────────────────────
      const { docs: expDocs } = await payload.find({
        collection: 'experiences',
        where: { slug: { equals: slug } },
        depth: 2,
        limit: 1,
      })
      const experience = expDocs[0]

      if (experience) {
        const expHeroUrl = (experience.heroImage as any)?.url as string | undefined
        const expDestName = typeof experience.destination === 'object' ? (experience.destination as any)?.name : null
        const expDestSlug = typeof experience.destination === 'object' ? (experience.destination as any)?.slug : null

        const relItems = (experience.related || [])
          .filter((r: any) => typeof r?.value === 'object')
          .map((r: any) => ({
            ...r.value,
            collection: r.relationTo,
          }))

        return (
          <main>
            {expHeroUrl && <PageHero image={expHeroUrl} title="" />}

            <Reveal>
              <section className={expStyles.header}>
                <div className={expStyles.info}>
                  {expDestName && (
                    <Link href={`/${expDestSlug}`} className={expStyles.zone}>{expDestName}</Link>
                  )}
                  <h1 className={expStyles.title}>{experience.title}</h1>
                  {experience.summary && (
                    <p className={expStyles.summary}>{experience.summary}</p>
                  )}
                </div>
              </section>
            </Reveal>

            {experience.gallery && experience.gallery.length > 0 && (
              <Reveal>
                <section className={expStyles.gallery}>
                  {experience.gallery.map((block: any, i: number) => {
                    const images = (block.images || []).map((item: any) => {
                      const img = typeof item.image === 'object' ? item.image : null
                      const credit = img?.credit || ''
                      return {
                        url: img?.url || '',
                        alt: img?.alt || '',
                        credit: credit && !credit.startsWith('©') ? `© ${credit}` : credit,
                      }
                    })
                    if (block.layout === 'single') return <GallerySingle key={i} images={images} />
                    if (block.layout === 'duo') return <GalleryDuo key={i} images={images} />
                    return null
                  })}
                </section>
              </Reveal>
            )}

            {experience.content && experience.content.length > 0 && (
              <Reveal>
                <div className={expStyles.content}>
                  {experience.content.map((block: any) => {
                    if (block.blockType === 'textBlock') {
                      return (
                        <div key={block.id} className={expStyles.contentText}>
                          <RenderTextBlock content={block.content} />
                        </div>
                      )
                    }
                    if (block.blockType === 'mediaBlock') {
                      const variantClass =
                        block.variant === 'bleed' ? expStyles.contentBleed
                        : block.variant === 'inline' ? expStyles.contentText
                        : expStyles.contentBreakout
                      return (
                        <div key={block.id} className={variantClass}>
                          <RenderMediaBlock
                            images={block.images}
                            variant={block.variant}
                            stack
                          />
                        </div>
                      )
                    }
                    if (block.blockType === 'quoteBlock') {
                      return (
                        <div key={block.id} className={expStyles.contentText}>
                          <RenderQuoteBlock text={block.text} attribution={block.attribution} />
                        </div>
                      )
                    }
                    if (block.blockType === 'placeBlock') {
                      const placeData = block.place?.value ?? block.place
                      if (typeof placeData === 'object' && placeData) {
                        const p = {
                          name: placeData.name || placeData.title,
                          slug: placeData.slug,
                          summary: placeData.summary,
                          heroImage: placeData.heroImage,
                          destination: placeData.destination,
                        }
                        return (
                          <div key={block.id} className={expStyles.contentText}>
                            <RenderPlaceBlock place={p} context={block.context} />
                          </div>
                        )
                      }
                    }
                    return null
                  })}
                </div>
              </Reveal>
            )}

            {experience.highlights && experience.highlights.length > 0 && (
              <Reveal>
                <section className={expStyles.highlights}>
                  <ul className={expStyles.highlightsList}>
                    {experience.highlights.map((h: any, i: number) => (
                      <li key={i} className={expStyles.highlightsItem}>{h.text}</li>
                    ))}
                  </ul>
                </section>
              </Reveal>
            )}

            {experience.timing && experience.timing.length > 0 && (
              <Reveal>
                <section className={expStyles.timing}>
                  <h2 className={expStyles.timingTitle}>
                    {experience.timingTitle || 'Cuándo ir'}
                  </h2>
                  <div className={expStyles.timingGrid}>
                    {experience.timing.map((t: any, i: number) => (
                      <div key={i} className={expStyles.timingCard}>
                        <span className={expStyles.timingMoment}>{t.moment}</span>
                        <p className={expStyles.timingDescription}>{t.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </Reveal>
            )}

            {relItems.length > 0 && (
              <Reveal>
                <section className={expStyles.related}>
                  <h2 className={expStyles.relatedTitle}>Cerca</h2>
                  <div className={expStyles.relatedGrid}>
                    {relItems.map((item: any) => (
                      <PlaceCard
                        key={`${item.collection}-${item.id}`}
                        name={item.name || item.title}
                        description={item.summary || ''}
                        image={(item.heroImage as any)?.url || ''}
                        href={`/${item.slug}`}
                      />
                    ))}
                  </div>
                </section>
              </Reveal>
            )}
          </main>
        )
      }

      // ── Try destination ───────────────────────────────────
      const { docs: destDocs } = await payload.find({
        collection: 'destinations',
        where: { slug: { equals: slug } },
        depth: 1,
        limit: 1,
      })
      const dest = destDocs[0]
      if (!dest) notFound()

      // Dormir
      const { docs: dormirFeatured } = await payload.find({
        collection: 'places',
        where: {
          and: [
            { destination: { equals: dest.id } },
            { type: { equals: PLACE_TYPES.DORMIR } },
            { featured: { equals: true } },
          ],
        },
        depth: 1,
        limit: 6,
      })
      const { docs: dormirRest } = await payload.find({
        collection: 'places',
        where: {
          and: [
            { destination: { equals: dest.id } },
            { type: { equals: PLACE_TYPES.DORMIR } },
            { featured: { not_equals: true } },
          ],
        },
        depth: 1,
      })

      // Experiencias
      const { docs: destExperiences } = await payload.find({
        collection: 'experiences',
        where: {
          and: [
            { destination: { equals: dest.id } },
            { published: { equals: true } },
          ],
        },
        sort: 'order',
        depth: 1,
      })

      // Comer
      const { docs: comerFeatured } = await payload.find({
        collection: 'places',
        where: {
          and: [
            { destination: { equals: dest.id } },
            { type: { equals: PLACE_TYPES.COMER } },
            { featured: { equals: true } },
          ],
        },
        depth: 1,
        limit: 6,
      })
      const { docs: comerRest } = await payload.find({
        collection: 'places',
        where: {
          and: [
            { destination: { equals: dest.id } },
            { type: { equals: PLACE_TYPES.COMER } },
            { featured: { not_equals: true } },
          ],
        },
        depth: 1,
      })

      // Articles
      const { docs: destArticles } = await payload.find({
        collection: 'articles',
        where: {
          and: [
            { destinations: { in: [dest.id] } },
            { published: { equals: true } },
          ],
        },
        depth: 1,
        limit: 6,
      })

      const destHeroUrl = (dest.heroImage as any)?.url as string | undefined

      function toPlaceData(p: any) {
        return {
          id: String(p.id),
          name: p.name,
          destination: (p.destination as any)?.name || '',
          description: p.summary || '',
          image: (p.cardImage as any)?.url || (p.heroImage as any)?.url || '',
          href: `/${p.slug}`,
        }
      }

      function toGastroData(p: any) {
        const firstTag = (p.tags || []).find((t: any) => typeof t === 'object')
        return {
          id: String(p.id),
          name: p.name,
          destination: (p.destination as any)?.name || '',
          description: p.summary || '',
          image: (p.cardImage as any)?.url || (p.heroImage as any)?.url || '',
          tag: firstTag?.label || '',
          href: `/${p.slug}`,
        }
      }

      return (
        <main>
          {destHeroUrl && (
            <section className={destStyles.hero}>
              <Image src={destHeroUrl} alt={dest.name} fill className={destStyles.heroImage} priority />
              <div className={destStyles.heroOverlay} />
              <div className={destStyles.heroText}>
                <h1 className={destStyles.heroTitle}>{dest.name}</h1>
                {dest.summary && <p className={destStyles.heroSummary}>{dest.summary}</p>}
              </div>
            </section>
          )}

          {dest.description && (
            <Reveal>
              <section className={destStyles.description}>
                <p className={destStyles.descriptionText}>{dest.description}</p>
              </section>
            </Reveal>
          )}

          {(dormirFeatured.length > 0 || dormirRest.length > 0) && (
            <Reveal>
              <section className={destStyles.section}>
                <h2 className="section-title">Dónde dormir</h2>
                <ExpandableGrid
                  featured={dormirFeatured.map(toPlaceData)}
                  rest={dormirRest.map(toPlaceData)}
                />
              </section>
            </Reveal>
          )}

          {destExperiences.length > 0 && (
            <Reveal>
              <section className={destStyles.section}>
                <h2 className="section-title">Para recorrer</h2>
                <div className={destStyles.experiencesGrid}>
                  {destExperiences.map((exp: any) => (
                    <MiniCard
                      key={exp.id}
                      name={exp.title}
                      image={(exp.heroImage as any)?.url || ''}
                      href={`/${exp.slug}`}
                    />
                  ))}
                </div>
              </section>
            </Reveal>
          )}

          {(comerFeatured.length > 0 || comerRest.length > 0) && (
            <Reveal>
              <section className={destStyles.section}>
                <h2 className="section-title">Dónde comer y tomar algo</h2>
                <ExpandableGastroGrid
                  featured={comerFeatured.map(toGastroData)}
                  rest={comerRest.map(toGastroData)}
                />
              </section>
            </Reveal>
          )}

          {destArticles.length > 0 && (
            <Reveal>
              <section className={destStyles.section}>
                <h2 className="section-title">Para seguir explorando</h2>
                <div className={destStyles.articlesGrid}>
                  {destArticles.map((a: any) => (
                    <ArticleCard2
                      key={a.id}
                      title={a.title}
                      slug={a.slug}
                      type={a.type}
                      tagline={a.tagline}
                      image={(a.heroImage as any)?.url}
                    />
                  ))}
                </div>
              </section>
            </Reveal>
          )}
        </main>
      )
    }

    const heroUrl = (article.heroImage as any)?.url as string | undefined

    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.tagline || '',
      url: `https://visitpunta.com/${article.slug}`,
      ...(heroUrl && { image: heroUrl }),
      publisher: {
        '@type': 'Organization',
        name: 'Visit Punta',
        url: 'https://visitpunta.com',
      },
    }

    return (
      <main>
        <JsonLd data={articleSchema} />
        <article>
          {heroUrl && <PageHero image={heroUrl} title="" />}

          <section className={articleStyles.header}>
            <h1 className={articleStyles.title}>{article.title}</h1>
            {article.tagline && (
              <p className={articleStyles.excerpt}>{article.tagline}</p>
            )}
          </section>

          {article.layout && article.layout.length > 0 && (
            <div className={articleStyles.content}>
              {article.layout.map((block: any) => {
                if (block.blockType === 'textBlock') {
                  return (
                    <div key={block.id} className={articleStyles.contentText}>
                      <RenderTextBlock content={block.content} />
                    </div>
                  )
                }
                if (block.blockType === 'mediaBlock') {
                  const variantClass =
                    block.variant === 'bleed' ? articleStyles.contentBleed
                    : block.variant === 'inline' ? articleStyles.contentText
                    : articleStyles.contentBreakout
                  return (
                    <div key={block.id} className={variantClass}>
                      <RenderMediaBlock
                        images={block.images}
                        variant={block.variant}
                      />
                    </div>
                  )
                }
                if (block.blockType === 'quoteBlock') {
                  return (
                    <div key={block.id} className={articleStyles.contentText}>
                      <RenderQuoteBlock text={block.text} attribution={block.attribution} />
                    </div>
                  )
                }
                if (block.blockType === 'placeBlock') {
                  const placeData = block.place?.value ?? block.place
                  if (typeof placeData === 'object' && placeData) {
                    const p = {
                      name: placeData.name || placeData.title,
                      slug: placeData.slug,
                      summary: placeData.summary,
                      heroImage: placeData.heroImage,
                      destination: placeData.destination,
                    }
                    return (
                      <div key={block.id} className={articleStyles.contentText}>
                        <RenderPlaceBlock place={p} context={block.context} />
                      </div>
                    )
                  }
                }
                if (block.blockType === 'socialCarousel') {
                  return (
                    <div key={block.id} className={articleStyles.contentBreakout}>
                      <RenderSocialCarousel title={block.title} slides={block.slides} />
                    </div>
                  )
                }
                if (block.blockType === 'socialVideo') {
                  return (
                    <div key={block.id} className={articleStyles.contentText}>
                      <RenderSocialVideo
                        source={block.source}
                        embedUrl={block.embedUrl}
                        videoFile={typeof block.videoFile === 'object' ? block.videoFile : null}
                        caption={block.caption}
                      />
                    </div>
                  )
                }
                if (block.blockType === 'socialGallery') {
                  return (
                    <div key={block.id} className={articleStyles.contentBreakout}>
                      <RenderSocialGallery images={block.images} />
                    </div>
                  )
                }
                return null
              })}
            </div>
          )}
          {article.relatedArticles && article.relatedArticles.filter((a: any) => typeof a === 'object').length > 0 && (
            <Reveal>
              <section className={articleStyles.relatedArticles}>
                <h3 className={articleStyles.relatedTitle}>Seguir leyendo</h3>
                <div className={articleStyles.relatedGrid}>
                  {article.relatedArticles.filter((a: any) => typeof a === 'object').map((rel: any) => (
                    <ArticleCard2
                      key={rel.id}
                      title={rel.title}
                      slug={rel.slug}
                      type={rel.type}
                      tagline={rel.tagline}
                      image={(rel.heroImage as any)?.url}
                    />
                  ))}
                </div>
              </section>
            </Reveal>
          )}
        </article>
      </main>
    )
  }

  const place = placeDocs[0]

  const destinationId = typeof place.destination === 'object' ? place.destination?.id : place.destination
  const destinationName = typeof place.destination === 'object' ? (place.destination as any)?.name : null
  const destinationSlug = typeof place.destination === 'object' ? (place.destination as any)?.slug : null

  const placeTags = (place.tags || []).map((t: any) => typeof t === 'object' ? t.id : t).filter(Boolean)
  let { docs: relatedPlaces } = placeTags.length > 0 && destinationId
    ? await payload.find({
        collection: 'places',
        where: {
          and: [
            { type: { equals: place.type } },
            { destination: { equals: destinationId } },
            { tags: { in: placeTags } },
            { id: { not_equals: place.id } },
          ],
        },
        depth: 1,
        limit: 4,
      })
    : { docs: [] }

  if (relatedPlaces.length === 0 && destinationId) {
    ;({ docs: relatedPlaces } = await payload.find({
      collection: 'places',
      where: {
        and: [
          { type: { equals: place.type } },
          { destination: { equals: destinationId } },
          { id: { not_equals: place.id } },
        ],
      },
      depth: 1,
      limit: 4,
    }))
  }

  const heroImage = place.heroImage as any
  const heroUrl = heroImage?.url || ''

  const placeSchema = {
    '@context': 'https://schema.org',
    '@type': place.type === PLACE_TYPES.DORMIR ? 'Hotel' : place.type === PLACE_TYPES.COMER ? 'Restaurant' : 'Place',
    name: place.name,
    description: place.summary || place.description || '',
    url: `https://visitpunta.com/${place.slug}`,
    ...(heroUrl && { image: heroUrl }),
    ...(destinationName && {
      address: {
        '@type': 'PostalAddress',
        addressLocality: destinationName,
        addressCountry: 'UY',
      },
    }),
  }

  return (
    <main>
      <JsonLd data={placeSchema} />
      {heroUrl && <PageHero image={heroUrl} title="" />}

      <Reveal>
        <section className={styles.header}>
          <div className={styles.info}>
            {destinationName && (
              <Link href={`/${destinationSlug}`} className={styles.zone}>{destinationName}</Link>
            )}
            <h1 className={styles.name}>{place.name}</h1>
            {place.summary && (
              <p className={styles.summary}>{place.summary}</p>
            )}
            {place.location && (
              <p className={styles.locationInline}>— {place.location}</p>
            )}
          </div>
          {place.cta?.url && (
            <div className={styles.cta}>
              <TrackedLink
                href={place.cta.url}
                event={place.type === PLACE_TYPES.DORMIR ? 'click_booking' : 'click_reserva'}
                label={place.name}
                className={styles.ctaButton}
              >
                {place.type === PLACE_TYPES.DORMIR ? 'Consultar disponibilidad' : 'Reservar mesa'}
              </TrackedLink>
              {place.type === PLACE_TYPES.DORMIR && <span className={styles.ctaNote}>en booking.com</span>}
            </div>
          )}
        </section>
      </Reveal>

      {place.description && (
        <Reveal>
          <section className={styles.description}>
            <p className={styles.descriptionText}>{place.description}</p>
          </section>
        </Reveal>
      )}

      {place.gallery && place.gallery.length > 0 && (
        <Reveal>
          <section className={styles.gallery}>
            {place.gallery.map((block: any, i: number) => {
              const images = (block.images || []).map((item: any) => {
                const credit = item.image?.credit || ''
                return {
                  url: item.image?.url || '',
                  alt: item.image?.alt || '',
                  credit: credit && !credit.startsWith('©') ? `© ${credit}` : credit,
                }
              })
              if (block.layout === 'duo') return <GalleryDuo key={i} images={images} />
              if (block.layout === 'grid') return <GalleryGrid key={i} images={images} />
              if (block.layout === 'featured-bottom') return <GalleryFeaturedBottom key={i} images={images} />
              if (block.layout === 'featured-side') return <GalleryFeaturedSide key={i} images={images} />
              return null
            })}
          </section>
        </Reveal>
      )}

      {place.highlights && place.highlights.length > 0 && (
        <Reveal>
          <section className={styles.highlights}>
            <h2 className={styles.highlightsTitle}>
              {highlightsTitle[place.type] || 'Destacados'}
            </h2>
            <ul className={styles.highlightsList}>
              {place.highlights.map((h: any, i: number) => (
                <li key={i} className={styles.highlightsItem}>
                  {h.text}
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      )}

      {(place.cta?.url || place.cta?.mapsUrl) && (
        <Reveal>
          <section className={styles.ctaSection}>
            {place.cta.url && (
              <TrackedLink
                href={place.cta.url}
                event={place.type === PLACE_TYPES.DORMIR ? 'click_booking' : 'click_reserva'}
                label={place.name}
                className={styles.ctaButtonLarge}
              >
                {place.type === PLACE_TYPES.DORMIR ? 'Consultar disponibilidad' : 'Reservar mesa'}
              </TrackedLink>
            )}
            {place.type === PLACE_TYPES.DORMIR && place.cta.url && <span className={styles.ctaNote}>en booking.com</span>}
            {place.cta.mapsUrl && (
              <TrackedLink
                href={place.cta.mapsUrl}
                event="click_maps"
                label={place.name}
                className={styles.mapsLink}
              >
                Ver en Google Maps →
              </TrackedLink>
            )}
          </section>
        </Reveal>
      )}

      {place.relatedPlaces && place.relatedPlaces.length > 0 && (
        <Reveal>
          <section className={styles.recommendations}>
            {place.relatedPlaces.map((group: any, i: number) => {
              const items = (group.places || [])
                .map((r: any) => r?.value ?? r)
                .filter((p: any) => typeof p === 'object' && p)
              if (items.length === 0) return null
              return (
                <div key={i} className={styles.recommendation}>
                  <h3 className={styles.recommendationTitle}>{group.title}</h3>
                  <div className={styles.relatedGrid}>
                    {items.map((p: any) => (
                      <PlaceCard
                        key={p.id}
                        name={p.name || p.title}
                        destination={(p.destination as any)?.name || ''}
                        description={p.summary || ''}
                        image={(p.cardImage as any)?.url || (p.heroImage as any)?.url || ''}
                        href={`/${p.slug}`}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </section>
        </Reveal>
      )}

      {relatedPlaces.length > 0 && (
        <Reveal>
          <section className={styles.related}>
            <h3 className={styles.relatedTitle}>Otros lugares que valen la pena{destinationName ? ` en ${destinationName}` : ''}</h3>
            <div className={styles.relatedGrid}>
              {relatedPlaces.map((p: any) => (
                <PlaceCard
                  key={p.id}
                  name={p.name}
                  destination={(p.destination as any)?.name || ''}
                  description={p.summary || ''}
                  image={(p.cardImage as any)?.url || (p.heroImage as any)?.url || ''}
                  href={`/${p.slug}`}
                />
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {place.relatedArticles && place.relatedArticles.filter((a: any) => typeof a === 'object').length > 0 && (
        <Reveal>
          <section className={styles.relatedArticles}>
            <h3 className={styles.relatedTitle}>Para seguir explorando</h3>
            <div className={styles.relatedArticlesGrid}>
              {place.relatedArticles.filter((a: any) => typeof a === 'object').map((a: any) => (
                <ArticleCard2
                  key={a.id}
                  title={a.title}
                  slug={a.slug}
                  type={a.type}
                  tagline={a.tagline}
                  image={(a.heroImage as any)?.url}
                />
              ))}
            </div>
          </section>
        </Reveal>
      )}
    </main>
  )
}

