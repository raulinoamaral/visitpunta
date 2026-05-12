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
    description: article.seoDescription || article.tagline || '',
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
          {article.tagline && <p className={styles.excerpt}>{article.tagline}</p>}
        </header>

        {article.layout && (
          <div className={styles.content}>
            {(article.layout as any[]).map((block: any) => {
              if (block.blockType === 'textBlock') {
                return <RichText key={block.id} data={block.content} />
              }
              return null
            })}
          </div>
        )}
      </article>
    </main>
  )
}
