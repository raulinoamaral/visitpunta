import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import CardGrid from '@/components/sections/CardGrid'
import NoteBand from '@/components/sections/NoteBand'
import Section from '@/components/sections/Section'
import SectionHead from '@/components/sections/SectionHead'
import SlideRow from '@/components/sections/SlideRow'
import TextIndex from '@/components/sections/TextIndex'
import { isLocale, localePath } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { alternatesMetadata, staticAlternates } from '@/lib/alternates'
import { PUBLISHED } from '@/lib/published'
import { toSectionItems } from '@/lib/sectionItems'
import styles from './page.module.css'

// Rebuilt in the background at most every 5 minutes, so new articles show up without a deploy
export const revalidate = 300

// Each kind of note has its own format, so the page changes as you scroll
const GROUPS = [
  { type: 'guide', format: 'grid' },
  { type: 'selection', format: 'row' },
  { type: 'season', format: 'index' },
  { type: 'experience', format: 'grid' },
] as const

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale).notes
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: alternatesMetadata(staticAlternates('notes'), locale),
    openGraph: { title: t.metaTitle, description: t.metaDescription },
  }
}

export default async function NotesPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale).notes
  const payload = await getPayload({ config })

  const { docs: articles } = await payload.find({
    collection: 'articles',
    locale,
    where: PUBLISHED,
    sort: '-createdAt',
    depth: 1,
    limit: 200,
  })

  // The newest note opens the page on the band; it is not repeated below
  const latest: any = articles.find((article: any) => article.heroImage?.url && article.slug)
  const rest = articles.filter((article) => article.id !== latest?.id)
  const groups = GROUPS.map((group) => ({ ...group, items: rest.filter((article: any) => article.type === group.type) })).filter(
    (group) => group.items.length > 0,
  )

  return (
    <main className={styles.page} data-solid-header>
      {/* No cover photo: the section opens with its name, like a magazine's contents page */}
      <header className={styles.head}>
        <h1 className={styles.title}>{t.title}</h1>
        <p className={styles.intro}>{t.intro}</p>
      </header>

      {latest && (
        <NoteBand
          href={localePath(locale, latest.slug)}
          image={latest.heroImage.url}
          alt={latest.heroImage.alt || latest.title}
          label={t.latest}
          title={latest.title}
          text={latest.tagline}
          readLabel={t.read}
        />
      )}

      {groups.map((group, index) => {
        const last = index === groups.length - 1
        const head = <SectionHead title={t.groups[group.type] || group.type} line={t.groupIntros[group.type]} />
        if (group.format === 'row') {
          return (
            <Section key={group.type} id={group.type} bleed last={last}>
              {head}
              <SlideRow items={toSectionItems(group.items, locale, () => undefined)} variant="wide" />
            </Section>
          )
        }
        if (group.format === 'index') {
          return (
            <Section key={group.type} id={group.type} last={last}>
              {head}
              <TextIndex
                entries={group.items.map((article: any) => ({
                  id: String(article.id),
                  href: localePath(locale, article.slug),
                  title: article.title,
                  text: article.tagline,
                }))}
              />
            </Section>
          )
        }
        return (
          <Section key={group.type} id={group.type} last={last}>
            {head}
            <CardGrid items={toSectionItems(group.items, locale, () => undefined)} variant="places" />
          </Section>
        )
      })}
    </main>
  )
}
