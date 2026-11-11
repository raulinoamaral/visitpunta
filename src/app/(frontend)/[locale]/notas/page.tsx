import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import ArticleCard2 from '@/components/ArticleCard2'
import Reveal from '@/components/Reveal'
import { isLocale, localePath } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { alternatesMetadata, staticAlternates } from '@/lib/alternates'
import { PUBLISHED } from '@/lib/published'
import styles from './page.module.css'

// Rebuilt in the background at most every 5 minutes, so new articles show up without a deploy
export const revalidate = 300

const GROUP_ORDER = ['guide', 'selection', 'season', 'experience']

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

  const groups = GROUP_ORDER.map((type) => ({
    type,
    items: articles.filter((a: any) => a.type === type),
  })).filter((group) => group.items.length > 0)

  return (
    <main className={styles.page}>
      {/* No cover photo: the section opens with its name, like a magazine's contents page */}
      <header className={styles.head}>
        <h1 className={styles.title}>{t.title}</h1>
        <p className={styles.intro}>{t.intro}</p>
      </header>

      {groups.map((group) => (
        <Reveal key={group.type}>
          <section className={styles.group}>
            <div className={styles.groupHead}>
              <h2 className={styles.groupTitle}>{t.groups[group.type] || group.type}</h2>
              {t.groupIntros[group.type] && <p className={styles.groupIntro}>{t.groupIntros[group.type]}</p>}
            </div>
            <div className={styles.grid}>
              {group.items.map((article: any) => (
                <ArticleCard2
                  key={article.id}
                  title={article.title}
                  href={localePath(locale, article.slug)}
                  tagline={article.tagline}
                  image={(article.heroImage as any)?.url}
                />
              ))}
            </div>
          </section>
        </Reveal>
      ))}
    </main>
  )
}
