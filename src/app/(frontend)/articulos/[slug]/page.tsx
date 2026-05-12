import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { RichText } from '@payloadcms/richtext-lexical/react'
import config from '@payload-config'
import PageHero from '@/components/PageHero'
import styles from './page.module.css'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'articles',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })
  const article = docs[0]
  if (!article) return {}
  return {
    title: `${article.seoTitle || article.title} — Visit Punta`,
    description: article.seoDescription || article.excerpt || '',
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'articles',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })

  const article = docs[0]
  if (!article) notFound()

  const heroUrl = (article.heroImage as any)?.url as string | undefined

  return (
    <main>
      {heroUrl && <PageHero image={heroUrl} title="" />}

      <article className={styles.article}>
        <header className={styles.header}>
          <h1 className={styles.title}>{article.title}</h1>
          {article.excerpt && <p className={styles.excerpt}>{article.excerpt}</p>}
        </header>

        {article.content && (
          <div className={styles.content}>
            <RichText data={article.content} />
          </div>
        )}
      </article>
    </main>
  )
}
